'use client';

import { useEffect, useState, useRef } from 'react';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import styles from '@/styles/chat.module.scss';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(true); // show "Finding..." initially
  const [showReconnectButton, setShowReconnectButton] = useState(false);
  const chatRef = useRef(null);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    setMessages((prev) => [...prev, { from: 'me', text: input }]);
    connectSocket().emit('message', input);
    setInput('');
  };

  const handleNext = () => {
    setMessages([]);
    connectSocket().emit('next');
    setConnected(false);
    setIsSearching(true);
    setShowReconnectButton(false);
  };

  const handleStop = () => {
    if (!connected) {
      setMessages(() => [{ from: 'system', text: 'Disconnected.' }]);
    } else {
      setMessages((prev) => [...prev, { from: 'system', text: 'You left the chat.' }]);
    }
    disconnectSocket();
    setConnected(false);
    setShowReconnectButton(true);
  };

  const handleFindNew = () => {
    const socket = connectSocket();
    if (socket.disconnected) socket.connect();
    socket.connect();
    socket.emit('join');
    setMessages([]);
    setIsSearching(true);
    setShowReconnectButton(false);
  };

  useEffect(() => {
    const socket = connectSocket();

    socket.emit('join');

    socket.on('matched', () => {
      setConnected(true);
      setIsSearching(false);
      setShowReconnectButton(false);
      setMessages((prev) => [...prev, { from: 'system', text: 'Stranger connected.' }]);
    });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, { from: 'stranger', text: msg }]);
    });

    socket.on('partner-left', () => {
      setConnected(false);
      setIsSearching(false);
      setShowReconnectButton(true);
      setMessages((prev) => [...prev, { from: 'system', text: 'Stranger disconnected.' }]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    // Auto scroll to latest message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <main className={styles.main}>
      <div className={styles.chatContainer}>
        <div className={styles.chatBox} ref={chatRef}>
          {isSearching && <p className={styles.system}>Finding a stranger...</p>}

          {showReconnectButton && (
            <div style={{ textAlign: 'center', margin: '1rem 0' }}>
              <button onClick={handleFindNew} className={styles.findNewBtn}>
                Find New Stranger
              </button>
            </div>
          )}
          {messages.map((msg, index) => (
            <div
              key={index}
              className={
                msg.from === 'me'
                  ? styles.myMsg
                  : msg.from === 'stranger'
                    ? styles.theirMsg
                    : styles.system
              }
            >
              {msg.text}
            </div>
          ))}
        </div>

        <div className={styles.inputArea}>
          <input
            type="text"
            placeholder={connected ? 'Type a message...' : 'Waiting for a stranger...'}
            value={input}
            disabled={!connected}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <div className={styles.actions}>
          <button onClick={handleStop}>Stop Chat</button>
          <button onClick={handleNext}>Next Chat</button>
        </div>
      </div>
    </main>
  );
}
