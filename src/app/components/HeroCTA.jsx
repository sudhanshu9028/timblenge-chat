'use client';

import Link from 'next/link';
import { track, EVENTS } from '@/lib/analytics';

const iconProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
};

export default function HeroCTA({ styles }) {
  const trackClick = (target) => track(EVENTS.CTA_CLICK, { location: 'home', target });

  return (
    <div className={styles.heroCTA}>
      <div className={styles.actionButtons}>
        <Link href="/chat" className={styles.actionButton} onClick={() => trackClick('text_chat')}>
          <svg {...iconProps}>
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
          Text Chat
        </Link>
        <Link
          href="/video"
          className={styles.actionButton}
          onClick={() => trackClick('video_chat')}
        >
          <svg {...iconProps}>
            <path d="m16 13 5.223 3.482a.5.5 0 0 0 .777-.416V7.87a.5.5 0 0 0-.752-.432L16 10.5" />
            <rect x="2" y="6" width="14" height="12" rx="2" />
          </svg>
          Video Chat
        </Link>
      </div>
    </div>
  );
}
