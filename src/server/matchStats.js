// How often a search actually ends with a person on the other end.
//
// The question this answers: when someone presses Start, do they meet a
// stranger, get the AI, or give up waiting — and how long does it take? With
// traffic spread thin across the day, that ratio is the product.
//
// Every search ends in exactly one of three outcomes, counted per hour and
// per mode:
//   human_matches  paired with a real person (wait time recorded)
//   ai_matches     the fallback timer fired and the AI took over (text only)
//   abandoned      they left or closed the tab while still waiting
// plus ai_upgrades, when someone already talking to the AI is moved over to a
// newly arrived person.
//
// Conversations between two people are measured when they end: how long they
// lasted, and whether both sides said anything.
//
// Only counts are kept. Socket ids live in memory for the length of a search
// or a conversation and are never written anywhere.

const db = require('./db');

const FLUSH_MS = 60 * 1000;
const LONG_CHAT_SECONDS = 120;

const COUNTERS = [
  'searches',
  'human_matches',
  'ai_matches',
  'ai_upgrades',
  'abandoned',
  'wait_ms_sum',
  'chats_ended',
  'chat_seconds_sum',
  'chats_over_2min',
  'chats_both_talked',
];

const searchStarts = new Map(); // socketId -> { mode, at }
const conversations = new Map(); // socketId -> shared { mode, at, said: Set }
let pending = new Map(); // `${hourIso}|${mode}` -> counters

function hourKey(at) {
  const d = new Date(at);
  d.setUTCMinutes(0, 0, 0);
  return d.toISOString();
}

function bump(mode, at, field, amount = 1) {
  const key = `${hourKey(at)}|${mode}`;
  let row = pending.get(key);
  if (!row) {
    row = Object.fromEntries(COUNTERS.map((c) => [c, 0]));
    row.wait_ms_max = 0;
    pending.set(key, row);
  }
  if (field === 'wait_ms_max') row.wait_ms_max = Math.max(row.wait_ms_max, amount);
  else row[field] += amount;
}

/** A search began. A search already in progress keeps its original start. */
function searchStarted(socketId, mode) {
  if (searchStarts.has(socketId)) return;
  const at = Date.now();
  searchStarts.set(socketId, { mode, at });
  bump(mode, at, 'searches');
}

function endSearch(socketId) {
  const start = searchStarts.get(socketId);
  searchStarts.delete(socketId);
  return start;
}

/**
 * Two people were paired. Either side may have no search in progress — a
 * reconnect, or someone pulled out of an AI chat — and only open searches
 * are counted as matches.
 */
function paired(socketId, peerId, { mode, peerWasWithAi = false } = {}) {
  const now = Date.now();
  for (const id of [socketId, peerId]) {
    const start = endSearch(id);
    if (!start) continue;
    const wait = now - start.at;
    bump(start.mode, now, 'human_matches');
    bump(start.mode, now, 'wait_ms_sum', wait);
    bump(start.mode, now, 'wait_ms_max', wait);
  }
  if (peerWasWithAi) bump(mode, now, 'ai_upgrades');

  const conversation = { mode, at: now, said: new Set() };
  conversations.set(socketId, conversation);
  conversations.set(peerId, conversation);
}

/** The AI fallback fired for this search. */
function matchedWithAi(socketId) {
  const start = endSearch(socketId);
  if (start) bump(start.mode, Date.now(), 'ai_matches');
}

/** Someone sent a message in a conversation with a person. */
function messageSent(socketId) {
  conversations.get(socketId)?.said.add(socketId);
}

/** A conversation between two people ended, from either side. */
function conversationEnded(socketId) {
  const conversation = conversations.get(socketId);
  if (!conversation) return;
  for (const [id, value] of conversations) {
    if (value === conversation) conversations.delete(id);
  }
  const now = Date.now();
  const seconds = Math.round((now - conversation.at) / 1000);
  bump(conversation.mode, now, 'chats_ended');
  bump(conversation.mode, now, 'chat_seconds_sum', seconds);
  if (seconds >= LONG_CHAT_SECONDS) bump(conversation.mode, now, 'chats_over_2min');
  if (conversation.said.size >= 2) bump(conversation.mode, now, 'chats_both_talked');
}

/** They left, or closed the tab. Ends whatever they were doing. */
function left(socketId) {
  const start = endSearch(socketId);
  if (start) bump(start.mode, Date.now(), 'abandoned');
  conversationEnded(socketId);
}

async function flush() {
  if (pending.size === 0) return;
  const client = await db.ready();
  if (!client) {
    // Without a database there is nowhere durable to put these; drop them
    // rather than let the map grow for the life of the process.
    pending = new Map();
    return;
  }
  const batch = pending;
  pending = new Map();
  try {
    for (const [key, row] of batch) {
      const [hourStart, mode] = key.split('|');
      await client`
        insert into match_stats ${client({ hour_start: hourStart, mode, ...row })}
        on conflict (hour_start, mode) do update set
          searches = match_stats.searches + excluded.searches,
          human_matches = match_stats.human_matches + excluded.human_matches,
          ai_matches = match_stats.ai_matches + excluded.ai_matches,
          ai_upgrades = match_stats.ai_upgrades + excluded.ai_upgrades,
          abandoned = match_stats.abandoned + excluded.abandoned,
          wait_ms_sum = match_stats.wait_ms_sum + excluded.wait_ms_sum,
          wait_ms_max = greatest(match_stats.wait_ms_max, excluded.wait_ms_max),
          chats_ended = match_stats.chats_ended + excluded.chats_ended,
          chat_seconds_sum = match_stats.chat_seconds_sum + excluded.chat_seconds_sum,
          chats_over_2min = match_stats.chats_over_2min + excluded.chats_over_2min,
          chats_both_talked = match_stats.chats_both_talked + excluded.chats_both_talked
      `;
    }
  } catch (error) {
    console.error('[match-stats] write failed, will retry:', error.message);
    // Put the batch back so the next flush retries it.
    for (const [key, row] of batch) {
      const current = pending.get(key);
      if (!current) {
        pending.set(key, row);
        continue;
      }
      for (const c of COUNTERS) current[c] += row[c];
      current.wait_ms_max = Math.max(current.wait_ms_max, row.wait_ms_max);
    }
  }
}

function startMatchStats() {
  db.ready();
  setInterval(flush, FLUSH_MS).unref();
  // Don't lose the last minute on a deploy.
  process.on('SIGTERM', flush);
}

/**
 * Daily totals per mode for the last `days` days (UTC), plus the derived
 * rates. Returns null without a database.
 */
async function getMatchStats(days = 7) {
  const client = await db.ready();
  if (!client) return null;
  await flush();
  const span = Math.min(Math.max(parseInt(days, 10) || 7, 1), 90);
  const rows = await client`
    select date_trunc('day', hour_start) as day, mode,
      sum(searches)::int as searches,
      sum(human_matches)::int as human_matches,
      sum(ai_matches)::int as ai_matches,
      sum(ai_upgrades)::int as ai_upgrades,
      sum(abandoned)::int as abandoned,
      sum(wait_ms_sum)::bigint as wait_ms_sum,
      max(wait_ms_max)::int as wait_ms_max,
      sum(chats_ended)::int as chats_ended,
      sum(chat_seconds_sum)::bigint as chat_seconds_sum,
      sum(chats_over_2min)::int as chats_over_2min,
      sum(chats_both_talked)::int as chats_both_talked
    from match_stats
    where hour_start >= date_trunc('day', now()) - make_interval(days => ${span - 1}::int)
    group by 1, 2
    order by 1 desc, 2
  `;
  const pct = (part, whole) => (whole ? Math.round((1000 * part) / whole) / 10 : null);
  return rows.map((r) => {
    const ended = r.human_matches + r.ai_matches + r.abandoned;
    return {
      day: r.day.toISOString().slice(0, 10),
      mode: r.mode,
      searches: r.searches,
      humanMatches: r.human_matches,
      aiMatches: r.ai_matches,
      abandoned: r.abandoned,
      aiUpgrades: r.ai_upgrades,
      humanMatchRatePct: pct(r.human_matches, ended),
      avgWaitSeconds: r.human_matches
        ? Math.round(Number(r.wait_ms_sum) / r.human_matches / 100) / 10
        : null,
      maxWaitSeconds: Math.round(r.wait_ms_max / 1000),
      chatsEnded: r.chats_ended,
      avgChatSeconds: r.chats_ended ? Math.round(Number(r.chat_seconds_sum) / r.chats_ended) : null,
      chatsOver2MinPct: pct(r.chats_over_2min, r.chats_ended),
      bothTalkedPct: r.mode === 'text' ? pct(r.chats_both_talked, r.chats_ended) : null,
    };
  });
}

module.exports = {
  startMatchStats,
  searchStarted,
  paired,
  matchedWithAi,
  messageSent,
  conversationEnded,
  left,
  getMatchStats,
  flush,
};
