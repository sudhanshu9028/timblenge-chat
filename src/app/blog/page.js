import Link from 'next/link';
import { BLOG_POSTS } from '@/lib/blogRegistry';
import styles from '@/styles/blog.module.scss';

export const metadata = {
  title: 'Blog | Anoniz — Tips, Guides & Insights on Random Chat',
  description:
    'Explore articles on random chat safety, Omegle alternatives, making friends online, and more. Expert tips and guides from the Anoniz team.',
  keywords: [
    'anoniz blog',
    'random chat tips',
    'omegle alternatives blog',
    'online chat guides',
    'stranger chat safety',
    'video chat tips',
    'make friends online guide',
    'anonymous chat articles',
  ],
  alternates: {
    canonical: 'https://anoniz.com/blog',
  },
  openGraph: {
    title: 'Blog | Anoniz — Tips, Guides & Insights on Random Chat',
    description:
      'Explore articles on random chat safety, Omegle alternatives, making friends online, and more.',
    url: 'https://anoniz.com/blog',
    type: 'website',
  },
};

export default function BlogPage() {
  return (
    <div className={styles.blogPage}>
      <div className={styles.container}>
        <header className={styles.header}>
          <h1 className={styles.title}>Blog</h1>
          <p className={styles.subtitle}>
            Tips, guides, and insights on chatting with strangers, staying safe online, and making
            meaningful connections.
          </p>
        </header>

        <div className={styles.postsGrid}>
          {BLOG_POSTS.map((post) => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className={styles.postCard}>
              <div className={styles.postCategory}>{post.category}</div>
              <h2 className={styles.postTitle}>{post.title}</h2>
              <p className={styles.postDescription}>{post.description}</p>
              <div className={styles.postMeta}>
                <span className={styles.postDate}>
                  {new Date(post.publishedDate).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </span>
                <span className={styles.postReadTime}>{post.readTime}</span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
