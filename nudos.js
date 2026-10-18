'use strict';
/* Nudos de pesca v2 – diagramas tipo cuerda dibujados por la app, con animación del extremo libre */
(function(){
const $=s=>document.querySelector(s);
const BG='#f4f8fb';
const COL={M:'#1565c0',T:'#ff8f00',B:'#2e9e4f'};
const LIGHT={M:'#a9c4e6',T:'#ffd699',B:'#b3dcc0'};
const NOMBRE={M:'línea principal',T:'extremo libre',B:'segunda línea'};
/* s(d,color,z,opts) – segmento de cuerda. z mayor = por encima */
const s=(d,c,z,o={})=>({d,c,z,...o});
/* vueltas alrededor de una línea horizontal en y; dir 1 = hacia la derecha */
function W(x0,y,n,p,r,c,dir=1,zf=8,zb=1){const a=[];for(let k=0;k<n;k++){const x=x0+dir*k*p,h=dir*p/2;
 a.push(s(`M${x} ${y+r} C${x+dir} ${y} ${x+h-dir*3} ${y-r} ${x+h} ${y-r}`,c,zf));
 a.push(s(`M${x+h} ${y-r} C${x+h+dir*3} ${y-r} ${x+2*h-dir} ${y} ${x+2*h} ${y+r}`,c,zb,{back:1}))}return a}
/* cruces alternos (retorcido de dos ramas) entre x0 y x1 */
function TW(x0,x1,y,r,n,c1,c2){const a=[],p=(x1-x0)/n;for(let k=0;k<n;k++){const x=x0+k*p,up=k%2===0;
 a.push(s(`M${x} ${y-r} C${x+p/2} ${y-r} ${x+p/2} ${y+r} ${x+p} ${y+r}`,c1,up?7:3));
 a.push(s(`M${x} ${y+r} C${x+p/2} ${y+r} ${x+p/2} ${y-r} ${x+p} ${y-r}`,c2,up?3:7))}return a}
const P=(x1,y1,x2,y2)=>({x1,y1,x2,y2}); // flecha de tirar
const RING=(x,y)=>({hw:'ring',x,y,z:4}),HOOK=(x,y)=>({hw:'hook',x,y,z:4}),SPOOL=()=>({hw:'spool',z:4}),LURE=(x,y)=>({hw:'lure',x,y,z:4});

const USOS={anzuelo:'Anzuelo, señuelo o emerillón',union:'Unir dos líneas',carrete:'Línea al carrete',lazos:'Bajos y lazos'};
/* Cada paso: t texto corto, a segmentos nuevos, f=true redibuja desde cero (nudo apretado), p flechas de tirar, tip etiqueta del extremo */
const N=[
{id:'palomar',n:'Palomar',u:'anzuelo',res:'90–95 %',dif:1,linea:'Trenzado, mono y fluoro. Ideal para trenzado.',para:'Atar anzuelos, emerillones y señuelos pequeños. Muy fuerte y fácil.',hw:[HOOK(112,92)],
 st:[{t:'Dobla 15 cm de línea y pasa la punta doble por el ojo del anzuelo.',a:[s('M335 92 H118','M',2,{dbl:1}),s('M118 92 C96 92 92 70 84 52','M',6,{dbl:1})],tip:'lazo'},
 {t:'Con el lazo, haz un nudo simple flojo sobre la línea doble.',a:[s('M84 52 C92 26 160 22 172 50 C178 66 176 80 174 100','M',8,{dbl:1}),s('M174 100 C172 122 146 126 142 108','M',8,{dbl:1}),s('M142 108 L146 74','M',1,{dbl:1}),s('M146 74 C150 52 178 44 200 40','M',8,{dbl:1})],tip:'lazo'},
 {t:'Pasa el anzuelo entero por dentro del lazo.',a:[s('M200 40 C262 24 262 168 120 170 C40 172 6 128 24 96','M',3,{dbl:1})],tip:'lazo'},
 {t:'Moja y tira a la vez de la línea principal y de la punta para cerrarlo sobre el ojo.',f:1,a:[s('M335 88 H136','M',2),...W(122,92,2,8,11,'M'),s('M138 98 C150 108 160 120 172 128','T',8)],p:[P(250,60,320,60),P(200,140,240,165)],tip:'punta'},
 {t:'Corta la punta sobrante a 3 mm. ¡Listo!',f:1,a:[s('M335 88 H136','M',2),...W(122,92,2,8,11,'M'),s('M138 98 L144 104','T',8)]}]},
{id:'clinch',n:'Clinch mejorado',u:'anzuelo',res:'85–95 %',dif:1,linea:'Mono y fluoro hasta ~0,60 mm. No con trenzado (resbala).',para:'El clásico para anzuelos, emerillones y señuelos.',hw:[RING(60,90)],
 st:[{t:'Pasa unos 15 cm de línea por la argolla.',a:[s('M335 82 H64','M',2),s('M64 82 C40 82 40 98 64 98','T',6),s('M64 98 H140','T',2)]},
 {t:'Da 5 vueltas con el extremo alrededor de la línea principal.',a:W(140,82,5,18,16,'T')},
 {t:'Vuelve y mete el extremo en el lazo pequeño junto a la argolla.',a:[s('M230 98 C256 146 120 152 98 114','T',7),s('M98 114 L98 90','T',1),s('M98 90 L98 58','T',8)]},
 {t:'Ahora mételo por el lazo grande que se acaba de formar.',a:[s('M98 58 C120 50 124 66 120 90','T',8),s('M120 90 L120 110','T',1),s('M120 110 C124 124 142 128 162 124','T',8)]},
 {t:'Moja y tira despacio de la línea principal: las vueltas bajan hasta la argolla.',f:1,a:[s('M335 88 H122','M',2),s('M84 88 C44 80 44 102 76 98','T',6),...W(86,88,6,6,10,'T'),s('M122 98 L136 116','T',8)],p:[P(240,60,320,60)]},
 {t:'Corta el sobrante a 2–3 mm. ¡Listo!',f:1,a:[s('M335 88 H122','M',2),s('M84 88 C44 80 44 102 76 98','T',6),...W(86,88,6,6,10,'T'),s('M122 98 L126 104','T',8)]}]},
{id:'uni',n:'Uni (Grinner)',u:'anzuelo',res:'85–90 %',dif:1,linea:'Todas: mono, fluoro y trenzado (con trenzado 8 vueltas).',para:'Nudo universal para anzuelo, emerillón o señuelo; base del Doble Uni.',hw:[RING(60,90)],
 st:[{t:'Pasa 15–20 cm por la argolla y deja el extremo junto a la línea principal.',a:[s('M335 80 H64','M',2),s('M64 80 C40 80 40 96 64 96','T',6),s('M64 96 H230','T',2)]},
 {t:'Dobla el extremo hacia atrás formando un lazo encima de las dos líneas.',a:[s('M230 96 C268 96 268 34 226 34 C190 34 152 40 142 58','T',8)]},
 {t:'Pasa el extremo por detrás de las dos líneas y da 5 vueltas por dentro del lazo.',a:[s('M142 58 L142 110','T',1),...W(142,88,5,16,22,'T'),s('M222 110 C232 126 250 126 262 118','T',8)]},
 {t:'Tira del extremo para cerrar las vueltas: queda como un barril.',f:1,a:[s('M335 80 H64','M',2),s('M64 80 C40 80 40 96 64 96','T',6),s('M64 96 H150','T',2),...W(150,88,5,6,14,'T'),s('M180 102 L196 120','T',8)],p:[P(200,132,236,160)]},
 {t:'Tira de la línea principal: el nudo baja hasta la argolla. Aprieta y corta.',f:1,a:[s('M335 88 H112','M',2),s('M80 84 C44 78 44 100 76 98','T',6),...W(82,88,5,6,13,'T'),s('M112 102 L118 108','T',8)],p:[P(240,60,320,60)]}]},
{id:'dobleuni',n:'Doble Uni',u:'union',res:'80–90 %',dif:2,linea:'Trenzado a mono/fluoro, o mono a mono. Con trenzado, 8 vueltas.',para:'Unir línea madre y bajo. Fácil de hacer en el barco.',hw:[],col2:1,
 st:[{t:'Junta las dos puntas, solapadas unos 20 cm y en sentidos contrarios.',a:[s('M5 80 H236','M',2),s('M335 96 H104','B',2)],tip:'punta verde'},
 {t:'Con la punta azul haz un lazo y da 4 vueltas sobre las dos líneas.',a:[s('M236 80 C272 80 272 36 236 36 C208 36 196 46 190 60','M',8),s('M190 60 L190 112','M',1),...W(190,88,4,12,24,'M'),s('M238 112 L252 128','M',8)],tip:'punta azul'},
 {t:'Aprieta ese nudo tirando de la punta azul.',f:1,a:[s('M5 80 H210','M',2),s('M335 96 H104','B',2),...W(196,88,4,6,14,'M'),s('M220 102 L232 116','M',8)],p:[P(236,120,262,146)]},
 {t:'Repite con la punta verde: lazo y 4 vueltas sobre las dos líneas.',a:[s('M104 96 C68 96 68 140 104 140 C130 140 142 128 150 116','B',8),s('M150 116 L150 64','B',1),...W(150,88,4,12,24,'B',-1),s('M102 64 L88 48','B',8)],tip:'punta verde'},
 {t:'Aprieta el verde y tira de las dos líneas: los nudos se juntan. Corta las puntas.',f:1,a:[s('M5 82 H186','M',2),s('M335 94 H150','B',2),...W(150,88,4,6,13,'B'),...W(178,88,4,6,13,'M'),s('M206 102 L212 108','M',8),s('M150 74 L144 68','B',8)],p:[P(90,56,20,56),P(250,56,320,56)]}]},
{id:'albright',n:'Albright',u:'union',res:'85–95 %',dif:2,linea:'Diámetros muy distintos: fina (trenzado o mono) a bajo grueso.',para:'Unir línea fina a un bajo grueso (peces con dientes o roca).',hw:[],col2:1,
 st:[{t:'Dobla el bajo grueso (verde) formando un lazo.',a:[s('M335 66 H146 C108 66 108 110 146 110 H262','B',2,{w:1.4})],tip:'punta verde'},
 {t:'Mete la línea fina (azul) por dentro del lazo unos 20 cm.',a:[s('M5 88 H104','M',3),s('M104 88 H130','M',1),s('M130 88 H232','M',3)],tip:'punta azul'},
 {t:'Enróllala hacia la curva del lazo sobre las tres líneas: 8–10 vueltas apretadas.',a:[s('M232 88 L232 116','M',1),...W(232,88,8,10,28,'M',-1)],tip:'punta azul'},
 {t:'Saca la punta azul por el lazo, por el mismo lado por el que entró.',a:[s('M152 116 C138 114 128 100 122 94','M',8),s('M122 94 L100 98','M',1),s('M100 98 C88 102 84 114 90 126','M',8)],tip:'punta azul'},
 {t:'Moja, tira despacio de la fina por los dos lados y luego de las líneas principales. Corta.',f:1,a:[s('M335 70 H170 C150 70 150 106 170 106 H214','B',2,{w:1.4}),s('M5 88 H164','M',3),...W(166,88,8,6,22,'M'),s('M214 106 L220 112','B',8)],p:[P(90,56,20,56),P(250,46,320,46)]}]},
{id:'fg',n:'FG',u:'union',res:'90–95 %',dif:3,linea:'Trenzado a bajo de fluorocarbono o mono.',para:'La unión más fina y fuerte de trenzado a bajo; pasa por las anillas sin engancharse.',hw:[],col2:1,
 st:[{t:'Tensa el trenzado (azul). Coloca el bajo (verde) a lo largo, con su punta hacia la caña.',a:[s('M5 88 H335','M',2,{w:.8}),s('M335 98 H120','B',3,{w:1.3})],tip:'punta del bajo'},
 {t:'Enrolla el trenzado sobre el bajo cruzando una vez por arriba y otra por abajo (20 pares).',a:TW(290,150,93,14,10,'M','M').map(x=>({...x,w:.8}))},
 {t:'Bloquea con 2 medios nudos del trenzado sobre las dos líneas.',a:W(150,93,2,8,15,'M',-1).map(x=>({...x,w:.8}))},
 {t:'Moja y aprieta MUY fuerte tirando del bajo y del trenzado. Corta la punta del bajo.',f:1,a:[s('M5 88 H335','M',2,{w:.8}),s('M335 98 H140','B',3,{w:1.3}),...TW(290,150,93,10,10,'M','M').map(x=>({...x,w:.8})),...W(150,93,2,7,12,'M',-1).map(x=>({...x,w:.8}))],p:[P(90,60,20,60),P(250,130,320,130)]},
 {t:'Remata con 5 medios nudos del trenzado solo sobre el trenzado y corta.',a:W(134,88,5,7,10,'M',-1).map(x=>({...x,w:.8}))}]},
{id:'cirujano',n:'Cirujano',u:'union',res:'85–90 %',dif:1,linea:'Mono y fluoro de diámetros parecidos.',para:'Unir línea y bajo rápido. El bajo debe ser corto: se pasa entero por el nudo.',hw:[],col2:1,
 st:[{t:'Solapa las dos líneas unos 15 cm, en sentidos contrarios.',a:[s('M5 84 H250','M',2),s('M335 96 H90','B',2)]},
 {t:'Con las dos juntas, haz un lazo cruzando por encima.',a:[s('M210 90 C246 90 246 36 210 36 C180 36 176 66 190 108','M',7,{pair:1})]},
 {t:'Pasa las dos puntas por el lazo (1ª vez).',a:[s('M190 108 C198 124 218 116 214 76','M',1,{pair:1})]},
 {t:'Pásalas otra vez por el mismo lazo (2ª vez).',a:[s('M214 76 C216 52 186 50 184 70','M',8,{pair:1}),s('M184 70 L192 112','M',1,{pair:1}),s('M192 112 C204 130 230 120 228 80','M',1,{pair:1}),s('M228 80 C230 58 262 52 300 56','M',8,{pair:1})]},
 {t:'Moja y tira de las cuatro puntas a la vez. Corta las puntas.',f:1,a:[s('M5 86 H170','M',2),s('M335 94 H190','B',2),...W(166,90,3,8,12,'B'),...W(170,90,3,8,10,'M'),s('M195 104 L202 112','M',8),s('M166 76 L160 68','B',8)],p:[P(90,56,20,56),P(250,56,320,56)]}]},
{id:'rapala',n:'Rapala (lazo para señuelo)',u:'anzuelo',res:'85–90 %',dif:2,linea:'Mono y fluorocarbono.',para:'Deja un lazo libre en el señuelo para que nade con más movimiento.',hw:[LURE(30,90),RING(66,90)],
 st:[{t:'Haz un nudo simple flojo a unos 10 cm de la punta.',a:[s('M335 88 H196','M',3),s('M196 88 C166 88 158 46 184 42 C210 38 214 72 204 104','T',7),s('M204 104 C198 114 182 112 178 98','T',8),s('M178 98 L182 74','T',1),s('M182 74 C170 60 140 70 126 88','T',8)]},
 {t:'Pasa la punta por la argolla del señuelo.',a:[s('M126 88 H70','T',2),s('M70 88 C46 88 46 104 70 104','T',6),s('M70 104 H136','T',2)]},
 {t:'Vuelve a meter la punta por el nudo simple, por donde salió.',a:[s('M136 104 C160 106 176 102 188 94','T',1),s('M188 94 C204 86 220 96 232 104','T',8)]},
 {t:'Da 3 vueltas con la punta a la línea principal.',a:W(232,88,3,16,16,'T')},
 {t:'Vuelve a pasar la punta por el nudo simple (por detrás).',a:[s('M280 104 C290 136 206 136 198 102','T',1)]},
 {t:'Mete la punta por el lazo que acabas de formar.',a:[s('M198 102 C204 66 252 66 258 112','T',8)]},
 {t:'Moja y tira de la línea, la punta y el señuelo a la vez: queda un lazo libre. Corta.',f:1,a:[s('M335 88 H150','M',2),s('M70 84 C46 80 46 100 70 100 C100 104 120 98 136 92','T',6),s('M78 82 C100 74 124 80 136 86','M',2),...W(136,90,3,7,10,'T'),s('M158 100 L164 106','T',8)],p:[P(250,58,320,58),P(50,140,14,150)]}]},
{id:'arbor',n:'Arbor (al carrete)',u:'carrete',res:'No crítico',dif:1,linea:'Todas. Con trenzado, pon antes cinta o unas vueltas de mono para que no patine.',para:'Atar la línea a la bobina antes de llenarla.',hw:[SPOOL()],
 st:[{t:'Da una vuelta con la línea alrededor de la bobina.',a:[s('M335 60 H132','M',6),s('M132 60 C96 60 96 112 132 112','T',6),s('M132 112 H220','T',6)]},
 {t:'Haz un nudo simple con la punta alrededor de la línea principal.',a:[s('M220 112 C240 112 244 80 240 46','T',8),s('M240 46 C236 32 218 36 222 52','T',8),s('M222 52 L224 72','T',1),s('M224 72 C228 88 248 90 262 82','T',8)]},
 {t:'Haz otro nudo simple solo en la punta: hace de tope.',a:[s('M262 82 C276 72 286 88 272 94 C260 98 262 82 280 78 L296 76','T',8)]},
 {t:'Tira de la línea principal: el nudo baja hasta la bobina y aprieta. Corta.',f:1,a:[s('M335 60 H152','M',6),s('M152 60 C96 56 96 112 132 112 C150 112 156 90 152 66','T',6),...W(144,60,2,7,9,'T'),`STOP:160,74`],p:[P(250,40,320,40)]}]},
{id:'dropper',n:'Dropper loop (lazo de bajo)',u:'lazos',res:'≈80 %',dif:2,linea:'Mono y fluorocarbono.',para:'Hacer lazos en mitad del aparejo para colgar anzuelos.',hw:[],
 st:[{t:'Haz un lazo en la línea (unos 10 cm), cruzando los dos lados.',tip:'',a:[s('M5 110 H140','M',3),s('M140 110 C180 110 196 40 168 40 C144 40 152 96 200 110','M',7),s('M200 110 H335','M',3)]},
 {t:'Retuerce un lado del lazo sobre el otro: 5–6 vueltas, dejando un hueco en el centro.',f:1,tip:'',a:[s('M5 110 H90','M',3),...TW(90,150,110,8,3,'M','M'),...TW(170,230,110,8,3,'M','M'),s('M150 102 C126 30 194 30 170 102','M',5),s('M150 118 C155 122 165 122 170 118','M',5),s('M230 110 H335','M',3)],tip:'hueco'},
 {t:'Pasa la parte de arriba del lazo por el hueco del centro, hacia abajo.',a:[s('M160 50 L160 100','M',1,{ghost:1}),s('M152 112 C140 160 182 160 168 112','M',8)],tip:'lazo'},
 {t:'Sujeta el lazo y tira de los dos extremos: las vueltas se cierran.',f:1,tip:'',a:[s('M5 110 H138','M',3),...TW(138,182,110,6,5,'M','M'),s('M182 110 H335','M',3),s('M154 116 C126 176 194 176 166 116','M',8)],p:[P(90,80,20,80),P(250,80,320,80)]}]},
{id:'bimini',n:'Bimini twist',u:'lazos',res:'95–100 %',dif:3,linea:'Mono y trenzado. Pesca de altura.',para:'Crear una línea doble muy resistente antes de unir el bajo.',hw:[],
 st:[{t:'Dobla 1 m de línea formando un lazo largo.',a:[s('M335 80 H60','M',3),s('M60 80 C30 80 30 100 60 100','M',3),s('M60 100 H300','T',3)]},
 {t:'Gira el lazo 20 vueltas: las dos ramas se retuercen.',f:1,a:[s('M90 82 C10 50 10 130 90 98','M',3),...TW(90,220,90,8,8,'M','T'),s('M220 82 H335','M',3),s('M220 98 H300','T',3)]},
 {t:'Abre el lazo (rodilla o pies) y separa las ramas: las vueltas se juntan.',f:1,a:[s('M20 30 L104 84','M',3),s('M20 150 L104 96','M',3),...TW(104,180,90,6,6,'M','T'),s('M180 84 L335 60','M',3),s('M180 96 L300 134','T',3)]},
 {t:'Con la principal tensa, suelta la punta despacio: se enrolla sola sobre las vueltas.',a:[s('M300 134 C240 120 200 110 180 104','T',8),...W(180,90,7,11,14,'T',-1)]},
 {t:'Medio nudo con la punta sobre una rama del lazo, luego sobre la otra.',a:[s('M103 104 C90 112 80 90 92 80','T',8),s('M92 80 L86 64','T',8)]},
 {t:'Remata con un medio nudo de 3–5 vueltas sobre las dos ramas. Aprieta y corta.',f:1,a:[s('M20 30 L104 84','M',3),s('M20 150 L104 96','M',3),...TW(104,180,90,6,6,'M','T'),...W(180,90,7,10,13,'T',-1).map(x=>x),s('M180 84 L335 60','M',3),...W(70,90,3,7,22,'T',-1),s('M49 112 L42 120','T',8)],p:[P(250,40,320,30)]}]},
];
const DIF=['','Fácil','Media','Difícil'];

/* ---------- Motor de dibujo ---------- */
function hwSvg(h){if(h.hw==='ring')return `<g><circle cx="${h.x}" cy="${h.y}" r="14" fill="none" stroke="#37474f" stroke-width="10"/><circle cx="${h.x}" cy="${h.y}" r="14" fill="none" stroke="#b0bec5" stroke-width="5"/><path d="M${h.x-10} ${h.y-9} a14 14 0 0 1 12 -5" stroke="#fff" stroke-width="2" fill="none"/></g>`;
 if(h.hw==='hook'){const x=h.x,y=h.y,d=`M${x-9} ${y} H${x-80} C${x-112} ${y} ${x-112} ${y+56} ${x-78} ${y+56} C${x-56} ${y+56} ${x-48} ${y+40} ${x-46} ${y+20}`;
  return `<g fill="none" stroke-linecap="round"><path d="${d}" stroke="#37474f" stroke-width="10"/><path d="${d}" stroke="#b0bec5" stroke-width="5"/><path d="M${x-46} ${y+20} l-10 10" stroke="#37474f" stroke-width="6"/><circle cx="${x}" cy="${y}" r="9" stroke="#37474f" stroke-width="9"/><circle cx="${x}" cy="${y}" r="9" stroke="#b0bec5" stroke-width="4"/></g><text x="${x-104}" y="${y+76}" class="lb">anzuelo</text>`}
 if(h.hw==='lure')return `<g><path d="M${h.x+26} ${h.y} C${h.x+10} ${h.y-22} ${h.x-30} ${h.y-20} ${h.x-36} ${h.y} C${h.x-30} ${h.y+20} ${h.x+10} ${h.y+22} ${h.x+26} ${h.y}z" fill="#ffcc80" stroke="#37474f" stroke-width="3"/><circle cx="${h.x+8}" cy="${h.y-4}" r="4" fill="#37474f"/></g><text x="${h.x-30}" y="${h.y+38}" class="lb">señuelo</text>`;
 if(h.hw==='spool')return `<g><rect x="96" y="20" width="16" height="140" rx="6" fill="#90a4ae" stroke="#37474f" stroke-width="3"/><rect x="108" y="40" width="44" height="100" fill="#cfd8dc" stroke="#37474f" stroke-width="3"/><rect x="148" y="20" width="16" height="140" rx="6" fill="#90a4ae" stroke="#37474f" stroke-width="3"/></g><text x="96" y="176" class="lb">bobina</text>`;return ''}
function segSvg(g,old,id){
 const w=g.w||1,col=old?LIGHT[g.c]:COL[g.c],ol=old?'#c3cfd8':'#0b2a3f',dash=g.ghost?' stroke-dasharray="6 6"':'';
 const lay=(d,extra='')=>{if(g.dbl)return `<path d="${d}" class="L" stroke="${BG}" stroke-width="${22}" ${extra}/><path d="${d}" class="L" stroke="${ol}" stroke-width="${17}" ${extra}/><path d="${d}" class="L" stroke="${col}" stroke-width="${13}" ${extra}/><path d="${d}" class="L" stroke="${ol}" stroke-width="2" ${extra}/>`;
  return `<path d="${d}" class="L" stroke="${BG}" stroke-width="${16*w}" ${extra}/><path d="${d}" class="L" stroke="${ol}" stroke-width="${11*w}"${dash} ${extra}/><path d="${d}" class="L" stroke="${col}" stroke-width="${7*w}"${dash} ${extra}/>${old||g.ghost?'':`<path d="${d}" class="L rope" stroke-width="${2*w}" ${extra}/>`}`};
 if(g.pair){const a={...g,pair:0,c:'M'},b={...g,pair:0,c:'B'};return `<g ${id?`data-s="${id}"`:''}><g transform="translate(0,-5)">${segSvg(a,old).replace(/^<g[^>]*>|<\/g>$/g,'')}</g><g transform="translate(0,5)">${segSvg(b,old).replace(/^<g[^>]*>|<\/g>$/g,'')}</g></g>`}
 return `<g ${id?`data-s="${id}"`:''} data-c="${g.c}">${lay(g.d)}</g>`}
function pullSvg(p){return `<path d="M${p.x1} ${p.y1}L${p.x2} ${p.y2}" class="pull" marker-end="url(#pa)"/>`}
const DEFS=`<defs><marker id="pa" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M0 0L10 5L0 10z" fill="#d32f2f"/></marker></defs>`;
function pasoInfo(k,i){let j=0;for(let x=0;x<=i;x++)if(k.st[x].f)j=x;const old=[],neu=[];for(let x=j;x<=i;x++)k.st[x].a.forEach(g=>(x===i&&!k.st[i].f?neu:old).push(g));
 if(k.st[i].f){old.length=0;k.st[i].a.forEach(g=>neu.push(g))}return {old,neu,fin:!!k.st[i].f}}
function dibujar(k,i){const {old,neu,fin}=pasoInfo(k,i);
 const items=[...k.hw.map(h=>({...h,kind:'hw'})),...old.filter(g=>typeof g==='object').map(g=>({...g,kind:'o'})),...neu.filter(g=>typeof g==='object').map((g,n)=>({...g,kind:'n',n}))];
 items.sort((a,b)=>a.z-b.z);
 let body=items.map(it=>it.kind==='hw'?hwSvg(it):segSvg(it,it.kind==='o'&&!fin,it.kind==='n'?'n'+it.n:'')).join('');
 [...old,...neu].filter(g=>typeof g==='string'&&g.startsWith('STOP')).forEach(g=>{const [x,y]=g.slice(5).split(',');body+=`<circle cx="${x}" cy="${y}" r="7" fill="${COL.T}" stroke="#0b2a3f" stroke-width="3"/>`});
 const pulls=(k.st[i].p||[]).map(pullSvg).join('');
 const leyenda=k.col2?`<rect x="8" y="7" width="22" height="9" rx="3" fill="${COL.M}"/><text x="34" y="16" class="lb">línea 1</text><rect x="100" y="7" width="22" height="9" rx="3" fill="${COL.B}"/><text x="126" y="16" class="lb">línea 2</text>`:`<rect x="8" y="7" width="22" height="9" rx="3" fill="${COL.M}"/><text x="34" y="16" class="lb">línea principal</text><rect x="140" y="7" width="22" height="9" rx="3" fill="${COL.T}"/><text x="166" y="16" class="lb">extremo libre</text>`;
 return `<svg viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg" class="kn">${DEFS}<rect width="340" height="180" fill="${BG}"/>${leyenda}${body}<g class="pulls">${pulls}</g><g class="deco"></g></svg>`}
/* decora: punta (círculo + flecha) y etiqueta al final del último segmento nuevo */
function decorar(svg,k,i,pt){const st=k.st[i];const deco=svg.querySelector('.deco');deco.innerHTML='';
 const segs=[...svg.querySelectorAll('[data-s]')];if(!segs.length)return null;
 const last=segs.sort((a,b)=>+a.dataset.s.slice(1)-+b.dataset.s.slice(1)).pop();const path=last.querySelector('path');const L=path.getTotalLength();
 const at=pt!=null?pt:L,p=path.getPointAtLength(at),q=path.getPointAtLength(Math.max(0,at-4));const ang=Math.atan2(p.y-q.y,p.x-q.x)*180/Math.PI;
 if(st.tip==='')return null;
 const c=last.dataset.c||'M',lbl=st.tip||(st.f?'':(k.col2?(c==='B'?'punta verde':'punta azul'):'extremo libre'));
 const [tx,ty]=lpos(p,ang);
 deco.innerHTML=`<g transform="translate(${p.x} ${p.y}) rotate(${ang})"><circle r="8" fill="${COL[c]||COL.T}" stroke="#fff" stroke-width="3"/><path d="M4 -7 L14 0 L4 7z" fill="#0b2a3f"/></g><text x="${tx}" y="${ty}" text-anchor="middle" class="lb tipl">${lbl}</text>`;return path}

function lpos(p,ang){const r=ang*Math.PI/180;let x=p.x+Math.cos(r)*36,y=p.y+Math.sin(r)*30+4;return [Math.min(300,Math.max(40,x)),Math.min(172,Math.max(30,y))]}
/* ---------- Lista ---------- */
let filtro='todos';
const norm=s=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
function chips(){$('#nFiltro').innerHTML=[['todos','Todos'],...Object.entries(USOS)].map(([k,v])=>`<button data-f="${k}" class="${k===filtro?'on':''}">${v}</button>`).join('')}
window.verNudos=function(){chips();const q=norm($('#nBuscar').value||'');
 const lista=N.filter(k=>(filtro==='todos'||k.u===filtro)&&(!q||norm(k.n+' '+k.para+' '+USOS[k.u]+' '+k.linea).includes(q)));
 const grupos=Object.keys(USOS).filter(u=>lista.some(k=>k.u===u));
 $('#nLista').innerHTML=lista.length?grupos.map(u=>`<div class="t">${USOS[u]}</div>`+lista.filter(k=>k.u===u).map(k=>`<div class="card nk" data-k="${k.id}"><h3>${k.n}</h3><div class="small">${k.para}</div><span class="pill d${k.dif}">${DIF[k.dif]}</span><span class="pill">💪 ${k.res}</span><span class="pill">${k.st.length} pasos</span></div>`).join('')).join(''):'<div class="empty">No hay nudos con ese filtro.</div>'};
function detalle(id){const k=N.find(x=>x.id===id);document.querySelectorAll('.scr').forEach(s=>s.hidden=s.id!=='s-nudo');scrollTo(0,0);
 $('#nTit').textContent=k.n;
 $('#nDet').innerHTML=`<div class="player"><div class="pstage" id="pStage"></div><div class="pcap" id="pCap"></div>
 <div class="pctl"><button id="pPrev" aria-label="Paso anterior">⏮</button><button id="pPlay" class="pmain" aria-label="Pausa">⏸</button><button id="pNext" aria-label="Paso siguiente">⏭</button><button id="pVel" class="pvel" aria-label="Velocidad">1×</button></div></div>
 <div class="card"><div class="row"><span>Uso</span><b>${USOS[k.u]}</b></div><div class="row"><span>Resistencia</span><b>${k.res}</b></div><div class="row"><span>Dificultad</span><b><span class="pill d${k.dif}" style="margin:0">${DIF[k.dif]}</span></b></div><div class="row" style="display:block"><span>Línea recomendada</span><div style="margin-top:4px">${k.linea}</div></div></div>
 <div class="consejo">🎯 ${k.para}</div><div class="t">Paso a paso</div><div class="card"><ol class="pasos">${k.st.map((p,i)=>`<li data-i="${i}">${p.t}<div class="pdiag">${dibujar(k,i)}</div></li>`).join('')}</ol></div>
 <div class="consejo">💧 Moja siempre el nudo antes de apretar y comprueba tirando fuerte. La resistencia es aproximada.</div>
 <div class="small" style="text-align:center;margin:10px 18px">Lo nuevo de cada paso va en color fuerte; lo anterior, atenuado. El círculo con flecha es la punta que mueves. Donde una línea pasa por debajo, la de arriba la “corta”.</div>`;
 document.querySelectorAll('.pdiag svg').forEach((sv,i)=>decorar(sv,k,i));Player.start(k)}
document.addEventListener('click',e=>{const f=e.target.closest('#nFiltro button');if(f){filtro=f.dataset.f;verNudos()}
 const k=e.target.closest('.nk[data-k]');if(k)detalle(k.dataset.k)});
document.addEventListener('input',e=>{if(e.target.id==='nBuscar')verNudos()});
window.NUDOS=N;

/* ---------- Reproductor: la punta recorre el camino ---------- */
const VELS=[1,2,0.5],MS_PX=11;
const Player={k:null,i:0,on:true,v:1,t:0,last:0,raf:0,plan:null,
 start(k){this.k=k;this.on=true;this.bind();this.ui();this.show(0);cancelAnimationFrame(this.raf);this.last=performance.now();this.raf=requestAnimationFrame(t=>this.tick(t))},
 bind(){$('#pPlay').onclick=()=>{this.on=!this.on;this.ui()};$('#pPrev').onclick=()=>this.go(-1);$('#pNext').onclick=()=>this.go(1);
  $('#pVel').onclick=()=>{this.v=VELS[(VELS.indexOf(this.v)+1)%VELS.length];this.ui()};
  document.querySelectorAll('.pasos li').forEach(li=>li.onclick=()=>{this.show(+li.dataset.i);scrollTo({top:0,behavior:'smooth'})})},
 ui(){$('#pPlay').textContent=this.on?'⏸':'▶';$('#pPlay').setAttribute('aria-label',this.on?'Pausa':'Reproducir');$('#pVel').textContent=String(this.v).replace('.',',')+'×'},
 go(d){const n=this.k.st.length;this.show((this.i+d+n)%n)},
 show(i){const k=this.k,st=$('#pStage');if(!st)return;this.i=i;this.t=0;
  document.querySelectorAll('.pasos li').forEach(li=>li.classList.toggle('act',+li.dataset.i===i));
  $('#pCap').innerHTML=`<b>Paso ${i+1}/${k.st.length}</b> ${k.st[i].t}`;
  st.innerHTML=dibujar(k,i);const svg=st.querySelector('svg');this.svg=svg;
  const fin=k.st[i].f;const segs=[...svg.querySelectorAll('[data-s]')].sort((a,b)=>+a.dataset.s.slice(1)-+b.dataset.s.slice(1));
  let t=500;const plan=[];
  if(!fin)segs.forEach(g=>{const ps=[...g.querySelectorAll('path')];const L=ps[0].getTotalLength();const d=Math.max(500,L*MS_PX);
   ps.forEach(p=>{p.style.strokeDasharray=`${L} ${L+20}`;p.style.strokeDashoffset=L});plan.push({g,ps,L,t0:t,d});t+=d});
  else{svg.querySelectorAll('[data-s],.deco').forEach(g=>g.style.opacity=0)}
  this.plan={segs:plan,fin,end:t+(fin?1200:0)+(k.st[i].p?1800:0)+2200,fade:fin?{t0:t,d:900,els:[...svg.querySelectorAll('[data-s]')]}:null,pulls:svg.querySelector('.pulls')};
  if(!fin)decorar(svg,k,i,0),svg.querySelector('.deco').style.opacity=0;else decorar(svg,k,i);
  this.frame()},
 frame(){const P=this.plan,t=this.t,svg=this.svg;if(!P||!svg)return;
  let cur=null;P.segs.forEach(s=>{const f=Math.min(1,Math.max(0,(t-s.t0)/s.d));s.ps.forEach(p=>p.style.strokeDashoffset=s.L*(1-f));if(t>=s.t0)cur={s,f}});
  const deco=svg.querySelector('.deco');
  if(cur){deco.style.opacity=1;const path=cur.s.ps[0],L=cur.s.L,at=L*cur.f,p=path.getPointAtLength(at),q=path.getPointAtLength(Math.max(0,at-4)),ang=Math.atan2(p.y-q.y,p.x-q.x)*180/Math.PI;
   const g=deco.querySelector('g');if(g)g.setAttribute('transform',`translate(${p.x} ${p.y}) rotate(${ang})`);const tl=deco.querySelector('.tipl');if(tl){const [lx,ly]=lpos(p,ang);tl.setAttribute('x',lx);tl.setAttribute('y',ly)}}
  if(P.fade){const f=Math.min(1,Math.max(0,(t-P.fade.t0+400)/P.fade.d));P.fade.els.forEach(e=>e.style.opacity=f);deco.style.opacity=f}
  const pulls=P.pulls;if(pulls){const tp=t-(P.fade?P.fade.t0+P.fade.d:P.segs.length?P.segs[P.segs.length-1].t0+P.segs[P.segs.length-1].d:500);pulls.style.opacity=tp>0?1:0;pulls.style.transform=tp>0?`translate(${Math.sin(tp/180)*3}px,0)`:'';}
  if(t>=P.end){this.show((this.i+1)%this.k.st.length)}},
 tick(now){const dt=now-this.last;this.last=now;if(!$('#s-nudo')){return}if($('#s-nudo').hidden||!document.contains(this.svg)){this.raf=requestAnimationFrame(t=>this.tick(t));return}
  if(this.on){this.t+=dt*this.v;this.frame()}this.raf=requestAnimationFrame(t=>this.tick(t))}};
window.PlayerNudos=Player;
})();
