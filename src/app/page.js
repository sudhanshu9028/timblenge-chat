'use client';

import { useState, lazy, Suspense } from 'react';
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

  return (
    <main className={styles.main}>
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
