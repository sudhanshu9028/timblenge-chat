'use client';

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import styles from '@/styles/home.module.scss';

export default function LudoLobby() {
  const { roomCode } = useParams();
  const router = useRouter();
  const [players, setPlayers] = useState([
    // Example: You should fetch/update this from server/socket
    { name: 'You', isAdmin: true },
    // { name: 'Player2', isAdmin: false },
  ]);

  const handleStartGame = () => {
    // Only admin can start, add your logic here
    router.push(`/ludo/game/${roomCode}`);
  };

  return (
    <main className={styles.main}>
      <div className={styles.card}>
        <h2 className={styles.heading}>Ludo Lobby</h2>
        <div>
          <strong>Room Code:</strong> <span style={{ fontSize: '1.5rem' }}>{roomCode}</span>
        </div>
        <div style={{ margin: '1rem 0' }}>
          <strong>Players:</strong>
          <ul>
            {players.map((player, idx) => (
              <li key={idx}>
                {player.name} {player.isAdmin && <span>(Admin)</span>}
              </li>
            ))}
          </ul>
        </div>
        <button
          className={styles.button}
          onClick={handleStartGame}
          disabled={!players[0]?.isAdmin || players.length < 2}
        >
          Start Game
        </button>
        <p style={{ marginTop: '1rem', color: '#888' }}>Waiting for more players to join...</p>
      </div>
    </main>
  );
}
