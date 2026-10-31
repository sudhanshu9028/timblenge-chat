import Link from 'next/link';
import styles from '@/styles/blog.module.scss';

// Nine fills the 3 × 3 grid on desktop exactly.
const LATEST_COUNT = 9;

// Categories with only a post or two read as noise in a topic list, so they
// share one group at the end instead of each getting a heading.
const MIN_GROUP_SIZE = 3;
const MISC_LABEL = 'More';

const formatDate = (iso) =>
  new Date(iso).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

const anchorFor = (label) => `topic-${label.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

/**
 * The blog index: the newest posts as cards, then every post as a plain link
 * grouped by topic.
 *
 * This used to be a client component that paged through ten cards at a time
 * with buttons. Buttons aren't links, so a crawler saw the ten newest posts and
 * nothing else — everything older was reachable only from the sitemap and the
 * odd in-post link, and eight posts had no internal link at all. Every post is
 * now an `<a href>` in the server-rendered HTML.
 */
export default function BlogList({ posts }) {
  const latest = posts.slice(0, LATEST_COUNT);

  const byCategory = new Map();
  for (const post of posts) {
    const list = byCategory.get(post.category) || [];
    list.push(post);
    byCategory.set(post.category, list);
  }
  const groups = [];
  const misc = [];
  for (const [label, list] of byCategory) {
    if (list.length >= MIN_GROUP_SIZE) groups.push({ label, posts: list });
    else misc.push(...list);
  }
  groups.sort((a, b) => b.posts.length - a.posts.length);
  if (misc.length) groups.push({ label: MISC_LABEL, posts: misc });

  return (
    <>
      <h2 className={styles.sectionHeading}>Latest</h2>
      <div className={styles.postsGrid}>
        {latest.map((post) => (
          <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
            <div className={styles.postCategory}>{post.category}</div>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postDescription}>{post.description}</p>
            <div className={styles.postMeta}>
              <span className={styles.postDate}>{formatDate(post.publishedDate)}</span>
              <span className={styles.postReadTime}>{post.readTime}</span>
            </div>
          </Link>
        ))}
      </div>

      <section className={styles.allPosts} aria-labelledby="all-posts">
        <h2 id="all-posts" className={styles.sectionHeading}>
          All {posts.length} articles by topic
        </h2>
        <nav className={styles.topicNav} aria-label="Topics">
          {groups.map((group) => (
            <a key={group.label} href={`#${anchorFor(group.label)}`} className={styles.topicChip}>
              {group.label} <span className={styles.topicCount}>{group.posts.length}</span>
            </a>
          ))}
        </nav>

        {groups.map((group) => (
          <div key={group.label} id={anchorFor(group.label)} className={styles.topicGroup}>
            <h3 className={styles.topicTitle}>{group.label}</h3>
            <ul className={styles.topicList}>
              {group.posts.map((post) => (
                <li key={post.slug}>
                  <Link href={`/blog/${post.slug}`} className={styles.topicLink}>
                    {post.title}
                  </Link>
                  <span className={styles.topicMeta}>{post.readTime}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
    </>
  );
}
