/**
 * Riddles for the waiting screen.
 *
 * Phase 1 made people wait up to a minute for a real match instead of three
 * seconds. That trade is only worth it if the wait is bearable, which is what
 * this is for. Kept purely client-side — a solo game needs no server.
 *
 * Chosen to be solvable in well under a minute, language-light (a lot of these
 * visitors are practising English), and free of cultural trivia.
 */

export const RIDDLES = [
  { q: 'What has keys but opens no locks?', a: 'A piano' },
  { q: 'What gets wetter the more it dries?', a: 'A towel' },
  { q: 'I have cities but no houses, water but no fish. What am I?', a: 'A map' },
  { q: 'What goes up but never comes down?', a: 'Your age' },
  { q: 'The more you take, the more you leave behind. What are they?', a: 'Footsteps' },
  { q: 'What can you serve but never eat?', a: 'A tennis ball' },
  { q: 'What has a neck but no head?', a: 'A bottle' },
  { q: 'What can travel around the world while staying in one corner?', a: 'A stamp' },
  { q: 'What has one eye but cannot see?', a: 'A needle' },
  { q: "What's full of holes but still holds water?", a: 'A sponge' },
  { q: 'What can you catch but never throw?', a: 'A cold' },
  { q: 'What has teeth but cannot bite?', a: 'A comb' },
  { q: 'I am tall when young and short when old. What am I?', a: 'A candle' },
  { q: 'What has a bottom at the top?', a: 'Your legs' },
  { q: 'What breaks the moment you say its name?', a: 'Silence' },
  { q: 'What has many rings but no fingers?', a: 'A tree' },
  { q: 'What runs but never walks?', a: 'A river' },
  { q: 'What has a head and a tail but no body?', a: 'A coin' },
  { q: 'What comes down but never goes up?', a: 'Rain' },
  { q: 'What has words but never speaks?', a: 'A book' },
  { q: 'What can fill a room but takes up no space?', a: 'Light' },
  { q: 'What has legs but does not walk?', a: 'A table' },
  { q: 'The more of it you have, the less you see. What is it?', a: 'Darkness' },
  { q: 'What belongs to you, but other people use it more than you do?', a: 'Your name' },
  { q: 'What flies without wings and cries without eyes?', a: 'A cloud' },
  { q: 'What goes through cities and fields but never moves?', a: 'A road' },
  { q: 'What can you break without touching it?', a: 'A promise' },
  { q: 'What is always in front of you but cannot be seen?', a: 'The future' },
  { q: 'What has a thumb and four fingers but is not alive?', a: 'A glove' },
  { q: 'What kind of band never plays music?', a: 'A rubber band' },
  { q: 'What gets bigger the more you take away from it?', a: 'A hole' },
  { q: 'What has four wheels and flies?', a: 'A rubbish truck' },
  { q: 'What has a ring but no finger, and wakes you up?', a: 'A phone' },
  { q: 'What can you hold in your left hand but never in your right?', a: 'Your right elbow' },
  {
    q: 'What is so light that it can be lifted by anyone, but nobody can hold it for long?',
    a: 'Your breath',
  },
  { q: 'What building has the most stories?', a: 'A library' },
  { q: 'What has a face and two hands but no arms or legs?', a: 'A clock' },
  { q: 'What is black when clean and white when dirty?', a: 'A blackboard' },
  { q: 'What has branches but no fruit, trunk or leaves?', a: 'A bank' },
  { q: 'What can be cracked, made, told and played?', a: 'A joke' },
];

/**
 * A riddle the visitor hasn't just seen.
 * @param {number[]} seenIndexes indexes already shown this session
 */
export function getRiddle(seenIndexes = []) {
  const available = RIDDLES.map((_, i) => i).filter((i) => !seenIndexes.includes(i));
  // Everything's been seen — start the cycle over rather than running dry.
  const pool = available.length ? available : RIDDLES.map((_, i) => i);
  const index = pool[Math.floor(Math.random() * pool.length)];
  return { index, ...RIDDLES[index] };
}
