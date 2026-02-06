import styles from '@/styles/home.module.scss';

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
      <h2 className={styles.sectionTitle}>Platform Features</h2>
      <div className={styles.featuresGrid}>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Video Chat with Strangers</h3>
          <p className={styles.featureDescription}>
            Connect face-to-face with random people through our secure video chat platform. Start
            a video chat with strangers and make new friends instantly.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Text Chat</h3>
          <p className={styles.featureDescription}>
            Enjoy real-time text messaging with strangers. Chat anonymously and make meaningful
            connections through our simple and fun text chat interface.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Safety & Moderation</h3>
          <p className={styles.featureDescription}>
            Our platform prioritizes your safety with built-in moderation tools. Chat with
            strangers in a secure and monitored environment.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>No Registration Required</h3>
          <p className={styles.featureDescription}>
            Start chatting immediately without creating an account. No email, no sign-up, just
            instant access to chat with strangers online.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Global Connections</h3>
          <p className={styles.featureDescription}>
            Meet new people from around the world. Our platform connects you with strangers from
            different countries and cultures.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Real-time Messaging</h3>
          <p className={styles.featureDescription}>
            Experience instant messaging with no delays. Our real-time chat technology ensures
            smooth conversations with strangers.
          </p>
        </article>
      </div>
    </section>
  );
}

