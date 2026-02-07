import styles from '@/styles/home.module.scss';

export default function BenefitsSection() {
  return (
    <section className={styles.benefits}>
      <h2 className={styles.sectionTitle}>Why Choose Anoniz?</h2>
      <div className={styles.benefitsContent}>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>Anonymous Chat, Meet New People</h3>
          <p className={styles.benefitDescription}>
            Chat anonymously with strangers and meet new people without revealing your identity.
            Our anonymous chat platform allows you to make friends online while maintaining your
            privacy.
          </p>
        </article>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>
            Chat with Random Strangers With Similar Interests
          </h3>
          <p className={styles.benefitDescription}>
            Connect with random strangers who share your interests. Our matching system helps you
            find people to talk to who have similar hobbies and passions.
          </p>
        </article>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>Simple and Fun Video Chats</h3>
          <p className={styles.benefitDescription}>
            Enjoy simple and fun video chats with strangers. No complicated setup required – just
            click and start talking to strangers through video.
          </p>
        </article>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>From Strangers to Friends</h3>
          <p className={styles.benefitDescription}>
            Turn random encounters into lasting friendships. Many users have found their best
            friends through our platform by chatting with strangers online.
          </p>
        </article>
      </div>
    </section>
  );
}

