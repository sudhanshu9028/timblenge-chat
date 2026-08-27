/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'lonely-in-college-meet-people-online-2026',
  title: 'Lonely in College? How to Meet People Online When Campus Life Feels Isolating',
  description:
    "Over half of college students report feeling lonely in 2026. If campus life isn't clicking, here's how to find real connection online — no awkward mixers required.",
  keywords: [
    'lonely in college',
    'college loneliness 2026',
    'meet people online college',
    'making friends in college',
    'freshman loneliness',
    'how to socialize in college',
    'college student chat online',
    'feeling isolated at university',
  ],
  publishedDate: '2026-08-19',
  modifiedDate: '2026-08-19',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Lifestyle',
};

export const faqItems = [
  {
    question: 'Is it normal to feel lonely in college?',
    answer:
      "Extremely. A 2026 Georgetown study found that over 54% of college students report feeling lonely — with freshmen and students under 25 being the most affected. If you're feeling it, you are genuinely in the majority, not the minority.",
  },
  {
    question: 'Can talking to strangers online actually help with college loneliness?',
    answer:
      "It can supplement real-world connection, yes. Anonymous chat gives you low-stakes social practice and immediate human contact when your dorm room feels too quiet. It's not a replacement for campus friendships, but it can bridge the gap while you're still building them.",
  },
  {
    question: "Isn't it weird to chat with random strangers instead of making campus friends?",
    answer:
      "Not at all. Think of it as warming up before the game. Many students use anonymous chat to practice conversation, ease social anxiety, or simply feel less alone on a Friday night when plans fell through. It's a tool, not a substitute.",
  },
];

export default function LonelyInCollegeMeetPeople({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#the-loneliness-nobody-talks-about">The Loneliness Nobody Talks About</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#why-college-feels-lonelier">Why College Feels Lonelier Than Expected</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#the-social-media-trap">The Social Media Trap on Campus</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#what-actually-helps">What Actually Helps</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        You're surrounded by thousands of people your own age, and somehow you've never felt more
        alone. If that's you right now — sitting in your dorm, scrolling through everyone else's
        highlight reel — you should know that what you're feeling is statistically normal. More than
        half of college students in 2026 report feeling lonely. You're not broken. The system is
        just harder than anyone warned you about.
      </p>

      <h2 id="the-loneliness-nobody-talks-about">The Loneliness Nobody Talks About</h2>
      <p>
        College is sold as the "best four years of your life." That expectation alone is enough to
        make anyone feel like they're failing when the reality doesn't match. The truth is that
        building a social circle from scratch — in a new city, with new routines, surrounded
        entirely by strangers — is genuinely hard. It takes time, repeated exposure, and a kind of
        social energy that's difficult to summon when you're already feeling low.
      </p>
      <p>
        And the data backs this up. Research from Georgetown University shows that first-year
        students and those under 25 are the most vulnerable to campus loneliness — the exact people
        who are supposed to be having the time of their lives.
      </p>

      <h2 id="why-college-feels-lonelier">Why College Feels Lonelier Than Expected</h2>
      <ul>
        <li>
          <strong>The "proximity ≠ friendship" problem.</strong> Being near people doesn't
          automatically create connection. You can sit in a lecture hall with 300 students and not
          exchange a single word.
        </li>
        <li>
          <strong>Everyone else looks fine.</strong> Loneliness is invisible. The person sitting
          next to you in class might feel exactly the same way, but neither of you says anything
          because you both assume the other is doing great.
        </li>
        <li>
          <strong>The activation energy is high.</strong> Joining a club, walking into a party
          alone, or introducing yourself to a stranger in the dining hall all require a burst of
          social energy that feels enormous when you're already drained.
        </li>
      </ul>

      <h2 id="the-social-media-trap">The Social Media Trap on Campus</h2>
      <p>
        Here's the irony: the thing most students reach for when they feel lonely — their phone — is
        often making it worse. Studies from 2026 show a clear link between spending more than two
        hours a day on social media and increased feelings of loneliness among college students.
        Scrolling through Instagram stories of people at parties doesn't make you feel connected. It
        makes you feel like you're the only one sitting alone.
      </p>
      <p>
        The fix isn't to go offline entirely. It's to replace the <em>passive</em> scrolling with
        something <em>active</em> — something that gives your brain the social engagement it's
        actually craving.
      </p>

      <h2 id="what-actually-helps">What Actually Helps</h2>
      <ul>
        <li>
          <strong>Lower the bar.</strong> You don't need to find your best friend this week. You
          just need one decent conversation. Start with something zero-pressure: a{' '}
          <Link href="/chat">text chat with a stranger</Link> who shares an interest, a quick
          conversation in the library, even a comment in a Discord server. Small interactions build
          momentum.
        </li>
        <li>
          <strong>Practice in low-stakes environments.</strong> Anonymous chat is genuinely useful
          here. It lets you practice being social without the fear that you'll run into the person
          in your 9 a.m. lecture if things get awkward. Think of it as a social warm-up.
        </li>
        <li>
          <strong>Use interest tags.</strong> When you{' '}
          <Link href="/">meet people through random chat</Link>, you can enter topics you care about
          before matching. Type in your major, a hobby, or a show you're watching — you'd be
          surprised how many other students are online doing exactly the same thing.
        </li>
        <li>
          <strong>Show up repeatedly.</strong> Friendship takes roughly 50 hours of shared time.
          That's not one perfect hangout — it's showing up to the same club meeting, the same study
          group, or the same coffee shop until familiar faces become friends.
        </li>
      </ul>
      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Worth knowing</p>
        <p>
          If loneliness feels persistent and heavy — not just "I wish I had plans tonight" but
          something deeper — please talk to someone at your campus counseling center. They're free,
          they're confidential, and they've heard this exact thing from more students than you'd
          believe.
        </p>
      </div>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
