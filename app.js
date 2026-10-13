'use strict';
const $=s=>document.querySelector(s);
const ESPECIES=['Vieja','Sama','Bocinegro','Abade','Cherne','Mero','Sargo','Sargo breado','Salema','Boga','Chicharro','Caballa','Bicuda','Medregal','Pejeverde','Pejeperro','Brecas','Breca','Chopa','Morena','Pulpo','Calamar','Choco','Jurel','Pargo','Dorado','Atún','Bonito','Petos','Lisa'];
let foto=null, especieSel='', ultimo=null, mapa=null, capaPins=null;

/* ---------- IndexedDB ---------- */
const db=new Promise((ok,ko)=>{const r=indexedDB.open('pesca',1);r.onupgradeneeded=()=>r.result.createObjectStore('capturas',{keyPath:'id'});r.onsuccess=()=>ok(r.result);r.onerror=()=>ko(r.error)});
async function tx(mode,fn){const d=await db;return new Promise((ok,ko)=>{const t=d.transaction('capturas',mode);const q=fn(t.objectStore('capturas'));t.oncomplete=()=>ok(q&&q.result);t.onerror=()=>ko(t.error)})}
const guardar=c=>tx('readwrite',s=>s.put(c)), todas=()=>tx('readonly',s=>s.getAll()), borrar=id=>tx('readwrite',s=>s.delete(id));

/* ---------- Navegación ---------- */
function ir(id,tab){document.querySelectorAll('.scr').forEach(s=>s.hidden=s.id!==id);document.body.classList.toggle('dk',id==='s-cam');
 document.querySelectorAll('.nav div').forEach(n=>n.classList.remove('on'));
 if(id==='s-cam'){$('#n-cam').classList.add('on');reset()}
 if(id==='s-hist'){verHist(tab||'L')}
 if(id==='s-nudos'||id==='s-nudo')$('#n-nudos').classList.add('on');if(id==='s-nudos'&&window.verNudos)verNudos();scrollTo(0,0)}
document.addEventListener('click',e=>{const g=e.target.closest('[data-go]');if(g)ir(g.dataset.go,g.dataset.tab)});
function toast(m,ms=2800){const t=$('#toast');t.textContent=m;t.hidden=false;clearTimeout(t._t);t._t=setTimeout(()=>t.hidden=true,ms)}

/* ---------- 1 Cámara ---------- */
function reset(){foto=null;especieSel='';$('#prev').hidden=true;$('#shotHint').hidden=false;$('#idbox').hidden=true;$('#okBtn').disabled=true;$('#file').value='';
 ['esp','talla','peso','nota'].forEach(i=>$('#'+i).value='')}
$('#file').addEventListener('change',async e=>{const f=e.target.files[0];if(!f)return;foto=await reducir(f);$('#prev').src=foto;$('#prev').hidden=false;$('#shotHint').hidden=true;
 $('#idbox').hidden=false;pintarChips();const r=await identificarEspecie(foto);mostrarId(r)});
function reducir(f,max=1024){return new Promise(ok=>{const i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height));const c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(f)})}
function pintarChips(){$('#chips').innerHTML=ESPECIES.slice(0,12).map(e=>`<button class="${e===especieSel?'on':''}">${e}</button>`).join('')}
$('#chips').addEventListener('click',e=>{if(e.target.tagName!=='BUTTON')return;especieSel=e.target.textContent;pintarChips();$('#okBtn').disabled=false});
$('#okBtn').onclick=()=>abrirFicha(especieSel);
$('#manBtn').onclick=()=>abrirFicha('',true);
function abrirFicha(esp,foco){ir('s-ficha');$('#fimg').src=foto||'';$('#fimg').hidden=!foto;$('#esp').value=esp;if(foco)setTimeout(()=>$('#esp').focus(),50)}

/* Punto de enchufe para un modelo de visión.
   Debe devolver [{nombre,confianza}] ordenado o [] si no hay modelo.
   Ej.: return (await fetch(URL_API,{method:'POST',body:JSON.stringify({imagen:dataUrl})})).json(); */
const VISION_URL=''; // dejar vacío = sin identificación automática
async function identificarEspecie(dataUrl){
 if(!VISION_URL)return [];
 try{const r=await fetch(VISION_URL,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({imagen:dataUrl})});return await r.json()}catch(e){return []}}
function mostrarId(res){if(!res.length)return;const [a,b]=res;especieSel=a.nombre;$('#okBtn').disabled=false;
 $('#idres').innerHTML=`<b>${a.nombre}</b><div class="bar"><i style="width:${Math.round(a.confianza*100)}%"></i></div><div class="small" style="color:#1b9e6a;font-weight:bold">${Math.round(a.confianza*100)} % de confianza${b?` · Otras: ${b.nombre} ${Math.round(b.confianza*100)} %`:''}</div>`;$('#okBtn').textContent='✔ Es correcto';pintarChips()}
$('#esplist').innerHTML=ESPECIES.map(e=>`<option value="${e}">`).join('');

/* ---------- Datos automáticos ---------- */
function gps(){return new Promise((ok,ko)=>navigator.geolocation?navigator.geolocation.getCurrentPosition(p=>ok(p.coords),ko,{enableHighAccuracy:true,timeout:20000,maximumAge:60000}):ko(new Error('sin GPS')))}
async function zona(lat,lon){try{const r=await(await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14&accept-language=es`)).json();const a=r.address||{};
 return [a.hamlet||a.village||a.suburb||a.town||a.city||a.municipality||r.name,a.island||a.county||a.state].filter(Boolean).filter((v,i,x)=>x.indexOf(v)===i).join(', ')||'Mar abierto'}catch(e){return 'Zona no disponible'}}
async function marea(lat,lon,t=new Date()){
 const r=await(await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${lat}&longitude=${lon}&hourly=sea_level_height_msl&timezone=GMT&past_days=1&forecast_days=2&cell_selection=sea`)).json();
 const T=r.hourly.time.map(s=>Date.parse(s+'Z')),H=r.hourly.sea_level_height_msl;
 if(H.every(v=>v==null))throw new Error('sin datos de marea aquí');
 const now=t.getTime();let i=T.findIndex(x=>x>now)-1;if(i<0)i=0;
 const f=(now-T[i])/3600000,alt=H[i]+(H[i+1]-H[i])*f,sube=H[i+1]>H[i];
 let ext=null;for(let j=i+1;j<H.length-1;j++){if(sube?(H[j]>=H[j-1]&&H[j]>=H[j+1]):(H[j]<=H[j-1]&&H[j]<=H[j+1])){ext={t:T[j],h:H[j]};break}}
 return {altura:+alt.toFixed(2),estado:sube?'Subiendo':'Bajando',proxima:ext?{tipo:sube?'Pleamar':'Bajamar',hora:new Date(ext.t).toISOString(),altura:+ext.h.toFixed(2)}:null}}
function luna(d=new Date()){const S=29.530588853,ref=Date.UTC(2000,0,6,18,14);let e=((d-ref)/864e5)%S;if(e<0)e+=S;const ilu=Math.round((1-Math.cos(2*Math.PI*e/S))/2*100);
 const n=[['Luna nueva','🌑'],['Creciente','🌒'],['Cuarto creciente','🌓'],['Gibosa creciente','🌔'],['Luna llena','🌕'],['Gibosa menguante','🌖'],['Cuarto menguante','🌗'],['Menguante','🌘']][Math.floor((e/S)*8+.5)%8];
 return {fase:n[0],icono:n[1],iluminacion:ilu,edad:+e.toFixed(1)}}

/* ---------- 2 Guardar ---------- */
$('#saveBtn').onclick=async()=>{const esp=$('#esp').value.trim();if(!esp){toast('Escribe o elige la especie');$('#esp').focus();return}
 const b=$('#saveBtn');b.disabled=true;b.textContent='⏳ Guardando…';const ahora=new Date();
 const c={id:ahora.getTime()+'',fecha:ahora.toISOString(),especie:esp,talla:num('#talla'),peso:num('#peso'),nota:$('#nota').value.trim(),foto,luna:luna(ahora),gps:null,zona:'',marea:null,errores:[]};
 try{const p=await gps();c.gps={lat:+p.latitude.toFixed(5),lon:+p.longitude.toFixed(5),precision:Math.round(p.accuracy)};
  const [z,m]=await Promise.allSettled([zona(c.gps.lat,c.gps.lon),marea(c.gps.lat,c.gps.lon,ahora)]);c.zona=z.value||'';
  if(m.status==='fulfilled')c.marea=m.value;else c.errores.push('Marea: '+(m.reason.message||'sin conexión'))}
 catch(e){c.errores.push('GPS: '+(e.message||'permiso denegado'))}
 await guardar(c);ultimo=c;b.disabled=false;b.textContent='💾 GUARDAR';confirmar(c)};
const num=s=>{const v=parseFloat($(s).value.replace(',','.'));return isNaN(v)?null:v};

/* ---------- 3 Confirmación / detalle ---------- */
const hora=iso=>new Date(iso).toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'});
const fechaTxt=iso=>new Date(iso).toLocaleDateString('es-ES',{day:'2-digit',month:'2-digit',year:'numeric'})+' · '+hora(iso);
const sub=c=>[c.especie,c.talla&&c.talla+' cm',c.peso&&String(c.peso).replace('.',',')+' kg'].filter(Boolean).join(' · ');
function filas(c){const m=c.marea,R=(a,b)=>`<div class="row"><span>${a}</span><b>${b}</b></div>`;
 return (m?R('🌊 Marea',m.estado+(m.estado==='Subiendo'?' ↑':' ↓'))+(m.proxima?R('Próxima '+m.proxima.tipo.toLowerCase(),hora(m.proxima.hora)+' · '+fmt(m.proxima.altura)+' m'):'')+R('Altura ahora',fmt(m.altura)+' m'):R('🌊 Marea','No disponible'))
 +R(c.luna.icono+' Luna',c.luna.fase+' '+c.luna.iluminacion+' %')
 +R('📍 Zona',c.zona||'—')+R('Coordenadas',c.gps?`${Math.abs(c.gps.lat).toFixed(4)} ${c.gps.lat>=0?'N':'S'}, ${Math.abs(c.gps.lon).toFixed(4)} ${c.gps.lon>=0?'E':'O'}`:'Sin GPS')
 +R('🕒 Fecha',fechaTxt(c.fecha))+(c.nota?R('📝 Nota',esc(c.nota)):'')
 +(c.errores.length?`<div class="small" style="color:#c0392b;margin-top:8px">${c.errores.join('<br>')}</div>`:'')}
const fmt=v=>String(v).replace('.',',');const esc=s=>s.replace(/[&<>"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]));
function confirmar(c){ir('s-ok');$('#okSub').textContent=sub(c);$('#okData').innerHTML=filas(c)}
async function detalle(id){const c=(await todas()).find(x=>x.id===id);ir('s-det');
 $('#det').innerHTML=(c.foto?`<div class="fish photo"><img src="${c.foto}"></div>`:'')+`<div class="t">${esc(sub(c))}</div><div class="card">${filas(c)}</div><button class="btn del" id="delBtn">🗑 Borrar captura</button>`;
 $('#delBtn').onclick=async()=>{if(confirm('¿Borrar esta captura?')){await borrar(id);ir('s-hist')}}}

/* ---------- 4/5 Historial ---------- */
async function verHist(tab){const cs=(await todas()).sort((a,b)=>b.fecha.localeCompare(a.fecha));
 $('#tabL').classList.toggle('on',tab==='L');$('#tabM').classList.toggle('on',tab==='M');$('#list').hidden=tab!=='L';$('#mapwrap').hidden=tab!=='M';
 $(tab==='L'?'#n-hist':'#n-map').classList.add('on');$(tab==='L'?'#n-map':'#n-hist').classList.remove('on');
 $('#list').innerHTML=cs.length?cs.map(c=>`<div class="card it" data-id="${c.id}"><div class="fish">${c.foto?`<img src="${c.foto}">`:'🐟'}</div><div><h3>${esc(c.especie)}</h3>
 <div class="small">${[c.talla&&c.talla+' cm',c.peso&&fmt(c.peso)+' kg'].filter(Boolean).join(' · ')||'—'} · 📍 ${esc(c.zona||'Sin ubicación')}</div>
 <div class="small">${fechaTxt(c.fecha)} · ${c.marea?'🌊'+(c.marea.estado==='Subiendo'?'↑':'↓'):''} ${c.luna.icono}</div></div></div>`).join(''):'<div class="empty">Aún no hay capturas.<br>Pulsa 📷 Cámara para registrar la primera.</div>';
 if(tab==='M')pintarMapa(cs)}
$('#list').addEventListener('click',e=>{const it=e.target.closest('.it');if(it)detalle(it.dataset.id)});
$('#tabL').onclick=()=>verHist('L');$('#tabM').onclick=()=>verHist('M');
function pintarMapa(cs){if(!window.L){$('#map').innerHTML='<div class="empty">El mapa necesita conexión</div>';return}
 if(!mapa){mapa=L.map('map').setView([28.1,-15.6],8);L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'© OpenStreetMap'}).addTo(mapa);capaPins=L.layerGroup().addTo(mapa)}
 setTimeout(()=>mapa.invalidateSize(),50);capaPins.clearLayers();const pts=[];
 cs.filter(c=>c.gps).forEach(c=>{pts.push([c.gps.lat,c.gps.lon]);L.marker([c.gps.lat,c.gps.lon]).bindPopup(`<b>${esc(sub(c))}</b><br>${esc(c.zona||'')}<br>${fechaTxt(c.fecha)}${c.marea?' · Marea '+c.marea.estado.toLowerCase():''}`).addTo(capaPins)});
 if(pts.length)mapa.fitBounds(pts,{padding:[40,40],maxZoom:13})}

/* ---------- CSV ---------- */
$('#csvBtn').onclick=async()=>{const cs=await todas();if(!cs.length){toast('No hay capturas');return}
 const h=['fecha','especie','talla_cm','peso_kg','nota','lat','lon','zona','marea_estado','marea_altura_m','proxima_marea','proxima_hora','proxima_altura_m','luna_fase','luna_iluminacion_%'];
 const q=v=>v==null?'':/[;"\n]/.test(v=String(v))?'"'+v.replace(/"/g,'""')+'"':v;
 const rows=cs.map(c=>[fechaTxt(c.fecha),c.especie,c.talla,c.peso,c.nota,c.gps?.lat,c.gps?.lon,c.zona,c.marea?.estado,c.marea?.altura,c.marea?.proxima?.tipo,c.marea?.proxima&&hora(c.marea.proxima.hora),c.marea?.proxima?.altura,c.luna.fase,c.luna.iluminacion].map(q).join(';'));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob(['\ufeff'+[h.join(';'),...rows].join('\n')],{type:'text/csv'}));a.download='capturas.csv';a.click()};

if('serviceWorker' in navigator)navigator.serviceWorker.register('sw.js');
ir('s-cam');
