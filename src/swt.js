const CACHE_NAME = "pwa-cache-v1";
const ASSETS = [
    "/",
    "/page/index.html",
    "/page/registerpage.html",
    "/page/base.html",
    "/css/loginpage.css",
    "/css/registerpage.css",
    "/css/styles.css",
    "/js/loginpage.js",
    "/js/registerpage.js",
    "/js/script.js",
    "/assets/OperationNapalm-nRBWO.ttf"
];

// Падзея ўстаноўкі (install)
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Кэшаванне рэсурсаў...");
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting(); // Актываваць новы Service Worker адразу
});

// Падзея актывацыі (activate)
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log("Выдаляю стары кэш:", cacheName);
                        return caches.delete(cacheName); // Выдаліць старыя кэшы
                    }
                })
            );
        })
    );
    self.clients.claim(); // Забяспечыць актывацыю новага SW без перазагрузкі
});

// Падзея атрымання рэсурсаў (fetch)
self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches.match(event.request).then((cachedResponse) => {
            const fetchPromise = fetch(event.request).then((networkResponse) => {
                // Абнаўляем кэш пасля атрымання адказу ад сервера
                if (networkResponse && event.request.url.indexOf("http") === 0) {
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                    });
                }
                return networkResponse;
            });

            // Вяртаем адказ з кэша, калі ёсць, але таксама абнаўляем яго ў фону
            return cachedResponse || fetchPromise;
        })
    );
});

// Падзея для абнаўлення Service Worker
self.addEventListener('message', (event) => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting(); // Прыняць новы Service Worker
    }
});
