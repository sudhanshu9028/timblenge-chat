// Client helpers for view-once photos. See src/server/viewOnceImages.js.

const MAX_EDGE = 1600;
const QUALITY = 0.82;

/**
 * Re-encodes the picked file to a JPEG of at most MAX_EDGE px. Going through a
 * canvas also strips EXIF, so a phone photo doesn't carry its GPS location to
 * a stranger.
 *
 * @returns {Promise<{ mime: string, data: ArrayBuffer }>}
 */
export async function prepareImage(file) {
  const bitmap = await createImageBitmap(file, { imageOrientation: 'from-image' });
  const scale = Math.min(1, MAX_EDGE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d').drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const blob = await new Promise((resolve, reject) =>
    canvas.toBlob(
      (b) => (b ? resolve(b) : reject(new Error('encode failed'))),
      'image/jpeg',
      QUALITY
    )
  );
  canvas.width = canvas.height = 0;
  return { mime: 'image/jpeg', data: await blob.arrayBuffer() };
}

/** Emits with an ack, rejecting if the server doesn't answer in time. */
export function emitWithAck(socket, event, payload, timeoutMs = 20_000) {
  return new Promise((resolve, reject) => {
    socket
      .timeout(timeoutMs)
      .emit(event, payload, (err, res) => (err ? reject(err) : resolve(res)));
  });
}
