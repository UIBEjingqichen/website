/* Home page single-line diagram (v60).
   Auto-tours the equipment nodes, tracing the energy path to each one.
   Stops touring as soon as the visitor selects a node. */
(function () {
  const svg = document.querySelector('[data-sld]');
  const stage = document.querySelector('[data-sld-stage]');
  const pop = document.querySelector('[data-sld-pop]');
  if (!svg || !stage || !pop) return;

  const base = new URL('../../products/', document.currentScript.src).href;
  const DATA = {
    ybh:     { role: 'Renewable collection', name: 'YBH Chinese-Type Prefabricated Substation', desc: 'Packaged step-up substation for wind and photovoltaic collection systems.', v: '7.2–72.5 kV HV · 0.315–1.14 kV LV', r: '200–15,000 kVA', href: 'ybh-prefabricated-substation/index.html' },
    pvess:   { role: 'Renewable collection', name: 'PV / Converter / ESS Integrated Substation', desc: 'Converter or PCS, transformer and medium-voltage switchgear integrated in one enclosure.', v: '7.2–40.5 kV HV · 0.315–1.14 kV LV', r: '2,000–15,000 kVA', href: 'pv-ess-integrated-substation/index.html' },
    booster: { role: 'Step-up to transmission', name: '220 kV Double-Split Booster Transformer', desc: 'Double-split oil-immersed transformer for offshore and onshore renewable booster stations.', v: '220 kV class', r: 'Project engineered', href: '220kv-double-split-booster-transformer/index.html' },
    t220:    { role: 'Transmission substation', name: '220 kV Three-Winding Power Transformer', desc: 'SSZ-31500~240000/220 on-load tap-changing main transformer.', v: '220 / 230 / 242 kV HV', r: '31.5–240 MVA (up to 420 MVA)', href: '220kv-power-transformer/index.html' },
    t110:    { role: 'Sub-transmission', name: '110 kV Three-Winding Power Transformer', desc: 'SSZ-6300~63000/110 on-load tap-changing main transformer.', v: '110 / 115 / 121 kV HV', r: '6.3–63 MVA (up to 200 MVA)', href: '110kv-power-transformer/index.html' },
    t35:     { role: 'Primary distribution', name: '35 kV Oil-Immersed Power Transformer', desc: 'SZ-8000~31500/35 on-load tap-changing power transformer.', v: '35–38.5 kV HV', r: '8–31.5 MVA', href: '35kv-power-transformer/index.html' },
    oil:     { role: 'Distribution to load', name: 'Oil-Immersed Distribution Transformer', desc: 'S20 / S22 energy-saving distribution transformers for utility and industrial networks.', v: '35 kV and below', r: '30 kVA–12.5 MVA', href: 'oil-immersed-distribution-transformer/index.html' },
    dry:     { role: 'Distribution to load', name: 'Cast-Resin Dry-Type Transformer', desc: 'SCB14 / SCB18 dry-type transformers for buildings, data centres and rail transit.', v: '35 kV and below', r: 'Series dependent', href: 'dry-type-distribution-transformer/index.html' },
    zgs:     { role: 'Compact distribution', name: 'ZGS Combined Transformer', desc: 'Oil-immersed combined transformer for ring-main and terminal distribution.', v: '7.2–40.5 kV HV · 0.315–1.14 kV LV', r: '200–4,000 kVA', href: 'zgs-prefabricated-substation/index.html' },
    mobile:  { role: 'Temporary and emergency supply', name: '35–110 kV Mobile Intelligent Substation', desc: 'Trailer-mounted substation for rapid restoration and temporary capacity.', v: '35–110 kV', r: 'Selected to project load', href: '35-110kv-mobile-intelligent-substation/index.html' }
  };

  const nodes = [...svg.querySelectorAll('.sld-node')];
  const flow = id => svg.querySelector('.sld-flow use[href="#' + id + '"]');
  const q = sel => pop.querySelector(sel);
  const pauseBtn = document.querySelector('[data-sld-pause]');
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0, timer = null, touring = !reduced, openNode = null;

  function trace(node) {
    nodes.forEach(n => n.classList.toggle('is-active', n === node));
    svg.querySelectorAll('.is-live').forEach(el => el.classList.remove('is-live'));
    if (node) node.dataset.path.split(' ').forEach(id => { const u = flow(id); if (u) u.classList.add('is-live'); });
  }

  function place(node) {
    const sr = stage.getBoundingClientRect(), nr = node.getBoundingClientRect();
    const w = pop.offsetWidth, h = pop.offsetHeight;
    const cx = nr.left - sr.left + nr.width / 2;
    let left = Math.min(Math.max(cx - 40, 8), sr.width - w - 8);
    let top = nr.bottom - sr.top + 14, below = false;
    const vr = svg.getBoundingClientRect();
    if (nr.top + nr.height / 2 > vr.top + vr.height * .55) { top = nr.top - sr.top - h - 14; below = true; }
    pop.style.left = left + 'px'; pop.style.top = top + 'px';
    pop.style.setProperty('--ax', Math.max(14, Math.min(w - 26, cx - left - 6)) + 'px');
    pop.classList.toggle('is-below', below);
  }

  function open(node) {
    const d = DATA[node.dataset.node]; if (!d) return;
    openNode = node; trace(node); setTouring(false);
    q('[data-sld-role]').textContent = d.role; q('[data-sld-name]').textContent = d.name;
    q('[data-sld-desc]').textContent = d.desc; q('[data-sld-v]').textContent = d.v;
    q('[data-sld-r]').textContent = d.r; q('[data-sld-link]').href = base + d.href;
    pop.hidden = false; place(node);
    requestAnimationFrame(() => pop.classList.add('is-open'));
    q('[data-sld-link]').focus({ preventScroll: true });
  }

  function close(restore) {
    if (!openNode) return;
    pop.classList.remove('is-open');
    const n = openNode; openNode = null;
    setTimeout(() => { if (!openNode) pop.hidden = true; }, 220);
    if (restore) n.focus({ preventScroll: true });
  }

  function schedule() {
    clearInterval(timer);
    if (!touring) return;
    timer = setInterval(() => { index = (index + 1) % nodes.length; trace(nodes[index]); }, 3200);
  }
  function setTouring(on) {
    touring = on;
    if (pauseBtn) { pauseBtn.textContent = on ? 'Pause animation' : 'Resume animation'; pauseBtn.setAttribute('aria-pressed', String(!on)); }
    svg.classList.toggle('is-paused', !on && !openNode);
    schedule();
  }

  nodes.forEach((node, i) => {
    const choose = e => { e.stopPropagation(); index = i; openNode === node ? close() : open(node); };
    node.addEventListener('click', choose);
    node.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); choose(e); } });
  });
  pop.addEventListener('click', e => e.stopPropagation());
  pop.querySelectorAll('[data-pop-close]').forEach(b => b.addEventListener('click', () => close(true)));
  document.addEventListener('click', () => close());
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(true); });
  window.addEventListener('resize', () => { if (openNode) place(openNode); });
  if (pauseBtn) pauseBtn.addEventListener('click', () => { close(); setTouring(!touring); });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => { if (!e.isIntersecting) clearInterval(timer); else schedule(); }, { threshold: .2 }).observe(svg);
  }
  trace(nodes[0]);
  if (reduced) setTouring(false); else schedule();
})();

