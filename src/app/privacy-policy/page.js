import Link from 'next/link';
import styles from '@/styles/legal.module.scss';
import { DEFAULT_OG_IMAGE } from '@/lib/ogImage';

export const metadata = {
  title: 'Privacy Policy | Anoniz',
  description:
    'What Anoniz collects when you chat, how long it keeps it, which third-party services run on the site, and the rights you have over your data.',
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
    title: 'Privacy Policy | Anoniz',
    description:
      'What Anoniz collects when you chat, how long it keeps it, which third-party services run on the site, and the rights you have over your data.',
    url: 'https://anoniz.com/privacy-policy',
    type: 'website',
    images: [DEFAULT_OG_IMAGE],
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
          <p className={styles.lastUpdated}>Last Updated: November 1, 2026</p>
        </div>

        <div className={styles.content}>
          <div className={styles.intro}>
            <p>
              Anoniz is built to know as little about you as possible. This policy explains what we
              do collect when you use our anonymous text and video chat, why, how long we keep it,
              and which outside services are involved.
            </p>
          </div>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>1. Information We Collect</h2>
            <p className={styles.sectionContent}>
              There are no accounts. We never ask for your name, email address or phone number. What
              we do handle is listed below.
            </p>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.strong}>Gender:</span> We ask for it when you start a chat.
                It is kept in your browser&apos;s session storage and cleared when you close the
                tab. It is not sent to our servers.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Interests:</span> Any interest tags you add are sent
                to our server so we can try to match you with someone who shares them. They are held
                in memory only while you are connected.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Text messages:</span> Messages are relayed through
                our server in real time and are not stored or logged. When the chat ends, they are
                gone.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Photos:</span> Photos you send are view-once. Your
                browser re-encodes each photo before sending it, which removes location and camera
                details (EXIF data). The photo is held only in our server&apos;s memory, never
                written to disk or a third-party service, and has no web address. It is deleted as
                soon as the other person opens it, when either of you leaves the chat, or after five
                minutes if it is never opened. The viewer closes if the other person switches away
                or presses a screenshot shortcut, and you are told if we notice a likely screenshot,
                but no website can fully prevent someone from photographing their screen.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Video:</span> Video and audio travel directly
                between your browser and the other person&apos;s where possible (WebRTC), not
                through our server, and are never recorded by us. To set up that direct connection,
                both browsers contact Google&apos;s public STUN servers, which see your IP address.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>AI chats:</span> When no person is free, text chat
                may offer a clearly labelled AI chat partner. Messages you send to it are passed to
                Google&apos;s Gemini API to generate its replies, so they are processed by Google
                under its own terms. We do not store them.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Notifications:</span> If you choose to turn on
                browser notifications, we store the push subscription your browser gives us, your
                timezone offset (so we never notify you at night), and when we last sent you one.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Technical data:</span> Like any website, our servers
                and hosting provider receive your IP address, browser type and device details when
                you connect.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>On your device only:</span> A small profile of
                counters, such as how many strangers you have talked to, is kept in your
                browser&apos;s local storage. It never leaves your device.
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>2. How We Use Your Information</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                To connect you with another person and run the chat
              </li>
              <li className={styles.listItem}>To match you on shared interests</li>
              <li className={styles.listItem}>To generate replies in AI chats</li>
              <li className={styles.listItem}>To send the notifications you asked for</li>
              <li className={styles.listItem}>
                To keep the service secure, prevent abuse and fix problems
              </li>
              <li className={styles.listItem}>
                To understand how the site is used and how fast it loads, so we can improve it
              </li>
              <li className={styles.listItem}>
                To comply with legal obligations and respond to lawful requests
              </li>
            </ul>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>3. Data Storage and Retention</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.strong}>Text messages and video:</span> Not stored.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Photos:</span> Deleted on opening, when either
                person leaves, or after five minutes unopened.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Interests:</span> Held in memory while you are
                connected, then discarded.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Gender and session details:</span> Kept in your
                browser&apos;s session storage and cleared when you close the tab.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Notification subscriptions:</span> Kept until you
                turn notifications off in your browser or the subscription stops working, at which
                point we delete it.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Technical logs:</span> Our hosting provider may keep
                server logs, including IP addresses and timestamps, for security and troubleshooting
                for a limited period, typically not exceeding 90 days.
              </li>
            </ul>
            <p className={styles.sectionContent}>
              We also keep anonymous counts of how many people are online at each hour, with no
              identifiers attached, to learn when the site is busiest.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>4. Data Security</h2>
            <p className={styles.sectionContent}>
              All connections to Anoniz use HTTPS, and chat runs over encrypted connections. Keeping
              almost nothing is our main protection: data we never store cannot leak. No method of
              transmission over the internet is completely secure, however, and we cannot guarantee
              absolute security.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>5. Third-Party Services</h2>
            <ul className={styles.list}>
              <li className={styles.listItem}>
                <span className={styles.strong}>Google Analytics:</span> Measures visits and how the
                site is used. In the EEA, the UK and Switzerland it runs with analytics storage
                denied by default, which means no analytics cookies are set there.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>VitalsDesk:</span> Measures how fast pages load for
                real visitors. It records the page address, speed measurements, device type and an
                approximate country and city derived from the request. It does not set cookies.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Google Gemini API:</span> Generates replies in AI
                chats, as described above.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Google STUN servers:</span> Help two browsers find
                each other for video chat.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Hosting:</span> The site runs on Render, which
                processes connection data to serve it.
              </li>
              <li className={styles.listItem}>
                <span className={styles.strong}>Product Hunt:</span> The badge in our footer is
                loaded from Product Hunt, which receives a standard request from your browser.
              </li>
            </ul>
            <p className={styles.sectionContent}>
              We do not sell, rent, or share your personal information with third parties for their
              marketing purposes, and we show no ads.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>6. Cookies and Similar Technologies</h2>
            <p className={styles.sectionContent}>
              Anoniz itself does not use cookies. Google Analytics may set cookies to measure usage,
              except where analytics storage is denied as described above. We use your
              browser&apos;s session storage for your gender, interests and chat session, and local
              storage for the on-device profile. You can clear all of these in your browser settings
              at any time.
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
