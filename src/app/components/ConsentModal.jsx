'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { track, EVENTS } from '@/lib/analytics';
import styles from '@/styles/consentModal.module.scss';

export default function ConsentModal({ isOpen, onClose, chatType }) {
  const [interests, setInterests] = useState('');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  // The age gate is the first thing between a visitor and the product, so the
  // shown/completed pair is what tells us how many bounce off it.
  useEffect(() => {
    if (isOpen) track(EVENTS.CONSENT_SHOWN, { chat_type: chatType });
  }, [isOpen, chatType]);

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const handleProceed = () => {
    if (!isAgeConfirmed) {
      setError('Please confirm that you are at least 18 years old.');
      return;
    }

    setError('');

    track(EVENTS.CONSENT_COMPLETED, {
      chat_type: chatType,
      has_interests: interests.trim() ? 'yes' : 'no',
    });

    // Store interests if provided
    if (interests.trim()) {
      sessionStorage.setItem('interests', interests.trim());
    } else {
      sessionStorage.removeItem('interests');
    }

    if (chatType === 'video') {
      const uniqueVideoId = uuidv4();
      sessionStorage.setItem('videoInitiated', 'true');
      sessionStorage.setItem('uniqueVideoId', uniqueVideoId);
      router.push(`/video/${uniqueVideoId}`);
    } else {
      const uniqueChatId = uuidv4();
      sessionStorage.setItem('chatInitiated', 'true');
      sessionStorage.setItem('uniqueChatId', uniqueChatId);
      router.push(`/chat/${uniqueChatId}`);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={handleClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={handleClose} aria-label="Close">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
        <h2 className={styles.modalTitle}>Before you start</h2>
        <p className={styles.modalSubtitle}>
          One quick check, then we&apos;ll find someone to talk to.
        </p>

        <div className={styles.interestsSection}>
          <p className={styles.interestsLabel}>Add interests (optional)</p>
          <input
            type="text"
            className={styles.interestsInput}
            placeholder="e.g. music, travel, gaming"
            value={interests}
            onChange={(e) => setInterests(e.target.value)}
          />
          <p className={styles.interestsHint}>
            Separate interests with commas to find like-minded strangers.
          </p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.consentSection}>
          <label className={styles.consentCheckbox}>
            <input
              type="checkbox"
              checked={isAgeConfirmed}
              onChange={(e) => {
                setIsAgeConfirmed(e.target.checked);
                if (e.target.checked) setError('');
              }}
            />
            <span className={styles.consentText}>
              I&apos;m at least <strong className={styles.ageHighlight}>18 years old</strong> and
              have read and agree to the{' '}
              <a href="/terms" className={styles.link}>
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="/privacy-policy" className={styles.link}>
                Privacy Policy
              </a>
            </span>
          </label>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button className={styles.proceedButton} onClick={handleProceed} disabled={!isAgeConfirmed}>
          I agree, let’s go
        </button>
      </div>
    </div>
  );
}
