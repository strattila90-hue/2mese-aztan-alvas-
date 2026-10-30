const C="mesevar-v5",QR="https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";
const F=["./","index.html","stories.js","stories-uj.js","stories-3.js","manifest.json","icon-192.png","icon-512.png"];
self.addEventListener("install",e=>{e.waitUntil((async()=>{const c=await caches.open(C);await c.addAll(F);try{await c.put(QR,await fetch(QR,{mode:"no-cors"}))}catch(_){}})());self.skipWaiting()});
self.addEventListener("activate",e=>e.waitUntil((async()=>{for(const k of await caches.keys())if(k!==C)await caches.delete(k);await self.clients.claim()})()));
// Cache-first: azonnal tölt, háttérben frissít
self.addEventListener("fetch",e=>{const q=e.request;if(q.method!=="GET")return;
 e.respondWith(caches.match(q,{ignoreSearch:true}).then(m=>{
  const n=fetch(q).then(r=>{if(r&&(r.ok||r.type==="opaque")){const cl=r.clone();caches.open(C).then(x=>x.put(q,cl))}return r}).catch(()=>m||caches.match("index.html"));
  return m||n}))});
