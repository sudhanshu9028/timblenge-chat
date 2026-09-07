import Link from 'next/link';
import styles from '@/styles/home.module.scss';
import { getBlogBySlug } from '@/lib/blogRegistry';

/**
 * Guides section on the homepage.
 *
 * Two jobs, and both matter.
 *
 * For the reader: the most common reason someone opens a random chat site and
 * closes it again is not knowing what to say. Search Console says the same
 * thing — the largest group of non-brand queries reaching this site is people
 * looking for *questions to ask a stranger*, not for a chat site at all. So the
 * section leads with that rather than with a generic "from the blog" list.
 *
 * For search: the homepage is by far the strongest page on the domain and, until
 * now, linked to no article at all. Every post below was ranking on page two or
 * worse while receiving link equity from nowhere but the blog index. These are
 * hand-picked for that reason — a feed of the newest posts would spend the
 * homepage's authority on whatever happened to be written last.
 *
 * Titles are read from the registry rather than repeated here, so renaming a
 * post can't leave a stale label on the homepage. The hooks are homepage copy:
 * one line saying why *this* reader, about to start a chat, should care.
 */
const GUIDES = [
  {
    slug: '50-best-questions-to-ask-strangers-online-to-keep-conversations-going',
    hook: 'Fifty openers that survive the first thirty seconds.',
  },
  {
    slug: 'what-to-say-when-conversation-dies-stranger-chat',
    hook: 'The silence is recoverable. Here is how.',
  },
  {
    slug: 'would-you-rather-questions-to-get-to-know-someone',
    hook: 'The game built into every chat here, and why it works.',
  },
  {
    slug: 'best-omegle-alternatives-safe-free-random-chat',
    hook: 'An honest comparison, including where we fall short.',
  },
  {
    slug: 'why-did-omegle-shut-down-where-everyone-went-2026',
    hook: 'What actually happened in 2023, and where people went.',
  },
  {
    slug: 'how-to-stay-safe-chatting-with-strangers-online',
    hook: 'What to share, what never to, and how to leave.',
  },
];

export default function HomeGuides() {
  // A missing slug is dropped rather than thrown — the same defensive read the
  // chat and video panels use, so a renamed post degrades to a shorter list
  // instead of a broken homepage.
  const guides = GUIDES.map((entry) => {
    const post = getBlogBySlug(entry.slug);
    return post ? { ...entry, title: post.title, readTime: post.readTime } : null;
  }).filter(Boolean);

  if (guides.length === 0) return null;

  return (
    <section className={styles.guides}>
      <h2 className={styles.sectionTitle}>Not Sure What to Say?</h2>
      <p className={styles.guidesIntro}>
        Nobody is naturally good at talking to strangers — it is a skill, and it is a
        learnable one. These are the guides people find most useful before their first
        conversation.
      </p>

      <div className={styles.guidesGrid}>
        {guides.map((guide) => (
          <Link key={guide.slug} href={`/blog/${guide.slug}`} className={styles.guideCard}>
            <h3 className={styles.guideTitle}>{guide.title}</h3>
            <p className={styles.guideHook}>{guide.hook}</p>
            {guide.readTime ? <span className={styles.guideMeta}>{guide.readTime}</span> : null}
          </Link>
        ))}
      </div>

      <p className={styles.guidesMore}>
        <Link href="/blog" className={styles.guidesMoreLink}>
          Read all our guides →
        </Link>
      </p>
    </section>
  );
}
