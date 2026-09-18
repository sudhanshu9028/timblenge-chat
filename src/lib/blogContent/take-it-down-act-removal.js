/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import FaqAccordion from '@/app/components/FaqAccordion';

export const frontmatter = {
  slug: 'take-it-down-act-removal',
  title: 'Take It Down Act: How to Get Fake Nudes Removed',
  seoTitle: 'Take It Down Act: How to Get Fake Nudes Removed',
  description:
    'The Take It Down Act gives US platforms 48 hours to remove intimate images, real or AI-made. India gives them 24. Here is how to use both rules.',
  keywords: [
    'take it down act',
    'take it down act enforcement',
    'how to remove fake nudes',
    'ai deepfake nude removal',
    'non consensual intimate images removal india',
    'stopncii',
    'nudification app ban',
  ],
  publishedDate: '2026-09-18',
  modifiedDate: '2026-09-18',
  author: 'Anoniz Team',
  readTime: '3 min read',
  category: 'Safety',
};

export const faqItems = [
  {
    question: 'What does the Take It Down Act require platforms to do?',
    answer:
      'Covered platforms must run a process for people to request removal of non-consensual intimate images, and once a valid request arrives they must take the content down — plus any known identical copies — within 48 hours. The law explicitly covers "digital forgeries", meaning images altered or generated with AI. The FTC began enforcing that section on 19 May 2026.',
  },
  {
    question: 'How do I get intimate images removed in India?',
    answer:
      'Rule 3(2)(b) of the IT Rules requires intermediaries to remove non-consensual intimate imagery, including morphed images, within 24 hours of a complaint. MeitY issued a standard operating procedure in October 2025 after a Madras High Court direction. You can complain through the platform, the National Cyber Crime Reporting Portal at cybercrime.gov.in, a One Stop Centre, or your local police station.',
  },
  {
    question: 'Do I have to send anyone the image to get it taken down?',
    answer:
      "No. StopNCII.org creates a digital fingerprint, or hash, of the image on your own device and shares only that with partner platforms, which then block matching uploads. NCMEC's Take It Down service works the same way for images of people under 18. The picture itself never leaves your phone or computer.",
  },
];

export default function TakeItDownActRemoval({ styles }) {
  return (
    <>
      <nav className={styles.toc}>
        <h2 className={styles.tocTitle}>In This Article</h2>
        <ol className={styles.tocList}>
          <li className={styles.tocItem}>
            <a href="#what-it-requires">What the Act requires</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#india">India's 24-hour rule</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#teeth">The laws are getting teeth</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#tools">Tools that work alongside</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#if-it-happens">If it happens to you</a>
          </li>
          <li className={styles.tocItem}>
            <a href="#faq">Frequently Asked Questions</a>
          </li>
        </ol>
      </nav>

      <p>
        An AI-made nude of someone who never took the photo is now treated like the real thing by
        law. The Take It Down Act gives US platforms 48 hours to remove it, and India's rules give
        them 24.
      </p>

      <h2 id="what-it-requires">What the Take It Down Act requires</h2>
      <p>
        The Take It Down Act obliges covered platforms to run a request process for non-consensual
        intimate images. Once a valid request arrives, the platform must remove the content and any
        known identical copies within 48 hours. Crucially, that covers "digital forgeries" — images
        altered or generated with AI.
      </p>
      <p>
        Enforcement is real: the FTC{' '}
        <a
          href="https://www.ftc.gov/news-events/news/press-releases/2026/05/ftc-begins-enforcing-take-it-down-act"
          target="_blank"
          rel="noopener noreferrer"
        >
          took over that section on 19 May 2026
        </a>
        , after warning at least 15 companies days earlier. Rule violations carry civil penalties of
        up to $53,088 each.
      </p>

      <h2 id="india">India's rule is faster on paper</h2>
      <p>
        India already requires intermediaries to remove non-consensual intimate imagery within 24
        hours of a complaint under Rule 3(2)(b), including morphed images. MeitY issued a standard
        operating procedure in October 2025, after a direction from the Madras High Court, to make
        that work in practice.
      </p>
      <p>
        You can report through a platform's in-app tools, the National Cyber Crime Reporting Portal
        at cybercrime.gov.in, a One Stop Centre, or your local police station. Large platforms are
        also expected to use hash-matching to stop the same image being re-uploaded.
      </p>

      <h2 id="teeth">The laws are getting teeth</h2>
      <p>
        Minnesota's ban on "nudification" tools took effect on 1 August 2026, with civil penalties
        of $500,000 per violation. xAI challenged it, and on 4 September 2026 a federal judge{' '}
        <a
          href="https://www.mprnews.org/story/2026/09/04/judge-lets-minnesota-enforce-antinudification-app-law-over-xai-objection-as-case-proceeds"
          target="_blank"
          rel="noopener noreferrer"
        >
          refused to block the law
        </a>
        , finding the harm from nudification technology outweighed the company's free speech
        argument.
      </p>
      <p>
        That case is still running, and xAI is seeking review in the Eighth Circuit. But the
        direction of travel is clear: the tools, not just the people posting, are now a target.
      </p>

      <h2 id="tools">Tools that work alongside the law</h2>
      <ul>
        <li>
          <strong>
            <a href="https://stopncii.org" target="_blank" rel="noopener noreferrer">
              StopNCII.org
            </a>
          </strong>{' '}
          — for adults. Your device creates a digital fingerprint of the image; partner platforms
          block matches without you uploading the picture.
        </li>
        <li>
          <strong>
            <a href="https://takeitdown.ncmec.org" target="_blank" rel="noopener noreferrer">
              Take It Down
            </a>
          </strong>{' '}
          — NCMEC's version for images of people under 18, including AI-generated ones.
        </li>
        <li>
          <strong>The platform's own form.</strong> In the US this is the process the Act requires
          them to have, so use it and keep the reference number.
        </li>
      </ul>

      <h2 id="if-it-happens">If it happens to you</h2>
      <p>
        Save the evidence before anything else: the post URL, the account, the date, and
        screenshots. Then file the platform request, and report to police — 1930 or
        cybercrime.gov.in in India, tips.fbi.gov in the US.
      </p>
      <p>
        Don't negotiate with whoever sent it. If there's a demand for money attached, that's
        blackmail rather than a leak, and we covered exactly what to do in the{' '}
        <Link href="/blog/video-call-sextortion-what-to-do">
          first hour of a sextortion attempt
        </Link>
        .
      </p>

      <h2 id="takeaway">The takeaway</h2>
      <p>
        What the Take It Down Act closed is the excuse that a fake isn't really you. Between a
        48-hour clock in the US, 24 hours in India, and hash-matching services on both sides,
        removal is now a process to follow rather than a favour to beg for.
      </p>
      <p>
        Related:{' '}
        <Link href="/blog/spot-red-flags-random-video-chat-safety-2026">
          how to spot red flags on random video chat
        </Link>{' '}
        and{' '}
        <Link href="/blog/how-to-stay-safe-chatting-with-strangers-online">
          how to stay safe chatting with strangers
        </Link>
        . Anoniz doesn't record or store conversations — but assume anyone on a camera can, and act
        accordingly.
      </p>

      <div className={styles.faqSection}>
        <h2 id="faq">Frequently Asked Questions</h2>
        <FaqAccordion items={faqItems} />
      </div>
    </>
  );
}
