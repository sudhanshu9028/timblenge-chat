'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  PRIME_TIME_LABEL,
  formatCountdown,
  getLocalStartLabel,
  getPrimeTimeState,
} from '@/lib/primeTime';
import { track, EVENTS } from '@/lib/analytics';
import styles from '@/styles/primeTime.module.scss';

const ONLINE_COUNT_MIN = 5;

/**
 * The Prime Time banner.
 *
 * The design rule here is that visual weight tracks urgency. For most of the
 * day this is a quiet caption under the hero — no box, no button, nothing
 * competing with the primary calls to action. It only becomes a solid,
 * accented pill during the hour itself, which is the one moment it has
 * something urgent to say. A component that shouts all day gets ignored by
 * the time it matters.
 *
 * @param {'full'|'compact'} variant  full for the homepage, compact for panels
 */
export default function PrimeTimeBanner({ variant = 'full' }) {
  // Computed after mount only: the server cannot know the reader's timezone,
  // and a server/client mismatch on a countdown hydrates wrong.
  const [state, setState] = useState(null);
  const [onlineCount, setOnlineCount] = useState(0);

  useEffect(() => {
    const tick = () =>
      setState({
        ...getPrimeTimeState(),
        local: getLocalStartLabel(),
        // IST is UTC+5:30; a matching offset means local time == the label,
        // so printing both would just repeat itself.
        localMatchesAnchor: new Date().getTimezoneOffset() === -330,
      });
    tick();
    const id = setInterval(tick, 30_000);
    return () => clearInterval(id);
  }, []);

  // Only worth a request while the window is actually open.
  useEffect(() => {
    if (state?.status !== 'live') return undefined;

    let cancelled = false;
    const fetchCount = async () => {
      try {
        const res = await fetch('/api/online');
        const data = await res.json();
        if (!cancelled && typeof data.count === 'number') setOnlineCount(data.count);
      } catch {
        // The banner reads fine without a number.
      }
    };
    fetchCount();
    const id = setInterval(fetchCount, 30_000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [state?.status]);

  if (!state) return null;

  const isLive = state.status === 'live';
  const timeDetail = state.localMatchesAnchor
    ? PRIME_TIME_LABEL
    : `${PRIME_TIME_LABEL} · ${state.local} your time`;

  let headline;
  let detail;

  if (isLive) {
    headline = 'Prime time is live';
    detail =
      onlineCount > ONLINE_COUNT_MIN
        ? `${onlineCount} people online right now`
        : `${formatCountdown(state.minutesLeft)} left`;
  } else if (state.status === 'soon') {
    headline = `Prime time in ${formatCountdown(state.minutesUntil)}`;
    detail = timeDetail;
  } else {
    headline = 'Busiest hour';
    detail = timeDetail;
  }

  const classes = [styles.banner, styles[state.status], variant === 'compact' ? styles.compact : '']
    .filter(Boolean)
    .join(' ');

  return (
    <div className={classes}>
      <span className={isLive ? styles.dotLive : styles.dot} aria-hidden="true" />
      <span className={styles.headline}>{headline}</span>
      <span className={styles.separator} aria-hidden="true" />
      <span className={styles.detail}>{detail}</span>

      {/* A second call to action only earns its place once the hour is
          actually live. Before that the hero buttons are right above it. */}
      {isLive && variant === 'full' && (
        <Link
          href="/chat"
          className={styles.cta}
          onClick={() => track(EVENTS.PRIME_TIME_CLICK, { state: state.status })}
        >
          Join now
        </Link>
      )}
    </div>
  );
}
