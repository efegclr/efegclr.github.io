
const CACHE_NAME = 'promil-pro-v3';
const OFFLINE_URL = '/offline.html';

const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/offline.html',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Outfit:wght@300;400;500;600;700&display=swap'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME) return caches.delete(key);
      })
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Sadece navigasyon (sayfa yenileme/gitme) isteklerinde offline sayfasını göster
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(OFFLINE_URL);
      })
    );
    return;
  }

  // Diğer istekler için (JSON, resim vb.) önce cache'e bak
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request).catch(() => {
        // Eğer bir JSON dosyası (manifest gibi) bulunamazsa boş veya hata döndürme, 
        // HTML döndürmesini engellemiş oluyoruz.
        return null; 
      });
    })
  );
});
