/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'do-social-media-bans-work',
  title: 'Do Social Media Bans Work? France Just Started One, Australia Has the Data',
  seoTitle: 'Do Social Media Bans Work? Australia Has the Data',
  description:
    "France started its under-15 ban on 1 September. Australia's regulator found 8 in 10 under-16s still online. Do social media bans work? The evidence so far.",
  keywords: [
    'do social media bans work',
    'australia social media ban results',
    'france social media ban under 15',
    'is the australian social media ban working',
    'social media age verification 2026',
    'under 16 social media ban countries',
    'social media ban teens vpn',
  ],
  publishedDate: '2026-09-18',
  modifiedDate: '2026-09-18',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Culture',
};

export const faqItems = [
  {
    question: "Is Australia's under-16 social media ban working?",
    answer:
      "Not as intended. Three months after the ban began on 10 December 2025, Australia's eSafety regulator found more than eight in ten under-16s were still using social media: 81% were on age-restricted platforms, against 86% before the ban, and daily use had barely shifted. About half of the children who kept their accounts said the platform never checked their age at all.",
  },
  {
    question: 'When does the French under-15 social media ban take effect?',
    answer:
      'In two stages. From 1 September 2026, under-15s cannot create new accounts on major social media platforms. Existing accounts held by under-15s are to be closed from January 2027. The law passed parliament on 21 July 2026, making France the first EU country to attempt a blanket ban for that age group.',
  },
  {
    question: 'Do these bans affect adults?',
    answer:
      "Yes, indirectly. To keep under-15s or under-16s out, a platform has to check everyone, which is why more sites now ask for an ID or a face scan before letting you in. The privacy cost of a teen ban lands on adult users too — one of the main objections raised by the bans' critics in both countries.",
  },
];

export default function DoSocialMediaBansWork({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#short-answer">The short answer</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#australia">What Australia's numbers show</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#france">What France is doing now</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#leaks">Why these bans leak</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#adults">What it means if you're over 18</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        France began blocking under-15s from opening social media accounts on 1 September. Australia
        tried the same thing nine months earlier, and its own regulator has now measured what
        happened.
      </p>

      <h2 id="short-answer">The short answer</h2>
      <p>
        Do social media bans work? On the evidence so far, not the way they were sold. Three months
        after Australia's under-16 ban began, its eSafety regulator found more than eight in ten
        under-16s were still using social media — and most had needed no clever workaround, because
        platforms never checked their age.
      </p>

      <h2 id="australia">What Australia's numbers actually show</h2>
      <p>
        Before the ban, 86% of surveyed children used age-restricted platforms. Three months in, 81%
        still did, and daily use had barely moved: 58%, against roughly 60% beforehand,{' '}
        <a
          href="https://www.aljazeera.com/news/2026/8/3/australias-under-16-social-media-ban-failing-study-shows-what-it-means"
          target="_blank"
          rel="noopener noreferrer"
        >
          Al Jazeera reported on 3 August 2026
        </a>
        .
      </p>
      <p>
        About half of the children who kept their accounts said the platform simply never asked
        their age. Assistant minister Andrew Leigh defended the law anyway: "We never expected 100
        percent compliance."
      </p>

      <h2 id="france">What France is doing now</h2>
      <p>
        France's parliament passed its under-15 ban on 21 July 2026, making it the first EU country
        to try one. New accounts are blocked from 1 September 2026, and existing under-15 accounts
        are to be closed from January 2027.
      </p>
      <p>
        Opponents in parliament argued the law is unenforceable and would effectively end online
        anonymity for everyone, since proving a user is 15 means checking everybody.
      </p>

      <h2 id="leaks">Why these bans leak</h2>
      <ul>
        <li>
          <strong>Age assurance is the weak link.</strong> A ban is only as good as the check behind
          it, and the checks are inconsistent or absent.
        </li>
        <li>
          <strong>Teens route around it.</strong> Researchers cited by Al Jazeera describe VPNs,
          borrowed ID, tricks to fool face scans, and moves to less-regulated apps.
        </li>
        <li>
          <strong>Traffic moves, it doesn't stop.</strong> Push under-16s off ten named platforms
          and they land somewhere with less moderation, not offline.
        </li>
        <li>
          <strong>Games and smaller apps sit outside.</strong> Australia's list covers ten
          platforms; plenty of social spaces aren't on it.
        </li>
      </ul>

      <h2 id="adults">What it means if you're over 18</h2>
      <p>
        Ask whether social media bans work and you get an answer aimed at children, but the bill
        arrives at every adult's door. The machinery built to check teenagers checks everyone.
        That's why sites that never asked your age now want a face scan or an ID, and why your
        answer is worth thinking about before you upload anything.
      </p>
      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Where we stand</p>
        <p>
          Anoniz is 18+ behind an age confirmation, and we don't ask for your ID or a selfie. We'd
          rather say plainly what that does and doesn't prove: it sets a rule for our side, and it
          tells you nothing about the person you get matched with. Judge that person by how they
          behave.
        </p>
      </div>

      <h2 id="verdict">So, do they work?</h2>
      <p>
        Do social media bans work? Not yet — they have moved teenagers around rather than off, while
        normalising identity checks for adults who were never the target. France's own numbers will
        be the next real test, and they won't arrive until well into 2027.
      </p>
      <p>
        Whether social media bans work in the end depends on something nobody has solved: proving
        someone's age without collecting everyone's identity.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/why-websites-verify-your-age-2026">
          why every website suddenly wants your age
        </Link>{' '}
        and{' '}
        <Link href="/blog/anonymous-chat-age-verification-2026">
          what age verification means for anonymous chat
        </Link>
        . If you're over 18 and want a conversation without an account,{' '}
        <Link href="/chat">Anoniz text chat</Link> is open.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
