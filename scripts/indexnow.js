#!/usr/bin/env node
/* eslint-disable no-console */
//
// Manual IndexNow submission.
//
//   node scripts/indexnow.js              submit anything changed since last run
//   node scripts/indexnow.js --all        resubmit every URL (use once, on setup)
//   node scripts/indexnow.js --dry-run    show what would be sent
//   node scripts/indexnow.js --url=http://localhost:3000
//
// The server already submits changed URLs on boot in production. This is for
// the first full submission, and for pushing a change without a redeploy.

const path = require('path');

// The key lives in .env.local alongside everything else, and this script runs
// outside Next, so nothing has loaded it yet.
function loadEnvLocal() {
  const fs = require('fs');
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), '.env.local'), 'utf8');
    for (const line of raw.split('\n')) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (match && !process.env[match[1]]) process.env[match[1]] = match[2];
    }
  } catch {
    // No .env.local — env vars may still be set by the shell or the host.
  }
}

loadEnvLocal();

const { submitChangedUrls, getKey } = require('../src/server/indexNow');

async function main() {
  const args = process.argv.slice(2);
  const force = args.includes('--all');
  const dryRun = args.includes('--dry-run');
  const urlArg = args.find((a) => a.startsWith('--url='));
  const siteUrl = urlArg ? urlArg.split('=')[1] : process.env.SITE_URL || 'https://anoniz.com';

  const key = getKey();
  if (!key) {
    console.error('\nNo usable INDEXNOW_KEY.\n');
    console.error('Generate one and add it to .env.local:');
    console.error("  node -e \"console.log(require('crypto').randomBytes(16).toString('hex'))\"\n");
    process.exit(1);
  }

  console.log(`\nIndexNow → ${siteUrl}`);
  console.log(`Key file must be reachable at ${siteUrl}/${key}.txt\n`);

  const result = await submitChangedUrls({ siteUrl, force, dryRun });

  switch (result.status) {
    case 'ok':
      console.log(`Submitted ${result.submitted} of ${result.total} URLs.\n`);
      break;
    case 'noop':
      console.log(`Nothing changed — all ${result.total} URLs already submitted.`);
      console.log('Use --all to resubmit everything.\n');
      break;
    case 'dry-run':
      console.log(`Would submit ${result.submitted} of ${result.total} URLs:\n`);
      result.urls.forEach((u) => console.log(`  ${u}`));
      console.log();
      break;
    default:
      console.error(`${result.status}: ${result.reason}\n`);
      process.exit(1);
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
