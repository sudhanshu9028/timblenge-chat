// Web push subscriptions and the rules for when we're allowed to use them.
//
// Everything else on this server is in-memory and disposable. Subscriptions
// are not: losing them on a restart means silently losing the only channel
// that can bring an anonymous visitor back, so they persist to disk.
//
// The sending rules matter as much as the plumbing. Notifying people every
// time the site gets busy is the fastest way to get unsubscribed, so there is
// a hard one-per-day cap and a quiet-hours window in the subscriber's own
// timezone.

const fs = require('fs');
const path = require('path');
const webpush = require('web-push');

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'push-subscriptions.json');

const WRITE_DEBOUNCE_MS = 3000;
const MIN_GAP_MS = 24 * 60 * 60 * 1000; // at most one push per subscriber per day
const QUIET_START_HOUR = 0; // local to the subscriber
const QUIET_END_HOUR = 8;

// endpoint -> { subscription, tzOffset, createdAt, lastSentAt }
let subscriptions = new Map();
let writeTimer = null;
let configured = false;

function configure() {
  const publicKey = process.env.VAPID_PUBLIC_KEY || process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;
  const subject = process.env.VAPID_SUBJECT || 'mailto:support@anoniz.com';

  if (!publicKey || !privateKey) {
    console.warn(
      '[push] VAPID keys missing — push is disabled. Run: npx web-push generate-vapid-keys'
    );
    return false;
  }

  webpush.setVapidDetails(subject, publicKey, privateKey);
  return true;
}

function load() {
  try {
    const raw = JSON.parse(fs.readFileSync(FILE, 'utf8'));
    if (Array.isArray(raw?.subscriptions)) {
      return new Map(raw.subscriptions.map((s) => [s.subscription.endpoint, s]));
    }
  } catch {
    // First boot, or an unreadable file — start empty rather than crash.
  }
  return new Map();
}

function persist() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const payload = {
      updatedAt: new Date().toISOString(),
      subscriptions: Array.from(subscriptions.values()),
    };
    const tmp = `${FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(payload));
    fs.renameSync(tmp, FILE);
  } catch (error) {
    console.error('[push] write failed:', error.message);
  }
}

function scheduleWrite() {
  if (writeTimer) return;
  writeTimer = setTimeout(() => {
    writeTimer = null;
    persist();
  }, WRITE_DEBOUNCE_MS);
}

function initPushStore() {
  configured = configure();
  subscriptions = load();
  process.on('SIGTERM', persist);
  process.on('SIGINT', persist);
  return configured;
}

function isEnabled() {
  return configured;
}

function addSubscription(subscription, tzOffset) {
  if (!subscription?.endpoint) return false;
  const existing = subscriptions.get(subscription.endpoint);
  subscriptions.set(subscription.endpoint, {
    subscription,
    // Minutes behind UTC, as returned by Date.prototype.getTimezoneOffset().
    tzOffset: Number.isFinite(tzOffset) ? tzOffset : 0,
    createdAt: existing?.createdAt || Date.now(),
    // Re-subscribing must not reset the rate limit.
    lastSentAt: existing?.lastSentAt || 0,
  });
  scheduleWrite();
  return true;
}

function removeSubscription(endpoint) {
  const removed = subscriptions.delete(endpoint);
  if (removed) scheduleWrite();
  return removed;
}

function count() {
  return subscriptions.size;
}

/** Is it a civilised hour where this subscriber is? */
function isQuietHours(record, now = Date.now()) {
  const localHour = new Date(now - record.tzOffset * 60 * 1000).getUTCHours();
  return localHour >= QUIET_START_HOUR && localHour < QUIET_END_HOUR;
}

function isEligible(record, now = Date.now()) {
  if (now - (record.lastSentAt || 0) < MIN_GAP_MS) return false;
  if (isQuietHours(record, now)) return false;
  return true;
}

/**
 * Send to everyone eligible right now.
 *
 * @param {{title: string, body: string, tag?: string, url?: string}} payload
 * @returns {Promise<{sent: number, skipped: number, pruned: number}>}
 */
async function broadcast(payload) {
  if (!configured) return { sent: 0, skipped: 0, pruned: 0 };

  const now = Date.now();
  const body = JSON.stringify(payload);
  let sent = 0;
  let skipped = 0;
  let pruned = 0;

  const targets = Array.from(subscriptions.values()).filter((record) => {
    if (isEligible(record, now)) return true;
    skipped += 1;
    return false;
  });

  await Promise.all(
    targets.map(async (record) => {
      try {
        await webpush.sendNotification(record.subscription, body);
        record.lastSentAt = now;
        sent += 1;
      } catch (error) {
        // 404/410 mean the browser threw the subscription away. Keeping dead
        // endpoints forever would slow every later send down.
        if (error.statusCode === 404 || error.statusCode === 410) {
          subscriptions.delete(record.subscription.endpoint);
          pruned += 1;
        } else {
          console.error('[push] send failed:', error.statusCode || error.message);
        }
      }
    })
  );

  if (sent || pruned) scheduleWrite();
  return { sent, skipped, pruned };
}

module.exports = {
  initPushStore,
  isEnabled,
  addSubscription,
  removeSubscription,
  broadcast,
  count,
};
