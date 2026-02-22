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
const videoUserReady = new Set();

// Video call waiting queue
const videoWaitingUsers = new Set();
const videoUserSocketMap = new Map();

// Interest storage for matching
const userInterests = new Map(); // socketId -> string[]

// Helper function to check if socket is still connected
function isSocketConnected(io, socketId) {
  return io.sockets.sockets.has(socketId);
}

// Helper function to clean up disconnected sockets from chat queues
function cleanupChatQueues(io) {
  const disconnectedSockets = [];

  // Check waiting users
  for (const socketId of waitingUsers) {
    if (!isSocketConnected(io, socketId)) {
      disconnectedSockets.push(socketId);
    }
  }

  // Remove disconnected sockets from waiting users
  disconnectedSockets.forEach((socketId) => {
    waitingUsers.delete(socketId);
    userSocketMap.delete(socketId);
  });

  // Clean up userSocketMap - remove entries where either socket is disconnected
  for (const [socketId, partnerId] of userSocketMap.entries()) {
    if (!isSocketConnected(io, socketId) || !isSocketConnected(io, partnerId)) {
      userSocketMap.delete(socketId);
      userSocketMap.delete(partnerId);
      if (isSocketConnected(io, partnerId)) {
        io.to(partnerId).emit('partner-left');
      }
    }
  }

  return disconnectedSockets.length;
}

// Helper function to clean up disconnected sockets from video queues
function cleanupVideoQueues(io) {
  const disconnectedSockets = [];

  // Check video waiting users
  for (const socketId of videoWaitingUsers) {
    if (!isSocketConnected(io, socketId)) {
      disconnectedSockets.push(socketId);
    }
  }

  // Remove disconnected sockets
  disconnectedSockets.forEach((socketId) => {
    videoWaitingUsers.delete(socketId);
    videoUserReady.delete(socketId);
    const partnerId = videoUserSocketMap.get(socketId);
    if (partnerId) {
      videoUserSocketMap.delete(socketId);
      videoUserSocketMap.delete(partnerId);
      if (isSocketConnected(io, partnerId)) {
        io.to(partnerId).emit('video-partner-left');
      }
    }
  });

  // Clean up videoUserSocketMap
  for (const [socketId, partnerId] of videoUserSocketMap.entries()) {
    if (!isSocketConnected(io, socketId) || !isSocketConnected(io, partnerId)) {
      videoUserSocketMap.delete(socketId);
      videoUserSocketMap.delete(partnerId);
      if (isSocketConnected(io, partnerId)) {
        io.to(partnerId).emit('video-partner-left');
      }
    }
  }

  return disconnectedSockets.length;
}

// Helper function to find a peer with shared interests
function findInterestMatchedPeer(waitingSet, socketId, io, interests) {
  const myInterests = interests || [];
  let bestPeer = null;
  let bestScore = 0;
  let fallbackPeer = null;

  for (const peerId of waitingSet) {
    if (peerId === socketId || !isSocketConnected(io, peerId)) continue;

    if (!fallbackPeer) fallbackPeer = peerId;

    if (myInterests.length > 0) {
      const peerInterests = userInterests.get(peerId) || [];
      const sharedCount = myInterests.filter((i) =>
        peerInterests.includes(i)
      ).length;
      if (sharedCount > bestScore) {
        bestScore = sharedCount;
        bestPeer = peerId;
      }
    }
  }

  // Return interest-matched peer if found, otherwise fallback to any available peer
  return bestPeer || fallbackPeer;
}

// Periodic cleanup function
function startPeriodicCleanup(io) {
  setInterval(() => {
    const chatCleaned = cleanupChatQueues(io);
    const videoCleaned = cleanupVideoQueues(io);
    if (chatCleaned > 0 || videoCleaned > 0) {
      // Keep only cleanup summary logs
    }
  }, 30000); // Run every 30 seconds
}

app.prepare().then(() => {
  const server = express();
  const httpServer = http.createServer(server);
  const io = new Server(httpServer, {
    cors: {
      origin: '*',
    },
  });

  // Start periodic cleanup
  startPeriodicCleanup(io);

  io.on('connection', (socket) => {

    // Leave chat handler - properly remove from chat queues
    socket.on('leave-chat', () => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('partner-left');
        userSocketMap.delete(partnerId);
      }
      waitingUsers.delete(socket.id);
      userSocketMap.delete(socket.id);
      userInterests.delete(socket.id);
    });

    // Leave video handler - properly remove from video queues
    socket.on('leave-video', () => {
      const partnerId = videoUserSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('video-partner-left');
        videoUserSocketMap.delete(partnerId);
        videoUserSocketMap.delete(socket.id);
      }
      videoWaitingUsers.delete(socket.id);
      videoUserReady.delete(socket.id);
      userInterests.delete(socket.id);
    });

    // Join queue
    socket.on('join', (data) => {
      // Validate socket is still connected
      if (!isSocketConnected(io, socket.id)) return;

      // Make sure the user isn't already in the queue
      if (waitingUsers.has(socket.id)) return;

      // Store interests if provided
      const interests = (data && data.interests) || [];
      if (interests.length > 0) {
        userInterests.set(socket.id, interests.map((i) => i.toLowerCase().trim()));
      }

      // Remove socket from queue before finding peer (prevents self-matching)
      waitingUsers.delete(socket.id);

      // Try to find someone with shared interests first, fallback to random
      const peerId = findInterestMatchedPeer(waitingUsers, socket.id, io, userInterests.get(socket.id));

      if (peerId && isSocketConnected(io, peerId)) {
        waitingUsers.delete(peerId);
        userSocketMap.set(socket.id, peerId);
        userSocketMap.set(peerId, socket.id);

        socket.emit('matched');
        io.to(peerId).emit('matched');
      } else {
        // No valid peer found, add to queue
        waitingUsers.add(socket.id);
      }
    });

    socket.on('message', (msg) => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('message', msg);
      }
    });

    socket.on('next', (data) => {
      // Validate socket is still connected
      if (!isSocketConnected(io, socket.id)) return;

      const partnerId = userSocketMap.get(socket.id);

      if (partnerId && isSocketConnected(io, partnerId)) {
        io.to(partnerId).emit('partner-left');
        waitingUsers.delete(partnerId);
        userSocketMap.delete(partnerId);
      }

      userSocketMap.delete(socket.id);

      // Update interests if provided
      const interests = (data && data.interests) || [];
      if (interests.length > 0) {
        userInterests.set(socket.id, interests.map((i) => i.toLowerCase().trim()));
      }

      // Remove old entry if present before re-adding
      waitingUsers.delete(socket.id);

      socket.emit('rejoined');

      // Try to pair with interest-matched peer first, fallback to random
      const peerId = findInterestMatchedPeer(waitingUsers, socket.id, io, userInterests.get(socket.id));

      if (peerId && isSocketConnected(io, peerId)) {
        waitingUsers.delete(peerId);
        waitingUsers.delete(socket.id);
        userSocketMap.set(socket.id, peerId);
        userSocketMap.set(peerId, socket.id);

        socket.emit('matched');
        io.to(peerId).emit('matched');
      } else {
        // No valid peer found, add to queue
        waitingUsers.add(socket.id);
      }
    });

    socket.on('disconnect', () => {
      // Handle chat disconnect
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId && isSocketConnected(io, partnerId)) {
        io.to(partnerId).emit('partner-left');
        waitingUsers.delete(partnerId);
        userSocketMap.delete(partnerId);
      }
      waitingUsers.delete(socket.id);
      userSocketMap.delete(socket.id);

      // Handle video disconnect
      const videoPartnerId = videoUserSocketMap.get(socket.id);
      if (videoPartnerId && isSocketConnected(io, videoPartnerId)) {
        io.to(videoPartnerId).emit('video-partner-left');
        videoUserSocketMap.delete(socket.id);
        videoUserSocketMap.delete(videoPartnerId);
      }
      videoWaitingUsers.delete(socket.id);
      videoUserReady.delete(socket.id);
      userInterests.delete(socket.id);
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
      // Add user to waiting list
      videoWaitingUsers.add(socket.id);
    });

    socket.on('video-ready', (data) => {
      // Validate socket is still connected
      if (!isSocketConnected(io, socket.id)) return;

      // Store interests if provided
      const interests = (data && data.interests) || [];
      if (interests.length > 0) {
        userInterests.set(socket.id, interests.map((i) => i.toLowerCase().trim()));
      }

      videoUserReady.add(socket.id);

      // Remove socket from waiting users before finding peer (prevents self-matching)
      videoWaitingUsers.delete(socket.id);

      // Find a peer who's ready — prefer interest-matched
      const readyWaiting = new Set(
        Array.from(videoWaitingUsers).filter((id) => videoUserReady.has(id))
      );
      const peerId = findInterestMatchedPeer(readyWaiting, socket.id, io, userInterests.get(socket.id));

      if (peerId && isSocketConnected(io, peerId)) {
        videoWaitingUsers.delete(peerId);
        videoWaitingUsers.delete(socket.id);

        videoUserSocketMap.set(socket.id, peerId);
        videoUserSocketMap.set(peerId, socket.id);

        socket.emit('video-matched', { peerId, initiator: true });
        io.to(peerId).emit('video-matched', { peerId: socket.id, initiator: false });

        videoUserReady.delete(peerId);
        videoUserReady.delete(socket.id);
      } else {
        // No valid peer found, ensure user is in waiting queue
        if (!videoWaitingUsers.has(socket.id)) {
          videoWaitingUsers.add(socket.id);
        }
      }
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
      if (partnerId && isSocketConnected(io, partnerId)) {
        // Notify partner that they should stop too
        io.to(partnerId).emit('video-partner-left');
        // Remove partner from all queues to prevent them from matching
        videoUserSocketMap.delete(partnerId);
        videoWaitingUsers.delete(partnerId);
        videoUserReady.delete(partnerId);
      }
      // Remove current user from all queues
      videoUserSocketMap.delete(socket.id);
      videoWaitingUsers.delete(socket.id);
      videoUserReady.delete(socket.id);
      userInterests.delete(socket.id);
    });
  });

  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);
  });
});
