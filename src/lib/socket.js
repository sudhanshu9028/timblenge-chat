// lib/socket.js
import { io } from 'socket.io-client';

let socket = null;
// Define the socket server URL, defaulting to localhost if not set in environment variables
// const SOCKET_SERVER_URL = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000';

export const connectSocket = () => {
  if (!socket || socket.disconnected) {
    // console.log(`Attempting to connect to socket server at: ${SOCKET_SERVER_URL}`);
    socket = io();
  }
  return socket;
};

export const disconnectSocket = () => {
  if (socket && socket.connected) {
    console.log(
      `Explicitly disconnecting socket: ID - ${socket.id}, Time: ${new Date().toLocaleTimeString()}`
    );
    socket.disconnect();
    // Setting socket to null ensures that the next call to connectSocket
    // will create a brand new socket instance.
    socket = null;
  } else if (socket && !socket.connected) {
    console.log(
      `Socket was already disconnected or not connected. ID - ${socket.id}. Setting to null. Time: ${new Date().toLocaleTimeString()}`
    );
    socket = null; // Ensure it's nulled out if it exists but isn't connected
  } else {
    console.log(`No active socket to disconnect. Time: ${new Date().toLocaleTimeString()}`);
  }
};

// Optional: A way to get the current socket instance without trying to connect
export const getSocket = () => socket;
