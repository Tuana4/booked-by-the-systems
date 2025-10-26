// ===== Cursor (glowing solid with inertia, red over interactive) =====
const cursor = document.getElementById('cursor');
let cx = innerWidth/2, cy = innerHeight/2, tx = cx, ty = cy;
document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
function step(){ cx += (tx - cx)*0.2; cy += (ty - cy)*0.2; cursor.style.left=cx+'px'; cursor.style.top=cy+'px'; requestAnimationFrame(step); }
step();
function hoverState(e){
  const t=e.target; const isInteractive = t.id==='agree';
  document.body.classList.toggle('interactive', isInteractive);
}
document.addEventListener('mousemove', hoverState);

// ===== Elements & state =====
const agreeBtn = document.getElementById('agree');
const layer = document.getElementById('layer');
const flash = document.getElementById('flash');
const endScreen = document.getElementById('end');

let stage = 0;

// longer, AI-ish system phrases (escalating)
const phrases = [
  ["consent recorded","trace detected","data syncing"],
  ["compliance verified","visibility confirmed","profiling initiated"],
  ["compiling emotional metrics","risk assessment running","session id: 214—active"],
  ["generating compliance report","predictive consent model trained","exporting user fingerprint"],
  ["install trust pack? [yes] [yes]","security upgrade required","system performance degrading"],
  ["error: user still present","manual override denied","archiving user intent"]
];

// pop-up payloads
const popups = [
  ["SYSTEM NOTICE","Install Trust Pack to continue.","[ ACCEPT ]   [ ACCEPT ]"],
  ["CONSENT UPDATE","Improved privacy experience available.","Click AGREE to activate."],
  ["SECURITY CHECK","Unusual activity detected.","Verify identity by agreeing again."],
  ["OPTIMISER","We can make this faster.","Enable automatic agreement."]
];

// ===== Helpers =====
function pingFlash(){ flash.classList.add('flash'); setTimeout(()=> flash.classList.remove('flash'), 200); }

function spawnBurst(text){
  const el = document.createElement('div');
  el.className = 'burst';
  el.textContent = text;
  const r = layer.getBoundingClientRect();
  const x = r.left + 60 + Math.random()*(r.width-120);
  const y = r.top  + 50 + Math.random()*(r.height-100);
  el.style.left = x+'px'; el.style.top = y+'px';
  el.style.setProperty('--r', (Math.random()*12 - 6) + 'deg');
  document.body.appendChild(el);
  setTimeout(()=> el.remove(), 1100);
}

function burstSet(arr, count=10, delay=45){
  for(let i=0;i<count;i++){
    setTimeout(()=> spawnBurst(arr[Math.floor(Math.random()*arr.length)]), i*delay);
  }
}

function spawnPopup(){
  const p = document.createElement('div');
  p.className = 'popup';
  const [title, line1, line2] = popups[Math.floor(Math.random()*popups.length)];
  p.innerHTML = `
    <div class="pophead">
      <span>${title}</span>
      <button class="popx" aria-label="close">X</button>
    </div>
    <div class="popbody">
      <div>${line1}</div>
      <div style="margin-top:8px;color:#ffbfbf">${line2}</div>
    </div>
  `;
  // random position
  const r = layer.getBoundingClientRect();
  const cx = r.left + r.width * (0.25 + Math.random()*0.5);
  const cy = r.top  + r.height* (0.25 + Math.random()*0.5);
  p.style.left = cx+'px'; p.style.top = cy+'px';
  p.style.setProperty('--rot', (Math.random()*6-3)+'deg');
  document.body.appendChild(p);
  // close button
  p.querySelector('.popx').addEventListener('click', ()=> p.remove());
  // auto-remove after a bit
  setTimeout(()=> p.remove(), 3500);
}

function spawnDecoyAgrees(n=4){
  const rect = layer.getBoundingClientRect();
  for(let i=0;i<n;i++){
    const d = document.createElement('button');
    d.className = 'agree decoy';
    d.textContent = 'I AGREE';
    const w = rect.width, h = rect.height;
    const x = rect.left + 40 + Math.random()*(w-80);
    const y = rect.top  + 40 + Math.random()*(h-80);
    d.style.left = x+'px'; d.style.top = y+'px';
    d.style.transform = `translate(-50%,-50%) scale(${0.6 + Math.random()*1.4})`;
    document.body.appendChild(d);
    setTimeout(()=> d.remove(), 2000);
  }
}

function shake(){ document.querySelector('.stage').classList.add('shake'); setTimeout(()=> document.querySelector('.stage').classList.remove('shake'), 500); }

// ===== Stage machine =====
agreeBtn.addEventListener('click', ()=>{
  stage++;
  pingFlash();

  // escalate visual state
  if(stage<=phrases.length){
    // bursts get denser each time
    const set = phrases[Math.min(stage-1, phrases.length-1)];
    const c = 10 + stage*4;           // more words
    const d = Math.max(20, 60 - stage*6); // faster
    burstSet(set, c, d);
  }

  // mid stages: popups + decoy agrees + scaling
  if(stage===3){ spawnPopup(); }
  if(stage===4){ spawnPopup(); spawnDecoyAgrees(5); agreeBtn.style.transform='scale(1.2)'; }
  if(stage===5){ spawnPopup(); spawnPopup(); spawnDecoyAgrees(7); agreeBtn.style.transform='scale(0.85)'; shake(); }

  // final collapse (stage 6)
  if(stage>=6){
    document.body.classList.add('interactive'); // cursor red for drama
    // big storm
    for(let i=0;i<3;i++){ setTimeout(spawnPopup, i*120); }
    burstSet(phrases[phrases.length-1], 26, 25);
    shake();
    setTimeout(()=>{
      document.getElementById('end').classList.remove('hidden');
      setTimeout(()=> location.reload(), 10000);
    }, 600);
  }
});
