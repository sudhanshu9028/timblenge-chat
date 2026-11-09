import Link from 'next/link';
import styles from '@/styles/support.module.scss';
import { DEFAULT_OG_IMAGE } from '@/lib/ogImage';

export const metadata = {
  title: 'Anoniz Help and Support: Contact Us',
  description:
    'Need help with Anoniz? Email our support team about a problem with text or video chat, a bug, or something you saw in a chat, and we will get back to you.',
  keywords: [
    'anoniz support',
    'anoniz help',
    'contact anoniz',
    'anoniz customer support',
    'anoniz assistance',
    'anoniz help center',
    'chat support',
    'video chat support',
  ],
  alternates: {
    canonical: 'https://anoniz.com/support',
  },
  openGraph: {
    title: 'Anoniz Help and Support: Contact Us',
    description:
      'Need help with Anoniz? Email our support team about a problem with text or video chat, a bug, or something you saw in a chat, and we will get back to you.',
    url: 'https://anoniz.com/support',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
  },
};

export default function SupportPage() {
  return (
    <div className={styles.supportPage}>
      <div className={styles.container}>
        <div className={styles.headerCard}>
          <h1 className={styles.headerTitle}>We&apos;re here to help</h1>
          <p className={styles.headerDescription}>
            Need assistance? Our support team is ready to help you with any questions or issues you
            may have.
          </p>
        </div>

        <div className={styles.emailCard}>
          <div className={styles.iconContainer}>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="4" width="20" height="16" rx="2" />
              <path d="m22 7-10 6L2 7" />
            </svg>
          </div>
          <h2 className={styles.emailTitle}>Email support</h2>
          <p className={styles.emailDescription}>
            Prefer email? Reach out to our support team directly. We typically respond to all
            inquiries within 24 hours.
          </p>
          <div className={styles.emailRow}>
            <a href="mailto:support@anoniz.com" className={styles.emailButton}>
              Email us
            </a>
            <span className={styles.emailAddress}>support@anoniz.com</span>
          </div>
        </div>

        <div className={styles.backLink}>
          <Link href="/">← Back to home</Link>
        </div>
      </div>
    </div>
  );
}
