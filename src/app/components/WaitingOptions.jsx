'use client';

import { useState } from 'react';
import { getPanelPosts } from '@/lib/blogRegistry';
import RiddleGame from './RiddleGame';
import styles from '@/styles/chatPanels.module.scss';

const ONLINE_COUNT_MIN = 5;

/**
 * Shown over the video preview once a search passes a minute.
 *
 * Critically, the search keeps running underneath this — the page used to
 * eject the user at 60s, which made video a dead end at low traffic. Every
 * option here either keeps them queued or moves them somewhere better.
 *
 * @param {() => void} onSwitchToText  leave the video queue for text chat
 * @param {() => void} onNotify        ask for notification permission
 * @param {'idle'|'granted'|'denied'} notifyState
 * @param {() => void} onDismiss       hide the card, keep searching
 * @param {number}     onlineCount
 */
export default function WaitingOptions({
  onSwitchToText,
  onNotify,
  notifyState = 'idle',
  onDismiss,
  onlineCount = 0,
}) {
  const [posts] = useState(() => getPanelPosts(3));
  const busy = onlineCount > ONLINE_COUNT_MIN;

  return (
    <div className={styles.waitingCard}>
      <button
        type="button"
        onClick={onDismiss}
        className={styles.waitingClose}
        aria-label="Hide these options"
      >
        ×
      </button>

      <p className={styles.waitingTitle}>Still looking for someone</p>
      <p className={styles.waitingSub}>
        We haven’t stopped — you’re still in the queue. Here’s what you can do in the meantime.
      </p>

      <div className={styles.panelActions}>
        <button type="button" onClick={onSwitchToText} className={styles.btnPrimary}>
          {busy ? `Switch to text chat — ${onlineCount} online` : 'Switch to text chat'}
        </button>

        {notifyState === 'granted' ? (
          <button type="button" disabled className={styles.btnPending}>
            We’ll ping you when someone joins
          </button>
        ) : (
          <button
            type="button"
            onClick={onNotify}
            className={styles.btnSecondary}
            disabled={notifyState === 'denied'}
          >
            {notifyState === 'denied'
              ? 'Notifications are blocked in your browser'
              : 'Ping me when someone joins'}
          </button>
        )}
      </div>

      <RiddleGame />

      {posts.length > 0 && (
        <div className={styles.panelReads}>
          <p className={styles.panelReadsLabel}>Read while you wait</p>
          <ul className={styles.readsList}>
            {posts.map((post) => (
              <li key={post.slug}>
                {/* New tab, so the video queue survives the click. */}
                <a
                  href={`/blog/${post.slug}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={styles.readCard}
                >
                  <span className={styles.readTitle}>{post.title}</span>
                  {post.readTime && <span className={styles.readMeta}>{post.readTime}</span>}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
