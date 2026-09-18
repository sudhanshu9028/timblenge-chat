/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'meet-people-in-real-life',
  title: "Meet People in Real Life: What's Actually Working in 2026",
  seoTitle: 'Meet People in Real Life: What Works in 2026',
  description:
    'Trivia nights are up 403% and mahjong 235%. Here is how people meet people in real life in 2026 — the events that are growing, and how not to freeze up.',
  keywords: [
    'meet people in real life',
    'how to meet people without dating apps',
    'ways to meet people in real life',
    'where to meet new people 2026',
    'hobby events to meet people',
    'irl dating trend',
    'make friends as an adult',
  ],
  publishedDate: '2026-09-18',
  modifiedDate: '2026-09-18',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Lifestyle',
};

export const faqItems = [
  {
    question: 'What is the easiest way to meet people in real life?',
    answer:
      'Go to something where the activity is the point and meeting people is the side effect — a quiz night, a craft circle, a run club, a games evening. It gives you a built-in reason to be there, an obvious thing to talk about, and a graceful exit if the conversation goes nowhere. Eventbrite data from July 2026 shows exactly these formats growing fastest.',
  },
  {
    question: 'Are people really meeting offline instead of on apps?',
    answer:
      "Eventbrite's July 2026 analysis found events built around meeting people grew sharply year on year — trivia nights up 403% and mahjong up 235% — and reports that 77% of Gen Z say they meet romantic matches in person rather than through apps. Dating apps haven't disappeared, but the centre of gravity has shifted toward activity-based events.",
  },
  {
    question: 'How do I get better at talking to strangers before I go?',
    answer:
      "Practise where nothing is at stake. Short anonymous conversations online let you rehearse opening, asking a follow-up question and ending politely, without anyone you'll meet again keeping score. Small talk improves with repetition far more than with preparation, so volume matters more than scripts.",
  },
];

export default function MeetPeopleInRealLife({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#short-version">The short version</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#numbers">The numbers behind the shift</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#why">Why activity-first beats meeting-first</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#freeze">How not to freeze when you get there</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#online">What online chat is still good for</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        Trivia nights are up 403%. Mahjong is up 235%. The fastest-growing way to meet people in
        real life right now isn't an app — it's an activity where meeting people is the side effect.
      </p>

      <h2 id="short-version">The short version</h2>
      <p>
        If you want to meet people in real life, pick an event where the activity is the point and
        conversation is the by-product. Eventbrite's July 2026 analysis of its US listings found
        trivia, mahjong, birdwatching, Pilates socials and craft circles growing fastest, and 58% of
        young adults said they prefer socialising to be secondary to the thing they came for.
      </p>

      <h2 id="numbers">The numbers behind the shift</h2>
      <p>
        <a
          href="https://www.eventbrite.com/blog/press/newsroom/the-modern-meet-cute-index/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Eventbrite's Modern Meet-Cute Index
        </a>
        , published in July 2026, compared the first half of 2025 with the first half of 2026:
      </p>
      <ul>
        <li>
          <strong>Trivia nights:</strong> events up 403%, attendance up 388%
        </li>
        <li>
          <strong>Mahjong:</strong> events up 235%, attendance up 272%
        </li>
        <li>
          <strong>Birdwatching:</strong> events up 131%, attendance up 82%
        </li>
        <li>
          <strong>Pottery and craft circles:</strong> events up 38%, attendance up 116%
        </li>
        <li>
          <strong>Pilates socials:</strong> events up 84%, attendance up 87%
        </li>
      </ul>
      <p>
        Events using "meet-cute" language grew 117% over the same period. Eventbrite also reports
        77% of Gen Z say they meet romantic matches in person rather than on apps.
      </p>

      <h2 id="why">Why activity-first beats meeting-first</h2>
      <p>
        A dating app puts you on stage: you are the product, and the conversation is an audition. A
        plant swap gives you a table, a task and something obvious to say.
      </p>
      <p>
        You also get a script for free. Asking someone which tile they're waiting for, or what their
        pot is meant to be, is easier than opening with yourself.
      </p>
      <p>
        And the good ones repeat. The same faces at the same Tuesday quiz turn into familiarity,
        which is how acquaintances actually form — frequency does more work than intensity.
      </p>

      <h2 id="freeze">How not to freeze when you get there</h2>
      <ul>
        <li>
          <strong>Arrive ten minutes early.</strong> Talking to three people in a half-empty room is
          far easier than joining a full one.
        </li>
        <li>
          <strong>Ask about the thing in front of you.</strong> The activity is the conversation
          starter; you don't need a better one.
        </li>
        <li>
          <strong>Go twice.</strong> The second visit is where people recognise you, and recognition
          does most of the work.
        </li>
        <li>
          <strong>Leave without ceremony.</strong> A quiet exit costs nothing and makes returning
          easy.
        </li>
      </ul>

      <h2 id="online">What online chat is still good for</h2>
      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Where we stand</p>
        <p>
          Anoniz isn't a substitute for a room full of people, and we won't pretend it is. What it's
          genuinely good for is reps: ten minutes of talking to someone new, with no stakes and
          nobody keeping score, before a night where it matters.
        </p>
      </div>
      <p>
        If the hard part is the talking rather than the going, that's the part you can practise
        cheaply before you try to meet people in real life. Small talk gets easier with volume, not
        with planning.
      </p>

      <h2 id="worth-it">Worth the trip</h2>
      <p>
        Meet people in real life and you accept some awkwardness in exchange for something an app
        can't fake: being in the same room, at the same time, doing the same thing. The data says a
        lot of people are choosing that trade this year.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/dating-app-burnout-why-people-are-trying-random-chat-instead">
          why people are trying random chat instead of dating apps
        </Link>{' '}
        and{' '}
        <Link href="/blog/third-places-gen-z-online">
          how Gen Z is building third places online
        </Link>
        . To warm up first, <Link href="/chat">start a text chat</Link> — no profile, no audience.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
