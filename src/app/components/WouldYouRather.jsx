'use client';

import styles from '@/styles/game.module.scss';

/**
 * Would You Rather, rendered inside the chat.
 *
 * All state lives on the server — this component only renders whatever phase
 * it's told about and reports the tap back. It never knows the partner's
 * answer before the server sends the reveal, which is what keeps the
 * simultaneous reveal honest rather than a race between two clients.
 *
 * @param {object}   game       { phase, round, options, yours, theirs, agreed, agreements }
 * @param {Function} onChoose   (index) => void
 * @param {Function} onNext     advance to the next question
 * @param {Function} onQuit     leave the game, stay in the chat
 * @param {Function} onAccept   accept an incoming offer
 * @param {Function} onDecline  decline an incoming offer
 */
export default function WouldYouRather({ game, onChoose, onNext, onQuit, onAccept, onDecline }) {
  if (!game || game.phase === 'idle') return null;

  // Someone offered; we haven't answered the offer yet.
  if (game.phase === 'invited') {
    return (
      <div className={styles.game}>
        <p className={styles.gameTitle}>They want to play Would You Rather</p>
        <div className={styles.gameActions}>
          <button type="button" onClick={onAccept} className={styles.gameBtnPrimary}>
            Let&apos;s play
          </button>
          <button type="button" onClick={onDecline} className={styles.gameBtn}>
            Not now
          </button>
        </div>
      </div>
    );
  }

  if (game.phase === 'offered') {
    return (
      <div className={styles.game}>
        <p className={styles.gameMuted}>Waiting for them to accept…</p>
        <button type="button" onClick={onQuit} className={styles.gameBtn}>
          Cancel
        </button>
      </div>
    );
  }

  const score = game.agreements > 0 && game.round > 0 && (
    <p className={styles.gameScore}>
      Agreed on {game.agreements} of {game.round}
    </p>
  );

  // Both have answered — show what each picked.
  if (game.phase === 'revealed') {
    return (
      <div className={styles.game}>
        <p className={styles.gameRound}>Round {game.round}</p>

        <div className={styles.gameOptions}>
          {game.options.map((option, index) => {
            const mine = game.yours === index;
            const theirs = game.theirs === index;
            return (
              <div
                key={option}
                className={`${styles.gameOption} ${mine || theirs ? styles.gameOptionPicked : ''}`}
              >
                <span>{option}</span>
                <span className={styles.gameTags}>
                  {mine && <span className={styles.gameTagYou}>You</span>}
                  {theirs && <span className={styles.gameTagThem}>Them</span>}
                </span>
              </div>
            );
          })}
        </div>

        <p className={game.agreed ? styles.gameAgreed : styles.gameMuted}>
          {game.agreed ? 'You both picked the same one.' : 'You went different ways.'}
        </p>
        {score}

        <div className={styles.gameActions}>
          <button type="button" onClick={onNext} className={styles.gameBtnPrimary}>
            Next question
          </button>
          <button type="button" onClick={onQuit} className={styles.gameBtn}>
            Stop playing
          </button>
        </div>
      </div>
    );
  }

  // phase === 'question' or 'answered'
  const waiting = game.phase === 'answered';

  return (
    <div className={styles.game}>
      <p className={styles.gameRound}>
        Round {game.round}
        {game.partnerAnswered && !waiting && ' · they’ve answered'}
      </p>

      <p className={styles.gameTitle}>Would you rather…</p>

      <div className={styles.gameOptions}>
        {game.options.map((option, index) => (
          <button
            key={option}
            type="button"
            disabled={waiting}
            onClick={() => onChoose(index)}
            className={`${styles.gameChoice} ${
              waiting && game.yours === index ? styles.gameChoicePicked : ''
            }`}
          >
            {option}
          </button>
        ))}
      </div>

      {waiting && <p className={styles.gameMuted}>Locked in. Waiting for them…</p>}
      {score}

      <button type="button" onClick={onQuit} className={styles.gameBtn}>
        Stop playing
      </button>
    </div>
  );
}
