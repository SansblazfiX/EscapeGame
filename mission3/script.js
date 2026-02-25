// ══════════════════════════════════════════
//  MISSION ORIENTATION — script.js global
// ══════════════════════════════════════════

const MISSIONS = [
  { id:'sciences', label:'Sciences', icon:'⚗️', file:'enigme-sciences.html' },
  { id:'cdi',      label:'CDI',      icon:'📚', file:'enigme-cdi.html' },
  { id:'gymnase',  label:'Gymnase',  icon:'🏃', file:'enigme-gymnase.html' },
  { id:'pro',      label:'Pôle Pro', icon:'🔧', file:'enigme-pro.html' },
];

/* ── Progression ── */
function getProg()            { try{return JSON.parse(localStorage.getItem('missionProgress')||'{}')}catch{return{}} }
function setProg(id,digit)    { const p=getProg(); p[id]=digit; localStorage.setItem('missionProgress',JSON.stringify(p)); }
function isSolved(id)         { return getProg()[id]!==undefined; }
function countSolved()        { return Object.keys(getProg()).length; }
function resetAll()           { localStorage.removeItem('missionProgress'); localStorage.removeItem('missionStart'); }

/* ── Timer ── */
let _timerInt=null;
function startTimer() {
  if(!localStorage.getItem('missionStart')) localStorage.setItem('missionStart',Date.now());
  _tick(); _timerInt=setInterval(_tick,1000);
}
function _tick() {
  const el=document.getElementById('nav-timer');
  if(!el) return;
  const s=Math.floor((Date.now()-parseInt(localStorage.getItem('missionStart')||Date.now()))/1000);
  el.textContent=`${String(Math.floor(s/60)).padStart(2,'0')}:${String(s%60).padStart(2,'0')}`;
}

/* ── Décoration fond ── */
function buildBg() {
  const tags=['bg-layer','grid-overlay','scanline'];
  tags.forEach(cls=>{ const d=document.createElement('div'); d.className=cls; document.body.prepend(d); });
  ['tl','tr','bl','br'].forEach(pos=>{ const d=document.createElement('div'); d.className=`corner corner-${pos}`; document.body.appendChild(d); });
}

/* ── Navbar + barre progression ── */
function buildNav() {
  const p=getProg();
  const dots=MISSIONS.map(m=>`<div class="nav-dot${p[m.id]!==undefined?' done':''}" title="${m.label}"></div>`).join('');
  const nav=document.createElement('nav'); nav.className='navbar';
  nav.innerHTML=`<a href="index.html" class="nav-brand">🔐 Mission</a><div class="nav-progress">${dots}</div><div class="nav-timer" id="nav-timer">00:00</div>`;
  document.body.prepend(nav);
  const bar=document.createElement('div'); bar.className='pbar-wrap';
  bar.innerHTML=`<div class="pbar-fill" style="width:${countSolved()/4*100}%"></div>`;
  document.body.insertBefore(bar,nav.nextSibling);
  startTimer();
}

/* ── Init page commune ── */
function initPage() { buildBg(); buildNav(); }

/* ── Overlay succès ── */
function showSuccess({icon,title,digit,sub,nextUrl,nextLabel}) {
  const ov=document.createElement('div'); ov.className='success-overlay';
  ov.innerHTML=`
    <div class="sov-icon">${icon}</div>
    <div class="sov-title">${title}</div>
    ${digit?`<div style="text-align:center"><div class="sov-label">// chiffre secret</div><div class="sov-digit">${digit}</div></div>`:''}
    <div class="sov-sub">${sub}</div>
    <a href="${nextUrl}" class="sov-btn">${nextLabel}</a>`;
  document.body.appendChild(ov);
  requestAnimationFrame(()=>ov.classList.add('visible'));
}
