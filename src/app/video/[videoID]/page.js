'use client';

import { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { useSocket } from '@/context/SocketProvider';
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
  const socket = useSocket();
  const [isConnected, setIsConnected] = useState(false);
  const [localStreamReady, setLocalStreamReady] = useState(false);

  useEffect(() => {
    // guard direct access
    const storedID = sessionStorage.getItem('uniqueVideoId');
    if (!storedID || storedID !== videoID) {
      router.replace('/');
      return;
    }
    sessionStorage.removeItem('videoInitiated');
  }, [videoID, router]);

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
    if (!socket || !localStreamReady) return;
    socketRef.current = socket;

    const handleConnect = () => {
      setIsConnected(true);
      console.log('Socket connected, joining video queue with videoID:', videoID);
      socket.emit('join-video');
    };

    const handleDisconnect = () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    };

    console.log('Socket connection status:', socket.connected);
    console.log('Socket ID:', socket.id);

    socket.on('connect', handleConnect);
    socket.on('disconnect', handleDisconnect);

    if (socket.connected) {
      handleConnect();
    }

    console.log('Socket ID:', socket.id);

    // when matched, start WebRTC handshake
    socket.on('video-matched', async ({ peerId, initiator }) => {
      console.log('Video matched with peer:', peerId);
      setIsSearching(false);
      setConnected(true);

      try {
        console.log('Creating RTCPeerConnection...');
        pcRef.current = new RTCPeerConnection({
          iceServers: [
            { urls: 'stun:stun.l.google.com:19302' },
            { urls: 'stun:stun1.l.google.com:19302' },
            { urls: 'stun:stun2.l.google.com:19302' },
            // Add your TURN server if available
            // { urls: 'turn:your-turn-server.com', username: 'user', credential: 'pass' }
          ],
        });

        console.log('RTCPeerConnection created');

        // send ICE candidates
        pcRef.current.onicecandidate = (e) => {
          if (e.candidate) {
            console.log('Sending ICE candidate to:', peerId);
            socket.emit('new-ice-candidate', { to: peerId, candidate: e.candidate });
          }
        };

        // display remote stream
        pcRef.current.ontrack = (e) => {
          console.log('Received remote stream');
          if (remoteVideoRef.current) {
            remoteVideoRef.current.srcObject = e.streams[0];
          }
        };

        pcRef.current.addTransceiver('video', { direction: 'sendrecv' });
        pcRef.current.addTransceiver('audio', { direction: 'sendrecv' });

        if (localStreamRef.current) {
          localStreamRef.current
            .getTracks()
            .forEach((t) => pcRef.current.addTrack(t, localStreamRef.current));
        }

        if (initiator) {
          console.log('Creating offer manually as initiator');
          try {
            const offer = await pcRef.current.createOffer();
            await pcRef.current.setLocalDescription(offer);
            socket.emit('video-offer', { to: peerId, sdp: offer });
            console.log('Offer sent to', peerId);
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
      console.log('Received offer from:', from);
      try {
        await pcRef.current.setRemoteDescription(new RTCSessionDescription(sdp));
        const answer = await pcRef.current.createAnswer();
        await pcRef.current.setLocalDescription(answer);
        socket.emit('video-answer', { to: from, sdp: answer });
        console.log('Sent answer to:', from);
      } catch (err) {
        console.error('Error handling offer:', err);
      }
    });

    // receive answer
    socket.on('video-answer', async ({ sdp }) => {
      console.log('Received answer');
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
          console.log('Added ICE candidate from:', from);
        }
      } catch (e) {
        console.error('Error adding ICE candidate', e);
      }
    });

    // partner left or stopped
    socket.on('video-partner-left', () => {
      console.log('Partner left the video call');
      endCall();
    });

    return () => {
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

  const endCall = () => {
    setConnected(false);
    setIsSearching(true);
    if (pcRef.current) {
      pcRef.current.close();
      pcRef.current = null;
    }
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = null;
    }
  };

  const handleNext = () => {
    const newId = uuidv4();
    sessionStorage.setItem('videoInitiated', 'true');
    sessionStorage.setItem('uniqueVideoId', newId);
    router.push(`/video/${newId}`);
  };

  const handleStop = () => {
    if (socketRef.current) {
      socketRef.current.emit('video-stop');
    }
    endCall();
  };

  return (
    <div className={styles.main}>
      <div className={styles.videoContainer}>
        {isSearching && <p className={styles.system}>Finding stranger…</p>}
        {error && <p className={styles.error}>{error}</p>}
        <video ref={localVideoRef} className={styles.local} autoPlay muted playsInline />
        <video ref={remoteVideoRef} className={styles.remote} autoPlay playsInline />
      </div>

      <div className={styles.actions}>
        <button onClick={handleStop} disabled={!connected}>
          Stop
        </button>
        <button onClick={handleNext}>Next</button>
      </div>
    </div>
  );
}
