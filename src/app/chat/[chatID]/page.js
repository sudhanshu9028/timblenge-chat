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
import { track, EVENTS } from '@/lib/analytics';
import { bump, recordChatDuration } from '@/lib/profile';
import WouldYouRather from '@/app/components/WouldYouRather';
import gameStyles from '@/styles/game.module.scss';
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
  // Gate for the notification prompt — we only ask after a conversation
  // that actually went somewhere.
  const [pushEligible, setPushEligible] = useState(false);

  // Would You Rather. Phases: idle | offered | invited | question | answered
  // | revealed. The server owns the truth; this only mirrors it.
  const [game, setGame] = useState({ phase: 'idle' });
  // Raised when the conversation has gone quiet, which is where the game is
  // actually useful — stranger chats tend to die around message four.
  const [stalled, setStalled] = useState(false);

  const chatRef = useRef(null);
  const exitPanelRef = useRef(null);
  // Per-conversation counters, feeding chat_ended and the local profile.
  const sentCountRef = useRef(0);
  const matchedAtRef = useRef(null);
  const partnerTypeRef = useRef('none');
  const lastActivityRef = useRef(Date.now());
  const inputRef = useRef(null);
  const router = useRouter();
  const params = useParams();
  const { chatID } = params;
  const fileInputRef = useRef(null);

  // Emits chat_ended once per conversation and folds the result into the
  // local profile. Guarded by matchedAtRef so repeated end paths (partner
  // left, then unmount) can't double-count.
  const finishConversation = (reason) => {
    if (!matchedAtRef.current) return;
    const durationSec = Math.round((Date.now() - matchedAtRef.current) / 1000);
    if (partnerTypeRef.current === 'human' && (sentCountRef.current >= 3 || durationSec >= 60)) {
      setPushEligible(true);
    }
    track(EVENTS.CHAT_ENDED, {
      partner_type: partnerTypeRef.current,
      duration_sec: durationSec,
      message_count: sentCountRef.current,
      reason,
    });
    recordChatDuration(durationSec);
    matchedAtRef.current = null;
    sentCountRef.current = 0;
  };

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

    sentCountRef.current += 1;
    lastActivityRef.current = Date.now();
    setStalled(false);
    bump({ messagesSent: 1 });
    if (sentCountRef.current === 1) {
      track(EVENTS.FIRST_MESSAGE_SENT, { partner_type: partnerTypeRef.current });
    } else if (sentCountRef.current === 5) {
      track(EVENTS.MESSAGES_5, { partner_type: partnerTypeRef.current });
    }

    if (isBotChat) {
      // Send to AI bot instead of socket
      sendBotMessage(input);
    } else {
      connectSocket().emit('message', input);
    }

    setInput('');
  };

  const handleNext = () => {
    track(EVENTS.NEXT_CLICKED, { partner_type: partnerTypeRef.current });
    finishConversation('next');
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
    finishConversation('stopped');
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

  const emitGame = (event, payload) => {
    const socket = connectSocket();
    if (socket && socket.connected) socket.emit(event, payload);
  };

  const handleGameOffer = () => {
    emitGame('game:offer');
    setGame({ phase: 'offered' });
    setStalled(false);
    track(EVENTS.GAME_STARTED, { game: 'would_you_rather', role: 'offered' });
  };

  const handleGameAccept = () => {
    emitGame('game:accept');
    track(EVENTS.GAME_STARTED, { game: 'would_you_rather', role: 'accepted' });
  };

  const handleGameDecline = () => {
    emitGame('game:decline');
    setGame({ phase: 'idle' });
  };

  const handleGameChoice = (choice) => {
    emitGame('game:choice', { choice });
    setGame((g) => ({ ...g, phase: 'answered', yours: choice }));
  };

  const handleGameNext = () => emitGame('game:next');

  const handleGameQuit = () => emitGame('game:quit');

  // Ask to be put back with the stranger we were just talking to. The server
  // only reconnects when both sides ask, so this may sit in 'pending'.
  const handleReconnect = () => {
    const socket = connectSocket();
    if (socket && socket.connected) {
      socket.emit('reconnect-request');
      track(EVENTS.RECONNECT_REQUESTED);
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
    track(EVENTS.QUEUE_JOINED, { mode: 'text', has_interests: interests.length ? 'yes' : 'no' });

    socket.on('online-count', (count) => {
      setOnlineCount(typeof count === 'number' ? count : 0);
    });

    socket.on('matched', () => {
      // Real user matched — clear any bot state
      setIsBotChat(false);
      setGame({ phase: 'idle' });
      setStalled(false);
      setEndedWithAi(false);

      setConnected(true);
      setIsSearching(false);
      setShowReconnectButton(false);
      setReconnectState('unavailable');
      matchedAtRef.current = Date.now();
      partnerTypeRef.current = 'human';
      sentCountRef.current = 0;
      track(EVENTS.MATCH_HUMAN);
      bump({ strangersMet: 1 });
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
      // The AI leg is over; count it, then start the human one.
      finishConversation('bot_replaced');
      matchedAtRef.current = Date.now();
      partnerTypeRef.current = 'human';
      sentCountRef.current = 0;
      track(EVENTS.BOT_REPLACED);
      bump({ strangersMet: 1 });
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
      track(EVENTS.RECONNECT_SUCCESS);
      matchedAtRef.current = Date.now();
      partnerTypeRef.current = 'human';
      sentCountRef.current = 0;
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
      matchedAtRef.current = Date.now();
      partnerTypeRef.current = 'ai';
      sentCountRef.current = 0;
      track(EVENTS.MATCH_BOT);
      bump({ aiChats: 1 });

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
      finishConversation('ai_left');
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
      lastActivityRef.current = Date.now();
      setStalled(false);
      setMessages((prev) => [...prev, { from: 'stranger', text: msg }]);
    });

    // --- Would You Rather ---------------------------------------------
    socket.on('game:offer', () => setGame({ phase: 'invited' }));

    socket.on('game:declined', () => {
      setGame({ phase: 'idle' });
      setMessages((prev) => [
        ...prev,
        { from: 'system', text: 'They passed on the game for now.' },
      ]);
    });

    socket.on('game:started', () => {
      bump({ gamesPlayed: 1 });
      setMessages((prev) => [...prev, { from: 'system', text: 'Would You Rather started.' }]);
    });

    socket.on('game:question', ({ round, options }) => {
      // Carry the running score forward; everything else is per-question.
      setGame((g) => ({ phase: 'question', round, options, agreements: g.agreements || 0 }));
    });

    socket.on('game:partner-answered', () => setGame((g) => ({ ...g, partnerAnswered: true })));

    socket.on('game:reveal', ({ round, options, yours, theirs, agreed, agreements }) => {
      setGame({ phase: 'revealed', round, options, yours, theirs, agreed, agreements });
      bump({ wyrRounds: 1, ...(agreed ? { wyrAgreements: 1 } : {}) });
    });

    socket.on('game:end', ({ reason, agreements, rounds } = {}) => {
      setGame({ phase: 'idle' });
      if (rounds) {
        track(EVENTS.GAME_COMPLETED, { game: 'would_you_rather', rounds, agreements });
      }
      const text =
        reason === 'partner_left'
          ? 'Game ended — they left.'
          : reason === 'exhausted'
            ? "That's every question we have. Nicely done."
            : 'Game ended.';
      setMessages((prev) => [...prev, { from: 'system', text }]);
    });

    socket.on('partner-left', (data) => {
      finishConversation('partner_left');
      setGame({ phase: 'idle' });
      setStalled(false);
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

  // Stranger conversations tend to die around message four. Watch for the
  // silence and surface the game there — a chip nobody notices does nothing.
  useEffect(() => {
    if (!connected || isBotChat || game.phase !== 'idle') {
      setStalled(false);
      return undefined;
    }
    const id = setInterval(() => {
      setStalled(Date.now() - lastActivityRef.current > 25_000);
    }, 5_000);
    return () => clearInterval(id);
  }, [connected, isBotChat, game.phase]);

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

  const showGameChip = connected && !isBotChat && game.phase === 'idle';

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

        <div
          className={`${styles.chatBox} ${showGameChip ? styles.chatBoxWithChip : ''}`}
          ref={chatRef}
        >
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
          {/* Human pairs only — hidden entirely during AI chats. */}
          {connected && !isBotChat && (
            <WouldYouRather
              game={game}
              onChoose={handleGameChoice}
              onNext={handleGameNext}
              onQuit={handleGameQuit}
              onAccept={handleGameAccept}
              onDecline={handleGameDecline}
            />
          )}

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
                pushEligible={pushEligible}
                onReconnect={handleReconnect}
                onlineCount={onlineCount}
              />
            </div>
          )}
        </div>

        {showGameChip && (
          <div className={gameStyles.gameChipRow}>
            <button
              type="button"
              onClick={handleGameOffer}
              className={`${gameStyles.gameChip} ${stalled ? gameStyles.gameChipNudge : ''}`}
            >
              <span className={gameStyles.gameChipIcon} aria-hidden="true">
                🎲
              </span>
              {stalled ? 'Gone quiet? Play a game' : 'Would You Rather'}
            </button>
          </div>
        )}

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
