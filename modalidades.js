'use strict';
/* Modalidades de pesca: datos, guía, asistente y selector de la ficha */
(function(){
const $=s=>document.querySelector(s);
const MAR='#4fa3c7',CIELO='#e3f1f8',ARENA='#e8dcb8',ROCA='#8a9aa5',LIN='#0b2a3f',ACC='#e07a00';
const sv=c=>`<svg viewBox="0 0 300 140" xmlns="http://www.w3.org/2000/svg"><rect width="300" height="140" fill="${CIELO}"/><rect y="60" width="300" height="80" fill="${MAR}"/>${c}</svg>`;
const ln=(d,c=LIN,w=2)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round"/>`;
const persona=(x,y)=>`<g stroke="${LIN}" stroke-width="3" stroke-linecap="round" fill="none"><circle cx="${x}" cy="${y-28}" r="6" fill="${LIN}"/><path d="M${x} ${y-22}v16 M${x} ${y-6}l-7 12 M${x} ${y-6}l7 12 M${x} ${y-16}l12 -6"/></g>`;
const barco=(x,y)=>`<path d="M${x-40} ${y} h80 l-12 16 h-56z" fill="#fff" stroke="${LIN}" stroke-width="2"/><rect x="${x-10}" y="${y-16}" width="22" height="16" fill="#fff" stroke="${LIN}" stroke-width="2"/>`;
const pez=(x,y,c='#ffb703')=>`<g fill="${c}"><ellipse cx="${x}" cy="${y}" rx="12" ry="6"/><path d="M${x+10} ${y}l8 -6v12z"/></g>`;
const plomo=(x,y)=>`<circle cx="${x}" cy="${y}" r="4" fill="${LIN}"/>`;
const senuelo=(x,y)=>`<path d="M${x-8} ${y}q8 -6 16 0q-8 6 -16 0z" fill="${ACC}"/>`;
const flecha=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#c0392b" stroke-width="2" stroke-dasharray="4 3"/><circle cx="${x2}" cy="${y2}" r="3" fill="#c0392b"/>`;
const fondo=`<path d="M0 128 Q75 118 150 126 T300 122 V140 H0z" fill="${ARENA}"/>`;
const rocas=`<path d="M0 40 L40 35 L70 50 L90 70 L60 140 H0z" fill="${ROCA}"/>`;

const M=[
{id:'surfcasting',n:'Surfcasting',i:'🏖️',donde:'tierra',
 que:'Pesca desde la playa lanzando muy lejos, por encima de las olas, con un plomo pesado y cebo natural. La caña se deja apoyada en un soporte (pica) esperando la picada.',
 rec:['¿Estás en una playa de arena o callaos?','¿Lanzas lejos con un plomo pesado?','¿La caña está quieta en un soporte y miras la puntera?'],
 equipo:'Caña larga (4–4,5 m), carrete grande, plomos de 80–150 g, bajos con 1–3 anzuelos, picas. Cebos: gusana, cangrejo, sardina, calamar.',
 especies:'Sargo, herrera, mojarra, baila, chopa, palometa, rayas y chuchos.',
 svg:sv(fondo+`<rect y="45" width="70" height="20" fill="${ARENA}"/>`+persona(35,62)+ln('M47 48 Q150 -10 250 80 L250 124')+plomo(250,124)+flecha(150,30,220,40))},
{id:'spinning',n:'Spinning',i:'🎣',donde:'tierra',
 que:'Lanzar un señuelo artificial (pececillo de plástico, cucharilla, paseante) y recogerlo con el carrete para imitar un pez que nada. Se está en movimiento, lance tras lance.',
 rec:['¿Usas señuelo artificial, no cebo?','¿Lanzas y recoges continuamente?','¿El señuelo va por superficie o media agua?'],
 equipo:'Caña de 2,4–3 m, carrete mediano, línea trenzada fina y bajo de fluorocarbono. Señuelos de 10–40 g.',
 especies:'Bicuda, anjova, jurel, caballa, baila, medregal pequeño, pejerrey.',
 svg:sv(rocas+persona(55,40)+ln('M67 24 Q150 10 220 80')+senuelo(222,82)+flecha(222,92,150,92))},
{id:'rockfishing',n:'Rockfishing',i:'🪨',donde:'tierra',
 que:'Pesca ligera con pequeños señuelos (vinilos con cabeza plomada) entre las rocas, buscando los peces que viven pegados al fondo rocoso.',
 rec:['¿Estás en la costa de roca o en un muelle con piedras?','¿Usas un vinilo pequeño (gusanito, cangrejito de goma)?','¿Lo mueves despacio cerca del fondo, entre piedras?'],
 equipo:'Caña ultraligera (1,8–2,4 m), carrete pequeño, trenzado fino, vinilos de 2–7 cm y cabezas de 2–10 g.',
 especies:'Cabrillas, vaquitas, burros, abades pequeños, pejeverdes, rascacios.',
 svg:sv(rocas+`<path d="M90 140 L130 100 L170 120 L210 95 L260 140z" fill="${ROCA}"/>`+persona(55,40)+ln('M67 24 Q120 30 150 110')+senuelo(152,112)+pez(185,105,'#c0392b'))},
{id:'corcheo',n:'Corcheo / boya',i:'🎈',donde:'tierra',
 que:'El cebo cuelga a media agua de un flotador (corcho o boya). Cuando el pez pica, la boya se hunde o se mueve. Muy típico en Canarias desde el risco y los muelles.',
 rec:['¿Tienes un flotador en la línea?','¿Miras la boya para saber si pica?','¿El cebo está quieto a media agua, no en el fondo?'],
 equipo:'Caña de 4–6 m (o boloñesa), carrete pequeño, boya de 2–10 g, anzuelos pequeños. Cebos: cangrejo, lapa, gamba, pan, engodo.',
 especies:'Vieja, salema, sargo, boga, chicharro, lisa (lebrancho), chopa.',
 svg:sv(rocas+persona(55,40)+ln('M67 24 Q140 0 200 60')+`<ellipse cx="200" cy="60" rx="5" ry="9" fill="${ACC}" stroke="${LIN}"/>`+ln('M200 69 V100',LIN,1)+`<circle cx="200" cy="102" r="3" fill="#fff" stroke="${LIN}"/>`+pez(225,104))},
{id:'ligera',n:'Ligera desde puerto',i:'⚓',donde:'tierra',
 que:'Pesca sencilla con caña corta y anzuelos pequeños desde muelles, diques o escolleras. Ideal para empezar.',
 rec:['¿Estás en un puerto, muelle o dique?','¿Usas una caña corta o ligera y cebo pequeño?','¿Pescas cerca, sin lanzar lejos?'],
 equipo:'Caña de 2–3 m, carrete pequeño, línea fina (0,18–0,25 mm), anzuelos del 10–14, plomito pequeño o boya. Cebos: gamba, sardina, pan, masilla.',
 especies:'Boga, chicharro, caballa, salema, sargo, lisa, vieja, pejeperro pequeño.',
 svg:sv(`<rect x="0" y="40" width="90" height="100" fill="#b9c6cf"/><rect x="0" y="36" width="90" height="6" fill="#7d93a3"/>`+persona(60,38)+ln('M72 22 Q120 30 130 100')+plomo(130,102)+pez(150,95)+pez(165,112,'#9fd3e8'))},
{id:'fondo',n:'Fondo desde barco (fondeado)',i:'🚤',donde:'barco',
 que:'El barco está quieto, sujeto con un ancla. Se baja el cebo con un plomo hasta el fondo y se espera la picada.',
 rec:['¿Estás en un barco con el ancla echada?','¿El cebo baja hasta el fondo con un plomo?','¿El barco no se mueve?'],
 equipo:'Caña de barco de 1,8–2,7 m, carrete mediano o eléctrico para mucha profundidad, plomos de 100–500 g, bajos de 2–4 anzuelos. Cebos: sardina, calamar, choco.',
 especies:'Sama, bocinegro, pargo, breca, chopa, abade, cherne (en profundidad).',
 svg:sv(fondo+barco(110,58)+ln('M80 58 L40 128',LIN,1.5)+`<path d="M34 124 h12 M40 120 v10" stroke="${LIN}" stroke-width="3"/>`+ln('M130 44 Q150 40 150 60 L150 122')+plomo(150,124)+pez(180,118))},
{id:'deriva',n:'Fondo a la deriva',i:'🌬️',donde:'barco',
 que:'El barco va suelto, sin ancla y con el motor parado, llevado por el viento o la corriente. El cebo va cerca del fondo y recorre terreno.',
 rec:['¿Estás en un barco SIN ancla y con motor parado?','¿El barco se mueve solo con el viento o la corriente?','¿Llevas cebo cerca del fondo?'],
 equipo:'Como el fondo desde barco, pero con plomos que mantengan el cebo abajo y un ancla de capa (paracaídas) opcional para frenar la deriva.',
 especies:'Sama, pargo, breca, bocinegro, chopa, calamar.',
 svg:sv(fondo+barco(120,58)+flecha(170,40,230,40)+`<text x="185" y="32" font-size="12" fill="${LIN}">viento</text>`+ln('M140 44 Q160 40 150 60 Q120 100 100 120')+plomo(100,121)+pez(70,118))},
{id:'currican',n:'Curricán (trolling)',i:'🚢',donde:'barco',
 que:'El barco navega despacio arrastrando señuelos (o cebo) por detrás. El pez ataca al señuelo en movimiento.',
 rec:['¿El barco va navegando con el motor en marcha?','¿Llevas señuelos arrastrando por detrás?','¿Las cañas van en soportes del barco?'],
 equipo:'Cañas de curricán y carretes de tambor, línea fuerte, pulpitos, rapalas, plumas, a veces divergentes.',
 especies:'Bonito, rabil, patudo, barrilote, dorado, peto, medregal, aguja (marlín).',
 svg:sv(barco(70,58)+ln('M30 54 Q120 70 220 70')+senuelo(222,70)+ln('M30 50 Q140 90 260 95')+senuelo(262,95)+flecha(130,25,40,25))},
{id:'jigging',n:'Jigging / slow jigging',i:'⚡',donde:'barco',
 que:'Desde el barco, se baja en vertical un señuelo metálico (jig) y se sube a tirones. En el slow jigging los movimientos son lentos y el jig cae planeando.',
 rec:['¿Estás en barco usando un señuelo de metal pesado?','¿Lo subes y bajas en vertical bajo el barco?','¿No usas cebo natural?'],
 equipo:'Caña corta y fuerte (1,6–2 m), carrete de alta capacidad, trenzado, jigs de 60–300 g con asistentes.',
 especies:'Medregal, sama, bocinegro, pargo, abade, jurel, peto.',
 svg:sv(fondo+barco(110,58)+ln('M130 44 Q150 40 150 60 V95')+`<rect x="146" y="95" width="8" height="20" rx="3" fill="#b0bec5" stroke="${LIN}"/>`+`<path d="M168 70 v40 M162 76 l6 -6 6 6 M162 104 l6 6 6 -6" stroke="#c0392b" stroke-width="2" fill="none"/>`+pez(195,112))},
{id:'submarina',n:'Pesca submarina',i:'🤿',donde:'agua',
 que:'Pesca a pulmón (en apnea, sin botella) con fusil o arpón. Requiere licencia específica y conocer bien la normativa.',
 rec:['¿Estás dentro del agua buceando a pulmón?','¿Usas fusil o arpón en vez de caña?'],
 equipo:'Traje de neopreno, gafas, tubo, aletas, plomos, fusil, boya de señalización obligatoria.',
 especies:'Sargo, vieja, salema, lisa, pulpo… Consulta la normativa de Canarias: hay especies prohibidas, tallas mínimas y zonas vedadas.',
 svg:sv(fondo+`<g transform="translate(110 92)"><ellipse cx="0" cy="0" rx="26" ry="7" fill="${LIN}"/><circle cx="-30" cy="-2" r="7" fill="${LIN}"/><path d="M24 0 l18 -8 v16z" fill="${LIN}"/><path d="M-36 4 h-40" stroke="#555" stroke-width="3"/></g>`+pez(20,92)+`<circle cx="150" cy="58" r="7" fill="${ACC}"/>`+ln('M150 65 L130 92',LIN,1))},
];
window.MODALIDADES=M;
const byId=id=>M.find(m=>m.id===id);
window.modNombre=id=>{const m=byId(id);return m?m.i+' '+m.n:''};

/* ---------- Hoja modal ---------- */
function hoja(html){let h=$('#hoja');if(!h){h=document.createElement('div');h.id='hoja';h.innerHTML='<div class="hojabg"></div><div class="hojac"><button class="hojax" aria-label="Cerrar">✕</button><div id="hojab"></div></div>';document.body.appendChild(h);
 h.querySelector('.hojabg').onclick=h.querySelector('.hojax').onclick=()=>h.hidden=true}
 $('#hojab').innerHTML=html;h.hidden=false;h.querySelector('.hojac').scrollTop=0}
function fichaHTML(m){return `<div class="mtit">${m.i} ${m.n}</div><div class="msvg">${m.svg}</div>
 <div class="consejo" style="margin:0 0 12px">${m.que}</div>
 <div class="t" style="margin:0 0 6px">¿Cómo sé que hago esto?</div><ul class="mrec">${m.rec.map(r=>`<li>✔ ${r}</li>`).join('')}</ul>
 <div class="t" style="margin:12px 0 6px">Equipo típico</div><div class="mtx">${m.equipo}</div>
 <div class="t" style="margin:12px 0 6px">Especies típicas en Canarias</div><div class="mtx">${m.especies}</div>`}
window.verModalidad=id=>hoja(fichaHTML(byId(id)));

/* ---------- Asistente ---------- */
const ARBOL={q:'¿Dónde estás pescando?',o:[
 ['🏝️ En tierra',{q:'¿Qué pones en el anzuelo?',o:[
   ['🪱 Cebo natural (gamba, sardina, cangrejo…)',{q:'¿Cómo pescas?',o:[['🏖️ Desde la playa, lanzando lejos con plomo pesado','surfcasting'],['🎈 Con un flotador (boya) que miro','corcheo'],['⚓ En el puerto o muelle, cerca y con caña ligera','ligera']]}],
   ['🐟 Señuelo artificial (de plástico o metal)',{q:'¿Cómo lo mueves?',o:[['↔️ Lanzo lejos y recojo por superficie o media agua','spinning'],['🪨 Señuelo pequeño de goma, despacio cerca del fondo entre piedras','rockfishing']]}]]}],
 ['🚤 En barco',{q:'¿El barco se mueve?',o:[
   ['🚢 Sí, navegando con motor y arrastro señuelos','currican'],
   ['⚓ No, está fondeado (con ancla)',{q:'¿Qué usas?',o:[['🪱 Cebo en el fondo con plomo','fondo'],['⚡ Señuelo de metal que subo y bajo en vertical','jigging']]}],
   ['🌬️ Va suelto, sin ancla y con motor parado',{q:'¿Qué usas?',o:[['🪱 Cebo cerca del fondo','deriva'],['⚡ Señuelo de metal que subo y bajo en vertical','jigging']]}]]}],
 ['🤿 Dentro del agua, buceando','submarina']]};
function asistente(nodo=ARBOL,paso=1,onElegir){
 if(typeof nodo==='string'){const m=byId(nodo);hoja(`<div class="small">Te sugerimos:</div>${fichaHTML(m)}
  ${onElegir?`<button class="btn green" style="margin:14px 0 6px;width:100%" id="asUsar">✔ Usar ${m.n}</button>`:''}<button class="btn sec" style="margin:6px 0;width:100%" id="asOtra">↺ Volver a empezar</button>`);
  if(onElegir)$('#asUsar').onclick=()=>{onElegir(nodo);$('#hoja').hidden=true};$('#asOtra').onclick=()=>asistente(ARBOL,1,onElegir);return}
 hoja(`<div class="mtit">🧭 No sé qué modalidad hago</div><div class="small">Pregunta ${paso}</div><div class="asq">${nodo.q}</div>`+nodo.o.map((o,i)=>`<button class="asop" data-i="${i}">${o[0]}</button>`).join(''));
 document.querySelectorAll('.asop').forEach(b=>b.onclick=()=>asistente(nodo.o[+b.dataset.i][1],paso+1,onElegir))}
window.asistenteModalidad=asistente;

/* ---------- Guía de modalidades (pantalla) ---------- */
window.verGuiaMod=function(){$('#gmLista').innerHTML=`<button class="btn" id="gmAsis">🧭 No sé qué modalidad hago</button>`+
 [['tierra','Desde tierra'],['barco','Desde barco'],['agua','En el agua']].map(([d,t])=>`<div class="t">${t}</div>`+M.filter(m=>m.donde===d).map(m=>`<div class="card nk gm" data-m="${m.id}"><div style="display:flex;gap:12px;align-items:center"><div class="gmi">${m.svg}</div><div><h3>${m.i} ${m.n}</h3><div class="small">${m.que.split('. ')[0]}.</div></div></div></div>`).join('')).join('');
 $('#gmAsis').onclick=()=>asistente()};
document.addEventListener('click',e=>{const g=e.target.closest('.gm');if(g)verModalidad(g.dataset.m)});

/* ---------- Selector en la ficha ---------- */
let sel='';
function pintarSel(){$('#modSel').innerHTML=M.map(m=>`<button data-m="${m.id}" class="${m.id===sel?'on':''}">${m.i} ${m.n}</button>`).join('')+`<button data-m="" class="${!sel?'on':''}">Sin indicar</button>`;
 $('#modInfo').textContent=sel?'ⓘ':'ⓘ'}
window.modFicha={get:()=>sel,reset(){sel=localStorage.getItem('ultimaModalidad')||'';pintarSel()},recordar(){if(sel)localStorage.setItem('ultimaModalidad',sel)}};
document.addEventListener('DOMContentLoaded',()=>{});
$('#modSel').addEventListener('click',e=>{const b=e.target.closest('button');if(!b)return;sel=b.dataset.m;pintarSel()});
$('#modInfo').onclick=()=>sel?verModalidad(sel):hoja(`<div class="mtit">ⓘ Modalidades de pesca</div><div class="small" style="margin-bottom:10px">Elige una para ver qué es, o usa el asistente.</div><button class="btn" style="width:100%;margin:0 0 10px" id="hAs">🧭 No sé qué modalidad hago</button>`+M.map(m=>`<button class="asop" data-m="${m.id}">${m.i} ${m.n}</button>`).join(''));
document.addEventListener('click',e=>{if(e.target.id==='hAs')asistente(ARBOL,1,id=>{sel=id;pintarSel()});const b=e.target.closest('#hojab .asop[data-m]');if(b)verModalidad(b.dataset.m)});
$('#modAsis').onclick=()=>asistente(ARBOL,1,id=>{sel=id;pintarSel()});
modFicha.reset();
})();
document.getElementById('gAsis').onclick=()=>window.asistenteModalidad();
