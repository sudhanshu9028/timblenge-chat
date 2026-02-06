import styles from '@/styles/home.module.scss';

export default function HowItWorksSection() {
  return (
    <section className={styles.howItWorks}>
      <h2 className={styles.sectionTitle}>How It Works</h2>
      <div className={styles.steps}>
        <article className={styles.step}>
          <div className={styles.stepNumber}>1</div>
          <h3 className={styles.stepTitle}>Select Your Gender</h3>
          <p className={styles.stepDescription}>
            Choose your gender preference to help us match you with compatible strangers.
          </p>
        </article>
        <article className={styles.step}>
          <div className={styles.stepNumber}>2</div>
          <h3 className={styles.stepTitle}>Choose Chat Type</h3>
          <p className={styles.stepDescription}>
            Select between video chat or text chat to start your conversation with strangers.
          </p>
        </article>
        <article className={styles.step}>
          <div className={styles.stepNumber}>3</div>
          <h3 className={styles.stepTitle}>Connect & Chat</h3>
          <p className={styles.stepDescription}>
            Get instantly connected with a random stranger and start making new friends online.
          </p>
        </article>
      </div>
    </section>
  );
}

