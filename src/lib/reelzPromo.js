/**
 * Reelz cross-promotion, shown to visitors in India only.
 *
 * Reelz (reelz.in) is the team's Hindi-first AI reel maker. Anoniz promotes it
 * in three places: the end-of-chat panel, under the homepage hero, and at the
 * end of blog posts. Everyone outside India sees Anoniz exactly as before.
 *
 * Targeting is by the device's time zone, not by IP. An inline script in the
 * root layout (REELZ_GEO_SCRIPT) sets <html data-rz="in"> before first paint
 * when the zone is India's. That does two things:
 *
 * - CSS can reserve the homepage slot's height for Indian visitors from the
 *   very first frame, so the banner arriving after hydration shifts nothing
 *   (CLS is tracked in VitalsDesk).
 * - The banners and their links render in the browser only. The server HTML
 *   holds an empty, hidden slot, so crawlers fetching the page see no link to
 *   Reelz, and a crawler rendering from outside India gets the same page as
 *   any other visitor from there. That is geo-targeting, not cloaking.
 *
 * Asia/Calcutta is the zone's pre-2008 name, still reported by some older
 * devices. Sri Lanka shares the +5:30 offset under its own name, so it is not
 * included.
 */

export const REELZ_GEO_SCRIPT =
  "try{var z=Intl.DateTimeFormat().resolvedOptions().timeZone;if(z==='Asia/Kolkata'||z==='Asia/Calcutta')document.documentElement.setAttribute('data-rz','in')}catch(e){}";

/** Credits Reelz gives every new account. A 15 s Standard reel costs 25. */
export const REELZ_SIGNUP_CREDITS = 25;

const REELZ_CREATE_URL = 'https://reelz.in/create';

/** True when the geo script flagged this visitor. Client-side only. */
export function isReelzAudience() {
  return (
    typeof document !== 'undefined' && document.documentElement.getAttribute('data-rz') === 'in'
  );
}

/**
 * Hidden fields for a GET form that submits to Reelz's create page. Reelz
 * reads `prompt` and pre-fills its form with it.
 */
export function reelzTracking(slot, banner) {
  return {
    utm_source: 'anoniz',
    utm_medium: 'banner',
    utm_campaign: 'reelz_launch',
    utm_content: `${slot}-${banner}`,
  };
}

export const REELZ_FORM_ACTION = REELZ_CREATE_URL;

/** A tracked link into Reelz's create page. */
export function reelzUrl(slot, banner) {
  const url = new URL(REELZ_CREATE_URL);
  Object.entries(reelzTracking(slot, banner)).forEach(([key, value]) =>
    url.searchParams.set(key, value)
  );
  return url.toString();
}
