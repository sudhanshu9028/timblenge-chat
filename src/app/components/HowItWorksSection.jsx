import styles from '@/styles/home.module.scss';

// The steps follow the real flow: the chat type is picked on this page, then
// the consent modal asks for gender, interests and the 18+ confirmation.
const STEPS = [
  {
    title: 'Pick text or video',
    description:
      'Text keeps your camera off. Video asks for camera access once, and you can end the call at any moment.',
  },
  {
    title: 'Confirm you are 18 or older',
    description:
      'Choose your gender if you like, add a few interests to match on, and tick the age box. No email, no account.',
  },
  {
    title: 'Start talking',
    description:
      'You are paired with a random stranger. Tap Next chat to meet someone new, and nothing is kept once you leave.',
  },
];

export default function HowItWorksSection() {
  return (
    <section className={styles.howItWorks}>
      <h2 className={styles.sectionTitle}>How it works</h2>
      <div className={styles.steps}>
        {STEPS.map((step, i) => (
          <article key={step.title} className={styles.step}>
            <div className={styles.stepNumber}>{String(i + 1).padStart(2, '0')}</div>
            <h3 className={styles.stepTitle}>{step.title}</h3>
            <p className={styles.stepDescription}>{step.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
