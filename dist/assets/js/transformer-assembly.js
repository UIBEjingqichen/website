/* Transformer assembly (v62)
   The scroll position is the playhead: progress p (0..1) through the pinned
   section is mapped onto a timeline of tweens. Every frame is a pure function
   of p, so scrolling up plays the assembly backwards (the same idea as GSAP
   ScrollTrigger with scrub: true, without a dependency). */
(function () {
  const scroll = document.querySelector('[data-as-scroll]');
  if (!scroll) return;
  const svg = scroll.querySelector('.as-svg');
  const stage = scroll.querySelector('.as-stage');
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const $ = id => svg.getElementById(id);

  /* ---------------- easing ---------------- */
  const E = {
    lin: t => t,
    out: t => 1 - Math.pow(1 - t, 3),
    inOut: t => t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
    back: t => { const c = 1.4; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); }
  };

  /* ---------------- timeline ----------------
     to(id, start, end, {prop:[from,to]}, ease)
     props: x, y (user units), sx, sy (scale), o (opacity), draw (0..1 stroke), fo (fill-opacity) */
  const tracks = new Map();
  const to = (id, s, e, props, ease = 'inOut') => {
    const el = typeof id === 'string' ? $(id) : id;
    if (!el) return;
    if (!tracks.has(el)) tracks.set(el, {});
    const t = tracks.get(el);
    for (const k in props) (t[k] = t[k] || []).push({ s, e, a: props[k][0], b: props[k][1], f: E[ease] });
  };
  const fn = [];                 // custom per-frame functions
  const call = f => fn.push(f);
  const fade = (id, a, b) => { to(id, a, a + .02, { o: [0, 1] }, 'lin'); to(id, b - .02, b, { o: [1, 0] }, 'lin'); };
  const clamp = v => v < 0 ? 0 : v > 1 ? 1 : v;

  /* 1  Core: top yoke unlaced (0.03-0.09), re-laced after the windings (0.29-0.34) */
  to('yoke', .03, .09, { y: [0, -150] }, 'inOut');
  to('yoke', .29, .34, { y: [-150, 0] }, 'out');
  fade('lab-limb', -.02, .10); fade('lab-yoke', .02, .12);

  /* 2  Windings: LV then HV, one limb after another */
  ['a', 'b', 'c'].forEach((ph, i) => {
    to('lv-' + ph, .09 + i * .025, .15 + i * .025, { y: [-560, 0], o: [0, 1] }, 'out');
    to('hv-' + ph, .17 + i * .025, .23 + i * .025, { y: [-560, 0], o: [0, 1] }, 'out');
  });
  fade('lab-lv', .12, .30); fade('lab-hv', .20, .35);
  to('clamps', .32, .36, { o: [0, 1], y: [-12, 0] }, 'out');
  fade('lab-clamp', .33, .46);

  /* 3  Leads and tap changer */
  to('oltc', .37, .41, { sy: [0, 1], o: [0, 1] }, 'out');
  svg.querySelectorAll('.lead--hv').forEach((p, i) => to(p, .36 + i * .012, .41 + i * .012, { draw: [0, 1] }, 'inOut'));
  svg.querySelectorAll('.lead--lv').forEach((p, i) => to(p, .39 + i * .01, .44 + i * .01, { draw: [0, 1] }, 'inOut'));
  svg.querySelectorAll('.lead--tap').forEach((p, i) => to(p, .42 + i * .01, .46 + i * .01, { draw: [0, 1] }, 'inOut'));
  fade('lab-tap', .40, .56);

  /* 4  Vacuum drying: warm glow, moisture leaving the insulation */
  to('heat', .48, .51, { o: [0, 1] }, 'lin');
  to('heat', .555, .58, { o: [1, 0] }, 'lin');
  const drops = [...svg.querySelectorAll('#vapor circle')];
  call(p => {
    const t = clamp((p - .48) / .1);
    drops.forEach((d, i) => {
      const k = (t * 1.6 + i / drops.length) % 1, on = t > 0 && t < 1;
      d.setAttribute('transform', `translate(0 ${-k * 260})`);
      d.style.opacity = on ? (Math.sin(k * Math.PI) * .9).toFixed(3) : 0;
    });
  });
  fade('lab-dry', .49, .575);

  /* 5  Tank, cover, bushings */
  to('tank', .58, .64, { y: [520, 0], o: [0, 1] }, 'out');
  to('tank-body', .58, .64, { fo: [.14, .14] }, 'lin');
  to('cover', .63, .67, { y: [-260, 0], o: [0, 1] }, 'out');
  svg.querySelectorAll('.bush--hv').forEach((b, i) => to(b, .66 + i * .012, .70 + i * .012, { sy: [0, 1], o: [0, 1] }, 'back'));
  svg.querySelectorAll('.bush--lv').forEach((b, i) => to(b, .685 + i * .008, .715 + i * .008, { sy: [0, 1], o: [0, 1] }, 'back'));
  fade('lab-hvb', .67, .79); fade('lab-lvb', .69, .79);

  /* 6  Oil filling under vacuum */
  to('oil', .72, .78, { sy: [0, 1], o: [.2, 1] }, 'inOut');
  fade('lab-oil', .73, .80);

  /* 7  Cooling and conservator */
  to('rad-l', .79, .85, { x: [-260, 0], o: [0, 1] }, 'out');
  to('rad-r', .80, .86, { x: [260, 0], o: [0, 1] }, 'out');
  to('cons', .85, .90, { y: [-230, 0], o: [0, 1] }, 'out');
  fade('lab-rad', .80, .91); fade('lab-cons', .86, .92); fade('lab-buch', .87, .92);

  /* 8  Accessories, tank becomes solid, overall dimensions */
  to('acc', .90, .93, { o: [0, 1] }, 'lin');
  to('tank-body', .90, .96, { fo: [.14, .97] }, 'inOut');
  to('ribs', .90, .96, { o: [.25, 1] }, 'lin');
  svg.querySelectorAll('#dims path').forEach((p, i) => to(p, .95 + i * .01, .985, { draw: [0, 1] }, 'out'));
  to('dims-t', .97, .99, { o: [0, 1] }, 'lin');

  /* ---------------- renderer ---------------- */
  const lens = new Map();
  tracks.forEach((t, el) => {
    if (t.draw) { const L = el.getTotalLength(); lens.set(el, L); el.style.strokeDasharray = L; }
    if (el.dataset.origin) el.style.transformOrigin = el.dataset.origin;
    for (const k in t) t[k].sort((m, n) => m.s - n.s);
  });
  const value = (list, p) => {
    let v = list[0].a;
    for (const w of list) {
      if (p < w.s) break;
      v = w.a + (w.b - w.a) * w.f(clamp((p - w.s) / (w.e - w.s || 1e-6)));
    }
    return v;
  };
  const render = p => {
    tracks.forEach((t, el) => {
      const g = k => t[k] ? value(t[k], p) : null;
      const x = g('x') || 0, y = g('y') || 0, sx = g('sx'), sy = g('sy');
      if (t.x || t.y || t.sx || t.sy) el.style.transform = `translate(${x}px,${y}px) scale(${sx ?? 1},${sy ?? 1})`;
      if (t.o) el.style.opacity = g('o').toFixed(3);
      if (t.fo) el.style.fillOpacity = g('fo').toFixed(3);
      if (t.draw) el.style.strokeDashoffset = (lens.get(el) * (1 - g('draw'))).toFixed(1);
    });
    fn.forEach(f => f(p));
    ui(p);
  };

  /* ---------------- chapters, rail, readout ---------------- */
  const chaps = [...scroll.querySelectorAll('.as-chap')];
  const rail = [...scroll.querySelectorAll('.as-rail button')];
  const ranges = chaps.map(c => [+c.dataset.from, +c.dataset.to]);
  const pct = scroll.querySelector('[data-as-pct]'), step = scroll.querySelector('[data-as-step]');
  const bar = scroll.querySelector('.as-bar i'), hint = scroll.querySelector('.as-hint');
  let active = -1;
  const ui = p => {
    const i = Math.max(0, ranges.findIndex(([a, b]) => p >= a && p < b) === -1 ? ranges.length - 1 : ranges.findIndex(([a, b]) => p >= a && p < b));
    if (i !== active) {
      chaps.forEach((c, k) => c.classList.toggle('is-active', k === i));
      rail.forEach((b, k) => { b.toggleAttribute('aria-current', k === i); if (k === i) b.setAttribute('aria-current', 'step'); b.classList.toggle('is-done', k < i); });
      if (step) step.textContent = String(i + 1).padStart(2, '0') + ' / ' + String(chaps.length).padStart(2, '0');
      active = i;
    }
    rail.forEach((b, k) => b.style.setProperty('--f', clamp((p - ranges[k][0]) / (ranges[k][1] - ranges[k][0])).toFixed(3)));
    if (pct) pct.textContent = Math.round(p * 100) + '%';
    if (bar) bar.style.setProperty('--p', p.toFixed(4));
    if (hint) hint.classList.toggle('is-gone', p > .015);
  };

  /* ---------------- scroll -> progress, with light smoothing ---------------- */
  document.documentElement.classList.add('as-ready');
  const head = () => parseFloat(getComputedStyle(scroll).getPropertyValue('--head')) || 72;
  const target = () => {
    const r = scroll.getBoundingClientRect();
    const run = r.height - stage.offsetHeight;
    return run > 0 ? clamp((head() - r.top) / run) : 1;
  };
  let cur = target(), raf = 0;
  const tick = () => {
    const t = target();
    cur = reduced ? t : cur + (t - cur) * .14;
    if (Math.abs(t - cur) < .0004) cur = t;
    render(cur);
    raf = cur !== t ? requestAnimationFrame(tick) : 0;
  };
  const kick = () => { if (!raf) raf = requestAnimationFrame(tick); };
  addEventListener('scroll', kick, { passive: true });
  addEventListener('resize', kick);
  render(cur);

  /* rail buttons jump to the start of a chapter */
  const go = (k, smooth) => {
    const r = scroll.getBoundingClientRect(), run = r.height - stage.offsetHeight;
    const top = scrollY + r.top - head() + run * (ranges[k][0] + .012);
    scrollTo({ top, behavior: smooth && !reduced ? 'smooth' : 'instant' });
  };
  rail.forEach((b, k) => b.addEventListener('click', () => {
    go(k, true);
    if (history.replaceState) history.replaceState(null, '', '#step-' + (k + 1));
  }));

  /* v63: deep links (#step-1 ... #step-8), used by the homepage guide entry */
  const fromHash = smooth => {
    const m = /^#step-(\d+)$/.exec(location.hash);
    if (!m) return;
    const k = Math.min(ranges.length, Math.max(1, +m[1])) - 1;
    go(k, smooth);
    cur = target(); render(cur);
  };
  if (location.hash) {
    if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
    requestAnimationFrame(() => fromHash(false));
    addEventListener('load', () => fromHash(false), { once: true });
  }
  addEventListener('hashchange', () => fromHash(true));
})();


