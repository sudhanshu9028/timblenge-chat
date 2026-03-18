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
    title: `${post.title} | Anoniz Blog`,
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
      {
        '@type': 'FAQPage',
        mainEntity: getFaqItems(params.slug),
      },
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

// ---------------------------------------------------------------------------
// FAQ items for structured data (per slug)
// ---------------------------------------------------------------------------
function getFaqItems(slug) {
  const faqs = {
    'best-omegle-alternatives-safe-free-random-chat': [
      {
        '@type': 'Question',
        name: 'What is the best Omegle alternative in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Based on our testing, Anoniz is the best overall Omegle alternative in 2026. It offers instant anonymous video and text chat with no registration, interest-based matching, and a clean, ad-free interface.',
        },
      },
      {
        '@type': 'Question',
        name: 'Are Omegle alternatives safe to use?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The safety varies between platforms. The best ones use AI-powered moderation, content filtering, and clear community guidelines. Always avoid sharing personal information and use platforms that offer reporting tools.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I use random chat platforms without signing up?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Many top platforms including Anoniz let you start chatting immediately without creating an account or providing any personal information.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is random video chat free?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Most random chat platforms offer free video and text chat. Some charge for premium features like gender filters or ad removal, but the core chat experience is typically free.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which Omegle alternative is best for making friends?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Platforms with interest-based matching tend to produce better conversations and real friendships. Anoniz and Emerald Chat both offer this feature.',
        },
      },
    ],
    'how-to-stay-safe-chatting-with-strangers-online': [
      {
        '@type': 'Question',
        name: 'Is it dangerous to chat with strangers online?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Chatting with strangers carries some inherent risk, but using a reputable platform with moderation features and following basic safety practices dramatically reduces that risk.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can someone find my location through random video chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On reputable platforms, your IP address is not exposed to other users. However, clues in your video background or personal details you share verbally could give away your location. Using a VPN adds extra protection.',
        },
      },
      {
        '@type': 'Question',
        name: 'What should I do if someone harasses me on a chat platform?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Disconnect immediately and use the platform's report feature to flag the user. Do not engage with harassment. If the behavior is severe or threatening, consider reporting it to local authorities.",
        },
      },
      {
        '@type': 'Question',
        name: 'Are anonymous chat platforms really anonymous?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "The best platforms don't require personal information and don't store chat logs. However, your anonymity also depends on what you choose to share during conversations.",
        },
      },
    ],
    'how-to-make-friends-online-talk-to-strangers': [
      {
        '@type': 'Question',
        name: 'Can you actually make real friends through random chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Absolutely. While most random conversations are brief, the sheer volume of interactions means you'll regularly land on people you genuinely connect with. Interest-based matching improves the odds significantly.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is random chat good for social anxiety?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Many people find random chat helpful for managing social anxiety because it provides low-stakes social practice. The anonymity removes the fear of judgment, and the ability to disconnect at any time eliminates the feeling of being trapped.',
        },
      },
      {
        '@type': 'Question',
        name: "What's the best way to start a conversation with a stranger online?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Ask an open-ended question or share something about yourself. Avoid generic greetings like "hi." Show genuine curiosity, keep it light, and don\'t take rejection personally.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I go from a random chat to an actual friendship?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'If a conversation clicks, let the idea of staying in touch come up naturally. Exchange a social handle or messaging app contact, then follow up within a day or two.',
        },
      },
    ],
  };

  return faqs[slug] || [];
}
