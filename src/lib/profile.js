/**
 * A tiny local profile, kept on the visitor's own device.
 *
 * Anoniz has no accounts by design, which means it also has no memory of
 * anyone — every visit is a first visit. This gives the product a sense of
 * accumulated history ("you've talked to 14 strangers") without asking for an
 * email, and it never leaves the browser it was written in.
 *
 * Everything here is best-effort: private-mode browsers throw on localStorage
 * access, and a stats counter must never be the thing that breaks a chat.
 */

const KEY = 'anoniz_profile_v1';

const DEFAULTS = {
  strangersMet: 0,
  aiChats: 0,
  messagesSent: 0,
  gamesPlayed: 0,
  wyrRounds: 0,
  wyrAgreements: 0,
  riddlesSolved: 0,
  longestChatSec: 0,
  firstSeen: null,
  lastSeen: null,
};

/** Read the profile. Always returns a usable object. */
export function getProfile() {
  if (typeof window === 'undefined') return { ...DEFAULTS };
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    // Spread over the defaults so a profile written by an older build gains
    // any new counters instead of returning undefined for them.
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function write(profile) {
  try {
    localStorage.setItem(KEY, JSON.stringify(profile));
  } catch {
    // Storage blocked or full — carry on without persisting.
  }
}

/**
 * Apply a change and persist it.
 *
 * @param {(p: object) => object} updater receives the current profile
 * @returns {object} the updated profile
 */
export function updateProfile(updater) {
  const now = new Date().toISOString();
  const current = getProfile();
  const next = {
    ...current,
    ...updater(current),
    firstSeen: current.firstSeen || now,
    lastSeen: now,
  };
  write(next);
  return next;
}

/** Add to one or more counters. `bump({ strangersMet: 1 })` */
export function bump(deltas) {
  return updateProfile((p) =>
    Object.fromEntries(Object.entries(deltas).map(([k, v]) => [k, (p[k] || 0) + v]))
  );
}

/** Record a chat duration if it beats the previous best. */
export function recordChatDuration(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return;
  updateProfile((p) => ({
    longestChatSec: Math.max(p.longestChatSec || 0, Math.round(seconds)),
  }));
}

/**
 * One line summarising the profile, or null when there's nothing worth saying
 * yet. Callers render it only if it comes back non-null.
 */
export function getProfileSummary() {
  const p = getProfile();
  if (p.strangersMet < 2) return null;

  const parts = [`You've talked to ${p.strangersMet} strangers on Anoniz`];
  if (p.wyrRounds >= 3) {
    const pct = Math.round((p.wyrAgreements / p.wyrRounds) * 100);
    parts.push(`and agreed with them ${pct}% of the time`);
  } else if (p.riddlesSolved >= 3) {
    parts.push(`and solved ${p.riddlesSolved} riddles while waiting`);
  }
  return `${parts.join(' ')}.`;
}
