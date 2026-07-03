// PUNTOFLIX Service Worker v3 - Network First (siempre busca actualizaciones)
const CACHE='puntoflix-v3';

self.addEventListener('install',e=>{
  self.skipWaiting(); // Activar inmediatamente la nueva versión
});

self.addEventListener('activate',e=>{
  e.waitUntil(
    caches.keys().then(keys=>Promise.all(
      keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)) // Borrar caches viejos
    )).then(()=>self.clients.claim())
  );
});

self.addEventListener('fetch',e=>{
  const req=e.request;
  // Para el HTML y JS principal: SIEMPRE buscar de la red primero (network-first)
  if(req.mode==='navigate'||req.url.includes('index.html')||req.url.endsWith('/')){
    e.respondWith(
      fetch(req).then(res=>{
        const copy=res.clone();
        caches.open(CACHE).then(c=>c.put(req,copy));
        return res;
      }).catch(()=>caches.match(req)) // Si no hay red, usar cache
    );
    return;
  }
  // Para todo lo demás: red primero, cache de respaldo
  e.respondWith(
    fetch(req).catch(()=>caches.match(req))
  );
});
