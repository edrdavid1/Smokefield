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
        event.respondWith(caches.match("/page/index.html"));
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
