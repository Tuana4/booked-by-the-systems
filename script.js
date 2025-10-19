// timestamp
const ts = document.getElementById('ts');
ts.textContent = new Date().toTimeString().slice(0,5);

const s1 = document.getElementById('s1');
const s2 = document.getElementById('s2');
const field = document.getElementById('field');
const grid  = document.getElementById('grid');
const cursor = document.getElementById('cursor');

// poster-voice messages
const lines = [
  "consent recorded","trace detected","filing in progress",
  "agreement implied","visibility confirmed","delay archived",
  "category applied","status: active participant","loop continues",
  "system holds you","error 214-a","form expired but processing"
];

let dist = 0, lastX = null, lastY = null, phraseI = 0, archived = false;

// custom cursor + movement tracking
window.addEventListener('pointermove', (e)=>{
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';

  if(lastX !== null){
    const dx = e.clientX - lastX, dy = e.clientY - lastY;
    dist += Math.hypot(dx, dy);
    progress(dist);
    if (Math.random()>.84) trace(e.clientX, e.clientY);
  }
  lastX = e.clientX; lastY = e.clientY;
});

function progress(d){
  // compress grid (the box tightens)
  const base=22, tight=9;
  const pct = Math.min(1, d/2400); // lower = faster archive
  const size = base - (base-tight)*pct;
  grid.style.setProperty('--gx', size+'px');
  grid.style.setProperty('--gy', size+'px');
  grid.style.opacity = 0.22 + pct*0.2;

  // spawn phrases
  if (Math.random() < 0.22 + pct*0.4) spawnPhrase();

  if (pct > .85) document.body.classList.add('decay');
  if (!archived && pct >= 1) archive();
}

function spawnPhrase(){
  const p = document.createElement('div');
  p.className = 'phrase' + (Math.random()>.75 ? ' red':'');
  p.textContent = lines[phraseI % lines.length];
  phraseI++;
  const rect = field.getBoundingClientRect();
  const x = rect.left + 40 + Math.random()*(rect.width-120);
  const y = rect.top  + 20 + Math.random()*(rect.height-80);
  p.style.left = x+'px'; p.style.top = y+'px';
  p.style.setProperty('--r', (Math.random()*8-4)+'deg');
  document.body.appendChild(p);
  setTimeout(()=>p.remove(), 1300);
  if (navigator.vibrate && Math.random()>.85) navigator.vibrate(8);
}

function trace(x,y){
  const t = document.createElement('div');
  t.className='trace'; t.style.left=x+'px'; t.style.top=y+'px';
  document.body.appendChild(t);
  setTimeout(()=>t.remove(), 600);
}

function archive(){
  archived = true;
  setTimeout(()=>{
    s1.classList.remove('active');
    s2.classList.add('active');
    document.title = 'archived — BOOKED BY THE SYSTEMS';
  }, 220);
}

document.getElementById('restart').addEventListener('click', ()=> location.reload());
