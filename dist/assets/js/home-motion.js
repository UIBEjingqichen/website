/* Home motion (v61): scroll reveal, count-up figures, project map. */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = 'IntersectionObserver' in window;

  /* ---- scroll reveal ---- */
  const groups = ['.tr-intro-grid > *', '.tr-grid-head > *', '.tr-sec-head', '.tr-family article', '.tr-split-copy > *',
    '.tr-reports li', '.tr-refs-grid > *', '.tr-map-stage', '.tr-cta-inner > *', '.tr-facts > div', '.tr-build-copy > *'];
  if (!reduced && io) {
    document.documentElement.classList.add('js-motion');
    const items = [];
    groups.forEach(sel => document.querySelectorAll(sel).forEach((el, i) => {
      el.setAttribute('data-reveal', ''); el.style.setProperty('--rd', Math.min(i, 5) * 80 + 'ms'); items.push(el);
    }));
    const ob = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); ob.unobserve(e.target); }
    }), { threshold: .15, rootMargin: '0px 0px -8% 0px' });
    items.forEach(el => ob.observe(el));
  }

  /* ---- count-up ---- */
  const fmt = n => n.toLocaleString('en-US');
  const counters = [...document.querySelectorAll('[data-count]')].filter(el => el.tagName !== 'BUTTON');
  // Keep the published figure available before scrolling and to assistive technology.
  const visuals = new Map();
  if (!reduced && io) counters.forEach(el => {
    const actual = document.createElement('span');
    actual.className = 'counter-value'; actual.textContent = el.textContent;
    const visual = document.createElement('span');
    visual.setAttribute('aria-hidden', 'true'); visual.textContent = el.textContent;
    el.replaceChildren(actual, visual); visuals.set(el, visual);
  });
  const run = el => {
    const end = +el.dataset.count, suf = el.dataset.suffix || '', t0 = performance.now(), dur = 1400;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      visuals.get(el).textContent = fmt(Math.max(1, Math.round(end * e))) + suf;
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };
  if (!reduced && io) {
    const oc = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); oc.unobserve(e.target); } }), { threshold: .6 });
    counters.forEach(el => oc.observe(el));
  }

  /* ---- project map ---- */
  const stage = document.querySelector('[data-map]');
  if (!stage) return;
  const card = stage.querySelector('[data-map-card]');
  const pins = [...stage.querySelectorAll('[data-pin]')];
  const f = s => card.querySelector(s);
  let current = null;
  const close = () => { card.classList.remove('is-open'); pins.forEach(p => p.classList.remove('is-active')); if (current) setTimeout(() => { if (!card.classList.contains('is-open')) card.hidden = true; }, 220); current = null; };
  pins.forEach(pin => pin.addEventListener('click', e => {
    e.stopPropagation();
    if (current === pin) return close();
    current = pin; pins.forEach(p => p.classList.toggle('is-active', p === pin));
    const d = pin.dataset;
    f('[data-m-country]').textContent = d.country; f('[data-m-title]').textContent = d.title;
    f('[data-m-app]').textContent = d.app; f('[data-m-product]').textContent = d.scope || d.product;
    f('[data-m-scale]').textContent = d.scale || '—'; f('[data-m-link]').href = d.href;
    card.hidden = false;
    const sr = stage.getBoundingClientRect(), pr = pin.getBoundingClientRect();
    const w = card.offsetWidth, h = card.offsetHeight;
    let left = pr.left - sr.left + 22, top = pr.top - sr.top - 20;
    if (left + w > sr.width) left = pr.left - sr.left - w - 22;
    top = Math.max(0, Math.min(top, sr.height - h));
    card.style.left = left + 'px'; card.style.top = top + 'px';
    requestAnimationFrame(() => card.classList.add('is-open'));
  }));
  card.addEventListener('click', e => e.stopPropagation());
  stage.querySelector('[data-map-close]').addEventListener('click', close);
  document.addEventListener('click', close);
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();



/* Assembly guide entry (v63): the homepage drawing builds itself step by step while it is
   on screen, loops, and follows the step the visitor points at. Links open the full
   scroll-driven guide at that step (transformer-assembly.html#step-N). */
(function () {
  const root = document.querySelector('[data-build]');
  if (!root) return;
  const fig = root.querySelector('[data-build-fig]');
  const parts = [...fig.querySelectorAll('.tb-p')];
  const links = [...root.querySelectorAll('[data-build-go]')];
  const items = links.map(a => a.parentElement);
  const names = links.map(a => a.querySelector('span').textContent);
  const stepEl = fig.querySelector('[data-build-step]'), nameEl = fig.querySelector('[data-build-name]');
  const bar = fig.querySelector('.tr-build-bar i');
  const N = links.length;
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const show = n => {
    fig.dataset.stage = n;
    parts.forEach(p => { const s = +p.dataset.s; p.classList.toggle('is-on', s <= n); p.classList.toggle('is-now', s === n); });
    items.forEach((li, i) => { li.classList.toggle('is-current', i + 1 === n); li.classList.toggle('is-done', i + 1 < n); });
    if (stepEl) stepEl.textContent = String(Math.max(n, 1)).padStart(2, '0');
    if (nameEl) nameEl.textContent = n ? names[n - 1] : 'Ready to assemble';
    if (bar) bar.style.setProperty('--p', (n / N).toFixed(3));
  };
  if (reduced || !('IntersectionObserver' in window)) { show(N); return; }

  fig.classList.add('tb-live');
  let stage = 0, timer = 0, visible = false, held = false;
  const wait = n => n === 0 ? 700 : n === N ? 3600 : n === 2 || n === 5 ? 2100 : 1600;
  const loop = () => {
    clearTimeout(timer);
    if (!visible || held) return;
    timer = setTimeout(() => { stage = stage >= N ? 0 : stage + 1; show(stage); loop(); }, wait(stage));
  };
  show(0);
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) loop(); else clearTimeout(timer); }, { threshold: .35 }).observe(fig);

  /* pointing at a step previews it; the loop resumes shortly after */
  const hold = n => { held = true; clearTimeout(timer); stage = n; show(n); };
  const release = () => { held = false; loop(); };
  links.forEach((a, i) => {
    a.addEventListener('mouseenter', () => hold(i + 1));
    a.addEventListener('focus', () => hold(i + 1));
    a.addEventListener('blur', release);
  });
  root.querySelector('.tr-build-steps').addEventListener('mouseleave', release);
})();
