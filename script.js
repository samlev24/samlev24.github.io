/* theme toggle now fully works via CSS variables */
const themeToggle = document.getElementById('theme-toggle');
(function initTheme(){
  const saved = localStorage.getItem('theme') || 'dark';
  document.body.setAttribute('data-theme', saved);
  if(themeToggle) themeToggle.textContent = saved === 'dark' ? '☾' : '☀';
})();
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const next = (document.body.getAttribute('data-theme') === 'dark') ? 'light' : 'dark';
    document.body.setAttribute('data-theme', next);
    localStorage.setItem('theme', next);
    themeToggle.textContent = next === 'dark' ? '☾' : '☀';
  });
}

/* smoothed custom cursor (no snappy snap, no 0,0 jumps) */
const dot = document.querySelector('.cursor-dot');
const glow = document.querySelector('.cursor-glow');

let targetX = 0, targetY = 0;
let curX = 0, curY = 0;
let moved = false;

function raf(){
  // simple exponential smoothing
  const kDot = 0.35;   // lower = smoother/less snappy
  const kGlow = 0.20;

  curX += (targetX - curX) * kDot;
  curY += (targetY - curY) * kDot;

  if(dot){
    dot.style.opacity = moved ? 1 : 0;
    dot.style.transform = `translate(${curX - 5}px, ${curY - 5}px)`;
  }
  if(glow){
    // follow even slower for nice trailing
    const gx = curX + (targetX - curX) * (kGlow / kDot);
    const gy = curY + (targetY - curY) * (kGlow / kDot);
    glow.style.opacity = moved ? .30 : 0;
    glow.style.transform = `translate(${gx - 35}px, ${gy - 35}px)`;
  }

  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

window.addEventListener('mousemove', e=>{
  moved = true;
  targetX = e.clientX;
  targetY = e.clientY;
  // initialize to current mouse pos on first move to avoid top-left flash
  if(!curX && !curY){
    curX = targetX; curY = targetY;
  }
});

/* quick switcher (Ctrl/Cmd + K) */
const palette = document.getElementById('palette');
const input = document.getElementById('palette-input');
const results = document.getElementById('palette-results');
const items = [
  {label:'Home', href:'index.html'},
  {label:'Projects', href:'projects.html'},
  {label:'Resume', href:'resume.html'},
  {label:'Blog', href:'blog.html'}
];
function openPalette(){
  if(!palette) return;
  palette.setAttribute('aria-hidden','false');
  renderResults('');
  if(input){ input.value=''; setTimeout(()=>input.focus(), 30); }
}
function closePalette(){ palette && palette.setAttribute('aria-hidden','true') }
function renderResults(q){
  if(!results) return;
  const ql = (q||'').trim().toLowerCase();
  const filtered = items.filter(i => i.label.toLowerCase().includes(ql));
  results.innerHTML = filtered.map(i=>`<li><a href="${i.href}">${i.label}</a></li>`).join('') || `<li><span style="color:#9a9a9a">No matches</span></li>`;
}
window.addEventListener('keydown', e=>{
  const isMac = navigator.platform.toUpperCase().includes('MAC');
  if((isMac && e.metaKey && e.key.toLowerCase()==='k') || (!isMac && e.ctrlKey && e.key.toLowerCase()==='k')){
    e.preventDefault(); openPalette();
  }
  if(e.key === 'Escape') closePalette();
});
if(input){
  input.addEventListener('input', e=> renderResults(e.target.value));
  results.addEventListener('click', ()=> closePalette());
  palette.addEventListener('click', e=>{ if(e.target === palette) closePalette(); });
}

/* grid overlay (g) */
const grid = document.getElementById('grid-overlay');
window.addEventListener('keydown', (e)=>{ if(e.key.toLowerCase()==='g') grid && grid.classList.toggle('show'); });

/* easter egg toast */
(function samEasterEgg(){
  let buf=''; let last=0; const t=700;
  window.addEventListener('keydown', e=>{
    const now=Date.now(); if(now-last>t) buf='';
    last=now; buf += e.key.toLowerCase();
    if(buf.endsWith('sam')){ toast("👋 hey Samar!"); buf='' }
  });
})();
function toast(msg){
  const el=document.createElement('div');
  el.textContent=msg;
  Object.assign(el.style,{
    position:'fixed',bottom:'24px',left:'calc(250px + 24px)',padding:'10px 12px',
    border:'1px solid #2a2a2a',background:'#141414',color:'#fff',borderRadius:'10px',
    boxShadow:'0 10px 30px rgba(0,0,0,.35)',zIndex:9999
  });
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(),300); }, 1600);
}

/* BLOG: expand/collapse posts on click */
document.querySelectorAll('.post').forEach(p=>{
  const title = p.querySelector('h2');
  if(title){
    title.style.cursor='pointer';
    title.addEventListener('click', ()=> p.classList.toggle('open'));
  }
});

/* CYBER CONSOLE (hacking vibes) — toggle with the sidebar padlock or Alt+H) */
let consoleEl = null;
function ensureConsole(){
  if(consoleEl) return consoleEl;
  consoleEl = document.createElement('div');
  consoleEl.id = 'cyber-console';
  consoleEl.innerHTML = `
    <div id="cyber-bar">
      <span class="pill">CYBER CONSOLE</span>
      <button id="cyber-close" class="pill">Close (Esc)</button>
      <span class="pill">try: <code>nmap samlev.dev</code> • <code>tail logs</code> • <code>whoami</code></span>
    </div>
    <div id="cyber-stream"></div>
  `;
  document.body.appendChild(consoleEl);
  document.getElementById('cyber-close').onclick = hideCyber;
  return consoleEl;
}
function showCyber(){
  const c = ensureConsole(); c.classList.add('show'); streamLines([
    '$ whoami', 'samar', '',
    '$ tail logs', '[ok] api.rate_limit=enabled', '[ok] tls=on hsts=31536000', '',
    '$ nmap samlev.dev',
    'Starting Nmap 7.93 ( https://nmap.org )',
    'Nmap scan report for samlev.dev (203.0.113.42)',
    'PORT   STATE SERVICE', '80/tcp  open  http', '443/tcp open  https', '',
    '$ curl -I https://samlev.dev', 'HTTP/2 200', 'server: nginx', 'content-security-policy: object-src \'none\'; frame-ancestors \'none\';', ''
  ]);
}
function hideCyber(){ if(consoleEl){ consoleEl.classList.remove('show'); } }
function streamLines(lines){
  const el = document.getElementById('cyber-stream'); if(!el) return;
  el.innerHTML=''; let i=0;
  (function next(){
    if(i>=lines.length) return;
    const line = document.createElement('div'); el.appendChild(line);
    type(line, lines[i++], 8 + Math.random()*12, next);
    el.scrollTop = el.scrollHeight;
  })();
}
function type(node, text, speed, done){
  let j=0; (function tick(){
    node.textContent = text.slice(0, j++);
    if(j<=text.length) setTimeout(tick, speed); else done && setTimeout(done, 150);
  })();
}
const cyberBtn = document.getElementById('cyber-toggle');
if(cyberBtn){ cyberBtn.addEventListener('click', showCyber) }
window.addEventListener('keydown', (e)=>{
  if(e.altKey && e.key.toLowerCase()==='h'){ showCyber(); }
  if(e.key==='Escape'){ hideCyber(); closePalette(); }
});
