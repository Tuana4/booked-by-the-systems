// timestamp
document.getElementById('ts').textContent = new Date().toTimeString().slice(0,5);

const field = document.getElementById('field');
const box3d = document.getElementById('box3d');
const grid = document.getElementById('grid');
const ghostLayer = document.getElementById('ghostLayer');
const flash = document.getElementById('flash');
const endScreen = document.getElementById('end');
const cb = document.getElementById('agree');
const labelEl = document.getElementById('agreeLabel');

// phrases
const phrases = [
  "I agree","I still agree","I continue to agree",
  "I agree again (for clarity)","I agree to being archived",
  "I agree without reading"
];
const whispers = [
  "consent recorded","trace detected","filing in progress",
  "agreement stored","214 — active","visibility confirmed",
  "form expired but processing","data syncing..."
];

let idx=0, startedGhosts=false, ghostTimer=null;
labelEl.textContent = phrases[idx];

// 3D tilt
field.addEventListener('pointermove', e=>{
  const r=field.getBoundingClientRect();
  const dx=(e.clientX-(r.left+r.width/2))/(r.width/2);
  const dy=(e.clientY-(r.top+r.height/2))/(r.height/2);
  const max=7;
  box3d.style.transform=`rotateY(${dx*max}deg) rotateX(${-dy*max}deg)`;
});
field.addEventListener('pointerleave', ()=> box3d.style.transform='rotateY(0) rotateX(0)');

// click / change
cb.addEventListener('change', ()=>{
  if(!cb.checked) return;
  tickEffect();
  if(!startedGhosts){ startedGhosts=true; ghostTimer=setInterval(spawnGhost,320); }
  cb.disabled=true;
  compressGrid();
  setTimeout(()=>{
    idx++;
    if(idx<phrases.length){ labelEl.textContent=phrases[idx]; cb.checked=false; cb.disabled=false; }
    else{ triggerCrash(); }
  },240);
});

function tickEffect(){ flash.classList.add('flash'); setTimeout(()=>flash.classList.remove('flash'),200); }
function compressGrid(){
  const base=22,tight=9;
  const pct=Math.min(1,(idx+1)/phrases.length);
  const size=base-(base-tight)*(0.25+pct*0.75);
  grid.style.setProperty('--gx',size+'px');
  grid.style.setProperty('--gy',size+'px');
  if(pct>.55) document.body.classList.add('decay');
}
function spawnGhost(){
  const g=document.createElement('div');
  g.className='ghost'+(Math.random()>.78?' red':'');
  g.textContent=whispers[Math.floor(Math.random()*whispers.length)];
  const r=ghostLayer.getBoundingClientRect();
  const x=Math.random()*(r.width-80)+40;
  const y=Math.random()*(r.height-60)+30;
  g.style.left=x+'px'; g.style.top=y+'px'; g.style.setProperty('--r',(Math.random()*10-5)+'deg');
  ghostLayer.appendChild(g); setTimeout(()=>g.remove(),1500);
}
function triggerCrash(){
  if(ghostTimer) clearInterval(ghostTimer);
  document.body.classList.add('crash');
  setTimeout(()=>document.querySelector('.wrap').style.filter='brightness(0)',150);
  setTimeout(()=>endScreen.classList.remove('hidden'),500);
  setTimeout(()=>location.reload(),10000);
}

// custom cursor move
const cursor=document.getElementById('cursor');
document.addEventListener('mousemove',e=>{
  cursor.style.left=e.clientX+'px';
  cursor.style.top=e.clientY+'px';
});
