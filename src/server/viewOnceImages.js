// View-once photos.
//
// The image bytes only ever live in this process's memory. Nothing is written
// to disk or a CDN, and there is no URL for them: the sender pushes the bytes
// over the socket, the receiver gets an opaque id, and opening it hands the
// bytes over exactly once and deletes them. Anything unopened is dropped when
// either side leaves the conversation, or after UNOPENED_TTL_MS.

const crypto = require('crypto');

const num = (name, fallback) => parseInt(process.env[name], 10) || fallback;

// Clients re-encode to JPEG at ~1600px before sending, which lands well under
// this. The socket.io buffer limit in server.js must stay above it.
const MAX_IMAGE_BYTES = num('VIEW_ONCE_MAX_BYTES', 2_500_000);
const UNOPENED_TTL_MS = num('VIEW_ONCE_TTL_MS', 5 * 60_000);
const MAX_PENDING_PER_SENDER = 5;
const ALLOWED_MIME = new Set(['image/jpeg', 'image/webp', 'image/png']);

const images = new Map(); // id -> { from, to, mime, data, expiresAt }

function pendingFrom(socketId) {
  let count = 0;
  for (const img of images.values()) if (img.from === socketId) count++;
  return count;
}

/** Returns { id } on success or { error } when the upload is refused. */
function store(from, to, { mime, data } = {}) {
  if (!ALLOWED_MIME.has(mime)) return { error: 'unsupported' };
  if (!Buffer.isBuffer(data) || data.length === 0) return { error: 'empty' };
  if (data.length > MAX_IMAGE_BYTES) return { error: 'too_large' };
  if (pendingFrom(from) >= MAX_PENDING_PER_SENDER) return { error: 'too_many' };

  const id = crypto.randomBytes(16).toString('hex');
  images.set(id, { from, to, mime, data, expiresAt: Date.now() + UNOPENED_TTL_MS });
  return { id };
}

/**
 * Hands the image to its intended viewer and forgets it. `isPaired` guards
 * against an id being replayed after the conversation has moved on.
 */
function take(id, viewerId, isPaired) {
  const img = images.get(id);
  if (!img || img.to !== viewerId) return null;
  images.delete(id);
  if (img.expiresAt < Date.now() || !isPaired(img.from, viewerId)) return null;
  return img;
}

/** Drops every pending image to or from this socket. Returns the dropped records. */
function purgeFor(socketId) {
  const dropped = [];
  for (const [id, img] of images) {
    if (img.from === socketId || img.to === socketId) {
      images.delete(id);
      dropped.push({ id, ...img });
    }
  }
  return dropped;
}

function sweepExpired() {
  const now = Date.now();
  const expired = [];
  for (const [id, img] of images) {
    if (img.expiresAt < now) {
      images.delete(id);
      expired.push({ id, ...img });
    }
  }
  return expired;
}

module.exports = { store, take, purgeFor, sweepExpired, MAX_IMAGE_BYTES };
