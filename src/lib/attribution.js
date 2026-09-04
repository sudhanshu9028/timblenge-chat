/**
 * Where this visitor came from.
 *
 * GA4's default channel grouping flattens everything from Reddit into one
 * "Social" bucket, which can't tell you *which* subreddit or which video sent
 * the traffic. We capture the referrer host and UTM tags once on the first
 * pageview of the session and replay them on every event instead.
 */

const KEY = 'anoniz_attribution_v1';

const EMPTY = {};

function read() {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // Private mode and blocked-storage browsers throw on access. Attribution
    // is a nice-to-have; never let it break a page.
    return null;
  }
}

/**
 * Capture attribution if we haven't already this session.
 * Safe to call on every mount — only the first call in a session stores.
 *
 * @returns {object} the stored attribution (possibly empty)
 */
export function captureAttribution() {
  if (typeof window === 'undefined') return EMPTY;

  const existing = read();
  if (existing) return existing;

  const data = {};

  try {
    const params = new URLSearchParams(window.location.search);
    // Short keys: GA4 event parameter names are capped at 40 chars and the
    // per-event parameter budget is tight once automatic ones are counted.
    const utm = {
      src: params.get('utm_source'),
      medium: params.get('utm_medium'),
      campaign: params.get('utm_campaign'),
      content: params.get('utm_content'),
    };
    for (const [key, value] of Object.entries(utm)) {
      if (value) data[key] = value.slice(0, 100);
    }

    if (document.referrer) {
      const host = new URL(document.referrer).hostname;
      // Internal navigation isn't a traffic source.
      if (host && host !== window.location.hostname) {
        data.ref_host = host;
      }
    }

    data.landing = window.location.pathname.slice(0, 100);
  } catch {
    // A malformed referrer or URL shouldn't cost us the rest of the data.
  }

  try {
    sessionStorage.setItem(KEY, JSON.stringify(data));
  } catch {
    // Nothing to do — we just won't have attribution on later events.
  }

  return data;
}

/** Read the attribution captured earlier this session. */
export function getAttribution() {
  if (typeof window === 'undefined') return EMPTY;
  return read() || EMPTY;
}
