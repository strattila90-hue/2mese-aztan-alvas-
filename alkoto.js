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
{id:"boszi",e:"🧙",n:"a jó boszorkány",d:"a jó boszorkánynak",b:"boszorkány"},
{id:"oroszlan",e:"🦁",n:"a kis oroszlán",d:"a kis oroszlánnak",b:"oroszlán"},
{id:"elefant",e:"🐘",n:"a kis elefánt",d:"a kis elefántnak",b:"elefánt"},
{id:"zsiraf",e:"🦒",n:"a zsiráf",d:"a zsiráfnak",b:"zsiráf"},
{id:"majom",e:"🐒",n:"a kis majom",d:"a kis majomnak",b:"majom"},
{id:"panda",e:"🐼",n:"a panda",d:"a pandának",b:"panda"},
{id:"pingvin",e:"🐧",n:"a pingvin",d:"a pingvinnek",b:"pingvin"},
{id:"kacsa",e:"🦆",n:"a kiskacsa",d:"a kiskacsának",b:"kiskacsa"},
{id:"barany",e:"🐑",n:"a kisbárány",d:"a kisbáránynak",b:"bárány"},
{id:"csiko",e:"🐴",n:"a kiscsikó",d:"a kiscsikónak",b:"csikó"},
{id:"kutya",e:"🐶",n:"a kiskutya",d:"a kiskutyának",b:"kutya"},
{id:"cica",e:"🐱",n:"a kiscica",d:"a kiscicának",b:"cica"},
{id:"eger",e:"🐭",n:"a kisegér",d:"a kisegérnek",b:"egér"},
{id:"beka",e:"🐸",n:"a kis béka",d:"a kis békának",b:"béka"},
{id:"pillango",e:"🦋",n:"a pillangó",d:"a pillangónak",b:"pillangó"},
{id:"mokus",e:"🐿️",n:"a mókus",d:"a mókusnak",b:"mókus"},
{id:"szarvas",e:"🦌",n:"a kis szarvas",d:"a kis szarvasnak",b:"szarvas"},
{id:"vidra",e:"🦦",n:"a vidra",d:"a vidrának",b:"vidra"},
{id:"mehecske",e:"🐝",n:"a méhecske",d:"a méhecskének",b:"méhecske"},
{id:"sello",e:"🧜",n:"a kis sellő",d:"a kis sellőnek",b:"sellő"},
{id:"egyszarvu",e:"🦄",n:"az egyszarvú",d:"az egyszarvúnak",b:"egyszarvú"},
{id:"kiraly",e:"👑",n:"a jó király",d:"a jó királynak",b:"király"},
{id:"robot",e:"🤖",n:"a kis robot",d:"a kis robotnak",b:"robot"},
{id:"dino",e:"🦕",n:"a kis dínó",d:"a kis dínónak",b:"dínó"},
{id:"hoember",e:"⛄",n:"a hóember",d:"a hóembernek",b:"hóember"},
{id:"urhajos",e:"👩‍🚀",n:"az űrhajós",d:"az űrhajósnak",b:"űrhajós"}];
const SE=[
{id:"erdo",e:"🌲",t:"Erdő",in:"az erdőben"},{id:"kastely",e:"🏰",t:"Kastély",in:"a kastélyban"},
{id:"ret",e:"🌼",t:"Rét",in:"a réten"},{id:"tenger",e:"🏖️",t:"Tengerpart",in:"a tengerparton"},
{id:"hegy",e:"⛰️",t:"Hegy",in:"a hegyen"},{id:"barlang",e:"🕯️",t:"Barlang",in:"a barlangban"},
{id:"tengermely",e:"🌊",t:"Tenger mélye",in:"a tenger mélyén",nr:1},{id:"sziget",e:"🏝️",t:"Kis sziget",in:"a kis szigeten"},
{id:"tunderkert",e:"🌸",t:"Tündérkert",in:"a tündérkertben"},{id:"felho",e:"☁️",t:"Felhők fölött",in:"a felhők fölött",nr:1},
{id:"cirkusz",e:"🎪",t:"Cirkusz",in:"a cirkuszban"},{id:"falu",e:"🏡",t:"Kis falu",in:"a kis faluban"},
{id:"tanya",e:"🌾",t:"Tanya",in:"a tanyán"},{id:"vilagur",e:"🚀",t:"Csillagok között",in:"a csillagok között",nr:1},
{id:"havas",e:"❄️",t:"Havas táj",in:"a havas tájon"},{id:"cukor",e:"🍭",t:"Cukorország",in:"Cukorországban"},
{id:"szivarvany",e:"🌈",t:"Szivárványország",in:"Szivárványországban"},{id:"jatszoter",e:"🎠",t:"Játszótér",in:"a játszótéren"},
{id:"kunyho",e:"🛖",t:"Kis kunyhó",in:"a kis kunyhóban"},{id:"to",e:"🌙",t:"Holdfényes tó",in:"a holdfényes tó partján"}];
// Mondatszínező: minden szereplőnek van egy saját kis jellemvonása, minden helyszínnek egy hangulata
const QU={sarkany:"orrából vidám kis füstkarikák szálltak.",hercegno:"ma is félrecsúszott a koronája, de ez egyáltalán nem zavarta.",kobold:"hegyes sapkáján kis csengő csilingelt minden lépésnél.",nyuszi:"hosszú füle ide-oda mozgott, mintha mindent hallani akarna.",sun:"tüskéi között egy elfelejtett falevél lengett.",tunder:"szárnya halk csengettyűszóval rezgett.",macko:"bozontos bundája mézszagot árasztott.",csiga:"házán apró pöttyök sorakoztak, és nagyon büszke volt rájuk.",bagoly:"nagy, kerek szemmel pislogott, és mindent észrevett.",kiralyfi:"kicsit nagy volt rá a köpönyege, de ő hősként viselte.",roka:"bozontos farkát úgy lengette, mint egy zászlót.",tyuk:"minden lépésnél vidáman kotkodácsolt.",mano:"piros sapkája olyan nagy volt, hogy néha a szemébe csúszott.",boszi:"hegyes kalapja alól vidáman kikandikált egy ősz hajtincs.",oroszlan:"sörénye szétállt, mint egy napocska.",elefant:"ormányával lassan ringatózott, mintha táncolna.",zsiraf:"nyaka olyan hosszú volt, hogy a fák tetejére is rálátott.",majom:"farkával egyik ágról a másikra lendült, és közben vidáman rikoltozott.",panda:"szeme körül fekete karikák ültek, és nagyon álmosnak látszott.",pingvin:"ide-oda totyogott, és minden lépésnél kicsit megingott.",kacsa:"lábacskája pacsit-pacsit csattogott a földön.",barany:"göndör gyapja puha volt, mint egy felhő.",csiko:"vékony lábán ide-oda ugrált, és vidáman nyerített.",kutya:"farka egyfolytában csóválódott, mintha integetne.",cica:"bajusza finoman remegett, és halkan dorombolt.",eger:"apró orra mindent megszagolt, a szeme pedig csillogott.",beka:"nagyot ugrott, és hangosan brekegett.",pillango:"színes szárnyai úgy lebegtek, mint két apró vitorla.",mokus:"ügyes kis mancsával mogyorót forgatott, és közben csacsogott.",szarvas:"kis agancsa még éppen csak kidugott, de nagyon büszke volt rá.",vidra:"sima, fényes bundáján még csillogtak a vízcseppek.",mehecske:"kis szárnyával zümmögött, és körbe-körbe repkedett.",sello:"csillogó farka szivárványszínekben pompázott.",egyszarvu:"szarvának hegyén kis csillagpor csillogott.",kiraly:"sokat nevetett, és közben a szakálla ide-oda rezgett.",robot:"izzó szemmel pislogott, és halkan zümmögött, mint egy elégedett méhecske.",dino:"hosszú nyakát kinyújtotta, és halkan prüszkölt.",hoember:"répaorra kicsit félrebillent, de a mosolya a helyén volt.",urhajos:"fehér sisakjában az egész világ tükröződött."};
const SD={erdo:"A fák levelei susogtak, a mohán harmatcseppek csillogtak.",kastely:"A hosszú folyosókon még a lépések is visszhangot vertek.",ret:"A fűben százféle virág illatozott, a méhek zümmögtek.",tenger:"A hullámok halkan csobbantak, a parton kagylók hevertek.",hegy:"A levegő tiszta volt és hűvös, a felhők szinte a lábuk előtt lebegtek.",barlang:"A falakon apró kövek csillogtak, mint megannyi alvó csillag.",tengermely:"Körülöttük színes halak úsztak, a hínár lassan ringatózott.",sziget:"A homok meleg volt, a pálmafák levelei lustán legyezgették a szellőt.",tunderkert:"A virágok halkan csengettek, ha a szél hozzájuk ért.",felho:"A felhők puhák voltak, mint a vattacukor, és úgy lehetett rajtuk ugrálni, mint a trambulinon.",cirkusz:"A sátor tetején zászlók lengtek, bent pedig pattogatott kukorica illata terjengett.",falu:"A kéményekből vékony füst szállt, a kerítés mellett egy macska sütkérezett.",tanya:"A kakas már rég felkelt, a kút mellett tyúkok kapirgáltak.",vilagur:"Körös-körül apró csillagok ragyogtak, és hangtalanul lebegett minden.",havas:"A hó ropogott a talpuk alatt, a fák fehér kabátot viseltek.",cukor:"A kerítések nyalókából voltak, a patakban málnaszörp csordogált.",szivarvany:"Az ég hétszínű volt, és minden lépésnél más színű lett a föld.",jatszoter:"A hinta nyikorgott, a homokozóban elfeledett vödrök hevertek.",kunyho:"A kis ablakban muskátli virított, a kályhában vidáman pattogott a tűz.",to:"A tó tükrén ott ringott a Hold, a nádas pedig halkan suttogott."};
const CONN=["Mentek, mendegéltek.","Telt-múlt az idő.","Közben a nap odébb vándorolt az égen.","Nem sokkal később történt valami.","Aztán megint történt valami."];
// c = kártyafelirat gyerekeknek; x = két változat, amelyből az egyiket véletlenszerűen használjuk
const BT=[
{id:"reggel",e:"🌅",t:"Reggeli indulás",c:"Új nap kezdődik",x:[c=>`${c.Hq} ${c.F} még a takarójában bújkált, de ${c.H} addig bökdöste, míg ki nem bújt. – Gyere már, ma felfedezünk valamit! – Mit? – ásított ${c.F}. – Azt még nem tudom, azért kell felfedezni!`,c=>`A nap éppen csak kikukucskált a dombok mögül, de ${c.H} és ${c.F} már talpon volt. – Ma különleges nap lesz – jelentette ${c.H}. – Ezt miből gondolod? – kérdezte ${c.F}. – Mert a reggeli is jobb volt, mint tegnap!`]},
{id:"eltevedes",e:"🧭",t:"Eltévedés",c:"Nem tudják, merre menjenek",x:[c=>`Mentek, mendegéltek, de egyszer csak nem ismerték fel az ösvényt. – Ez a bal volt, vagy a jobb? – tűnődött ${c.F}. – Szerintem a harmadik – felelte ${c.H}, pedig csak két út volt. Egymásra néztek, és hangosan felnevettek.`,c=>`Az út kétfelé ágazott, ${c.H} balra akart menni, ${c.F} jobbra. Végül úgy döntöttek, hogy egy kavicsot dobnak fel. A kavics ráesett ${c.H} orrára, így mégis balra mentek.`]},
{id:"hang",e:"👂",t:"Titokzatos hang",c:"Valami furcsa hang szól",x:[c=>`Egyszer csak halk kopogást hallottak. Kop-kop-kop. – Ki az? – suttogta ${c.F}, és ${c.H} háta mögé bújt. A hang erősödött, aztán kiderült: egy kis harkály dolgozott a közelben, és bocsánatot kért a zajért.`,c=>`Titokzatos suttogás ütötte meg a fülüket. – Hallod? – kérdezte ${c.H}. – Hallom – nyelt egyet ${c.F}. Lábujjhegyen közelebb lopakodtak, és kiderült, hogy csak a szél mesél a leveleknek, és mindig elfelejti a végét.`]},
{id:"segitseg",e:"🤝",t:"Segítség",c:"Segítenek egymásnak",x:[c=>`${c.F} szomorúan ült egy kövön, mert elvesztette a kedvenc kis zsebkendőjét. ${c.H} nem szólt semmit, hanem átkutatta az egész környéket, míg meg nem lett. – Hol találtad meg? – ámult ${c.F}. – Mindig ott van, ahol utoljára nem nézed – kacsintott ${c.H}.`,c=>`${c.F} nem érte el a magas ágon függő almát. ${c.H} felemelte, ${c.F} pedig nyújtózott és nyújtózott, míg le nem szakította. Közösen kettévágták az almát, és a fele az egyiküké lett, a fele a másiké.`]},
{id:"jatek",e:"🎲",t:"Játék",c:"Együtt játszanak",x:[c=>`Bújócskázni kezdtek. ${c.H} behunyta a szemét, és hangosan számolt: egy, kettő, három... ${c.F} addig keresett egy jó rejtekhelyet, amíg ${c.H} el nem érte a tizet. Hosszan keresték egymást, a végén pedig mindketten ugyanabba a bokorba bújtak.`,c=>`${c.F} kitalált egy új játékot: aki elsőként talál valami kéket, az nyer. ${c.H} talált egy kék kavicsot, ${c.F} egy kék tollat, és végül nem tudták eldönteni, ki nyert, ezért mind a ketten nyertek.`]},
{id:"kincs",e:"💎",t:"Csillogó kincs",c:"Valami csillogót találnak",x:[c=>`${c.F} hirtelen megtorpant. – Nézd! – mutatott valami csillogóra. – Ez egy kincs! – Szerintem csak egy üvegdarab – mondta ${c.H}, és a fény felé tartotta. Az üvegdarabban szivárványszínek táncoltak. – Akkor is kincs – döntöttek, és elrejtették egy titkos helyre.`,c=>`Egy régi, rozsdás kulcsot találtak. – Vajon mit nyit? – töprengett ${c.H}. – Biztosan egy titkos ajtót – vágta rá ${c.F}. Mindenhová bepróbálták, de sehova sem illett. A kulcsot mégis megtartották, hátha egyszer ajtóra lelnek.`]},
{id:"lakoma",e:"🍯",t:"Közös lakoma",c:"Együtt esznek-isznak",x:[c=>`Korgott a hasuk, ezért leültek uzsonnázni. Volt mézes kenyér, ropogós alma és egy kancsó friss víz. ${c.F} a legnagyobb darabot ${c.Hd} adta, ${c.H} pedig félbetörte a sajátját is, és a felét odanyújtotta neki.`,c=>`Terítettek, és elővették a legfinomabb falatokat. Annyit ettek, hogy utána csak feküdtek a hátukon, és a hasukat simogatták. – Ennél jobb nap nincs – sóhajtotta ${c.H}. – Holnap lesz – felelte ${c.F}, mert ő mindig bízott a holnapban.`]},
{id:"varazs",e:"✨",t:"Varázslat",c:"Varázslat történik",x:[c=>`Hirtelen apró, aranyló fények kezdtek lebegni körülöttük, mint megannyi pici lámpás. Valaki varázsolt, de senkit nem láttak. – Köszönjük! – kiáltotta ${c.F}. A fények kuncogtak, aztán egyenként elszálltak az éjszakába.`,c=>`${c.H} tüsszentett egyet, és hirtelen virág nőtt a lába elé. Aztán ${c.F} is tüsszentett, és nőtt a másik virág. – Varázstüsszentés! – kiáltották egyszerre, és addig tüsszögtek, míg az egész hely csupa virág nem lett.`]},
{id:"eso",e:"🌧️",t:"Esik az eső",c:"Csöpög az eső",x:[c=>`Kis szürke felhő érkezett, aztán placcs-placcs, esni kezdett az eső. ${c.H} és ${c.F} egy nagy levél alá húzódtak, és onnan nézték, ahogy a cseppek táncolnak a tócsákban. – Ez zene – mondta ${c.F}. – Esőzene – bólintott ${c.H}.`,c=>`Eleredt az eső, de nem hideg volt, hanem langyos, nyári. ${c.H} és ${c.F} kiszaladtak a cseppek közé, és ugráltak a tócsákban, míg csupa víz nem lett a lábuk. Utána jót nevettek, és együtt megszáradtak a napon.`]},
{id:"barat",e:"💞",t:"Örök barátság",c:"Barátok maradnak",x:[c=>`${c.H} és ${c.F} leültek egymás mellé, és sokáig csak hallgattak. Nem is kellett beszélni. – Tudod, mi a legjobb? – szólalt meg végül ${c.H}. – Hogy te vagy a barátom. – Te is az enyém – felelte ${c.F}, és mindkettejüknek melege lett belül, pedig nem is volt hideg.`,c=>`Összebújtak, és megígérték, hogy akármi történik, egymás mellett maradnak. – Még akkor is, ha tüsszögök? – kérdezte ${c.F}. – Akkor is. – Még akkor is, ha horkolok? – Akkor is – nevetett ${c.H}. Ez volt a világ legbiztosabb ígérete.`]},
{id:"vicc",e:"😂",t:"Nagy nevetés",c:"Nagyot nevetnek",x:[c=>`${c.H} furcsa arcot vágott, és ${c.F} annyit nevetett, hogy csuklani kezdett. Hic! Hic! – Ne nevettess már! – hic! – kérte ${c.F}. – Én nem csinálok semmit – hic... – mondta ${c.H}, és ő is csuklani kezdett.`,c=>`${c.F} megpróbált hátrafelé járni, de beleesett egy bokorba. ${c.H} segített kihúzni, és a levelek között kilógott a fején egy kis ág. – Nézd, korona! – kiáltotta ${c.H}. ${c.F} büszkén viselte, mintha igazi lenne.`]},
{id:"vendeg",e:"👋",t:"Új barát érkezik",c:"Valaki csatlakozik hozzájuk",need:3,x:[c=>`Zörrent valami a bokorban, és előbújt ${c.G}. – Szervusztok! – mondta kissé szégyenlősen. – Nem tudom, merre menjek, elkísérhetlek benneteket? ${c.H} és ${c.F} összenézett, aztán egyszerre bólintottak. – Gyere! Háromnak még jobb!`,c=>`Éppen indulni akartak, amikor valaki megszólalt mögöttük: – Várjatok meg! Ott állt ${c.G}, kifulladva, és egy kis csomagot szorongatott. – Sütit hoztam! – Akkor maradj! – kiáltották, és együtt folytatták az utat.`]}];
const GR=[["#a18cd1","#fbc2eb"],["#84fab0","#8fd3f4"],["#fccb90","#d57eeb"],["#ffecd2","#fcb69f"],["#89f7fe","#66a6ff"],["#f6d365","#fda085"]];

// --- tárolás
const S=()=>window.STORIES;
const mine=()=>S().filter(s=>s.custom);
function persist(){try{localStorage.setItem(K,JSON.stringify(mine()))}catch(e){window.toast&&toast("Nem sikerült menteni (tele a tárhely?)")}}
try{JSON.parse(localStorage.getItem(K)||"[]").forEach(s=>{s.custom=true;S().push(s)})}catch(e){}

// --- történet építése
let st=null,deal=[],step="home",snd=true;
const chr=id=>CH.find(c=>c.id===id);
const kind=x=>x.n.replace(/^(a|az) /,"");
function dat(n){const w=n.trim(),low=w.toLowerCase().split(/\s+/).pop(),vs=[...low].filter(ch=>"aáeéiíoóöőuúüű".includes(ch));
 const nn=[...vs].reverse().find(v=>!"ieéí".includes(v)),back=nn?"aáoóuú".includes(nn):false;let base=w;const end=w.slice(-1);
 if(end==="a"||end==="A")base=w.slice(0,-1)+"á";else if(end==="e"||end==="E")base=w.slice(0,-1)+"é";return base+(back?"nak":"nek")}
const cleanName=s=>{s=String(s||"").replace(/[^\p{L} '’-]/gu,"").replace(/\s+/g," ").trim().slice(0,20);return s?cap(s):""};
const ctx=()=>{const [a,b,g]=st.ch.map(chr),[n1,n2]=st.nm||["",""],H=n1||a.n,F=n2||b.n;
 return{H,Hb:n1||a.b,Hd:n1?dat(n1):a.d,F,G:g?g.n:"",S:SE.find(s=>s.id===st.se).in,Hq:cap(H)+" "+QU[a.id],Fq:cap(F)+" "+QU[b.id],sd:SD[st.se]}};
const spec=()=>{const [a,b]=st.ch.map(chr),[n1,n2]=st.nm||["",""];
 if(n1&&n2)return `${n1} ${kind(a)} volt, ${n2} pedig ${kind(b)}.`;if(n1)return `${n1} ${kind(a)} volt.`;if(n2)return `${n2} ${kind(b)} volt.`;return""};
const intro=()=>{const c=ctx(),sp=spec();return rnd([`Hol volt, hol nem volt, ${c.S} élt ${c.H} és ${c.F}.`,`Egyszer régen ${c.S} lakott ${c.H} és ${c.F}.`,`Mesélik, hogy ${c.S} élt ${c.H} és ${c.F}.`])+" "+(sp?sp+" ":"")+c.sd+" "+rnd(["Jó barátok voltak, és sosem unatkoztak.","Együtt reggeliztek, együtt nevettek, és együtt álmodtak.","Nem volt olyan nap, hogy ne találtak volna ki valami újat."])+" "+c.Hq};
const outro=()=>{const c=ctx(),H=cap(c.H);return rnd([`A nap lassan lement, és a csillagok egyenként kigyulladtak. ${H} és ${c.F} nagyot ásított. – Holnap folytatjuk – mondta ${c.H}. – Holnap folytatjuk – ismételte ${c.F}, aztán már csak a szuszogásuk hallatszott. Jó éjszakát!`,`Hazafelé már alig bírták nyitva tartani a szemüket. A Hold is álmosan pislogott az égen. ${H} és ${c.F} egymás mellé kuporodtak, és a világ egyszerre nagyon csendes lett. Jó éjszakát!`,`Leszállt az este. Valahol messze egy bagoly huhogott, a szél pedig halkan dúdolt. ${H} és ${c.F} bebújtak a takaró alá. Először ${c.H} aludt el, aztán ${c.F} is. Jó éjszakát!`])};
const autoTitle=()=>{const c=ctx();return cap(`${c.H} és ${c.F} meséje`)};
const PG=["#ffd6e0,#ffb3c6","#d4f1c5,#a8e6a1","#cfe3ff,#9ec5ff","#ffe9b8,#ffd27a","#e6d4ff,#c9a8ff","#c8f1f0,#8fe0dc","#ffd9c2,#ffb48a","#f6e0f0,#e8b4dc"];
const pic=(id,e,i)=>`<div class="pic" style="--pg:linear-gradient(135deg,${PG[i%PG.length]})"><span class="e">${e}</span><img src="art/${id}.webp" alt="" loading="lazy" onerror="this.remove()"></div>`;
function dealCards(){const nr=(SE.find(s=>s.id===st.se)||{}).nr;const pool=BT.filter(b=>!st.beats.includes(b.id)&&(!b.need||st.ch.length>=b.need)&&!(nr&&b.id==="eso"));deal=shuf(pool).slice(0,4)}
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
.pic{position:relative;width:88px;height:88px;margin:0 auto 8px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 30% 25%,#fff9,transparent 55%),var(--pg);box-shadow:inset 0 -6px 12px #0001,0 4px 10px #0002;overflow:hidden}
.pic .e{font-size:52px;line-height:1;filter:drop-shadow(0 3px 3px #0003)}.pic img{position:absolute;inset:0;width:100%;height:100%;object-fit:cover}
.cc b{display:block;font-size:16px}.cc small{display:block;color:var(--sub);font-size:13px;margin-top:3px}
.cc:active{transform:scale(.94)}.cc.sel{background:var(--hl);transform:scale(1.03)}
.pickbar{text-align:center;font-size:34px;min-height:48px;margin:4px 0}
.sticky{position:sticky;bottom:0;padding:12px 0 6px;background:linear-gradient(transparent,var(--bg) 35%)}
body.night .pic{filter:brightness(.7) saturate(.8)}
#creator .top{left:0;right:0;top:0;padding:8px 12px;padding-top:calc(8px + env(safe-area-inset-top));background:var(--bg);gap:8px;align-items:center}
#creator #cStep{flex:1;text-align:center;line-height:1.25;font-size:17px}#cStep small{letter-spacing:3px;color:var(--pri);font-size:12px}
.cbar{position:fixed;left:0;right:0;bottom:0;display:none;gap:8px;align-items:center;padding:12px 12px calc(12px + env(safe-area-inset-bottom));background:linear-gradient(transparent,var(--bg) 30%);z-index:4}
.cbar .chip{min-height:52px;font-size:17px;padding:10px 14px;white-space:nowrap}.cbar .chip.big{padding:12px 18px}.cbar .go{margin-left:auto}
.nm{background:var(--card);border-radius:22px;padding:12px;margin:12px 0}.nmh{display:flex;gap:12px;align-items:center}.nmh .pic{flex:none;width:72px;height:72px;margin:0}.nmh .pic .e{font-size:42px}.nmh b{display:block;margin-bottom:6px}
.nm .chips2{display:flex;flex-wrap:wrap;gap:8px;margin-top:10px}.nm .chip{padding:8px 14px}
#creator textarea,#creator input.search{width:100%}#creator textarea{min-height:48vh;border-radius:18px;padding:14px;font:inherit;font-size:17px;border:2px solid #0001;background:var(--card);color:var(--tx)}`;
 document.head.appendChild(css);
 document.body.insertAdjacentHTML("beforeend",`<section class="reader" id="creator"><div class="top"><button class="round" id="cBack" title="Vissza">←</button><b id="cStep"></b><button class="round" id="cX" title="Bezárás">✕</button></div><div class="story" id="cBody" style="font-size:17px;padding-top:24px"></div><div class="cbar" id="cbar"></div></section>`);
 const h=e=>{const t=e.target.closest("[data-a]");if(t&&!t.disabled)act(t.dataset.a,t.dataset.v)};
 Q("cBody").onclick=h;Q("cbar").onclick=h;Q("cX").onclick=()=>closeCreator();Q("cBack").onclick=()=>goBack()}
function openCreator(){ensureUI();const c=Q("creator");if(!c.classList.contains("open")){if(history.state&&history.state.r)history.replaceState({r:1},"","#alkoto");else history.pushState({r:1},"","#alkoto")}
 c.classList.add("open");document.body.classList.add("lock");go("home")}
function hideCreator(){try{speechSynthesis.cancel()}catch(e){}Q("creator").classList.remove("open")}
function closeCreator(fromPop){hideCreator();document.body.classList.remove("lock");
 if(!fromPop){if(history.state&&history.state.r)history.back();else history.replaceState(null,"",location.pathname)}}
window.alkotoPop=()=>{const c=Q("creator");if(c&&c.classList.contains("open"))closeCreator(true)};
window.openCreator=openCreator;

const FLOW=["chars","names","set","plot","fin"];
const PREV={chars:"home",names:"chars",set:"names",plot:"set",fin:"plot",list:"home",edit:"list"};
const TITLES={home:"🧩 Mesealkotó",chars:"Kik legyenek a szereplők?",names:"Hogy hívják őket?",set:"Hol játszódik?",plot:"Építsd a történetet!",fin:"Kész a mese!",list:"⭐ Saját meséim",edit:"Szerkesztés"};
const NAMES=["Pöfi","Bogi","Misi","Lili","Peti","Zsófi","Dóri","Bence","Panni","Gergő","Nóri","Kata"];
const SB=()=>`<button class="chip" data-a="snd" title="Hang">${snd?"🔊":"🔇"}</button>`;
function bar(h){const b=Q("cbar");b.innerHTML=h;b.style.display=h?"flex":"none"}
function saveNames(){if(Q("nm0"))st.nm=[cleanName(Q("nm0").value),cleanName(Q("nm1").value)]}
function go(s,arg){step=s;Q("creator").scrollTop=0;render(arg);
 const P={chars:"Válassz két vagy három szereplőt! Ha rákoppintasz, megmondom, ki ő.",names:"Hogy hívják a főhőst? Beírhatod a nevét, vagy választhatsz egyet.",set:"Hol játsszon a mese?"};if(P[s])say(P[s])}
function goBack(){if(step==="home")return closeCreator();if(step==="names")saveNames();
 if(step==="plot"&&st.beats.length&&!confirm("A félkész mese elvész. Biztosan visszalépsz?"))return;if(step==="fin")st.paras.pop();go(PREV[step])}
function render(arg){const i=FLOW.indexOf(step);Q("cStep").innerHTML=(i>=0?`<small>${FLOW.map((_,k)=>k<=i?"●":"○").join(" ")}</small><br>`:"")+TITLES[step];
 ({home:vHome,chars:vChars,names:vNames,set:vSet,plot:vPlot,fin:vFin,list:vList,edit:vEdit})[step](Q("cBody"),arg)}
function vHome(B){bar("");B.innerHTML=`<div style="text-align:center"><div style="font-size:64px">🧩</div><h2>Alkossunk mesét együtt!</h2><p>Válasszátok ki a szereplőket, adjatok nekik nevet, és lapokból építsétek fel a történetet.</p><button class="chip big go" data-a="new">✨ Új mese alkotása</button><br><button class="chip big" data-a="list">⭐ Saját meséim (${mine().length})</button></div>`}
function vChars(B){const sel=st.ch.map(id=>chr(id).e).join(" ");bar(SB()+`<button class="chip big go" data-a="cnext" ${st.ch.length<2?"disabled":""}>Tovább →</button>`);
 B.innerHTML=`<div class="pickbar">${sel||"👆 Koppints a képekre!"}</div><div class="cg">${CH.map((c,i)=>{const k=st.ch.indexOf(c.id);return `<div class="cc ${k>=0?"sel":""}" data-a="pc" data-v="${c.id}">${k>=0?`<span class="num">${k+1}</span>`:""}${pic(c.id,c.e,i)}<b>${cap(c.b)}</b></div>`}).join("")}</div>`}
function vNames(B){bar(`<button class="chip" data-a="back">← Vissza</button><button class="chip big go" data-a="nnext">Tovább →</button>`);
 B.innerHTML=`<p style="text-align:center">Írd be a nevüket, vagy koppints egy névre. Nem kötelező, a nevet bármikor kihagyhatod!</p>`+[0,1].map(k=>{const c=chr(st.ch[k]);return `<div class="nm"><div class="nmh">${pic(c.id,c.e,k)}<div style="flex:1"><b>${k?"A barát":"A főhős"}: ${cap(c.b)}</b><input class="search" id="nm${k}" maxlength="20" placeholder="Írd be a nevét…" autocomplete="off" style="margin:0"></div></div><div class="chips2">${NAMES.map(n=>`<button class="chip" data-a="nm" data-v="${k}|${n}">${n}</button>`).join("")}</div></div>`}).join("");
 Q("nm0").value=(st.nm||[])[0]||"";Q("nm1").value=(st.nm||[])[1]||""}
function vSet(B){bar(`<button class="chip" data-a="back">← Vissza</button>`);B.innerHTML=`<div class="cg" style="grid-template-columns:repeat(2,1fr)">${SE.map((s,i)=>`<div class="cc" data-a="ps" data-v="${s.id}">${pic(s.id,s.e,i+3)}<b>${s.t}</b></div>`).join("")}</div>`}
function vPlot(B){const n=st.beats.length;
 bar((n?`<button class="chip" data-a="undo" title="Vissza egy lépést">↩️</button>`:"")+(n<MAXB?`<button class="chip" data-a="shuf">🔀 Más</button>`:"")+SB()+(n>=MINB?`<button class="chip big go" data-a="finish">🌙 Vége</button>`:""));
 B.innerHTML=`<div class="pv" id="pv">${st.paras.map(p=>`<p>${esc(p)}</p>`).join("")}</div>
 <div style="text-align:center;font-weight:700">${n<MAXB?`Mi történjen ezután? (${n}/${MAXB})`:"Elég hosszú lett – altassuk el őket!"}</div>
 ${n<MAXB?`<div class="cg" style="grid-template-columns:repeat(2,1fr)">${deal.map((b,i)=>`<div class="cc" data-a="pb" data-v="${b.id}">${pic(b.id,b.e,i)}<b>${b.t}</b><small>${b.c}</small></div>`).join("")}</div>`:""}`;
 const pv=Q("pv");pv.scrollTop=pv.scrollHeight}
function vFin(B){bar(`<button class="chip" data-a="new">🔁 Újra</button><button class="chip" data-a="play">🔊 Meghallgatom</button><button class="chip big go" data-a="save">💾 Mentés</button>`);
 B.innerHTML=`<div class="pv" style="max-height:none">${st.paras.map(p=>`<p>${esc(p)}</p>`).join("")}</div><p><b>A mese címe:</b></p><input class="search" id="ttl" maxlength="80">`;Q("ttl").value=autoTitle()}
function vList(B){const m=mine();bar(`<button class="chip" data-a="back">← Vissza</button><button class="chip big go" data-a="new">✨ Új mese</button>`);
 B.innerHTML=(m.length?`<p style="text-align:center;font-size:14px;color:var(--sub)">▶ olvasás · ✏️ átnevezés · 📝 szerkesztés · 🗑️ törlés</p>`+m.map(s=>`<div class="li"><span class="e">${s.emoji}</span><b>${esc(s.title)}</b><div class="acts"><button class="round" data-a="read" data-v="${s.id}">▶</button><button class="round" data-a="ren" data-v="${s.id}">✏️</button><button class="round" data-a="ed" data-v="${s.id}">📝</button><button class="round" data-a="del" data-v="${s.id}">🗑️</button></div></div>`).join(""):`<p style="text-align:center">Még nincs saját mesétek. Alkossatok egyet! 🌙</p>`)}
function vEdit(B,id){const s=mine().find(x=>x.id===id);if(!s)return go("list");
 bar(`<button class="chip" data-a="list">Mégse</button><button class="chip big go" data-a="esave" data-v="${id}">💾 Mentés</button>`);
 B.innerHTML=`<p><b>Cím:</b></p><input class="search" id="et" maxlength="80"><p><b>Szöveg</b> (a bekezdéseket üres sor választja el):</p><textarea id="ex"></textarea>`;
 Q("et").value=s.title;Q("ex").value=s.text.join("\n\n")}

function act(a,v){const f=id=>mine().find(x=>x.id===id);
 switch(a){
 case"new":st={ch:[],se:null,beats:[],paras:[],nm:["",""]};go("chars");break;
 case"back":goBack();break;
 case"nm":{const [k,n]=v.split("|");Q("nm"+k).value=n;say("A neve: "+n+".");break}
 case"nnext":saveNames();go("set");break;
 case"list":go("list");break;
 case"pc":{const i=st.ch.indexOf(v),c=chr(v);if(i>=0){st.ch.splice(i,1);say("Kivettük: "+c.b+".")}else if(st.ch.length<3){st.ch.push(v);say(cap(c.n)+"! "+["Ő lesz a főhős.","Ő lesz a legjobb barát.","Ő lesz a vendég."][st.ch.length-1])}else say("Legfeljebb három szereplő lehet.");render();break}
 case"cnext":if(st.ch.length>=2){st.nm=st.nm||["",""];go("names")}break;
 case"ps":{const s=SE.find(x=>x.id===v);st.se=v;st.beats=[];st.paras=[intro()];dealCards();go("plot");say(s.t+"! A mese "+s.in+" játszódik. "+st.paras[0]);break}
 case"pb":{const b=BT.find(x=>x.id===v);let p=cap(rnd(b.x)(ctx()).replace(/([.!?]) ([a-zöüóőúéáűí])/g,(m,x,y)=>x+" "+y.toUpperCase()));if(st.beats.length&&Math.random()<.6)p=rnd(CONN)+" "+p;st.beats.push(v);st.paras.push(p);dealCards();render();say(b.t+"! "+p);break}
 case"shuf":dealCards();render();break;
 case"undo":st.beats.pop();st.paras.pop();dealCards();render();break;
 case"snd":if(step==="names")saveNames();snd=!snd;if(!snd)try{speechSynthesis.cancel()}catch(e){}render();break;
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
window.__alk={CH,SE,BT,QU,SD,dat,cleanName};
})();
