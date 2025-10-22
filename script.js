// time for red flash, label progression, ghosts, reload
const cb=document.getElementById('agree');
const label=document.getElementById('agreeLabel');
const flash=document.getElementById('flash');
const ghostLayer=document.getElementById('ghostLayer');
const endScreen=document.getElementById('end');

const phrases=[
  "I agree",
  "I still agree",
  "I continue to agree",
  "I agree again (for clarity)",
  "I agree to being archived",
  "I agree without reading"
];
const whispers=[
  "consent recorded","data syncing","trace detected",
  "agreement stored","file active","form validated"
];

let idx=0,ghostTimer=null,started=false;

// click logic
cb.addEventListener('change',()=>{
  if(!cb.checked) return;
  redFlash();
  spawnGhost();
  if(!started){started=true;ghostTimer=setInterval(spawnGhost,400);}
  setTimeout(()=>{
    idx++;
    if(idx<phrases.length){
      label.textContent=phrases[idx];
      cb.checked=false;
    }else{
      endSequence();
    }
  },200);
});

function redFlash(){
  flash.classList.add('flash');
  setTimeout(()=>flash.classList.remove('flash'),200);
}

function spawnGhost(){
  const g=document.createElement('div');
  g.className='ghost';
  g.textContent=whispers[Math.floor(Math.random()*whispers.length)];
  const r=ghostLayer.getBoundingClientRect();
  const x=Math.random()*(r.width-100)+50;
  const y=Math.random()*(r.height-60)+30;
  g.style.left=x+'px';
  g.style.top=y+'px';
  ghostLayer.appendChild(g);
  setTimeout(()=>g.remove(),1200);
}

function endSequence(){
  clearInterval(ghostTimer);
  setTimeout(()=>{endScreen.classList.remove('hidden');},300);
  setTimeout(()=>{location.reload();},10000);
}

// cursor
const cursor=document.getElementById('cursor');
document.addEventListener('mousemove',e=>{
  cursor.style.left=e.clientX+'px';
  cursor.style.top=e.clientY+'px';
});
