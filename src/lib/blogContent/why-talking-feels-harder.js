/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'why-talking-to-people-feels-harder-now',
  title: 'Why Does Talking to People Feel So Much Harder Now?',
  description:
    "Over half of Gen Z say their in-person social skills have declined, and nine in ten would rather text than call. Here is what's actually happening — and how it reverses.",
  keywords: [
    'why is talking to people so hard now',
    'phone call anxiety gen z',
    'why do i hate phone calls',
    'social skills getting worse',
    'losing conversation skills',
    'how to get better at talking to people again',
    'small talk feels exhausting',
  ],
  publishedDate: '2026-09-04',
  modifiedDate: '2026-09-04',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Psychology',
};

export const faqItems = [
  {
    question: 'Is it true that people are getting worse at conversation?',
    answer:
      'By their own account, yes. Over half of Gen Z report that their in-person social skills have declined, and around one in four say their verbal communication specifically has got worse. Nine in ten would rather text than take a phone call, and some describe calls as a phobia rather than a preference.',
  },
  {
    question: 'Why do phone calls feel so much worse than texting?',
    answer:
      "Because a call is live and unedited. Texting lets you draft, reread and delete before anyone sees it; a call gives you none of that, in front of someone whose reaction you can't predict. It isn't laziness — it's the removal of a safety net you've come to rely on.",
  },
  {
    question: 'Does avoiding conversation make the anxiety worse?',
    answer:
      'Generally yes. Avoidance gives immediate relief, which trains your brain to avoid again next time, while the underlying skill quietly gets rustier. The discomfort grows not because something is wrong with you but because the gap between practice sessions keeps widening.',
  },
  {
    question: 'How do I get better at it again?',
    answer:
      'Deliberately, in situations where failure costs nothing. Low-stakes conversations with people you will never meet again rebuild fluency without the social risk of practising on colleagues or friends. Frequency matters far more than length — several short conversations beat one long one.',
  },
];

export default function WhyTalkingFeelsHarder({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#is-it-me">Is it just me, or is everyone worse at this?</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#why-calls">Why phone calls feel especially threatening</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#avoidance">What avoiding it actually costs</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#rebuild">How the skill comes back</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        You draft a two-line message four times. A call comes in and your stomach drops. Someone
        asks a question in a shop and the answer arrives half a second too late. If that's familiar,
        it isn't a personal failing — it's a measurable, documented shift.
      </p>

      <h2 id="is-it-me">Is it just me, or is everyone worse at this?</h2>
      <p>
        It's not just you.{' '}
        <strong>Over half of Gen Z say their in-person social skills have declined</strong>, and
        around one in four say their verbal communication specifically has got worse. Nine in ten
        would rather text than talk on the phone — and researchers found that's driven by anxiety
        rather than convenience, with some teenagers naming an awkward phone call among the top
        three things they'd most like to avoid in life.
      </p>
      <p>
        The most telling number is smaller and stranger: roughly 15% say that if they were lost
        without their phone, they wouldn't ask a stranger for directions. Not couldn't — wouldn't.
      </p>

      <h2 id="why-calls">Why phone calls feel especially threatening</h2>
      <p>
        Because a call is live, unedited, and permanent in a way a message isn't. Texting gives you
        a draft, a reread and a delete key. A call gives you none of those, in real time, in front
        of someone whose reaction you can't see coming. Every hesitation is audible.
      </p>
      <p>
        Most people who grew up messaging never built tolerance for that exposure, because they
        never had to. The landline disappeared, and with it the daily practice of talking to someone
        without a script.
      </p>

      <h2 id="avoidance">What avoiding it actually costs</h2>
      <p>
        Avoidance works — that's the problem. Dodging the call brings instant relief, and relief is
        a powerful teacher. Your brain files it as the correct move, so the next call feels slightly
        worse, and the gap between practice sessions widens.
      </p>
      <p>
        Meanwhile the skill itself gets rusty. Reading tone, tolerating a pause, recovering from
        saying something slightly wrong — these are trained abilities, and they fade without use.
        The discomfort you feel isn't evidence that you're bad at conversation. It's evidence that
        you're out of practice, which is a much more fixable thing.
      </p>

      <h2 id="rebuild">How the skill comes back</h2>
      <p>
        The same way it faded: through repetition, in conditions where the stakes are low enough
        that failure doesn't matter.
      </p>
      <ul>
        <li>
          <strong>Pick conversations with no consequences.</strong> Someone you'll never meet again
          can't tell your friends, judge you next week, or remember it at all.
        </li>
        <li>
          <strong>Go short and often.</strong> Five two-minute conversations rebuild more fluency
          than one thirty-minute one, because most of the difficulty lives in the first minute.
        </li>
        <li>
          <strong>Let some of them go badly.</strong> A conversation that fizzles is the actual
          exercise — proving that nothing happens afterwards is the point.
        </li>
      </ul>

      <div className={styles.tipBox}>
        <span className={styles.tipLabel}>The lowest-stakes version</span>
        <p>
          Anonymous text chat removes almost every variable that makes practice frightening: no
          name, no history, no audience, and a Next button whenever you want one. Start there, and
          move to video once the first minute stops feeling like a performance.
        </p>
      </div>

      <p>
        More on this:{' '}
        <Link href="/blog/how-to-practice-social-skills-and-overcome-anxiety-online">
          a step-by-step way to practise social skills online
        </Link>
        , and{' '}
        <Link href="/blog/science-of-talking-to-strangers-research-benefits">
          the research on why strangers like talking to you more than you expect
        </Link>
        . Or <Link href="/chat">try a conversation now</Link>.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
