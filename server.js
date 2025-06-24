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

// Video call waiting queue
const videoWaitingUsers = new Set();
const videoUserSocketMap = new Map();

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
      // Handle chat disconnect
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('partner-left');
        waitingUsers.delete(partnerId);
        console.log('Partner disconnected:', partnerId);
        userSocketMap.delete(partnerId);
      }
      waitingUsers.delete(socket.id);
      userSocketMap.delete(socket.id);

      // Handle video disconnect
      const videoPartnerId = videoUserSocketMap.get(socket.id);
      if (videoPartnerId && videoWaitingUsers.has(videoPartnerId)) {
        io.to(videoPartnerId).emit('video-partner-left');
        videoUserSocketMap.delete(socket.id);
        videoUserSocketMap.delete(videoPartnerId);
      }
      videoWaitingUsers.delete(socket.id);

      console.log('User disconnected:', socket.id);
      console.log('--sudhanshu disconnect--', waitingUsers);
      console.log('Video waiting users:', videoWaitingUsers);
    });

    socket.on('image', (base64Image) => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('image', base64Image);
      }
    });

    socket.on('typing', () => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('stranger-typing');
      }
    });

    socket.on('join-video', () => {
      console.log('=== VIDEO JOIN REQUEST ===');
      console.log('User joining video queue:', socket.id);
      console.log('Current video waiting users:', Array.from(videoWaitingUsers));
      console.log('Current video user socket map:', Array.from(videoUserSocketMap.entries()));

      // Make sure the user isn't already in the video queue
      if (videoWaitingUsers.has(socket.id)) {
        console.log('User already in video queue, ignoring');
        return;
      }

      // Try to find someone else to pair with for video
      const peerId = Array.from(videoWaitingUsers).find((id) => id !== socket.id);
      console.log('Looking for peer, found:', peerId);

      if (peerId) {
        console.log('MATCHING USERS:', socket.id, 'with', peerId);
        videoWaitingUsers.delete(peerId);
        videoUserSocketMap.set(socket.id, peerId);
        videoUserSocketMap.set(peerId, socket.id);

        // notify both peers they're matched
        socket.emit('video-matched', { peerId, initiator: true });
        io.to(peerId).emit('video-matched', { peerId: socket.id, initiator: false });
        console.log(`✅ Video matched: ${socket.id} with ${peerId}`);
      } else {
        videoWaitingUsers.add(socket.id);
        console.log('➕ User added to video queue:', socket.id);
      }
      console.log('Updated video waiting users:', Array.from(videoWaitingUsers));
      console.log('Updated video user socket map:', Array.from(videoUserSocketMap.entries()));
      console.log('=== END VIDEO JOIN ===');
    });

    socket.on('video-offer', ({ to, sdp }) =>
      io.to(to).emit('video-offer', { from: socket.id, sdp })
    );
    socket.on('video-answer', ({ to, sdp }) =>
      io.to(to).emit('video-answer', { from: socket.id, sdp })
    );
    socket.on('new-ice-candidate', ({ to, candidate }) =>
      io.to(to).emit('new-ice-candidate', { from: socket.id, candidate })
    );
    socket.on('video-stop', () => {
      const partnerId = videoUserSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('video-partner-left');
        videoUserSocketMap.delete(socket.id);
        videoUserSocketMap.delete(partnerId);
      }
      videoWaitingUsers.delete(socket.id);
    });
    socket.on('video-ready', () => {
      const partnerId = videoUserSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('video-peer-ready');
      }
    });
  });

  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
