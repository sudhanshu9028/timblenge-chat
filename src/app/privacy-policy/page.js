import Link from 'next/link';
import styles from '@/styles/legal.module.scss';

export const metadata = {
  title: 'Privacy Policy | Anoniz - Data Protection & User Privacy Information',
  description:
    'Read the Privacy Policy for Anoniz anonymous chat and video chat platform. Learn how we collect, use, protect, and handle your data. Understand our commitment to user privacy and data protection.',
  keywords: [
    'privacy policy',
    'data protection',
    'anoniz privacy',
    'chat privacy',
    'user privacy',
    'data collection',
    'anoniz data protection',
    'anonymous chat privacy',
    'video chat privacy',
  ],
  alternates: {
    canonical: 'https://anoniz.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | Anoniz - Data Protection & User Privacy Information',
    description:
      'Read the Privacy Policy for Anoniz anonymous chat and video chat platform. Learn how we collect, use, and protect your data.',
    url: 'https://anoniz.com/privacy-policy',
    type: 'website',
  },
};

export default function PrivacyPolicyPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Privacy Policy</h1>
          <p className={styles.lastUpdated}>
            Last Updated:{' '}
            {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
        </div>

        <div className={styles.content}>
          <div className={styles.intro}>
            <p>
              At Anoniz, we are committed to protecting your privacy. This Privacy Policy explains
              how we collect, use, and safeguard your information when you use our anonymous chat
              and video chat platform.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p className={styles.sectionContent}>
              Anoniz is designed to be anonymous. We collect minimal information necessary to
              provide our service:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.strong}>Gender Preference:</span> We collect your gender
                selection to help match you with compatible users. This is stored temporarily in
                your browser session.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Technical Data:</span> We automatically collect
                technical information such as IP address, browser type, device information, and
                usage patterns for service functionality and security purposes.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Chat Content:</span> Messages and video streams are
                transmitted in real-time and are not permanently stored on our servers. We do not
                record or save your conversations.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>No Personal Information:</span> We do not require
                registration, email addresses, names, or any personally identifiable information.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <p className={styles.sectionContent}>
              We use the limited information we collect for the following purposes:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                To provide and maintain our chat and video chat services
              </li>
              <li className={styles.listItem}>
                To match you with other users based on gender preferences
              </li>
              <li className={styles.listItem}>To ensure platform security and prevent abuse</li>
              <li className={styles.listItem}>To analyze usage patterns and improve our service</li>
              <li className={styles.listItem}>
                To comply with legal obligations and respond to law enforcement requests
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Data Storage and Retention</h2>
            <p className={styles.sectionContent}>
              <span className={styles.strong}>Chat Messages:</span> Text messages and video streams
              are transmitted in real-time and are not stored on our servers. Once a conversation
              ends, the content is not retained.
            </p>
            <p className={styles.sectionContent}>
              <span className={styles.strong}>Session Data:</span> Gender preferences and session
              identifiers are stored temporarily in your browser&apos;s session storage and are
              cleared when you close your browser.
            </p>
            <p className={styles.sectionContent}>
              <span className={styles.strong}>Technical Logs:</span> We may retain technical logs
              (IP addresses, timestamps) for security and troubleshooting purposes for a limited
              period, typically not exceeding 90 days.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Security</h2>
            <p className={styles.sectionContent}>
              We implement reasonable security measures to protect your information:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Encrypted connections (HTTPS) for all data transmission
              </li>
              <li className={styles.listItem}>
                Secure socket connections for real-time chat and video
              </li>
              <li className={styles.listItem}>Regular security assessments and updates</li>
              <li className={styles.listItem}>Access controls and monitoring systems</li>
            </ul>
            <p className={styles.sectionContent}>
              However, no method of transmission over the internet is 100% secure. While we strive
              to protect your information, we cannot guarantee absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Third-Party Services</h2>
            <p className={styles.sectionContent}>
              We may use third-party services that collect information:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.strong}>Analytics:</span> We use analytics services to
                understand how our platform is used. These services may collect anonymous usage
                data.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Hosting:</span> Our service is hosted on third-party
                infrastructure. These providers have their own privacy policies regarding data
                handling.
              </li>
            </ul>
            <p className={styles.sectionContent}>
              We do not sell, rent, or share your personal information with third parties for their
              marketing purposes.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Cookies and Tracking Technologies</h2>
            <p className={styles.sectionContent}>
              We use cookies and similar tracking technologies to:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Maintain your session and preferences</li>
              <li className={styles.listItem}>Analyze platform usage and performance</li>
              <li className={styles.listItem}>Provide security features</li>
            </ul>
            <p className={styles.sectionContent}>
              You can control cookies through your browser settings. However, disabling cookies may
              affect the functionality of our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Your Rights</h2>
            <p className={styles.sectionContent}>
              Since we collect minimal information and do not require registration, your rights
              include:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.strong}>Right to Anonymity:</span> You can use our service
                without providing personal information
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Right to Stop Using:</span> You can stop using our
                service at any time
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Browser Controls:</span> You can clear your browser
                data to remove session information
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Contact Us:</span> You can contact us with privacy
                concerns or questions
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Children&apos;s Privacy</h2>
            <p className={styles.sectionContent}>
              <span className={styles.highlight}>
                Anoniz is strictly for users 18 years and older.
              </span>{' '}
              We do not knowingly collect information from individuals under 18 years of age. If we
              become aware that we have collected information from someone under 18, we will take
              steps to delete such information immediately.
            </p>
            <p className={styles.sectionContent}>
              If you are a parent or guardian and believe your child has provided us with
              information, please contact us immediately.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. Anonymous Nature of Service</h2>
            <p className={styles.sectionContent}>
              Anoniz is designed to facilitate anonymous conversations. However, you should be aware
              that:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Complete anonymity cannot be guaranteed in all circumstances
              </li>
              <li className={styles.listItem}>
                Other users may attempt to identify you through information you share
              </li>
              <li className={styles.listItem}>
                We recommend not sharing personal information during conversations
              </li>
              <li className={styles.listItem}>
                You are responsible for protecting your own privacy
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. International Users</h2>
            <p className={styles.sectionContent}>
              Anoniz is accessible worldwide. By using our service, you acknowledge that your
              information may be transferred to and processed in countries other than your own. We
              take steps to ensure your information is protected regardless of location.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Changes to This Privacy Policy</h2>
            <p className={styles.sectionContent}>
              We may update this Privacy Policy from time to time. Changes will be effective
              immediately upon posting on this page. We encourage you to review this policy
              periodically to stay informed about how we protect your information.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Data Breach Notification</h2>
            <p className={styles.sectionContent}>
              In the unlikely event of a data breach that compromises your information, we will take
              appropriate measures to notify affected users and relevant authorities as required by
              applicable law.
            </p>
          </section>

          <div className={styles.contactInfo}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <p className={styles.sectionContent}>
              If you have any questions, concerns, or requests regarding this Privacy Policy or our
              data practices, please contact us at:{' '}
              <a href="mailto:support@anoniz.com" className={styles.link}>
                support@anoniz.com
              </a>
            </p>
            <p className={styles.sectionContent}>
              We will respond to your inquiry as soon as possible.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
