'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { Baloo_2 } from 'next/font/google';
import { track, EVENTS } from '@/lib/analytics';
import {
  REELZ_FORM_ACTION,
  REELZ_SIGNUP_CREDITS,
  isReelzAudience,
  reelzTracking,
  reelzUrl,
} from '@/lib/reelzPromo';
import styles from '@/styles/reelzPromo.module.scss';

// Reelz's display face, for its name and headline only. Not preloaded: most
// visitors are outside India, never render it, and so never download it.
const baloo = Baloo_2({
  subsets: ['latin'],
  weight: '800',
  display: 'swap',
  preload: false,
  variable: '--font-reelz',
});

const CREDITS = REELZ_SIGNUP_CREDITS;
const TOPIC_IDEAS = ['Diwali ki kahani', 'Chai ke 5 facts'];

// Analytics names for each variant. Fixed values, so GA groups them cleanly.
const BANNER = { strip: 'strip', card: 'reel_card', topic: 'topic_box' };
const SLOT_CLASS = { strip: styles.slotStrip, card: styles.slotCard, topic: styles.slotTopic };

function ReelzMark({ className }) {
  return (
    <svg className={className} viewBox="0 0 64 64" aria-hidden="true" focusable="false">
      <rect width="64" height="64" rx="18" fill="#14121F" />
      <circle cx="32" cy="32" r="18" fill="none" stroke="#FFB300" strokeWidth="7" />
      <circle
        cx="32"
        cy="32"
        r="18"
        fill="none"
        stroke="#D81B60"
        strokeWidth="7"
        strokeDasharray="84.8 113.1"
        strokeLinecap="round"
        transform="rotate(-90 32 32)"
      />
      <path
        d="M28 25.5v13l10.5-6.5z"
        fill="#fff"
        stroke="#fff"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Arrow({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      width="16"
      height="16"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M5 12h14M13 6l6 6-6 6" />
    </svg>
  );
}

/** Homepage: a slim Reelz-yellow bar with the button in the middle. */
function Strip({ href, onClick }) {
  return (
    <a
      className={styles.strip}
      href={href}
      target="_blank"
      rel="noopener nofollow"
      onClick={onClick}
      aria-label={`Reelz: Hindi mein AI Reels banao. Sign up par ${CREDITS} credits free. Try karo.`}
    >
      <span className={styles.stripSide}>
        <span className={styles.stripBrand}>
          <ReelzMark className={styles.stripMark} />
          <span className={styles.stripName}>Reelz</span>
        </span>
        <span className={styles.stripNote}>
          <span className={styles.wide}>Hindi mein AI Reels</span>
          <span className={styles.narrow}>AI Reels</span>
        </span>
      </span>

      <span className={styles.stripCta}>
        Try karo
        <Arrow className={styles.wide} />
      </span>

      <span className={`${styles.stripSide} ${styles.stripEnd}`}>
        <span className={styles.stripName}>
          {CREDITS} credits<span className={styles.wide}> free</span>
        </span>
        <span className={styles.stripNote}>
          <span className={styles.wide}>sign up karte hi</span>
          <span className={styles.narrow}>signup pe free</span>
        </span>
      </span>
    </a>
  );
}

/** Blog posts: Reelz's own look, with a little phone whose caption changes. */
function Card({ href, onClick }) {
  return (
    <a className={styles.card} href={href} target="_blank" rel="noopener nofollow" onClick={onClick}>
      <span className={styles.cardText}>
        <span className={styles.cardEyebrow}>Anoniz ki team se · Naya</span>
        <span className={styles.cardHead}>
          Ek topic likho,
          <br />
          <mark>Reel taiyaar.</mark>
        </span>
        <span className={styles.cardSub}>
          Hindi voice-over, AI images aur captions. Instagram Reels aur YouTube Shorts ke liye.
        </span>
        <span className={styles.cardCta}>
          Reel banao
          <Arrow />
        </span>
        <span className={styles.cardFine}>Sign up par {CREDITS} credits free</span>
      </span>

      <span className={styles.cardPhone} aria-hidden="true">
        <span className={styles.cardPlay} />
        <span className={styles.cardCaps}>
          <span>Diwali ki kahani</span>
          <span>Chai ke 5 facts</span>
          <span>Monday motivation</span>
        </span>
      </span>
    </a>
  );
}

/**
 * End of chat: type a topic and Reelz opens with it already in the form.
 * A plain GET form, so Enter works and nothing depends on script once loaded.
 */
function TopicBox({ slot, banner, onSubmit }) {
  const inputId = useId();
  const [topic, setTopic] = useState('');

  return (
    <div className={styles.topic} role="group" aria-label="Reelz: topic se Reel banao">
      <div className={styles.topicId}>
        <ReelzMark className={styles.topicMark} />
        <span>
          <span className={styles.topicName}>Reelz</span>
          <span className={styles.topicBy}>Anoniz ki team ka naya app</span>
        </span>
      </div>

      <p className={styles.topicHead}>Chat khatam? Ab ek Reel bana lo.</p>
      <p className={styles.topicSub}>
        Topic likho, Hindi voice-over aur captions wali Reel ban jayegi.
      </p>

      <form
        className={styles.topicRow}
        action={REELZ_FORM_ACTION}
        method="get"
        target="_blank"
        rel="noopener nofollow"
        onSubmit={() => onSubmit({ has_topic: topic.trim().length > 0 })}
      >
        <label htmlFor={inputId} className={styles.srOnly}>
          Reel ka topic
        </label>
        <input
          id={inputId}
          name="prompt"
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Jaise: Diwali ki kahani"
          maxLength={120}
          autoComplete="off"
          enterKeyHint="go"
        />
        {Object.entries(reelzTracking(slot, banner)).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <button type="submit" className={styles.topicGo}>
          Banao
          <Arrow />
        </button>
      </form>

      <div className={styles.topicChips}>
        {TOPIC_IDEAS.map((idea) => (
          <button key={idea} type="button" onClick={() => setTopic(idea)}>
            {idea}
          </button>
        ))}
      </div>

      <p className={styles.topicFine}>
        Sign up par {CREDITS} credits free · koi subscription nahi
      </p>
    </div>
  );
}

/**
 * Promotes reelz.in to visitors in India. Renders an empty, hidden slot on the
 * server and for everyone else; see src/lib/reelzPromo.js for why.
 *
 * @param {'strip'|'card'|'topic'} variant
 * @param {string} slot  where it sits, for analytics and UTM, e.g. 'home_hero'
 */
export default function ReelzPromo({ variant, slot }) {
  const [show, setShow] = useState(false);
  const ref = useRef(null);
  const banner = BANNER[variant];

  // Read after mount: the flag lives on <html>, set by a script the server
  // never runs, so rendering it during SSR would mismatch on hydration.
  useEffect(() => setShow(isReelzAudience()), []);

  // Count a view only once half the banner is on screen. The blog card sits
  // below the fold, and counting page loads would understate its click rate.
  useEffect(() => {
    const el = ref.current;
    if (!show || !el) return undefined;
    if (typeof IntersectionObserver === 'undefined') {
      track(EVENTS.PROMO_SHOWN, { slot, banner });
      return undefined;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          track(EVENTS.PROMO_SHOWN, { slot, banner });
          observer.disconnect();
        }
      },
      { threshold: 0.5 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [show, slot, banner]);

  // The typed topic is never sent to analytics, only whether there was one.
  const onClick = (extra = {}) => track(EVENTS.PROMO_CLICK, { slot, banner, ...extra });
  const href = reelzUrl(slot, banner);

  return (
    <div ref={ref} className={`${styles.slot} ${SLOT_CLASS[variant]} ${baloo.variable}`}>
      {show && variant === 'strip' && <Strip href={href} onClick={() => onClick()} />}
      {show && variant === 'card' && <Card href={href} onClick={() => onClick()} />}
      {show && variant === 'topic' && <TopicBox slot={slot} banner={banner} onSubmit={onClick} />}
    </div>
  );
}
