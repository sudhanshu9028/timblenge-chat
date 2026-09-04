'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { getRiddle } from '@/lib/riddles';
import { bump } from '@/lib/profile';
import { track, EVENTS } from '@/lib/analytics';
import styles from '@/styles/chatPanels.module.scss';

/**
 * Something to do while the queue works.
 *
 * The one rule: this serves the wait, never the other way round. It is
 * unmounted the instant a match lands, and nothing in it can delay or block
 * the connection.
 */
export default function RiddleGame() {
  const [riddle, setRiddle] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [solved, setSolved] = useState(0);
  const seenRef = useRef([]);

  const nextRiddle = useCallback(() => {
    const next = getRiddle(seenRef.current);
    seenRef.current = [...seenRef.current, next.index];
    setRiddle(next);
    setRevealed(false);
  }, []);

  // Picked on mount, not during render, so the server and client agree.
  useEffect(() => {
    nextRiddle();
  }, [nextRiddle]);

  if (!riddle) return null;

  const handleGotIt = () => {
    setSolved((n) => n + 1);
    bump({ riddlesSolved: 1 });
    track(EVENTS.RIDDLE_SOLVED);
    nextRiddle();
  };

  return (
    <div className={styles.riddle}>
      <p className={styles.riddleLabel}>
        Riddle while you wait{solved > 0 && ` · ${solved} solved`}
      </p>

      <p className={styles.riddleQuestion}>{riddle.q}</p>

      {revealed ? (
        <>
          <p className={styles.riddleAnswer}>{riddle.a}</p>
          <div className={styles.riddleActions}>
            <button type="button" onClick={handleGotIt} className={styles.riddleBtnPrimary}>
              I got it
            </button>
            <button type="button" onClick={nextRiddle} className={styles.riddleBtn}>
              Next riddle
            </button>
          </div>
        </>
      ) : (
        <div className={styles.riddleActions}>
          <button type="button" onClick={() => setRevealed(true)} className={styles.riddleBtn}>
            Show answer
          </button>
          <button type="button" onClick={nextRiddle} className={styles.riddleBtn}>
            Skip
          </button>
        </div>
      )}
    </div>
  );
}
