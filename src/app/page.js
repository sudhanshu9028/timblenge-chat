import dynamic from 'next/dynamic';
import styles from '@/styles/home.module.scss';
import HeroCTA from './components/HeroCTA';
import PrimeTimeBanner from './components/PrimeTimeBanner';
import ProfileLine from './components/ProfileLine';
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
        '@id': 'https://anoniz.com/#webapp',
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
        // No aggregateRating here on purpose. A rating with no reviews shown on
        // the page is a self-serving rating under Google's structured data
        // policy, and risks a manual action that would strip rich results
        // site-wide. Add it back only alongside real, visible reviews.
        publisher: { '@id': 'https://anoniz.com/#organization' },
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
        '@id': 'https://anoniz.com/#organization',
        name: 'Anoniz',
        url: 'https://anoniz.com',
        logo: 'https://anoniz.com/logo.png',
        // This is the field that tells Google which "Anoniz" we are. There is
        // an unrelated product with the same name — our own Product Hunt slug
        // is `anoniz-2` because `anoniz` was already taken — so leaving this
        // empty left the brand genuinely ambiguous to search engines and to
        // the models that increasingly answer questions about it.
        //
        // Only add profiles we actually control and that clearly identify us.
        sameAs: [
          'https://www.instagram.com/anonizchat',
          'https://www.producthunt.com/products/anoniz-2',
        ],
      },
      {
        // Names the site as an entity distinct from the company and the app,
        // which is what lets the three be linked together below.
        //
        // Deliberately no `potentialAction`/`SearchAction`: Anoniz has no site
        // search, and claiming one we don't have is the same kind of untrue
        // markup as the rating we removed.
        '@type': 'WebSite',
        '@id': 'https://anoniz.com/#website',
        name: 'Anoniz',
        url: 'https://anoniz.com',
        description:
          'Free anonymous text and video chat with random people worldwide. No app, no account, nothing stored after you disconnect.',
        inLanguage: 'en',
        publisher: { '@id': 'https://anoniz.com/#organization' },
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

        {/* Concentrating traffic into one advertised hour is the cheapest
            liquidity tool available to a real-time product this size. */}
        <PrimeTimeBanner />

        <ProfileLine />
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
