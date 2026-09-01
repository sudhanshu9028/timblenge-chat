// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const {
  getRandomPersonality,
  getAutoDisconnectTime,
  buildSystemPrompt,
  callGeminiAPI,
} = require('./src/server/aiBot');

const port = parseInt(process.env.PORT, 10) || 3000;
const dev = process.env.NODE_ENV !== 'production';
const app = next({ dev });
const handle = app.getRequestHandler();

// --- Matchmaking tunables -------------------------------------------------
// Overridable by env so these can be tuned as traffic grows (and dropped right
// down when testing) without a code change.
const num = (name, fallback) => parseInt(process.env[name], 10) || fallback;

// How long a user waits for a real human before the AI takes over. This used
// to be 3s, which deleted them from the queue almost immediately and made it
// nearly impossible for two real visitors to ever find each other.
const BOT_FALLBACK_DELAY_MS = num('BOT_FALLBACK_DELAY_MS', 60_000);
// A user already talking to the AI is handed back to a real human the moment
// one shows up — unless they look genuinely engaged, in which case we leave
// the conversation alone rather than yanking them out of it.
const BOT_STEAL_MIN_AGE_MS = num('BOT_STEAL_MIN_AGE_MS', 90_000);
const BOT_STEAL_MIN_MSGS = num('BOT_STEAL_MIN_MSGS', 4);
// How long after a chat ends the two sides can still agree to reconnect.
const RECONNECT_WINDOW_MS = num('RECONNECT_WINDOW_MS', 120_000);
// Presence broadcast. Clients decide whether the number is worth showing.
const ONLINE_BROADCAST_MS = num('ONLINE_BROADCAST_MS', 5_000);

// In-memory queue and user pairing
const waitingUsers = new Set();
const userSocketMap = new Map();
const videoUserReady = new Set();

// Video call waiting queue
const videoWaitingUsers = new Set();
const videoUserSocketMap = new Map();

// Interest storage for matching
const userInterests = new Map(); // socketId -> string[]

// AI Bot fallback timers
const botTimers = new Map(); // socketId -> timeoutId
const botAutoEndTimers = new Map(); // socketId -> timeoutId
const botUsers = new Set(); // socketIds currently chatting with a bot
const botConversations = new Map(); // socketId -> { personality, history: [] }
const botMessageBuffers = new Map(); // socketId -> string[] (buffered messages)
const botDebounceTimers = new Map(); // socketId -> timeoutId
const botProcessing = new Set(); // socketIds currently waiting for API response

// Reconnect-with-last-stranger state
const lastPartner = new Map(); // socketId -> { partnerId, at }
const reconnectWanted = new Set(); // socketIds that have asked to reconnect

/**
 * Calculate a realistic typing delay based on reply length
 * Simulates human typing speed (~50-70ms per character)
 */
function getTypingDelay(text) {
  const msPerChar = 50 + Math.random() * 20; // 50-70ms per char
  const delay = text.length * msPerChar;
  return Math.max(1000, Math.min(delay, 5000)); // clamp 1s-5s
}

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
        // The other side dropped off entirely, so there's nobody to reconnect to.
        io.to(partnerId).emit('partner-left', { canReconnect: false });
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
      const sharedCount = myInterests.filter((i) => peerInterests.includes(i)).length;
      if (sharedCount > bestScore) {
        bestScore = sharedCount;
        bestPeer = peerId;
      }
    }
  }

  // Return interest-matched peer if found, otherwise fallback to any available peer
  return bestPeer || fallbackPeer;
}

/**
 * Is this bot chat still interruptible?
 * We steal a user back from the AI as soon as a real human is available, but
 * not if they look genuinely invested in the conversation they're already in.
 */
function isStealableFromBot(socketId) {
  const conv = botConversations.get(socketId);
  if (!conv) return false;
  const age = Date.now() - (conv.startedAt || 0);
  // Counted as messages arrive, not from `history` — the bot handler debounces
  // rapid messages into a single history entry, so a fast typer would otherwise
  // read as barely engaged.
  const userMsgs = conv.userMsgCount || 0;
  return !(age > BOT_STEAL_MIN_AGE_MS && userMsgs >= BOT_STEAL_MIN_MSGS);
}

/**
 * Find someone for this socket to talk to.
 * Real users waiting in the queue always win. Only when there are none do we
 * pull someone out of an AI chat — which is what lets two visitors arriving a
 * minute apart still meet each other.
 *
 * @returns {{ peerId: string, fromBot: boolean } | null}
 */
function findAnyPeer(io, socketId, interests) {
  const waiting = findInterestMatchedPeer(waitingUsers, socketId, io, interests);
  if (waiting) return { peerId: waiting, fromBot: false };

  const stealable = new Set(
    Array.from(botUsers).filter((id) => isSocketConnected(io, id) && isStealableFromBot(id))
  );
  const stolen = findInterestMatchedPeer(stealable, socketId, io, interests);
  return stolen ? { peerId: stolen, fromBot: true } : null;
}

/**
 * Can `socketId` still reconnect with the person they were last talking to?
 * Both sides have to still point at each other, the ex has to be online and
 * unpaired, and the window has to be open.
 */
function getReconnectableEx(io, socketId) {
  const record = lastPartner.get(socketId);
  if (!record) return null;

  const { partnerId, at } = record;
  if (Date.now() - at > RECONNECT_WINDOW_MS) return null;
  if (!isSocketConnected(io, partnerId)) return null;
  if (userSocketMap.has(partnerId)) return null;

  // Symmetry check — blocks a stale one-sided claim after the ex moved on.
  const theirs = lastPartner.get(partnerId);
  if (!theirs || theirs.partnerId !== socketId) return null;

  return partnerId;
}

/** Remember a finished pairing so both sides can offer to reconnect. */
function rememberPartners(a, b) {
  const at = Date.now();
  lastPartner.set(a, { partnerId: b, at });
  lastPartner.set(b, { partnerId: a, at });
}

/**
 * This socket is no longer reconnectable (left, or matched with someone else).
 * Tell whoever was waiting on them so the button disappears.
 */
function cancelReconnect(io, socketId) {
  reconnectWanted.delete(socketId);
  const record = lastPartner.get(socketId);
  if (record && reconnectWanted.has(record.partnerId)) {
    reconnectWanted.delete(record.partnerId);
    if (isSocketConnected(io, record.partnerId)) {
      io.to(record.partnerId).emit('reconnect-unavailable');
    }
  }
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

  // Presence. The socket only connects on /chat and /video, so this is a
  // genuine count of people in a conversation or a queue right now.
  const getOnlineCount = () => io.engine.clientsCount;
  const broadcastOnlineCount = () => io.emit('online-count', getOnlineCount());
  setInterval(broadcastOnlineCount, ONLINE_BROADCAST_MS);

  server.get('/api/online', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json({ count: getOnlineCount() });
  });

  io.on('connection', (socket) => {
    socket.emit('online-count', getOnlineCount());
    broadcastOnlineCount();
    // Helper to clear bot timers for a socket
    function clearBotTimers(socketId) {
      if (botTimers.has(socketId)) {
        clearTimeout(botTimers.get(socketId));
        botTimers.delete(socketId);
      }
      if (botAutoEndTimers.has(socketId)) {
        clearTimeout(botAutoEndTimers.get(socketId));
        botAutoEndTimers.delete(socketId);
      }
      botUsers.delete(socketId);
      botConversations.delete(socketId);
      botMessageBuffers.delete(socketId);
      botProcessing.delete(socketId);
      if (botDebounceTimers.has(socketId)) {
        clearTimeout(botDebounceTimers.get(socketId));
        botDebounceTimers.delete(socketId);
      }
    }

    // Helper to start bot fallback timer
    function startBotFallbackTimer(socketId) {
      const timerId = setTimeout(() => {
        if (waitingUsers.has(socketId) && !userSocketMap.has(socketId)) {
          waitingUsers.delete(socketId);
          const { personality, index } = getRandomPersonality();
          botUsers.add(socketId);
          botConversations.set(socketId, {
            personality,
            history: [],
            startedAt: Date.now(),
            userMsgCount: 0,
          });
          // They're in a conversation now, so they can't be reconnected with.
          cancelReconnect(io, socketId);
          socket.emit('bot-matched', { personalityIndex: index });

          // Auto-end bot chat after 3-5 minutes
          const autoEndTimer = setTimeout(() => {
            if (botUsers.has(socketId)) {
              botUsers.delete(socketId);
              socket.emit('bot-disconnected');
              botAutoEndTimers.delete(socketId);
            }
          }, getAutoDisconnectTime());
          botAutoEndTimers.set(socketId, autoEndTimer);
        }
      }, BOT_FALLBACK_DELAY_MS);
      botTimers.set(socketId, timerId);
    }

    /**
     * Pair two sockets and tell them both. When the peer was mid-AI-chat we
     * send `bot-replaced` instead, so their client can frame it as an upgrade
     * rather than a partner walking out.
     */
    function pairSockets(socketId, peerId, { fromBot = false } = {}) {
      waitingUsers.delete(socketId);
      waitingUsers.delete(peerId);

      clearBotTimers(socketId);
      clearBotTimers(peerId);

      cancelReconnect(io, socketId);
      cancelReconnect(io, peerId);

      userSocketMap.set(socketId, peerId);
      userSocketMap.set(peerId, socketId);

      io.to(socketId).emit('matched');
      io.to(peerId).emit(fromBot ? 'bot-replaced' : 'matched');
    }

    // Leave chat handler - properly remove from chat queues
    socket.on('leave-chat', () => {
      clearBotTimers(socket.id);
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        // Both sides are still online here, so either can offer to reconnect.
        rememberPartners(socket.id, partnerId);
        io.to(partnerId).emit('partner-left', { canReconnect: true });
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

    // Reconnect with the last stranger — only fires when both sides ask.
    socket.on('reconnect-request', () => {
      const exId = getReconnectableEx(io, socket.id);
      if (!exId) {
        socket.emit('reconnect-unavailable');
        reconnectWanted.delete(socket.id);
        return;
      }

      if (reconnectWanted.has(exId)) {
        // They asked first — put them back together.
        reconnectWanted.delete(exId);
        reconnectWanted.delete(socket.id);

        waitingUsers.delete(socket.id);
        waitingUsers.delete(exId);
        clearBotTimers(socket.id);
        clearBotTimers(exId);

        userSocketMap.set(socket.id, exId);
        userSocketMap.set(exId, socket.id);
        lastPartner.delete(socket.id);
        lastPartner.delete(exId);

        io.to(socket.id).emit('reconnected');
        io.to(exId).emit('reconnected');
      } else {
        // Wait for them, and nudge them so they know the offer is open.
        reconnectWanted.add(socket.id);
        socket.emit('reconnect-pending');
        io.to(exId).emit('reconnect-offer');
      }
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
        userInterests.set(
          socket.id,
          interests.map((i) => i.toLowerCase().trim())
        );
      }

      // Remove socket from queue before finding peer (prevents self-matching)
      waitingUsers.delete(socket.id);

      // Real waiting users first, then anyone we can pull out of an AI chat
      const match = findAnyPeer(io, socket.id, userInterests.get(socket.id));

      if (match) {
        pairSockets(socket.id, match.peerId, { fromBot: match.fromBot });
      } else {
        // No valid peer found, add to queue
        waitingUsers.add(socket.id);
        // Start bot fallback timer
        startBotFallbackTimer(socket.id);
      }
    });

    socket.on('message', (msg) => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId) {
        io.to(partnerId).emit('message', msg);
      }
    });

    // Bot message handler — debounces rapid messages and simulates typing speed
    socket.on('bot-message', (msg) => {
      if (!botUsers.has(socket.id)) return;
      const conv = botConversations.get(socket.id);
      if (!conv) {
        socket.emit('bot-disconnected');
        return;
      }

      // Tracked here rather than from history, which merges debounced messages.
      // This is what the steal guard reads to judge engagement.
      conv.userMsgCount = (conv.userMsgCount || 0) + 1;

      // Buffer the message
      if (!botMessageBuffers.has(socket.id)) {
        botMessageBuffers.set(socket.id, []);
      }
      botMessageBuffers.get(socket.id).push(msg);

      // Clear existing debounce timer
      if (botDebounceTimers.has(socket.id)) {
        clearTimeout(botDebounceTimers.get(socket.id));
      }

      // If already processing an API call, just buffer — will be picked up after
      if (botProcessing.has(socket.id)) return;

      // Debounce: wait 1.5s for more messages before processing
      const timerId = setTimeout(async () => {
        botDebounceTimers.delete(socket.id);
        await processBotMessages(socket);
      }, 1500);
      botDebounceTimers.set(socket.id, timerId);
    });

    // Process buffered bot messages
    async function processBotMessages(socket) {
      if (!botUsers.has(socket.id)) return;

      const conv = botConversations.get(socket.id);
      const buffer = botMessageBuffers.get(socket.id);
      if (!conv || !buffer || buffer.length === 0) return;

      // Grab all buffered messages and clear buffer
      const combinedMsg = buffer.splice(0, buffer.length).join('\n');
      botProcessing.add(socket.id);

      // Add combined user message to history
      conv.history.push({ role: 'user', text: combinedMsg });

      // Call Gemini API server-side
      const reply = await callGeminiAPI(buildSystemPrompt(conv.personality), conv.history);

      if (!reply) {
        // API returned nothing (usually a safety filter). End the chat cleanly
        // rather than faking an offended human — the AI is labelled now.
        botProcessing.delete(socket.id);
        clearBotTimers(socket.id);
        socket.emit('bot-disconnected');
        return;
      }

      // Add bot reply to history
      conv.history.push({ role: 'bot', text: reply });

      // Simulate typing delay based on reply length
      const typingDelay = getTypingDelay(reply);
      await new Promise((resolve) => setTimeout(resolve, typingDelay));

      socket.emit('bot-reply', reply);
      botProcessing.delete(socket.id);

      // Check if more messages came in while we were processing
      const remaining = botMessageBuffers.get(socket.id);
      if (remaining && remaining.length > 0) {
        await processBotMessages(socket);
      }
    }

    // Bot greeting request — server generates the first AI greeting
    socket.on('bot-request-greeting', async () => {
      if (!botUsers.has(socket.id)) return;

      const conv = botConversations.get(socket.id);
      if (!conv) {
        socket.emit('bot-greeting-failed');
        return;
      }

      const reply = await callGeminiAPI(buildSystemPrompt(conv.personality), [
        { role: 'user', text: '[conversation just started, send your opening greeting]' },
      ]);

      if (!reply) {
        socket.emit('bot-greeting-failed');
        return;
      }

      // Store AI greeting in history
      conv.history.push({ role: 'bot', text: reply });

      // Simulate typing delay for the greeting
      const typingDelay = getTypingDelay(reply);
      await new Promise((resolve) => setTimeout(resolve, typingDelay));

      socket.emit('bot-greeting', reply);
    });

    socket.on('next', (data) => {
      // Validate socket is still connected
      if (!isSocketConnected(io, socket.id)) return;

      const partnerId = userSocketMap.get(socket.id);

      if (partnerId && isSocketConnected(io, partnerId)) {
        // This user chose someone new, so they aren't reconnectable.
        io.to(partnerId).emit('partner-left', { canReconnect: false });
        waitingUsers.delete(partnerId);
        userSocketMap.delete(partnerId);
      }

      userSocketMap.delete(socket.id);

      // Update interests if provided
      const interests = (data && data.interests) || [];
      if (interests.length > 0) {
        userInterests.set(
          socket.id,
          interests.map((i) => i.toLowerCase().trim())
        );
      }

      // Remove old entry if present before re-adding
      waitingUsers.delete(socket.id);

      socket.emit('rejoined');

      // Clear any existing bot timers
      clearBotTimers(socket.id);

      // Moving on means giving up the reconnect offer
      cancelReconnect(io, socket.id);
      lastPartner.delete(socket.id);

      // Real waiting users first, then anyone we can pull out of an AI chat
      const match = findAnyPeer(io, socket.id, userInterests.get(socket.id));

      if (match) {
        pairSockets(socket.id, match.peerId, { fromBot: match.fromBot });
      } else {
        // No valid peer found, add to queue
        waitingUsers.add(socket.id);
        // Start bot fallback timer
        startBotFallbackTimer(socket.id);
      }
    });

    socket.on('disconnect', () => {
      // Clear bot timers
      clearBotTimers(socket.id);

      // They closed the tab — anyone holding a reconnect offer needs to know.
      cancelReconnect(io, socket.id);
      lastPartner.delete(socket.id);

      // Handle chat disconnect
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId && isSocketConnected(io, partnerId)) {
        io.to(partnerId).emit('partner-left', { canReconnect: false });
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

      broadcastOnlineCount();
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
        userInterests.set(
          socket.id,
          interests.map((i) => i.toLowerCase().trim())
        );
      }

      videoUserReady.add(socket.id);

      // Remove socket from waiting users before finding peer (prevents self-matching)
      videoWaitingUsers.delete(socket.id);

      // Find a peer who's ready — prefer interest-matched
      const readyWaiting = new Set(
        Array.from(videoWaitingUsers).filter((id) => videoUserReady.has(id))
      );
      const peerId = findInterestMatchedPeer(
        readyWaiting,
        socket.id,
        io,
        userInterests.get(socket.id)
      );

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
