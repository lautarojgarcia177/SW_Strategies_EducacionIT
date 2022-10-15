function fetchAndCache(request) {
    return fetch(request).then(online_res => {
        caches.open(CACHE_DINAMICO_NOMBRE).then(cacheDinamico => {
            cacheDinamico.put(request,online_res);
        });
        return online_res.clone();
    });
}

// Primero cache, si no esta recurrir a la red
function cacheFirst(request) {
    return caches.match(request).then(matchRequest => {
        if(matchRequest) {
            return matchRequest;
        } else {
            return fetchAndCache(request);
        }
    });
}

// Primero red, si no lo encuentra recurrir al cache
function networkFirst(request) {
    return fetchAndCache(request).catch(function() {
        return caches.match(request);
    });
};

// Obsoleto mientras se revalida
// La primera vez la trae de la red y cachea la respuesta,
// despues las proximas las trae del cache y luego en background actualiza el cache
// desde la red
function staleWhileRevalidate(request) {
    return caches.match(request).then(matchRequest => {
        if(matchRequest) {
            fetch(request).then(online_res => {
                caches.open(CACHE_DINAMICO_NOMBRE).then(cacheDinamico => {
                    cacheDinamico.put(request,online_res);
                });
            });
            return matchRequest;
        } else {
            return fetchAndCache(request);
        }
    });
}