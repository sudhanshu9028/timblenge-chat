// Questions shown on /chat. The same array feeds the page's FAQPage structured
// data, so what search engines and AI assistants read can't drift from what
// visitors see. `link` is rendered after the answer and left out of the data.
export const CHAT_FAQ_ITEMS = [
  {
    question: 'Do I need to sign up for Anoniz text chat?',
    answer:
      "No. There is no sign-up, email or password. You confirm that you're 18 or over, and you can start.",
  },
  {
    question: 'Is it really free?',
    answer: 'Yes. Text chat is free, with no message limit, no trial and no premium tier.',
  },
  {
    question: 'Is this one-on-one or a chat room?',
    answer:
      'One-on-one. You talk to one person at a time and nobody else can see the conversation. There are no group rooms.',
  },
  {
    question: 'Can I send photos to a stranger?',
    answer:
      "Yes, as view-once photos. The other person can open a photo once, for 10 seconds. It is deleted when opened, when either of you leaves, or after five minutes unopened. No website can stop someone photographing their screen, so don't send anything you'd mind a stranger keeping.",
  },
  {
    question: 'How does matching by interests work?',
    answer:
      'Add interests separated by commas. We look for someone waiting who entered the same word. If nobody has, we connect you with the next person available.',
  },
  {
    question: 'Can I choose to chat with girls or boys?',
    answer:
      "No. There is no gender filter, and your gender isn't used for matching or shown to the other person. Who you meet is random.",
  },
  {
    question: 'Am I talking to a real person or an AI?',
    answer:
      "A real person, unless the chat is labelled otherwise. When nobody is free we may offer our AI so you're not staring at an empty screen. It carries a visible badge for the whole conversation, and we keep looking for a real person in the background.",
  },
  {
    question: 'Does anyone read my messages?',
    answer:
      "We don't store or log your messages. They pass through our server to reach the other person and are gone when the chat ends. Messages you send to the labelled AI are processed by Google's Gemini service so it can reply.",
  },
  {
    question: 'Does it work on my phone?',
    answer:
      'Yes. Anoniz runs in the browser on iPhone, Android and desktop, so there is no app to install.',
  },
  {
    question: 'Can someone find me afterwards?',
    answer:
      "Not through Anoniz. There are no profiles or usernames, so there's nothing to look up once the chat ends, unless you shared something that identifies you.",
  },
  {
    question: 'What do I say when the conversation dies?',
    answer:
      'Change direction rather than forcing the topic, or start a round of Would You Rather. We suggest the game when a chat with a real person goes quiet.',
    link: {
      href: '/blog/what-to-say-when-conversation-dies-stranger-chat',
      label: 'More ways to restart a stalled chat',
    },
  },
  {
    question: 'What happened to Omegle?',
    answer:
      'Omegle shut down in November 2023 after fourteen years, following a lawsuit and years of moderation problems. Anoniz offers the same kind of one-to-one stranger chat, with an 18+ confirmation, no profiles and nothing stored afterwards.',
    link: {
      href: '/blog/why-did-omegle-shut-down-where-everyone-went-2026',
      label: 'The full story is here',
    },
  },
];
