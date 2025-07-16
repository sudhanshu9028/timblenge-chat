'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/styles/home.module.scss';

export default function LudoJoinRoom() {
  const router = useRouter();
  const [roomCode, setRoomCode] = useState('');

  const handleJoin = () => {
    if (!roomCode) return;
    router.push(`/ludo/lobby/${roomCode.toUpperCase()}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Join Room</h2>
        <input
          className={styles.input}
          type="text"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
          maxLength={6}
        />
        <button className={styles.button} onClick={handleJoin} disabled={!roomCode}>
          Join Lobby
        </button>
      </div>
    </main>
  );
}
