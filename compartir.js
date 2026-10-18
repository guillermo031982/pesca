'use strict';
/* Compartir captura: tarjeta 1080x1350 en canvas, sin coordenadas */
(function(){
const URL_APP='guillermo031982.github.io/pesca';
const W=1080,H=1350;
const cargar=src=>new Promise(ok=>{if(!src)return ok(null);const i=new Image();i.onload=()=>ok(i);i.onerror=()=>ok(null);i.src=src});
function zonaGeneral(c){if(c.zonaGen)return c.zonaGen;if(!c.zona||/no disponible/i.test(c.zona))return '';const p=c.zona.split(',').map(x=>x.trim());return p.length>1?p.slice(-1)[0]:p[0]}
function rr(x,ctx,a,b,w,h,r){ctx.beginPath();ctx.moveTo(a+r,b);ctx.arcTo(a+w,b,a+w,b+h,r);ctx.arcTo(a+w,b+h,a,b+h,r);ctx.arcTo(a,b+h,a,b,r);ctx.arcTo(a,b,a+w,b,r);ctx.closePath()}
function ajustar(ctx,txt,max,size,peso='bold'){let s=size;do{ctx.font=`${peso} ${s}px system-ui,Roboto,sans-serif`;s-=2}while(ctx.measureText(txt).width>max&&s>20);return s}
async function tarjeta(c,conZona){const cv=document.createElement('canvas');cv.width=W;cv.height=H;const x=cv.getContext('2d');
 const g=x.createLinearGradient(0,0,0,H);g.addColorStop(0,'#0b4f6c');g.addColorStop(1,'#06141d');x.fillStyle=g;x.fillRect(0,0,W,H);
 // foto
 const fy=0,fh=720,img=await cargar(c.foto);
 x.save();rr(0,x,40,40,W-80,fh-40,40);x.clip();
 if(img){const k=Math.max((W-80)/img.width,(fh-40)/img.height),iw=img.width*k,ih=img.height*k;x.drawImage(img,40+(W-80-iw)/2,40+(fh-40-ih)/2,iw,ih)}
 else{const gg=x.createLinearGradient(0,40,0,fh);gg.addColorStop(0,'#4fa3c7');gg.addColorStop(1,'#0b4f6c');x.fillStyle=gg;x.fillRect(40,40,W-80,fh-40);x.font='260px serif';x.textAlign='center';x.textBaseline='middle';x.fillText('🐟',W/2,fh/2+20)}
 const sh=x.createLinearGradient(0,fh-260,0,fh);sh.addColorStop(0,'rgba(0,0,0,0)');sh.addColorStop(1,'rgba(0,0,0,.75)');x.fillStyle=sh;x.fillRect(40,fh-260,W-80,260);x.restore();
 // especie y medidas
 x.textAlign='left';x.textBaseline='alphabetic';x.fillStyle='#fff';
 ajustar(x,c.especie,W-160,96);x.fillText(c.especie,80,fh-70);
 const med=[c.talla&&`${String(c.talla).replace('.',',')} cm`,c.peso&&`${String(c.peso).replace('.',',')} kg`].filter(Boolean).join('  ·  ');
 if(med){x.font='bold 52px system-ui,sans-serif';x.fillStyle='#ffb703';x.fillText(med,80,fh-8)}
 // datos
 const filas=[];
 const conDesde=localStorage.getItem('compartirDesde')!=='no',conAutor=localStorage.getItem('compartirAutor')!=='no';
 if(conAutor&&c.autor)filas.push(['Pescador',(c.autor.emoji&&!(window.usuarioPorId&&usuarioPorId(c.autor.id)?.foto)?c.autor.emoji+' ':'')+c.autor.n,'autor']);
 if(c.modalidad&&window.modNombre)filas.push(['Modalidad',modNombre(c.modalidad)]);
 if(conDesde&&c.zonaPesca&&window.zpNombre)filas.push(['Desde',zpNombre(c.zonaPesca)]);
 if(c.marea)filas.push(['Marea',`${c.marea.estado==='Subiendo'?'🌊 ↑':'🌊 ↓'} ${c.marea.estado} · ${String(c.marea.altura).replace('.',',')} m`]);
 if(c.luna)filas.push(['Luna',`${c.luna.icono} ${c.luna.fase} · ${c.luna.iluminacion} %`]);
 const d=new Date(c.fecha);filas.push(['Fecha',`📅 ${d.toLocaleDateString('es-ES',{day:'numeric',month:'long',year:'numeric'})} · ${d.toLocaleTimeString('es-ES',{hour:'2-digit',minute:'2-digit'})}`]);
 const zg=zonaGeneral(c);if(conZona&&zg)filas.push(['Zona','📍 '+zg]);
 const uF=conAutor&&c.autor&&window.usuarioPorId?await cargar(usuarioPorId(c.autor.id)?.foto):null;
 let y=fh+70;const rowH=Math.min(92,(H-200-y)/Math.max(1,filas.length));
 filas.forEach(([k,v,tipo])=>{x.fillStyle='#9fd3e8';x.font='600 34px system-ui,sans-serif';x.fillText(k.toUpperCase(),80,y+10);let vx=360;if(tipo==='autor'&&uF){x.save();x.beginPath();x.arc(384,y-2,26,0,Math.PI*2);x.clip();x.drawImage(uF,358,y-28,52,52);x.restore();vx=424}x.fillStyle='#fff';ajustar(x,v,W-80-vx,44,'bold');x.fillText(v,vx,y+12);
  x.strokeStyle='rgba(255,255,255,.12)';x.lineWidth=2;x.beginPath();x.moveTo(80,y+38);x.lineTo(W-80,y+38);x.stroke();y+=rowH});
 // pie
 x.fillStyle='#0077b6';rr(0,x,40,H-130,W-80,90,45);x.fill();
 x.fillStyle='#fff';x.font='bold 46px system-ui,sans-serif';x.fillText('🐟 Pesca',80,H-70);x.textAlign='right';x.font='500 34px system-ui,sans-serif';x.fillText(URL_APP,W-80,H-72);
 return cv}
const blob=cv=>new Promise(ok=>cv.toBlob(ok,'image/png'));
function nombreFich(c){return `captura-${(c.especie||'pez').toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g,'-')}-${c.fecha.slice(0,10)}.png`}
function descargar(b,n){const a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=n;document.body.appendChild(a);a.click();setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},2000)}
window.tarjetaCaptura=tarjeta;
window.compartirCaptura=async function(c){
 let conZona=localStorage.getItem('compartirZona')!=='no';
 hojaPesca(`<div class="mtit">📤 Compartir captura</div><div class="shprev"><img id="shImg" alt="Vista previa de la tarjeta"></div>
 <label class="shchk"><input type="checkbox" id="shZona" ${conZona?'checked':''}> Mostrar zona general (isla/municipio)</label>
 ${c.zonaPesca?`<label class="shchk" style="margin-top:6px"><input type="checkbox" id="shDesde" ${localStorage.getItem('compartirDesde')!=='no'?'checked':''}> Mostrar desde dónde pesqué</label>`:''}
 ${c.autor?`<label class="shchk" style="margin-top:6px"><input type="checkbox" id="shAutor" ${localStorage.getItem('compartirAutor')!=='no'?'checked':''}> Mostrar mi nombre</label>`:''}
 <div class="small" style="margin:4px 2px 12px">Nunca se incluyen coordenadas exactas.</div>
 <button class="btn green" style="width:100%;margin:0 0 10px" id="shGo">📤 Compartir</button><button class="btn sec" style="width:100%;margin:0" id="shDl">⬇ Descargar imagen</button>`);
 let b=null;const pinta=async()=>{const cv=await tarjeta(c,conZona);b=await blob(cv);const im=document.getElementById('shImg');if(im){if(im.src)URL.revokeObjectURL(im.src);im.src=URL.createObjectURL(b)}};
 await pinta();
 document.getElementById('shZona').onchange=async e=>{conZona=e.target.checked;localStorage.setItem('compartirZona',conZona?'si':'no');await pinta()};
 [['shDesde','compartirDesde'],['shAutor','compartirAutor']].forEach(([id,k])=>{const el=document.getElementById(id);if(el)el.onchange=async e=>{localStorage.setItem(k,e.target.checked?'si':'no');await pinta()}});
 document.getElementById('shDl').onclick=()=>descargar(b,nombreFich(c));
 document.getElementById('shGo').onclick=async()=>{const f=new File([b],nombreFich(c),{type:'image/png'});
  const txt=`${c.especie}${c.talla?' de '+String(c.talla).replace('.',',')+' cm':''} 🎣`;
  if(navigator.canShare&&navigator.canShare({files:[f]})){try{await navigator.share({files:[f],title:'Mi captura',text:txt})}catch(e){if(e.name!=='AbortError')descargar(b,f.name)}}
  else{descargar(b,f.name);window.toastPesca&&toastPesca('Tu navegador no permite compartir archivos: se ha descargado la imagen')}};
};
})();
