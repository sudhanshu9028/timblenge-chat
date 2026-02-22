'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/consentModal.module.scss';

export default function ConsentModal({ isOpen, onClose, chatType }) {
  const [gender, setGender] = useState('');
  const [interests, setInterests] = useState('');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleClose = () => {
    if (onClose) {
      onClose();
    } else {
      router.push('/');
    }
  };

  const handleProceed = () => {
    if (!gender) {
      setError('Please select your gender.');
      return;
    }
    if (!isAgeConfirmed) {
      setError('Please confirm that you are at least 18 years old.');
      return;
    }

    setError('');

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
      sessionStorage.setItem('gender', gender);
      router.push(`/video/${uniqueVideoId}`);
    } else {
      const uniqueChatId = uuidv4();
      sessionStorage.setItem('chatInitiated', 'true');
      sessionStorage.setItem('uniqueChatId', uniqueChatId);
      sessionStorage.setItem('gender', gender);
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
        <h2 className={styles.modalTitle}>Before you start...</h2>
        <p className={styles.modalSubtitle}>
          Select your gender so we can match you with the right people.
        </p>

        <div className={styles.genderSection}>
          <p className={styles.genderLabel}>I am:</p>
          <div className={styles.genderButtonsRow}>
            <button
              className={`${styles.genderButton} ${gender === 'male' ? styles.genderButtonActive : ''}`}
              onClick={() => {
                setGender('male');
                setError('');
              }}
            >
              <span className={styles.genderIcon}>♂</span>
              <span>Male</span>
            </button>
            <button
              className={`${styles.genderButton} ${gender === 'female' ? styles.genderButtonActive : ''}`}
              onClick={() => {
                setGender('female');
                setError('');
              }}
            >
              <span className={styles.genderIcon}>♀</span>
              <span>Female</span>
            </button>
          </div>
          <div className={styles.genderButtonsRow}>
            <button
              className={`${styles.genderButton} ${gender === 'other' ? styles.genderButtonActive : ''}`}
              onClick={() => {
                setGender('other');
                setError('');
              }}
            >
              <span>Prefer not to say</span>
            </button>
          </div>
          <p className={styles.genderWarning}>
            *You cannot change your gender after you register.
          </p>
        </div>

        <div className={styles.divider}></div>

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

        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}

        <button
          className={styles.proceedButton}
          onClick={handleProceed}
          disabled={!gender || !isAgeConfirmed}
        >
          I AGREE, LET&apos;S GO!
        </button>
      </div>
    </div>
  );
}
