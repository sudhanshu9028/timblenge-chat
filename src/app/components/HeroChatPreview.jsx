import styles from '@/styles/home.module.scss';

/**
 * A still of the text chat, drawn with the same parts as the real one: the
 * stranger's bubbles in pink, yours in slate, the Would You Rather chip and
 * the composer. It is the homepage's visual, so it shows what the product
 * is instead of decorating around it.
 *
 * Hidden from assistive tech, since it is a picture of a conversation rather
 * than content, and kept out of search snippets so the made-up chat never
 * shows up as the homepage's description.
 */
const THREAD = [
  { from: 'theirs', text: 'hey. what keeps you up this late' },
  { from: 'mine', text: 'exam tomorrow, so obviously I’m talking to strangers' },
  { from: 'theirs', text: 'classic. what subject?' },
  { from: 'mine', text: 'organic chemistry. you?' },
  { from: 'theirs', text: 'night shift in Toronto. it’s my lunch break' },
];

export default function HeroChatPreview() {
  return (
    <div className={styles.preview} aria-hidden="true" data-nosnippet="">
      <div className={styles.previewWindow}>
        <div className={styles.previewHeader}>
          <span className={styles.liveDot} />
          Stranger
          <span className={styles.previewMeta}>Text chat</span>
        </div>

        <div className={styles.previewThread}>
          <p className={styles.previewSystem}>Stranger connected.</p>
          {THREAD.map((msg) => (
            <p
              key={msg.text}
              className={msg.from === 'mine' ? styles.bubbleMine : styles.bubbleTheirs}
            >
              {msg.text}
            </p>
          ))}
          <div className={styles.previewTyping}>
            <span />
            <span />
            <span />
          </div>
        </div>

        <div className={styles.previewChip}>
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M8 8h.01M16 8h.01M12 12h.01M8 16h.01M16 16h.01" strokeWidth="2.5" />
          </svg>
          Would You Rather
        </div>

        <div className={styles.previewComposer}>
          <span className={styles.previewInput}>Type a message</span>
          <span className={styles.previewSend}>Send</span>
        </div>
      </div>
    </div>
  );
}
