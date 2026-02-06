'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/consentModal.module.scss';

export default function ConsentModal({ isOpen, onClose, chatType }) {
  const [gender, setGender] = useState('');
  const [isAgeConfirmed, setIsAgeConfirmed] = useState(false);
  const router = useRouter();

  if (!isOpen) return null;

  const handleProceed = () => {
    if (!gender) {
      alert('Please select your gender.');
      return;
    }
    if (!isAgeConfirmed) {
      alert('Please confirm that you are at least 18 years old.');
      return;
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
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.modalTitle}>Before you start...</h2>
        <p className={styles.modalSubtitle}>
          Select your gender so we can match you with the right people.
        </p>

        <div className={styles.genderSection}>
          <p className={styles.genderLabel}>I am:</p>
          <div className={styles.genderButtonsRow}>
            <button
              className={`${styles.genderButton} ${gender === 'male' ? styles.genderButtonActive : ''}`}
              onClick={() => setGender('male')}
            >
              <span className={styles.genderIcon}>♂</span>
              <span>Male</span>
            </button>
            <button
              className={`${styles.genderButton} ${gender === 'female' ? styles.genderButtonActive : ''}`}
              onClick={() => setGender('female')}
            >
              <span className={styles.genderIcon}>♀</span>
              <span>Female</span>
            </button>
          </div>
          <div className={styles.genderButtonsRow}>
            <button
              className={`${styles.genderButton} ${gender === 'other' ? styles.genderButtonActive : ''}`}
              onClick={() => setGender('other')}
            >
              <span>Prefer not to say</span>
            </button>
          </div>
          <p className={styles.genderWarning}>
            *You cannot change your gender after you register.
          </p>
        </div>

        <div className={styles.divider}></div>

        <div className={styles.consentSection}>
          <label className={styles.consentCheckbox}>
            <input
              type="checkbox"
              checked={isAgeConfirmed}
              onChange={(e) => setIsAgeConfirmed(e.target.checked)}
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
