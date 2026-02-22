'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { connectSocket, disconnectSocket } from '@/lib/socket';
import styles from '@/styles/video.module.scss';

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
  const stoppedRef = useRef(false);

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
          console.log('Setting local stream');
          localVideoRef.current.srcObject = stream;
        }
        setLocalStreamReady(true);
        // Don't emit video-ready here if stopped - let the useEffect handle it
        console.log('Video stream initialized successfully');
      } catch (err) {
        setError('Could not access camera/microphone.');
        console.error('Video access error:', err);
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
      const interests = interestsStr ? interestsStr.split(',').map((i) => i.trim()).filter(Boolean) : [];
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

    socket.on('video-matched', async ({ peerId, initiator }) => {
      // Ignore matches if we've stopped
      if (stoppedRef.current) {
        return;
      }
      setIsSearching(false);
      setConnected(true);
      setShowReconnectButton(false);
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
          } catch (err) {
            console.error('Error creating/sending offer:', err);
          }
        }

        // add local tracks to peer connection
      } catch (err) {
        console.error('Error setting up WebRTC:', err);
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
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    // receive answer
    socket.on('video-answer', async ({ sdp }) => {
      try {
        if (pcRef.current) {
          await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        }
      } catch (err) {
        console.error('Error handling answer:', err);
      }
    });

    // receive ICE candidate
    socket.on('new-ice-candidate', async ({ from, candidate }) => {
      try {
        if (pcRef.current && candidate) {
          await pcRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }
      } catch (e) {
        console.error('Error adding ICE candidate', e);
      }
    });

    // partner left or stopped
    socket.on('video-partner-left', () => {
      // Set stopped flag FIRST to prevent any race conditions
      stoppedRef.current = true;
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
  }, [localStreamReady, socket, videoID]);

  // 60-second search timeout
  useEffect(() => {
    let timeoutId;
    if (isSearching && !connected) {
      timeoutId = setTimeout(() => {
        // Set stopped flag to prevent auto-rejoining
        stoppedRef.current = true;
        setIsSearching(false);
        setShowReconnectButton(true);
        setError('No stranger found. Please try again.');
        if (socketRef.current && socketRef.current.connected) {
          socketRef.current.emit('leave-video');
        }
      }, 60000);
    }
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [isSearching, connected]);

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
        {isSearching && <p className={styles.system}>Finding stranger…</p>}
        {error && <p className={styles.error}>{error}</p>}
        <video ref={localVideoRef} className={styles.local} autoPlay muted playsInline />
        <video
          ref={remoteVideoRef}
          className={`${styles.remote} ${showReconnectButton ? styles.remoteBlurred : ''}`}
          autoPlay
          playsInline
        />
        {showReconnectButton && (
          <div className={styles.reconnectButtonContainer}>
            <button onClick={handleFindNew} className={styles.findNewBtn}>
              Find New Stranger
            </button>
          </div>
        )}
      </div>

      <div className={styles.actions}>
        <button onClick={handleStop} disabled={showReconnectButton}>
          Stop
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
