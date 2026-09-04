// Would You Rather — the question bank and pairing rules.
//
// The tier structure is the whole design, not decoration. Research on
// stranger conversation is consistent: deep prompts land badly with someone
// you just met, while playful ones lower defences first. So the game escalates
// — rounds 1–2 are light, 3–4 are about values, and 5+ are genuinely
// revealing. Depth is something the pair earns by staying.
//
// Every option is deliberately a real dilemma: if one side is obviously
// correct there's nothing to talk about, and the talking is the point.

const QUESTIONS = {
  // Tier 1 — playful. Safe to answer in the first thirty seconds.
  1: [
    ['Always be 10 minutes early', 'Always be 10 minutes late'],
    ['Never use headphones again', 'Never use a speaker again'],
    ['Have unlimited money but no free time', 'Unlimited free time but just enough money'],
    ['Only be able to whisper', 'Only be able to shout'],
    ['Live without music', 'Live without films'],
    ['Fight one horse-sized duck', 'Fight one hundred duck-sized horses'],
    ['Never be able to skip an ad again', 'Never be able to pause anything again'],
    ['Be famous for something embarrassing', 'Be completely unknown forever'],
    ['Always have a song stuck in your head', 'Always have a slightly wet sock'],
    ['Eat only sweet food forever', 'Eat only savoury food forever'],
    ['Never feel too hot again', 'Never feel too cold again'],
    ['Have a rewind button for your life', 'Have a pause button'],
    ['Be able to talk to animals', 'Be able to speak every human language'],
    ['Lose all your photos', 'Lose all your playlists'],
    ['Always know when someone is lying', 'Always get away with lying'],
    ['Have no phone for a week', 'Have no shoes for a week'],
    ['Live in a city that never sleeps', 'Live somewhere with no traffic at all'],
    ['Only be able to text', 'Only be able to call'],
    ['Be the funniest person in the room', 'Be the smartest person in the room'],
    ['Never have to sleep again', 'Never have to eat again'],
  ],

  // Tier 2 — preferences and values. You learn something real about them here.
  2: [
    ['Be deeply respected', 'Be widely liked'],
    ['Know exactly how you die', 'Know exactly when you die'],
    ['Have five close friends', 'Have fifty good ones'],
    ['Live somewhere beautiful and alone', 'Somewhere ordinary near people you love'],
    ['Be great at a job you hate', 'Be mediocre at a job you love'],
    ['Always say what you think', 'Never have to explain yourself'],
    ['Have your parents’ approval', 'Have your own'],
    ['Be the person who leaves', 'Be the person who is left'],
    ['Read minds but never turn it off', 'Never know what anyone thinks of you'],
    ['Have a life full of change', 'Have a life you can rely on'],
    ['Be remembered by many for a little', 'By a few for everything'],
    ['Give up your ambition', 'Give up your free time'],
    ['Never be lonely but never be alone', 'Be alone whenever you want but often lonely'],
    ['Always take the safe option', 'Always take the interesting one'],
    ['Have a hard truth told to you', 'Be protected from it'],
    ['Start over somewhere nobody knows you', 'Stay where everyone does'],
    ['Be underestimated', 'Be overestimated'],
    ['Have more time with someone you lost', 'Have peace about losing them'],
    ['Be right', 'Be kind'],
    ['Know your future', 'Change your past'],
  ],

  // Tier 3 — genuinely revealing. Only reached by a pair still talking.
  3: [
    ['Forgive someone who never apologised', 'Get an apology from someone you can’t forgive'],
    ['Know what people say about you', 'Never wonder again'],
    ['Relive your best day forever', 'Never think about it again'],
    ['Be the reason someone changed', 'Never know you were'],
    ['Have everyone see you exactly as you are', 'Keep one thing hidden forever'],
    ['Lose the memory of your worst year', 'Keep it and everything it taught you'],
    ['Be told the truth about how people see you', 'Be told a kind lie you believe'],
    ['Have a second chance with one person', 'Closure with all of them'],
    ['Be needed', 'Be wanted'],
    ['Never disappoint anyone again', 'Never be disappointed again'],
    ['Say the thing you never said', 'Hear the thing you never heard'],
    ['Live the life you planned', 'Live the one you got'],
    ['Be at peace with who you are', 'Become who you meant to be'],
    ['Have someone stay out of love', 'Have them leave out of honesty'],
    ['Know you did enough', 'Have people believe you did'],
    ['Meet the person you were at ten', 'Meet the person you’ll be at eighty'],
  ],
};

/** Which tier a round draws from. Depth escalates as the pair stays. */
function tierForRound(round) {
  if (round <= 2) return 1;
  if (round <= 4) return 2;
  return 3;
}

/**
 * Pick a question the pair hasn't seen.
 * @param {number} round 1-based
 * @param {string[]} askedKeys keys already used this session
 */
function pickQuestion(round, askedKeys = []) {
  const tier = tierForRound(round);
  const pool = QUESTIONS[tier]
    .map((options, i) => ({ key: `${tier}:${i}`, options }))
    .filter((q) => !askedKeys.includes(q.key));

  // Tier exhausted (a very long game) — fall back to any unasked question.
  const fallback = Object.entries(QUESTIONS)
    .flatMap(([t, list]) => list.map((options, i) => ({ key: `${t}:${i}`, options })))
    .filter((q) => !askedKeys.includes(q.key));

  const source = pool.length ? pool : fallback;
  if (!source.length) return null;

  return source[Math.floor(Math.random() * source.length)];
}

const TOTAL_QUESTIONS = Object.values(QUESTIONS).reduce((n, list) => n + list.length, 0);

module.exports = { QUESTIONS, pickQuestion, tierForRound, TOTAL_QUESTIONS };
