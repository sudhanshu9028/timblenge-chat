import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getBlogBySlug, getAllSlugs } from '@/lib/blogRegistry';
import BLOG_CONTENT from '@/lib/blogContent';
import styles from '@/styles/blogPost.module.scss';

// ---------------------------------------------------------------------------
// Static generation — only registered slugs get pre-rendered
// ---------------------------------------------------------------------------
export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

// ---------------------------------------------------------------------------
// Per-page SEO metadata
// ---------------------------------------------------------------------------
export function generateMetadata({ params }) {
  const post = getBlogBySlug(params.slug);
  if (!post) return {};

  return {
    // `seoTitle` when a post has one, because the headline that reads well above
    // the article is usually too long for a search result. Google renders about
    // 600px — roughly 60 characters — and every title here used to exceed that
    // once "| Anoniz Blog" was appended, so the value proposition was cut off in
    // the SERP on every single post. The suffix is gone for the same reason: 14
    // characters of brand we can't afford, and Google appends the site name
    // itself when it wants to.
    title: post.seoTitle || post.title,
    description: post.description,
    keywords: post.keywords,
    authors: [{ name: post.author }],
    alternates: {
      canonical: `https://anoniz.com/blog/${post.slug}`,
    },
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://anoniz.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.publishedDate,
      modifiedTime: post.modifiedDate,
      authors: [post.author],
      siteName: 'Anoniz',
      images: [
        {
          url: '/logo.png',
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description,
      images: ['/logo.png'],
    },
  };
}

// ---------------------------------------------------------------------------
// Page component
// ---------------------------------------------------------------------------
export default function BlogPostPage({ params }) {
  const post = getBlogBySlug(params.slug);
  if (!post) notFound();

  const contentData = BLOG_CONTENT[params.slug];
  if (!contentData) notFound();

  const ContentComponent = contentData.component;

  // The FAQ entries come from the same array the visible accordion renders, so
  // the structured data can never drift from what the page actually shows.
  const faqEntities = contentData.faqItems.map(({ question, answer }) => ({
    '@type': 'Question',
    name: question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: answer,
    },
  }));

  // Combined JSON-LD structured data for this blog post
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        datePublished: post.publishedDate,
        dateModified: post.modifiedDate,
        author: {
          '@type': 'Organization',
          name: post.author,
          url: 'https://anoniz.com',
        },
        publisher: {
          '@type': 'Organization',
          name: 'Anoniz',
          url: 'https://anoniz.com',
          logo: {
            '@type': 'ImageObject',
            url: 'https://anoniz.com/logo.png',
          },
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `https://anoniz.com/blog/${post.slug}`,
        },
        image: 'https://anoniz.com/logo.png',
        keywords: post.keywords.join(', '),
      },
      // Only emit an FAQPage node when the post actually has FAQs — an empty
      // one is invalid structured data.
      ...(faqEntities.length ? [{ '@type': 'FAQPage', mainEntity: faqEntities }] : []),
    ],
  };

  return (
    <div className={styles.blogPostPage}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className={styles.container}>
        {/* Breadcrumb */}
        <nav className={styles.breadcrumb} aria-label="Breadcrumb">
          <Link href="/" className={styles.breadcrumbLink}>
            Home
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <Link href="/blog" className={styles.breadcrumbLink}>
            Blog
          </Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{post.title}</span>
        </nav>

        {/* Article Header */}
        <header className={styles.articleHeader}>
          <span className={styles.category}>{post.category}</span>
          <h1 className={styles.articleTitle}>{post.title}</h1>
          <div className={styles.articleMeta}>
            <span>{post.author}</span>
            <span className={styles.metaDivider} />
            <time dateTime={post.publishedDate}>
              {new Date(post.publishedDate).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            <span className={styles.metaDivider} />
            <span>{post.readTime}</span>
          </div>
        </header>

        {/* Article Content */}
        <article className={styles.articleContent}>
          <ContentComponent styles={styles} />

          {/* CTA */}
          <div className={styles.ctaSection}>
            <h2 className={styles.ctaTitle}>Ready to Start Chatting?</h2>
            <p className={styles.ctaText}>
              Join thousands of people chatting with strangers on Anoniz. No registration, no
              downloads — just real conversations with real people.
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/chat" className={styles.ctaButton}>
                Start Text Chat
              </Link>
              <Link href="/video" className={styles.ctaButtonSecondary}>
                Start Video Chat
              </Link>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}
