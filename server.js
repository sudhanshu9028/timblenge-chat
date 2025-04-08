// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// In-memory queue and user pairing
const waitingUsers = new Set();
const userSocketMap = new Map();

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Join queue
    socket.on('join', () => {
      console.log('User joining:', socket.id);

      // Make sure the user isn't already in the queue
      if (waitingUsers.has(socket.id)) return;

      // Try to find someone else to pair with
      const peerId = Array.from(waitingUsers).find((id) => id !== socket.id);

      if (peerId) {
        waitingUsers.delete(peerId);
        userSocketMap.set(socket.id, peerId);
        userSocketMap.set(peerId, socket.id);

        socket.emit('matched');
        io.to(peerId).emit('matched');
      } else {
        waitingUsers.add(socket.id);
      }
      console.log('--sudhanshu join--', waitingUsers);
    });

    socket.on('message', (msg) => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('message', msg);
      }
    });

    socket.on('next', () => {
      const partnerId = userSocketMap.get(socket.id);

      if (partnerId) {
        io.to(partnerId).emit('partner-left');
        waitingUsers.delete(partnerId);
        userSocketMap.delete(partnerId);
      }

      userSocketMap.delete(socket.id);

      // Remove old entry if present before re-adding
      waitingUsers.delete(socket.id);
      waitingUsers.add(socket.id);

      socket.emit('rejoined');

      // Try to pair with a non-self peer
      const peerId = Array.from(waitingUsers).find((id) => id !== socket.id);

      if (peerId) {
        waitingUsers.delete(peerId);
        waitingUsers.delete(socket.id);
        userSocketMap.set(socket.id, peerId);
        userSocketMap.set(peerId, socket.id);

        socket.emit('matched');
        io.to(peerId).emit('matched');
      }
      console.log('--sudhanshu next--', waitingUsers);
    });

    socket.on('disconnect', () => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('partner-left');
        waitingUsers.delete(partnerId);
        console.log('Partner disconnected:', partnerId);
        userSocketMap.delete(partnerId);
      }
      waitingUsers.delete(socket.id);
      userSocketMap.delete(socket.id);
      console.log('User disconnected:', socket.id);
      console.log('--sudhanshu disconnect--', waitingUsers);
    });
  });

  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
