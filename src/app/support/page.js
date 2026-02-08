import Link from 'next/link';
import styles from '@/styles/support.module.scss';

export const metadata = {
  title: 'Support & Help Center | Anoniz - Get Assistance with Chat & Video Chat',
  description:
    'Get help and support for Anoniz anonymous chat and video chat platform. Contact our support team via email for assistance with questions, technical issues, or account help. We respond within 24 hours.',
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
    title: 'Support & Help Center | Anoniz',
    description:
      'Get help and support for Anoniz anonymous chat and video chat platform. Contact our support team via email for assistance.',
    url: 'https://anoniz.com/support',
    type: 'website',
  },
};

export default function SupportPage() {
  return (
    <div className={styles.supportPage}>
      <div className={styles.container}>
        <div className={styles.headerCard}>
          <h1 className={styles.headerTitle}>We&apos;re Here to Help</h1>
          <p className={styles.headerDescription}>
            Need assistance? Our support team is ready to help you with any questions or issues you
            may have.
          </p>
        </div>

        <div className={styles.emailCard}>
          <div className={styles.iconContainer}>
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M4 4H20C21.1 4 22 4.9 22 6V18C22 19.1 21.1 20 20 20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M22 6L12 13L2 6"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <h2 className={styles.emailTitle}>Email Support</h2>
          <p className={styles.emailDescription}>
            Prefer email? Reach out to our support team directly. We typically respond to all
            inquiries within 24 hours.
          </p>
          <a href="mailto:support@anoniz.com" className={styles.emailButton}>
            Email Us
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M5 12H19M19 12L12 5M19 12L12 19"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </a>
        </div>

        <div className={styles.backLink}>
          <Link href="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
