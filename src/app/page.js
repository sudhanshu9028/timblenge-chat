'use client';

import { useState, lazy, Suspense } from 'react';
import Script from 'next/script';
import styles from '@/styles/home.module.scss';

// Lazy load the modal to reduce initial bundle size
const ConsentModal = lazy(() => import('./components/ConsentModal'));

// Lazy load below-the-fold sections to improve LCP
const FeaturesSection = lazy(() => import('./components/FeaturesSection'));
const BenefitsSection = lazy(() => import('./components/BenefitsSection'));
const HowItWorksSection = lazy(() => import('./components/HowItWorksSection'));
const CTASection = lazy(() => import('./components/CTASection'));

export default function HomePage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [chatType, setChatType] = useState(null);

  const handleButtonClick = (type) => {
    setChatType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setChatType(null);
  };

  // Structured data for SEO
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    name: 'Timblenge',
    applicationCategory: 'SocialNetworkingApplication',
    operatingSystem: 'Web',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Chat with strangers and make friends online. Anonymous video chat and text chat platform. No registration required.',
    url: 'https://timblenge.com',
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

  return (
    <main className={styles.main}>
      {/* Structured Data for SEO */}
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
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
            <button className={styles.actionButton} onClick={() => handleButtonClick('text')}>
              Text Chat
            </button>
            <button className={styles.actionButton} onClick={() => handleButtonClick('video')}>
              Video Chat
            </button>
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

      <Suspense fallback={null}>
        <CTASection onButtonClick={handleButtonClick} />
      </Suspense>

      {isModalOpen && (
        <Suspense fallback={null}>
          <ConsentModal isOpen={isModalOpen} onClose={handleCloseModal} chatType={chatType} />
        </Suspense>
      )}
    </main>
  );
}
