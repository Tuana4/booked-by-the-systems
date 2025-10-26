// elements
const wrap = document.getElementById('wrap');
const mast = document.getElementById('mast');
const centerEl = document.getElementById('center');
const ghostLayer = document.getElementById('ghostLayer');
const cb = document.getElementById('agree');
const label = document.getElementById('agreeLabel');
const flash = document.getElementById('flash');
const glitchEl = document.getElementById('glitch');
const redwashEl = document.getElementById('redwash');
const endScreen = document.getElementById('end');
const cursorEl = document.getElementById('cursor');

/* label sequence (kept for concept, but constant sizing) */
const phrases = [
  "I AGREE",
  "I STILL AGREE",
  "I CONTINUE TO AGREE",
  "I AGREE AGAIN (FOR CLARITY)",
  "I AGREE TO BEING ARCHIVED",
  "I AGREE WITHOUT READING"
];

/* escalating AI-ish sets */
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

/* layering for clickability */
cb.style.position = 'relative';
cb.style.zIndex = 51;
label.style.position = 'relative';
label.style.zIndex = 51;
ghostLayer.style.zIndex = 1;

/* cursor follow + hover */
document.addEventListener('mousemove', (e)=>{
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
});
function updateHoverState(e){
  const t = e.target;
  const interactive = t.tagName === 'INPUT' || t.tagName === 'LABEL' || t.closest('label');
  document.body.classList.toggle('interactive-hover', !!interactive);
}
document.addEventListener('mousemove', updateHoverState);
document.addEventListener('mouseover', updateHoverState);
document.addEventListener('mouseout', updateHoverState);

/* interaction */
cb.addEventListener('change', () => {
  if(!cb.checked) return;

  flashBang();
  burstOnce(step);        // red words behind
  escalatePopups(step);   // popups behind

  // lock briefly
  cb.disabled = true;

  // next or end
  setTimeout(() => {
    step++;
    if (step < phrases.length) {
      label.textContent = phrases[step];
      cb.checked = false;
      cb.disabled = false;
    } else {
      endTransition();    // glitch → long red wash → only final line
    }
  }, 260);
});

/* effects */
function flashBang(){
  flash.classList.add('flash');
  setTimeout(()=> flash.classList.remove('flash'), 200);
}

/* bursts get denser, faster, larger, and stay longer */
function burstOnce(i){
  const rect = centerEl.getBoundingClientRect();
  const set  = burstsByStep[Math.min(i, burstsByStep.length-1)];
  const intensity = i + 1;                 // 1..6
  const count     = 16 + intensity*10;     // more phrases
  const delay     = Math.max(10, 70 - intensity*9); // faster spawns
  const durMs     = 1400 + intensity*600;  // stay longer
  const scaleMin  = 1 + intensity*0.12;
  const scaleMax  = 1 + intensity*0.28;

  for (let k=0; k<count; k++){
    setTimeout(() => {
      spawnGhost(rect, pick(set), rand(durMs*0.9, durMs*1.15), rand(scaleMin, scaleMax));
    }, k*delay);
  }
}

function spawnGhost(rect, text, durMs=1300, scale=1){
  const g = document.createElement('div');
  g.className = 'ghost';
  g.textContent = text;

  const padX = 60, padY = 50;
  const x = rect.left + padX + Math.random()*(rect.width - padX*2);
  const y = rect.top  + padY + Math.random()*(rect.height - padY*2);

  g.style.left = x + 'px';
  g.style.top  = y + 'px';
  g.style.setProperty('--r', (Math.random()*12-6)+'deg');
  g.style.setProperty('--dur', durMs+'ms');
  g.style.transform += ` scale(${scale})`;

  ghostLayer.appendChild(g);            // behind control
  setTimeout(() => g.remove(), durMs + 120);
}

/* popups behind control — bigger/closer/more frequent per step */
function escalatePopups(i){
  const intensity = i + 1;
  const popupCount =
      (intensity >= 2 ? 1 : 0) +
      (intensity >= 3 ? 1 : 0) +
      (intensity >= 4 ? 2 : 0) +
      (intensity >= 5 ? 4 : 0);
  for(let n=0;n<popupCount;n++){
    setTimeout(()=> spawnPopup(intensity, n===0), n*120);
  }
}

function spawnPopup(intensity=1, doScare=false){
  const p = document.createElement('div');
  p.className = 'popup' + (doScare ? ' scare' : '');

  const payloads = [
    ["SYSTEM NOTICE","Install Trust Pack to continue.","[ ACCEPT ]   [ ACCEPT ]"],
    ["CONSENT UPDATE","Improved privacy experience available.","Click AGREE to activate."],
    ["SECURITY CHECK","Unusual activity detected.","Verify identity by agreeing again."],
    ["OPTIMISER","We can make this faster.","Enable automatic agreement."]
  ];
  const [title, l1, l2] = pick(payloads);
  p.innerHTML = `
    <div class="pophead">
      <span>${title}</span>
      <button class="popx" aria-label="close">X</button>
    </div>
    <div class="popbody">
      <div>${l1}</div>
      <div style="margin-top:8px;color:#ffbfbf">${l2}</div>
    </div>
  `;

  // converge toward center as intensity rises
  const r = ghostLayer.getBoundingClientRect();
  const centerBias = Math.max(0.5 - intensity*0.08, 0.12); // 0.5 → 0.12
  const cx = r.left + r.width  * (0.5 + (Math.random()*centerBias*2 - centerBias));
  const cy = r.top  + r.height * (0.5 + (Math.random()*centerBias*2 - centerBias));
  p.style.left = cx + 'px';
  p.style.top  = cy + 'px';

  // bigger & more rotated as intensity increases
  p.style.setProperty('--popupScale', (1 + intensity*0.24).toFixed(2));  // escalate
  p.style.setProperty('--rot', (Math.random()*6 - 3) * (1 + intensity*0.12) + 'deg');

  ghostLayer.appendChild(p);            // behind control
  setTimeout(() => p.remove(), 2600 + intensity*450);
}

/* end transition: glitch → LONG red wash (~3.2s) → ONLY final line */
function endTransition(){
  glitchEl.classList.remove('hidden');
  redwashEl.classList.remove('hidden');

  glitchEl.classList.add('on');                 // ~0.7s glitch
  setTimeout(()=> redwashEl.classList.add('on'), 80);   // red wash w/ plateau

  // after the wash, hide all UI and show only the end line
  setTimeout(()=>{
    wrap.classList.add('endmode');              // hides mast + center
    endScreen.classList.remove('hidden');
    requestAnimationFrame(()=> endScreen.classList.add('show')); // smooth fade
  }, 3200);

  // auto reload
  setTimeout(()=> location.reload(), 10000);
}

/* helpers */
function rand(min,max){ return min + Math.random()*(max-min); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
