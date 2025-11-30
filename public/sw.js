// Service Worker for Mental Wellness App
const CACHE_NAME = 'mental-wellness-v1.0';
const urlsToCache = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Install event
self.addEventListener('install', (event) => {
  console.log('🚀 Service Worker installed');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('📦 Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('🎯 Service Worker activated');
  // Remove old caches
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('🗑️ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - Serve from cache first, then network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version or fetch from network
        return response || fetch(event.request);
      }
    )
  );
});

// Background Sync for daily reminders
self.addEventListener('sync', (event) => {
  if (event.tag === 'daily-reminder') {
    console.log('⏰ Background sync for daily reminder');
    event.waitUntil(showDailyReminder());
  }
});

// Background periodic sync (for daily reminders)
self.addEventListener('periodicsync', (event) => {
  if (event.tag === 'daily-mental-reminder') {
    console.log('🔄 Periodic sync for daily reminder');
    event.waitUntil(showDailyReminder());
  }
});

// Show daily reminder notification
const showDailyReminder = async () => {
  const options = {
    body: 'Don\'t forget to log your mood and journal today! 📝',
    icon: '/images/icon-192x192.png',
    badge: '/images/icon-72x72.png',
    vibrate: [200, 100, 200],
    tag: 'daily-reminder',
    requireInteraction: true,
    actions: [
      { action: 'open', title: 'Open App' },
      { action: 'close', title: 'Close' }
    ]
  };

  return self.registration.showNotification('🧠 Mental Wellness Reminder', options);
};

// Handle notification clicks
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'open') {
    // Open the app
    event.waitUntil(
      clients.matchAll({ type: 'window' }).then((windowClients) => {
        // Check if app is already open
        for (let client of windowClients) {
          if (client.url.includes(self.location.origin) && 'focus' in client) {
            return client.focus();
          }
        }
        // Open new window if not already open
        if (clients.openWindow) {
          return clients.openWindow('/');
        }
      })
    );
  }
});

// Handle push notifications
self.addEventListener('push', (event) => {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/images/icon-192x192.png',
      badge: '/images/icon-72x72.png',
      vibrate: [200, 100, 200],
      data: data.url
    };

    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});