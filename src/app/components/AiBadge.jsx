import styles from '@/styles/chatPanels.module.scss';
import { AI_DISPLAY_NAME } from '@/lib/aiIdentity';

/**
 * Marks a conversation as being with the AI rather than a person.
 * Shown for the whole duration of a bot chat — never hidden, never delayed.
 */
export default function AiBadge({ compact = false }) {
  return (
    <span className={`${styles.aiBadge} ${compact ? styles.aiBadgeCompact : ''}`}>
      <span className={styles.aiBadgeDot} aria-hidden="true" />
      {AI_DISPLAY_NAME}
    </span>
  );
}
