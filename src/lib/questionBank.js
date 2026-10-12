// Conversation questions for the random question generator
// (/random-question-generator).
//
// Every question has to be safe to ask someone you met a minute ago, which
// rules out anything that pins a person down: no city, school, workplace or
// surname. "Where you live" always means the country, never the address — the
// same line the safety guide draws for readers, so the tool can't contradict it.
//
// Groups run from least to most effort to answer. That is the order the
// generator offers them in, and it is deliberate: an easy question earns the
// right to ask a harder one.

export const QUESTION_GROUPS = [
  {
    id: 'icebreakers',
    label: 'Icebreakers',
    hint: 'Five seconds to answer, nothing personal.',
    items: [
      'What were you doing right before this?',
      'Is it morning, afternoon or the middle of the night where you are?',
      'What is the last thing you ate, and was it worth it?',
      'What song has been stuck in your head this week?',
      'Good day or long day so far?',
      'What are you supposed to be doing right now instead of this?',
      'Tea, coffee or neither?',
      'What is the last thing that made you laugh out loud?',
      'What is your go-to way to waste an hour?',
      'What is the weather doing outside your window?',
      'What is the best thing you have watched lately?',
      'If today had a title, what would it be?',
    ],
  },
  {
    id: 'funny',
    label: 'Funny',
    hint: 'Low stakes. The worse the answer, the better.',
    items: [
      'What is the most useless talent you have?',
      'What food do you defend that everyone else hates?',
      'What is the worst haircut you have ever had?',
      'What is the strangest thing you believed as a child?',
      'Which animal would be the rudest if it could talk?',
      'What is your most controversial food opinion?',
      'What is the silliest thing you have ever argued about?',
      'What would your villain name be?',
      'What is a smell you secretly like?',
      'What is the most ridiculous thing you have bought online?',
      'If you were a ghost, who would you haunt first, and how?',
      'What word do you always spell wrong?',
    ],
  },
  {
    id: 'hypothetical',
    label: 'Hypothetical',
    hint: 'No right answer, so nobody can get it wrong.',
    items: [
      'You get an extra hour every day. What do you do with it?',
      'You can be fluent in one new language by tomorrow. Which one?',
      'You can live in any decade for a year. Which do you pick?',
      'You can have dinner with anyone, alive or dead. Who is at the table?',
      'You wake up with one new skill. What is it?',
      'You can only keep three apps on your phone. Which survive?',
      'You are handed a plane ticket to anywhere, leaving tonight. Where to?',
      'You can un-invent one thing. What goes?',
      'You get to rename the planet. What do you call it?',
      'You can ask any animal one question. What do you ask?',
      'You can relive one ordinary day. Which one?',
      'You can know the answer to one mystery. Which?',
    ],
  },
  {
    id: 'deep',
    label: 'Deep',
    hint: 'For once the chat has warmed up.',
    items: [
      'What is something you changed your mind about in the last few years?',
      'What is a small thing that makes a bad day better?',
      'What do you wish people asked you about more often?',
      'What is the best advice you ignored?',
      'When do you feel most like yourself?',
      'What is something you are quietly proud of?',
      'What did you want to be at ten, and how close did you get?',
      'What is a compliment you still remember?',
      'What is something you are looking forward to?',
      'What is harder than people think?',
      'What would you tell yourself five years ago?',
      'What is a risk you are glad you took?',
    ],
  },
  {
    id: 'world',
    label: 'Around the world',
    hint: 'For when the other person is in another country.',
    items: [
      'What is a food from your country that everyone should try once?',
      'What is a phrase in your language that does not translate?',
      'What does a normal breakfast look like where you live?',
      'What do visitors always get wrong about your country?',
      'What holiday or festival do you look forward to most?',
      'What is the most beautiful place you have been to in your own country?',
      'What is considered rude where you live that might surprise me?',
      'What is a song from your country I should listen to?',
      'What do people where you live complain about most?',
      'What is the first thing you would show a visitor?',
      'What is a tradition in your family that other people find odd?',
      'What time do people normally eat dinner where you are?',
    ],
  },
];

export const TOTAL_QUESTIONS = QUESTION_GROUPS.reduce((n, group) => n + group.items.length, 0);
