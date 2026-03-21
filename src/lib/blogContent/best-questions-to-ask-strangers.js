/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  title: '50 Best Questions to Ask Strangers Online to Keep the Conversation Going',
  description:
    'Never run out of things to say! Explore our curated list of the best icebreakers, deep questions, and fun conversation starters to ask strangers in random chats.',
  keywords: [
    '50 questions to ask strangers online',
    'best conversation starters for chat',
    'how to keep a conversation going',
    'icebreakers for random video chat',
    'fun questions to ask a guy or girl',
    'deep questions for late night chats',
    'never run out of things to say',
    'engaging chat questions 2026',
  ],
  publishedDate: '2026-03-21',
  modifiedDate: '2026-03-21',
  author: 'Anoniz Team',
  readTime: '6 min read',
  category: 'Guides',
};

// 50 Questions Categorized
const casualQuestions = [
  'What is the most controversial food opinion you hold?',
  'If you could instantly upload any skill to your brain right now, what would it be?',
  "What's a movie that everyone loves but you secretly think is terrible?",
  'Describe the aesthetic of your bedroom in three words.',
  "What is the weirdest YouTube rabbit hole you've fallen down recently?",
  'If you had to change your first name today, what would you choose?',
  "What is the best WiFi name you've ever seen?",
  'What is a song you will never, ever skip when it comes on?',
  'If you could only eat one cuisine for the rest of your life, what is it?',
  "What's the best piece of advice you’ve ever randomly received?",
  "What is your go-to comfort show when you're sick?",
  "Have you ever experienced a 'glitch in the matrix' moment?",
  "What is a hobby you've always wanted to try but haven't yet?",
  'If you had an intro song play every time you entered a room, what would it be?',
  'What is the most ridiculous thing you believed as a kid?',
];

const deepQuestions = [
  "What is a belief you held strongly 5 years ago that you've completely abandoned?",
  'If you could see a 1-minute video of any moment in your future, would you watch it?',
  'What compliment do people give you that you have a hard time believing?',
  "What is the most beautiful place you've ever seen with your own eyes?",
  "If you had unlimited money but couldn't spend it on yourself, who would you help first?",
  'Do you think technology is pulling us closer together or pushing us further apart?',
  "What is the hardest lesson you've had to learn in life so far?",
  'If you could re-do one day of your life, which day would it be and why?',
  'When was the last time you completely changed your mind about something important?',
  'What do you think happens to us after we die?',
  'Are you currently running away from something or running toward something?',
  'What is a trait you admire in others but struggle to develop in yourself?',
  'If you had to describe your current state of mind as the weather, what is it?',
  'What is the most kind act a stranger has ever done for you?',
  'Do you believe soulmates exist, or do we just choose to love someone?',
];

const hypotheticalQuestions = [
  'You have to survive a zombie apocalypse using only the items currently in the room you are in. How long do you last?',
  'If animals could talk, which species do you think would be the rudest?',
  'You get $10 million, but an immortal snail is released somewhere in the world, and if it touches you, you die. Do you take the money?',
  'If you had to give a 30-minute TED talk right now with zero preparation, what would the topic be?',
  "Aliens land on Earth and you are the first person they meet. How do you explain the concept of 'memes' to them?",
  'If you could freeze time for 24 hours, what would you do?',
  'You discover a new planet. What is the first law you enact?',
  'If you were forced to participate in a reality TV show, which one would you actually have a chance at winning?',
  'You are given a button that will instantly erase the internet forever. Do you press it?',
  'If you could live in any fictional universe, but only as an average citizen (no main character powers), which one would you pick?',
];

const wouldYouRatherQuestions = [
  'Would you rather know when you are going to die or how you are going to die?',
  'Would you rather have the ability to read minds or the ability to teleport?',
  'Would you rather speak all human languages or be able to speak to all animals?',
  'Would you rather always be 10 minutes late or always be 20 minutes early?',
  'Would you rather have to announce everything you do out loud, or never be able to speak again?',
  'Would you rather fight one horse-sized duck or a hundred duck-sized horses?',
  'Would you rather travel 100 years into the past or 100 years into the future?',
  'Would you rather lose all your money and valuables or lose all your pictures and memories?',
  'Would you rather have a playback feature for your own memories or a clear vision of your future?',
  'Would you rather be universally respected but alone, or loved by a few but widely misunderstood?',
];

export default function QuestionsToAskStrangers({ styles }) {
  const faqItems = [
    {
      question: 'What do I do if they answer with just "yes" or "no"?',
      answer:
        'Follow up with a "Why?" or transition to a wildly different, hypothetical question to jolt the conversation awake. If they remain unresponsive, just politely say goodbye and match with someone new!',
    },
    {
      question: 'Are there any topics I should avoid?',
      answer:
        'When first meeting a stranger, it is generally best to avoid deeply polarizing topics like heavy politics, extremely personal financial questions, or anything overly explicit.',
    },
    {
      question: 'How do I smoothly transition from an icebreaker to a normal chat?',
      answer:
        'Listen carefully to their answer and find a "hook." If you ask about their favorite movie and they mention a sci-fi film, ask them what they think the future will actually look like in 50 years. Let the conversation branch naturally.',
    },
  ];

  const renderQuestions = (questionsArray) => (
    <div className={styles.questionList}>
      {questionsArray.map((q, idx) => (
        <div key={idx} className={styles.questionBlock}>
          {q}
        </div>
      ))}
    </div>
  );

  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#the-art">The Art of the Icebreaker</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#casual-fun">Casual & Fun Questions (15)</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#deep-thought">Deep & Introspective Questions (15)</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#hypothetical">Wild & Hypothetical Questions (10)</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#would-you-rather">Would You Rather Questions (10)</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>"Hey." "Hi." "ASL?" "How are you?" "Good, you?"</p>
      <p>
        If you have ever used a random chat platform, you have lived through this exact, painfully
        boring script a thousand times. The fastest way to guarantee a stranger will click the
        "Next" button is to start the conversation with the exact same boring greeting they've heard
        all day.
      </p>
      <p>
        If you want to have genuinely fun, memorable interactions on platforms like{' '}
        <Link href="/">Anoniz</Link>, you need to upgrade your question game. We've compiled the
        ultimate list of <strong>exactly 50 questions</strong> to ask strangers online, categorized
        from casual icebreakers to deep late-night philosophy.
      </p>

      <h2 id="the-art">The Art of the Icebreaker</h2>
      <p>
        The perfect icebreaker requires the other person to think for just a second, but isn't so
        complex that it feels like an exam. Skip the "how are you" and drop one of these into the
        chat the second you connect.
      </p>

      <h2 id="casual-fun">Casual & Fun Questions</h2>
      <p>
        Use these 15 questions when you just want a lighthearted, breezy chat to pass the time and
        share a few laughs.
      </p>
      {renderQuestions(casualQuestions)}

      <h2 id="deep-thought">Deep & Introspective Questions</h2>
      <p>
        Late night chats often hit a different wave length. When you match with someone who seems
        introspective, these 15 questions can lead to beautiful, hours-long conversations.
      </p>
      {renderQuestions(deepQuestions)}

      <h2 id="hypothetical">Wild & Hypothetical Questions</h2>
      <p>
        These 10 off-the-wall questions are perfect for breaking tension and finding out exactly how
        creative a stranger's imagination can be.
      </p>
      {renderQuestions(hypotheticalQuestions)}

      <h2 id="would-you-rather">"Would You Rather" Fast Fire</h2>
      <p>
        When in doubt, a quick game of "Would You Rather" never fails to generate debate. Let's look
        at 10 of the best ones to test your chat partner's decision-making skills.
      </p>
      {renderQuestions(wouldYouRatherQuestions)}

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
