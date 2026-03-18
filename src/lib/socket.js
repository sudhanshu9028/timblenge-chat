// lib/socket.js
import { io } from 'socket.io-client';

let socket = null;
// Define the socket server URL, defaulting to localhost if not set in environment variables
// const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const connectSocket = () => {
  if (!socket || socket.disconnected) {
    socket = io({
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    // Remove all event listeners before disconnecting to prevent memory leaks
    socket.removeAllListeners();
    socket.disconnect();
    // Setting socket to null ensures that the next call to connectSocket
    // will create a brand new socket instance.
    socket = null;
  } else if (socket && !socket.connected) {
    // Remove listeners even if disconnected
    socket.removeAllListeners();
    socket = null; // Ensure it's nulled out if it exists but isn't connected
  }
};

// Optional: A way to get the current socket instance without trying to connect
export const getSocket = () => socket;
