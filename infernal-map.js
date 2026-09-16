(() => {
const frame=document.querySelector('[data-burning-map]');if(!frame)return;
const maps=['map-of-hell.png','map-of-hell-2.png','map-of-hell-3.png','map-of-hell-worn.png','hell-map-charred.png','hell-map-burned.png'];
const current=frame.querySelector('.map-current'),under=frame.querySelector('.map-next'),canvas=frame.querySelector('canvas'),ctx=canvas.getContext('2d'),status=document.getElementById('map-status'),pause=document.getElementById('map-pause'),next=document.getElementById('map-next'),reduced=matchMedia('(prefers-reduced-motion: reduce)');
let index=0,elapsed=0,last=0,burning=false,paused=false,visible=true,ready=false,failed=false,width=1,height=1,particles=[];
// The six geographic regions are raster sections of each original map.
const layout=document.createElement('canvas');layout.className='map-layout';layout.setAttribute('aria-hidden','true');frame.insertBefore(layout,canvas);
const layoutCtx=layout.getContext('2d');
const arrangements=[[4,2,5,1,0,3],[3,5,1,4,2,0],[5,3,4,2,1,0],[1,4,3,5,0,2],[2,3,0,1,5,4],[4,0,5,2,3,1]];
let motion=0;
function resetLayout(){motion=0;layout.style.clipPath='';layout.style.filter='';layout.style.opacity='0';current.style.opacity='1';frame.classList.remove('is-shifting')}
function renderLayout(progress){
 if(!layoutCtx||!current.complete||!current.naturalWidth)return;
 const iw=current.naturalWidth,ih=current.naturalHeight,scale=Math.min(width/iw,height/ih),dw=iw*scale,dh=ih*scale,ox=(width-dw)/2,oy=(height-dh)/2;
 const tw=dw/3,th=dh/2;
 layoutCtx.clearRect(0,0,width,height);layoutCtx.fillStyle='#0a0301';layoutCtx.fillRect(0,0,width,height);
 // Faded old roads sit under the drifting regions until the new layout settles.
 layoutCtx.globalAlpha=.3;layoutCtx.drawImage(current,ox,oy,dw,dh);layoutCtx.globalAlpha=1;
 for(let i=0;i<6;i++){
  const target=arrangements[index][i],startX=i%3,startY=Math.floor(i/3),endX=target%3,endY=Math.floor(target/3);
  const t=Math.max(0,Math.min(1,(progress-i*.025)/.875)),ease=t*t*(3-2*t);
  const x=ox+(startX+(endX-startX)*ease)*tw,y=oy+(startY+(endY-startY)*ease)*th;
  layoutCtx.save();layoutCtx.shadowColor='rgba(0,0,0,.65)';layoutCtx.shadowBlur=Math.sin(Math.PI*t)*15;
  layoutCtx.drawImage(current,startX*iw/3,startY*ih/2,iw/3,ih/2,x,y,tw+.5,th+.5);layoutCtx.restore();
 }
 layout.style.opacity='1';current.style.opacity='0';
}
const path=n=>'../assets/infernal-geography/'+n;
function preload(){ready=false;failed=false;under.onload=()=>ready=true;under.onerror=()=>{failed=true;status.textContent='Next map unavailable. Use the next-map button to retry.'};under.src=path(maps[(index+1)%maps.length])}
function label(){status.textContent=`Map ${index+1} of ${maps.length}`}
function finish(){resetLayout();index=(index+1)%maps.length;current.src=path(maps[index]);current.alt=`Forbidden map of Hell, plate ${index+1} of ${maps.length}`;current.style.clipPath='';current.style.filter='';burning=false;elapsed=0;particles=[];ctx?.clearRect(0,0,width,height);frame.classList.remove('is-burning');label();preload()}
function ignite(){if(burning)return;if(!ready){if(failed)preload();return}if(reduced.matches||!ctx){finish();return}burning=true;elapsed=0;frame.classList.add('is-burning');status.textContent=`Map ${index+1} of ${maps.length} · Burning`}
function resize(){width=frame.clientWidth;height=frame.clientHeight;const dpr=Math.min(devicePixelRatio||1,2);canvas.width=width*dpr;canvas.height=height*dpr;ctx?.setTransform(dpr,0,0,dpr,0,0);layout.width=width*dpr;layout.height=height*dpr;layoutCtx?.setTransform(dpr,0,0,dpr,0,0);if(motion>0)renderLayout(motion)}
// Smooth, deterministic turbulence breaks up the smoldering paper edge.
function noise(x,t){const hash=n=>{const v=Math.sin(n*127.1+311.7)*43758.5453;return v-Math.floor(v)};const i=Math.floor(x),j=Math.floor(t),u=x-i,v=t-j;const sx=u*u*(3-2*u),sy=v*v*(3-2*v);const mix=(a,b,f)=>a+(b-a)*f;return mix(mix(hash(i+j*57),hash(i+1+j*57),sx),mix(hash(i+(j+1)*57),hash(i+1+(j+1)*57),sx),sy)}
function edge(x,p){return height*(1.12-1.3*p)+(noise(x*.014,p*5)-.5)*42+(noise(x*.067,p*8)-.5)*13}
let emission=0;
function draw(p,dt){
 ctx.clearRect(0,0,width,height);
 const time=elapsed/1000,points=['0% 0%','100% 0%'];
 for(let n=100;n>=0;n--){const x=width*n/100;points.push(`${n}% ${Math.max(0,edge(x,p))/height*100}%`)}
 current.style.clipPath=`polygon(${points.join(',')})`;current.style.filter=`sepia(${p*.65}) brightness(${1-p*.22})`;layout.style.clipPath=current.style.clipPath;layout.style.filter=current.style.filter;
 // A blackened paper edge stays behind the bright combustion front.
 ctx.globalCompositeOperation='source-over';ctx.beginPath();
 for(let x=0;x<=width;x+=5){const y=edge(x,p)-4;if(x===0)ctx.moveTo(x,y);else ctx.lineTo(x,y)}
 ctx.strokeStyle='rgba(24,10,3,.9)';ctx.lineWidth=12;ctx.stroke();
 // Narrow, irregular hot coals follow the charred edge, without open flames.
 ctx.globalCompositeOperation='lighter';
 ctx.lineCap='round';
 for(let x=0;x<width;x+=4){
  const y=edge(x,p);if(y< -20||y>height+20)continue;
  const heat=noise(x*.055,time*1.25),nextY=edge(x+4,p);
  if(x%12===0){
   const radius=10+heat*9,halo=ctx.createRadialGradient(x,y,0,x,y,radius);
   halo.addColorStop(0,`rgba(215,49,4,${.16+heat*.2})`);
   halo.addColorStop(.4,'rgba(130,21,1,.1)');halo.addColorStop(1,'rgba(100,12,0,0)');
   ctx.fillStyle=halo;ctx.fillRect(x-radius,y-radius,radius*2,radius*2);
  }
  ctx.strokeStyle=`rgba(195,${Math.round(28+heat*58)},5,${.5+heat*.4})`;
  ctx.lineWidth=2+heat*3;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x+4,nextY);ctx.stroke();
  if(heat>.42){
   ctx.strokeStyle=`rgba(255,${Math.round(115+heat*80)},${Math.round(15+heat*40)},${heat*.9})`;
   ctx.lineWidth=.6+heat;ctx.beginPath();ctx.moveTo(x,y-.5);ctx.lineTo(x+2,nextY-.5);ctx.stroke();
  }
 }
 ctx.globalCompositeOperation='source-over';
 // Time-based emission keeps particle density consistent across screen refresh rates.
 emission+=dt*Math.min(260,Math.max(110,width*.26))/1000;
 while(emission>=1){emission--;const x=Math.random()*width,y=edge(x,p);if(y<0||y>height)continue;particles.push({x,y,age:0,life:1800+Math.random()*2200,vx:(Math.random()-.5)*38,vy:30+Math.random()*65,smoke:Math.random()<.68,size:.4+Math.random()*1.1,seed:Math.random()*100})}
 particles=particles.filter(q=>q.age<q.life);
 for(const q of particles){q.age+=dt;const f=Math.max(0,1-q.age/q.life);q.x+=(q.vx+Math.sin(q.age*.0015+q.seed)*30)*dt/1000;q.y-=q.vy*dt/1000;
  if(q.smoke){const r=9+q.age*.023,g=ctx.createRadialGradient(q.x,q.y,0,q.x,q.y,r);g.addColorStop(0,`rgba(54,51,48,${f*.42})`);g.addColorStop(.45,`rgba(128,121,111,${f*.23})`);g.addColorStop(1,'rgba(40,35,30,0)');ctx.fillStyle=g;ctx.beginPath();ctx.arc(q.x,q.y,r,0,Math.PI*2);ctx.fill()}
  else{ctx.globalCompositeOperation='lighter';ctx.strokeStyle=`rgba(255,${Math.round(100+f*130)},45,${f})`;ctx.lineWidth=q.size;ctx.beginPath();ctx.moveTo(q.x,q.y);ctx.lineTo(q.x-q.vx*.015,q.y+1+q.vy*.012);ctx.stroke();ctx.globalCompositeOperation='source-over'}
 }
}
function tick(now){
 const dt=last?Math.min(now-last,50):0;last=now;
 if(!paused&&!reduced.matches&&visible&&!document.hidden){
  elapsed+=dt;
  if(burning){
   if(motion>0){motion=Math.min(1,motion+dt/6500);renderLayout(motion)}
   draw(Math.min(1,elapsed/5500),dt);if(elapsed>=5500)finish();
  }else if(elapsed>=3500){
   if(motion===0){frame.classList.add('is-shifting');status.textContent=`Map ${index+1} of ${maps.length} · Locations shifting`}
   motion=Math.min(1,motion+dt/6500);renderLayout(motion);
   if(elapsed>=8500&&ready)ignite();
  }
 }
 requestAnimationFrame(tick);
}
function pauseLabel(){pause.textContent=paused?'Resume map cycle':'Pause map cycle';pause.setAttribute('aria-pressed',String(paused))}
pause.addEventListener('click',()=>{paused=!paused;pauseLabel()});next.addEventListener('click',()=>{paused=false;pauseLabel();ignite()});
function preference(){pause.disabled=reduced.matches;next.textContent=reduced.matches?'Next map':'Burn to next map';if(reduced.matches&&burning)finish();else if(reduced.matches){resetLayout();elapsed=0}}reduced.addEventListener('change',preference);
if('IntersectionObserver'in window)new IntersectionObserver(e=>visible=e[0].isIntersecting).observe(frame);new ResizeObserver(resize).observe(frame);current.addEventListener('load',resize);label();preload();resize();preference();requestAnimationFrame(tick);
})();
