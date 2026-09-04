'use client';

import Link from 'next/link';
import { track, EVENTS } from '@/lib/analytics';

export default function HeroCTA({ styles }) {
  const trackClick = (target) => track(EVENTS.CTA_CLICK, { location: 'home', target });

  return (
    <div className={styles.heroCTA}>
      <div className={styles.actionButtons}>
        <Link href="/chat" className={styles.actionButton} onClick={() => trackClick('text_chat')}>
          Text Chat
        </Link>
        <Link
          href="/video"
          className={styles.actionButton}
          onClick={() => trackClick('video_chat')}
        >
          Video Chat
        </Link>
      </div>
    </div>
  );
}
