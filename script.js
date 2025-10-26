// elements
const wrap = document.getElementById('wrap');
const centerEl = document.getElementById('center');
const ghostLayer = document.getElementById('ghostLayer');
const cb = document.getElementById('agree');
const label = document.getElementById('agreeLabel');
const flash = document.getElementById('flash');
const glitchEl = document.getElementById('glitch');
const surgicalEl = document.getElementById('surgical');
const slicesEl = document.getElementById('slices');
const rgbEl = document.getElementById('rgb');
const redwashEl = document.getElementById('redwash');
const endScreen = document.getElementById('end');
const ekg = document.getElementById('ekg');
const cursorEl = document.getElementById('cursor');

/* LONGER “I AGREE” SEQUENCE (same size/position) */
const phrases = [
  "I AGREE",
  "I STILL AGREE",
  "I CONTINUE TO AGREE",
  "I AGREE AGAIN (FOR CLARITY)",
  "I AGREE COMPLETELY",
  "I AGREE BY DEFAULT",
  "I AGREE FASTER THIS TIME",
  "I AGREE TO CONTINUE AGREEING",
  "I AGREE WITHOUT THINKING",
  "I AGREE TO BEING ARCHIVED",
  "I AGREE WITHOUT READING",
  "I AGREE IN ADVANCE",
  "I AGREE FOR YOUR CONVENIENCE",
  "I AGREE TO THE SYSTEM",
  "I AGREE TO AUTO-CONSENT",
  "I AGREE TO YOUR TERMS",
  "I AGREE WITHOUT CONSEQUENCE",
  "I AGREE WITHOUT UNDERSTANDING",
  "I AGREE BECAUSE I MUST",
  "I AGREE ENTIRELY",
  "I AGREE TO ALL FUTURE AGREEMENTS",
  "I AGREE TO KEEP AGREEING"
];

/* escalating AI-ish sets (used for red bursts) */
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

/* ensure control is clickable above everything */
cb.style.zIndex = 51; label.style.zIndex = 51; ghostLayer.style.zIndex = 1;

/* custom cursor + hover state */
document.addEventListener('mousemove', (e)=>{ cursorEl.style.left = e.clientX+'px'; cursorEl.style.top = e.clientY+'px'; });
['mousemove','mouseover','mouseout'].forEach(evt=>{
  document.addEventListener(evt, e=>{
    const t=e.target; const interactive=t.tagName==='INPUT'||t.tagName==='LABEL'||t.closest('label');
    document.body.classList.toggle('interactive-hover', !!interactive);
  });
});

/* interaction logic */
cb.addEventListener('change', () => {
  if(!cb.checked) return;

  flashBang();
  burstOnce(step);        // red words (full screen)
  escalatePopups(step);   // popups (behind)

  cb.disabled = true;
  setTimeout(() => {
    step++;
    if (step < phrases.length) {
      label.textContent = phrases[step];
      cb.checked = false;
      cb.disabled = false;
    } else {
      endTransition();    // glitchier ending
    }
  }, 260);
});

function flashBang(){ flash.classList.add('flash'); setTimeout(()=> flash.classList.remove('flash'), 200); }

/* FULL-VIEW bursts so they reach top and bottom */
function burstOnce(i){
  const rect = { left: -0.08*innerWidth, top: -0.12*innerHeight, width: innerWidth*1.16, height: innerHeight*1.24 };
  const set  = burstsByStep[Math.min(i, burstsByStep.length-1)];
  const intensity = i + 1;
  const count     = 22 + intensity*12;           // dense
  const delay     = Math.max(8, 70 - intensity*9);
  const durMs     = 1500 + intensity*650;        // linger
  const scaleMin  = 1 + intensity*0.12;
  const scaleMax  = 1 + intensity*0.30;

  for (let k=0; k<count; k++){
    setTimeout(() => spawnGhost(rect, pick(set), rand(durMs*0.9, durMs*1.2), rand(scaleMin, scaleMax)), k*delay);
  }
}

function spawnGhost(rect, text, dur=1300, scale=1){
  const g=document.createElement('div'); g.className='ghost'; g.textContent=text;
  const x = rect.left + Math.random()*rect.width;
  const y = rect.top  + Math.random()*rect.height;
  g.style.left = x + 'px'; g.style.top = y + 'px';
  g.style.setProperty('--r', (Math.random()*12-6)+'deg');
  g.style.setProperty('--dur', dur+'ms');
  g.style.transform += ` scale(${scale})`;
  ghostLayer.appendChild(g);
  setTimeout(()=> g.remove(), dur + 150);
}

/* popups behind control — bigger/closer/more per step; also full-screen placement */
function escalatePopups(i){
  const intensity = i + 1;
  const n = (intensity>=2?1:0) + (intensity>=3?1:0) + (intensity>=4?2:0) + (intensity>=5?4:0);
  for(let k=0;k<n;k++){ setTimeout(()=> spawnPopup(intensity, k===0), k*120); }
}

function spawnPopup(intensity=1, scare=false){
  const p=document.createElement('div'); p.className='popup'+(scare?' scare':'');
  const payloads=[
    ["SYSTEM NOTICE","Install Trust Pack to continue.","[ ACCEPT ]   [ ACCEPT ]"],
    ["CONSENT UPDATE","Improved privacy experience available.","Click AGREE to activate."],
    ["SECURITY CHECK","Unusual activity detected.","Verify identity by agreeing again."],
    ["OPTIMISER","We can make this faster.","Enable automatic agreement."]
  ];
  const [title,l1,l2]=pick(payloads);
  p.innerHTML=`<div class="pophead"><span>${title}</span><button class="popx" aria-label="close">X</button></div>
               <div class="popbody"><div>${l1}</div><div style="margin-top:8px;color:#ffbfbf">${l2}</div></div>`;

  // place anywhere within the full-bleed ghostLayer
  const r=ghostLayer.getBoundingClientRect();
  const bias=Math.max(0.5-intensity*0.08,0.12);
  const cx=r.left+r.width*(0.5+(Math.random()*bias*2-bias));
  const cy=r.top+r.height*(0.5+(Math.random()*bias*2-bias));
  p.style.left=cx+'px'; p.style.top=cy+'px';

  p.style.setProperty('--popupScale', (1 + intensity*0.26).toFixed(2));
  p.style.setProperty('--rot', (Math.random()*6 - 3) * (1 + intensity*0.12) + 'deg');

  ghostLayer.appendChild(p);
  setTimeout(()=> p.remove(), 2600 + intensity*450);
}

/* ====== GLITCHIER END (RGB split + surgical + slices + long red) ====== */
function endTransition(){
  glitchEl.classList.remove('hidden'); glitchEl.classList.add('on');
  surgicalEl.classList.remove('hidden'); surgicalEl.classList.add('on');
  ekg.classList.remove('hidden'); ekg.classList.add('show');
  setTimeout(()=>{ slicesEl.classList.remove('hidden'); slicesEl.classList.add('on'); }, 160);
  setTimeout(()=>{ rgbEl.classList.remove('hidden'); rgbEl.classList.add('on'); }, 300);
  setTimeout(()=>{ redwashEl.classList.remove('hidden'); redwashEl.classList.add('on'); }, 480);

  setTimeout(()=>{
    wrap.classList.add('endmode');             // hide UI
    endScreen.classList.remove('hidden');
    requestAnimationFrame(()=> endScreen.classList.add('show'));
  }, 3300);

  setTimeout(()=> location.reload(), 10000);
}

/* helpers */
function rand(min,max){ return min + Math.random()*(max-min); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
