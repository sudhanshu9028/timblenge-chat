'use client';

import { useEffect, useState } from 'react';
import styles from '@/styles/chatPanels.module.scss';
import { AI_DISPLAY_NAME } from '@/lib/aiIdentity';
import RiddleGame from './RiddleGame';
import PrimeTimeBanner from './PrimeTimeBanner';
import { getPrimeTimeState } from '@/lib/primeTime';

// Only show a real number once there are enough people for it to read as
// "this place is alive" rather than "you are almost alone". Below this we say
// nothing — an honest silence beats an inflated counter.
const ONLINE_COUNT_MIN = 5;

// Long enough that a fast match isn't interrupted by a game appearing.
const RIDDLE_AFTER_SECONDS = 15;

/**
 * The waiting state for both chat and video.
 *
 * Users now wait up to a minute instead of three seconds, so this has to give
 * them something to read while the queue works. The copy changes as time
 * passes so the wait feels like progress rather than a hang.
 */
export default function SearchingState({ mode = 'text', onlineCount = 0, showRiddle = true }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setElapsed((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  let headline = 'Looking for someone…';
  if (elapsed >= 45) headline = 'Still looking — it can take a moment when it’s quiet.';
  else if (elapsed >= 20) headline = 'Still looking…';

  // Text chat hands over to the AI at 60s, so warn just before it happens.
  const showAiHint = mode === 'text' && elapsed >= 35;
  const primeTimeSoon = getPrimeTimeState().status !== 'later';

  return (
    <div className={styles.searching}>
      <div className={styles.searchingPulse} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <p className={styles.searchingHeadline}>{headline}</p>

      {onlineCount > ONLINE_COUNT_MIN && (
        <p className={styles.searchingCount}>
          <span className={styles.liveDot} aria-hidden="true" />
          {onlineCount} people online right now
        </p>
      )}

      {showRiddle && elapsed >= RIDDLE_AFTER_SECONDS && <RiddleGame />}

      {/* Only mention Prime Time when it's close enough to act on. */}
      {elapsed >= 20 && primeTimeSoon && <PrimeTimeBanner variant="compact" />}

      {showAiHint && (
        <p className={styles.searchingHint}>
          No one’s free this second. We’ll keep looking in the background — meanwhile you can warm
          up with <strong>{AI_DISPLAY_NAME}</strong>, and we’ll swap you over the moment a real
          person shows up.
        </p>
      )}
    </div>
  );
}
