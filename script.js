/* ===== GRABS ===== */
const wrap       = document.getElementById('wrap');
const centerEl   = document.getElementById('center');
const ghostLayer = document.getElementById('ghostLayer');
const cb         = document.getElementById('agree');
const label      = document.getElementById('agreeLabel');
const flash      = document.getElementById('flash');
const glitchEl   = document.getElementById('glitch');
const rgbEl      = document.getElementById('rgb');
const redwashEl  = document.getElementById('redwash');
const blocksEl   = document.getElementById('blocks');
const crashEl    = document.getElementById('crash');
const endScreen  = document.getElementById('end');
const cursorEl   = document.getElementById('cursor');

/* ===== SOUND (simple + reliable) ===== */
const baseClick = new Audio('sound.mp3'); // make sure sound.mp3 is in the same folder
function playAgree() {
  try {
    const s = baseClick.cloneNode(true); // allow overlaps
    s.volume = 0.65;
    s.play().catch(()=>{});
  } catch(e){}
}

/* ===== PHRASES ===== */
const phrases = [
  "I AGREE",
  "I STILL AGREE",
  "I CONTINUE TO AGREE",
  "I AGREE AGAIN",
  "I AGREE TO CONTINUE AGREEING",
  "I AGREE TO BEING ARCHIVED",
  "I AGREE WITHOUT READING",
  "I AGREE TO THE SYSTEM",
  "I AGREE TO YOUR TERMS",
  "I AGREE TO ALL FUTURE AGREEMENTS",
  "I AGREE WITHOUT READING"
];

/* ===== RED BURSTS (escalates) ===== */
const burstsByStep = [
  ["consent recorded","trace detected","data syncing"],
  ["compliance verified","visibility confirmed","profiling initiated","session id: 214—active"],
  ["compiling emotional metrics","estimating persuasion index","risk assessment: low | proceed","time-on-task logged"],
  ["generating compliance report","predictive consent model updating","exporting user fingerprint > ok","intent cache warm • archival queue"],
  ["install trust pack? [ yes ] [ yes ]","security upgrade required to continue","system performance degrading • retry","auto-consent enabled • silent mode"],
  ["error: user still present","manual override denied","archiving user intent • success","finalizing agreement • do not close"]
];

let step = 0;
label.textContent = phrases[step];

/* Make label always toggle checkbox even if overlapped */
label.addEventListener('click', (e)=>{
  e.preventDefault();
  if (cb.disabled) return;
  cb.checked = true;
  cb.dispatchEvent(new Event('change'));
});

/* Cursor */
document.addEventListener('mousemove', (e)=>{
  cursorEl.style.left = `${e.clientX}px`;
  cursorEl.style.top  = `${e.clientY}px`;
});
['mousemove','mouseover','mouseout'].forEach(evt=>{
  document.addEventListener(evt, e=>{
    const t = e.target;
    const interactive = t.tagName === 'INPUT' || t.tagName === 'LABEL' || t.closest('label');
    document.body.classList.toggle('interactive-hover', !!interactive);
  });
});

/* ===== MAIN INTERACTION ===== */
cb.addEventListener('change', ()=>{
  if (!cb.checked) return;

  playAgree();                // 🔊 sound
  flashBang();                // red flash
  burstOnce(step);            // red words

  // escalate window popups behind the phrase from click #3 onward
  if (step >= 2) escalatePopups(step);

  cb.disabled = true;
  setTimeout(()=>{
    step++;
    if (step < phrases.length){
      label.textContent = phrases[step];
      cb.checked = false;
      cb.disabled = false;
    } else {
      endTransition();        // crash → end line
    }
  }, 260);
});

/* ===== EFFECTS ===== */
function flashBang(){
  flash.classList.add('flash');
  setTimeout(()=> flash.classList.remove('flash'), 200);
}

/* full-view bursts; gentle first two clicks */
function burstOnce(i){
  const rect = { left: -0.10*innerWidth, top: -0.14*innerHeight, width: innerWidth*1.20, height: innerHeight*1.28 };
  const set  = burstsByStep[Math.min(i, burstsByStep.length-1)];
  const intensity = i + 1;

  const baseCount = (i < 2) ? 10 : 24;
  const count     = baseCount + intensity*12;
  const delay     = Math.max(12, 70 - intensity*9);
  const durMs     = (i < 2) ? 1100 : 1500 + intensity*650;
  const scaleMin  = 1 + intensity*0.10;
  const scaleMax  = 1 + intensity*0.30;

  for (let k=0; k<count; k++){
    setTimeout(()=> spawnGhost(rect, pick(set), rand(durMs*0.9, durMs*1.2), rand(scaleMin, scaleMax)), k*delay);
  }
}
function spawnGhost(rect, text, dur=1300, scale=1){
  const g = document.createElement('div');
  g.className = 'ghost';
  g.textContent = text;
  const x = rect.left + Math.random()*rect.width;
  const y = rect.top  + Math.random()*rect.height;
  g.style.left = `${x}px`;
  g.style.top  = `${y}px`;
  g.style.setProperty('--r',  `${(Math.random()*12-6)}deg`);
  g.style.setProperty('--dur', `${dur}ms`);
  g.style.transform += ` scale(${scale})`;
  ghostLayer.appendChild(g);
  setTimeout(()=> g.remove(), dur + 150);
}

/* ===== POPUPS: distributed across screen (no top-left bias) ===== */

/* choose quadrant cycling with jitter; drift toward center as intensity grows */
function popupPosition(intensity, index){
  const r = ghostLayer.getBoundingClientRect();
  // 0..3 rotating quadrants for each popup so they spread
  const q = (index + step) % 4;
  let xMin = 0, xMax = 1, yMin = 0, yMax = 1;

  if (q === 0){ xMin=0; xMax=0.5; yMin=0;   yMax=0.5; }        // TL
  if (q === 1){ xMin=0.5; xMax=1; yMin=0;   yMax=0.5; }        // TR
  if (q === 2){ xMin=0; xMax=0.5; yMin=0.5; yMax=1;   }        // BL
  if (q === 3){ xMin=0.5; xMax=1; yMin=0.5; yMax=1;   }        // BR

  // as intensity grows, bias toward center but keep randomness
  const towardCenter = Math.min(0.45, 0.10 + intensity*0.05);
  const cx = 0.5 + (Math.random()* (xMax-xMin) + xMin - 0.5) * (1 - towardCenter);
  const cy = 0.5 + (Math.random()* (yMax-yMin) + yMin - 0.5) * (1 - towardCenter);

  // jitter so they don't overlap exactly
  const jitterX = (Math.random()-0.5) * 0.12;
  const jitterY = (Math.random()-0.5) * 0.10;

  const x = r.left + r.width  * clamp01(cx + jitterX);
  const y = r.top  + r.height * clamp01(cy + jitterY);
  return { x, y };
}

function escalatePopups(i){
  const intensity = i + 1;
  // number of popups ramps up
  const n = (intensity>=3?2:0) + (intensity>=4?2:0) + (intensity>=5?3:0) + (intensity>=6?4:0);
  for (let k=0; k<n; k++){
    setTimeout(()=> spawnPopup(intensity, k===0), k*110);
  }
}

function spawnPopup(intensity=1, scare=false){
  const p = document.createElement('div');
  p.className = 'popup' + (scare ? ' scare' : '');
  const payloads = [
    ["CONSENT UPDATE","Improved privacy experience available.","CLICK AGREE TO ACTIVATE."],
    ["SYSTEM NOTICE","INSTALL TRUST PACK TO CONTINUE.","[ ACCEPT ]   [ ACCEPT ]"],
    ["SECURITY CHECK","UNUSUAL ACTIVITY DETECTED.","VERIFY IDENTITY BY AGREEING AGAIN."],
    ["OPTIMISER","WE CAN MAKE THIS FASTER.","ENABLE AUTOMATIC AGREEMENT."]
  ];
  const [title,l1,l2] = pick(payloads);
  p.innerHTML =
    `<div class="pophead"><span>${title}</span><button class="popx" aria-label="close">X</button></div>
     <div class="popbody"><div>${l1}</div><div style="margin-top:8px;color:#ffbfbf">${l2}</div></div>`;

  // distributed position
  const pos = popupPosition(intensity, Math.floor(Math.random()*1000));
  p.style.left = `${pos.x}px`;
  p.style.top  = `${pos.y}px`;

  // scale/rotation escalate
  p.style.setProperty('--popupScale', (1 + intensity*0.26).toFixed(2));
  p.style.setProperty('--rot', `${(Math.random()*6 - 3) * (1 + intensity*0.12)}deg`);

  ghostLayer.appendChild(p);
  setTimeout(()=> p.remove(), 2600 + intensity*450);
}

/* ===== END TRANSITION ===== */
function endTransition(){
  glitchEl.classList.remove('hidden'); 
  glitchEl.classList.add('on');

  blocksEl.classList.remove('hidden');
  spawnBlocks(20);

  setTimeout(()=>{ rgbEl.classList.remove('hidden'); rgbEl.classList.add('on'); }, 220);
  setTimeout(()=>{ crashEl.classList.remove('hidden'); crashEl.classList.add('on'); }, 360);
  setTimeout(()=>{ redwashEl.classList.remove('hidden'); redwashEl.classList.add('on'); }, 560);

  setTimeout(()=>{
    wrap.classList.add('endmode');
    endScreen.classList.remove('hidden');
    requestAnimationFrame(()=> endScreen.classList.add('show'));
  }, 3600);

  setTimeout(()=> location.reload(), 10000);
}

/* ===== HELPERS ===== */
function spawnBlocks(n=12){
  const r = blocksEl.getBoundingClientRect();
  for (let i=0;i<n;i++){
    const b = document.createElement('div');
    b.className = 'block';
    const w = Math.random()*220 + 80;
    const h = Math.random()*90  + 40;
    const x = r.left + Math.random()*r.width  - w*0.5;
    const y = r.top  + Math.random()*r.height - h*0.5;
    b.style.width  = `${w}px`;
    b.style.height = `${h}px`;
    b.style.left   = `${x}px`;
    b.style.top    = `${y}px`;
    b.style.setProperty('--sx', `${(Math.random()*160-80)}px`);
    b.style.setProperty('--sy', `${(Math.random()*120-60)}px`);
    blocksEl.appendChild(b);
    setTimeout(()=> b.remove(), 1100 + Math.random()*400);
  }
}
function rand(min,max){ return min + Math.random()*(max-min) }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)] }
function clamp01(v){ return Math.max(0, Math.min(1, v)); }
