/**
 * Prime Time — one advertised hour a day when everyone is asked to show up.
 *
 * A real-time product with modest traffic spread over 24 hours feels dead at
 * every single hour. The same traffic concentrated into one hour feels busy.
 * This is the cheapest liquidity tool available and it costs nothing to run.
 *
 * The hour below is a researched starting point, NOT measured fact: India's
 * social peak runs 8–10 PM and chat behaviour skews later than feed scrolling,
 * and 16:30 UTC also lands at 12:30 PM ET / 5:30 PM UK for secondary overlap.
 *
 * The server samples real concurrency into data/presence-stats.json (see
 * src/server/presenceStats.js). After ~2 weeks, read the true peak off
 * GET /api/presence-stats and move the window to match — set both
 * NEXT_PUBLIC_PRIME_TIME_START_UTC_MINUTES and PRIME_TIME_START_UTC_MINUTES
 * (the server reads the latter for its reminder push) and nothing else needs
 * to change.
 */

// 22:00 IST == 16:30 UTC. IST is UTC+5:30.
const DEFAULT_START_UTC_MINUTES = 16 * 60 + 30;

export const START_UTC_MINUTES =
  parseInt(process.env.NEXT_PUBLIC_PRIME_TIME_START_UTC_MINUTES, 10) || DEFAULT_START_UTC_MINUTES;
export const DURATION_MINUTES = 60;

// How far out the banner switches from a static line to a live countdown.
export const COUNTDOWN_WINDOW_MINUTES = 3 * 60;

/**
 * Human-readable label for the slot in its anchor timezone (IST, UTC+5:30).
 * Derived rather than hardcoded so it can't drift from the window above.
 */
export const PRIME_TIME_LABEL = (() => {
  const istMinutes = (START_UTC_MINUTES + 5 * 60 + 30) % (24 * 60);
  const hour24 = Math.floor(istMinutes / 60);
  const minute = istMinutes % 60;
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  const suffix = hour24 < 12 ? 'AM' : 'PM';
  return minute === 0
    ? `${hour12} ${suffix} IST`
    : `${hour12}:${String(minute).padStart(2, '0')} ${suffix} IST`;
})();

const DAY_MINUTES = 24 * 60;

function minutesUtcNow(now = new Date()) {
  return now.getUTCHours() * 60 + now.getUTCMinutes();
}

/**
 * Where we are relative to today's window.
 *
 * @returns {{ status: 'live'|'soon'|'later', minutesUntil: number, minutesLeft: number }}
 */
export function getPrimeTimeState(now = new Date()) {
  const nowMin = minutesUtcNow(now);
  const start = START_UTC_MINUTES;
  const end = start + DURATION_MINUTES;

  if (nowMin >= start && nowMin < end) {
    return { status: 'live', minutesUntil: 0, minutesLeft: end - nowMin };
  }

  // Wrap to tomorrow's window once today's has passed.
  const minutesUntil = nowMin < start ? start - nowMin : DAY_MINUTES - nowMin + start;

  return {
    status: minutesUntil <= COUNTDOWN_WINDOW_MINUTES ? 'soon' : 'later',
    minutesUntil,
    minutesLeft: 0,
  };
}

/** "2h 14m" / "14m" */
export function formatCountdown(minutes) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

/**
 * The window's start in the viewer's own timezone, e.g. "6:30 PM".
 * A time the reader has to convert themselves creates no urgency.
 */
export function getLocalStartLabel(now = new Date()) {
  const start = new Date(now);
  start.setUTCHours(Math.floor(START_UTC_MINUTES / 60), START_UTC_MINUTES % 60, 0, 0);
  return start.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
}
