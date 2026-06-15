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
    'fun-things-to-do-online-when-bored-random-chat': [
      {
        '@type': 'Question',
        name: 'Is chatting with strangers a good way to cure boredom?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Absolutely. Unlike passively watching videos, chatting requires active participation. The unpredictability of meeting someone new from across the globe naturally stimulates your brain and makes time fly by.',
        },
      },
      {
        '@type': 'Question',
        name: 'Do I have to use my webcam?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Not at all! Many platforms, including Anoniz, offer dedicated text-only chat rooms. You can enjoy great conversations completely anonymously without ever turning on your camera.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I find people with similar interests?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Anoniz features an interest-matching system. Before joining a chat, simply type in topics you enjoy (e.g., "movies", "gaming", "anime"), and the algorithm will pair you with someone who entered the same tags.',
        },
      },
    ],
    'how-to-practice-social-skills-and-overcome-anxiety-online': [
      {
        '@type': 'Question',
        name: 'Is it normal to feel nervous before starting a random chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes, it is completely normal! Even people without social anxiety feel a flutter of nerves before talking to a stranger. Accept the nervousness as part of the process.',
        },
      },
      {
        '@type': 'Question',
        name: 'What if an interaction goes poorly?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The beauty of anonymous chat is the "Next" button. If a conversation is awkward, rude, or uncomfortable, simply disconnect. There are no real-world consequences or awkward run-ins later.',
        },
      },
      {
        '@type': 'Question',
        name: 'Does chatting online actually help with real-life anxiety?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Exposure therapy is a common treatment for anxiety. By practicing conversations in a low-stakes online environment, you build cognitive muscle memory that makes real-world interactions feel less daunting.',
        },
      },
    ],
    '50-best-questions-to-ask-strangers-online-to-keep-conversations-going': [
      {
        '@type': 'Question',
        name: 'What do I do if they answer with just "yes" or "no"?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Follow up with a "Why?" or transition to a wildly different, hypothetical question to jolt the conversation awake. If they remain unresponsive, just politely say goodbye and match with someone new!',
        },
      },
      {
        '@type': 'Question',
        name: 'Are there any topics I should avoid?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'When first meeting a stranger, it is generally best to avoid deeply polarizing topics like heavy politics, extremely personal financial questions, or anything overly explicit.',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I smoothly transition from an icebreaker to a normal chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Listen carefully to their answer and find a "hook." If you ask about their favorite movie and they mention a sci-fi film, ask them what they think the future will actually look like in 50 years. Let the conversation branch naturally.',
        },
      },
    ],
    'why-did-omegle-shut-down-where-everyone-went-2026': [
      {
        '@type': 'Question',
        name: 'Why did Omegle shut down?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Omegle's founder, Leif K-Brooks, shut the site down voluntarily in November 2023. In his farewell post, he explained that moderating an anonymous video chat platform at scale had become an impossible task — a small minority of users exploited the platform for illegal or harmful purposes, which drew intense legal and media scrutiny that made running the site no longer 'sustainable, financially nor psychologically.'",
        },
      },
      {
        '@type': 'Question',
        name: 'Is Omegle coming back?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'There are no official plans for Omegle to return. The founder described the shutdown as final and said he considered the matter closed. Any site claiming to be a relaunched "official Omegle" should be treated with suspicion — it is very likely a copycat or scam.',
        },
      },
      {
        '@type': 'Question',
        name: 'What replaced Omegle?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A new generation of random chat platforms filled the gap, including Anoniz. These newer platforms were built with moderation and safety as a starting point rather than an afterthought — using AI-powered filtering, instant reporting, and interest-based matching that Omegle never had.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is random video chat still safe in 2026?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Generally, yes — on reputable platforms. The best modern alternatives use proactive content moderation, do not require personal information, and give users instant tools to disconnect and report. As always, avoid sharing identifying details with strangers regardless of which platform you use.',
        },
      },
    ],
    'best-random-chat-apps-android-iphone-no-signup': [
      {
        '@type': 'Question',
        name: 'Do I need to download an app for random video chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "No. Anoniz and most of the platforms on this list work directly in your phone's browser — just open the site, tap to start, and you're connected. There's nothing to install, update, or delete later.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is random chat safe to use on mobile data?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Text chat uses almost no data. Video chat is more data-intensive, similar to a video call app, so if you have a limited data plan it's worth connecting to Wi-Fi for longer video sessions.",
        },
      },
      {
        '@type': 'Question',
        name: 'Does Anoniz work on iPhone Safari and Android Chrome?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes. Anoniz is fully browser-based and works across modern mobile browsers, including Safari on iPhone and Chrome on Android, without any app installation.',
        },
      },
      {
        '@type': 'Question',
        name: "What's the best free random chat app with no sign-up for mobile?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Anoniz is built specifically for this — instant text and video chat from any mobile browser, no account required, with interest-based matching to find better conversations faster.',
        },
      },
    ],
    'cant-sleep-late-night-chat-with-strangers': [
      {
        '@type': 'Question',
        name: 'Is it normal to feel lonely or anxious late at night?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes, it's extremely common. With fewer distractions and a natural dip in mood regulation overnight, many people find that worries and overthinking feel much louder after midnight than they do during the day. You're far from the only one awake feeling this way.",
        },
      },
      {
        '@type': 'Question',
        name: 'Can talking to a stranger online actually help me feel better?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "For a lot of people, yes — at least in the moment. A real conversation gives your mind something active to focus on, which can interrupt a spiral of repetitive late-night thoughts. It's not a cure for anything, but a few minutes of genuine human connection can take the edge off and make it easier to relax.",
        },
      },
      {
        '@type': 'Question',
        name: 'Is anonymous chat available 24/7?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. Anoniz has no opening hours — because it connects you with people all over the world, there's always someone online, no matter what time zone you're in.",
        },
      },
      {
        '@type': 'Question',
        name: "What if I'm dealing with serious sleep or mental health issues?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Anonymous chat can be a nice way to feel less alone in the moment, but it isn't a substitute for professional support. If sleep problems, anxiety, or low mood are persistent, please talk to a doctor or therapist. If you're ever having thoughts of harming yourself, contact a crisis line or emergency services in your country right away.",
        },
      },
    ],
    'text-chat-vs-video-chat-which-is-better': [
      {
        '@type': 'Question',
        name: 'Is text chat more anonymous than video chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. Text chat reveals nothing about your appearance, voice, accent, or surroundings, which makes it the more anonymous option. Video chat still doesn't require any personal information, but it naturally shows more of who you are.",
        },
      },
      {
        '@type': 'Question',
        name: 'Which is better for making friends — text or video chat?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Both can lead to real friendships, but they tend to work differently. Text chat lets a connection build slowly through conversation alone, while video chat often builds rapport faster because tone and body language come through immediately. Many people find a mix of both works best.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can I switch from text chat to video chat mid-conversation?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On Anoniz, text and video are separate chat modes, so you would start a new chat in the other mode. If a text conversation is going well and you both want to continue with video, you can simply move to a video chat together.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is video chat with strangers safe?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'On a platform with active moderation, reporting tools, and no requirement to share personal details, video chat is generally safe for the vast majority of users. As with any chat with strangers, avoid showing identifying details in your background and never share personal information like your address or financial details.',
        },
      },
    ],
    'ai-companion-vs-real-person-which-helps-loneliness': [
      {
        '@type': 'Question',
        name: 'Are AI companions bad for you?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Not inherently. Research suggests AI companion chats can ease loneliness in the short term about as much as talking to a real person. The concern is over-reliance — heavy, exclusive use has been linked to increased signs of distress over time, and it can quietly crowd out the slower work of building real-world connections.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can talking to AI really reduce loneliness?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "For many people, yes, at least in the moment. A Harvard Business School study found AI companion conversations eased loneliness about as much as a conversation with a real person, and more than passive activities like watching videos. The key phrase is 'in the moment' — it's a tool, not a cure.",
        },
      },
      {
        '@type': 'Question',
        name: "What's better for practicing social skills, AI or real conversation?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Real conversation. An AI companion is designed to keep you comfortable, which means it never gives you the genuinely unpredictable reactions, tangents, or mismatches you get from a person who has their own day, mood, and opinions. Those small adjustments are exactly what build social skills.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is anonymous chat a good middle ground between AI companions and real-life friends?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "Yes. Like an AI companion, anonymous chat is available on demand, judgment-free, and doesn't require an existing relationship. But unlike AI, the person on the other end is real — genuinely curious, genuinely unpredictable, and genuinely choosing to be in the conversation with you.",
        },
      },
    ],
    'dating-app-burnout-why-people-are-trying-random-chat-instead': [
      {
        '@type': 'Question',
        name: 'Is Anoniz a dating app?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: "No. Anoniz is an anonymous random chat platform for conversation — there's no profile, no photos, no matching based on looks, and no romantic framing. It's simply a way to talk to someone new.",
        },
      },
      {
        '@type': 'Question',
        name: 'Why are so many people burned out on dating apps?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Surveys show more than half of Gen Z feels burned out on dating apps often or always — a higher rate than any other age group. The exhaustion comes from constantly curating a profile, treating every match as a fresh audition, and the steady drip of ghosting and low-effort conversations.',
        },
      },
      {
        '@type': 'Question',
        name: 'Can random chat help with dating app burnout?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'For many people, yes — not as a replacement for dating, but as a low-pressure way to remember what an unscripted, unscored conversation feels like, without a profile, a photo, or an outcome attached to it.',
        },
      },
      {
        '@type': 'Question',
        name: "What's the actual difference between random chat and a dating app?",
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Random chat has no profiles, no photos, and no matching algorithm based on appearance or romantic compatibility. You\'re connected instantly to another person for a conversation, with no "looking for" framing — and you\'re free to disconnect whenever you want.',
        },
      },
    ],
  };

  return faqs[slug] || [];
}
