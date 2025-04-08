'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/styles/home.module.scss';

export default function HomePage() {
  const [gender, setGender] = useState('');
  const router = useRouter();

  const handleStartChat = () => {
    if (!gender) {
      alert('Please select a gender before starting.');
      return;
    }
    sessionStorage.setItem('gender', gender);
    router.push('/chat');
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Timblenge Chat</h1>
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

        <button className={styles.button} onClick={handleStartChat}>
          Start Chat
        </button>
      </div>
    </main>
  );
}
