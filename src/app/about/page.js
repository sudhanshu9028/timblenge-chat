import Link from 'next/link';
import styles from '@/styles/about.module.scss';

export const metadata = {
  title: 'About Anoniz | Anonymous Chat & Video Chat Platform | Connect with Strangers',
  description:
    'Learn about Anoniz - the leading anonymous chat and video chat platform connecting strangers worldwide. Discover our mission to create safe, meaningful connections through text and video chat. No registration required.',
  keywords: [
    'about anoniz',
    'anoniz platform',
    'anonymous chat platform',
    'video chat platform',
    'stranger chat',
    'online chat',
    'chat with strangers',
    'video chat with strangers',
  ],
  alternates: {
    canonical: 'https://anoniz.com/about',
  },
  openGraph: {
    title: 'About Anoniz | Anonymous Chat & Video Chat Platform',
    description:
      'Learn about Anoniz - the leading anonymous chat and video chat platform connecting strangers worldwide. Discover our mission, features, and values.',
    url: 'https://anoniz.com/about',
    type: 'website',
  },
};

export default function AboutPage() {
  return (
    <div className={styles.aboutPage}>
      <div className={styles.container}>
        <div className={styles.header}>
          <h1 className={styles.title}>About Anoniz</h1>
          <p className={styles.subtitle}>
            Connecting strangers, building friendships, one conversation at a time.
          </p>
        </div>

        <div className={styles.content}>
          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>What is Anoniz?</h2>
            <p className={styles.sectionContent}>
              Anoniz is a modern anonymous chat and video chat platform designed to help you connect
              with strangers from around the world. Whether you&apos;re looking to make new friends,
              practice a language, or simply have interesting conversations, Anoniz provides a safe
              and anonymous environment for meaningful connections.
            </p>
            <p className={styles.sectionContent}>
              Our platform offers both text and video chat options, allowing you to choose how you
              want to interact. No registration is required - simply choose your chat type and start
              connecting with people from different cultures and backgrounds.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Features</h2>
            <div className={styles.featuresGrid}>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Video Chat</h3>
                <p className={styles.featureDescription}>
                  Connect face-to-face with strangers through our secure video chat platform. See
                  and hear your conversation partner in real-time.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Text Chat</h3>
                <p className={styles.featureDescription}>
                  Prefer typing? Our text chat feature allows you to have real-time conversations
                  with strangers through instant messaging.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Anonymous & Private</h3>
                <p className={styles.featureDescription}>
                  Chat anonymously without revealing your identity. We prioritize your privacy and
                  don&apos;t require any personal information.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>No Registration</h3>
                <p className={styles.featureDescription}>
                  Start chatting immediately without creating an account. No email, no sign-up, no
                  hassle - just instant access to conversations.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Global Connections</h3>
                <p className={styles.featureDescription}>
                  Meet people from around the world. Our platform connects you with strangers from
                  different countries and cultures.
                </p>
              </div>
              <div className={styles.featureCard}>
                <h3 className={styles.featureTitle}>Real-time Messaging</h3>
                <p className={styles.featureDescription}>
                  Experience instant messaging with no delays. Our real-time technology ensures
                  smooth and responsive conversations.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Mission</h2>
            <p className={styles.sectionContent}>
              At Anoniz, our mission is to break down barriers and create meaningful connections
              between people worldwide. We believe that everyone deserves the opportunity to meet
              new people, learn about different cultures, and build friendships - all while
              maintaining their privacy and anonymity.
            </p>
            <p className={styles.sectionContent}>
              We&apos;re committed to providing a safe, respectful, and enjoyable platform where
              strangers can become friends through genuine conversations.
            </p>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Our Values</h2>
            <div className={styles.valuesList}>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>Privacy First</h3>
                <p className={styles.valueDescription}>
                  Your privacy is our priority. We collect minimal information and don&apos;t
                  require registration, ensuring you can chat anonymously.
                </p>
              </div>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>Safety & Moderation</h3>
                <p className={styles.valueDescription}>
                  We work to maintain a safe environment for all users through moderation tools and
                  community guidelines.
                </p>
              </div>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>Global Community</h3>
                <p className={styles.valueDescription}>
                  We celebrate diversity and connect people from different backgrounds, cultures,
                  and countries.
                </p>
              </div>
              <div className={styles.valueItem}>
                <h3 className={styles.valueTitle}>User Experience</h3>
                <p className={styles.valueDescription}>
                  We focus on creating a simple, intuitive, and enjoyable experience for all our
                  users.
                </p>
              </div>
            </div>
          </section>

          <section className={styles.section}>
            <h2 className={styles.sectionTitle}>Get Started</h2>
            <p className={styles.sectionContent}>
              Ready to start chatting? Choose between text or video chat and begin connecting with
              strangers from around the world. No registration required - just click and start
              talking!
            </p>
            <div className={styles.ctaButtons}>
              <Link href="/" className={styles.ctaButton}>
                Start Chatting
              </Link>
              <Link href="/support" className={styles.ctaButtonSecondary}>
                Need Help?
              </Link>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
