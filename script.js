// elements
const cb = document.getElementById('agree');
const label = document.getElementById('agreeLabel');
const flash = document.getElementById('flash');
const ghostLayer = document.getElementById('ghostLayer');
const endScreen = document.getElementById('end');
const cursorEl = document.getElementById('cursor');
const centerEl = document.getElementById('center');

/* phrases: stay centered, replace in place */
const phrases = [
  "I agree",
  "I still agree",
  "I continue to agree",
  "I agree again (for clarity)",
  "I agree to being archived",
  "I agree without reading"
];

/* escalating AI-ish sets (longer, creepier) */
const burstsByStep = [
  [
    "consent recorded",
    "trace detected",
    "data syncing"
  ],
  [
    "compliance verified",
    "visibility confirmed",
    "profiling initiated",
    "session id: 214—active"
  ],
  [
    "compiling emotional metrics",
    "estimating persuasion index",
    "risk assessment: low | proceed",
    "time-on-task logged"
  ],
  [
    "generating compliance report",
    "predictive consent model updating",
    "exporting user fingerprint > ok",
    "intent cache warm • archival queue"
  ],
  [
    "install trust pack? [ yes ] [ yes ]",
    "security upgrade required to continue",
    "system performance degrading • retry",
    "auto-consent enabled • silent mode"
  ],
  [
    "error: user still present",
    "manual override denied",
    "archiving user intent • success",
    "finalizing agreement • do not close"
  ]
];

let step = 0;
label.textContent = phrases[step];

/* make the checkbox definitely clickable (z-order sanity) */
cb.style.position = 'relative';
cb.style.zIndex = 3;
label.style.position = 'relative';
label.style.zIndex = 3;
ghostLayer.style.zIndex = 1;

/* transparent circular cursor that follows mouse */
document.addEventListener('mousemove', (e)=>{
  cursorEl.style.left = e.clientX + 'px';
  cursorEl.style.top  = e.clientY + 'px';
});

/* cursor turns red over interactive elements */
function updateHoverState(e){
  const t = e.target;
  const interactive = t.tagName === 'INPUT' || t.tagName === 'LABEL' || t.closest('label');
  document.body.classList.toggle('interactive-hover', !!interactive);
}
document.addEventListener('mousemove', updateHoverState);
document.addEventListener('mouseover', updateHoverState);
document.addEventListener('mouseout', updateHoverState);

/* ========= interaction (escalation) ========= */
cb.addEventListener('change', () => {
  if(!cb.checked) return;

  pingFlash();

  // red words: longer on screen + denser/faster each step
  burstOnce(step);

  // visuals: bigger popups, more centered, jump-scare bumps, shakes
  escalateVisual(step);

  // lock briefly
  cb.disabled = true;

  // advance text or end
  setTimeout(() => {
    step++;
    if (step < phrases.length) {
      label.textContent = phrases[step];
      cb.checked = false;
      cb.disabled = false;     // re-arm for next agree
    } else {
      // collapse → end message → auto reload
      endScreen.classList.remove('hidden');
      setTimeout(() => location.reload(), 10000);
    }
  }, 260);
});

/* quick red flash */
function pingFlash(){
  flash.classList.add('flash');
  setTimeout(()=> flash.classList.remove('flash'), 200);
}

/* === Ghost bursts: longer + bigger each click === */
function burstOnce(i){
  const rect = document.querySelector('.center').getBoundingClientRect();
  const set  = burstsByStep[Math.min(i, burstsByStep.length-1)];

  // intensity curve (1..6)
  const intensity = i + 1;
  const count     = 16 + intensity*10;             // more phrases
  const delay     = Math.max(10, 70 - intensity*9);// faster spawns
  const durMs     = 1400 + intensity*600;          // stay longer
  const scaleMin  = 1 + intensity*0.12;
  const scaleMax  = 1 + intensity*0.28;

  for (let k=0; k<count; k++){
    setTimeout(() => {
      spawnGhost(rect, randFrom(set), durMs, rand(scaleMin, scaleMax));
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

  document.body.appendChild(g);
  setTimeout(() => g.remove(), durMs + 80);
}

/* === Visual escalation: popups bigger/closer/more, jumps, shake === */
function escalateVisual(i){
  const intensity = i + 1;

  // near jump-scare bumps
  centerEl.classList.remove('bump','shrink','shake','bumpBig');
  if (intensity === 1) centerEl.classList.add('bump');
  if (intensity === 2) centerEl.classList.add('shrink');
  if (intensity === 3 || intensity === 4) centerEl.classList.add('bump');
  if (intensity >= 5) centerEl.classList.add('bumpBig');

  // shake from mid-steps upward
  if (intensity >= 3){
    centerEl.classList.add('shake');
    setTimeout(()=> centerEl.classList.remove('shake'), 560);
  }

  // spawn popups — count & size scale with intensity; first popup flashes (scare)
  const popupCount =
      (intensity >= 2 ? 1 : 0) +
      (intensity >= 3 ? 1 : 0) +
      (intensity >= 4 ? 2 : 0) +
      (intensity >= 5 ? 4 : 0);
  for(let n=0;n<popupCount;n++){
    setTimeout(()=> spawnPopup(intensity, n===0), n*120);
  }
}

/* === Popups: bigger, closer to center, brief scare glow === */
function spawnPopup(intensity=1, doScare=false){
  const p = document.createElement('div');
  p.className = 'popup' + (doScare ? ' scare' : '');

  const payloads = [
    ["SYSTEM NOTICE","Install Trust Pack to continue.","[ ACCEPT ]   [ ACCEPT ]"],
    ["CONSENT UPDATE","Improved privacy experience available.","Click AGREE to activate."],
    ["SECURITY CHECK","Unusual activity detected.","Verify identity by agreeing again."],
    ["OPTIMISER","We can make this faster.","Enable automatic agreement."]
  ];
  const [title, l1, l2] = randFrom(payloads);
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

  // position: converge toward center as intensity rises
  const r = ghostLayer.getBoundingClientRect();
  const centerBias = Math.max(0.5 - intensity*0.08, 0.12); // 0.5 → 0.12
  const cx = r.left + r.width  * (0.5 + (Math.random()*centerBias*2 - centerBias));
  const cy = r.top  + r.height * (0.5 + (Math.random()*centerBias*2 - centerBias));
  p.style.left = cx + 'px';
  p.style.top  = cy + 'px';

  // bigger and slightly more rotated at higher intensity
  p.style.setProperty('--popupScale', (1 + intensity*0.18).toFixed(2));
  p.style.setProperty('--rot', (Math.random()*6 - 3) * (1 + intensity*0.12) + 'deg');

  document.body.appendChild(p);

  // close or auto-remove
  p.querySelector('.popx').addEventListener('click', () => p.remove());
  const life = 2600 + intensity*400; // live longer at higher intensity
  setTimeout(() => p.remove(), life);
}

/* helpers */
function rand(min,max){ return min + Math.random()*(max-min); }
function randFrom(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
