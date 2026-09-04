(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const metrics = [...document.querySelectorAll('.company-metric strong[data-count]')];
  const format = (value, el) => {
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const text = Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return `${prefix}${text}${suffix}`;
  };
  const showFinal = (el) => { el.textContent = format(Number(el.dataset.count || 0), el); };
  const animate = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = Number(el.dataset.duration || 1400);
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      const decimals = Number(el.dataset.decimals || 0);
      const factor = 10 ** decimals;
      const value = Math.round(target * eased * factor) / factor;
      el.textContent = format(value, el);
      if (p < 1) requestAnimationFrame(tick); else showFinal(el);
    };
    requestAnimationFrame(tick);
  };

  if (metrics.length) {
    if (reduced) metrics.forEach(showFinal);
    else {
      metrics.forEach((el) => { el.textContent = format(0, el); });
      const section = document.querySelector('.company-metrics');
      if (section && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (!entries[0]?.isIntersecting) return;
          metrics.forEach((el, i) => window.setTimeout(() => animate(el), i * 45));
          observer.disconnect();
        }, { threshold: 0.24 });
        observer.observe(section);
      } else metrics.forEach(animate);
    }
  }

  const scroller = document.querySelector('.company-history-scroll');
  if (!scroller) return;
  scroller.tabIndex = 0;
  scroller.setAttribute('role', 'region');
  scroller.setAttribute('aria-label', 'Company milestones. Drag left or right to explore the timeline.');

  let dragging = false;
  let startX = 0;
  let startLeft = 0;
  let direction = 1;
  let resumeAt = 0;
  let edgePauseUntil = 0;
  let lastTime = performance.now();
  const speed = 0.055;
  const pauseFor = (ms) => { resumeAt = Math.max(resumeAt, performance.now() + ms); };

  scroller.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startLeft = scroller.scrollLeft;
    scroller.classList.add('is-dragging');
    scroller.setPointerCapture?.(event.pointerId);
  });
  scroller.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    scroller.scrollLeft = startLeft - (event.clientX - startX);
    event.preventDefault();
  });
  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    scroller.classList.remove('is-dragging');
    try { if (event?.pointerId !== undefined) scroller.releasePointerCapture?.(event.pointerId); } catch (_) {}
    pauseFor(700);
  };
  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('lostpointercapture', endDrag);
  scroller.addEventListener('keydown', (event) => {
    if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
    event.preventDefault();
    scroller.scrollBy({ left: event.key === 'ArrowRight' ? 220 : -220, behavior: 'smooth' });
    pauseFor(1000);
  });

  const autoScroll = (now) => {
    const dt = Math.min(now - lastTime, 48);
    lastTime = now;
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);
    if (!reduced && max > 2 && !dragging && now >= resumeAt && now >= edgePauseUntil) {
      scroller.scrollLeft += direction * speed * dt;
      if (scroller.scrollLeft >= max - 1) {
        scroller.scrollLeft = max;
        direction = -1;
        edgePauseUntil = now + 650;
      } else if (scroller.scrollLeft <= 1) {
        scroller.scrollLeft = 0;
        direction = 1;
      }
    }
    requestAnimationFrame(autoScroll);
  };
  requestAnimationFrame(autoScroll);
})();
