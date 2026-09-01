/**
 * Client-side copy of the AI's display name.
 *
 * The server keeps its own constant in `src/server/aiBot.js` because that file
 * is required directly by `server.js` (plain CommonJS, outside the Next build)
 * and can't import from here. Keep the two in sync.
 */
export const AI_DISPLAY_NAME = 'Anoniz AI';
