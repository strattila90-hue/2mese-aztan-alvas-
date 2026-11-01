const C="mesevar-v32";
const F=["./","index.html","stories.js","stories-uj.js","stories-3.js","stories-hosszu.js","stories-hosszu2.js","stories-mazsola.js","stories-sarkany2.js","stories-grimm.js","stories-stilus.js","alkoto.js","qr.js","covers.js","images.js","debug.js","config.js","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(C);await c.addAll(F);})());self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim()})()));
// Cache-first: azonnal tölt, háttérben frissít
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET"||q.url.includes("version.json"))return;
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(m=>{
  const n=fetch(q).then(r=>{if(r&&(r.ok||r.type==="opaque")){const cl=r.clone();caches.open(C).then(x=>x.put(q,cl))}return r}).catch(()=>m||caches.match("index.html"));
  return m||n}))});
