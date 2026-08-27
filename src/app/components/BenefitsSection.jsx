import styles from '@/styles/home.module.scss';

export default function BenefitsSection() {
  return (
    <section className={styles.benefits}>
      <h2 className={styles.sectionTitle}>Why People Chat with Strangers Here</h2>
      <div className={styles.benefitsContent}>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>Anonymous by Default, Not by Setting</h3>
          <p className={styles.benefitDescription}>
            You are not asked for an email, a phone number, or a profile photo, so there is no
            identity to protect in the first place. Nobody sees a follower count or a post history —
            only what you choose to say.
          </p>
        </article>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>A Conversation in Under a Minute</h3>
          <p className={styles.benefitDescription}>
            Pick text or video, confirm you are 18 or older, and you are matched. No install, no
            verification email, no waiting for someone to accept a request before you can talk.
          </p>
        </article>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>Works on the Phone You Already Have</h3>
          <p className={styles.benefitDescription}>
            Anoniz runs in any modern browser on Android, iOS, and desktop. Nothing takes up storage
            and nothing needs updating, which also means no app store can remove it from your phone.
          </p>
        </article>
        <article className={styles.benefitItem}>
          <h3 className={styles.benefitTitle}>Strangers Beat the Group Chat</h3>
          <p className={styles.benefitDescription}>
            Talking to someone with no context about you is easier than talking to people who have
            plenty. There is no reputation to manage and no history to work around — just a
            conversation that ends when you close the tab.
          </p>
        </article>
      </div>
    </section>
  );
}
