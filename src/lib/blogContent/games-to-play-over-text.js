/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'games-to-play-over-text',
  title: 'Games to Play Over Text With Someone You Just Met',
  seoTitle: 'Games to Play Over Text With Someone You Just Met',
  description:
    'Eight games to play over text when small talk runs out, picked for people who have just met. One-line rules for each, and two kinds of game to skip.',
  keywords: [
    'games to play over text',
    'texting games',
    'games to play over text with a stranger',
    'games to play in chat',
    'fun games to play while texting',
    '20 questions over text',
    'two truths and a lie over text',
  ],
  publishedDate: '2026-10-10',
  modifiedDate: '2026-10-10',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Guides',
};

export const faqItems = [
  {
    question: 'What are good games to play over text with a stranger?',
    answer:
      'Ones that need no shared history and no personal details: 20 Questions, Would You Rather, This or That, Emoji Movie and Story Chain all work with someone you met five minutes ago. Each takes one message to explain and one message per turn.',
  },
  {
    question: 'Which texting games should you avoid with someone you just met?',
    answer:
      'Photo games and dares. A "send your view" challenge can reveal where you live, and a dare from someone you barely know is a common way pressure starts. Save both for people you know in real life.',
  },
  {
    question: 'How do you suggest a game without making it awkward?',
    answer:
      'Just say it plainly: "Small talk is hard. Want to play something?" Most people are relieved, because they were running out of things to say too. Offer two options so they can pick instead of having to think of one.',
  },
];

export default function GamesToPlayOverText({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#why">Why a game beats another question</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#games">Eight games to play over text</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#skip">Two kinds of game to skip with strangers</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#shortcut">A shortcut, not a script</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        Small talk has a shelf life. After the country, the weather and "what do you do", you both
        stall. That is when games to play over text earn their place: they give two strangers
        something to do together.
      </p>

      <h2 id="why">Why a game beats another question</h2>
      <p>
        More of your social life happens in a chat window than you might think. In a survey of 4,100
        US adults, 65% of Gen Z said they experience their social life more through a phone than in
        person,{' '}
        <a
          href="https://theharrispoll.com/wp-content/uploads/2026/07/The-Gen-Z-Weekend-Report-July-2026.pdf"
          target="_blank"
          rel="noopener noreferrer"
        >
          the Harris Poll found in July 2026
        </a>
        .
      </p>
      <p>
        If that's where the talking happens, it helps to have more than "wyd". A game gives you
        turns, low stakes, and a quick look at how someone thinks.
      </p>
      <p>
        A game also takes away the pressure to be interesting. You aren't performing, you're taking
        a turn. That is why games to play over text suit people who freeze at open questions.
      </p>

      <h2 id="games">Eight games to play over text</h2>
      <p>None of these needs an app, a photo or a shared history.</p>
      <ul>
        <li>
          <strong>20 Questions.</strong> One of you thinks of a thing. The other gets twenty
          yes-or-no questions to find it.
        </li>
        <li>
          <strong>Would You Rather.</strong> Two options, pick one, say why. The "why" is the
          conversation.
        </li>
        <li>
          <strong>This or That.</strong> The fast version: "mountains or beach?" No explaining
          unless asked.
        </li>
        <li>
          <strong>Two Truths and a Lie.</strong> Send three statements and let them guess the lie.
          Keep all three free of details that identify you.
        </li>
        <li>
          <strong>Emoji Movie.</strong> Describe a film using only emoji. They guess the title.
        </li>
        <li>
          <strong>Story Chain.</strong> Write one sentence each and see where the story ends up.
        </li>
        <li>
          <strong>Desert Island.</strong> You get three items, one album and one meal. Defend your
          choices.
        </li>
        <li>
          <strong>Word Association.</strong> Send a word. They reply with the first one it brings to
          mind. Stop when it gets strange.
        </li>
      </ul>
      <p>
        Start with the quick ones. This or That takes ten seconds a turn, which suits a chat that
        has only just begun. For ready-made dilemmas, the{' '}
        <Link href="/would-you-rather">Would You Rather generator</Link> sorts them from playful to
        deep.
      </p>

      <h2 id="skip">Two kinds of game to skip with strangers</h2>
      <ul>
        <li>
          <strong>Photo games.</strong> "Send your view right now" sounds harmless, and it can show
          exactly where you are.
        </li>
        <li>
          <strong>Dares.</strong> Truth or Dare works with friends. With someone you met ten minutes
          ago, a dare is often where pressure begins — never do one on camera.
        </li>
      </ul>
      <p>
        If a game turns into requests you don't like, you can simply leave. We wrote about{' '}
        <Link href="/blog/video-call-sextortion-what-to-do">
          what to do if a video call turns into blackmail
        </Link>
        .
      </p>

      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Where we stand</p>
        <p>
          Only one of these is built into Anoniz: Would You Rather, which you can start from the
          chat once you're talking to a real person. It isn't offered in AI chats. The other seven
          you'll have to run by typing, which works fine.
        </p>
      </div>

      <h2 id="shortcut">Games to play over text are a shortcut, not a script</h2>
      <p>
        The best games to play over text get you talking and then get out of the way. When an answer
        surprises you, drop the game and ask about it.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/would-you-rather-questions-to-get-to-know-someone">
          Would You Rather questions that get you somewhere
        </Link>
        ,{' '}
        <Link href="/blog/50-best-questions-to-ask-strangers-online-to-keep-conversations-going">
          50 questions to ask strangers online
        </Link>
        , and <Link href="/blog/what-to-say-after-hi">what to say after hi</Link>. Want a partner?{' '}
        <Link href="/chat">Start a text chat</Link> and offer a round.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
