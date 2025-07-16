'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import styles from '@/styles/home.module.scss';

export default function LudoCreateRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  useEffect(() => {
    // Generate a random room code
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  }, []);

  const handleGoToLobby = () => {
    router.push(`/ludo/lobby/${roomCode}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Room Created!</h2>
        <p>Share this code with friends to join:</p>
        <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '1rem 0' }}>{roomCode}</div>
        <button className={styles.button} onClick={handleGoToLobby}>
          Go to Lobby
        </button>
      </div>
    </main>
  );
}
