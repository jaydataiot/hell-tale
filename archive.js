document.querySelectorAll('[data-year]').forEach((node)=>{node.textContent=new Date().getFullYear()});

(()=>{
  const root=document.body.dataset.archiveRoot||'';
  const src=`${root}assets/audio/hell-4.mp3`;
  let audio=document.getElementById('hellAmbientAudio');
  if(!audio){
    audio=document.createElement('audio');
    audio.id='hellAmbientAudio';
    document.body.appendChild(audio);
  }
  audio.src=src;
  audio.loop=true;
  audio.autoplay=true;
  audio.preload='auto';
  audio.setAttribute('playsinline','');
  audio.volume=.28;
  const play=()=>audio.play().catch(()=>{});
  play();
  ['pointerdown','keydown','touchstart'].forEach((eventName)=>{
    window.addEventListener(eventName,play,{once:true,passive:true});
  });
})();
