import styles from '@/styles/home.module.scss';

const ROWS = [
  {
    label: 'Download or install',
    anoniz: 'None — runs in your browser',
    apps: 'App store download required',
    social: 'App or desktop client',
  },
  {
    label: 'Account or profile',
    anoniz: 'No sign-up, no email',
    apps: 'Usually required',
    social: 'Always required',
  },
  {
    label: 'Your identity',
    anoniz: 'Anonymous by default',
    apps: 'Tied to a store account',
    social: 'Tied to a public profile',
  },
  {
    label: 'Conversation history',
    anoniz: 'Not stored — gone on disconnect',
    apps: 'Varies by platform',
    social: 'Kept indefinitely',
  },
  {
    label: 'Works on a phone browser',
    anoniz: 'Yes, Android and iOS',
    apps: 'App only',
    social: 'Limited in browser',
  },
  {
    label: 'Cost',
    anoniz: 'Free, no premium tier',
    apps: 'Free tier plus paid upgrades',
    social: 'Free with ads or subscriptions',
  },
];

export default function ComparisonSection() {
  return (
    <section className={styles.comparison}>
      <h2 className={styles.sectionTitle}>How Anoniz Compares</h2>
      <p className={styles.comparisonIntro}>
        Omegle closed in November 2023, and the random chat apps that replaced it now sit under
        stricter app store rules — Google Play began treating anonymous and random chat apps as
        age-restricted in August 2026, and Apple lists random chat among the app types it can remove
        without notice. A browser-based platform has no listing to lose and nothing to install.
      </p>
      <div className={styles.comparisonTableWrapper}>
        <table className={styles.comparisonTable}>
          <thead>
            <tr>
              <th scope="col">&nbsp;</th>
              <th scope="col">Anoniz</th>
              <th scope="col">Random chat apps</th>
              <th scope="col">Social apps &amp; servers</th>
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row) => (
              <tr key={row.label}>
                <th scope="row">{row.label}</th>
                <td className={styles.comparisonHighlight}>{row.anoniz}</td>
                <td>{row.apps}</td>
                <td>{row.social}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
