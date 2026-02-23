'use client';

import { lazy, Suspense } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import styles from '@/styles/home.module.scss';

// Lazy load below-the-fold sections to improve LCP
const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const BenefitsSection = lazy(() => import('./components/BenefitsSection'));
const HowItWorksSection = lazy(() => import('./components/HowItWorksSection'));

export default function HomePage() {
  // GA4 click tracking helper
  const trackClick = (buttonName) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const platform = window.innerWidth <= 768 ? 'mweb' : 'web';
      window.gtag('event', `home_${buttonName}`, { platform });
    }
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
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
  };

  // Organization structured data for Google Knowledge Panel & logo
  const organizationData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Anoniz',
    url: 'https://anoniz.com',
    logo: 'https://anoniz.com/logo.png',
    sameAs: [],
  };

  return (
    <main className={styles.main}>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
      />
      <Script
        id="organization-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationData) }}
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
        <div className={styles.heroCTA}>
          <div className={styles.actionButtons}>
            <Link
              href="/chat"
              className={styles.actionButton}
              onClick={() => trackClick('text_chat')}
            >
              Text Chat
            </Link>
            <Link
              href="/video"
              className={styles.actionButton}
              onClick={() => trackClick('video_chat')}
            >
              Video Chat
            </Link>
          </div>
        </div>
      </section>

      {/* Lazy load below-the-fold content to improve LCP */}
      <Suspense fallback={null}>
        <FeaturesSection />
      </Suspense>

      <Suspense fallback={null}>
        <BenefitsSection />
      </Suspense>

      <Suspense fallback={null}>
        <HowItWorksSection />
      </Suspense>
    </main>
  );
}
