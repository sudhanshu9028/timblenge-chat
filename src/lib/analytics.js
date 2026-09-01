/**
 * The single place events reach GA4.
 *
 * Two rules this file exists to enforce:
 *
 * 1. Event *names* are a fixed vocabulary; anything variable goes in the
 *    parameters. GA4 allows 500 distinct event names per property and then
 *    silently drops new ones, so building names by interpolation (the old
 *    `footer_${label}` pattern) burns that budget for nothing.
 * 2. Every event carries platform and attribution without each caller having
 *    to remember.
 */

import { getAttribution } from './attribution';

/**
 * Send an event to GA4.
 *
 * @param {string} name   snake_case, from the vocabulary below
 * @param {object} [params] event parameters
 */
export function track(name, params = {}) {
  if (typeof window === 'undefined') return;
  if (typeof window.gtag !== 'function') return;

  try {
    window.gtag('event', name, {
      platform: window.innerWidth <= 768 ? 'mweb' : 'web',
      ...getAttribution(),
      ...params,
    });
  } catch {
    // Analytics must never take the page down with it.
  }
}

/**
 * The event vocabulary. Import these rather than typing strings — a typo in a
 * literal creates a brand new event name that quietly splits your funnel.
 *
 * NOTE: parameters only appear in GA4 reports once registered as custom
 * dimensions in the GA4 UI. Register at least: partner_type, duration_sec,
 * message_count, src, medium, campaign, ref_host.
 */
export const EVENTS = {
  // Entry
  CONSENT_SHOWN: 'consent_shown',
  CONSENT_COMPLETED: 'consent_completed',

  // Matching
  QUEUE_JOINED: 'queue_joined',
  MATCH_HUMAN: 'match_human',
  MATCH_BOT: 'match_bot',
  BOT_REPLACED: 'bot_replaced',

  // Depth
  FIRST_MESSAGE_SENT: 'first_message_sent',
  MESSAGES_5: 'messages_5',
  NEXT_CLICKED: 'next_clicked',

  // Exit
  CHAT_ENDED: 'chat_ended',

  // Retention
  RECONNECT_REQUESTED: 'reconnect_requested',
  RECONNECT_SUCCESS: 'reconnect_success',
  PUSH_PROMPT_SHOWN: 'push_prompt_shown',
  PUSH_SUBSCRIBED: 'push_subscribed',
  PUSH_DENIED: 'push_denied',

  // Features
  GAME_STARTED: 'game_started',
  GAME_COMPLETED: 'game_completed',
  RIDDLE_SOLVED: 'riddle_solved',
  PRIME_TIME_CLICK: 'prime_time_click',

  // Navigation
  NAV_CLICK: 'nav_click',
  FOOTER_CLICK: 'footer_click',
  CTA_CLICK: 'cta_click',
};
