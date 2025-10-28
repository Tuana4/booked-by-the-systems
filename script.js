/* elements */
const cb         = document.getElementById('agree');
const label      = document.getElementById('agreeLabel');
const ghostLayer = document.getElementById('ghostLayer');
const flash      = document.getElementById('flash');
const glitchEl   = document.getElementById('glitch');
const rgbEl      = document.getElementById('rgb');
const redwashEl  = document.getElementById('redwash');
const crashEl    = document.getElementById('crash');
const endScreen  = document.getElementById('end');
const cursorEl   = document.getElementById('cursor');
const agreeSound = document.getElementById('agreeSound');

/* phrases (stay same size/position; only text changes) */
const phrases = [
  "I AGREE","I STILL AGREE","I CONTINUE TO AGREE","I AGREE AGAIN",
  "I AGREE TO CONTINUE AGREEING","I AGREE TO BEING ARCHIVED",
  "I AGREE WITHOUT READING","I AGREE TO THE SYSTEM",
  "I AGREE TO YOUR TERMS","I AGREE TO ALL FUTURE AGREEMENTS"
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
label.textContent = phrases[0];

/* label always toggles checkbox even if overlapped */
label.addEventListener('click', (e)=>{
  e.preventDefault();
  if (cb.disabled) return;
  cb.checked = true;
  cb.dispatchEvent(new Event('change'));
});

/* custom cursor follows + highlights interactive */
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
  if(!cb.checked) return;

  playSound();
  flashBang();
  burstOnce(step);                 // red words everywhere

  if (step >= 2) escalatePopups(step); // popups from click #3

  cb.disabled = true;
  setTimeout(()=>{
    step++;
    if (step < phrases.length){
      label.textContent = phrases[step];
      cb.checked = false;
      cb.disabled = false;
    } else {
      endTransition();             // smooth red crash → final line
    }
  }, 320);
});

/* sound */
function playSound(){
  try{
    const s = agreeSound.cloneNode(true); // allow rapid clicks
    s.volume = 0.6;
    s.play().catch(()=>{});
  }catch(e){}
}

/* flash */
function flashBang(){
  flash.classList.add('flash');
  setTimeout(()=> flash.classList.remove('flash'), 200);
}

/* full-bleed bursts (gentle first two, then ramp) */
function burstOnce(i){
  const set  = burstsByStep[Math.min(i,burstsByStep.length-1)];
  const count = (i<2 ? 14 : 28) + i*10;
  const dur   = (i<2 ? 1200 : 1500) + i*400;

  for(let k=0;k<count;k++){
    setTimeout(()=>{
      const g = document.createElement('div');
      g.className = 'ghost';
      g.textContent = set[Math.floor(Math.random()*set.length)];
      g.style.left = (Math.random()*120 - 10) + 'vw'; // -10vw..110vw
      g.style.top  = (Math.random()*140 - 20) + 'vh'; // -20vh..120vh
      g.style.setProperty('--r', `${(Math.random()*12-6)}deg`);
      g.style.setProperty('--dur', `${dur}ms`);
      ghostLayer.appendChild(g);
      setTimeout(()=> g.remove(), dur + 200);
    }, k*40);
  }
}

/* popups distributed across quadrants + drift */
function escalatePopups(i){
  const n = Math.min(6 + i*2, 18);
  for(let k=0;k<n;k++){
    setTimeout(()=> spawnPopup(i, k===0), k*110);
  }
}
function spawnPopup(intensity=1, scare=false){
  const p = document.createElement('div');
  p.className = 'popup';

  const payloads = [
    ["CONSENT UPDATE","IMPROVED PRIVACY EXPERIENCE AVAILABLE.","CLICK AGREE TO ACTIVATE."],
    ["SYSTEM NOTICE","INSTALL TRUST PACK TO CONTINUE.","[ ACCEPT ]   [ ACCEPT ]"],
    ["SECURITY CHECK","UNUSUAL ACTIVITY DETECTED.","VERIFY IDENTITY BY AGREEING AGAIN."],
    ["OPTIMISER","WE CAN MAKE THIS FASTER.","ENABLE AUTOMATIC AGREEMENT."]
  ];
  const [title,l1,l2] = payloads[Math.floor(Math.random()*payloads.length)];
  p.innerHTML =
    `<div class="pophead"><span>${title}</span><button class="popx">X</button></div>
     <div class="popbody"><div>${l1}</div><div style="margin-top:8px;color:#ffbfbf">${l2}</div></div>`;

  // distribute across screen, bias toward center as intensity rises
  const q = (kRand(0,3) + step) % 4;
  let xr=[0,0.5], yr=[0,0.5];           // TL
  if(q===1) xr=[0.5,1], yr=[0,0.5];     // TR
  if(q===2) xr=[0,0.5], yr=[0.5,1];     // BL
  if(q===3) xr=[0.5,1], yr=[0.5,1];     // BR
  const bias = Math.min(0.45, 0.10 + intensity*0.05);
  const cx = 0.5 + (Math.random()*(xr[1]-xr[0]) + xr[0] - 0.5) * (1-bias);
  const cy = 0.5 + (Math.random()*(yr[1]-yr[0]) + yr[0] - 0.5) * (1-bias);

  const r = ghostLayer.getBoundingClientRect();
  const x = r.left + r.width  * cx;
  const y = r.top  + r.height * cy;
  p.style.left = x + 'px';
  p.style.top  = y + 'px';

  p.style.setProperty('--popupScale', (1 + intensity*0.26).toFixed(2));
  p.style.setProperty('--rot', `${(Math.random()*6 - 3) * (1 + intensity*0.12)}deg`);
  const amp = 6 + intensity * 6;
  p.style.setProperty('--dx', `${(Math.random()*amp + amp/2).toFixed(1)}px`);
  p.style.setProperty('--dy', `${(Math.random()*amp + amp/2).toFixed(1)}px`);
  p.style.setProperty('--driftDur', `${(7 - Math.min(4.5, intensity*0.8)).toFixed(2)}s`);

  ghostLayer.appendChild(p);
  setTimeout(()=> p.remove(), 2600 + intensity*550);
}

/* end transition: glitch → rgb → crash → redwash → final line */
function endTransition(){
  glitchEl.classList.remove('hidden'); glitchEl.classList.add('on');
  setTimeout(()=> rgbEl.classList.add('on'), 300);
  setTimeout(()=> crashEl.classList.add('on'), 500);
  setTimeout(()=> redwashEl.classList.add('on'), 700);

  setTimeout(()=>{
    endScreen.classList.remove('hidden');
    endScreen.classList.add('show');
  }, 4000);

  setTimeout(()=> location.reload(), 10000);
}

/* helpers */
function kRand(min,max){ return Math.floor(Math.random()*(max-min+1))+min }
