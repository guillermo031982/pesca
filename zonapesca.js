'use strict';
/* Zona de pesca: desde dónde se pesca (costa, barco, pato, kayak, otro) */
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]));
const TIPOS={costa:{n:'Costa',i:'🏝️'},barco:{n:'Barco',i:'🚤'},pato:{n:'Pato',i:'🛟'},kayak:{n:'Kayak',i:'🛶'},otro:{n:'Otro',i:'✏️'}};
const EMB={barco:'Barco',kayak:'Kayak',pato:'Pato (float tube)'};
const MOD_BARCO=['fondo','deriva','currican','jigging'],MOD_TIERRA=['surfcasting','spinning','rockfishing','corcheo','ligera'];
window.ZONAS_PESCA=TIPOS;
window.zpNombre=z=>{if(!z||!z.tipo)return '';const t=TIPOS[z.tipo];return t.i+' '+(z.tipo==='otro'&&z.otro?z.otro:t.n)+(z.emb?' · '+z.emb.n:'')};
let tipo='',embId='',otro='',embs=[];
async function cargaEmbs(){embs=(window.equipoTodos?await equipoTodos():[]).filter(e=>e.cat==='embarcacion')}
const nomE=e=>[e.marca,e.modelo].filter(Boolean).join(' ')||'Sin nombre';
async function pinta(){await cargaEmbs();
 $('#zpSel').innerHTML=Object.entries(TIPOS).map(([k,t])=>`<button type="button" data-z="${k}" class="${k===tipo?'on':''}">${t.i} ${t.n}</button>`).join('')+`<button type="button" data-z="" class="${!tipo?'on':''}">Sin indicar</button>`;
 let h='';if(EMB[tipo]){const mias=embs.filter(e=>e.specs?.tipo===EMB[tipo]);
  h=`<div class="lab">¿Qué ${TIPOS[tipo].n.toLowerCase()}? · opcional</div><div class="chips msel" id="zpEmb">${mias.map(e=>`<button type="button" data-e="${e.id}" class="${e.id===embId?'on':''}">${e.foto?`<img src="${e.foto}" class="embmini">`:TIPOS[tipo].i} ${esc(nomE(e))}</button>`).join('')}<button type="button" data-e="+" class="zpnew">＋ Nuevo</button></div><div id="zpNew"></div>`}
 if(tipo==='otro')h=`<input class="inp" id="zpOtro" placeholder="Ej. muelle flotante, escollera, paddle surf…" value="${esc(otro)}" style="margin-top:8px">`;
 $('#zpExtra').innerHTML=h;sugerir();
 const o=$('#zpOtro');if(o)o.oninput=()=>otro=o.value}
function sugerir(){const m=window.modFicha?modFicha.get():'';const s=$('#zpSug');if(!s)return;let sug='';
 if(MOD_BARCO.includes(m)&&!['barco','kayak','pato'].includes(tipo))sug='barco';else if(MOD_TIERRA.includes(m)&&!tipo)sug='costa';
 s.innerHTML=sug?`💡 Con ${window.modNombre?modNombre(m):'esta modalidad'} lo normal es <b>${TIPOS[sug].n}</b>. <button type="button" class="lnk" data-z="${sug}" style="padding:0">Usar ${TIPOS[sug].n}</button>`:'';s.hidden=!sug}
function nuevoForm(){let foto=null;$('#zpNew').innerHTML=`<div class="zpbox"><div class="lab" style="margin-top:0">Nombre o modelo</div><input class="inp" id="zpNom" placeholder="Ej. Zodiac Medline 5,8 o «La Gaviota»">
 <label class="fish efFoto" style="height:120px"><input type="file" accept="image/*" id="zpF" hidden><img id="zpImg" hidden><span id="zpFh">📷 Foto · opcional</span></label>
 <div class="two" style="margin:10px 0 0"><button type="button" class="btn green" id="zpOk">✔ Guardar</button><button type="button" class="btn sec" id="zpNo">Cancelar</button></div></div>`;
 $('#zpF').onchange=async e=>{const f=e.target.files[0];if(!f)return;foto=await reducir(f);$('#zpImg').src=foto;$('#zpImg').hidden=false;$('#zpFh').hidden=true};
 $('#zpNo').onclick=()=>$('#zpNew').innerHTML='';
 $('#zpOk').onclick=async()=>{const n=$('#zpNom').value.trim();if(!n){window.toastPesca&&toastPesca('Escribe el nombre o modelo');return}
  const e={id:String(Date.now()),cat:'embarcacion',marca:'',modelo:n,specs:{tipo:EMB[tipo]},mods:[],foto,notas:'',creado:new Date().toISOString()};await equipoGuardar(e);embId=e.id;pinta()};setTimeout(()=>$('#zpNom').focus(),50)}
function reducir(f,max=800){return new Promise(ok=>{const i=new Image();i.onload=()=>{const k=Math.min(1,max/Math.max(i.width,i.height));const c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);ok(c.toDataURL('image/jpeg',.8))};i.src=URL.createObjectURL(f)})}
document.addEventListener('click',e=>{const z=e.target.closest('#zpSel button,#zpSug [data-z]');if(z){if(tipo!==z.dataset.z){tipo=z.dataset.z;embId=''}pinta();return}
 const b=e.target.closest('#zpEmb button');if(b){if(b.dataset.e==='+')nuevoForm();else{embId=embId===b.dataset.e?'':b.dataset.e;document.querySelectorAll('#zpEmb button').forEach(x=>x.classList.toggle('on',x.dataset.e===embId))}}});
document.getElementById('modSel')?.addEventListener('click',()=>setTimeout(sugerir,0));
window.zonaFicha={async reset(){let u={};try{u=JSON.parse(localStorage.getItem('ultimaZona'))||{}}catch(e){}tipo=u.tipo||'';embId=u.embId||'';otro=u.otro||'';await pinta()},
 get(){if(!tipo)return null;const e=embs.find(x=>x.id===embId);return {tipo,emb:EMB[tipo]&&e?{id:e.id,n:nomE(e)}:null,otro:tipo==='otro'?otro.trim():''}},
 recordar(){if(tipo)localStorage.setItem('ultimaZona',JSON.stringify({tipo,embId,otro}))}};
})();
