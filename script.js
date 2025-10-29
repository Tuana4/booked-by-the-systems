// grabs
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
const agreeSound = document.getElementById('agreeSound'); // 🔊

/* LONGER “I AGREE …” sequence (same size/position) */
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
  "I AGREE WITHOUT READING", 
];

/* red burst vocab (escalates) */
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

/* sound */
function playSound(){
  try{
    if(!agreeSound) return;
    const s = agreeSound.cloneNode(true); // allow fast overlaps
    s.volume = 0.6;
    s.play().catch(()=>{});
  }catch(e){}
}

/* guarantee label toggles checkbox even if overlapped */
label.addEventListener('click', (e)=>{
  e.preventDefault();
  if (cb.disabled) return;
  cb.checked = true;
  cb.dispatchEvent(new Event('change'));
});

/* custom cursor & interactive highlight */
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

/* main interaction */
cb.addEventListener('change', ()=>{
  if (!cb.checked) return;

  playSound();            // 🔊 play click
  flashBang();
  burstOnce(step);        // red words (full-screen)

  // First two clicks: subtle (no popups). From 3rd click: escalate count only.
  if (step >= 2) escalatePopups(step);

  cb.disabled = true;
  setTimeout(()=>{
    step++;
    if (step < phrases.length){
      label.textContent = phrases[step];
      cb.checked = false;
      cb.disabled = false;
    } else {
      endTransition();    // red system crash → final line
    }
  }, 260);
});

/* effects */
function flashBang(){
  flash.classList.add('flash');
  setTimeout(()=> flash.classList.remove('flash'), 200);
}

/* FULL-VIEW bursts — lighter for first two clicks */
function burstOnce(i){
  const rect = { left: -0.10*innerWidth, top: -0.14*innerHeight, width: innerWidth*1.20, height: innerHeight*1.28 };
  const set  = burstsByStep[Math.min(i, burstsByStep.length-1)];
  const intensity = i + 1;

  const baseCount = (i < 2) ? 10 : 24;          // subtle first two
  const count     = baseCount + intensity*12;   // then ramp
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

/* popups behind control — start at step 3, then ESCALATE COUNT ONLY (no size change) */
function escalatePopups(i){
  const intensity = i + 1;
  const n = Math.min(4 + intensity * 2, 18); // more popups as it escalates
  for (let k=0; k<n; k++){
    setTimeout(()=> spawnPopup(), k*120);
  }
}

/* constant-size popups spread around screen */
function spawnPopup(){
  const p = document.createElement('div');
  p.className = 'popup';

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

  // distribute anywhere in the ghostLayer with padding from edges
  const r = ghostLayer.getBoundingClientRect();
  const padX = r.width * 0.08;
  const padY = r.height * 0.08;
  const x = r.left + padX + Math.random()*(r.width  - padX*2);
  const y = r.top  + padY + Math.random()*(r.height - padY*2);

  p.style.left = `${x}px`;
  p.style.top  = `${y}px`;

  // keep constant size; only tiny random rotation for life
  p.style.setProperty('--rot', `${(Math.random()*6 - 3)}deg`);

  ghostLayer.appendChild(p);
  setTimeout(()=> p.remove(), 2800);
}

/* ====== GLITCHY RED END (no white lines) ====== */
function endTransition(){
  // 1) red jitter
  glitchEl.classList.remove('hidden'); 
  glitchEl.classList.add('on');

  // 2) blocky tear artifacts
  blocksEl.classList.remove('hidden');
  spawnBlocks(20);

  // 3) rgb split hit
  setTimeout(()=>{ rgbEl.classList.remove('hidden'); rgbEl.classList.add('on'); }, 220);

  // 4) red pulse burst
  setTimeout(()=>{ crashEl.classList.remove('hidden'); crashEl.classList.add('on'); }, 360);

  // 5) long red wash
  setTimeout(()=>{ redwashEl.classList.remove('hidden'); redwashEl.classList.add('on'); }, 560);

  // 6) hide UI → reveal final line only
  setTimeout(()=>{
    wrap.classList.add('endmode');
    endScreen.classList.remove('hidden');
    requestAnimationFrame(()=> endScreen.classList.add('show'));
  }, 3600);

  // 7) loop back
  setTimeout(()=> location.reload(), 10000);
}

/* helpers */
function spawnBlocks(n=12){
  const r = blocksEl.getBoundingClientRect();
  for (let i=0;i<n;i++){
    const b = document.createElement('div');
    b.className = 'block';
    const w = Math.random()*220 + 80;   // 80–300px
    const h = Math.random()*90  + 40;   // 40–130px
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
