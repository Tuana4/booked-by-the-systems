// timestamp
document.getElementById('ts').textContent = new Date().toTimeString().slice(0,5);

// elements
const field     = document.getElementById('field');
const box3d     = document.getElementById('box3d');
const grid      = document.getElementById('grid');
const ghostLayer= document.getElementById('ghostLayer');
const flash     = document.getElementById('flash');
const endScreen = document.getElementById('end');

const cb        = document.getElementById('agree');
const labelEl   = document.getElementById('agreeLabel');

// phrases for the center (one at a time)
const phrases = [
  "I agree",
  "I still agree",
  "I continue to agree",
  "I agree again (for clarity)",
  "I agree to being archived",
  "I agree without reading"
];

// background “system words”
const whispers = [
  "consent recorded","trace detected","filing in progress",
  "agreement stored","214 — active","visibility confirmed",
  "form expired but processing","data syncing..."
];

let idx = 0;             // which phrase is showing
let startedGhosts = false;
let ghostTimer = null;

// ensure first phrase
labelEl.textContent = phrases[idx];

// 3D tilt on mouse move (subtle)
field.addEventListener('pointermove', (e)=>{
  const r = field.getBoundingClientRect();
  const cx = r.left + r.width/2;
  const cy = r.top  + r.height/2;
  const dx = (e.clientX - cx) / (r.width/2);   // -1..1
  const dy = (e.clientY - cy) / (r.height/2);
  const max = 7; // degrees
  box3d.style.transform = `rotateY(${dx*max}deg) rotateX(${-dy*max}deg)`;
});
field.addEventListener('pointerleave', ()=> box3d.style.transform = 'rotateY(0) rotateX(0)');

// click / change the checkbox
cb.addEventListener('change', ()=>{
  if(!cb.checked) return;     // only act on checked
  tickEffect();

  // start the drifting background words after the first agree
  if(!startedGhosts){
    startedGhosts = true;
    ghostTimer = setInterval(spawnGhost, 320);
  }

  // lock this “agree” briefly so it feels decisive
  cb.disabled = true;

  // progress the system grid
  compressGrid();

  // go to next phrase or crash
  setTimeout(()=>{
    idx++;
    if (idx < phrases.length){
      labelEl.textContent = phrases[idx];
      cb.checked = false;
      cb.disabled = false; // ready for next click
    } else {
      // final click → crash sequence
      triggerCrash();
    }
  }, 240);
});

// red flash + micro “camera capture” feel
function tickEffect(){
  flash.classList.add('flash');
  setTimeout(()=> flash.classList.remove('flash'), 200);
}

function compressGrid(){
  const base = 22, tight = 9;
  const pct  = Math.min(1, (idx+1) / phrases.length);
  const size = base - (base - tight) * (0.25 + pct*0.75);
  grid.style.setProperty('--gx', size + 'px');
  grid.style.setProperty('--gy', size + 'px');
  if (pct > .55) document.body.classList.add('decay');
}

// spawn a floating word in the background
function spawnGhost(){
  const g = document.createElement('div');
  g.className = 'ghost' + (Math.random()>.78 ? ' red':'' );
  g.textContent = whispers[Math.floor(Math.random()*whispers.length)];

  const r = ghostLayer.getBoundingClientRect();
  const padX = 40, padY = 30;
  const x = Math.random()*(r.width - padX*2) + padX;
  const y = Math.random()*(r.height - padY*2) + padY;

  g.style.left = x + 'px';
  g.style.top  = y + 'px';
  g.style.setProperty('--r', (Math.random()*10-5) + 'deg');

  ghostLayer.appendChild(g);
  setTimeout(()=> g.remove(), 1500);
}

// crash → error → message → auto reload
function triggerCrash(){
  // stop background ghosts
  if (ghostTimer) clearInterval(ghostTimer);

  // crash shake + flash
  document.body.classList.add('crash');

  // hide field UI
  setTimeout(()=>{
    document.querySelector('.wrap').style.filter = 'brightness(0)';
  }, 150);

  // show end screen message
  setTimeout(()=>{
    endScreen.classList.remove('hidden');
  }, 500);

  // auto-reload after 10 seconds
  setTimeout(()=> location.reload(), 10000);
}
