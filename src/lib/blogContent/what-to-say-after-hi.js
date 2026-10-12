/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'what-to-say-after-hi',
  title: 'What to Say After Hi: 12 Replies That Keep a Stranger Talking',
  seoTitle: 'What to Say After Hi: 12 Replies That Work',
  description:
    'Stuck on what to say after hi? Most chats die on the second message. A simple formula, 12 lines you can borrow, and the replies that end a chat early.',
  keywords: [
    'what to say after hi',
    'how to reply to hi',
    'what to say after hi in random chat',
    'what to reply after hi in chat',
    'how to start a conversation with a stranger online',
    'how to respond to hey',
    'what to say after hello',
  ],
  publishedDate: '2026-10-10',
  modifiedDate: '2026-10-10',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Guides',
};

export const faqItems = [
  {
    question: 'What should I say after hi in a chat?',
    answer:
      'Say hi back, add one small detail about your moment, and ask one easy, specific question. For example: "Hi! Just finished dinner. What time is it where you are?" It gives the other person two things to respond to instead of none.',
  },
  {
    question: 'How do I reply when a stranger only says hi?',
    answer:
      'Treat it as an open door rather than a test. Answer with a greeting plus a question that takes five seconds to answer, such as "good day or long day?". If they reply with one word twice in a row, you are allowed to move on.',
  },
  {
    question: 'What should I not say after hi?',
    answer:
      'Avoid opening with "asl?", sending "wyd" on its own, firing off three questions at once, or commenting on how someone looks. Each of these either hands all the work to the other person or makes the chat feel like a form to fill in.',
  },
];

export default function WhatToSayAfterHi({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#second-message">Why the second message is the hard one</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#formula">A formula for what to say after hi</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#lines">12 lines you can borrow</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#avoid">Replies that end it early</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        The first message is easy. Everyone types "hi". The hard part is what to say after hi, when
        the cursor blinks and you both wait for the other person to be interesting.
      </p>

      <h2 id="second-message">Why the second message is the hard one</h2>
      <p>
        It isn't a confidence problem. In a poll of 1,174 Americans, 47% of Gen Z called themselves
        "very confident" in their social skills, about the same as older generations,{' '}
        <a
          href="https://www.cnbc.com/2026/09/21/gen-z-social-skills-confidence-cnbc-survey.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          CNBC reported on 21 September 2026
        </a>
        .
      </p>
      <p>
        Starting is the weak spot. Only 37% of Gen Z and millennials said they often began
        conversations with people they didn't know at school, against 49% of boomers,{' '}
        <a
          href="https://www.surveymonkey.com/curiosity/cnbc-social-skills-pulse-survey/"
          target="_blank"
          rel="noopener noreferrer"
        >
          according to the same CNBC and SurveyMonkey survey
        </a>
        . Openers are a skill, and skills can be borrowed.
      </p>

      <h2 id="formula">A formula for what to say after hi</h2>
      <p>
        <strong>Greeting, one detail, one easy question.</strong> The detail gives them something to
        react to. The question gives them something to answer.
      </p>
      <p>
        "Hi" alone asks them to do all the work. Compare it with "Hi, just finished dinner — what
        time is it where you are?" That asks for five seconds of effort, and shows you'll do your
        share.
      </p>

      <h2 id="lines">12 lines you can borrow</h2>
      <p>
        <strong>Easy.</strong> Five seconds to answer, nothing personal.
      </p>
      <ul>
        <li>Hi! What time is it where you are?</li>
        <li>Hey — good day or long day?</li>
        <li>Hi! What were you doing before this?</li>
        <li>Hello from somewhere very rainy. What's it like there?</li>
      </ul>
      <p>
        <strong>Playful.</strong> A small game in one message.
      </p>
      <ul>
        <li>Hi. Quick one: tea or coffee?</li>
        <li>Hey! Tell me one thing you ate today.</li>
        <li>Hi — I'm avoiding work. What are you avoiding?</li>
        <li>Hello! Rate your day out of ten.</li>
      </ul>
      <p>
        <strong>A little deeper.</strong> Only once they've matched your energy.
      </p>
      <ul>
        <li>Hi. What's taking up your head this week?</li>
        <li>Hey — what are you looking forward to?</li>
        <li>Hi! Learned anything odd lately?</li>
        <li>Hello. What would you be doing if you weren't here?</li>
      </ul>
      <p>
        Used all twelve? The{' '}
        <Link href="/random-question-generator">random question generator</Link> has more, sorted by
        how much effort they take to answer.
      </p>

      <h2 id="avoid">Replies that end it early</h2>
      <p>
        Some replies make it harder to work out what to say after hi, because they leave the other
        person nothing to answer. These four are the usual culprits.
      </p>
      <ul>
        <li>
          <strong>"asl?" as an opener.</strong> It turns a chat into a form. Here is{' '}
          <Link href="/blog/asl-meaning-in-chat">what asl means and how to answer it</Link>.
        </li>
        <li>
          <strong>"wyd" on its own.</strong> It hands the work straight back.
        </li>
        <li>
          <strong>Three questions at once.</strong> Ask one, then respond to the answer.
        </li>
        <li>
          <strong>Comments on looks.</strong> From a stranger, they land as pressure.
        </li>
      </ul>

      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Where we stand</p>
        <p>
          We can't write your opener, and we don't suggest lines as you type. What we can do is
          smaller: add an interest before you start and we'll try to match you with someone who
          shares it, which hands you a first topic. If a chat with a real person goes quiet, there's
          a Would You Rather button.
        </p>
      </div>

      <h2 id="practice">What to say after hi gets easier with practice</h2>
      <p>
        Knowing what to say after hi isn't a talent. It's a habit: greet, add a detail, ask one easy
        thing. Try it five times tonight and the sixth will write itself.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/what-to-say-when-conversation-dies-stranger-chat">
          what to say when a conversation dies
        </Link>
        ,{' '}
        <Link href="/blog/50-best-questions-to-ask-strangers-online-to-keep-conversations-going">
          50 questions to ask strangers online
        </Link>
        , and <Link href="/blog/dry-texting-how-to-fix">how to fix dry texting</Link>. Got a line
        ready? <Link href="/chat">Start a text chat</Link>.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
