:root{ --bg:#000; --ink:#fff; --red:#ff2a2a; }
*{ box-sizing:border-box; margin:0; padding:0 }
html,body{ height:100% }
body{
  background:var(--bg); color:var(--ink);
  font-family:"Futura","Futura PT","Avenir Next","Avenir","IBM Plex Sans","Helvetica Neue",Helvetica,Arial,sans-serif;
  text-transform:uppercase; overflow:hidden; cursor:none; /* hide system cursor */
}

/* layout */
.wrap{ height:100vh; width:100vw; display:grid; grid-template-rows:auto 1fr; }
.mast{ text-align:center; padding-top:28px }
.big{ font-size:clamp(28px,6vw,80px); font-weight:800; letter-spacing:.6px }
.sub{ font-size:clamp(16px,3vw,28px); color:#d8d8d8; font-weight:700; margin-top:4px }
.lead{ color:var(--red); font-size:12px; margin-top:8px; letter-spacing:.4px }

.center{ display:grid; place-items:center; }

/* consent control (center) */
.agree-container{ display:flex; align-items:center; gap:14px; position:relative; z-index:2; }
#agree{
  appearance:none; -webkit-appearance:none;
  width:30px; height:30px; border:2px solid var(--ink);
  display:grid; place-items:center; background:transparent; cursor:pointer;
  transition:transform .1s ease;
}
#agree:active{ transform:scale(.95) }
#agree::before{
  content:"✓"; font-weight:800; opacity:0; transform:scale(.6);
  transition:transform .12s ease, opacity .12s ease;
}
#agree:checked::before{ opacity:1; transform:scale(1) }
#agree:disabled{ border-color:#bfbfbf; cursor:default }
#agreeLabel{ font-weight:800; letter-spacing:.6px; cursor:pointer; font-size:clamp(18px,3vw,32px) }

/* red flash */
#flash{ position:fixed; inset:0; background:var(--red); opacity:0; pointer-events:none; z-index:5 }
.flash{ animation:flash .18s ease }
@keyframes flash{ 0%{opacity:.4} 100%{opacity:0} }

/* one-time red word burst */
.ghostLayer{ position:absolute; inset:0; pointer-events:none; }
.ghost{
  position:absolute; color:var(--red); font-weight:800;
  font-size:clamp(10px,2vw,18px); opacity:0; white-space:nowrap;
  transform:translateY(10px) rotate(var(--r,0deg));
  animation:ghost 1100ms ease forwards;
}
@keyframes ghost{ 6%{opacity:1} 85%{opacity:1} 100%{opacity:0; transform:translateY(-10px)} }

/* end */
.end{ position:fixed; inset:0; display:grid; place-items:center; background:#000; z-index:10 }
.hidden{ display:none }
.endtext{ font-size:clamp(16px,3vw,28px); color:#fff; text-align:center; max-width:80vw }

/* transparent circular cursor */
#cursor{
  position:fixed; left:0; top:0; width:40px; height:40px;
  border:2px solid rgba(255,255,255,.7); border-radius:50%;
  pointer-events:none; transform:translate(-50%,-50%); z-index:20;
  transition:border-color .25s ease, width .15s ease, height .15s ease, background .25s ease;
}
.interactive-hover #cursor{ /* turns red when hovering interactive stuff */
  border-color:var(--red); background:rgba(255,42,42,.18); width:54px; height:54px;
}



