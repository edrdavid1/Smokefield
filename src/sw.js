const CACHE_NAME = "pwa-cache-v1";
const ASSETS = [
    "/",
    "/src/page/index.html",
    "/src/page/registerpage.html",
    "/src/page/base.html",
    "/src/css/loginpage.css",
    "/src/css/registerpage.css",
    "/src/css/styles.css",
    "/src/js/loginpage.js",
    "/src/js/registerpage.js",
    "/src/js/script.js",
    "/src/assets/OperationNapalm-nRBWO.ttf"
];

// Усталёўка Service Worker
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("Кэшаванне рэсурсаў...");
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// Перанакіраванне на loginpage.html
self.addEventListener("fetch", (event) => {
    if (event.request.mode === "navigate" && event.request.url.endsWith("/")) {
        event.respondWith(caches.match("/page/loginpage.html"));
    } else {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request);
            })
        );
    }
});

// Ачыстка старых кэшаў
self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cache) => {
                    if (cache !== CACHE_NAME) {
                        console.log("Выдаляю стары кэш:", cache);
                        return caches.delete(cache);
                    }
                })
            );
        })
    );
    self.clients.claim();
});
