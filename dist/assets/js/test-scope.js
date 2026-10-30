/* Test-lab instruments: lightning-impulse oscilloscope and 8-channel partial-discharge display.
   Markup: <figure data-impulse-scope> and <div data-pd-panel> (see testing.html / index.html).
   The impulse trace is the standard IEC 60060-1 double-exponential 1.2/50 µs shape; T1 and T2 shown
   on screen are measured from the plotted curve, not typed in. PD traces are an illustrative display. */
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const C = {
    bg: '#0b1d2d', grid: 'rgba(124,196,255,.10)', axis: 'rgba(124,196,255,.28)', text: '#8fa9c0',
    trace: '#7cc4ff', glow: 'rgba(124,196,255,.35)', mark: '#f2c35b', ref: 'rgba(255,255,255,.22)'
  };

  /* ---------- canvas helper: crisp on high-DPI screens, redraw on resize ---------- */
  function surface(canvas, draw) {
    const ctx = canvas.getContext('2d');
    let w = 0, h = 0;
    const fit = () => {
      const r = canvas.getBoundingClientRect(); const dpr = Math.min(devicePixelRatio || 1, 2);
      w = r.width; h = r.height;
      canvas.width = Math.round(w * dpr); canvas.height = Math.round(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw(ctx, w, h);
    };
    new ResizeObserver(fit).observe(canvas);
    return { redraw: () => draw(ctx, w, h) };
  }
  /* run a frame loop only while the element is on screen */
  function whenVisible(el, start, stop) {
    if (!('IntersectionObserver' in window)) { start(); return; }
    new IntersectionObserver(([e]) => (e.isIntersecting ? start() : stop()), { threshold: 0.15 }).observe(el);
  }

  /* =================== Lightning impulse =================== */
  // Standard full wave: u(t) = k·(e^(−t/τ1) − e^(−t/τ2)), τ1 = 68.22 µs, τ2 = 0.4051 µs (IEC 60060-1 Annex)
  const TAU1 = 68.22, TAU2 = 0.4051;
  const raw = t => Math.exp(-t / TAU1) - Math.exp(-t / TAU2);
  const TPEAK = Math.log(TAU1 / TAU2) / (1 / TAU2 - 1 / TAU1);
  const K = 1 / raw(TPEAK);
  const full = t => (t <= 0 ? 0 : K * raw(t));
  const TC = 4.0; // chopped wave: chopping time within the 2–6 µs window of IEC 60076-3
  const chopped = t => {
    if (t <= TC) return full(t);
    const d = t - TC, u0 = full(TC);
    const collapse = u0 * Math.exp(-d / 0.08);
    const ring = -0.28 * u0 * Math.exp(-d / 1.2) * Math.sin(2 * Math.PI * d / 0.9); // undershoot ≤ 30 %
    return collapse + ring;
  };

  // measure T1 (front, 30–90 % ×1.67) and T2 (virtual origin to half value on the tail) from samples
  function measure(fn) {
    const dt = 0.002; let t30 = 0, t90 = 0, t50 = 0;
    for (let t = 0; t < 120; t += dt) {
      const u = fn(t);
      if (!t30 && u >= 0.3) t30 = t;
      if (!t90 && u >= 0.9) t90 = t;
      if (t > TPEAK && !t50 && u <= 0.5) { t50 = t; break; }
    }
    const T1 = 1.67 * (t90 - t30);
    const O1 = t30 - 0.3 * T1;
    return { T1, T2: t50 - O1, O1 };
  }
  const M = measure(full);

  document.querySelectorAll('[data-impulse-scope]').forEach(scope => {
    const canvas = scope.querySelector('canvas');
    const peakEl = scope.querySelector('[data-scope-peak]');
    const t1El = scope.querySelector('[data-scope-t1]');
    const t2El = scope.querySelector('[data-scope-t2]');
    const modeLabel = scope.querySelector('[data-scope-mode]');
    const buttons = [...scope.querySelectorAll('[data-wave]')];
    const PEAK = +scope.dataset.peak || 2400;
    const compact = scope.hasAttribute('data-compact');
    let wave = 'full', progress = reduced ? 1 : 0, raf = 0, last = 0, hold = 0;

    if (t1El) t1El.textContent = `${M.T1.toFixed(2)} µs`;
    if (t2El) t2El.textContent = `${M.T2.toFixed(1)} µs`;

    // time axis: split view — front 0–10 µs on the left 38 %, tail 10–100 µs on the right (how impulse
    // records are read: the front and the tail need different time bases)
    const SPLIT = 0.38, T_FRONT = 10, T_END = 100;
    const xOf = (t, L, W) => t <= T_FRONT ? L + (t / T_FRONT) * W * SPLIT : L + W * SPLIT + ((t - T_FRONT) / (T_END - T_FRONT)) * W * (1 - SPLIT);

    const draw = (ctx, w, h) => {
      const pad = compact ? { l: 34, r: 12, t: 12, b: 22 } : { l: 50, r: 22, t: 26, b: 30 };
      const L = pad.l, T = pad.t, W = w - pad.l - pad.r, H = h - pad.t - pad.b;
      const fn = wave === 'full' ? full : chopped;
      const yOf = u => T + H * (1 - (u + 0.35) / 1.45); // room for chopped undershoot
      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
      ctx.font = `${compact ? 9.5 : 11}px ui-monospace, "Cascadia Mono", Consolas, monospace`;
      // grid
      ctx.lineWidth = 1; ctx.strokeStyle = C.grid; ctx.beginPath();
      for (let i = 0; i <= 10; i++) { const x = Math.round(L + (W * i) / 10) + 0.5; ctx.moveTo(x, T); ctx.lineTo(x, T + H); }
      for (let i = 0; i <= 8; i++) { const y = Math.round(T + (H * i) / 8) + 0.5; ctx.moveTo(L, y); ctx.lineTo(L + W, y); }
      ctx.stroke();
      // zero line and time-base split
      ctx.strokeStyle = C.axis; ctx.beginPath();
      ctx.moveTo(L, Math.round(yOf(0)) + 0.5); ctx.lineTo(L + W, Math.round(yOf(0)) + 0.5);
      const xs = Math.round(L + W * SPLIT) + 0.5; ctx.setLineDash([3, 4]); ctx.moveTo(xs, T); ctx.lineTo(xs, T + H); ctx.stroke(); ctx.setLineDash([]);
      // axis labels
      ctx.fillStyle = C.text; ctx.textAlign = 'center';
      const ticks = compact ? [0, 5, 10, 50, 100] : [0, 2, 4, 6, 8, 10, 30, 50, 70, 100];
      ticks.forEach(t => ctx.fillText(`${t}`, xOf(t, L, W), T + H + (compact ? 14 : 18)));
      ctx.textAlign = 'right';
      [0, 0.5, 1].forEach(u => ctx.fillText(`${Math.round(u * PEAK).toLocaleString('en')}`, L - 6, yOf(u) + 4));
      if (!compact) { ctx.textAlign = 'left'; ctx.fillText('kV', 8, 14); ctx.textAlign = 'right'; ctx.fillText('time, µs', L + W, 14); }
      // reference marks: 30 / 90 / 50 % levels and T1, T2 markers (full wave only)
      if (wave === 'full' && progress > 0.98) {
        ctx.strokeStyle = C.ref; ctx.setLineDash([2, 4]); ctx.beginPath();
        [0.3, 0.9, 0.5].forEach(u => { const y = Math.round(yOf(u)) + 0.5; ctx.moveTo(L, y); ctx.lineTo(L + W, y); });
        ctx.stroke(); ctx.setLineDash([]);
        if (!compact) {
          ctx.fillStyle = C.mark; ctx.textAlign = 'left';
          ctx.fillText('30 %', L + 4, yOf(0.3) - 4); ctx.fillText('90 %', L + 4, yOf(0.9) - 4);
          const x50 = xOf(M.T2 + M.O1, L, W); ctx.fillText(`50 % @ ${M.T2.toFixed(1)} µs`, x50 + 6, yOf(0.5) - 6);
          ctx.beginPath(); ctx.arc(x50, yOf(0.5), 3, 0, Math.PI * 2); ctx.fill();
        }
      }
      if (wave === 'chopped' && progress > 0.98 && !compact) {
        ctx.fillStyle = C.mark; ctx.textAlign = 'left';
        const xc = xOf(TC, L, W); ctx.fillText(`chopped at Tc = ${TC.toFixed(1)} µs`, xc + 8, yOf(0.98));
      }
      // trace, drawn up to the current sweep position
      const tMax = T_END * progress;
      ctx.save(); ctx.beginPath(); ctx.rect(L, T - 4, W, H + 8); ctx.clip();
      ctx.lineJoin = 'round'; ctx.lineCap = 'round';
      const path = () => {
        ctx.beginPath();
        const steps = Math.max(200, Math.round(W * 1.5));
        for (let i = 0; i <= steps; i++) {
          // sample densely on the front where the curve is steep
          const s = i / steps; const t = s < SPLIT ? (s / SPLIT) * T_FRONT : T_FRONT + ((s - SPLIT) / (1 - SPLIT)) * (T_END - T_FRONT);
          if (t > tMax) break;
          const x = xOf(t, L, W), y = yOf(fn(t));
          i ? ctx.lineTo(x, y) : ctx.moveTo(x, y);
        }
      };
      ctx.strokeStyle = C.glow; ctx.lineWidth = compact ? 4 : 6; path(); ctx.stroke();
      ctx.strokeStyle = C.trace; ctx.lineWidth = compact ? 1.6 : 2; path(); ctx.stroke();
      ctx.restore();
    };
    const s = surface(canvas, draw);

    const setPeak = f => { if (peakEl) peakEl.textContent = Math.round(PEAK * f).toLocaleString('en'); };
    const frame = now => {
      const dt = Math.min(64, now - (last || now)); last = now;
      if (progress < 1) {
        // sweep: fast through the front, slower through the tail
        progress = Math.min(1, progress + dt / (progress < 0.1 ? 900 : 1600));
        const tNow = T_END * progress;
        const fn = wave === 'full' ? full : chopped;
        let peakSeen = 0; for (let t = 0; t <= Math.min(tNow, TPEAK + 0.01); t += 0.02) peakSeen = Math.max(peakSeen, fn(t));
        setPeak(peakSeen);
        s.redraw();
      } else if ((hold += dt) > 4200) { hold = 0; progress = 0; }  // re-fire after a pause
      raf = requestAnimationFrame(frame);
    };
    const start = () => { if (reduced || raf) return; last = 0; raf = requestAnimationFrame(frame); };
    const stop = () => { cancelAnimationFrame(raf); raf = 0; };
    if (reduced) { setPeak(1); } else whenVisible(scope, start, stop);

    buttons.forEach(b => b.addEventListener('click', () => {
      wave = b.dataset.wave;
      buttons.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const t2Label = scope.querySelector('[data-scope-t2-label]');
      if (t2Label) t2Label.textContent = wave === 'full' ? 'Time to half value T2' : 'Chopping time Tc';
      if (t2El) t2El.textContent = wave === 'full' ? `${M.T2.toFixed(1)} µs` : `${TC.toFixed(1)} µs`;
      if (modeLabel) modeLabel.textContent = wave === 'full' ? 'Full wave LI · 1.2/50 µs' : 'Chopped wave LIC · Tc 4 µs';
      canvas.setAttribute('aria-label', wave === 'full'
        ? `Oscilloscope trace of a standard 1.2/50 microsecond lightning impulse rising to ${PEAK} kilovolts and decaying to half value at about 50 microseconds.`
        : `Oscilloscope trace of a chopped lightning impulse, collapsing at 4 microseconds with an opposite-polarity undershoot.`);
      progress = reduced ? 1 : 0; hold = 0; setPeak(reduced ? 1 : 0); s.redraw();
    }));
  });

  /* =================== Partial discharge, 8 channels =================== */
  // Seeded random so every visitor sees the same pattern
  let seed = 7; const rnd = () => ((seed = (seed * 16807) % 2147483647) / 2147483647);
  document.querySelectorAll('[data-pd-panel]').forEach(panel => {
    const canvas = panel.querySelector('canvas');
    const readouts = [...panel.querySelectorAll('[data-pd-ch]')];
    const LIMIT = +panel.dataset.limit || 100; // acceptance level shown on screen, pC
    const base = [32, 21, 44, 27, 18, 38, 25, 52];  // illustrative apparent charge per channel, pC (below the limit)
    const phase = Array.from({ length: 8 }, () => rnd() * 0.15);
    let pulses = base.map(() => []), raf = 0, last = 0, acc = 0, tick = 0;
    const COLS = 4, ROWS = 2;

    function regenerate() {
      tick++;
      pulses = base.map((q, ch) => {
        const list = [];
        const n = 6 + Math.floor(rnd() * 9);
        for (let i = 0; i < n; i++) {
          // discharge activity clusters on the rising quarters of each half-cycle (0–90°, 180–270°)
          const half = rnd() < 0.5 ? 0 : 0.5;
          const ph = half + 0.02 + rnd() * 0.22 + phase[ch];
          const amp = q * (0.45 + rnd() * 0.55) * (half ? -1 : 1);
          list.push([ph, amp]);
        }
        return list;
      });
      readouts.forEach((el, ch) => {
        const peak = Math.max(...pulses[ch].map(p => Math.abs(p[1])));
        el.textContent = `${peak.toFixed(0)} pC`;
      });
    }
    const draw = (ctx, w, h) => {
      ctx.clearRect(0, 0, w, h); ctx.fillStyle = C.bg; ctx.fillRect(0, 0, w, h);
      const gap = 1, cw = (w - gap * (COLS - 1)) / COLS, chh = (h - gap * (ROWS - 1)) / ROWS;
      ctx.font = '10px ui-monospace, "Cascadia Mono", Consolas, monospace';
      for (let ch = 0; ch < 8; ch++) {
        const cx = (ch % COLS) * (cw + gap), cy = Math.floor(ch / COLS) * (chh + gap);
        ctx.save(); ctx.translate(cx, cy);
        if (ch % COLS) { ctx.fillStyle = 'rgba(124,196,255,.12)'; ctx.fillRect(-gap, 0, gap, chh); }
        if (ch >= COLS) { ctx.fillStyle = 'rgba(124,196,255,.12)'; ctx.fillRect(0, -gap, cw, gap); }
        const padX = 8, top = 18, H = chh - top - 8, W = cw - padX * 2, mid = top + H / 2;
        const scale = (H / 2) / (LIMIT * 1.15);
        // label
        ctx.fillStyle = C.text; ctx.textAlign = 'left'; ctx.fillText(`CH${ch + 1}`, padX, 12);
        // acceptance band
        ctx.strokeStyle = 'rgba(242,195,91,.35)'; ctx.setLineDash([2, 3]); ctx.beginPath();
        [LIMIT, -LIMIT].forEach(q => { const y = Math.round(mid - q * scale) + 0.5; ctx.moveTo(padX, y); ctx.lineTo(padX + W, y); });
        ctx.stroke(); ctx.setLineDash([]);
        // one 50 Hz cycle (20 ms) of the test-voltage reference
        ctx.strokeStyle = C.ref; ctx.lineWidth = 1; ctx.beginPath();
        for (let i = 0; i <= 80; i++) { const x = padX + (W * i) / 80, y = mid - Math.sin((2 * Math.PI * i) / 80) * H * 0.3; i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
        ctx.stroke();
        // discharge pulses with a short phosphor-like glow
        pulses[ch].forEach(([ph, q]) => {
          const x = Math.round(padX + W * (ph % 1)) + 0.5, y = mid - q * scale;
          ctx.strokeStyle = C.glow; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(x, mid); ctx.lineTo(x, y); ctx.stroke();
          ctx.strokeStyle = C.trace; ctx.lineWidth = 1.2; ctx.beginPath(); ctx.moveTo(x, mid); ctx.lineTo(x, y); ctx.stroke();
        });
        ctx.restore();
      }
    };
    regenerate();
    const s = surface(canvas, draw);
    const frame = now => {
      acc += now - (last || now); last = now;
      if (acc > 420) { acc = 0; regenerate(); s.redraw(); }
      raf = requestAnimationFrame(frame);
    };
    if (!reduced) whenVisible(panel, () => { if (!raf) { last = 0; raf = requestAnimationFrame(frame); } }, () => { cancelAnimationFrame(raf); raf = 0; });
  });
})();
