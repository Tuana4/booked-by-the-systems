
// time in header
const ts = document.getElementById('ts');
ts.textContent = new Date().toTimeString().slice(0,5);

// elements
const cursor = document.getElementById('cursor');
const grid   = document.getElementById('grid');
const stack  = document.getElementById('stack');
const flash  = document.getElementById('flash');
const s1     = document.getElementById('s1');
const s2     = document.getElementById('s2');

// custom cursor (desktop)
window.addEventListener('pointermove', (e)=>{
  cursor.style.left = e.clientX + 'px';
  cursor.style.top  = e.clientY + 'px';
});

// consent lines (each new one appears BELOW)
const lines = [
  "I agree",
  "I still agree",
  "I continue to agree",
  "I agree again (for clarity)",
  "I agree to being archived",
  "I agree without reading",
  "I agree because it’s easier"
];

// poetic system whispers
const whispers = [
  "consent recorded","trace detected","filing in progress",
  "agreement stored","214 — active","visibility confirmed",
  "form expired but processing","data syncing..."
];

let agreedCount = 0;

// build first row
addRow(lines[0]);

function addRow(text){
  const row = document.createElement('div');
  row.className = 'row';
  row.setAttribute('role','group');

  const box = document.createElement('div');
  box.className = 'box';
  box.setAttribute('aria-label', text);
  box.setAttribute('tabindex','0');

  const tick = document.createElement('div');
  tick.className = 'tick';
  tick.textContent = "✓";
  box.appendChild(tick);

  const label = document.createElement('div');
  label.className = 'label';
  label.textContent = text;

  row.appendChild(box);
  row.appendChild(label);

  const activate = () => {
    if (row.classList.contains('checked')) return;
    row.classList.add('checked');
    agreedCount++;

    ping();         // red flash
    floatGhost();   // rising system text
    compressGrid(); // boxes tighten

    if (agreedCount < lines.length){
      addRow(lines[agreedCount]);   // append NEXT row below
      stack.scrollTop = stack.scrollHeight; // auto-scroll down
    } else {
      endSequence(); // collapse
    }
  };

  // click + keyboard
  box.addEventListener('click', activate);
  label.addEventListener('click', activate);
  box.addEventListener('keydown', (e)=>{
    if(e.key === 'Enter' || e.key === ' '){ e.preventDefault(); activate(); }
  });

  stack.appendChild(row);
}

function ping(){
  flash.classList.add('flash');
  setTimeout(()=> flash.classList.remove('flash'), 200);
}

function floatGhost(){
  const g = document.createElement('div');
  g.className = 'ghost' + (Math.random()>.78 ? ' red' : '');
  g.textContent = whispers[Math.floor(Math.random()*whispers.length)];

  const rect = stack.getBoundingClientRect();
  const x = rect.left + 20 + Math.random()*(rect.width-140);
  const y = rect.top  + 10 + Math.random()*(rect.height-60);
  g.style.left = x + 'px';
  g.style.top  = y + 'px';
  g.style.setProperty('--r', (Math.random()*10-5) + 'deg');

  document.body.appendChild(g);
  setTimeout(()=> g.remove(), 1300);
}

function compressGrid(){
  const base = 22, tight = 9;
  const pct = Math.min(1, agreedCount / (lines.length)); // 0..1
  const size = base - (base - tight) * (0.25 + pct*0.75);
  grid.style.setProperty('--gx', size + 'px');
  grid.style.setProperty('--gy', size + 'px');
  if (pct > .6) document.body.classList.add('decay');
}

function endSequence(){
  // cinematic lock → flash → archive screen
  setTimeout(()=>{
    flash.classList.add('flash');
    setTimeout(()=>{
      s1.classList.remove('active');
      s2.classList.add('active');
      document.title = 'archived — BOOKED BY THE SYSTEMS';
    }, 160);
  }, 320);
}
