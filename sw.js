/* Service worker v9: se actualiza solo. Red primero para HTML/JS/CSS (con caché de respaldo), caché primero para iconos, Leaflet y teselas. */
const VERSION='pesca-v9';
const CACHE=VERSION, TILES='pesca-tiles';
const FILES=['./','index.html','style.css','app.js','nudos.js','modalidades.js','compartir.js','equipo.js','zonapesca.js','perfil.js','manifest.json','icon-192.png','icon-512.png'];
const LEGACY=/^pesca-v[1-8]$/; // versiones antiguas sin recarga automática
const TIMEOUT=4000;

self.addEventListener('install',e=>{
  e.waitUntil((async()=>{
    const c=await caches.open(CACHE);
    await Promise.all(FILES.map(async f=>{
      const r=await fetch(new Request(f,{cache:'reload'}));
      if(!r.ok)throw new Error('No se pudo precargar '+f);
      await c.put(f,r);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate',e=>{
  e.waitUntil((async()=>{
    const keys=await caches.keys();
    const legacy=keys.some(k=>LEGACY.test(k));
    await Promise.all(keys.filter(k=>k!==CACHE&&k!==TILES).map(k=>caches.delete(k)));
    await self.clients.claim();
    // Las páginas abiertas con una versión antigua no saben recargarse: las recargamos una vez.
    if(legacy){const cs=await self.clients.matchAll({type:'window'});cs.forEach(c=>{try{c.navigate(c.url)}catch(_){}})}
  })());
});

self.addEventListener('message',e=>{if(e.data==='version')e.source&&e.source.postMessage({version:VERSION})});

function conTimeout(p,ms){return new Promise((ok,ko)=>{const t=setTimeout(()=>ko(new Error('timeout')),ms);p.then(r=>{clearTimeout(t);ok(r)},err=>{clearTimeout(t);ko(err)})})}

async function redPrimero(req,esNav){
  const c=await caches.open(CACHE);
  const red=fetch(req,{cache:'no-cache'}).then(r=>{if(r.ok){const key=esNav?'index.html':req;c.put(key,r.clone())}return r});
  try{return await conTimeout(red,TIMEOUT)}
  catch(_){
    const enCache=await c.match(esNav?'index.html':req,{ignoreSearch:true})||(esNav?await c.match('./'):null);
    if(enCache)return enCache;
    return red; // sin caché: esperamos a la red aunque tarde
  }
}
async function cachePrimero(req,nombre){
  const c=await caches.open(nombre);const r=await c.match(req,{ignoreSearch:nombre===CACHE});if(r)return r;
  const n=await fetch(req);if(n.ok||n.type==='opaque')c.put(req,n.clone());return n;
}

self.addEventListener('fetch',e=>{
  const req=e.request;if(req.method!=='GET')return;
  const u=new URL(req.url);
  if(u.origin===location.origin){
    const esNav=req.mode==='navigate';
    if(esNav||/\.(html|js|css|json)$/.test(u.pathname)||u.pathname.endsWith('/'))e.respondWith(redPrimero(req,esNav));
    else e.respondWith(cachePrimero(req,CACHE)); // iconos e imágenes
    return;
  }
  if(u.host==='unpkg.com')return e.respondWith(cachePrimero(req,CACHE));
  if(/(^|\.)tile\.openstreetmap\.org$/.test(u.host))return e.respondWith(cachePrimero(req,TILES));
  // APIs (marea, Nominatim): siempre red, sin caché
});
