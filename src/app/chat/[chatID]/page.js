'use client';

import { useEffect, useState, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Image from 'next/image';
import { v4 as uuidv4 } from 'uuid';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import SearchingState from '@/app/components/SearchingState';
import DisconnectedPanel from '@/app/components/DisconnectedPanel';
import AiBadge from '@/app/components/AiBadge';
import { AI_DISPLAY_NAME } from '@/lib/aiIdentity';
import styles from '@/styles/chat.module.scss';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [connected, setConnected] = useState(false);
  const [isSearching, setIsSearching] = useState(true);
  // NOTE: this flag means "the conversation ended, show the exit panel". It is
  // unrelated to the reconnect-with-last-stranger feature below.
  const [showReconnectButton, setShowReconnectButton] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);

  // Reconnect-with-last-stranger: 'unavailable' | 'available' | 'pending'
  const [reconnectState, setReconnectState] = useState('unavailable');

  // Bot state
  const [isBotChat, setIsBotChat] = useState(false);
  // Who the conversation that just ended was with — the exit panel shouldn't
  // call the AI a stranger.
  const [endedWithAi, setEndedWithAi] = useState(false);

  const chatRef = useRef(null);
  const exitPanelRef = useRef(null);
  const inputRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const { chatID } = params;
  const fileInputRef = useRef(null);

  // Disconnect the bot chat cleanly
  const disconnectBotChat = () => {
    setIsBotChat(false);
    setEndedWithAi(true);
    setConnected(false);
    setIsSearching(false);
    setShowReconnectButton(true);
    setIsTyping(false);
    setMessages((prev) => [...prev, { from: 'system', text: `${AI_DISPLAY_NAME} left the chat.` }]);
  };

  // Send message to AI bot via socket (server handles Gemini API)
  const sendBotMessage = (userText) => {
    const socket = connectSocket();
    if (socket && socket.connected) {
      setIsTyping(true);
      socket.emit('bot-message', userText);
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const tempId = Date.now();
    setMessages((prev) => [...prev, { from: 'me', loading: true, tempId }]);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok && data.url) {
        setMessages((prev) =>
          prev.map((msg) => (msg.tempId === tempId ? { from: 'me', image: data.url } : msg))
        );

        if (isBotChat) {
          // Let bot react to the image
          sendBotMessage('[user sent an image]');
        } else {
          connectSocket().emit('image', data.url);
        }
      } else {
        throw new Error('Upload failed');
      }
    } catch {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.tempId === tempId ? { from: 'system', text: 'Image upload failed 😓' } : msg
        )
      );
    }
  };

  useEffect(() => {
    const uniqueChatId = sessionStorage.getItem('uniqueChatId');
    if (uniqueChatId && uniqueChatId !== chatID) {
      router.replace('/');
    } else {
      sessionStorage.removeItem('chatInitiated');
    }
  }, [chatID, router]);

  useEffect(() => {
    const inputEl = inputRef.current;

    const handleFocus = () => {
      setTimeout(() => {
        inputEl?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 200);
    };

    inputEl?.addEventListener('focus', handleFocus);

    return () => {
      inputEl?.removeEventListener('focus', handleFocus);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !connected) return;
    setMessages((prev) => [...prev, { from: 'me', text: input }]);

    if (isBotChat) {
      // Send to AI bot instead of socket
      sendBotMessage(input);
    } else {
      connectSocket().emit('message', input);
    }

    setInput('');
  };

  const handleNext = () => {
    setMessages([]);
    // Reset bot state
    setIsBotChat(false);
    setReconnectState('unavailable');

    const socket = connectSocket();
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
    // Reset bot state
    setIsBotChat(false);

    const wasWithRealPerson = connected && !isBotChat;
    setEndedWithAi(isBotChat);

    if (!connected) {
      setMessages(() => [{ from: 'system', text: 'Disconnected.' }]);
    } else {
      setMessages((prev) => [...prev, { from: 'system', text: 'You left the chat.' }]);
    }
    const socket = connectSocket();
    if (socket && socket.connected) {
      socket.emit('leave-chat');
    }
    // Deliberately staying connected: dropping the socket here would make this
    // user unreachable, and reconnecting with the stranger they just left needs
    // both sides online. The socket is cleaned up on unmount.
    setConnected(false);
    setIsSearching(false);
    setShowReconnectButton(true);
    setReconnectState(wasWithRealPerson ? 'available' : 'unavailable');
  };

  // Ask to be put back with the stranger we were just talking to. The server
  // only reconnects when both sides ask, so this may sit in 'pending'.
  const handleReconnect = () => {
    const socket = connectSocket();
    if (socket && socket.connected) {
      socket.emit('reconnect-request');
      setReconnectState('pending');
    }
  };

  const handleFindNew = () => {
    // Reset bot state
    setIsBotChat(false);
    setReconnectState('unavailable');

    const socket = connectSocket();
    if (socket && socket.connected) {
      socket.emit('leave-chat');
    }
    disconnectSocket();

    const newChatId = uuidv4();
    sessionStorage.setItem('chatInitiated', 'true');
    sessionStorage.setItem('uniqueChatId', newChatId);

    setMessages([]);
    setIsSearching(true);
    setShowReconnectButton(false);
    setConnected(false);

    router.push(`/chat/${newChatId}`);
  };

  useEffect(() => {
    const socket = connectSocket();

    const interestsStr = sessionStorage.getItem('interests') || '';
    const interests = interestsStr
      ? interestsStr
          .split(',')
          .map((i) => i.trim())
          .filter(Boolean)
      : [];

    socket.emit('join', { interests });

    socket.on('online-count', (count) => {
      setOnlineCount(typeof count === 'number' ? count : 0);
    });

    socket.on('matched', () => {
      // Real user matched — clear any bot state
      setIsBotChat(false);
      setEndedWithAi(false);

      setConnected(true);
      setIsSearching(false);
      setShowReconnectButton(false);
      setReconnectState('unavailable');
      setMessages((prev) => [...prev, { from: 'system', text: 'Stranger connected.' }]);
    });

    // A real person arrived while we were talking to the AI — hand over.
    socket.on('bot-replaced', () => {
      setIsBotChat(false);
      setEndedWithAi(false);
      setConnected(true);
      setIsSearching(false);
      setShowReconnectButton(false);
      setIsTyping(false);
      setReconnectState('unavailable');
      // Drop the AI transcript: it belongs to a different conversation, and
      // leaving it above a real stranger's messages is confusing.
      setMessages([
        {
          from: 'system',
          text: `Found you a real person — you're no longer with ${AI_DISPLAY_NAME}.`,
        },
        { from: 'system', text: 'Stranger connected.' },
      ]);
    });

    // Reconnect handshake
    socket.on('reconnect-offer', () => {
      setReconnectState('available');
      setMessages((prev) => [
        ...prev,
        { from: 'system', text: 'Your last stranger wants to reconnect.' },
      ]);
    });

    socket.on('reconnect-pending', () => setReconnectState('pending'));

    socket.on('reconnect-unavailable', () => setReconnectState('unavailable'));

    socket.on('reconnected', () => {
      setIsBotChat(false);
      setEndedWithAi(false);
      setConnected(true);
      setIsSearching(false);
      setShowReconnectButton(false);
      setReconnectState('unavailable');
      setMessages((prev) => [...prev, { from: 'system', text: 'Reconnected with your stranger.' }]);
    });

    // Bot matched — AI fallback when no real users available
    socket.on('bot-matched', () => {
      setIsBotChat(true);
      setConnected(true);
      setIsSearching(false);
      setShowReconnectButton(false);
      setReconnectState('unavailable');

      setMessages((prev) => [
        ...prev,
        {
          from: 'system',
          text: `No one's free right now — you're chatting with ${AI_DISPLAY_NAME}. We'll swap you to a real person as soon as one shows up.`,
        },
      ]);

      // Request greeting from server (server calls Gemini)
      const greetDelay = 800 + Math.random() * 1500;
      setTimeout(() => {
        setIsTyping(true);
        socket.emit('bot-request-greeting');
      }, greetDelay);
    });

    // Bot greeting received from server
    socket.on('bot-greeting', (greeting) => {
      setTimeout(
        () => {
          setIsTyping(false);
          setMessages((prev) => [...prev, { from: 'stranger', text: greeting }]);
        },
        600 + Math.random() * 800
      );
    });

    // Bot greeting failed — send fallback greeting and disconnect after 3s
    socket.on('bot-greeting-failed', () => {
      const fallbacks = ['Hi M', 'Hii', 'Heyy', 'yo', 'Helloo'];
      const fallback = fallbacks[Math.floor(Math.random() * fallbacks.length)];
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: 'stranger', text: fallback }]);
      setTimeout(() => {
        disconnectBotChat();
      }, 3000);
    });

    // Bot reply to user message (from server-side Gemini call)
    socket.on('bot-reply', (reply) => {
      setIsTyping(false);
      setMessages((prev) => [...prev, { from: 'stranger', text: reply }]);
    });

    // Bot auto-disconnected after 3-5 minutes
    socket.on('bot-disconnected', () => {
      setIsBotChat(false);
      setEndedWithAi(true);
      setConnected(false);
      setIsSearching(false);
      setShowReconnectButton(true);
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { from: 'system', text: `${AI_DISPLAY_NAME} left the chat.` },
      ]);
    });

    socket.on('message', (msg) => {
      setMessages((prev) => [...prev, { from: 'stranger', text: msg }]);
    });

    socket.on('partner-left', (data) => {
      setEndedWithAi(false);
      setConnected(false);
      setIsSearching(false);
      setShowReconnectButton(true);
      // The server tells us whether they're still around to reconnect with.
      setReconnectState(data && data.canReconnect ? 'available' : 'unavailable');
      setMessages((prev) => [...prev, { from: 'system', text: 'Stranger disconnected.' }]);
    });
    socket.on('image', (base64) => {
      setMessages((prev) => [...prev, { from: 'stranger', image: base64 }]);
    });

    socket.on('stranger-typing', () => {
      setIsTyping(true);
      clearTimeout(socket.typingTimeout);
      socket.typingTimeout = setTimeout(() => {
        setIsTyping(false);
      }, 1500);
    });

    return () => {
      if (socket && socket.connected) {
        socket.emit('leave-chat');
      }
      socket.disconnect();
    };
  }, []);

  // There is deliberately no search timeout here any more. The server now
  // waits a full minute for a real person and then hands the user to the AI,
  // so searching always resolves — a client-side timeout would only race it
  // and eject people out of a queue that was about to match them.

  function handleTyping() {
    if (connected && !isBotChat) {
      const socket = connectSocket();
      if (socket && socket.connected) {
        socket.emit('typing');
      }
    }
  }

  // The exit panel renders below the transcript, so it needs its own scroll
  // target — scrolling to the very bottom would put its buttons above the fold.
  useEffect(() => {
    if (showReconnectButton && exitPanelRef.current && chatRef.current) {
      // Relative scroll, so only the chat box moves. scrollIntoView would drag
      // the whole page and push the site header off-screen.
      const box = chatRef.current.getBoundingClientRect();
      const panel = exitPanelRef.current.getBoundingClientRect();
      chatRef.current.scrollTop += panel.top - box.top;
    } else if (chatRef.current) {
      chatRef.current.scrollTop = chatRef.current.scrollHeight;
    }
  }, [messages, showReconnectButton, isSearching]);

  return (
    <div className={styles.main}>
      <div className={styles.chatContainer}>
        <div className={styles.chatHeader}>
          {/* The badge names the AI, so don't also call it a stranger. */}
          <span className={styles.chatHeaderLabel}>
            {isBotChat
              ? 'Keeping you company'
              : connected
                ? 'Stranger'
                : isSearching
                  ? 'Searching…'
                  : 'Not connected'}
          </span>
          {isBotChat && <AiBadge />}
        </div>

        <div className={styles.chatBox} ref={chatRef}>
          {isSearching && <SearchingState mode="text" onlineCount={onlineCount} />}
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
                    height={0}
                    style={{
                      width: '100%',
                      height: 'auto',
                      borderRadius: '10px',
                      objectFit: 'contain',
                    }}
                    unoptimized
                  />
                </div>
              )}
            </div>
          ))}
          {isTyping && (
            <div className={styles.typingIndicator}>
              {isBotChat ? `${AI_DISPLAY_NAME} is typing...` : 'Stranger is typing...'}
            </div>
          )}
          {showReconnectButton && (
            <div ref={exitPanelRef}>
              <DisconnectedPanel
                mode="text"
                title={endedWithAi ? `${AI_DISPLAY_NAME} left the chat` : 'Stranger disconnected'}
                onFindNew={handleFindNew}
                reconnectState={reconnectState}
                onReconnect={handleReconnect}
                onlineCount={onlineCount}
              />
            </div>
          )}
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
