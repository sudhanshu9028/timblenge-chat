'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getPanelPosts } from '@/lib/blogRegistry';
import PushPrompt from './PushPrompt';
import { getProfileSummary } from '@/lib/profile';
import styles from '@/styles/chatPanels.module.scss';

const ONLINE_COUNT_MIN = 5;

/**
 * What a user sees when a conversation ends.
 *
 * This used to be one line of text and one button, which is where most
 * sessions died. Now it offers the three things worth doing next: another
 * stranger, the one they just lost, or the other chat mode — plus something
 * to read if they're not ready to start again.
 *
 * @param {'text'|'video'} mode          which surface this is rendered on
 * @param {string}         title         who just left — the AI has its own name
 * @param {() => void}     onFindNew     start searching again
 * @param {'unavailable'|'available'|'pending'} reconnectState
 * @param {() => void}     onReconnect   ask to reconnect with the last stranger
 * @param {number}         onlineCount   live presence, from the socket
 * @param {boolean}        pushEligible  true after a conversation worth
 *                                       following up on — we only ask for
 *                                       notification permission then
 */
export default function DisconnectedPanel({
  mode = 'text',
  title = 'Stranger disconnected',
  onFindNew,
  reconnectState = 'unavailable',
  onReconnect,
  onlineCount = 0,
  pushEligible = false,
}) {
  // Picked once per mount so the list doesn't reshuffle on every re-render.
  const [posts] = useState(() => getPanelPosts(3));
  // Read after mount: the profile lives in localStorage, which the server
  // can't see, so rendering it directly would mismatch on hydration.
  const [summary, setSummary] = useState(null);
  useEffect(() => setSummary(getProfileSummary()), []);

  const otherMode = mode === 'text' ? 'video' : 'text';
  const otherHref = otherMode === 'video' ? '/video' : '/chat';

  return (
    <div className={styles.panel}>
      <p className={styles.panelTitle}>{title}</p>

      {onlineCount > ONLINE_COUNT_MIN && (
        <p className={styles.panelCount}>
          <span className={styles.liveDot} aria-hidden="true" />
          {onlineCount} people online right now
        </p>
      )}

      <div className={styles.panelActions}>
        <button type="button" onClick={onFindNew} className={styles.btnPrimary}>
          Find new stranger
        </button>

        {reconnectState === 'available' && (
          <button type="button" onClick={onReconnect} className={styles.btnSecondary}>
            Reconnect with last stranger
          </button>
        )}

        {reconnectState === 'pending' && (
          <button type="button" disabled className={styles.btnPending}>
            Waiting for them to accept…
          </button>
        )}

        <Link href={otherHref} className={styles.btnGhost}>
          {otherMode === 'video' ? 'Try video chat instead' : 'Try text chat instead'}
        </Link>
      </div>

      <PushPrompt eligible={pushEligible} />

      {summary && <p className={styles.profileSummary}>{summary}</p>}

      {posts.length > 0 && (
        <div className={styles.panelReads}>
          <p className={styles.panelReadsLabel}>While you’re here</p>
          <ul className={styles.readsList}>
            {posts.map((post) => (
              <li key={post.slug}>
                {/* New tab: a same-tab navigation would end the session. */}
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
