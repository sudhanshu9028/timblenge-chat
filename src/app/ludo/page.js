'use client';

import { useRouter } from 'next/navigation';
import styles from '@/styles/home.module.scss';

export default function LudoHome() {
  const router = useRouter();

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h1 className={styles.heading}>Play Ludo</h1>
        <div className={styles.buttons}>
          <button className={styles.button} onClick={() => router.push('/ludo/create')}>
            Create Room
          </button>
          <button className={styles.button} onClick={() => router.push('/ludo/join')}>
            Join Room
          </button>
        </div>
      </div>
    </main>
  );
}
