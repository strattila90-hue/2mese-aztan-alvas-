// Mesealkotó: szereplőkártyák, helyszín, lapokból épített cselekmény, saját mesék mentése/átnevezése/szerkesztése/törlése
(function(){
const Q=id=>document.getElementById(id);
const cap=s=>s.charAt(0).toUpperCase()+s.slice(1);
const esc=s=>String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
const rnd=a=>a[Math.floor(Math.random()*a.length)];
const shuf=a=>[...a].sort(()=>Math.random()-.5);
const K="mySt",MAXB=6,MINB=3;

// n = névelős alak, d = részes eset (-nak/-nek), b = névelő nélküli alak
const CH=[
{id:"sarkany",e:"🐉",n:"a kis sárkány",d:"a kis sárkánynak",b:"sárkány"},
{id:"hercegno",e:"👸",n:"a hercegnő",d:"a hercegnőnek",b:"hercegnő"},
{id:"kobold",e:"🧝",n:"a kobold",d:"a koboldnak",b:"kobold"},
{id:"nyuszi",e:"🐰",n:"a kisnyuszi",d:"a kisnyuszinak",b:"nyuszi"},
{id:"sun",e:"🦔",n:"a kis sün",d:"a kis sünnek",b:"sün"},
{id:"tunder",e:"🧚",n:"a tündér",d:"a tündérnek",b:"tündér"},
{id:"macko",e:"🐻",n:"a mackó",d:"a mackónak",b:"mackó"},
{id:"csiga",e:"🐌",n:"a csiga",d:"a csigának",b:"csiga"},
{id:"bagoly",e:"🦉",n:"a bagoly",d:"a bagolynak",b:"bagoly"},
{id:"kiralyfi",e:"🤴",n:"a királyfi",d:"a királyfinak",b:"királyfi"},
{id:"roka",e:"🦊",n:"a kis róka",d:"a kis rókának",b:"róka"},
{id:"tyuk",e:"🐔",n:"a kis tyúk",d:"a kis tyúknak",b:"tyúk"},
{id:"mano",e:"🍄",n:"a manó",d:"a manónak",b:"manó"},
{id:"boszi",e:"🧙",n:"a jó boszorkány",d:"a jó boszorkánynak",b:"boszorkány"}];
const SE=[
{id:"erdo",e:"🌲",t:"Erdő",in:"az erdőben"},{id:"kastely",e:"🏰",t:"Kastély",in:"a kastélyban"},
{id:"ret",e:"🌼",t:"Rét",in:"a réten"},{id:"tenger",e:"🏖️",t:"Tengerpart",in:"a tengerparton"},
{id:"hegy",e:"⛰️",t:"Hegy",in:"a hegyen"},{id:"barlang",e:"🕯️",t:"Barlang",in:"a barlangban"}];
// Cselekményelemek: H = főhős, F = barát, G = harmadik szereplő (csak ha van)
const BT=[
{id:"reggel",e:"🌅",t:"Reggeli indulás",x:c=>`Szép reggel volt, a nap már fent járt. ${c.H} és ${c.F} elhatározták, hogy felfedezik a környéket.`},
{id:"eltevedes",e:"🧭",t:"Eltévedés",x:c=>`${c.H} és ${c.F} elindultak, de hamar eltévedtek ${c.S}. Minden fa és minden kő egyformának tűnt. – Ne féljünk – mondta ${c.H}. – Együtt majd csak hazatalálunk.`},
{id:"hang",e:"🔔",t:"Titokzatos hang",x:c=>`Egyszer csak halk csilingelést hallottak. – Ki van ott? – kérdezte ${c.H}. Senki sem válaszolt, csak a szél susogott. Aztán kiderült, hogy egy kis harang volt, amit a szél ringatott, és mindketten nevettek.`},
{id:"segitseg",e:"🤝",t:"Segítség",x:c=>`${c.F} megbotlott, és megütötte a lábát. ${c.H} odasietett hozzá, és segített neki felkelni. – Köszönöm – mosolygott ${c.F}. – Jó, hogy itt vagy.`},
{id:"jatek",e:"🎲",t:"Játék",x:c=>`Játszani kezdtek ${c.S}: bújócskáztak. ${c.H} háromig számolt, ${c.F} pedig a legjobb rejtekhelyre bújt. Aztán cseréltek, és olyan jót kacagtak, hogy még a madarak is felfigyeltek rájuk.`},
{id:"kincs",e:"💎",t:"Csillogó kincs",x:c=>`${c.F} egyszer csak talált valami fényeset a földön. – Nézd, ${c.Hb}, egy csillogó kavics! – kiáltotta. Közösen elhatározták, hogy vigyáznak rá, és megmutatják mindenkinek.`},
{id:"lakoma",e:"🍯",t:"Közös lakoma",x:c=>`Megéheztek, ezért piknikezni kezdtek. Volt mézes kenyér, hűvös víz és egy kosár eper. ${c.F} mindenből adott ${c.Hd}, pedig ő is nagyon éhes volt.`},
{id:"varazs",e:"✨",t:"Varázslat",x:c=>`Egyszer csak apró fények kezdtek táncolni körülöttük. Valaki varázsolt, hogy mindenki szépet álmodjon, és a világ egy kicsit csillogóbb lett.`},
{id:"eso",e:"🌧️",t:"Nyári eső",x:c=>`Esni kezdett az eső, de ${c.H} és ${c.F} nem ijedtek meg. Meghúzódtak egy száraz zugban, és együtt hallgatták, ahogy az eső dobol. Egyikük sem szólt, mégis nagyon jó volt.`},
{id:"barat",e:"💞",t:"Örök barátság",x:c=>`${c.H} és ${c.F} megígérték egymásnak, hogy mindig barátok maradnak. – Akkor is, ha messze leszünk – mondta ${c.H}. – Akkor is – bólintott ${c.F}.`},
{id:"vicc",e:"😄",t:"Vicces pillanat",x:c=>`${c.H} elmondott egy viccet, amin ${c.F} annyira nevetett, hogy hasra esett. Aztán mindketten nevettek, míg a könnyük is kicsordult.`},
{id:"vendeg",e:"👋",t:"Váratlan vendég",need:3,x:c=>`Ekkor megjelent ${c.G}. – Szervusztok! – köszönt kedvesen. – Megengeditek, hogy veletek tartsak? ${c.H} és ${c.F} szívesen befogadták, és együtt folytatták az utat.`}];
const GR=[["#a18cd1","#fbc2eb"],["#84fab0","#8fd3f4"],["#fccb90","#d57eeb"],["#ffecd2","#fcb69f"],["#89f7fe","#66a6ff"],["#f6d365","#fda085"]];

// --- tárolás
const S=()=>window.STORIES;
const mine=()=>S().filter(s=>s.custom);
function persist(){try{localStorage.setItem(K,JSON.stringify(mine()))}catch(e){window.toast&&toast("Nem sikerült menteni (tele a tárhely?)")}}
try{JSON.parse(localStorage.getItem(K)||"[]").forEach(s=>{s.custom=true;S().push(s)})}catch(e){}

// --- történet építése
let st=null,deal=[],step="home",snd=true;
const chr=id=>CH.find(c=>c.id===id);
const ctx=()=>{const [a,b,g]=st.ch.map(chr);return{H:a.n,Hb:a.b,Hd:a.d,F:b.n,G:g?g.n:"",S:SE.find(s=>s.id===st.se).in}};
const intro=()=>{const c=ctx();return `Hol volt, hol nem volt, ${c.S} élt ${c.H} és ${c.F}, akik a legjobb barátok voltak.`};
const outro=()=>{const c=ctx();return `Végül elfáradtak, és hazaindultak. A nap lassan lement, a csillagok pedig egyenként kigyulladtak. ${cap(c.H)} és ${c.F} egymás mellett feküdtek le, és mély, nyugodt álomba merültek. Csend lett, és a világ mélyen, békésen lélegzett. Jó éjszakát!`};
const autoTitle=()=>{const c=ctx();return cap(`${c.H} és ${c.F} meséje`)};
function dealCards(){const pool=BT.filter(b=>!st.beats.includes(b.id)&&(!b.need||st.ch.length>=b.need));deal=shuf(pool).slice(0,4)}
function say(t){if(!snd)return;try{speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(t);u.lang="hu-HU";u.rate=+Q("rate").value||.85;const v=voices[+Q("voice").value];if(v)u.voice=v;speechSynthesis.speak(u)}catch(e){}}

// --- felület
function ensureUI(){if(Q("creator"))return;
 const css=document.createElement("style");css.textContent=`
#reader{z-index:7}#creator .top{align-items:center}
.cg{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin:10px 0}
.cc{position:relative;background:var(--card);border-radius:22px;padding:14px 6px;text-align:center;font-size:15px;line-height:1.3;border:3px solid transparent;cursor:pointer;box-shadow:0 3px 10px #0002}
.cc .e{font-size:44px;display:block;margin-bottom:4px}.cc.sel{border-color:var(--pri)}
.cc .num{position:absolute;top:6px;right:8px;background:var(--pri);color:#fff;border-radius:50%;width:26px;height:26px;font-size:15px;display:grid;place-items:center}
.pv{background:var(--card);border-radius:22px;padding:6px 16px;font-size:17px;line-height:1.7;margin:8px 0 14px;max-height:36vh;overflow:auto}
.row{display:flex;flex-wrap:wrap;gap:8px;justify-content:center;margin:14px 0}
.chip.big{font-size:18px;padding:15px 24px}.chip:disabled{opacity:.4}.chip.go{background:var(--pri);color:#fff}
.li{display:flex;align-items:center;gap:10px;background:var(--card);border-radius:20px;padding:10px 12px;margin:10px 0;font-size:16px}
.li b{flex:1;line-height:1.3}.li .e{font-size:34px}.li .acts{display:flex;gap:6px}
.li .round{width:40px;height:40px;font-size:18px}
#creator textarea,#creator input.search{width:100%}#creator textarea{min-height:48vh;border-radius:18px;padding:14px;font:inherit;font-size:17px;border:2px solid #0001;background:var(--card);color:var(--tx)}`;
 document.head.appendChild(css);
 document.body.insertAdjacentHTML("beforeend",`<section class="reader" id="creator"><div class="top"><button class="chip" id="cBack">← Vissza</button><b id="cStep"></b><button class="round" id="cX">✕</button></div><div class="story" id="cBody" style="font-size:17px;padding-top:30px"></div></section>`);
 Q("cBody").onclick=e=>{const t=e.target.closest("[data-a]");if(t&&!t.disabled)act(t.dataset.a,t.dataset.v)};
 Q("cX").onclick=()=>closeCreator();
 Q("cBack").onclick=()=>{if(step==="home")return closeCreator();if(step==="plot"&&st.beats.length&&!confirm("A félkész mese elvész. Kilépsz?"))return;go("home")}}
function openCreator(){ensureUI();const c=Q("creator");if(!c.classList.contains("open")){if(history.state&&history.state.r)history.replaceState({r:1},"","#alkoto");else history.pushState({r:1},"","#alkoto")}
 c.classList.add("open");document.body.classList.add("lock");go("home")}
function hideCreator(){try{speechSynthesis.cancel()}catch(e){}Q("creator").classList.remove("open")}
function closeCreator(fromPop){hideCreator();document.body.classList.remove("lock");
 if(!fromPop){if(history.state&&history.state.r)history.back();else history.replaceState(null,"",location.pathname)}}
window.alkotoPop=()=>{const c=Q("creator");if(c&&c.classList.contains("open"))closeCreator(true)};
window.openCreator=openCreator;

const TITLES={home:"🧩 Mesealkotó",chars:"Kik legyenek a szereplők?",set:"Hol játszódik?",plot:"Építsd a történetet!",fin:"Kész a mese!",list:"⭐ Saját meséim",edit:"Szerkesztés"};
function go(s,arg){step=s;Q("creator").scrollTop=0;render(arg)}
function render(arg){Q("cStep").textContent=TITLES[step];const B=Q("cBody");({home:vHome,chars:vChars,set:vSet,plot:vPlot,fin:vFin,list:vList,edit:vEdit})[step](B,arg)}
function vHome(B){B.innerHTML=`<div style="text-align:center"><div style="font-size:64px">🧩</div><h2>Alkossunk mesét együtt!</h2><p>Válasszátok ki a szereplőket és a helyszínt, aztán lapokból építsétek fel a történetet.</p><button class="chip big go" data-a="new">✨ Új mese alkotása</button><br><button class="chip big" data-a="list">⭐ Saját meséim (${mine().length})</button></div>`}
function vChars(B){B.innerHTML=`<p style="text-align:center">Válassz 2–3 szereplőt! Az elsőből lesz a főhős.</p><div class="cg">${CH.map(c=>{const k=st.ch.indexOf(c.id);return `<div class="cc ${k>=0?"sel":""}" data-a="pc" data-v="${c.id}">${k>=0?`<span class="num">${k+1}</span>`:""}<span class="e">${c.e}</span>${cap(c.b)}</div>`}).join("")}</div><div class="row"><button class="chip big go" data-a="cnext" ${st.ch.length<2?"disabled":""}>Tovább →</button></div>`}
function vSet(B){B.innerHTML=`<div class="cg" style="grid-template-columns:repeat(2,1fr)">${SE.map(s=>`<div class="cc" data-a="ps" data-v="${s.id}"><span class="e">${s.e}</span>${s.t}</div>`).join("")}</div>`}
function vPlot(B){const n=st.beats.length;
 B.innerHTML=`<div class="pv" id="pv">${st.paras.map(p=>`<p>${esc(p)}</p>`).join("")}</div>
 <div style="text-align:center;font-weight:700">${n<MAXB?`Mi történjen ezután? (${n}/${MAXB})`:"Elég hosszú lett – altassuk el őket!"}</div>
 ${n<MAXB?`<div class="cg" style="grid-template-columns:repeat(2,1fr)">${deal.map(b=>`<div class="cc" data-a="pb" data-v="${b.id}"><span class="e">${b.e}</span>${b.t}</div>`).join("")}</div>`:""}
 <div class="row">${n?`<button class="chip" data-a="undo">↩️ Vissza</button>`:""}${n<MAXB?`<button class="chip" data-a="shuf">🔀 Más lapok</button>`:""}<button class="chip" data-a="snd">${snd?"🔊":"🔇"}</button>${n>=MINB?`<button class="chip big go" data-a="finish">🌙 Vége</button>`:""}</div>`;
 const pv=Q("pv");pv.scrollTop=pv.scrollHeight}
function vFin(B){B.innerHTML=`<div class="pv" style="max-height:none">${st.paras.map(p=>`<p>${esc(p)}</p>`).join("")}</div>
 <p><b>A mese címe:</b></p><input class="search" id="ttl" maxlength="80">
 <div class="row"><button class="chip" data-a="play">🔊 Meghallgatom</button><button class="chip big go" data-a="save">💾 Mentés</button><button class="chip" data-a="new">🔁 Újra</button></div>`;Q("ttl").value=autoTitle()}
function vList(B){const m=mine();
 B.innerHTML=`<div class="row"><button class="chip go" data-a="new">✨ Új mese</button></div>`+(m.length?`<p style="text-align:center;font-size:14px;color:var(--sub)">▶ olvasás · ✏️ átnevezés · 📝 szerkesztés · 🗑️ törlés</p>`+m.map(s=>`<div class="li"><span class="e">${s.emoji}</span><b>${esc(s.title)}</b><div class="acts"><button class="round" data-a="read" data-v="${s.id}">▶</button><button class="round" data-a="ren" data-v="${s.id}">✏️</button><button class="round" data-a="ed" data-v="${s.id}">📝</button><button class="round" data-a="del" data-v="${s.id}">🗑️</button></div></div>`).join(""):`<p style="text-align:center">Még nincs saját mesétek. Alkossatok egyet! 🌙</p>`)}
function vEdit(B,id){const s=mine().find(x=>x.id===id);if(!s)return go("list");
 B.innerHTML=`<p><b>Cím:</b></p><input class="search" id="et" maxlength="80"><p><b>Szöveg</b> (a bekezdéseket üres sor választja el):</p><textarea id="ex"></textarea><div class="row"><button class="chip big go" data-a="esave" data-v="${id}">💾 Mentés</button><button class="chip" data-a="list">Mégse</button></div>`;
 Q("et").value=s.title;Q("ex").value=s.text.join("\n\n")}

function act(a,v){const f=id=>mine().find(x=>x.id===id);
 switch(a){
 case"new":st={ch:[],se:null,beats:[],paras:[]};go("chars");break;
 case"list":go("list");break;
 case"pc":{const i=st.ch.indexOf(v);if(i>=0)st.ch.splice(i,1);else if(st.ch.length<3)st.ch.push(v);render();break}
 case"cnext":if(st.ch.length>=2)go("set");break;
 case"ps":st.se=v;st.beats=[];st.paras=[intro()];dealCards();go("plot");say(st.paras[0]);break;
 case"pb":{const b=BT.find(x=>x.id===v);const p=cap(b.x(ctx()).replace(/([.!?]) ([a-zöüóőúéáűí])/g,(m,x,y)=>x+" "+y.toUpperCase()));st.beats.push(v);st.paras.push(p);dealCards();render();say(p);break}
 case"shuf":dealCards();render();break;
 case"undo":st.beats.pop();st.paras.pop();dealCards();render();break;
 case"snd":snd=!snd;if(!snd)try{speechSynthesis.cancel()}catch(e){}render();break;
 case"finish":st.paras.push(outro());go("fin");break;
 case"play":say(st.paras.join(" "));break;
 case"save":{const title=(Q("ttl").value||"").trim()||autoTitle();const words=st.paras.join(" ").split(/\s+/).length;
  S().push({id:"my-"+Date.now().toString(36),title,emoji:chr(st.ch[0]).e,bg:rnd(GR),cat:"sajat",min:Math.max(1,Math.round(words/100)),text:st.paras.slice(),custom:true});
  persist();window.list&&list();window.toast&&toast("Elmentve ⭐");go("list");break}
 case"read":{hideCreator();open(v);break}
 case"ren":{const s=f(v),n=prompt("Új név a mesének:",s.title);if(n&&n.trim()){s.title=n.trim().slice(0,80);persist();window.list&&list();render()}break}
 case"ed":go("edit",v);break;
 case"esave":{const s=f(v),t=Q("et").value.trim(),p=Q("ex").value.split(/\n{2,}/).map(x=>x.trim()).filter(Boolean);
  if(!p.length)return window.toast&&toast("A mese szövege nem lehet üres");
  s.title=t||s.title;s.text=p;persist();window.list&&list();window.toast&&toast("Mentve ✓");go("list");break}
 case"del":{const s=f(v);if(s&&confirm("Biztosan törlöd: „"+s.title+"”?")){S().splice(S().indexOf(s),1);persist();window.list&&list();render()}break}
 }}
window.__alk={CH,SE,BT};
})();
