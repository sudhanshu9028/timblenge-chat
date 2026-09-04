// IndexNow — tell Bing (and every other participating engine) the moment a
// page changes, instead of waiting for a crawl.
//
// This matters more than it looks. Roughly 87% of what ChatGPT cites overlaps
// the Bing index, so a post Bing hasn't read yet is a post the assistant your
// audience is increasingly asking cannot quote. Crawl latency is the gap
// between publishing and being citable.
//
// The URL list comes from our own sitemap rather than from blogRegistry,
// because blogRegistry uses webpack's require.context and can't be imported by
// this plain-Node server. Reading the sitemap is also strictly better: it is
// exactly what search engines see, so the two can never disagree.

const fs = require('fs');
const path = require('path');

const ENDPOINT = 'https://api.indexnow.org/indexnow';
const DATA_DIR = path.join(process.cwd(), 'data');
const STATE_FILE = path.join(DATA_DIR, 'indexnow-state.json');

// The protocol caps a submission at 10,000 URLs.
const MAX_URLS_PER_REQUEST = 10000;

/** The key, or null when IndexNow isn't configured. */
function getKey() {
  const key = process.env.INDEXNOW_KEY;
  if (!key) return null;
  // Spec: 8–128 chars, letters, digits and dashes only.
  if (!/^[A-Za-z0-9-]{8,128}$/.test(key)) {
    console.error('[indexnow] INDEXNOW_KEY is set but malformed — must be 8-128 of [A-Za-z0-9-]');
    return null;
  }
  return key;
}

function loadState(key) {
  try {
    const parsed = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
    if (!parsed?.submitted || typeof parsed.submitted !== 'object') return { submitted: {}, key };
    // A rotated key means everything recorded under the old one has to go
    // again: if the key was rotated because it was rejected, those URLs were
    // never actually indexed, however successful the submission looked.
    if (parsed.key !== key) return { submitted: {}, key };
    return parsed;
  } catch {
    // First run, or an unreadable file. Starting empty just means the next
    // submission covers everything, which is the safe direction to fail.
    return { submitted: {}, key };
  }
}

function saveState(state) {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const tmp = `${STATE_FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify({ ...state, lastRunAt: new Date().toISOString() }));
    fs.renameSync(tmp, STATE_FILE);
  } catch (error) {
    console.error('[indexnow] could not persist state:', error.message);
  }
}

/**
 * Pull <loc> and <lastmod> out of a sitemap.
 * Deliberately a regex rather than an XML dependency — the file is one we
 * generate ourselves, in a shape we control.
 */
function parseSitemap(xml) {
  const entries = [];
  const blocks = xml.match(/<url>[\s\S]*?<\/url>/g) || [];

  for (const block of blocks) {
    const loc = block.match(/<loc>([\s\S]*?)<\/loc>/)?.[1]?.trim();
    if (!loc) continue;
    const lastmod = block.match(/<lastmod>([\s\S]*?)<\/lastmod>/)?.[1]?.trim() || '';
    entries.push({ url: loc, lastmod });
  }

  return entries;
}

async function postBatch({ host, key, keyLocation, urlList }) {
  const response = await fetch(ENDPOINT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host, key, keyLocation, urlList }),
  });

  return response.status;
}

/**
 * Submit every URL whose lastmod changed since we last told IndexNow about it.
 *
 * @param {object}  options
 * @param {string}  options.siteUrl    public origin, e.g. https://anoniz.com
 * @param {string} [options.sitemapUrl] where to read the sitemap from — defaults
 *                                      to siteUrl, but the server passes its own
 *                                      localhost address so boot doesn't depend
 *                                      on external DNS
 * @param {boolean}[options.force]     resubmit everything, ignoring state
 * @param {boolean}[options.dryRun]    report what would be sent, send nothing
 */
async function submitChangedUrls({ siteUrl, sitemapUrl, force = false, dryRun = false } = {}) {
  const key = getKey();
  if (!key) {
    return { status: 'skipped', reason: 'no INDEXNOW_KEY configured' };
  }

  let host;
  try {
    host = new URL(siteUrl).host;
  } catch {
    return { status: 'skipped', reason: `invalid siteUrl: ${siteUrl}` };
  }

  // Submitting localhost would just earn a 422 — the URLs don't belong to a
  // host IndexNow can verify. A dry run sends nothing, so it's allowed through:
  // previewing against a local server is the main reason to use it.
  if (!dryRun && /^(localhost|127\.|0\.0\.0\.0|\[::1\])/.test(host)) {
    return { status: 'skipped', reason: 'refusing to submit a local host' };
  }

  let entries;
  try {
    const res = await fetch(`${sitemapUrl || siteUrl}/sitemap.xml`);
    if (!res.ok) throw new Error(`sitemap responded ${res.status}`);
    entries = parseSitemap(await res.text());
  } catch (error) {
    return { status: 'error', reason: `could not read sitemap: ${error.message}` };
  }

  if (!entries.length) {
    return { status: 'error', reason: 'sitemap contained no URLs' };
  }

  const state = loadState(key);
  const changed = force ? entries : entries.filter((e) => state.submitted[e.url] !== e.lastmod);

  if (!changed.length) {
    return { status: 'noop', total: entries.length, submitted: 0 };
  }

  if (dryRun) {
    return {
      status: 'dry-run',
      total: entries.length,
      submitted: changed.length,
      urls: changed.map((e) => e.url),
    };
  }

  const keyLocation = `${siteUrl}/${key}.txt`;
  let lastCode = null;

  // IndexNow answers 202 ("validation pending") whether or not the key file
  // exists, then quietly drops the submission if it can't fetch it. Checking
  // first turns a silent failure into a message that says what's wrong.
  try {
    const probe = await fetch(keyLocation);
    if (!probe.ok) {
      return {
        status: 'skipped',
        reason: `key file not reachable at ${keyLocation} (HTTP ${probe.status}) — deploy first`,
      };
    }
    if ((await probe.text()).trim() !== key) {
      return {
        status: 'skipped',
        reason: `key file at ${keyLocation} does not match INDEXNOW_KEY`,
      };
    }
  } catch (error) {
    return { status: 'skipped', reason: `could not reach ${keyLocation}: ${error.message}` };
  }

  // The sitemap is read locally, so it describes the build we're running — not
  // necessarily what's deployed. Running a production build on a dev machine
  // would otherwise submit URLs that 404 publicly AND record them as done, so
  // the real deploy would never submit them. Confirm each one resolves first.
  const checked = await Promise.all(
    changed.map(async (entry) => {
      try {
        const res = await fetch(entry.url, { method: 'HEAD', redirect: 'follow' });
        return { entry, live: res.ok };
      } catch {
        // A network blip shouldn't drop a real URL — retry it next run instead.
        return { entry, live: false };
      }
    })
  );

  const liveEntries = checked.filter((c) => c.live).map((c) => c.entry);
  const missing = checked.length - liveEntries.length;

  if (!liveEntries.length) {
    return { status: 'skipped', reason: `none of the ${changed.length} changed URLs resolve yet` };
  }

  let sent = 0;

  for (let i = 0; i < liveEntries.length; i += MAX_URLS_PER_REQUEST) {
    const batch = liveEntries.slice(i, i + MAX_URLS_PER_REQUEST);

    let code;
    try {
      code = await postBatch({ host, key, keyLocation, urlList: batch.map((e) => e.url) });
    } catch (error) {
      return { status: 'error', reason: `request failed: ${error.message}`, submitted: sent };
    }

    lastCode = code;

    // 200 = accepted, 202 = accepted but the key is still being validated.
    if (code !== 200 && code !== 202) {
      const reasons = {
        400: 'bad request format',
        403: 'key not valid — check the key file is reachable at keyLocation',
        422: 'URLs do not belong to this host, or the key does not match',
        429: 'rate limited — too many submissions',
      };
      // State is left untouched so the next run retries these URLs.
      return {
        status: 'error',
        code,
        reason: reasons[code] || `unexpected status ${code}`,
        submitted: sent,
      };
    }

    // Only record what the endpoint actually accepted.
    for (const entry of batch) state.submitted[entry.url] = entry.lastmod;
    sent += batch.length;
  }

  // Drop URLs that have left the sitemap, so the file can't grow forever.
  const live = new Set(entries.map((e) => e.url));
  for (const url of Object.keys(state.submitted)) {
    if (!live.has(url)) delete state.submitted[url];
  }

  saveState(state);

  return { status: 'ok', total: entries.length, submitted: sent, skipped: missing, code: lastCode };
}

module.exports = { submitChangedUrls, getKey, parseSitemap };
