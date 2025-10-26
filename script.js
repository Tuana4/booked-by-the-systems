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
const redwashEl = document.getElementById('redwash');
const endScreen = document.getElementById('end');
const ekg = document.getElementById('ekg');
const cursorEl = document.getElementById('cursor');

/* phrases */
const phrases = [
  "I AGREE","I STILL AGREE","I CONTINUE TO AGREE",
  "I AGREE AGAIN (FOR CLARITY)","I AGREE TO BEING ARCHIVED","I AGREE WITHOUT READING"
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

/* layering */
cb.style.zIndex = 51; label.style.zIndex = 51; ghostLayer.style.zIndex = 1;

/* cursor */
document.addEventListener('mousemove', (e)=>{ cursorEl.style.left = e.clientX+'px'; cursorEl.style.top = e.clientY+'px'; });
document.addEventListener('mousemove', hover); document.addEventListener('mouseover', hover); document.addEventListener('mouseout', hover);
function hover(e){ const t=e.target; const i=t.tagName==='INPUT'||t.tagName==='LABEL'||t.closest('label'); document.body.classList.toggle('interactive-hover', !!i); }

/* click flow */
cb.addEventListener('change', () => {
  if(!cb.checked) return;
  flashBang(); burstOnce(step); escalatePopups(step);
  cb.disabled = true;
  setTimeout(() => {
    step++;
    if (step < phrases.length) { label.textContent = phrases[step]; cb.checked=false; cb.disabled=false; }
    else { endTransition(); }
  }, 260);
});

function flashBang(){ flash.classList.add('flash'); setTimeout(()=> flash.classList.remove('flash'), 200); }

/* red text bursts */
function burstOnce(i){
  const rect = centerEl.getBoundingClientRect();
  const set = burstsByStep[Math.min(i, burstsByStep.length-1)];
  const intensity = i+1, count=16+intensity*10, delay=Math.max(10,70-intensity*9);
  const dur=1400+intensity*600, sMin=1+intensity*.12, sMax=1+intensity*.28;
  for(let k=0;k<count;k++){
    setTimeout(()=> spawnGhost(rect, pick(set), rand(dur*.9,dur*1.15), rand(sMin,sMax)), k*delay);
  }
}
function spawnGhost(rect, text, dur=1300, scale=1){
  const g=document.createElement('div'); g.className='ghost'; g.textContent=text;
  const padX=60,padY=50, x=rect.left+padX+Math.random()*(rect.width-padX*2), y=rect.top+padY+Math.random()*(rect.height-padY*2);
  g.style.left=x+'px'; g.style.top=y+'px'; g.style.setProperty('--r',(Math.random()*12-6)+'deg'); g.style.setProperty('--dur',dur+'ms'); g.style.transform+=` scale(${scale})`;
  ghostLayer.appendChild(g); setTimeout(()=>g.remove(), dur+120);
}

/* popups behind control */
function escalatePopups(i){
  const intensity=i+1;
  const n=(intensity>=2?1:0)+(intensity>=3?1:0)+(intensity>=4?2:0)+(intensity>=5?4:0);
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
  const r=ghostLayer.getBoundingClientRect(); const bias=Math.max(0.5-intensity*0.08,0.12);
  const cx=r.left+r.width*(0.5+(Math.random()*bias*2-bias));
  const cy=r.top+r.height*(0.5+(Math.random()*bias*2-bias));
  p.style.left=cx+'px'; p.style.top=cy+'px';
  p.style.setProperty('--popupScale',(1+intensity*0.24).toFixed(2));
  p.style.setProperty('--rot',(Math.random()*6-3)*(1+intensity*0.12)+'deg');
  ghostLayer.appendChild(p); setTimeout(()=>p.remove(), 2600+intensity*450);
}

/* ====== BROKEN SURGERY END ====== */
function endTransition(){
  // start glitch + surgical tint + ekg + slice cuts
  glitchEl.classList.remove('hidden'); glitchEl.classList.add('on');
  surgicalEl.classList.remove('hidden'); surgicalEl.classList.add('on');
  ekg.classList.remove('hidden'); ekg.classList.add('show');
  setTimeout(()=>{ slicesEl.classList.remove('hidden'); slicesEl.classList.add('on'); }, 180);

  // after a beat, red wash (with plateau)
  setTimeout(()=>{ redwashEl.classList.remove('hidden'); redwashEl.classList.add('on'); }, 420);

  // then hide UI and show ONLY the final line
  setTimeout(()=>{
    wrap.classList.add('endmode');
    endScreen.classList.remove('hidden');
    requestAnimationFrame(()=> endScreen.classList.add('show'));
  }, 3300);

  // auto reload
  setTimeout(()=> location.reload(), 10000);
}

/* utils */
function rand(min,max){ return min + Math.random()*(max-min); }
function pick(arr){ return arr[Math.floor(Math.random()*arr.length)]; }
