import dynamic from 'next/dynamic';
import styles from '@/styles/home.module.scss';
import HeroCTA from './components/HeroCTA';
import { HOME_FAQ_ITEMS } from '@/lib/homeFaqData';

// Homepage-specific metadata. The root layout only supplies site-wide defaults,
// so keeping this here is what lets the homepage target its own head terms.
export const metadata = {
  title: 'Talk to Strangers Online – Free Anonymous Chat | Anoniz',
  description:
    'Talk to strangers online with no app and no sign-up. Free anonymous text and video chat with random people worldwide — open a tab and start talking.',
  alternates: {
    canonical: 'https://anoniz.com/',
  },
  openGraph: {
    title: 'Talk to Strangers Online – Free Anonymous Chat | Anoniz',
    description:
      'Free anonymous text and video chat with random people worldwide. No app to install, no account to create, nothing stored after you disconnect.',
    url: 'https://anoniz.com',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Talk to Strangers Online – Free Anonymous Chat | Anoniz',
    description:
      'Free anonymous text and video chat with random people worldwide. No app, no account, nothing stored.',
  },
};

// Dynamic load below-the-fold sections with SSR enabled to improve LCP without hurting SEO
const FeaturesSection = dynamic(() => import('./components/FeaturesSection'), { ssr: true });
const BenefitsSection = dynamic(() => import('./components/BenefitsSection'), { ssr: true });
const HowItWorksSection = dynamic(() => import('./components/HowItWorksSection'), { ssr: true });
const ComparisonSection = dynamic(() => import('./components/ComparisonSection'), { ssr: true });
const HomeFaqSection = dynamic(() => import('./components/HomeFaqSection'), { ssr: true });

export default function HomePage() {
  // Combined structured data for SEO using @graph
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: 'Anoniz',
        applicationCategory: 'SocialNetworkingApplication',
        operatingSystem: 'Web',
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
        },
        description:
          'Chat with strangers and make friends online. Anonymous video chat and text chat platform. No registration required.',
        url: 'https://anoniz.com',
        image: 'https://anoniz.com/logo.png',
        aggregateRating: {
          '@type': 'AggregateRating',
          ratingValue: '4.5',
          ratingCount: '1000',
        },
        featureList: [
          'Video Chat with Strangers',
          'Text Chat',
          'Anonymous Chat',
          'No Registration Required',
          'Global Connections',
          'Real-time Messaging',
        ],
      },
      {
        '@type': 'Organization',
        name: 'Anoniz',
        url: 'https://anoniz.com',
        logo: 'https://anoniz.com/logo.png',
        sameAs: [],
      },
      {
        '@type': 'FAQPage',
        mainEntity: HOME_FAQ_ITEMS.map((item) => ({
          '@type': 'Question',
          name: item.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: item.answer,
          },
        })),
      },
    ],
  };

  return (
    <main className={styles.main}>
      {/* Structured Data for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className={styles.hero}>
        <h1 className={styles.heroTitle}>
          Talk to <span className={styles.gradientStrangers}>Strangers</span> Online, Make{' '}
          <span className={styles.gradientFriends}>Friends</span> Anywhere
        </h1>
        <p className={styles.heroSubtitle}>
          Free anonymous chat with random people worldwide — no app to install, no account to
          create, and nothing stored once you disconnect. Text or video, straight from your browser.
        </p>
        <HeroCTA styles={styles} />
      </section>

      {/* Dynamic load below-the-fold content with SSR enabled to improve LCP */}
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <ComparisonSection />
      <HomeFaqSection />
    </main>
  );
}
