// server.js
const express = require('express');
const next = require('next');
const http = require('http');
const { Server } = require('socket.io');
const { startPresenceStats, getPresenceStats } = require('./src/server/presenceStats');
const { pickQuestion } = require('./src/server/games/wouldYouRather');
const pushStore = require('./src/server/pushStore');
const { submitChangedUrls, getKey: getIndexNowKey } = require('./src/server/indexNow');
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

// Push. The busy alert only fires on an upward crossing of this threshold,
// and never more than once per subscriber per day (enforced in pushStore).
const PUSH_BUSY_THRESHOLD = num('PUSH_BUSY_THRESHOLD', 10);
// Ignore a dip below the threshold shorter than this, so a single person
// refreshing can't re-arm the alert.
const PUSH_REARM_MS = num('PUSH_REARM_MS', 60 * 60 * 1000);
// Prime Time — keep in sync with src/lib/primeTime.js (22:00 IST = 16:30 UTC).
const PRIME_TIME_START_UTC_MINUTES = num('PRIME_TIME_START_UTC_MINUTES', 16 * 60 + 30);
const PRIME_TIME_REMINDER_LEAD_MINUTES = 10;

// Public origin, used for IndexNow submissions and the key file location.
const SITE_URL = process.env.SITE_URL || 'https://anoniz.com';

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

// Would You Rather. Keyed by socket id on both sides of a pair so a lookup is
// O(1) from either. The server holds the state and the answers: client-side
// state is trivially cheated and desyncs the moment someone reconnects.
const gameSessions = new Map(); // socketId -> session (shared object)

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
      endGame(io, socketId);
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

/** Tear down any game these two were playing, and tell whoever is still here. */
function endGame(io, socketId, { notify = true } = {}) {
  const session = gameSessions.get(socketId);
  if (!session) return;

  for (const id of session.players) {
    gameSessions.delete(id);
    if (notify && id !== socketId && isSocketConnected(io, id)) {
      io.to(id).emit('game:end', { reason: 'partner_left' });
    }
  }
}

/** Send the next question to both players, or finish if the bank runs dry. */
function sendNextQuestion(io, session) {
  const question = pickQuestion(session.round + 1, session.askedKeys);
  if (!question) {
    for (const id of session.players) {
      if (isSocketConnected(io, id)) io.to(id).emit('game:end', { reason: 'exhausted' });
      gameSessions.delete(id);
    }
    return;
  }

  session.round += 1;
  session.askedKeys.push(question.key);
  session.currentKey = question.key;
  session.options = question.options;
  session.choices = {};

  for (const id of session.players) {
    if (isSocketConnected(io, id)) {
      io.to(id).emit('game:question', {
        round: session.round,
        options: question.options,
      });
    }
  }
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

  // --- Web push ---------------------------------------------------------
  pushStore.initPushStore();

  const jsonBody = express.json({ limit: '16kb' });

  server.post('/api/push/subscribe', jsonBody, (req, res) => {
    if (!pushStore.isEnabled()) {
      return res.status(503).json({ error: 'Push is not configured' });
    }
    const { subscription, tzOffset } = req.body || {};
    if (!subscription?.endpoint) {
      return res.status(400).json({ error: 'Missing subscription' });
    }
    pushStore.addSubscription(subscription, tzOffset);
    return res.json({ ok: true });
  });

  server.post('/api/push/unsubscribe', jsonBody, (req, res) => {
    const { endpoint } = req.body || {};
    if (!endpoint) return res.status(400).json({ error: 'Missing endpoint' });
    pushStore.removeSubscription(endpoint);
    return res.json({ ok: true });
  });

  // Busy alert. Armed only after the site has been quiet for a while, so a
  // count hovering around the threshold can't fire this repeatedly.
  let busyArmed = true;
  let belowSince = Date.now();

  setInterval(async () => {
    const count = getOnlineCount();

    if (count < PUSH_BUSY_THRESHOLD) {
      if (belowSince === null) belowSince = Date.now();
      // Only re-arm once it has been quiet long enough that the next surge is
      // genuinely a new event, not the count bouncing around the threshold.
      if (!busyArmed && Date.now() - belowSince >= PUSH_REARM_MS) busyArmed = true;
      return;
    }

    belowSince = null;
    if (!busyArmed) return;

    busyArmed = false;
    const result = await pushStore.broadcast({
      title: 'Anoniz is busy right now',
      body: `${count} people online — good time to find someone.`,
      tag: 'anoniz-busy',
      url: '/chat',
    });
    if (result.sent) console.info(`[push] busy alert sent to ${result.sent}`);
  }, 60 * 1000);

  // Prime-time reminder, once a day, a few minutes before the window opens.
  let lastPrimeReminderDay = null;
  setInterval(async () => {
    const now = new Date();
    const nowMinutes = now.getUTCHours() * 60 + now.getUTCMinutes();
    const target = PRIME_TIME_START_UTC_MINUTES - PRIME_TIME_REMINDER_LEAD_MINUTES;
    const dayKey = now.toISOString().slice(0, 10);

    if (lastPrimeReminderDay === dayKey) return;
    if (nowMinutes < target || nowMinutes > target + 5) return;

    lastPrimeReminderDay = dayKey;
    const result = await pushStore.broadcast({
      title: 'Prime time starts in 10 minutes',
      body: '10 PM IST is when the most strangers are online.',
      tag: 'anoniz-prime-time',
      url: '/chat',
    });
    if (result.sent) console.info(`[push] prime time reminder sent to ${result.sent}`);
  }, 60 * 1000);

  // Turns the Prime Time guess into a measured fact. Read this after a couple
  // of weeks and move START_UTC_MINUTES in src/lib/primeTime.js to match.
  startPresenceStats(getOnlineCount);
  server.get('/api/presence-stats', (req, res) => {
    res.setHeader('Cache-Control', 'no-store');
    res.json(getPresenceStats());
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
      // A fresh pairing never inherits a game from a previous conversation.
      endGame(io, socketId, { notify: false });
      endGame(io, peerId, { notify: false });

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
      endGame(io, socket.id);
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

    // --- Would You Rather -------------------------------------------------
    // Human pairs only; the chip is hidden client-side during AI chats and
    // this guard makes that structural rather than cosmetic.

    socket.on('game:offer', () => {
      const partnerId = userSocketMap.get(socket.id);
      if (!partnerId || !isSocketConnected(io, partnerId)) return;
      if (gameSessions.has(socket.id)) return;
      io.to(partnerId).emit('game:offer');
    });

    socket.on('game:decline', () => {
      const partnerId = userSocketMap.get(socket.id);
      if (partnerId && isSocketConnected(io, partnerId)) {
        io.to(partnerId).emit('game:declined');
      }
    });

    socket.on('game:accept', () => {
      const partnerId = userSocketMap.get(socket.id);
      if (!partnerId || !isSocketConnected(io, partnerId)) return;
      if (gameSessions.has(socket.id)) return;

      const session = {
        players: [socket.id, partnerId],
        round: 0,
        askedKeys: [],
        currentKey: null,
        options: null,
        choices: {},
        agreements: 0,
      };
      gameSessions.set(socket.id, session);
      gameSessions.set(partnerId, session);

      for (const id of session.players) {
        io.to(id).emit('game:started');
      }
      sendNextQuestion(io, session);
    });

    socket.on('game:choice', ({ choice } = {}) => {
      const session = gameSessions.get(socket.id);
      if (!session || !session.options) return;
      if (choice !== 0 && choice !== 1) return;
      if (session.choices[socket.id] !== undefined) return;

      session.choices[socket.id] = choice;

      // Nothing leaves the server until both have committed — that's what
      // makes the reveal simultaneous rather than a race.
      const [a, b] = session.players;
      if (session.choices[a] === undefined || session.choices[b] === undefined) {
        const partnerId = session.players.find((id) => id !== socket.id);
        if (isSocketConnected(io, partnerId)) io.to(partnerId).emit('game:partner-answered');
        return;
      }

      const agreed = session.choices[a] === session.choices[b];
      if (agreed) session.agreements += 1;

      for (const id of session.players) {
        if (!isSocketConnected(io, id)) continue;
        const partnerId = session.players.find((other) => other !== id);
        io.to(id).emit('game:reveal', {
          round: session.round,
          options: session.options,
          yours: session.choices[id],
          theirs: session.choices[partnerId],
          agreed,
          agreements: session.agreements,
        });
      }
    });

    socket.on('game:next', () => {
      const session = gameSessions.get(socket.id);
      if (!session) return;
      // Only advance once both have seen the reveal.
      const [a, b] = session.players;
      if (session.choices[a] === undefined || session.choices[b] === undefined) return;
      sendNextQuestion(io, session);
    });

    socket.on('game:quit', () => {
      const session = gameSessions.get(socket.id);
      if (!session) return;
      for (const id of session.players) {
        if (isSocketConnected(io, id)) {
          io.to(id).emit('game:end', {
            reason: id === socket.id ? 'you_quit' : 'partner_quit',
            agreements: session.agreements,
            rounds: session.round,
          });
        }
        gameSessions.delete(id);
      }
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

      endGame(io, socket.id);

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

      endGame(io, socket.id);

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

  // IndexNow ownership proof. Served from the root as {key}.txt.
  //
  // Falls through to Next when the filename isn't our key — without that,
  // this route would swallow /robots.txt and every other root .txt.
  server.get('/:filename.txt', (req, res, next) => {
    const key = getIndexNowKey();
    if (!key || req.params.filename !== key) return next();
    res.type('text/plain; charset=utf-8').send(key);
  });

  server.all(/(.*)/, (req, res) => {
    return handle(req, res);
  });

  httpServer.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`);

    // Tell IndexNow about anything that changed since the last deploy. Only
    // URLs whose sitemap lastmod actually moved are sent, so restarts and
    // redeploys of unchanged content cost nothing.
    if (!dev) {
      // Read the sitemap over loopback so boot doesn't wait on public DNS,
      // but submit the public URLs the sitemap contains.
      submitChangedUrls({ siteUrl: SITE_URL, sitemapUrl: `http://127.0.0.1:${port}` })
        .then((result) => {
          if (result.status === 'ok') {
            const skipped = result.skipped ? `, ${result.skipped} not live yet` : '';
            console.info(
              `[indexnow] submitted ${result.submitted}/${result.total} URLs` +
                ` (HTTP ${result.code}${skipped})`
            );
          } else if (result.status !== 'noop') {
            console.info(`[indexnow] ${result.status}: ${result.reason || ''}`);
          }
        })
        .catch((error) => console.error('[indexnow] failed:', error.message));
    }
  });
});
