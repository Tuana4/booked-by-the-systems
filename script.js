// elements
const cb = document.getElementById('agree');
const label = document.getElementById('agreeLabel');
const flash = document.getElementById('flash');
const ghostLayer = document.getElementById('ghostLayer');
const endScreen = document.getElementById('end');
const cursorEl = document.getElementById('cursor');

/* phrases: stay centered, replace in place */
const phrases = [
  "I agree",
  "I still agree",
  "I continue to agree",
 
  "I agree to being archived",
  "I agree without reading"
];

/* red background words: only burst after each agree, then stop */
const burstWords = [
  "consent recorded","data syncing","trace detected",
  "agreement stored","file active","visibility confirmed"
];

let step = 0;
label.textContent = phrases[step];

/* make the checkbox definitely clickable (z-order sanity) */
cb.style.position = 'relative';
cb.style.zIndex = 3;
label.style.position = 'relative';
label.style.zIndex = 3;
ghostLayer.style.zIndex = 1;

/* click / change */
cb.addEventListener('change', () => {
  if(!cb.checked) return;

const cursor = document.getElementById("cursor");

document.addEventListener("mousemove", e => {
  cursor.style.left = e.clientX + "px";
  cursor.style.top = e.clientY + "px";
});

function updateHover(e) {
  const t = e.target;
  const isInteractive = t.tagName === "INPUT" || t.tagName === "LABEL" || t.closest("label");
  document.body.classList.toggle("interactive-hover", isInteractive);
}
document.addEventListener("mousemove", updateHover);
document.addEventListener("mouseover", updateHover);
document.addEventListener("mouseout", updateHover);
  // tiny red flash
  flash.classList.add('flash');
  setTimeout(() => flash.classList.remove('flash'), 200);

  // ONE-TIME red word burst (show for ~700ms) then stop
  burstOnce();

  // lock briefly for decisiveness
  cb.disabled = true;

  // move to next phrase
  setTimeout(() => {
    step++;
    if (step < phrases.length) {
      label.textContent = phrases[step];
      cb.checked = false;
      cb.disabled = false;     // re-arm for next agree
    } else {
      // final: show end message then reload after 4s
      endScreen.classList.remove('hidden');
      setTimeout(() => location.reload(), 10000);
    }
  }, 240);
});

/* one-time burst generator */
function burstOnce(){
  // spawn ~10 words randomly around center, quickly
  const center = document.querySelector('.center').getBoundingClientRect();
  const count = 10;
  for (let i=0; i<count; i++){
    setTimeout(() => spawnGhost(center), i*45); // rapid burst
  }
}

/* place a single red word */
function spawnGhost(rect){
  const g = document.createElement('div');
  g.className = 'ghost';
  g.textContent = burstWords[Math.floor(Math.random()*burstWords.length)];
  const padX = 80, padY = 60;
  const x = rect.left + padX + Math.random()*(rect.width - padX*2);
  const y = rect.top  + padY + Math.random()*(rect.height - padY*2);
  g.style.left = x + 'px';
  g.style.top  = y + 'px';
  g.style.setProperty('--r', (Math.random()*10-5)+'deg');
  document.body.appendChild(g);
  setTimeout(() => g.remove(), 1100);
}

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
