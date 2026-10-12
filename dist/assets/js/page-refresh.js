/* Page refresh (v62): scroll reveal, count-up figures, sub-navigation and
   table-of-contents spy for pages built on the .pd / .pg system. */
(function () {
  const root = document.querySelector('main.pg');
  if (!root) return;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const io = 'IntersectionObserver' in window;

  /* ---- sub-navigation spy + sticky quote button ---- */
  const nav = root.querySelector('.pd-subnav');
  if (nav && io) {
    const links = [...nav.querySelectorAll('a[href^="#"]')];
    const map = new Map(links.map(a => [a.getAttribute('href').slice(1), a]));
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.remove('is-active'));
      const a = map.get(e.target.id); if (a) a.classList.add('is-active');
    }), { rootMargin: '-45% 0px -50% 0px' });
    map.forEach((a, id) => { const s = document.getElementById(id); if (s) spy.observe(s); });
    const hero = root.querySelector('.pd-hero');
    if (hero) new IntersectionObserver(([e]) => nav.classList.toggle('is-stuck', !e.isIntersecting), { rootMargin: '-80px 0px 0px 0px' }).observe(hero);
  }

  /* ---- article table-of-contents spy ---- */
  const toc = root.querySelector('.pg-toc');
  if (toc && io) {
    const links = [...toc.querySelectorAll('a[href^="#"]')];
    const spy = new IntersectionObserver(es => es.forEach(e => {
      if (!e.isIntersecting) return;
      links.forEach(a => a.classList.toggle('is-active', a.getAttribute('href') === '#' + e.target.id));
    }), { rootMargin: '-30% 0px -60% 0px' });
    links.forEach(a => { const s = document.getElementById(a.getAttribute('href').slice(1)); if (s) spy.observe(s); });
  }

  if (reduced || !io) return;

  /* ---- scroll reveal (skips cards that filters/search show and hide) ---- */
  document.documentElement.classList.add('js-motion');
  const groups = ['.pg-head > *', '.pd-prose > *', '.pd-sheet', '.pg-metrics > div', '.pg-steps > li', '.pg-gallery > *',
    '.pg-docs > li', '.pg-cards > a:not([data-search-card])', '.pd-feat-col', '.pg-faq', '.pg-split > *', '.pg-timeline',
    '.pd-cta-grid > *', '.pg-answer', '.pg-prose > section', '.pg-contact > *', '.pd-rows > a', '.pg-kv'];
  const ob = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('is-in'); ob.unobserve(e.target); }
  }), { threshold: .12, rootMargin: '0px 0px -6% 0px' });
  groups.forEach(sel => root.querySelectorAll(sel).forEach((el, i) => {
    if (el.closest('.pd-hero')) return;
    el.setAttribute('data-reveal', '');
    el.style.setProperty('--rd', Math.min(i % 6, 5) * 70 + 'ms');
    ob.observe(el);
  }));

  /* ---- count-up: final value is in the HTML, so no-JS and reduced motion keep it ---- */
  const fmt = (v, el) => {
    const d = +(el.dataset.decimals || 0);
    const n = el.hasAttribute('data-raw') ? v.toFixed(d) : v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d });
    return (el.dataset.prefix || '') + n + (el.dataset.suffix || '');
  };
  const oc = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    oc.unobserve(e.target);
    const el = e.target, end = +el.dataset.count, t0 = performance.now(), dur = 1300;
    const tick = t => {
      const p = Math.min(1, (t - t0) / dur), k = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(p < 1 ? Math.round(end * k * 10 ** +(el.dataset.decimals || 0)) / 10 ** +(el.dataset.decimals || 0) : end, el);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }), { threshold: .6 });
  root.querySelectorAll('[data-count]').forEach(el => { if (!el.closest('.pd-hero')) oc.observe(el); });
})();
