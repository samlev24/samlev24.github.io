// theme
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;
(function initTheme(){
  const saved = localStorage.getItem('theme') || 'dark';
  if(saved === 'dark') document.body.dataset.theme = 'dark';
})();
if(themeToggle){
  themeToggle.addEventListener('click', ()=>{
    const now = (document.body.dataset.theme === 'dark') ? 'light' : 'dark';
    document.body.dataset.theme = now;
    localStorage.setItem('theme', now);
  });
}

// cursor
const dot = document.querySelector('.cursor-dot');
const glow = document.querySelector('.cursor-glow');
window.addEventListener('mousemove', (e)=>{
  const { clientX:x, clientY:y } = e;
  if(dot){
    dot.style.transform = `translate(${x-5}px, ${y-5}px)`;
  }
  if(glow){
    glow.style.transform = `translate(${x-35}px, ${y-35}px)`;
  }
});

// quick switcher (Ctrl/Cmd + K)
const palette = document.getElementById('palette');
const input = document.getElementById('palette-input');
const results = document.getElementById('palette-results');
const items = [
  {label:'Home', href:'index.html'},
  {label:'Projects', href:'projects.html'},
  {label:'Resume', href:'resume.html'},
  {label:'Blog', href:'blog.html'},
  {label:'About', href:'index.html#about'}
];

function openPalette(){
  if(!palette) return;
  palette.setAttribute('aria-hidden','false');
  renderResults('');
  input.value = '';
  setTimeout(()=>input.focus(), 30);
}
function closePalette(){
  if(!palette) return;
  palette.setAttribute('aria-hidden','true');
}
function renderResults(q){
  if(!results) return;
  const ql = q.trim().toLowerCase();
  const filtered = items.filter(i => i.label.toLowerCase().includes(ql));
  results.innerHTML = filtered.map(i => `<li><a href="${i.href}">${i.label}</a></li>`).join('') || `<li><span style="color:#9a9a9a">No matches</span></li>`;
}
window.addEventListener('keydown', (e)=>{
  const isMac = navigator.platform.toUpperCase().includes('MAC');
  if((isMac && e.metaKey && e.key.toLowerCase()==='k') || (!isMac && e.ctrlKey && e.key.toLowerCase()==='k')){
    e.preventDefault(); openPalette();
  }
  if(e.key === 'Escape') closePalette();
});
if(input){
  input.addEventListener('input', e=> renderResults(e.target.value));
  results.addEventListener('click', ()=> closePalette());
  palette.addEventListener('click', (e)=>{ if(e.target === palette) closePalette(); });
}

// hidden gem: layout grid toggle with "g"
const grid = document.getElementById('grid-overlay');
window.addEventListener('keydown', (e)=>{
  if(e.key.toLowerCase() === 'g'){
    grid && grid.classList.toggle('show');
  }
});

// hidden gem: type 'sam' quickly
(function samEasterEgg(){
  let buffer = '';
  let last = 0;
  const timeoutMs = 700;
  window.addEventListener('keydown', (e)=>{
    const now = Date.now();
    if(now - last > timeoutMs) buffer = '';
    last = now;
    buffer += e.key.toLowerCase();
    if(buffer.endsWith('sam')){
      toast("👋 hey Samar!");
      buffer = '';
    }
  });
})();
function toast(msg){
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.position = 'fixed';
  el.style.bottom = '24px';
  el.style.left = 'calc(250px + 24px)';
  el.style.padding = '10px 12px';
  el.style.border = '1px solid #2a2a2a';
  el.style.background = '#141414';
  el.style.color = '#fff';
  el.style.borderRadius = '10px';
  el.style.boxShadow = '0 10px 30px rgba(0,0,0,.35)';
  el.style.zIndex = '9999';
  document.body.appendChild(el);
  setTimeout(()=>{ el.style.opacity='0'; el.style.transition='opacity .3s'; setTimeout(()=>el.remove(),300); }, 1600);
}
