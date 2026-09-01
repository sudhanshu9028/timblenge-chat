// Records how busy the site actually is, hour by hour.
//
// The Prime Time slot in src/lib/primeTime.js is currently a researched guess.
// This turns it into a measured fact: sample concurrency on a fixed interval
// into a [dayOfWeek][hourUTC] histogram, and after a couple of weeks the real
// peak is simply the highest average in the table.
//
// Deliberately tiny: no database, no new dependency, and it reuses the
// presence figure the socket server already computes.

const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(process.cwd(), 'data');
const FILE = path.join(DATA_DIR, 'presence-stats.json');

const SAMPLE_INTERVAL_MS = 5 * 60 * 1000;
const WRITE_DEBOUNCE_MS = 30 * 1000;

// buckets[dayOfWeek][hourUTC] = { sum, count, peak }
let buckets = null;
let writeTimer = null;

function emptyBuckets() {
  return Array.from({ length: 7 }, () =>
    Array.from({ length: 24 }, () => ({ sum: 0, count: 0, peak: 0 }))
  );
}

function load() {
  try {
    const raw = fs.readFileSync(FILE, 'utf8');
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed?.buckets) && parsed.buckets.length === 7) {
      return parsed.buckets;
    }
  } catch {
    // No file yet, or it's unreadable — start fresh rather than crashing boot.
  }
  return emptyBuckets();
}

function persist() {
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    const payload = { updatedAt: new Date().toISOString(), buckets };
    // Write-then-rename so a crash mid-write can't leave a truncated file.
    const tmp = `${FILE}.tmp`;
    fs.writeFileSync(tmp, JSON.stringify(payload));
    fs.renameSync(tmp, FILE);
  } catch (error) {
    console.error('presence-stats write failed:', error.message);
  }
}

function scheduleWrite() {
  if (writeTimer) return;
  writeTimer = setTimeout(() => {
    writeTimer = null;
    persist();
  }, WRITE_DEBOUNCE_MS);
}

/**
 * Start sampling.
 * @param {() => number} getCount returns current concurrency
 */
function startPresenceStats(getCount) {
  buckets = load();

  setInterval(() => {
    const now = new Date();
    const bucket = buckets[now.getUTCDay()][now.getUTCHours()];
    const count = getCount();
    bucket.sum += count;
    bucket.count += 1;
    bucket.peak = Math.max(bucket.peak, count);
    scheduleWrite();
  }, SAMPLE_INTERVAL_MS);

  // Don't lose the current window on a deploy.
  process.on('SIGTERM', persist);
  process.on('SIGINT', persist);
}

/**
 * The histogram plus the peak hour it implies — this is what you read to
 * decide where Prime Time should actually sit.
 */
function getPresenceStats() {
  if (!buckets) return { samples: 0, hourlyAverage: [], peakHourUtc: null, byDay: [] };

  // Collapse the days into a single 24-hour profile; day-of-week detail stays
  // available in byDay for when there's enough data to justify looking.
  const hourly = Array.from({ length: 24 }, () => ({ sum: 0, count: 0, peak: 0 }));
  for (const day of buckets) {
    day.forEach((bucket, hour) => {
      hourly[hour].sum += bucket.sum;
      hourly[hour].count += bucket.count;
      hourly[hour].peak = Math.max(hourly[hour].peak, bucket.peak);
    });
  }

  const hourlyAverage = hourly.map((b, hour) => ({
    hourUtc: hour,
    average: b.count ? +(b.sum / b.count).toFixed(2) : 0,
    peak: b.peak,
    samples: b.count,
  }));

  const samples = hourlyAverage.reduce((n, h) => n + h.samples, 0);
  const best = hourlyAverage.reduce((a, b) => (b.average > a.average ? b : a), hourlyAverage[0]);

  return {
    samples,
    // Below roughly a week of samples the peak is noise, not signal.
    trustworthy: samples >= 2000,
    peakHourUtc: samples ? best.hourUtc : null,
    suggestedStartUtcMinutes: samples ? best.hourUtc * 60 : null,
    hourlyAverage,
    byDay: buckets,
  };
}

module.exports = { startPresenceStats, getPresenceStats };
