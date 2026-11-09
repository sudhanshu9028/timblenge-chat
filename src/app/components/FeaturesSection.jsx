import styles from '@/styles/home.module.scss';

export default function FeaturesSection() {
  return (
    <section className={styles.features}>
      <h2 className={styles.sectionTitle}>What you get on Anoniz</h2>
      <div className={styles.featuresGrid}>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Random video chat with strangers</h3>
          <p className={styles.featureDescription}>
            Talk face-to-face with a random person in your browser — no plugin, no download, no
            store listing. Camera access is asked for once and you can end the call at any moment.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Anonymous text chat</h3>
          <p className={styles.featureDescription}>
            Prefer to keep the camera off? Text chat pairs you with a stranger for real-time
            messaging, with no profile attached and no message history left behind.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Interest-based matching</h3>
          <p className={styles.featureDescription}>
            Add topics you actually care about — music, gaming, travel, language exchange — and
            Anoniz tries to pair you with someone who shares them instead of pairing at random.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>No app, no sign-up</h3>
          <p className={styles.featureDescription}>
            There is nothing to install and no account to create. App-based chat platforms now face
            age-gating and removal from app stores; a browser tab has neither problem.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>Nothing stored</h3>
          <p className={styles.featureDescription}>
            Anoniz does not store, record, or log your conversations. When you disconnect, the
            conversation is gone — there is no archive to search and nothing to leak later.
          </p>
        </article>
        <article className={styles.featureCard}>
          <h3 className={styles.featureTitle}>18+, anonymous, ad-free</h3>
          <p className={styles.featureDescription}>
            Every chat starts behind an age confirmation, there are no profiles to look anyone up
            by, and photos are view-once. No ads, no premium tier, no upsell mid-conversation.
          </p>
        </article>
      </div>
    </section>
  );
}
