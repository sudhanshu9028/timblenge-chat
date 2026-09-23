/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'discord-age-verification',
  title: "Discord Age Verification Is Live: What 'Unconfirmed' Means and What Each Check Stores",
  seoTitle: 'Discord Age Verification Is Live: What Changes',
  description:
    'Discord age verification began this week. What the Adult, Teen and Unconfirmed labels mean, what each age check stores, and which is least revealing.',
  keywords: [
    'discord age verification',
    'discord unconfirmed account',
    'discord age verification without id',
    'is discord age verification safe',
    'discord age verification privacy',
    'discord teen by default',
    'discord face scan',
  ],
  publishedDate: '2026-09-24',
  modifiedDate: '2026-09-24',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Safety',
};

export const faqItems = [
  {
    question: 'What does Unconfirmed mean on Discord?',
    answer:
      "It means Discord's automatic check couldn't tell whether you are an adult. Unconfirmed accounts get teen-style limits — messages from non-friends go to a requests inbox and adult-only servers are blocked — until you verify with one of the methods Discord offers in your region.",
  },
  {
    question: 'Do I have to upload my ID to Discord?',
    answer:
      'No. An ID scan is one option among several. Depending on where you live, you can also confirm with a credit card, the Apple App Store or Google Play, Google Wallet, an AgeKey credential, or a video selfie. Discord expects about 90% of people to be sorted automatically and asked nothing at all.',
  },
  {
    question: 'Is Discord age verification safe?',
    answer:
      'Discord says vendors must permanently delete your information once a check is done, and that face estimation runs on your own device. It also had a vendor breach in October 2025 that exposed at least 70,000 ID photos, which is why the options that prove only your age are the sensible first choice.',
  },
];

export default function DiscordAgeVerification({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#three-groups">Discord age verification sorts you into three groups</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#methods">Each check hands over something different</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#wary">Why people are wary of the ID option</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#today">What to do about it today</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        If Discord asked how old you are this week, you're not the only one. Discord age
        verification began rolling out on 22 September, sorting every account into Adult, Teen or
        Unconfirmed,{' '}
        <a
          href="https://www.engadget.com/2265924/discord-rolls-out-its-revised-age-verification-policy/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Engadget reported on 22 September 2026
        </a>
        . Here is what each label does, and what each way of proving your age actually hands over.
      </p>

      <h2 id="three-groups">Discord age verification sorts you into three groups</h2>
      <p>
        Discord guesses first. It looks at how old your account is, which servers you're in and how
        you use the app, and it expects about 90% of people to need no further step.
      </p>
      <p>
        If you land in Unconfirmed, you get teen-style limits until you prove otherwise. Messages
        from people who aren't your friends go to a requests inbox. Adult-only servers and age-gated
        content are blocked, and your profile is visible only to friends and small servers.
      </p>
      <p>
        This is the rollout Discord delayed earlier in the year after a backlash against treating
        everyone as a teen by default. The revised version guesses more and asks less, but the
        fallback is the same.
      </p>

      <h2 id="methods">Each check hands over something different</h2>
      <p>
        Discord age verification options vary by country, and they are not equal. Some prove one
        fact about you; others hand over your whole identity.
      </p>
      <ul>
        <li>
          <strong>Credit card or app store.</strong> Confirms you're an adult through a payment
          account you already have. Little new data changes hands, though it links your Discord to a
          billing identity.
        </li>
        <li>
          <strong>Google Wallet or AgeKey.</strong> A reusable age credential. It says "over 18"
          without sending a document at all.
        </li>
        <li>
          <strong>Video selfie.</strong> Facial age estimation, which Discord says runs completely
          on your own device.
        </li>
        <li>
          <strong>ID scan.</strong> The most exposing option by far: your name, photo, date of birth
          and often your address, sent to a third-party vendor. Discord says vendors must
          permanently delete it once the check is done.
        </li>
      </ul>

      <h2 id="wary">Why people are wary of the ID option</h2>
      <p>
        Because it has gone wrong before. In October 2025, Discord disclosed that a third-party
        support vendor had been breached, exposing at least 70,000 government ID photos that users
        had submitted for age appeals,{' '}
        <a
          href="https://techcrunch.com/2025/10/09/discord-suffers-data-breach-impacting-at-least-70000-users"
          target="_blank"
          rel="noopener noreferrer"
        >
          TechCrunch reported on 9 October 2025
        </a>
        .
      </p>
      <p>
        A deletion promise covers what a vendor does after the check. It can't protect a copy that
        is stolen before then. That's the case for choosing a method that proves an attribute rather
        than an identity.
      </p>

      <div className={styles.tipBox}>
        <p className={styles.tipLabel}>Where we stand</p>
        <p>
          Anoniz asks you to confirm you're 18 or over, and nothing else — no ID, no selfie. That
          also means we're not a Discord replacement: no servers, no history, no community that
          remembers you. We're for one conversation with one stranger, and it's gone when it ends.
        </p>
      </div>

      <h2 id="today">What to do about Discord age verification today</h2>
      <p>
        If Discord age verification hasn't asked you anything, you're probably in the group it
        sorted automatically. There's nothing to do.
      </p>
      <p>
        If it has asked, start with whichever option proves only your age — a card, an app store, a
        wallet credential or the on-device selfie. Keep the ID scan as the last resort, not the
        first click.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/anonymous-chat-age-verification-2026">
          what age verification means for anonymous chat
        </Link>{' '}
        and{' '}
        <Link href="/blog/why-websites-verify-your-age-2026">
          why every website suddenly wants your age
        </Link>
        . If you'd rather talk to someone without handing over a document,{' '}
        <Link href="/chat">Anoniz text chat</Link> is open to adults.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
