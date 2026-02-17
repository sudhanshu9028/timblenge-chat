'use client';

import Link from 'next/link';
import FuzzyText from './components/FuzzyText';
import styles from '@/styles/notFound.module.scss';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <FuzzyText
          className={styles.errorCode}
          fontSize="clamp(4rem, 18vw, 8rem)"
          baseIntensity={0.18}
          hoverIntensity={0.4}
          fuzzRange={40}
          direction="horizontal"
          transitionDuration={120}
          glitchMode={false}
        >
          404
        </FuzzyText>

        <h2 className={styles.errorTitle}>Page not found</h2>

        <p className={styles.errorMessage}>
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        <Link href="/" className={styles.backButton}>
          Back To Home
        </Link>
      </div>
    </main>
  );
}
