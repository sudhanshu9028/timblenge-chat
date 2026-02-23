'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import styles from '@/styles/chat.module.scss';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(true); // show "Finding..." initially
  const [showReconnectButton, setShowReconnectButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  const chatRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const { chatID } = params;
  const fileInputRef = useRef(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tempId = Date.now();
    setMessages((prev) => [...prev, { from: 'me', loading: true, tempId }]);
    const formData = new FormData();
    formData.append('file', file); // 👈 This must match the backend .get('file')

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData, // ✅ Do NOT set Content-Type manually!
      });

      const data = await res.json();
      //   console.log('Uploaded image URL:', data.url);

      if (res.ok && data.url) {
        setMessages((prev) =>
          prev.map((msg) => (msg.tempId === tempId ? { from: 'me', image: data.url } : msg))
        );
        connectSocket().emit('image', data.url);
      } else {
        throw new Error('Upload failed');
      }
    } catch (err) {
      console.error('Upload error:', err);
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { from: 'system', text: 'Image upload failed 😓' } : msg
        )
      );
    }
  };

  useEffect(() => {
    // const isValidEntry = sessionStorage.getItem('chatInitiated');
    const uniqueChatId = sessionStorage.getItem('uniqueChatId');
    if (uniqueChatId && uniqueChatId !== chatID) {
      router.replace('/');
    } else {
      sessionStorage.removeItem('chatInitiated'); // prevent reuse
    }
  }, [chatID, router]);

  useEffect(() => {
    const input = inputRef.current;

    const handleFocus = () => {
      setTimeout(() => {
        input?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 200); // slight delay for keyboard animation
    };

    input?.addEventListener('focus', handleFocus);

    return () => {
      input?.removeEventListener('focus', handleFocus);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    setMessages((prev) => [...prev, { from: 'me', text: input }]);
    connectSocket().emit('message', input);
    setInput('');
  };

  const handleNext = () => {
    setMessages([]);
    const socket = connectSocket();
    // Read interests for re-matching
    const interestsStr = sessionStorage.getItem('interests') || '';
    const interests = interestsStr
      ? interestsStr
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      : [];
    if (socket && socket.connected) {
      socket.emit('next', { interests });
    }
    setConnected(false);
    setIsSearching(true);
    setShowReconnectButton(false);
    // Emit leave-chat before disconnecting
    if (socket && socket.connected) {
      socket.emit('leave-chat');
    }
    disconnectSocket();
    const newChatId = uuidv4();
    sessionStorage.setItem('chatInitiated', 'true');
    sessionStorage.setItem('uniqueChatId', newChatId);
    router.push(`/chat/${newChatId}`);
  };

  const handleStop = () => {
    if (!connected) {
      setMessages(() => [{ from: 'system', text: 'Disconnected.' }]);
    } else {
      setMessages((prev) => [...prev, { from: 'system', text: 'You left the chat.' }]);
    }
    // Emit leave-chat before disconnecting
    const socket = connectSocket();
    if (socket && socket.connected) {
      socket.emit('leave-chat');
    }
    disconnectSocket();
    setConnected(false);
    setShowReconnectButton(true);
  };

  const handleFindNew = () => {
    // Properly clean up existing socket connection
    const socket = connectSocket();
    if (socket && socket.connected) {
      socket.emit('leave-chat');
    }
    disconnectSocket();

    // Create new chat ID and navigate
    const newChatId = uuidv4();
    sessionStorage.setItem('chatInitiated', 'true');
    sessionStorage.setItem('uniqueChatId', newChatId);

    // Reset state
    setMessages([]);
    setIsSearching(true);
    setShowReconnectButton(false);
    setConnected(false);

    // Navigate to new chat - the useEffect will handle socket connection
    router.push(`/chat/${newChatId}`);
  };

  useEffect(() => {
    const socket = connectSocket();

    // Read interests from sessionStorage
    const interestsStr = sessionStorage.getItem('interests') || '';
    const interests = interestsStr
      ? interestsStr
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    socket.emit('join', { interests });

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
    socket.on('image', (base64) => {
      setMessages((prev) => [...prev, { from: 'stranger', image: base64 }]);
    });

    socket.on('stranger-typing', () => {
      setIsTyping(true);
      // Auto-clear after short time
      clearTimeout(socket.typingTimeout);
      socket.typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1500); // Adjust time
    });

    return () => {
      // Emit leave-chat before disconnecting
      if (socket && socket.connected) {
        socket.emit('leave-chat');
      }
      socket.disconnect();
    };
  }, []);

  // 60-second search timeout
  useEffect(() => {
    let timeoutId;
    if (isSearching && !connected) {
      timeoutId = setTimeout(() => {
        setIsSearching(false);
        setShowReconnectButton(true);
        setMessages((prev) => [
          ...prev,
          { from: 'system', text: 'No stranger found. Please try again.' },
        ]);
        const socket = connectSocket();
        if (socket && socket.connected) {
          socket.emit('leave-chat');
        }
        disconnectSocket();
      }, 60000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSearching, connected]);

  function handleTyping() {
    if (connected) {
      const socket = connectSocket();
      if (socket && socket.connected) {
        socket.emit('typing');
      } else {
        console.warn('⚠️ Socket not connected');
      }
    }
  }

  useEffect(() => {
    // Auto scroll to latest message
    if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className={styles.main}>
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
              {msg.text && <span>{msg.text}</span>}
              {msg.loading && <div className={styles.imageUploading}>Uploading image...</div>}
              {msg.image && (
                <div className={styles.imageWrapper}>
                  <Image
                    src={msg.image}
                    alt="shared"
                    width={200}
                    height={0} // allow auto height
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '10px',
                      objectFit: 'contain',
                    }}
                    unoptimized // required for base64 data URLs
                  />
                </div>
              )}
            </div>
          ))}
          {isTyping && <div className={styles.typingIndicator}>Stranger is typing...</div>}
        </div>

        <div className={styles.inputArea}>
          <div className={styles.inputWrapper}>
            <input
              type="text"
              ref={inputRef}
              placeholder={connected ? 'Type a message...' : 'Waiting for a stranger...'}
              value={input}
              disabled={!connected}
              onChange={(e) => {
                setInput(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              className={styles.textInput}
            />
            <input
              type="file"
              accept="image/*"
              //   capture="environment"
              style={{ display: 'none' }}
              ref={fileInputRef}
              onChange={handleImageUpload}
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className={`${styles.iconBtn} ${styles.cameraBtn}`}
              disabled={!connected}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="#ffffff"
                strokeWidth={1.5}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.827 6.175A2.31 2.31 0 0 1 5.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 0 0-1.134-.175 2.31 2.31 0 0 1-1.64-1.055l-.822-1.316a2.192 2.192 0 0 0-1.736-1.039 48.774 48.774 0 0 0-5.232 0 2.192 2.192 0 0 0-1.736 1.039l-.821 1.316Z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.5 12.75a4.5 4.5 0 1 1-9 0 4.5 4.5 0 0 1 9 0ZM18.75 10.5h.008v.008h-.008V10.5Z"
                />
              </svg>
            </button>
          </div>
          <div onClick={sendMessage} className={styles.sendBtn}>
            Send
          </div>
        </div>

        <div className={styles.actions}>
          <div onClick={handleStop} className={styles.stopBtn}>
            Stop Chat
          </div>
          <div onClick={handleNext} className={styles.nextBtn}>
            Next Chat
          </div>
        </div>
      </div>
    </div>
  );
}
