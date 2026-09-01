/**
 * Web push subscription, from the browser side.
 *
 * This is the only mechanism that can reach a visitor after they close the
 * tab, which makes it the one real retention lever available to a product
 * with no accounts.
 */

const PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const raw = window.atob(base64);
  return Uint8Array.from([...raw].map((c) => c.charCodeAt(0)));
}

/** Is this browser on iOS (including iPadOS, which reports as Mac + touch)? */
function isIOS() {
  if (typeof navigator === 'undefined') return false;
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) ||
    (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
  );
}

/** Running as an installed PWA rather than a browser tab? */
function isStandalone() {
  if (typeof window === 'undefined') return false;
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    window.navigator.standalone === true
  );
}

/**
 * What can this browser actually do right now?
 *
 * @returns {'unsupported'|'needs-install'|'granted'|'denied'|'available'}
 *   needs-install is the iOS case: Safari only allows push for PWAs added to
 *   the home screen, so offering a button there would do nothing at all.
 */
export function getPushCapability() {
  if (typeof window === 'undefined') return 'unsupported';
  if (!PUBLIC_KEY) return 'unsupported';
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    return isIOS() && !isStandalone() ? 'needs-install' : 'unsupported';
  }
  if (isIOS() && !isStandalone()) return 'needs-install';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return 'available';
}

/**
 * Register the worker, ask permission, subscribe, and tell the server.
 * @returns {Promise<'subscribed'|'denied'|'unsupported'|'error'>}
 */
export async function subscribeToPush() {
  if (getPushCapability() === 'unsupported') return 'unsupported';

  try {
    const registration = await navigator.serviceWorker.register('/sw.js');
    await navigator.serviceWorker.ready;

    const permission =
      Notification.permission === 'default'
        ? await Notification.requestPermission()
        : Notification.permission;

    if (permission !== 'granted') return 'denied';

    // Reuse an existing subscription rather than churning endpoints.
    const subscription =
      (await registration.pushManager.getSubscription()) ||
      (await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(PUBLIC_KEY),
      }));

    const res = await fetch('/api/push/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        subscription,
        // Lets the server keep quiet hours local to this person.
        tzOffset: new Date().getTimezoneOffset(),
      }),
    });

    return res.ok ? 'subscribed' : 'error';
  } catch {
    return 'error';
  }
}
