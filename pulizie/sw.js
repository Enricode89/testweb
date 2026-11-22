// Pulizie Antrum: notifiche (nuova pulizia, annullata, spostata). Tocco → apre la pagina delle pulizie.
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', e => e.waitUntil(self.clients.claim()));
self.addEventListener('push', e => {
  let d = {};
  try { d = e.data ? e.data.json() : {}; } catch (_) { d = { title: 'Antrum · Pulizie', body: e.data ? e.data.text() : '' }; }
  e.waitUntil(self.registration.showNotification(d.title || 'Antrum · Pulizie', {
    body: d.body || '', tag: d.tag || 'pulizie', renotify: true, icon: '/checkin/icon-192.png', badge: '/checkin/icon-192.png',
    data: { url: d.url || '/pulizie/' },
  }));
});
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const url = (e.notification.data && e.notification.data.url) || '/pulizie/';
  e.waitUntil(self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(l => {
    const c = l.find(x => x.url.includes('/pulizie/'));
    if (c) { c.navigate(url); return c.focus(); }
    return self.clients.openWindow(url);
  }));
});
