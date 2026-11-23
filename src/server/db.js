// Postgres, for the few things that have to outlive a restart.
//
// Render's filesystem is wiped whenever the instance restarts, which happens on
// every deploy and on Render's own schedule besides. The JSON files the server
// used to write into data/ therefore lasted about a day: push subscriptions
// vanished, and the presence history never got old enough to answer the
// question it was collected for.
//
// DATABASE_URL is optional. Without it (local dev, or before the database is
// set up) everything falls back to the old file behaviour, so nothing here can
// stop the chat server from starting.
//
// On Render, use Supabase's *pooler* connection string, not the direct one:
// the direct host is IPv6-only and Render can't reach it.

const postgres = require('postgres');

let sql = null;
let readyPromise = null;

function getSql() {
  const url = process.env.DATABASE_URL;
  if (!url) return null;
  if (!sql) {
    const local = /@(localhost|127\.0\.0\.1)[:/]/.test(url);
    sql = postgres(url, {
      // Supabase's transaction pooler doesn't support prepared statements.
      prepare: false,
      max: parseInt(process.env.DATABASE_POOL_MAX, 10) || 3,
      idle_timeout: 30,
      connect_timeout: 10,
      ssl: local ? false : 'require',
      onnotice: () => {},
    });
  }
  return sql;
}

const SCHEMA = [
  // One row per hour and chat mode. Counts only: nothing here can be tied to
  // a person or a conversation.
  `create table if not exists match_stats (
    hour_start timestamptz not null,
    mode text not null,
    searches integer not null default 0,
    human_matches integer not null default 0,
    ai_matches integer not null default 0,
    ai_upgrades integer not null default 0,
    abandoned integer not null default 0,
    wait_ms_sum bigint not null default 0,
    wait_ms_max integer not null default 0,
    chats_ended integer not null default 0,
    chat_seconds_sum bigint not null default 0,
    chats_over_2min integer not null default 0,
    chats_both_talked integer not null default 0,
    primary key (hour_start, mode)
  )`,
  `create table if not exists presence_hourly (
    hour_start timestamptz primary key,
    samples integer not null default 0,
    online_sum integer not null default 0,
    online_peak integer not null default 0
  )`,
  `create table if not exists push_subscriptions (
    endpoint text primary key,
    subscription jsonb not null,
    tz_offset integer not null default 0,
    created_at timestamptz not null default now(),
    last_sent_at timestamptz
  )`,
];

/**
 * Resolves to the client once the tables exist, or to null when there is no
 * database (or it couldn't be reached — logged, never thrown).
 */
function ready() {
  if (readyPromise) return readyPromise;
  const client = getSql();
  if (!client) {
    readyPromise = Promise.resolve(null);
    return readyPromise;
  }
  readyPromise = (async () => {
    try {
      for (const statement of SCHEMA) await client.unsafe(statement);
      console.info('[db] connected');
      return client;
    } catch (error) {
      console.error('[db] unavailable, falling back to local files:', error.message);
      return null;
    }
  })();
  return readyPromise;
}

module.exports = { ready };
