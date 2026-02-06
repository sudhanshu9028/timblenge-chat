'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styles from '@/styles/home.module.scss';

export default function GenderSelector() {
  const [gender, setGender] = useState('');
  const router = useRouter();

  const handleStartChat = () => {
    if (!gender) {
      alert('Please select a gender before starting.');
      return;
    }
    const uniqueChatId = uuidv4();
    sessionStorage.setItem('chatInitiated', 'true');
    sessionStorage.setItem('uniqueChatId', uniqueChatId);
    sessionStorage.setItem('gender', gender);
    router.push(`/chat/${uniqueChatId}`);
  };

  const handleStartVideo = () => {
    if (!gender) {
      alert('Please select a gender before starting.');
      return;
    }
    const uniqueVideoId = uuidv4();
    sessionStorage.setItem('videoInitiated', 'true');
    sessionStorage.setItem('uniqueVideoId', uniqueVideoId);
    sessionStorage.setItem('gender', gender);
    router.push(`/video/${uniqueVideoId}`);
  };

  return (
    <div className={styles.card}>
      <p className={styles.label}>Select your gender:</p>

      <div className={styles.radioGroup}>
        <label>
          <input
            type="radio"
            value="male"
            checked={gender === 'male'}
            onChange={(e) => setGender(e.target.value)}
          />
          Male
        </label>
        <label>
          <input
            type="radio"
            value="female"
            checked={gender === 'female'}
            onChange={(e) => setGender(e.target.value)}
          />
          Female
        </label>
        <label>
          <input
            type="radio"
            value="other"
            checked={gender === 'other'}
            onChange={(e) => setGender(e.target.value)}
          />
          Other
        </label>
      </div>
      <h2 className={styles.tagline}>
        The best friendships start with <span className={styles.highlight}>'hi'</span>
      </h2>
      <div className={styles.buttons}>
        <button className={styles.button} onClick={handleStartVideo}>
          Start Video
        </button>

        <button className={styles.button} onClick={handleStartChat}>
          Start Chat
        </button>
      </div>
    </div>
  );
}

