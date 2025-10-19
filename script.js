// /script.js
(() => {
  const phrases = [
    "I agree",
    "I still agree",
    "I continue to agree",
    "I agree again (for clarity)",
    "I agree to being archived",
    "I agree without reading",
    "I agree because it’s easier"
  ];

  const systemWords = [
    "consent recorded", "data syncing", "file archived",
    "trace detected", "214—active", "node confirmed",
    "packet sealed", "hash written", "audit queued",
    "consent verified", "id matched", "session bound"
  ];

  const checksEl = document.getElementById("checks");
  const gridEl = document.querySelector(".grid");
  const flashEl = document.getElementById("flash");
  const wordsLayer = document.getElementById("system-words");
  const endEl = document.getElementById("end");
  const cursorEl = document.getElementById("cursor");

  let idx = 0;
  let ended = false;
  let mouse = { x: window.innerWidth/2, y: window.innerHeight/2 };
  let halo = { x: mouse.x, y: mouse.y };

  function addRow(text){
    const row = document.createElement("label");
    row.className = "row";
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.setAttribute("aria-label", text);
    const span = document.createElement("span");
    span.className = "label";
    span.textContent = text;

    cb.addEventListener("change", () => onTick(row, cb));
    row.appendChild(cb);
    row.appendChild(span);
    checksEl.appendChild(row);
    row.scrollIntoView({behavior:"smooth", block:"end"});
    cb.focus({preventScroll:true});
  }

  function onTick(row, cb){
    if(!cb.checked){ cb.checked = true; return; } // why: disallow untick flicker
    cb.disabled = true;
    row.classList.add("locked");
    impact();
    idx++;
    if(idx < phrases.length){
      // slight delay for rhythm
      setTimeout(() => addRow(phrases[idx]), 220);
    }else{
      finalSequence();
    }
  }

  function impact(){
    flash();
    tightenGrid();
    spawnWords(randomInt(3,5));
  }

  function flash(){
    flashEl.classList.remove("active");
    // force reflow to restart animation
    void flashEl.offsetWidth;
    flashEl.classList.add("active");
  }

  function tightenGrid(){
    gridEl.classList.remove("tighten");
    void gridEl.offsetWidth;
    gridEl.classList.add("tighten");
    // nudge base grid size smaller each time (persistent claustrophobia)
    const cs = getComputedStyle(document.documentElement).getPropertyValue("--grid-size").trim();
    const curr = parseFloat(cs);
    const next = Math.max(18, curr - 4);
    document.documentElement.style.setProperty("--grid-size", `${next}px`);
  }

  function spawnWords(count){
    for(let i=0;i<count;i++){
      const w = document.createElement("div");
      w.className = "word";
      w.textContent = pick(systemWords);
      const left = randomInt(4, 86);   // %
      const top = randomInt(40, 86);   // start lower half
      const size = randomInt(10, 18);  // vw-ish feel across devices
      const dur = randomFloat(1.2, 2.2);
      w.style.left = `${left}vw`;
      w.style.top = `${top}vh`;
      w.style.fontSize = `clamp(12px, ${size/3}vw, ${size}px)`;
      w.style.animationDuration = `${dur}s`;
      w.addEventListener("animationend", () => w.remove());
      wordsLayer.appendChild(w);
    }
  }

  function finalSequence(){
    if(ended) return;
    ended = true;
    document.body.classList.add("glitch");
    // brief glitch, then blackout
    setTimeout(() => {
      document.body.classList.remove("glitch");
      endEl.classList.remove("hidden");
      requestAnimationFrame(() => endEl.classList.add("show"));
      // lock all interactions and fade cursor
      document.body.classList.add("no-cursor");
      // prevent any further focus/keys
      blockInput();
    }, 650);
  }

  function blockInput(){
    // why: exhibition hard stop
    const stopper = (e)=>{ e.stopPropagation(); e.preventDefault(); };
    ["click","mousedown","mouseup","pointerdown","pointerup","touchstart","touchend","keydown","scroll","wheel"]
      .forEach(ev => window.addEventListener(ev, stopper, {capture:true, passive:false}));
  }

  // Cursor halo follow
  window.addEventListener("mousemove", (e)=>{
    mouse.x = e.clientX; mouse.y = e.clientY;
  }, {passive:true});

  function animate(){
    // ease follow
    halo.x += (mouse.x - halo.x) * 0.18;
    halo.y += (mouse.y - halo.y) * 0.18;
    cursorEl.style.transform = `translate(${halo.x}px, ${halo.y}px) translate(-50%, -50%)`;
    requestAnimationFrame(animate);
  }

  // Utilities
  const pick = arr => arr[Math.floor(Math.random()*arr.length)];
  const randomInt = (a,b)=> Math.floor(Math.random()*(b-a+1))+a;
  const randomFloat = (a,b)=> Math.random()*(b-a)+a;

  // Init
  addRow(phrases[idx]);
  animate();
})();
