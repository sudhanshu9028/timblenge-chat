/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'wrong-number-text-scam',
  title: "Got a Wrong Number Text? Here's What Happens If You Reply",
  seoTitle: 'Wrong Number Text Scam: What Happens If You Reply',
  description:
    'A wrong number text looks harmless: "Hi, is this Priya?" How the scam unfolds over weeks, the three tells that give it away, and what to do if you replied.',
  keywords: [
    'wrong number text scam',
    'wrong number text',
    'should i reply to a wrong number text',
    'hi is this text scam',
    'pig butchering scam',
    'whatsapp wrong number scam india',
    'unknown number text what to do',
  ],
  publishedDate: '2026-09-24',
  modifiedDate: '2026-09-24',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Safety',
};

export const faqItems = [
  {
    question: 'Should I reply to a wrong number text?',
    answer:
      'No. A reply confirms your number is active and belongs to a real, polite person — exactly what the sender is testing for. If it really was a mistake, the sender loses nothing when you stay quiet. Block the number and delete the message.',
  },
  {
    question: 'What is a pig butchering scam?',
    answer:
      'A long con where a scammer builds a friendship or romance over weeks, then introduces an "investment" on a fake trading or crypto platform. Early small withdrawals seem to work, which builds trust, until larger deposits disappear. The name comes from fattening the pig before the slaughter.',
  },
  {
    question: 'What should I do if I already replied to a wrong number text?',
    answer:
      'Stop replying, block the number and report it. Never install an app, click a link or send money. In India, report on cybercrime.gov.in or call 1930; in the US, use ReportFraud.ftc.gov. If money has already gone, report within hours — the sooner it is flagged, the better the chance funds can be frozen.',
  },
];

export default function WrongNumberTextScam({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#how-it-unfolds">How the scam unfolds</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#why-it-works">Why it works on smart people</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#tells">Three tells it isn't a real mistake</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#replied">If you already replied</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        It arrives from a number you don't know: "Hi, is this Priya? Are we still on for dinner?"
        Replying to a wrong number text feels like basic politeness. For the person who sent it,
        that polite reply is the whole point.
      </p>

      <h2 id="how-it-unfolds">How the wrong number text scam unfolds</h2>
      <p>
        It's slow on purpose. The sender apologises, then suggests you could be friends anyway, and
        the chat moves to WhatsApp or Telegram.
      </p>
      <p>
        Weeks of friendly or flirty messages follow. Then they mention how well their investing is
        going, and offer to show you. Small early "profits" can even be withdrawn, until you deposit
        more and it all disappears.
      </p>
      <p>
        The US Federal Trade Commission describes this exact pattern: a fake friendship, often with
        romantic undertones, that turns into a bogus investment platform,{' '}
        <a
          href="https://www.ftc.gov/news-events/news/press-releases/2025/04/new-ftc-data-show-top-text-message-scams-2024-overall-losses-text-scams-hit-470-million"
          target="_blank"
          rel="noopener noreferrer"
        >
          according to the FTC in April 2025
        </a>
        . It's known as pig butchering.
      </p>

      <h2 id="why-it-works">Why it works on smart people</h2>
      <p>
        Because it doesn't feel like a scam. There's no urgent link and no threat — just a patient,
        friendly person who seems to have their life together. A wrong number text also costs
        nothing to send in bulk, so it only needs a few polite people to answer.
      </p>
      <p>
        The money involved is enormous. Consumers reported losing $16 billion to fraud in 2025, up
        25% on the year before,{' '}
        <a
          href="https://www.ftc.gov/news-events/news/press-releases/2026/06/ftc-data-show-people-reported-losing-3-point-5-billion-imposter-scams-2025"
          target="_blank"
          rel="noopener noreferrer"
        >
          the FTC said on 15 June 2026
        </a>
        .
      </p>
      <p>
        In India, people lost ₹22,495 crore to cyber fraud in 2025, and investment scams made up 76%
        of it,{' '}
        <a
          href="https://theprint.in/india/cybercrime-saw-24-spike-in-2025-indians-lost-rs-22495-crore-mainly-in-investment-scams/2859930/"
          target="_blank"
          rel="noopener noreferrer"
        >
          ThePrint reported on 21 February 2026
        </a>{' '}
        from Home Ministry data. Investment is exactly where these chats lead.
      </p>

      <h2 id="tells">Three tells it isn't a real mistake</h2>
      <ul>
        <li>
          <strong>They keep talking after the apology.</strong> A real wrong number says sorry and
          leaves. A scammer finds a reason to stay.
        </li>
        <li>
          <strong>A polished photo arrives early.</strong> Attractive, well-lit and often stolen
          from someone else's profile.
        </li>
        <li>
          <strong>Money enters the chat.</strong> A trading app, crypto, a "mentor" — or in India,
          often a "part-time job" rating hotels or liking videos for small payouts.
        </li>
      </ul>

      <h2 id="replied">What to do if you already replied</h2>
      <p>
        Stop replying, block the number and report it. Never install an app, click a link or send a
        "small test amount".
      </p>
      <p>
        In India, report on cybercrime.gov.in or call 1930. In the US, use ReportFraud.ftc.gov — and
        if money has gone, report within hours, while there's still a chance to freeze it.
      </p>

      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Where we stand</p>
        <p>
          On Anoniz nobody gets your number, so nobody can text you out of the blue later. But a
          stranger in any chat can still try to steer you somewhere else. If someone you just met
          brings up investing or a trading app, leave — we can't screen for every script.
        </p>
      </div>

      <h2 id="ignore">Let the wrong number text go unanswered</h2>
      <p>
        A wrong number text costs nothing to ignore. If it really was a mistake, the sender will
        work it out; if it wasn't, silence ends the scam before it starts.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/how-to-stay-safe-chatting-with-strangers-online">
          how to stay safe chatting with strangers
        </Link>
        ,{' '}
        <Link href="/blog/video-call-sextortion-what-to-do">
          what to do about video call sextortion
        </Link>
        , and{' '}
        <Link href="/blog/give-your-number-to-a-stranger">
          whether to give your number to someone online
        </Link>
        . Want to talk to strangers on your own terms? <Link href="/chat">Anoniz text chat</Link>{' '}
        needs no number.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
