// Anoniz service worker — web push only.
//
// Deliberately minimal: it does not cache or intercept fetches, so it can
// never serve a stale build. Its whole job is to receive pushes when the tab
// is closed and to bring the user back to a chat when they tap one.

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('push', (event) => {
  let payload = {};
  try {
    payload = event.data ? event.data.json() : {};
  } catch {
    payload = {};
  }

  const title = payload.title || 'Anoniz';
  const options = {
    body: payload.body || 'Someone might be waiting.',
    icon: '/logo.png',
    badge: '/logo.png',
    // A tag means a second push replaces the first rather than stacking.
    tag: payload.tag || 'anoniz',
    data: { url: payload.url || '/chat' },
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = event.notification.data?.url || '/chat';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      // Reuse an open Anoniz tab rather than piling up new ones.
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(target);
          return client.focus();
        }
      }
      return self.clients.openWindow(target);
    })
  );
});
