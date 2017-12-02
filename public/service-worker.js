"use strict";

function setOfCachedUrls(e) {
    return e.keys().then(function(e) {
        return e.map(function(e) {
            return e.url
        })
    }).then(function(e) {
        return new Set(e)
    })
}
var precacheConfig = [
    "index.html",
    "static/css/main.zemuldo.css",
    "static/js/main.zemuldo.js",
    "static/media/flags.zemuldo.png",
    "static/media/icons.zemuldo.eot",
    "static/media/icons.zemuldo.svg",
    "static/media/icons.zemuldo.ttf",
    "static/media/icons.zemuldo.woff",
    "static/media/icons.zemuldo.woff2",
],
    cacheName = "sw-precache-v3-sw-precache-webpack-plugin-" + (self.registration ? self.registration.scope : ""),
    ignoreUrlParametersMatching = [/^utm_/],
    addDirectoryIndex = function(e, t) {
        var n = new URL(e);
        return "/" === n.pathname.slice(-1) && (n.pathname += t), n.toString()
    },
    cleanResponse = function(e) {
        return e.redirected ? ("body" in e ? Promise.resolve(e.body) : e.blob()).then(function(t) {
            return new Response(t, {
                headers: e.headers,
                status: e.status,
                statusText: e.statusText
            })
        }) : Promise.resolve(e)
    },
    createCacheKey = function(e, t, n, r) {
        var a = new URL(e);
        return r && a.pathname.match(r) || (a.search += (a.search ? "&" : "") + encodeURIComponent(t) + "=" + encodeURIComponent(n)), a.toString()
    },
    isPathWhitelisted = function(e, t) {
        if (0 === e.length) return !0;
        var n = new URL(t).pathname;
        return e.some(function(e) {
            return n.match(e)
        })
    },
    stripIgnoredUrlParameters = function(e, t) {
        var n = new URL(e);
        return n.hash = "", n.search = n.search.slice(1).split("&").map(function(e) {
            return e.split("=")
        }).filter(function(e) {
            return t.every(function(t) {
                return !t.test(e[0])
            })
        }).map(function(e) {
            return e.join("=")
        }).join("&"), n.toString()
    },
    hashParamName = "_sw-precache",
    urlsToCacheKeys = new Map(precacheConfig.map(function(e) {
        var t = e[0],
            n = e[1],
            r = new URL(t, self.location),
            a = createCacheKey(r, hashParamName, n, /\.\w{8}\./);
        return [r.toString(), a]
    }));
self.addEventListener('install', function(event) {
    // Put `offline.html` page into cache
    var offlineRequest = new Request('offline.html');
    event.waitUntil(
        fetch(offlineRequest).then(function(response) {
            return caches.open('offline')
                .then(function(cache) {
                return cache.put(offlineRequest, response);
            })
                .catch(function () {

                })

        })
    );
}), self.addEventListener("activate", function(e) {
    var t = new Set(urlsToCacheKeys.values());
    e.waitUntil(caches.open(cacheName).then(function(e) {
        return e.keys().then(function(n) {
            return Promise.all(n.map(function(n) {
                if (!t.has(n.url)) return e.delete(n)
            }))
        })
    }).then(function() {
        return self.clients.claim()
    }).catch(function () {

    }))
}), self.addEventListener("fetch", function(e) {
    if ("GET" === e.request.method) {
        var t, n = stripIgnoredUrlParameters(e.request.url, ignoreUrlParametersMatching);
        t = urlsToCacheKeys.has(n);
        t || (n = addDirectoryIndex(n, "index.html"), t = urlsToCacheKeys.has(n));
        !t && "navigate" === e.request.mode && isPathWhitelisted(["^(?!\\/__).*"], e.request.url) && (n = new URL("https://zemuldo.co/index.html", self.location).toString(), t = urlsToCacheKeys.has(n)), t && e.respondWith(caches.open(cacheName).then(function(e) {
            return e.match(urlsToCacheKeys.get(n))
                .then(function(e) {
                if (e) return e;
                throw Error("The cached response that was expected is missing.")
            })
                .catch(function () {

                })
        }).catch(function(t) {
            return console.warn('Couldn\'t serve response for "%s" from cache: %O', e.request.url, t), fetch(e.request)
        }))
    }
});