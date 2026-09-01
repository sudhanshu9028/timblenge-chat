'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import SearchingState from '@/app/components/SearchingState';
import DisconnectedPanel from '@/app/components/DisconnectedPanel';
import WaitingOptions from '@/app/components/WaitingOptions';
import styles from '@/styles/video.module.scss';

// How long we search before offering something else to do. The search itself
// keeps running — this is only when the options appear.
const WAITING_OPTIONS_DELAY_MS = 60_000;

export default function VideoPage() {
  const { videoID } = useParams();
  const router = useRouter();
  const localVideoRef = useRef();
  const remoteVideoRef = useRef();
  const pcRef = useRef();
  const localStreamRef = useRef();
  const socketRef = useRef();
  const [isSearching, setIsSearching] = useState(true);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState('');
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [localStreamReady, setLocalStreamReady] = useState(false);
  const [videoReady, setVideoReady] = useState(false);
  const [showReconnectButton, setShowReconnectButton] = useState(false);
  const [onlineCount, setOnlineCount] = useState(0);
  const [showWaitingOptions, setShowWaitingOptions] = useState(false);
  const [notifyState, setNotifyState] = useState('idle');
  // Why the call ended — 'Stranger disconnected' is wrong when the user
  // pressed Stop, or when they were still searching.
  const [exitTitle, setExitTitle] = useState('Call ended');
  const stoppedRef = useRef(false);
  const notifyArmedRef = useRef(false);
  const titleFlashRef = useRef(null);

  // Ask once, on an explicit click — browsers ignore (and users resent)
  // permission prompts that fire on page load.
  const handleEnableNotify = async () => {
    if (typeof Notification === 'undefined') {
      setNotifyState('denied');
      return;
    }
    try {
      const permission =
        Notification.permission === 'default'
          ? await Notification.requestPermission()
          : Notification.permission;

      if (permission === 'granted') {
        notifyArmedRef.current = true;
        setNotifyState('granted');
      } else {
        setNotifyState('denied');
      }
    } catch {
      setNotifyState('denied');
    }
  };

  // Short beep via Web Audio, so this needs no audio file shipped.
  const playChime = useCallback(() => {
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return;
      const ctx = new Ctx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = 880;
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.25, ctx.currentTime + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.45);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
      setTimeout(() => ctx.close(), 800);
    } catch {
      // Audio is a nicety — never let it break the match.
    }
  }, []);

  // Called when a match lands while the user is looking at another tab.
  // Kept identity-stable so it can be a dependency of the signaling effect
  // without tearing down the peer connection on every render.
  const pingUser = useCallback(() => {
    if (!notifyArmedRef.current) return;
    try {
      new Notification('Someone joined on Anoniz', {
        body: 'Your video chat is ready — come back to the tab.',
        icon: '/logo.png',
        tag: 'anoniz-video-match',
      });
    } catch {
      // Notification can throw on some mobile browsers; the chime still fires.
    }
    playChime();

    if (!titleFlashRef.current) {
      let on = false;
      titleFlashRef.current = setInterval(() => {
        document.title = on ? 'Anoniz' : '👋 Stranger connected!';
        on = !on;
      }, 900);
    }
  }, [playChime]);

  const handleSwitchToText = () => {
    stoppedRef.current = true;
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leave-video');
    }
    // Interests are already in sessionStorage, so text chat picks them up.
    const newChatId = uuidv4();
    sessionStorage.setItem('chatInitiated', 'true');
    sessionStorage.setItem('uniqueChatId', newChatId);
    router.push(`/chat/${newChatId}`);
  };

  useEffect(() => {
    // guard direct access
    const storedID = sessionStorage.getItem('uniqueVideoId');
    if (!storedID || storedID !== videoID) {
      router.replace('/');
      return;
    }
    sessionStorage.removeItem('videoInitiated');
  }, [videoID, router]);

  // Connect socket only when needed (on video page)
  useEffect(() => {
    const s = connectSocket();
    setSocket(s);
    socketRef.current = s;

    return () => {
      // Emit leave-video before disconnecting
      if (s && s.connected) {
        s.emit('leave-video');
      }
      disconnectSocket();
    };
  }, []);

  // Initialize video stream immediately
  useEffect(() => {
    async function initializeVideo() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        localStreamRef.current = stream;
        if (localVideoRef.current) {
          localVideoRef.current.srcObject = stream;
        }
        setLocalStreamReady(true);
        // Don't emit video-ready here if stopped - let the useEffect handle it
      } catch {
        setError('Could not access camera/microphone.');
      }
    }
    initializeVideo();

    return () => {
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, []);

  useEffect(() => {
    // Don't do anything if stopped
    if (stoppedRef.current) {
      return;
    }
    // Only emit video-ready if not stopped
    if (localStreamReady && socket && !videoReady) {
      // Read interests from sessionStorage
      const interestsStr = sessionStorage.getItem('interests') || '';
      const interests = interestsStr
        ? interestsStr
            .split(',')
            .map((i) => i.trim())
            .filter(Boolean)
        : [];
      socket.emit('video-ready', { interests });
      setVideoReady(true);
    }
    // Only auto-join if not stopped and conditions are met
    if (socket && videoReady && !connected && isConnected) {
      socket.emit('join-video');
    }
  }, [connected, isConnected, localStreamReady, socket, videoReady]);

  useEffect(() => {
    if (!socket || !localStreamReady) return;
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      // Only auto-join if not stopped
      if (!stoppedRef.current) {
        socket.emit('join-video');
      }
    };

    const handleDisconnect = () => {
      setIsConnected(false);
    };

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) {
      handleConnect();
    }

    socket.on('online-count', (count) => {
      setOnlineCount(typeof count === 'number' ? count : 0);
    });

    socket.on('video-matched', async ({ peerId, initiator }) => {
      // Ignore matches if we've stopped
      if (stoppedRef.current) {
        return;
      }
      // They asked to be pinged and they're looking elsewhere — tell them.
      if (typeof document !== 'undefined' && document.hidden) {
        pingUser();
      }
      setIsSearching(false);
      setConnected(true);
      setShowReconnectButton(false);
      setShowWaitingOptions(false);
      stoppedRef.current = false; // Reset stopped flag when matched

      try {
        // when matched, start WebRTC handshake
        pcRef.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            // Add your TURN server if available
            // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
          ],
        });

        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            socket.emit('new-ice-candidate', { to: peerId, candidate: e.candidate });
          }
        };

        if (localStreamRef.current) {
          localStreamRef.current
            .getTracks()
            .forEach((t) => pcRef.current.addTrack(t, localStreamRef.current));
        }
        // display remote stream
        pcRef.current.ontrack = (e) => {
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        };

        if (initiator) {
          try {
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            socket.emit('video-offer', { to: peerId, sdp: offer });
          } catch {}
        }

        // add local tracks to peer connection
      } catch {
        setError('Failed to establish video connection');
      }
    });

    // receive offer
    socket.on('video-offer', async ({ from, sdp }) => {
      try {
        if (!pcRef.current) {
          pcRef.current = new RTCPeerConnection({
            iceServers: [
              { urls: 'stun:stun.l.google.com:19302' },
              { urls: 'stun:stun1.l.google.com:19302' },
              { urls: 'stun:stun2.l.google.com:19302' },
              // Add your TURN server if available
              // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
            ],
          });

          pcRef.current.addTransceiver('video', { direction: 'sendrecv' });
          pcRef.current.addTransceiver('audio', { direction: 'sendrecv' });
          // send ICE candidates
          pcRef.current.onicecandidate = (e) => {
            if (e.candidate) {
              socket.emit('new-ice-candidate', { to: from, candidate: e.candidate });
            }
          };

          // display remote stream
          pcRef.current.ontrack = (e) => {
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = e.streams[0];
            }
          };

          if (localStreamRef.current) {
            localStreamRef.current
              .getTracks()
              .forEach((t) => pcRef.current.addTrack(t, localStreamRef.current));
          }
        }
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit('video-answer', { to: from, sdp: answer });
      } catch {}
    });

    // receive answer
    socket.on('video-answer', async ({ sdp }) => {
      try {
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        }
      } catch {}
    });

    // receive ICE candidate
    socket.on('new-ice-candidate', async ({ candidate }) => {
      try {
        if (pcRef.current && candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch {}
    });

    // partner left or stopped
    socket.on('video-partner-left', () => {
      // Set stopped flag FIRST to prevent any race conditions
      stoppedRef.current = true;
      setExitTitle('Stranger disconnected');
      // Reset videoReady to prevent auto-emission
      setVideoReady(false);
      // Set connected to false immediately
      setConnected(false);
      // Emit leave-video to ensure we're removed from server queues
      if (socket && socket.connected) {
        socket.emit('leave-video');
      }
      // End the call and show reconnect button
      endCall();
    });

    return () => {
      // Emit leave-video before cleaning up
      if (socket && socket.connected) {
        socket.emit('leave-video');
      }
      socket.off('connect', handleConnect);
      socket.off('disconnect', handleDisconnect);
      socket.off('video-matched');
      socket.off('video-offer');
      socket.off('video-answer');
      socket.off('new-ice-candidate');
      socket.off('video-partner-left');
      endCall();
    };
  }, [localStreamReady, socket, videoID, pingUser]);

  // After a minute of searching, offer something else to do — but keep the
  // search running. This used to eject the user from the queue entirely, which
  // made video a guaranteed dead end whenever the site was quiet.
  useEffect(() => {
    if (!isSearching || connected) {
      setShowWaitingOptions(false);
      return undefined;
    }
    const timeoutId = setTimeout(() => setShowWaitingOptions(true), WAITING_OPTIONS_DELAY_MS);
    return () => clearTimeout(timeoutId);
  }, [isSearching, connected]);

  // Stop flashing the tab title as soon as the user comes back to it.
  useEffect(() => {
    const stopFlashing = () => {
      if (titleFlashRef.current) {
        clearInterval(titleFlashRef.current);
        titleFlashRef.current = null;
        document.title = 'Anoniz';
      }
    };
    document.addEventListener('visibilitychange', stopFlashing);
    window.addEventListener('focus', stopFlashing);
    return () => {
      document.removeEventListener('visibilitychange', stopFlashing);
      window.removeEventListener('focus', stopFlashing);
      stopFlashing();
    };
  }, []);

  const endCall = () => {
    setConnected(false);
    setIsSearching(false);
    setShowReconnectButton(true);
    // Set stopped flag to prevent auto-rejoining
    stoppedRef.current = true;
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleNext = () => {
    // Set stopped flag to prevent auto-rejoining
    stoppedRef.current = true;
    // Emit video-stop to notify partner
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('video-stop');
      socketRef.current.emit('leave-video');
    }
    endCall();
    const newId = uuidv4();
    sessionStorage.setItem('videoInitiated', 'true');
    sessionStorage.setItem('uniqueVideoId', newId);
    router.push(`/video/${newId}`);
  };

  const handleStop = () => {
    // Set stopped flag FIRST to prevent any race conditions
    stoppedRef.current = true;
    setExitTitle(connected ? 'You ended the call' : 'Stopped searching');
    // Reset videoReady so it doesn't auto-emit video-ready again
    setVideoReady(false);
    // Set connected to false immediately to prevent any matching logic
    setConnected(false);
    // Set isSearching to false to stop showing "Finding stranger..."
    setIsSearching(false);
    // Emit video-stop to notify partner and remove from server queues
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('video-stop');
    }
    // Also emit leave-video to ensure complete cleanup
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leave-video');
    }
    // Then call endCall to show button
    endCall();
  };

  const handleFindNew = () => {
    // Reset stopped flag to allow matching again
    stoppedRef.current = false;
    // Properly clean up existing socket connection
    if (socketRef.current && socketRef.current.connected) {
      socketRef.current.emit('leave-video');
    }

    // Create new video ID and navigate
    const newId = uuidv4();
    sessionStorage.setItem('videoInitiated', 'true');
    sessionStorage.setItem('uniqueVideoId', newId);

    // Reset state
    setShowReconnectButton(false);
    setIsSearching(true);
    setConnected(false);
    setVideoReady(false);

    // Navigate to new video - the useEffect will handle socket connection
    router.push(`/video/${newId}`);
  };

  return (
    <div className={styles.main}>
      <div className={styles.videoContainer}>
        <video ref={localVideoRef} className={styles.local} autoPlay muted playsInline />
        <video
          ref={remoteVideoRef}
          className={`${styles.remote} ${showReconnectButton ? styles.remoteBlurred : ''}`}
          autoPlay
          playsInline
        />

        {isSearching && (
          <div className={styles.searchOverlay}>
            <SearchingState mode="video" onlineCount={onlineCount} />
          </div>
        )}

        {error && <p className={styles.error}>{error}</p>}
      </div>

      {/* The search keeps running behind this card. */}
      {isSearching && showWaitingOptions && !connected && (
        <WaitingOptions
          onSwitchToText={handleSwitchToText}
          onNotify={handleEnableNotify}
          notifyState={notifyState}
          onDismiss={() => setShowWaitingOptions(false)}
          onlineCount={onlineCount}
        />
      )}

      {showReconnectButton && (
        <div className={styles.reconnectButtonContainer}>
          <DisconnectedPanel
            mode="video"
            title={exitTitle}
            onFindNew={handleFindNew}
            onlineCount={onlineCount}
          />
        </div>
      )}

      <div className={styles.actions}>
        <button onClick={handleStop} disabled={showReconnectButton}>
          Stop
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
