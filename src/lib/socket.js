import { io } from 'socket.io-client';

let socket;

export const connectSocket = () => {
  if (!socket || socket.disconnected) {
    socket = io();
  }

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.disconnect();
    socket = null; // ✅ Reset it so future calls create a fresh one
  }
};
