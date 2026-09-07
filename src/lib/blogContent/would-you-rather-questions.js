/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'would-you-rather-questions-to-get-to-know-someone',
  title: 'Would You Rather Questions That Actually Get You Somewhere',
  seoTitle: 'Would You Rather Questions to Get to Know Someone',
  description:
    '60 Would You Rather questions arranged from light to genuinely revealing, plus why the order matters more than the questions when you are talking to a stranger.',
  keywords: [
    'would you rather questions',
    'would you rather questions to get to know someone',
    'deep would you rather questions for adults',
    'would you rather questions for strangers',
    'good would you rather questions',
    'conversation game with strangers',
    'would you rather online chat',
    'questions that reveal personality',
  ],
  publishedDate: '2026-09-02',
  modifiedDate: '2026-09-02',
  author: 'Anoniz Team',
  readTime: '4 min read',
  category: 'Guides',
};

export const faqItems = [
  {
    question: 'What makes a good Would You Rather question?',
    answer:
      'Both options have to be genuinely defensible. If one choice is obviously correct there is nothing to discuss, and the discussion is the entire point of the game. The best questions leave two reasonable people disagreeing.',
  },
  {
    question: 'Should you start with deep questions?',
    answer:
      'No. Deep prompts land badly with someone you have just met — they read as intense rather than interesting. Playful questions lower defences first, which is why this list is ordered from light to heavy. Earn the depth, do not open with it.',
  },
  {
    question: 'Why does Would You Rather work so well with strangers?',
    answer:
      'Because the hypothetical framing gives people cover. Answering "would you rather be respected or liked" reveals something real about your values, but it feels like a game rather than a confession, so people answer honestly without feeling exposed.',
  },
  {
    question: 'Can I play Would You Rather online with a random person?',
    answer:
      'Yes. Anoniz has it built into text chat: either person can start a round, you both choose privately, and the answers are revealed at the same time so nobody can copy. It also keeps a running score of how often you agreed.',
  },
];

export default function WouldYouRatherQuestions({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#order">Why the order matters more than the questions</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#light">Level 1 — light (start here)</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#values">Level 2 — values</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#deep">Level 3 — genuinely revealing</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#play">How to actually play it with a stranger</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        Would You Rather has a reputation as a sleepover game, which undersells it badly. Asked in
        the right order, it is one of the fastest ways to learn something true about a person you
        have never met — faster than any amount of "so what do you do".
      </p>

      <h2 id="order">Why the order matters more than the questions</h2>
      <p>
        The mistake almost everyone makes is opening with the good stuff. Deep questions asked too
        early do not read as interesting; they read as intense, and the other person pulls back.
      </p>
      <p>
        Playful questions do the opposite. They lower defences, establish that this is a game rather
        than an interrogation, and buy you the right to ask something heavier three rounds later. So
        work down this list, not up it. Two or three light ones, then values, then the real ones —
        and only if the conversation is still going well.
      </p>
      <p>
        One rule for every level: both options have to be defensible. If one answer is obviously
        right, there is nothing to talk about, and the talking is the whole point.
      </p>

      <h2 id="light">Level 1 — light (start here)</h2>
      <p>Low stakes, quick to answer, and they still tell you something.</p>
      <ul>
        <li>Always be 10 minutes early, or always be 10 minutes late?</li>
        <li>Unlimited money but no free time, or unlimited free time and just enough money?</li>
        <li>Never be able to skip an ad again, or never be able to pause anything again?</li>
        <li>Live without music, or live without films?</li>
        <li>Always have a song stuck in your head, or always have one slightly wet sock?</li>
        <li>Be famous for something embarrassing, or completely unknown forever?</li>
        <li>Only be able to whisper, or only be able to shout?</li>
        <li>Always know when someone is lying, or always get away with lying?</li>
        <li>Be the funniest person in the room, or the smartest?</li>
        <li>Have a rewind button for your life, or a pause button?</li>
        <li>Never feel too hot again, or never feel too cold again?</li>
        <li>Lose all your photos, or lose all your playlists?</li>
        <li>Talk to animals, or speak every human language?</li>
        <li>Never have to sleep again, or never have to eat again?</li>
        <li>No phone for a week, or no shoes for a week?</li>
      </ul>

      <h2 id="values">Level 2 — values</h2>
      <p>
        This is where the game starts earning its keep. Every one of these has a defensible answer
        on both sides, and which side someone lands on tells you how they are built.
      </p>
      <ul>
        <li>Be deeply respected, or widely liked?</li>
        <li>Know exactly how you die, or exactly when?</li>
        <li>Have five close friends, or fifty good ones?</li>
        <li>Be great at a job you hate, or mediocre at one you love?</li>
        <li>Always say what you think, or never have to explain yourself?</li>
        <li>Live somewhere beautiful and alone, or somewhere ordinary near people you love?</li>
        <li>Read minds but never turn it off, or never know what anyone thinks of you?</li>
        <li>Have a life full of change, or a life you can rely on?</li>
        <li>Be remembered by many for a little, or by a few for everything?</li>
        <li>Give up your ambition, or give up your free time?</li>
        <li>Always take the safe option, or always take the interesting one?</li>
        <li>Be underestimated, or overestimated?</li>
        <li>Start over somewhere nobody knows you, or stay where everyone does?</li>
        <li>Be right, or be kind?</li>
        <li>Know your future, or change your past?</li>
      </ul>

      <h2 id="deep">Level 3 — genuinely revealing</h2>
      <p>
        Only once you are both clearly enjoying it. These are the ones people remember the
        conversation for, and the ones that go badly if you open with them.
      </p>
      <ul>
        <li>
          Forgive someone who never apologised, or get an apology from someone you can't forgive?
        </li>
        <li>Know what people really say about you, or never wonder again?</li>
        <li>Relive your best day forever, or never think about it again?</li>
        <li>Be the reason someone changed, or never know that you were?</li>
        <li>Have everyone see you exactly as you are, or keep one thing hidden forever?</li>
        <li>Lose the memory of your worst year, or keep it and everything it taught you?</li>
        <li>Have a second chance with one person, or closure with all of them?</li>
        <li>Be needed, or be wanted?</li>
        <li>Never disappoint anyone again, or never be disappointed again?</li>
        <li>Say the thing you never said, or hear the thing you never heard?</li>
        <li>Live the life you planned, or the one you actually got?</li>
        <li>Be at peace with who you are, or become who you meant to be?</li>
        <li>Have someone stay out of love, or leave out of honesty?</li>
        <li>Know you did enough, or have everyone else believe you did?</li>
        <li>Meet the person you were at ten, or the person you'll be at eighty?</li>
      </ul>

      <div className={styles.tipBox}>
        <span className={styles.tipLabel}>The follow-up is the game</span>
        <p>
          The choice is not the interesting part — "why" is. Never let an answer pass without asking
          what made them pick it. That single question is the difference between a list of
          preferences and an actual conversation.
        </p>
      </div>

      <h2 id="play">How to actually play it with a stranger</h2>
      <p>
        Two rules make it work. First, <strong>both people answer before either reveals</strong> —
        otherwise the second person just agrees, and you learn nothing. Second, keep a running count
        of how often you matched. That number becomes its own topic surprisingly fast.
      </p>
      <p>
        Both are built into <Link href="/chat">Anoniz text chat</Link>. Either of you can start a
        round, the choices stay hidden until you have both picked, the reveal happens
        simultaneously, and the questions get deeper as you keep going. If a conversation goes quiet
        for half a minute, we offer it — which is usually exactly when it is needed.
      </p>

      <p>
        More on keeping a chat alive:{' '}
        <Link href="/blog/what-to-say-when-conversation-dies-stranger-chat">
          what to say when a conversation dies
        </Link>{' '}
        and{' '}
        <Link href="/blog/50-best-questions-to-ask-strangers-online-to-keep-conversations-going">
          50 questions to ask strangers online
        </Link>
        .
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
