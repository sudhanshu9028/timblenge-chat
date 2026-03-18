import dynamic from 'next/dynamic';
import styles from '@/styles/home.module.scss';
import HeroCTA from './components/HeroCTA';
import { HOME_FAQ_ITEMS } from '@/lib/homeFaqData';

// Dynamic load below-the-fold sections with SSR enabled to improve LCP without hurting SEO
const FeaturesSection = dynamic(() => import('./components/FeaturesSection'), { ssr: true });
const BenefitsSection = dynamic(() => import('./components/BenefitsSection'), { ssr: true });
const HowItWorksSection = dynamic(() => import('./components/HowItWorksSection'), { ssr: true });
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
          Chat with <span className={styles.gradientStrangers}>Strangers</span>, Make{' '}
          <span className={styles.gradientFriends}>Friends</span> Online!
        </h1>
        <p className={styles.heroSubtitle}>
          Try a random chat alternative to connect with people, find friends, and chat with
          strangers worldwide!!
        </p>
        <HeroCTA styles={styles} />
      </section>

      {/* Dynamic load below-the-fold content with SSR enabled to improve LCP */}
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <HomeFaqSection />
    </main>
  );
}
