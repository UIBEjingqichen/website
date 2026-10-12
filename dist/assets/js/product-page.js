/* Product pages (v61): image switcher, section spy, count-up and scroll reveal. */
(function () {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = 'IntersectionObserver' in window;

  const main = document.querySelector('[data-pd-main]');
  document.querySelectorAll('[data-pd-thumb]').forEach(btn => btn.addEventListener('click', () => {
    if (!main) return;
    document.querySelectorAll('[data-pd-thumb]').forEach(b => b.setAttribute('aria-pressed', String(b === btn)));
    main.classList.add('is-swap');
    setTimeout(() => { main.alt = btn.dataset.pdAlt || main.alt; main.src = btn.dataset.pdThumb; main.onload = () => main.classList.remove('is-swap'); }, reduced ? 0 : 180);
  }));

  const nav = document.querySelector('.pd-subnav');
  if (nav && io) {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (e.isIntersecting) { links.forEach(a => a.classList.remove('is-active')); const a = map.get(e.target.id); if (a) a.classList.add('is-active'); }
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((a, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
    const sentinel = document.querySelector('.pd-hero');
    if (sentinel) new IntersectionObserver(([e]) => nav.classList.toggle('is-stuck', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(sentinel);
  }

  if (reduced || !io) return;
  document.documentElement.classList.add('js-motion');
  const sel = ['.pd-prose > *', '.pd-sheet', '.pd-table-block', '.pd-drawing-grid > *', '.pd-feat-col', '.pd-apps li', '.pd-card', '.pd-row', '.pd-cta-grid > *', '.pd-sec h2'];
  const ob = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('is-in'); ob.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  sel.forEach(s => document.querySelectorAll('.pd ' + s).forEach((el, i) => { el.setAttribute('data-reveal', ''); el.style.setProperty('--rd', Math.min(i % 6, 5) * 70 + 'ms'); ob.observe(el); }));

  const fmt = n => n.toLocaleString('en-US');
  const oc = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return; oc.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now();
    const tick = t => { const p = Math.min(1, (t - t0) / 1200), v = Math.round(end * (1 - Math.pow(1 - p, 3))); el.textContent = end >= 1000 && end < 10000 && !/,/.test(el.dataset.orig) ? String(v) : fmt(v); if (p < 1) requestAnimationFrame(tick); };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  document.querySelectorAll('.pd [data-count]').forEach(el => { el.dataset.orig = el.textContent; oc.observe(el); });
})();
