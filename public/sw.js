/*
 Copyright 2016 Google Inc. All Rights Reserved.
 Licensed under the Apache License, Version 2.0 (the "License");
 you may not use this file except in compliance with the License.
 You may obtain a copy of the License at
     http://www.apache.org/licenses/LICENSE-2.0
 Unless required by applicable law or agreed to in writing, software
 distributed under the License is distributed on an "AS IS" BASIS,
 WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 See the License for the specific language governing permissions and
 limitations under the License.
*/
const buildID='2017-12-14';
// Names of the two caches used in this version of the service worker.
// Change to v2, etc. when you update any of the local resources, which will
// in turn trigger the install event again.
const CACHENAME = 'sw-'+buildID+'-precache';
const RUNTIME = 'sw-'+buildID+'-runtime';

// A list of local resources we always want to be cached.
const FILES = [
    "index.html",
    'manifest.json',
    'static/img/icons/icon.png',
    "static/css/"+buildID+"main.zemuldo.css",
    "static/js/"+buildID+"main.zemuldo.js",
    "static/media/"+buildID+"flags.zemuldo.png",
    "static/media/"+buildID+"icons.zemuldo.eot",
    "static/media/"+buildID+"icons.zemuldo.svg",
    "static/media/"+buildID+"icons.zemuldo.ttf",
    "static/media/"+buildID+"icons.zemuldo.woff",
    "static/media/"+buildID+"icons.zemuldo.woff2",
];

var BLACKLIST = [
    '/gen_204\?',
    '/async/',
    '/complete/',
];


self.addEventListener('install', function(event) {
    event.waitUntil(caches.open(CACHENAME).then(function(cache) {
        return cache.addAll(FILES);
    }));
});

self.addEventListener('activate', function(event) {
    return event.waitUntil(caches.keys().then(function(keys) {
        return Promise.all(keys.map(function(k) {
            if (k != CACHENAME && k.indexOf('newtab-static-') == 0) {
                return caches.delete(k);
            } else {
                return Promise.resolve();
            }
        }));
    }));
});

self.addEventListener('fetch', function(event) {
    event.respondWith(
        caches.match(event.request).then(function(response) {
            if (response) {
                return response;
            }

            return fetch(event.request).then(function(response) {
                var shouldCache = response.ok;

                for (var i = 0; i < BLACKLIST.length; ++i) {
                    var b = new RegExp(BLACKLIST[i]);
                    if (b.test(event.request.url)) {
                        shouldCache = false;
                        break;
                    }
                }

                if (event.request.method == 'POST') {
                    shouldCache = false;
                }

                if (shouldCache) {
                    return caches.open(CACHENAME).then(function(cache) {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                } else {
                    return response;
                }
            });
        })
    );
});



if (!Cache.prototype.add) {

    Cache.prototype.add = function add(request) {
        return this.addAll([request]);
    };
}

if (!Cache.prototype.addAll) {

    Cache.prototype.addAll = function addAll(requests) {
        var cache = this;

        function NetworkError(message) {
            this.name = 'NetworkError';
            this.code = 19;
            this.message = message;
        }
        NetworkError.prototype = Object.create(Error.prototype);

        return Promise.resolve()
            .then(function() {
                if (arguments.length < 1) throw new TypeError();

                requests = requests.map(function(request) {
                    if (request instanceof Request) {
                        return request;
                    } else {
                        return String(request);              }
                });

                return Promise.all(requests.map(function(request) {
                    if (typeof request === 'string') {
                        request = new Request(request);
                    }

                    return fetch(request.clone());
                }));
            })
            .then(function(responses) {
                return Promise.all(responses.map(function(response, i) {
                    return cache.put(requests[i], response);
                }));
            })
            .then(function() {
                return undefined;
            });
    };
}

if (!CacheStorage.prototype.match) {

    CacheStorage.prototype.match = function match(request, opts) {
        var caches = this;
        return caches.keys().then(function(cacheNames) {
            var match;
            return cacheNames.reduce(function(chain, cacheName) {
                return chain.then(function() {
                    return match || caches.open(cacheName).then(function(cache) {
                        return cache.match(request, opts);
                    }).then(function(response) {
                        match = response;
                        return match;
                    });
                });
            }, Promise.resolve());
        });
    };
}