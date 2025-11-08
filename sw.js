const CACHE_NAME = 'quranic-reciter-v9';
// Add all essential app shell and core script files to the cache list.
// This ensures the app can load and function fully offline after the first visit.
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/index.tsx',
  '/App.tsx',
  '/types.ts',
  '/Quran.tsx',
  '/constants/surahNames.ts',
  '/constants/settings.ts',
  '/data/en_qarai.ts',
  '/data/en_sahih.ts',
  '/data/en_buckwalter.ts',
  '/services/quranService.ts',
  '/services/geminiService.ts',
  '/services/dbService.ts',
  '/utils/audioUtils.ts',
  '/utils/textComparison.ts',
  '/hooks/useLocalStorage.ts',
  '/hooks/useTheme.ts',
  '/hooks/usePwaInstall.ts',
  '/hooks/useSpeechRecognition.ts',
  '/hooks/useLanguage.ts',
  '/context/LanguageContext.tsx',
  '/i18n/en.ts',
  '/i18n/ar.ts',
  '/i18n/locales.ts',
  // Components
  '/components/Header.tsx',
  '/components/SurahList.tsx',
  '/components/SurahDetail.tsx',
  '/components/BookmarksView.tsx',
  '/components/SettingsView.tsx',
  '/components/Player.tsx',
  '/components/AyahView.tsx',
  '/components/PlaybackControls.tsx',
  '/components/PlaybackSettingsModal.tsx',
  '/components/SettingsPanel.tsx',
  '/components/Toast.tsx',
  '/components/learning/RecitationPractice.tsx',
  '/components/icons/FeatureIcons.tsx',
  '/components/icons/PlaybackIcons.tsx',
  // External assets
  'https://cdn.tailwindcss.com',
  'https://fonts.googleapis.com/css2?family=Amiri+Quran&family=Noto+Naskh+Arabic:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap',
  'https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,400,0,0'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        // Use addAll to fetch and cache all the specified resources.
        // It's an atomic operation - if any file fails, the entire install step fails.
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

self.addEventListener('fetch', (event) => {
  // Let the browser handle non-GET requests and API calls to Google.
  // The app uses IndexedDB for audio caching, so we don't want the service worker to interfere.
  if (event.request.method !== 'GET' || event.request.url.includes('googleapis')) {
    return;
  }

  // Use a cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Not in cache - fetch from network, then cache it for next time
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
              return response;
            }

            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                 cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            // Delete old caches
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  return self.clients.claim();
});