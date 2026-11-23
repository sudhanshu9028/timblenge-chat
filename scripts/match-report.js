// Prints the daily match stats from the database.
//
//   yarn match-report        last 7 days
//   yarn match-report 28     last 28 days
//
// Reads DATABASE_URL from .env.local. The same numbers are served by
// GET /api/match-stats?days=7&token=STATS_TOKEN on the live site.

const { getMatchStats } = require('../src/server/matchStats');

(async () => {
  const days = await getMatchStats(process.argv[2] || 7);
  if (!days) {
    console.error('No database: add DATABASE_URL to .env.local');
    process.exit(1);
  }
  if (!days.length) console.info('No searches recorded yet.');
  // eslint-disable-next-line no-console -- a terminal report, the table is the point
  else console.table(days);
  process.exit(0);
})().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
