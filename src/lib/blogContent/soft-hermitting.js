/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'soft-hermitting',
  title: 'Soft Hermitting: Why Gen Z Is Staying In, and When It Stops Helping',
  seoTitle: 'Soft Hermitting: Why Gen Z Is Staying In',
  description:
    "Soft hermitting means turning down plans to stay home, and 77% of Gen Z say it sounds like them. What's driving it, and how to tell rest from retreat.",
  keywords: [
    'soft hermitting',
    'soft hermitting meaning',
    'what is soft hermitting',
    'gen z staying home',
    'jomo vs fomo',
    'soft hermitting trend',
    'staying in every weekend',
  ],
  publishedDate: '2026-10-10',
  modifiedDate: '2026-10-10',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Culture',
};

export const faqItems = [
  {
    question: 'What is soft hermitting?',
    answer:
      'Deliberately turning down plans in favour of staying home. It is a choice rather than full isolation: you still have friends and invitations, you just say no to more of them. In an August 2026 survey of 3,000 Americans aged 18 to 28, 77% said the description sounded like them.',
  },
  {
    question: 'Is soft hermitting bad for you?',
    answer:
      'Not by itself. Saving money and getting your energy back are good reasons to stay in. It becomes a problem when days pass without a real conversation, or when you want company and still find yourself saying no.',
  },
  {
    question: 'How is soft hermitting different from bed rotting?',
    answer:
      'Bed rotting is about how you spend the time: a day in bed, usually scrolling. Soft hermitting is about what you decline. You can turn down a night out and still have a full evening of cooking, reading or a long call with one person.',
  },
];

export default function SoftHermitting({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#meaning">What soft hermitting means</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#why">It's about money and energy more than mood</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#limit">When staying in stops being rest</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#stay-in-touch">Low-pressure ways to stay in touch</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        You were invited. You said "maybe", stayed in, and felt relieved. There is a name for that
        now — soft hermitting — and a survey published this week suggests most of Gen Z does it.
      </p>

      <h2 id="meaning">What soft hermitting means</h2>
      <p>
        It means deliberately turning down plans in favour of staying home. In a survey of 3,000
        Americans aged 18 to 28, 77% said that description sounded like them and only 9% rejected
        it,{' '}
        <a
          href="https://www.globenewswire.com/news-release/2026/10/09/3378307/0/en/papersowl-survey-finds-77-of-us-gen-z-identify-with-soft-hermitting-citing-cost-over-mental-health.html"
          target="_blank"
          rel="noopener noreferrer"
        >
          PapersOwl reported on 9 October 2026
        </a>
        .
      </p>
      <p>
        One caution: PapersOwl is a company, not a research institute. Treat the numbers as a
        snapshot of how people describe themselves, not as a clinical finding.
      </p>

      <h2 id="why">It's about money and energy more than mood</h2>
      <p>
        The reasons are more practical than you might expect. Among people who stay home, 55% said
        socialising drains them, 50% said they simply like being at home, and 42% blamed the cost of
        going out.
      </p>
      <p>
        Mental health came well behind. Of those who enjoy missing out, 61% said it saves money and
        only 29% said the decision was mainly about their mental health.
      </p>
      <p>
        "People are not withdrawing from social life, they are budgeting it," said Jamie Thompson of
        PapersOwl. Seen that way, soft hermitting is less a retreat than a spending decision.
      </p>

      <h2 id="limit">When staying in stops being rest</h2>
      <p>
        There is a cost on the other side. Half of Gen Z, 51%, report feeling lonely at weekends —
        the highest of any generation — and 74% stay in for at least half of them,{' '}
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
        About a third of young adults also said they had gone days without any human interaction in
        the past year,{' '}
        <a
          href="https://discover.swns.com/2026/08/why-gen-z-is-choosing-soft-hermitting-instead-of-partying-in-the-sunshine/"
          target="_blank"
          rel="noopener noreferrer"
        >
          SWNS reported on 6 August 2026
        </a>
        . That is the line worth watching.
      </p>
      <ul>
        <li>
          <strong>You want company and still say no.</strong> Rest feels good. This doesn't.
        </li>
        <li>
          <strong>Days pass without a real conversation.</strong> Likes and reactions don't count.
        </li>
        <li>
          <strong>Staying in no longer feels like a choice.</strong> It has become the only thing
          you do.
        </li>
      </ul>

      <h2 id="stay-in-touch">Low-pressure ways to stay in touch</h2>
      <p>
        You don't have to pick between a night out and silence. In the same PapersOwl survey, 51%
        said they choose hangouts built around an activity rather than around talking.
      </p>
      <ul>
        <li>
          <strong>Do something side by side.</strong> A walk, a meal you cook together, a game.
        </li>
        <li>
          <strong>Message one person tonight.</strong> One real exchange beats ten reactions.
        </li>
        <li>
          <strong>Keep one standing plan a week.</strong> Same day, same person, no organising.
        </li>
        <li>
          <strong>Talk to a stranger for ten minutes.</strong> It costs nothing, and you can leave
          whenever you like.
        </li>
      </ul>

      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Where we stand</p>
        <p>
          A chat with a stranger is not a friendship and won't replace one. What it can do is break
          a silent day at no cost and with no commitment. We can't promise a good conversation every
          time, and at quiet hours text chat may offer our labelled AI instead of a person.
        </p>
      </div>

      <h2 id="verdict">Soft hermitting works until it doesn't</h2>
      <p>
        Soft hermitting is a sensible way to protect your money and your energy. Just keep one line
        open to other people, so that staying in stays a choice.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/bed-rotting-what-your-brain-needs-instead">
          what your brain needs instead of bed rotting
        </Link>
        ,{' '}
        <Link href="/blog/social-battery-dead-lowest-effort-recharge">
          the lowest-effort way to recharge a dead social battery
        </Link>
        , and <Link href="/blog/meet-people-in-real-life">how to meet people in real life</Link>.
        Staying in tonight? <Link href="/chat">A text chat</Link> takes ten minutes and no plans.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
