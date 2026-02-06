import Link from 'next/link';
import styles from '@/styles/legal.module.scss';

export const metadata = {
  title: 'Terms of Service | Timblenge',
  description: 'Terms of Service for Timblenge - Anonymous chat and video chat platform. Read our terms and conditions before using our service.',
};

export default function TermsPage() {
  return (
    <div className={styles.legalPage}>
      <div className={styles.container}>
        <Link href="/" className={styles.backLink}>
          ← Back to Home
        </Link>

        <div className={styles.header}>
          <h1 className={styles.title}>Terms of Service</h1>
          <p className={styles.lastUpdated}>Last Updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>

        <div className={styles.content}>
          <div className={styles.intro}>
            <p>
              Welcome to Timblenge. By accessing or using our platform, you agree to be bound by
              these Terms of Service. Please read them carefully before using our service.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Acceptance of Terms</h2>
            <p className={styles.sectionContent}>
              By accessing or using Timblenge, you acknowledge that you have read, understood, and
              agree to be bound by these Terms of Service and our Privacy Policy. If you do not
              agree to these terms, you must not use our service.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. Eligibility</h2>
            <p className={styles.sectionContent}>
              <span className={styles.highlight}>You must be at least 18 years old</span> to use
              Timblenge. By using our service, you represent and warrant that you are of legal age
              to form a binding contract and meet all eligibility requirements. We reserve the right
              to verify your age at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Service Description</h2>
            <p className={styles.sectionContent}>
              Timblenge is an anonymous chat and video chat platform that connects users with
              strangers for text and video conversations. Our service allows you to:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>Engage in anonymous text chats with random users</li>
              <li className={styles.listItem}>Participate in video chat sessions with strangers</li>
              <li className={styles.listItem}>Connect with people from around the world</li>
            </ul>
            <p className={styles.sectionContent}>
              We do not guarantee matches, conversation quality, or user compatibility. The service
              is provided &quot;as is&quot; without warranties of any kind.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. User Conduct and Responsibilities</h2>
            <p className={styles.sectionContent}>
              You are solely responsible for your conduct while using Timblenge. You agree to:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Use the service in a lawful and respectful manner
              </li>
              <li className={styles.listItem}>
                Respect the privacy and anonymity of other users
              </li>
              <li className={styles.listItem}>
                Not share personal information that could identify you
              </li>
              <li className={styles.listItem}>
                Report inappropriate behavior or content when encountered
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Prohibited Activities</h2>
            <p className={styles.sectionContent}>
              You are strictly prohibited from:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Sharing, transmitting, or displaying any content that is illegal, harmful,
                threatening, abusive, harassing, defamatory, or obscene
              </li>
              <li className={styles.listItem}>
                Engaging in any form of harassment, bullying, or intimidation
              </li>
              <li className={styles.listItem}>
                Sharing explicit sexual content or engaging in sexual solicitation
              </li>
              <li className={styles.listItem}>
                Attempting to identify, track, or locate other users
              </li>
              <li className={styles.listItem}>
                Using the service for commercial purposes, spamming, or advertising
              </li>
              <li className={styles.listItem}>
                Impersonating others or providing false information
              </li>
              <li className={styles.listItem}>
                Attempting to hack, disrupt, or interfere with the service
              </li>
              <li className={styles.listItem}>
                Sharing personal contact information (email, phone, social media, etc.)
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Moderation and Safety</h2>
            <p className={styles.sectionContent}>
              We employ automated and manual moderation systems to maintain a safe environment.
              However, we cannot guarantee that all inappropriate content or behavior will be
              prevented or removed immediately. You use the service at your own risk.
            </p>
            <p className={styles.sectionContent}>
              We reserve the right to:
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                Monitor, review, and moderate conversations and content
              </li>
              <li className={styles.listItem}>
                Remove or block users who violate these terms
              </li>
              <li className={styles.listItem}>
                Terminate access to the service without notice for violations
              </li>
              <li className={styles.listItem}>
                Report illegal activities to law enforcement
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>7. Privacy and Anonymity</h2>
            <p className={styles.sectionContent}>
              Timblenge is designed to facilitate anonymous conversations. However, complete
              anonymity cannot be guaranteed. We collect minimal data as described in our Privacy
              Policy. You are responsible for protecting your own privacy and not sharing personal
              information.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>8. Limitation of Liability</h2>
            <p className={styles.sectionContent}>
              TO THE MAXIMUM EXTENT PERMITTED BY LAW, TIMBLENGE SHALL NOT BE LIABLE FOR ANY
              INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, OR ANY LOSS OF
              PROFITS OR REVENUES, WHETHER INCURRED DIRECTLY OR INDIRECTLY, OR ANY LOSS OF DATA,
              USE, GOODWILL, OR OTHER INTANGIBLE LOSSES RESULTING FROM YOUR USE OF THE SERVICE.
            </p>
            <p className={styles.sectionContent}>
              We do not guarantee the availability, accuracy, or quality of the service. The
              service may be unavailable due to maintenance, technical issues, or other reasons
              beyond our control.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>9. No Registration Required</h2>
            <p className={styles.sectionContent}>
              Timblenge does not require user registration or account creation. You can use the
              service anonymously without providing personal information. However, this means we
              cannot provide account recovery or personalized services.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>10. Changes to Terms</h2>
            <p className={styles.sectionContent}>
              We reserve the right to modify these Terms of Service at any time. Changes will be
              effective immediately upon posting. Your continued use of the service after changes
              constitutes acceptance of the modified terms. We encourage you to review these terms
              periodically.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>11. Termination</h2>
            <p className={styles.sectionContent}>
              We may terminate or suspend your access to the service immediately, without prior
              notice, for any violation of these terms or for any other reason we deem necessary.
              You may stop using the service at any time.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>12. Governing Law</h2>
            <p className={styles.sectionContent}>
              These Terms of Service shall be governed by and construed in accordance with
              applicable laws, without regard to conflict of law provisions.
            </p>
          </section>

          <div className={styles.contactInfo}>
            <h3 className={styles.sectionTitle}>Contact Us</h3>
            <p className={styles.sectionContent}>
              If you have any questions about these Terms of Service, please contact us at:{' '}
              <a href="mailto:timblenge@gmail.com" className={styles.link}>
                timblenge@gmail.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

