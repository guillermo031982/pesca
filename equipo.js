'use strict';
/* Mi equipo: inventario local (IndexedDB, almacén "equipo") */
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]));
const CATS={
 cana:{n:'Cañas',i:'🎣',f:[['longitud','Longitud (m)','Ej. 2,70','decimal'],['accion','Acción',['','Ultraligera','Ligera','Media','Media-pesada','Pesada','Extra pesada','Rápida','Moderada','Lenta (parabólica)']],['gramaje','Gramaje / potencia (g)','Ej. 10–40'],['tramos','Tramos','Ej. 2','numeric']]},
 carrete:{n:'Carretes',i:'⚙️',f:[['tamano','Tamaño','Ej. 3000'],['ratio','Ratio de recogida','Ej. 6.2:1'],['freno','Freno máx. (kg)','Ej. 9','decimal'],['capacidad','Capacidad','Ej. 0,30 mm / 150 m']]},
 linea:{n:'Líneas / hilos',i:'🧵',f:[['tipo','Tipo',['','Monofilamento','Fluorocarbono','Trenzado','Otro']],['diametro','Diámetro (mm)','Ej. 0,25','decimal'],['libraje','Resistencia (lb o kg)','Ej. 20 lb'],['metros','Metros','Ej. 300','numeric'],['color','Color','Ej. verde']]},
 senuelo:{n:'Señuelos',i:'🐟',f:[['tipo','Tipo',['','Vinilo','Minnow / pececillo','Paseante (superficie)','Popper','Jig metálico','Cucharilla','Pulpito / calamar','Egi (potera)','Otro']],['peso','Peso (g)','Ej. 20','decimal'],['tamano','Tamaño (cm)','Ej. 9','decimal'],['color','Color','Ej. sardina']]},
 anzuelo:{n:'Anzuelos / plomos',i:'🪝',f:[['tipo','Tipo',['','Anzuelo','Anzuelo circular','Anzuelo triple','Plomo','Emerillón','Bajo montado','Otro']],['tamano','Tamaño / número','Ej. nº 4 o 2/0'],['peso','Peso (g)','Ej. 100','decimal'],['cantidad','Cantidad','Ej. 10','numeric']]},
 embarcacion:{n:'Mis embarcaciones',i:'🚤',f:[['tipo','Tipo',['','Barco','Kayak','Pato (float tube)']],['eslora','Eslora (m)','Ej. 5,8','decimal'],['motor','Motor','Ej. 60 CV / sin motor'],['matricula','Matrícula o nombre','Ej. La Gaviota']]},
 otros:{n:'Otros',i:'🎒',f:[['tipo','Qué es','Ej. sacadera, nevera, frontal…']]}};
let catF='',modF='',editId=null,fotoTmp=null,modsTmp=[];
async function store(mode){const d=await window.pescaDB;return d.transaction('equipo',mode).objectStore('equipo')}
const req=r=>new Promise((ok,ko)=>{r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)});
const todos=async()=>req((await store('readonly')).getAll());
const guardar=async e=>req((await store('readwrite')).put(e));
const borrar=async id=>req((await store('readwrite')).delete(id));
window.equipoTodos=todos;window.equipoGuardar=guardar;
const nombre=e=>[e.marca,e.modelo].filter(Boolean).join(' ')||CATS[e.cat].n;
const resumen=e=>CATS[e.cat].f.map(([k,l])=>e.specs?.[k]?`${l.replace(/ \(.*\)/,'')}: ${e.specs[k]}`:'').filter(Boolean).join(' · ');
const MODS=()=>window.MODALIDADES||[];
function irA(id){document.querySelectorAll('.scr').forEach(s=>s.hidden=s.id!==id);document.querySelectorAll('.nav div').forEach(n=>n.classList.toggle('on',n.id==='n-equipo'));scrollTo(0,0)}

window.verEquipo=async function(){const all=(await todos()).sort((a,b)=>nombre(a).localeCompare(nombre(b)));
 $('#eqCat').innerHTML=`<button data-c="" class="${!catF?'on':''}">Todo (${all.length})</button>`+Object.entries(CATS).map(([k,c])=>`<button data-c="${k}" class="${catF===k?'on':''}">${c.i} ${c.n}</button>`).join('');
 $('#eqMod').innerHTML=`<button data-m="" class="${!modF?'on':''}">Cualquier modalidad</button>`+MODS().map(m=>`<button data-m="${m.id}" class="${modF===m.id?'on':''}">${m.i} ${m.n}</button>`).join('');
 const l=all.filter(e=>(!catF||e.cat===catF)&&(!modF||(e.mods||[]).includes(modF)));
 $('#eqLista').innerHTML=!all.length?'<div class="empty">Aún no has añadido equipo.<br>Pulsa <b>＋ Añadir</b> para guardar tu primera caña, carrete o señuelo.</div>':!l.length?'<div class="empty">Nada con ese filtro.</div>':
  l.map(e=>`<div class="card it eqi" data-id="${e.id}"><div class="fish">${e.foto?`<img src="${e.foto}">`:CATS[e.cat].i}</div><div style="min-width:0"><h3>${esc(nombre(e))}</h3><div class="small">${CATS[e.cat].i} ${CATS[e.cat].n}${resumen(e)?' · '+esc(resumen(e)):''}</div>${(e.mods||[]).length?`<div class="small">${e.mods.map(m=>window.modNombre?modNombre(m):m).join(' · ')}</div>`:''}</div></div>`).join('')};
document.addEventListener('click',e=>{const c=e.target.closest('#eqCat button');if(c){catF=c.dataset.c;verEquipo()}
 const m=e.target.closest('#eqMod button');if(m){modF=m.dataset.m;verEquipo()}
 const it=e.target.closest('.eqi');if(it)formulario(it.dataset.id)});
$('#eqNuevo').onclick=()=>formulario(null);

async function formulario(id){const e=id?(await todos()).find(x=>x.id===id):{cat:catF||'cana',specs:{},mods:modF?[modF]:[]};editId=id;fotoTmp=e.foto||null;modsTmp=[...(e.mods||[])];irA('s-equipof');
 $('#eqTit').textContent=id?'Editar equipo':'Nuevo equipo';
 $('#eqForm').innerHTML=`<div class="card"><div class="lab">Categoría</div><div class="chips msel" id="efCat">${Object.entries(CATS).map(([k,c])=>`<button type="button" data-c="${k}" class="${e.cat===k?'on':''}">${c.i} ${c.n}</button>`).join('')}</div>
 <div class="lab">Marca</div><input class="inp" id="efMarca" value="${esc(e.marca)}" placeholder="Ej. Shimano">
 <div class="lab">Modelo</div><input class="inp" id="efModelo" value="${esc(e.modelo)}" placeholder="Ej. Sedona 3000">
 <div class="websr"><button type="button" class="btn sec" id="efG">🔎 Buscar en Google</button><button type="button" class="btn sec" id="efT">🛒 Buscar en tienda</button></div>
 <div class="small" id="efWebHint">Abre una búsqueda con la marca y el modelo para consultar las características y copiarlas aquí.</div>
 <div id="efSpecs"></div>
 <div class="lab">Modalidades en las que lo usas</div><div class="chips msel" id="efMods"></div>
 <div class="lab">Foto · opcional</div><label class="fish efFoto"><input type="file" accept="image/*" id="efFile" hidden><img id="efImg" ${fotoTmp?`src="${fotoTmp}"`:'hidden'}><span id="efFh" ${fotoTmp?'hidden':''}>📷 Añadir foto</span></label>
 <div class="lab">Notas · opcional</div><textarea class="inp" id="efNotas" rows="3" style="height:auto;padding:12px">${esc(e.notas)}</textarea></div>
 <button class="btn green" id="efSave">💾 Guardar</button>${id?'<button class="btn del" id="efDel">🗑 Borrar</button>':''}`;
 let cat=e.cat;const specs={...(e.specs||{})};
 const pintaSpecs=()=>{$('#efSpecs').innerHTML=CATS[cat].f.map(([k,l,ph,im])=>`<div class="lab">${l}</div>`+(Array.isArray(ph)?`<select class="inp" data-k="${k}">${ph.map(o=>`<option ${specs[k]===o?'selected':''}>${o}</option>`).join('')}</select>`:`<input class="inp" data-k="${k}" value="${esc(specs[k])}" placeholder="${ph}" ${im?`inputmode="${im}"`:''}>`)).join('')};
 const leeSpecs=()=>document.querySelectorAll('#efSpecs [data-k]').forEach(i=>specs[i.dataset.k]=i.value.trim());
 const pintaMods=()=>$('#efMods').innerHTML=MODS().map(m=>`<button type="button" data-m="${m.id}" class="${modsTmp.includes(m.id)?'on':''}">${m.i} ${m.n}</button>`).join('');
 pintaSpecs();pintaMods();
 $('#efCat').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;leeSpecs();cat=b.dataset.c;document.querySelectorAll('#efCat button').forEach(x=>x.classList.toggle('on',x===b));pintaSpecs()};
 $('#efMods').onclick=ev=>{const b=ev.target.closest('button');if(!b)return;const m=b.dataset.m;modsTmp=modsTmp.includes(m)?modsTmp.filter(x=>x!==m):[...modsTmp,m];pintaMods()};
 const q=()=>[$('#efMarca').value,$('#efModelo').value].map(s=>s.trim()).filter(Boolean).join(' ');
 const abre=url=>{if(!q()){window.toastPesca&&toastPesca('Escribe primero la marca y el modelo');return}window.open(url,'_blank','noopener')};
 $('#efG').onclick=()=>abre(`https://www.google.com/search?q=${encodeURIComponent(q()+' '+({cana:'caña pesca',carrete:'carrete pesca',linea:'línea pesca',senuelo:'señuelo',anzuelo:'pesca',otros:'pesca'}[cat])+' características')}`);
 $('#efT').onclick=()=>abre(`https://www.decathlon.es/es/search?Ntt=${encodeURIComponent(q())}`);
 $('#efFile').onchange=async ev=>{const f=ev.target.files[0];if(!f)return;fotoTmp=await reducir(f);$('#efImg').src=fotoTmp;$('#efImg').hidden=false;$('#efFh').hidden=true};
 $('#efSave').onclick=async()=>{leeSpecs();const marca=$('#efMarca').value.trim(),modelo=$('#efModelo').value.trim();
  if(!marca&&!modelo){window.toastPesca&&toastPesca('Escribe al menos la marca o el modelo');return}
  const clean={};CATS[cat].f.forEach(([k])=>{if(specs[k])clean[k]=specs[k]});
  await guardar({id:editId||String(Date.now()),cat,marca,modelo,specs:clean,mods:modsTmp,foto:fotoTmp,notas:$('#efNotas').value.trim(),creado:e.creado||new Date().toISOString()});
  window.toastPesca&&toastPesca('Equipo guardado');irA('s-equipo');verEquipo()};
 if(id)$('#efDel').onclick=async()=>{if(confirm('¿Borrar este equipo? Las capturas ya guardadas conservan su nombre.')){await borrar(id);irA('s-equipo');verEquipo()}}}
function reducir(f,max=800){return new Promise(ok=>{const i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height));const c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(f)})}

/* ---------- Selector de equipo en la ficha de captura ---------- */
let selEq=[],cache=[];
async function pintaSel(){cache=(await todos()).filter(e=>e.cat!=='embarcacion');$('#eqLab').hidden=$('#eqSel').hidden=!cache.length;
 const mod=window.modFicha?modFicha.get():'';const orden=[...cache].sort((a,b)=>((b.mods||[]).includes(mod)-(a.mods||[]).includes(mod))||nombre(a).localeCompare(nombre(b)));
 $('#eqSel').innerHTML=orden.map(e=>`<button type="button" data-id="${e.id}" class="${selEq.includes(e.id)?'on':''}">${CATS[e.cat].i} ${esc(nombre(e))}</button>`).join('')}
$('#eqSel').addEventListener('click',ev=>{const b=ev.target.closest('button');if(!b)return;const id=b.dataset.id;selEq=selEq.includes(id)?selEq.filter(x=>x!==id):[...selEq,id];b.classList.toggle('on')});
document.getElementById('modSel')?.addEventListener('click',()=>setTimeout(pintaSel,0));
window.equipoFicha={reset(){selEq=[];pintaSel()},get:()=>selEq.map(id=>{const e=cache.find(x=>x.id===id);return e?{id,n:nombre(e),cat:e.cat}:null}).filter(Boolean)};
})();
