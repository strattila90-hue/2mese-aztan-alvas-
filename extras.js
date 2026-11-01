// Altató háttérhangok, Esti rutin és Matricagyűjtő
(function(){
const Q=id=>document.getElementById(id);
const LS={get(k,d){try{const v=JSON.parse(localStorage.getItem(k));return v==null?d:v}catch(e){return d}},set(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){}}};
const dk=d=>d.getFullYear()+"-"+String(d.getMonth()+1).padStart(2,"0")+"-"+String(d.getDate()).padStart(2,"0");
const today=()=>dk(new Date());
const shuf=a=>[...a].sort(()=>Math.random()-.5);
const ST={done:LS.get("doneS",{}),days:LS.get("mDays",{}),rut:LS.get("rutS",{})};

// ---------- hang
let ac=null;const actx=()=>ac||(ac=new(window.AudioContext||window.webkitAudioContext)());
function chime(notes,step,vol){try{const c=actx();(notes||[523,659,784,1047]).forEach((f,i)=>{const o=c.createOscillator(),g=c.createGain(),t=c.currentTime+i*(step||.14);o.type="sine";o.frequency.value=f;o.connect(g);g.connect(c.destination);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(vol||.18,t+.02);g.gain.exponentialRampToValueAtTime(.001,t+.55);o.start(t);o.stop(t+.6)})}catch(e){}}
function sayX(t){try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="hu-HU";u.rate=+Q("rate").value||.85;const v=voices[+Q("voice").value];if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}

// ---------- altató háttérhangok (a telefon állítja elő, nincs hozzá fájl)
const AMBS=[["","Ki"],["eso","🌧️ Eső"],["tenger","🌊 Tenger"],["szel","🍃 Szél"],["tucsok","🦗 Tücsök"]];
const amb={kind:"",master:null,src:[],tm:[],tick:null};let ambVol=+LS.get("ambVol",.4);
const saAt=()=>(typeof sleepAt!=="undefined")?sleepAt:0;
function ambLevel(){const s=saAt();return s?Math.max(0,Math.min(1,(s-Date.now())/12e4)):1}
function ambClear(){amb.tm.forEach(clearTimeout);amb.tm=[];amb.src.forEach(n=>{try{n.stop&&n.stop()}catch(e){}try{n.disconnect()}catch(e){}});amb.src=[];if(amb.master){try{amb.master.disconnect()}catch(e){}amb.master=null}}
function ambSet(kind){ambClear();clearInterval(amb.tick);amb.kind=kind||"";
 if(kind){try{const c=actx();if(c.state==="suspended")c.resume();
  const m=c.createGain();m.gain.value=0;m.connect(c.destination);amb.master=m;
  const noise=()=>{const b=c.createBuffer(1,c.sampleRate*3,c.sampleRate),d=b.getChannelData(0);for(let i=0;i<d.length;i++)d[i]=Math.random()*2-1;const s=c.createBufferSource();s.buffer=b;s.loop=true;s.start();amb.src.push(s);return s};
  const lfo=(hz,depth,param)=>{const o=c.createOscillator(),g=c.createGain();o.frequency.value=hz;g.gain.value=depth;o.connect(g);g.connect(param);o.start();amb.src.push(o,g)};
  const flt=(type,f,q)=>{const x=c.createBiquadFilter();x.type=type;x.frequency.value=f;if(q)x.Q.value=q;amb.src.push(x);return x};
  const gn=v=>{const g=c.createGain();g.gain.value=v;amb.src.push(g);return g};
  if(kind==="eso"){const n=noise(),h=flt("highpass",900),l=flt("lowpass",7000),g=gn(.55);n.connect(h);h.connect(l);l.connect(g);g.connect(m)}
  else if(kind==="tenger"){const n=noise(),l=flt("lowpass",650),g=gn(.6);n.connect(l);l.connect(g);g.connect(m);lfo(.11,.45,g.gain)}
  else if(kind==="szel"){const n=noise(),b=flt("bandpass",420,.8),g=gn(.6);n.connect(b);b.connect(g);g.connect(m);lfo(.07,.4,g.gain);lfo(.05,220,b.frequency)}
  else if(kind==="tucsok"){const chirp=()=>{if(amb.kind!=="tucsok")return;const f=4200+Math.random()*500,t0=c.currentTime;
    for(let k=0;k<3;k++){const o=c.createOscillator(),g=c.createGain(),t=t0+k*.11;o.type="sine";o.frequency.value=f;o.connect(g);g.connect(m);g.gain.setValueAtTime(0,t);g.gain.linearRampToValueAtTime(.2,t+.02);g.gain.linearRampToValueAtTime(0,t+.07);o.start(t);o.stop(t+.09)}
    amb.tm.push(setTimeout(chirp,900+Math.random()*2200))};chirp();amb.tm.push(setTimeout(chirp,700))}
  m.gain.setTargetAtTime(ambVol*ambLevel(),c.currentTime,.8);
  amb.tick=setInterval(()=>{if(!amb.master)return;const s=saAt();if(s&&Date.now()>=s){ambSet("");return}amb.master.gain.setTargetAtTime(ambVol*ambLevel(),actx().currentTime,.8)},3000)
 }catch(e){amb.kind=""}}
 ambRender()}
function ambRender(){document.querySelectorAll(".ambui").forEach(e=>{e.innerHTML=AMBS.map(a=>`<button class="chip ${amb.kind===a[0]?"on":""}" data-amb="${a[0]}">${a[1]}</button>`).join("")+`<input type="range" class="ambvol" min="0.05" max="1" step="0.05" value="${ambVol}" title="Hangerő" style="width:100%;margin-top:8px;accent-color:var(--pri)">`})}
document.addEventListener("click",e=>{const b=e.target.closest("[data-amb]");if(b)ambSet(b.dataset.amb)});
document.addEventListener("input",e=>{if(e.target.classList.contains("ambvol")){ambVol=+e.target.value;LS.set("ambVol",ambVol);document.querySelectorAll(".ambvol").forEach(x=>{if(x!==e.target)x.value=ambVol});if(amb.master)amb.master.gain.setTargetAtTime(ambVol*ambLevel(),actx().currentTime,.2)}});

// ---------- előzmények / átfedő képernyők
function pushR(h){if(history.state&&history.state.r)history.replaceState({r:1},"","#"+h);else history.pushState({r:1},"","#"+h)}
function popOut(fp){if(!fp){if(history.state&&history.state.r)history.back();else history.replaceState(null,"",location.pathname)}}
let rtm=null;
function closeOv(id,fp){clearInterval(rtm);try{speechSynthesis.cancel()}catch(e){}Q(id).classList.remove("open");document.body.classList.remove("lock");popOut(fp)}
window.extrasPop=()=>["rutin","album"].forEach(id=>{const e=Q(id);if(e&&e.classList.contains("open"))closeOv(id,true)});

function ensureUI(){if(Q("rutin"))return;
 const css=document.createElement("style");css.textContent=`
#rutin,#album{z-index:7}.xtop{position:fixed;top:0;left:var(--sb,0px);right:0;display:flex;align-items:center;gap:8px;padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top));background:var(--bg);z-index:3}.xtop b{flex:1;text-align:center;font-size:18px}
.xbar{position:fixed;left:var(--sb,0px);right:0;bottom:0;display:flex;gap:10px;padding:12px;padding-bottom:calc(12px + env(safe-area-inset-bottom));background:linear-gradient(transparent,var(--bg) 30%);z-index:4}.xbar .chip{min-height:54px;font-size:18px}.xbar .go{margin-left:auto;background:var(--pri);color:#fff}
.xw{max-width:760px;margin:auto;padding:78px 16px 120px}.xs{text-align:center;color:var(--sub);margin:6px 0 12px}.xw h2{text-align:center;margin:6px 0}
.rstars{display:flex;justify-content:center;gap:8px;font-size:34px;margin:4px 0 10px}.rbig{font-size:110px;line-height:1.1;text-align:center;filter:drop-shadow(0 6px 8px #0003)}.rt{font-size:30px;font-weight:800;text-align:center}.rh{text-align:center;color:var(--sub);font-size:19px;margin:6px 0 16px}
.ring{width:190px;height:190px;border-radius:50%;margin:8px auto 14px;display:grid;place-items:center;background:conic-gradient(var(--pri) calc(var(--p)*1%),#0002 0)}.ring i{width:160px;height:160px;border-radius:50%;background:var(--bg);display:grid;place-items:center;font-style:normal;font-size:44px;font-weight:800}
.rcards{display:grid;gap:12px}.rcard{display:flex;align-items:center;gap:14px;border-radius:22px;padding:14px 18px;color:#fff;text-align:left;text-shadow:0 1px 4px #0006;box-shadow:0 4px 12px #0003}.rcard .e{font-size:54px}.rcard b{flex:1;font-size:19px;line-height:1.2}.rcard small{opacity:.9}
.ambui{display:flex;flex-wrap:wrap;gap:8px;justify-content:center}
.week{display:flex;gap:6px;justify-content:center;margin:8px 0 14px}.wd{position:relative;flex:1;max-width:76px;background:var(--card);border-radius:16px;padding:8px 2px;text-align:center}.wd.t{outline:3px solid var(--pri)}.wd small{display:block;color:var(--sub);font-size:12px}.wd span{font-size:26px}.wd i{position:absolute;top:-6px;right:-2px;font-style:normal;font-size:16px}
.sg{display:grid;grid-template-columns:repeat(4,1fr);gap:10px}.sk{border-radius:18px;padding:12px 4px 8px;text-align:center;color:#fff;text-shadow:0 1px 3px #0006;min-height:96px}.sk .e{display:block;font-size:40px;line-height:1.2}.sk small{display:block;font-size:11px;line-height:1.15;margin-top:2px}.sk.lk{background:var(--card);color:var(--sub);text-shadow:none}.sk.lk .e{filter:grayscale(1);opacity:.22}
.bnc{font-size:90px;animation:bnc 1s ease-in-out infinite}@keyframes bnc{50%{transform:scale(1.18) rotate(-6deg)}}
@media(min-width:700px){.sg{grid-template-columns:repeat(6,1fr)}.rcards{grid-template-columns:repeat(3,1fr)}.rcard{flex-direction:column;text-align:center}}`;
 document.head.appendChild(css);
 document.body.insertAdjacentHTML("beforeend",`
<section class="reader" id="rutin"><div class="xtop"><b>🛁 Esti rutin</b><button class="round" data-r="close" title="Bezár">✕</button></div><div class="xw" id="rutinBody"></div><div class="xbar" id="rutinBar"></div></section>
<section class="reader" id="album"><div class="xtop"><button class="chip" data-x="back">← Vissza</button><b>🏅 Matricáim</b><span style="width:56px"></span></div><div class="xw" id="albumBody"></div></section>
<div class="modal" id="stkm"><div class="box"><div class="bnc" id="stke">⭐</div><b>🎉 Új matrica!</b><p id="stkt"></p><button class="chip" data-x="album">🏅 Matricáim</button> <button class="chip" data-x="ok" style="background:var(--pri);color:#fff">Szuper!</button></div></div>`);
 Q("rutin").addEventListener("click",e=>{const b=e.target.closest("[data-r],[data-pick]");if(!b)return;if(b.dataset.pick)return rpick(b.dataset.pick);ract(b.dataset.r)});
 Q("album").addEventListener("click",e=>{const b=e.target.closest("[data-x],[data-sk]");if(!b)return;if(b.dataset.sk){Q("album").classList.remove("open");return open(b.dataset.sk)}closeOv("album")});
 Q("stkm").addEventListener("click",e=>{const b=e.target.closest("[data-x]");if(!b&&e.target.id!=="stkm")return;Q("stkm").classList.remove("open");if(b&&b.dataset.x==="album")openAlbum()})}

// ---------- matricák
window.storyDone=function(id){const s=S.find(x=>x.id===id);if(!s)return;ensureUI();
 ST.days[today()]=true;LS.set("mDays",ST.days);
 if(!s.custom&&!ST.done[id]){ST.done[id]=today();LS.set("doneS",ST.done);
  Q("stke").textContent=s.emoji;Q("stkt").textContent=s.title;Q("stkm").classList.add("open");chime();
  try{const u=new SpeechSynthesisUtterance("Gratulálok! Új matricát kaptál!");u.lang="hu-HU";setTimeout(()=>speechSynthesis.speak(u),600)}catch(e){}}
 window.tiles&&tiles()};
window.albumInfo=()=>{const pub=S.filter(s=>!s.custom);return{got:pub.filter(s=>ST.done[s.id]).length,total:pub.length}};
function streak(){let n=0;const d=new Date();if(!ST.days[dk(d)])d.setDate(d.getDate()-1);while(ST.days[dk(d)]){n++;d.setDate(d.getDate()-1)}return n}
function renderAlbum(){const pub=S.filter(s=>!s.custom),got=pub.filter(s=>ST.done[s.id]).length,N=["V","H","K","Sze","Cs","P","Szo"];
 const wk=[];for(let i=6;i>=0;i--){const d=new Date();d.setDate(d.getDate()-i);const k=dk(d);wk.push(`<div class="wd ${i===0?"t":""}"><small>${N[d.getDay()]}</small><span>${ST.days[k]?"⭐":"○"}</span>${ST.rut[k]?"<i>🛁</i>":""}</div>`)}
 Q("albumBody").innerHTML=`<h2>${got} / ${pub.length} matrica</h2><p class="xs">🔥 ${streak()} napos mesesorozat</p><div class="week">${wk.join("")}</div><p class="xs">Hallgass meg egy mesét a végéig, és kapsz egy matricát!</p>
 <div class="sg">${pub.map(s=>ST.done[s.id]?`<button class="sk" data-sk="${s.id}" style="background:${grad(s)}"><span class="e">${s.emoji}</span><small>${E(s.title)}</small></button>`:`<div class="sk lk"><span class="e">${s.emoji}</span><small>?</small></div>`).join("")}</div>`}
function openAlbum(){ensureUI();pushR("matricak");Q("album").classList.add("open");document.body.classList.add("lock");Q("album").scrollTop=0;renderAlbum()}

// ---------- esti rutin
const R=[{e:"🛁",t:"Fürdés",h:"Pancsolj egy jót, aztán gyere vissza!",s:"Ideje fürdeni! Pancsolj egy jót, aztán gyere vissza."},
 {e:"🦷",t:"Fogmosás",h:"Fel-le, fel-le, körbe-körbe. Két percig!",s:"Fogmosás! Fel-le, fel-le, körbe-körbe. Két percig mosd a fogad!",timer:120},
 {e:"🧸",t:"Pizsama",h:"Bújj a pizsamádba, és vidd a plüssödet is!",s:"Bújj a pizsamádba, és vidd a plüssödet is!"},
 {e:"📖",t:"Esti mese",h:"Válassz egy mesét!",s:"Válassz egy esti mesét!",pick:1},
 {e:"🌙",t:"Jó éjszakát!",h:"Bújj be az ágyba. Válassz altató hangot, ha szeretnél.",s:"Bújj be az ágyba. Jó éjszakát!",fin:1}];
let rs={i:0,list:null},afterStory=false;
function openRutin(i){ensureUI();rs={i:i||0,list:null};if(!Q("rutin").classList.contains("open"))pushR("rutin");Q("rutin").classList.add("open");document.body.classList.add("lock");Q("rutin").scrollTop=0;renderRutin()}
function renderRutin(){clearInterval(rtm);const s=R[rs.i],B=Q("rutinBody");
 let h=`<div class="rstars">${R.map((x,k)=>`<span>${k<rs.i?"⭐":k===rs.i?"🌟":"☆"}</span>`).join("")}</div><div class="rbig">${s.e}</div><div class="rt">${s.t}</div><div class="rh">${s.h}</div>`;
 if(s.timer)h+=`<div class="ring" id="ring" style="--p:0"><i id="rtime">${Math.floor(s.timer/60)}:00</i></div><div style="text-align:center"><button class="chip big go" data-r="start" style="background:var(--pri);color:#fff;font-size:20px;padding:16px 28px">▶ Indítsuk!</button></div>`;
 if(s.pick){if(!rs.list)rs.list=shuf(S.filter(x=>!x.custom&&x.min<=6&&["esti","allatos","tunderes","nepmese"].includes(x.cat))).slice(0,3);
  h+=`<div class="rcards">${rs.list.map(x=>`<button class="rcard" data-pick="${x.id}" style="background:${grad(x)}"><span class="e">${x.emoji}</span><b>${E(x.title)}</b><small>⏱ ${x.min} perc</small></button>`).join("")}</div>`}
 if(s.fin)h+=`<div class="ambui"></div>`;
 B.innerHTML=h;ambRender();
 Q("rutinBar").innerHTML=`<button class="chip" data-r="back">← Vissza</button>`+(s.fin?`<button class="chip big go" data-r="night">🌑 Jó éjszakát!</button>`:s.pick?`<button class="chip go" data-r="next">Átugrom</button>`:`<button class="chip big go" data-r="next">✓ Kész!</button>`);
 sayX(s.s)}
function ract(a){const s=R[rs.i];
 if(a==="close")return closeOv("rutin");
 if(a==="back"){if(rs.i===0)return closeOv("rutin");rs.i--;return renderRutin()}
 if(a==="next"){chime([523,784],.12,.15);rs.i=Math.min(R.length-1,rs.i+1);return renderRutin()}
 if(a==="start"&&s.timer){const end=Date.now()+s.timer*1000;Q("rutinBody").querySelector("[data-r=start]").style.display="none";
  rtm=setInterval(()=>{const left=Math.max(0,end-Date.now()),p=100-left/(s.timer*10);const r=Q("ring");if(r)r.style.setProperty("--p",p);const m=Math.ceil(left/1000);const t=Q("rtime");if(t)t.textContent=Math.floor(m/60)+":"+String(m%60).padStart(2,"0");
   if(!left){clearInterval(rtm);chime();sayX("Szuper! Kész a fogmosás!");setTimeout(()=>{if(Q("rutin").classList.contains("open")&&R[rs.i]===s)ract("next")},2500)}},250)}
 if(a==="night")finishRutin()}
function rpick(id){chime([523,659],.1,.15);afterStory=true;Q("rutin").classList.remove("open");clearInterval(rtm);open(id)}
window.rutinAfterStory=()=>{if(!afterStory)return;afterStory=false;openRutin(R.length-1)};
function finishRutin(){ST.rut[today()]=true;LS.set("rutS",ST.rut);ST.days[today()]=true;LS.set("mDays",ST.days);chime([392,523,659,784,1047],.18);
 if(amb.kind){try{sleepAt=Date.now()+30*6e4;sli=2;Q("sl").textContent="😴 30 perc"}catch(e){}}
 closeOv("rutin");setTimeout(()=>{try{sleepNow()}catch(e){}},300);window.tiles&&tiles()}

window.openRutin=openRutin;window.openAlbum=openAlbum;window.ambSet=ambSet;
ensureUI();ambRender();window.tiles&&tiles();
})();
