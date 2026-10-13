'use strict';
/* Nudos de pesca – datos y diagramas SVG esquemáticos propios */
(function(){
const A='#0077b6',B='#e07a00',G='#7d93a3';
const S=c=>`<svg viewBox="0 0 300 110" xmlns="http://www.w3.org/2000/svg"><defs><marker id="ar" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto"><path d="M0 0L10 5L0 10z" fill="#c0392b"/></marker></defs>${c}</svg>`;
const L=(d,c=A,w=4)=>`<path d="${d}" fill="none" stroke="${c}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round"/>`;
const E=(x,y)=>`<circle cx="${x}" cy="${y}" r="11" fill="none" stroke="${G}" stroke-width="5"/>`;
const H=(x,y)=>`<g fill="none" stroke="${G}" stroke-width="5" stroke-linecap="round"><circle cx="${x}" cy="${y}" r="8"/><path d="M${x-8} ${y} h-70 a22 22 0 0 0 44 0 l-6 -8"/></g>`;
const C=(x,y,n,w=10,c=A,ry=14)=>Array.from({length:n},(_,i)=>`<ellipse cx="${x+i*w}" cy="${y}" rx="${w*0.55}" ry="${ry}" fill="none" stroke="${c}" stroke-width="3"/>`).join('');
const R=(x1,y1,x2,y2)=>`<path d="M${x1} ${y1}L${x2} ${y2}" stroke="#c0392b" stroke-width="2.5" stroke-dasharray="5 4" marker-end="url(#ar)"/>`;
const T=(x,y,t)=>`<text x="${x}" y="${y}" font-size="12" fill="#5b7385" font-family="sans-serif">${t}</text>`;
const tag=(x,y,t='chicote')=>T(x,y,t);

const USOS={anzuelo:'Anzuelo, señuelo o emerillón',union:'Unir dos líneas',carrete:'Línea al carrete',lazos:'Bajos y lazos'};
const N=[
{id:'palomar',n:'Palomar',u:'anzuelo',res:'90–95 %',dif:1,linea:'Trenzado, monofilamento y fluorocarbono. Ideal para trenzado.',para:'Atar anzuelos, emerillones y señuelos pequeños. Muy fuerte y fácil.',
p:[['Dobla unos 15 cm de línea y pasa el lazo (la línea doble) por el ojo del anzuelo.',S(E(70,55)+L('M300 45 H70 M300 65 H70 M70 45 a10 10 0 0 0 0 20')+L('M70 45 H40 a10 10 0 0 0 0 20 H70')+T(160,30,'línea doble'))],
 ['Con la línea doble, haz un nudo simple flojo, sin apretar. El anzuelo queda colgando del nudo.',S(E(40,55)+L('M300 50 H160 c-40 0 -40 40 -10 40 s20 -40 -20 -40 H40 M40 60 H150')+T(150,105,'nudo simple flojo'))],
 ['Pasa el anzuelo entero a través del lazo que sobresale.',S(H(150,55)+L('M300 55 H170 c-20 0 -20 -30 0 -30 c30 0 30 30 0 30')+R(110,30,160,40))],
 ['Humedece, tira de las dos ramas a la vez para cerrarlo pegado al ojo y corta el sobrante a 3 mm.',S(E(60,55)+L('M300 55 H90')+C(80,55,2,8)+L('M74 50 l-6 -15',A,3)+T(120,40,'apretar y cortar'))]]},
{id:'clinch',n:'Clinch mejorado',u:'anzuelo',res:'85–95 %',dif:1,linea:'Monofilamento y fluorocarbono hasta ~0,60 mm. No recomendado con trenzado (resbala).',para:'El clásico para anzuelos, emerillones y señuelos.',
p:[['Pasa unos 15 cm de línea por el ojo del anzuelo o emerillón.',S(E(50,55)+L('M300 50 H50 a6 6 0 0 0 0 12 H180')+tag(185,65))],
 ['Enrolla el chicote alrededor de la línea principal 5–7 vueltas (menos vueltas si la línea es gruesa).',S(E(40,55)+L('M300 50 H40 a6 6 0 0 0 0 12 H80')+C(90,56,6,12)+tag(170,85,'5–7 vueltas'))],
 ['Pasa el chicote por el pequeño lazo que queda junto al ojo.',S(E(40,55)+L('M300 50 H120 M40 50 a6 6 0 0 0 0 12 H70')+C(80,56,5,10)+L('M130 56 C160 90 60 100 55 60',B)+R(150,95,70,75))],
 ['Ahora pásalo por el lazo grande que se acaba de formar (el paso "mejorado").',S(E(40,55)+L('M300 50 H120 M40 50 a6 6 0 0 0 0 12 H70')+C(80,56,5,10)+L('M55 60 C60 20 120 20 110 50',B)+R(70,20,105,40))],
 ['Humedece, tira suave de la línea principal para que las espiras bajen ordenadas hasta el ojo. Corta el sobrante.',S(E(40,55)+L('M300 55 H60')+C(58,55,5,7)+T(120,40,'apretar despacio'))]]},
{id:'uni',n:'Uni (Grinner)',u:'anzuelo',res:'85–90 %',dif:1,linea:'Todas: mono, fluoro y trenzado (con trenzado da 8–10 vueltas).',para:'Nudo universal para anzuelo, emerillón o señuelo; base del Doble Uni.',
p:[['Pasa unos 15 cm por el ojo y lleva el chicote paralelo a la línea principal, formando un lazo encima de ambas.',S(E(40,55)+L('M300 60 H40 a6 6 0 0 0 0 -12 H200 c30 0 30 -35 0 -35 h-60 c-20 0 -20 30 0 40')+tag(130,10,'lazo'))],
 ['Desde dentro del lazo, enrolla el chicote alrededor de las dos líneas 5–7 veces.',S(E(40,55)+L('M300 56 H40')+C(110,56,6,12)+L('M100 56 c-10 -40 110 -40 80 0',A,3)+T(110,100,'5–7 vueltas por dentro'))],
 ['Humedece y tira del chicote para cerrar las vueltas (queda como un barril).',S(E(40,55)+L('M300 56 H40')+C(120,56,6,7)+L('M160 56 l30 -25',B,3)+R(170,40,200,20))],
 ['Tira de la línea principal para deslizar el nudo hasta el ojo. Aprieta fuerte y corta.',S(E(40,55)+L('M300 56 H52')+C(58,56,6,6)+R(150,40,260,40))]]},
{id:'dobleuni',n:'Doble Uni',u:'union',res:'80–90 %',dif:2,linea:'Trenzado a mono/fluoro, o mono a mono. Con trenzado, 8–10 vueltas.',para:'Unir línea madre y bajo de diámetros parecidos o distintos. Fácil de hacer en el barco.',
p:[['Solapa los extremos de las dos líneas unos 20 cm, en sentidos opuestos.',S(L('M10 45 H220')+L('M80 65 H290',B)+T(110,95,'solape 20 cm'))],
 ['Con el chicote azul haz un lazo y enróllalo 5–7 veces sobre las dos líneas (un Uni). Ciérralo.',S(L('M10 45 H150')+L('M60 55 H290',B)+C(150,52,5,8)+L('M190 52 l20 -20'))],
 ['Repite lo mismo con el chicote naranja sobre la otra línea, en sentido contrario.',S(L('M10 52 H290',G,2)+C(60,52,5,8,B)+C(200,52,5,8))],
 ['Humedece y tira de las dos líneas principales: los dos nudos se deslizan hasta tocarse. Aprieta y corta los chicotes.',S(L('M10 52 H140')+L('M160 52 H290',B)+C(118,52,4,6,B)+C(160,52,4,6)+R(100,25,20,25)+R(200,25,280,25))]]},
{id:'albright',n:'Albright',u:'union',res:'85–95 %',dif:2,linea:'Líneas de diámetros muy distintos: trenzado o mono fino a bajo grueso de fluoro/mono.',para:'Unir línea fina a un bajo grueso (por ejemplo para peces con dientes).',
p:[['Dobla el bajo grueso (naranja) formando un lazo de unos 8 cm.',S(L('M290 40 H90 a15 15 0 0 0 0 30 H220',B,5))],
 ['Mete la línea fina (azul) unos 25 cm por dentro del lazo.',S(L('M290 40 H90 a15 15 0 0 0 0 30 H220',B,5)+L('M10 55 H200'))],
 ['Enróllala de vuelta hacia la curva del lazo, sobre sí misma y las dos ramas del bajo, 10–12 vueltas apretadas.',S(L('M290 40 H90 a15 15 0 0 0 0 30 H220',B,5)+L('M10 55 H200')+C(110,55,9,9,A,20)+T(120,100,'10–12 vueltas'))],
 ['Saca el chicote fino por el lazo por el mismo lado por el que entró.',S(L('M290 40 H90 a15 15 0 0 0 0 30 H220',B,5)+L('M10 55 H80')+C(110,55,9,9,A,20)+L('M110 75 C70 100 60 70 85 55')+R(60,95,80,70))],
 ['Humedece. Tira despacio de las dos puntas de la línea fina para asentar las vueltas, luego de las líneas principales. Corta.',S(L('M290 44 H120 M120 66 H200',B,5)+L('M10 55 H115')+C(130,55,9,6,A,16))]]},
{id:'fg',n:'FG',u:'union',res:'90–95 %',dif:3,linea:'Trenzado a bajo de fluorocarbono o mono.',para:'La unión más fina y fuerte de trenzado a bajo; pasa sin engancharse por las anillas.',
p:[['Mantén el trenzado tenso (sujeto con los dientes o al carrete con freno). Cruza el bajo por encima.',S(L('M10 55 H290')+L('M60 20 L230 90',B,5))],
 ['Enrolla el trenzado alrededor del bajo cruzando alternativamente por arriba y por abajo: 15–20 pares (unas 30 vueltas).',S(L('M10 55 H290',B,5)+Array.from({length:12},(_,i)=>L(`M${60+i*14} 35 L${74+i*14} 75`,A,3)).join('')+T(90,100,'arriba / abajo alternando'))],
 ['Sujeta las vueltas y haz 2–3 medios nudos con el trenzado alrededor de las dos líneas.',S(L('M10 55 H290',B,5)+Array.from({length:10},(_,i)=>L(`M${40+i*14} 35 L${54+i*14} 75`,A,3)).join('')+C(200,55,3,10))],
 ['Humedece y aprieta MUY fuerte tirando del bajo y del trenzado a la vez. Corta el chicote del bajo a 2–3 mm.',S(L('M10 55 H200',B,5)+C(60,55,14,8,A,8)+R(40,25,10,25)+R(230,25,290,25))],
 ['Remata con 5–6 medios nudos del trenzado solo sobre el trenzado, y corta.',S(L('M10 55 H170',B,5)+C(60,55,10,8,A,8)+L('M170 55 H290')+C(185,55,5,9))]]},
{id:'cirujano',n:'Cirujano',u:'union',res:'85–90 %',dif:1,linea:'Mono y fluoro de diámetros parecidos (también mono a trenzado fino).',para:'Unir línea y bajo rápidamente. El bajo debe ser corto, porque se pasa entero por el nudo.',
p:[['Solapa las dos líneas unos 15 cm, en sentidos opuestos.',S(L('M10 45 H220')+L('M80 65 H290',B))],
 ['Con las dos líneas juntas, como si fueran una, haz un nudo simple (pasando el bajo entero).',S(L('M10 50 H120 c40 0 40 45 10 45 s-10 -45 30 -45 H290',A)+L('M10 56 H120 c40 0 40 45 10 45 s-10 -45 30 -45 H290',B))],
 ['Pasa otra vez las dos puntas por el mismo lazo (doble). Para el triple, una tercera vez.',S(L('M10 52 H110 c50 0 50 50 15 50 s-10 -50 40 -50 H290',A)+L('M120 70 c20 -20 40 -20 50 0',B)+R(110,95,140,80))],
 ['Humedece y tira de los cuatro extremos a la vez. Corta los chicotes.',S(L('M10 52 H140')+L('M160 52 H290',B)+C(145,52,3,6,G,10)+R(60,25,15,25)+R(240,25,285,25))]]},
{id:'rapala',n:'Rapala (lazo para señuelo)',u:'anzuelo',res:'85–90 %',dif:2,linea:'Monofilamento y fluorocarbono.',para:'Deja un lazo libre en el ojo del señuelo para que nade con más movimiento natural.',
p:[['Haz un nudo simple flojo a unos 10 cm del final de la línea.',S(L('M290 55 H160 c-40 0 -40 40 -10 40 s20 -40 -20 -40 H60'))],
 ['Pasa el chicote por el ojo del señuelo y vuelve a meterlo por el nudo simple, por el mismo lado por el que salió.',S(E(30,55)+L('M290 55 H160 c-40 0 -40 40 -10 40 s20 -40 -20 -40 H30 a6 6 0 0 0 0 12 H140',A)+R(80,85,135,70))],
 ['Enrolla el chicote 3 veces alrededor de la línea principal.',S(E(30,55)+L('M290 55 H40 a6 6 0 0 0 0 12 H120')+C(160,55,3,12)+tag(150,95,'3 vueltas'))],
 ['Pasa el chicote de vuelta por el nudo simple (por detrás) y luego por el lazo que se acaba de formar.',S(E(30,55)+L('M290 55 H40 a6 6 0 0 0 0 12 H110')+C(160,55,3,10)+L('M185 55 C190 95 120 95 120 60',B)+R(180,95,125,75))],
 ['Humedece y tira a la vez del chicote, la línea y el señuelo. Debe quedar un lazo pequeño libre. Corta.',S(E(30,55)+L('M290 55 H90 M41 55 c10 -12 40 -12 49 0 c-10 12 -40 12 -49 0')+C(92,55,3,6)+T(40,30,'lazo libre'))]]},
{id:'arbor',n:'Arbor (al carrete)',u:'carrete',res:'No crítico',dif:1,linea:'Todas. Con trenzado, pon antes una cinta o unas vueltas de mono para que no patine.',para:'Atar la línea a la bobina del carrete antes de llenarla.',
p:[['Da una vuelta con la línea alrededor de la bobina.',S(`<rect x="110" y="20" width="80" height="70" rx="10" fill="#dde7ee" stroke="${G}" stroke-width="3"/>`+L('M10 30 H150 a25 25 0 1 1 -1 0 M150 80 H250'))],
 ['Con el chicote, haz un nudo simple alrededor de la línea principal.',S(`<rect x="110" y="20" width="80" height="70" rx="10" fill="#dde7ee" stroke="${G}" stroke-width="3"/>`+L('M10 30 H190')+C(220,30,2,10)+L('M232 30 H270'))],
 ['Haz un segundo nudo simple solo en el chicote, cerca del final (hace de tope).',S(`<rect x="110" y="20" width="80" height="70" rx="10" fill="#dde7ee" stroke="${G}" stroke-width="3"/>`+L('M10 30 H190')+C(220,30,2,10)+L('M232 30 H260')+`<circle cx="268" cy="30" r="7" fill="${A}"/>`)],
 ['Tira de la línea principal: el nudo se desliza hasta la bobina y el tope lo bloquea. Corta el sobrante.',S(`<rect x="110" y="20" width="80" height="70" rx="10" fill="#dde7ee" stroke="${G}" stroke-width="3"/>`+L('M10 30 H160')+C(165,30,2,8)+`<circle cx="185" cy="30" r="6" fill="${A}"/>`+R(90,15,20,15))]]},
{id:'dropper',n:'Dropper loop (lazo de bajo)',u:'lazos',res:'≈80 %',dif:2,linea:'Monofilamento y fluorocarbono.',para:'Hacer lazos en mitad del aparejo para colgar anzuelos (paternóster, aparejos de fondo).',
p:[['Haz un lazo de 10–15 cm en la línea, cruzando los dos lados.',S(L('M10 80 H120 C160 80 170 10 150 10 C130 10 140 80 180 80 H290'))],
 ['Gira un lado del lazo alrededor del otro 5–7 veces (como retorciendo), dejando un hueco en el centro.',S(L('M10 80 H70 M230 80 H290')+C(85,80,7,10,A,12)+L('M150 70 C130 20 170 20 150 70')+T(125,15,'hueco central'))],
 ['Abre el hueco del centro de las vueltas y pasa por él la parte de arriba del lazo.',S(L('M10 80 H70 M230 80 H290')+C(85,80,3,10)+C(175,80,3,10)+L('M150 80 C130 30 170 30 150 80')+R(150,25,150,70))],
 ['Sujeta el lazo (con un dedo o los dientes), humedece y tira de los dos extremos. Las vueltas se cierran y el lazo queda perpendicular.',S(L('M10 80 H130 M170 80 H290')+C(130,80,6,7,A,8)+L('M150 74 C120 10 180 10 150 74')+R(80,100,20,100)+R(220,100,280,100))]]},
{id:'bimini',n:'Bimini twist',u:'lazos',res:'95–100 %',dif:3,linea:'Mono y trenzado. Para pesca de altura y líneas que trabajan al límite.',para:'Crear una línea doble muy resistente antes de unir el bajo (no pierde casi nada de fuerza).',
p:[['Dobla aproximadamente 1 m de línea formando un lazo largo.',S(L('M290 45 H60 a10 10 0 0 0 0 20 H290'))],
 ['Gira el extremo del lazo 20 vueltas para retorcer las dos ramas juntas.',S(L('M290 45 H220 M290 65 H220 M60 45 a10 10 0 0 0 0 20')+L('M60 45 H90 M60 65 H90')+Array.from({length:10},(_,i)=>L(`M${90+i*13} 45 L${103+i*13} 65 M${90+i*13} 65 L${103+i*13} 45`,A,3)).join('')+T(110,95,'20 vueltas'))],
 ['Abre el lazo (por ejemplo sobre la rodilla) y separa las ramas para que las vueltas se compacten.',S(L('M30 20 L100 55 L30 90',G,3)+Array.from({length:8},(_,i)=>L(`M${100+i*12} 48 L${112+i*12} 62 M${100+i*12} 62 L${112+i*12} 48`,A,3)).join('')+L('M196 55 L290 35 M196 55 L290 80'))],
 ['Con la línea principal tensa, afloja poco a poco el chicote en ángulo recto: se enrolla solo sobre las vueltas hacia el lazo.',S(L('M30 20 L100 55 L30 90',G,3)+C(110,55,8,10,B,10)+L('M190 55 L290 40')+L('M190 55 L250 100',B)+R(240,90,200,90))],
 ['Sin perder tensión, haz un medio nudo del chicote sobre una rama del lazo, otro sobre la otra rama, y remata con un medio nudo de 3–5 vueltas alrededor de las dos ramas. Aprieta y corta.',S(L('M30 20 L100 55 L30 90',G,3)+C(110,55,8,8,B,10)+C(185,55,3,7,A,9)+L('M210 55 H290'))]]},
];
const DIF=['','Fácil','Media','Difícil'];
let filtro='todos';
const $=s=>document.querySelector(s);
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function chips(){$('#nFiltro').innerHTML=[['todos','Todos'],...Object.entries(USOS)].map(([k,v])=>`<button data-f="${k}" class="${k===filtro?'on':''}">${v}</button>`).join('')}
window.verNudos=function(){chips();const q=norm($('#nBuscar').value||'');
 const lista=N.filter(k=>(filtro==='todos'||k.u===filtro)&&(!q||norm(k.n+' '+k.para+' '+USOS[k.u]+' '+k.linea).includes(q)));
 const grupos=Object.keys(USOS).filter(u=>lista.some(k=>k.u===u));
 $('#nLista').innerHTML=lista.length?grupos.map(u=>`<div class="t">${USOS[u]}</div>`+lista.filter(k=>k.u===u).map(k=>`<div class="card nk" data-k="${k.id}"><h3>${k.n}</h3><div class="small">${k.para}</div><span class="pill d${k.dif}">${DIF[k.dif]}</span><span class="pill">💪 ${k.res}</span></div>`).join('')).join(''):'<div class="empty">No hay nudos con ese filtro.</div>'};
function detalle(id){const k=N.find(x=>x.id===id);document.querySelectorAll('.scr').forEach(s=>s.hidden=s.id!=='s-nudo');scrollTo(0,0);
 $('#nTit').textContent=k.n;
 $('#nDet').innerHTML=`<div class="player"><div class="pstage" id="pStage"></div><div class="pcap" id="pCap"></div>
 <div class="pctl"><button id="pPrev" aria-label="Paso anterior">⏮</button><button id="pPlay" class="pmain" aria-label="Pausa">⏸</button><button id="pNext" aria-label="Paso siguiente">⏭</button><button id="pVel" class="pvel" aria-label="Velocidad">1×</button></div></div>
 <div class="card"><div class="row"><span>Uso</span><b>${USOS[k.u]}</b></div><div class="row"><span>Resistencia</span><b>${k.res}</b></div><div class="row"><span>Dificultad</span><b><span class="pill d${k.dif}" style="margin:0">${DIF[k.dif]}</span></b></div><div class="row" style="display:block"><span>Línea recomendada</span><div style="margin-top:4px">${k.linea}</div></div></div>
 <div class="consejo">🎯 ${k.para}</div><div class="t">Paso a paso</div><div class="card"><ol class="pasos">${k.p.map(([t,s],i)=>`<li data-i="${i}">${t}${s||''}</li>`).join('')}</ol></div>
 <div class="consejo">💧 Humedece siempre el nudo con agua o saliva antes de apretar, y comprueba tirando fuerte. La resistencia es aproximada y depende de la línea y de lo bien hecho que esté.</div>
 <div class="small" style="text-align:center;margin:10px 18px">Azul: línea principal · Naranja: segunda línea / bajo · Gris: anzuelo, anilla o bobina</div>`;Player.start(k)}
document.addEventListener('click',e=>{const f=e.target.closest('#nFiltro button');if(f){filtro=f.dataset.f;verNudos()}
 const k=e.target.closest('.nk[data-k]');if(k)detalle(k.dataset.k)});
document.addEventListener('input',e=>{if(e.target.id==='nBuscar')verNudos()});
window.NUDOS=N;
/* ---------- Reproductor animado (dibujo progresivo de la línea) ---------- */
const VELS=[0.5,1,2];
const Player={k:null,i:0,on:true,v:1,anims:[],tok:0,
 start(k){this.k=k;this.i=0;this.on=true;this.bind();this.ui();this.show(0)},
 bind(){$('#pPlay').onclick=()=>this.toggle();$('#pPrev').onclick=()=>this.go(-1);$('#pNext').onclick=()=>this.go(1);
  $('#pVel').onclick=()=>{this.v=VELS[(VELS.indexOf(this.v)+1)%VELS.length];this.anims.forEach(a=>a.playbackRate=this.v);this.ui()};
  document.querySelectorAll('.pasos li').forEach(li=>li.onclick=()=>{this.show(+li.dataset.i);scrollTo({top:0,behavior:'smooth'})})},
 ui(){$('#pPlay').textContent=this.on?'⏸':'▶';$('#pPlay').setAttribute('aria-label',this.on?'Pausa':'Reproducir');$('#pVel').textContent=String(this.v).replace('.',',')+'×'},
 toggle(){this.on=!this.on;this.anims.forEach(a=>this.on?a.play():a.pause());this.ui()},
 go(d){const n=this.k.p.length;this.show((this.i+d+n)%n)},
 show(i){const k=this.k,st=$('#pStage');if(!st)return;this.i=i;const tok=++this.tok;this.anims.forEach(a=>a.cancel());this.anims=[];
  document.querySelectorAll('.pasos li').forEach(li=>li.classList.toggle('act',+li.dataset.i===i));
  $('#pCap').innerHTML=`<b>Paso ${i+1}/${k.p.length}</b> ${k.p[i][0]}`;
  st.innerHTML=k.p[i][1]||'';const svg=st.querySelector('svg');if(!svg)return;
  const els=[...svg.querySelectorAll('path,ellipse,circle,rect,text')].filter(e=>!e.closest('defs'));
  const R=this.v,an=(el,kf,o)=>{const a=el.animate(kf,{fill:'both',easing:'ease-in-out',...o});a.playbackRate=R;if(!this.on)a.pause();this.anims.push(a);return a};
  an(svg,[{opacity:0,transform:'translateX(12px)'},{opacity:1,transform:'none'}],{duration:350});
  let t=300;
  els.forEach(el=>{const fixed=el.getAttribute('stroke')===G||el.closest('g')||el.tagName==='rect'||el.tagName==='text'||el.getAttribute('stroke-dasharray')||el.getAttribute('fill')&&el.getAttribute('fill')!=='none';
   if(fixed){const isHw=el.getAttribute('stroke')===G||el.closest('g')||el.tagName==='rect';an(el,[{opacity:0},{opacity:1}],{duration:300,delay:isHw?0:t});if(!isHw)t+=150;return}
   let L=0;try{L=el.getTotalLength()}catch(e){}if(!L)return;
   el.style.strokeDasharray=L;const d=Math.max(180,Math.min(1400,L*4));an(el,[{strokeDashoffset:L},{strokeDashoffset:0}],{duration:d,delay:t});t+=d*0.85});
  const hold=an(svg,[{opacity:1},{opacity:1},{opacity:0}],{duration:1500,delay:t+600,fill:'forwards'});
  hold.finished.then(()=>{if(tok!==this.tok||$('#s-nudo').hidden)return;this.show((this.i+1)%k.p.length)}).catch(()=>{})}};
window.PlayerNudos=Player;
})();
