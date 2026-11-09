import Link from 'next/link';
import styles from '@/styles/notFound.module.scss';

export default function NotFound() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <p className={styles.errorCode}>404</p>

        <h2 className={styles.errorTitle}>Page not found</h2>

        <p className={styles.errorMessage}>
          The page you are looking for might have been removed, had its name changed, or is
          temporarily unavailable.
        </p>

        <Link href="/" className={styles.backButton}>
          Back to home
        </Link>
      </div>
    </main>
  );
}
