import styles from '@/styles/home.module.scss';

export default function CTASection({ onButtonClick }) {
  return (
    <section className={styles.ctaSection}>
      <h2 className={styles.ctaTitle}>Ready to Talk to Strangers?</h2>
      <p className={styles.ctaDescription}>
        Join thousands of users who are already making new friends and chatting with strangers
        online. Start your journey today!
      </p>
      <div className={styles.ctaButtons}>
        <div className={styles.actionButtons}>
          <button className={styles.actionButton} onClick={() => onButtonClick('text')}>
            Text Chat
          </button>
          <button className={styles.actionButton} onClick={() => onButtonClick('video')}>
            Video Chat
          </button>
        </div>
      </div>
    </section>
  );
}

