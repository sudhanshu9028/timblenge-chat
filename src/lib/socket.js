// lib/socket.js
import { io } from 'socket.io-client';

let socket = null;
// Define the socket server URL, defaulting to localhost if not set in environment variables
// const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const connectSocket = () => {
  if (!socket || socket.disconnected) {
    // console.log(`Attempting to connect to socket server at: ${SOCKET_SERVER_URL}`);
    socket = io({
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 20000,
    });

    // Handle reconnection events for better debugging
    socket.on('reconnect', (attemptNumber) => {
      console.log(`Socket reconnected after ${attemptNumber} attempts`);
    });

    socket.on('reconnect_attempt', (attemptNumber) => {
      console.log(`Socket reconnection attempt ${attemptNumber}`);
    });

    socket.on('reconnect_error', (error) => {
      console.error('Socket reconnection error:', error);
    });

    socket.on('reconnect_failed', () => {
      console.error('Socket reconnection failed after all attempts');
    });
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    console.log(
      `Explicitly disconnecting socket: ID - ${socket.id}, Time: ${new Date().toLocaleTimeString()}`
    );
    // Remove all event listeners before disconnecting to prevent memory leaks
    socket.removeAllListeners();
    socket.disconnect();
    // Setting socket to null ensures that the next call to connectSocket
    // will create a brand new socket instance.
    socket = null;
  } else if (socket && !socket.connected) {
    console.log(
      `Socket was already disconnected or not connected. ID - ${socket.id}. Setting to null. Time: ${new Date().toLocaleTimeString()}`
    );
    // Remove listeners even if disconnected
    socket.removeAllListeners();
    socket = null; // Ensure it's nulled out if it exists but isn't connected
  } else {
    console.log(`No active socket to disconnect. Time: ${new Date().toLocaleTimeString()}`);
  }
};

// Optional: A way to get the current socket instance without trying to connect
export const getSocket = () => socket;
