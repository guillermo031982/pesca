'use strict';
/* Usuarios locales (sin servidor): varios perfiles en el mismo móvil */
(function(){
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"]/g,x=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[x]));
const EMOJIS=['🎣','🐟','🐠','🐡','🦈','🐙','🦑','🦀','🐬','🐳','⚓','🚤','🛶','🌊','🏝️','☀️','🌙','⭐','🧔','👩','👨','👧','👦','👴','👵','🧢','😎','🤠','🦭','🐢'];
const K='pescaUsuarios',KA='pescaUsuario';
const lista=()=>{try{return JSON.parse(localStorage.getItem(K))||[]}catch(e){return []}};
const guardaLista=l=>localStorage.setItem(K,JSON.stringify(l));
window.usuariosPesca=lista;
window.usuarioActual=()=>{const l=lista();return l.find(u=>u.id===localStorage.getItem(KA))||null};
window.usuarioPorId=id=>lista().find(u=>u.id===id)||null;
window.avatarHTML=(u,sz=40)=>u&&u.foto?`<img class="av" src="${u.foto}" style="width:${sz}px;height:${sz}px" alt="">`:`<span class="av" style="width:${sz}px;height:${sz}px;font-size:${Math.round(sz*.6)}px">${u?u.emoji||'🎣':'👤'}</span>`;
window.autorTxt=a=>a?(a.emoji?a.emoji+' ':'')+a.n:'';
function pintaBoton(){let b=$('#avBtn');if(!b){b=document.createElement('button');b.id='avBtn';b.setAttribute('aria-label','Usuario');b.onclick=menu;document.body.appendChild(b)}
 const u=usuarioActual();b.innerHTML=avatarHTML(u,40);b.title=u?u.n:'Crear usuario'}
function recortar(f,sz=256){return new Promise(ok=>{const i=new Image();i.onload=()=>{const m=Math.min(i.width,i.height),c=document.createElement('canvas');c.width=c.height=sz;const x=c.getContext('2d');
 x.beginPath();x.arc(sz/2,sz/2,sz/2,0,Math.PI*2);x.clip();x.drawImage(i,(i.width-m)/2,(i.height-m)/2,m,m,0,0,sz,sz);ok(c.toDataURL('image/jpeg',.85))};i.src=URL.createObjectURL(f)})}
async function sinAutor(){try{const d=await window.pescaDB;return await new Promise(ok=>{const r=d.transaction('capturas').objectStore('capturas').getAll();r.onsuccess=()=>ok(r.result.filter(c=>!c.autor))})}catch(e){return []}}
async function asignar(u){const cs=await sinAutor(),d=await window.pescaDB;await new Promise(ok=>{const t=d.transaction('capturas','readwrite');cs.forEach(c=>{c.autor={id:u.id,n:u.n,emoji:u.emoji||''};t.objectStore('capturas').put(c)});t.oncomplete=ok});return cs.length}
async function menu(){const l=lista(),act=usuarioActual(),n=(await sinAutor()).length;
 hojaPesca(`<div class="mtit">👤 ¿Quién pesca?</div>`+(l.length?l.map(u=>`<button class="asop usr ${act&&u.id===act.id?'on':''}" data-u="${u.id}">${avatarHTML(u,44)}<span>${esc(u.n)}</span>${act&&u.id===act.id?'<b class="usrok">✔ Activo</b>':''}</button>`).join(''):'<div class="small" style="margin-bottom:12px">Aún no hay usuarios en este móvil.</div>')+
 (act?`<button class="btn sec" style="width:100%;margin:6px 0" id="uEdit">✏️ Editar mi perfil</button>`:'')+`<button class="btn" style="width:100%;margin:6px 0" id="uNew">＋ Añadir usuario</button>`+
 (act&&n?`<button class="btn sec" style="width:100%;margin:6px 0;font-size:16px" id="uAsig">📥 Asignarme las ${n} capturas sin autor</button>`:'')+
 `<div class="small" style="margin-top:8px">Los perfiles se guardan solo en este móvil.</div>`);
 document.querySelectorAll('.usr').forEach(b=>b.onclick=()=>{localStorage.setItem(KA,b.dataset.u);pintaBoton();$('#hoja').hidden=true;window.toastPesca&&toastPesca('Ahora pesca: '+usuarioActual().n);refrescar()});
 if(act)$('#uEdit').onclick=()=>editor(act);$('#uNew').onclick=()=>editor(null);
 const a=$('#uAsig');if(a)a.onclick=async()=>{const k=await asignar(act);$('#hoja').hidden=true;window.toastPesca&&toastPesca(k+' capturas asignadas a '+act.n);refrescar()}}
function refrescar(){const h=$('#s-hist');if(h&&!h.hidden&&window.verHistPesca)verHistPesca()}
function editor(u,bienvenida){let emoji=u?.emoji||'🎣',foto=u?.foto||null;
 hojaPesca(`<div class="mtit">${bienvenida?'👋 ¡Bienvenido! ¿Quién pesca?':u?'✏️ Editar perfil':'＋ Nuevo usuario'}</div>${bienvenida?'<div class="small" style="margin-bottom:10px">Crea tu perfil para que cada captura guarde quién la pescó. Puedes añadir más personas después.</div>':''}
 <div class="center" style="padding:4px"><div id="uPrev"></div></div>
 <div class="lab">Nombre o apodo</div><input class="inp" id="uNom" maxlength="30" value="${esc(u?.n)}" placeholder="Ej. Guille">
 <div class="lab">Elige un avatar</div><div class="emgrid" id="uEm">${EMOJIS.map(e=>`<button type="button" data-e="${e}">${e}</button>`).join('')}</div>
 <label class="btn sec" style="width:100%;margin:10px 0 0;display:flex;align-items:center;justify-content:center">📷 Usar una foto<input type="file" accept="image/*" id="uFoto" hidden></label>
 <button class="btn green" style="width:100%;margin:12px 0 6px" id="uSave">💾 Guardar</button>
 ${bienvenida?'<button class="btn sec" style="width:100%;margin:0" id="uSkip">Ahora no</button>':''}${u?'<button class="btn del" style="width:100%;margin:6px 0 0" id="uDel">🗑 Borrar este usuario</button>':''}`);
 const prev=()=>{$('#uPrev').innerHTML=avatarHTML({emoji,foto},96);document.querySelectorAll('#uEm button').forEach(b=>b.classList.toggle('on',!foto&&b.dataset.e===emoji))};prev();
 $('#uEm').onclick=e=>{const b=e.target.closest('button');if(!b)return;emoji=b.dataset.e;foto=null;prev()};
 $('#uFoto').onchange=async e=>{const f=e.target.files[0];if(f){foto=await recortar(f);prev()}};
 $('#uSave').onclick=()=>{const n=$('#uNom').value.trim();if(!n){window.toastPesca&&toastPesca('Escribe un nombre o apodo');$('#uNom').focus();return}
  const l=lista();const nu={id:u?.id||'u'+Date.now(),n,emoji:foto?'':emoji,foto,creado:u?.creado||new Date().toISOString()};const i=l.findIndex(x=>x.id===nu.id);if(i>=0)l[i]=nu;else l.push(nu);
  guardaLista(l);localStorage.setItem(KA,nu.id);localStorage.setItem('perfilVisto','1');pintaBoton();$('#hoja').hidden=true;window.toastPesca&&toastPesca(u?'Perfil actualizado':'¡Hola, '+n+'!');refrescar()};
 const sk=$('#uSkip');if(sk)sk.onclick=()=>{localStorage.setItem('perfilVisto','1');$('#hoja').hidden=true};
 const dl=$('#uDel');if(dl)dl.onclick=()=>{if(!confirm('¿Borrar el usuario '+u.n+'? Sus capturas se conservan con su nombre.'))return;guardaLista(lista().filter(x=>x.id!==u.id));if(localStorage.getItem(KA)===u.id)localStorage.removeItem(KA);pintaBoton();$('#hoja').hidden=true}}
window.menuUsuario=menu;
pintaBoton();
if(!lista().length&&!localStorage.getItem('perfilVisto'))setTimeout(()=>editor(null,true),400);
})();
