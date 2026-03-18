'use client';

import Link from 'next/link';

export default function HeroCTA({ styles }) {
  const trackClick = (buttonName) => {
    if (typeof window !== 'undefined' && typeof window.gtag === 'function') {
      const platform = window.innerWidth <= 768 ? 'mweb' : 'web';
      window.gtag('event', `home_${buttonName}`, { platform });
    }
  };

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
