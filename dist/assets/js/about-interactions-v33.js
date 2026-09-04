(() => {
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Metric count-up */
  const metrics = [...document.querySelectorAll('.ab30-metric strong[data-count]')];
  const formatValue = (value, el) => {
    const decimals = Number(el.dataset.decimals || 0);
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const formatted = Number(value).toLocaleString('en-US', {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals
    });
    return `${prefix}${formatted}${suffix}`;
  };
  const showFinal = (el) => {
    el.textContent = formatValue(Number(el.dataset.count || 0), el);
  };
  const animateMetric = (el) => {
    const target = Number(el.dataset.count || 0);
    const duration = Number(el.dataset.duration || 1500);
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const decimals = Number(el.dataset.decimals || 0);
      const factor = Math.pow(10, decimals);
      const value = Math.round(target * eased * factor) / factor;
      el.textContent = formatValue(value, el);
      if (progress < 1) requestAnimationFrame(tick);
      else showFinal(el);
    };
    requestAnimationFrame(tick);
  };

  if (metrics.length) {
    if (prefersReducedMotion) {
      metrics.forEach(showFinal);
    } else {
      metrics.forEach((el) => { el.textContent = formatValue(0, el); });
      const section = document.querySelector('.ab30-metrics');
      if (section && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
          if (!entries[0]?.isIntersecting) return;
          metrics.forEach((el, index) => window.setTimeout(() => animateMetric(el), index * 55));
          observer.disconnect();
        }, { threshold: 0.25 });
        observer.observe(section);
      } else {
        metrics.forEach(animateMetric);
      }
    }
  }

  /* Milestone carousel: automatic movement + drag directly on the content area. */
  const scroller = document.querySelector('.ab30-history-scroll');
  if (!scroller) return;

  scroller.setAttribute('tabindex', '0');
  scroller.setAttribute('role', 'region');
  scroller.setAttribute('aria-label', 'Company milestones. Drag left or right to explore the timeline.');

  let dragging = false;
  let hovering = false;
  let startX = 0;
  let startScrollLeft = 0;
  let direction = 1;
  let resumeAt = 0;
  let edgePauseUntil = 0;
  let lastTime = performance.now();
  const speed = 0.028; // pixels per millisecond, intentionally calm for reading

  const pauseFor = (ms) => {
    resumeAt = Math.max(resumeAt, performance.now() + ms);
  };

  scroller.addEventListener('pointerdown', (event) => {
    if (event.button !== undefined && event.button !== 0) return;
    dragging = true;
    startX = event.clientX;
    startScrollLeft = scroller.scrollLeft;
    scroller.classList.add('is-dragging');
    scroller.setPointerCapture?.(event.pointerId);
    pauseFor(1800);
  });

  scroller.addEventListener('pointermove', (event) => {
    if (!dragging) return;
    const dx = event.clientX - startX;
    scroller.scrollLeft = startScrollLeft - dx;
    event.preventDefault();
  });

  const endDrag = (event) => {
    if (!dragging) return;
    dragging = false;
    scroller.classList.remove('is-dragging');
    if (event?.pointerId !== undefined) {
      try { scroller.releasePointerCapture?.(event.pointerId); } catch (_) {}
    }
    pauseFor(1500);
  };

  scroller.addEventListener('pointerup', endDrag);
  scroller.addEventListener('pointercancel', endDrag);
  scroller.addEventListener('lostpointercapture', endDrag);
  scroller.addEventListener('mouseenter', () => { hovering = true; });
  scroller.addEventListener('mouseleave', () => { hovering = false; pauseFor(700); });

  scroller.addEventListener('keydown', (event) => {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    scroller.scrollBy({ left: event.key === 'ArrowRight' ? 220 : -220, behavior: 'smooth' });
    pauseFor(1800);
  });

  const autoScroll = (now) => {
    const dt = Math.min(now - lastTime, 48);
    lastTime = now;
    const max = Math.max(0, scroller.scrollWidth - scroller.clientWidth);

    if (!prefersReducedMotion && max > 2 && !dragging && !hovering && now >= resumeAt && now >= edgePauseUntil) {
      scroller.scrollLeft += direction * speed * dt;
      if (scroller.scrollLeft >= max - 1) {
        scroller.scrollLeft = max;
        direction = -1;
        edgePauseUntil = now + 900;
      } else if (scroller.scrollLeft <= 1) {
        scroller.scrollLeft = 0;
        direction = 1;
        edgePauseUntil = now + 900;
      }
    }
    requestAnimationFrame(autoScroll);
  };

  requestAnimationFrame(autoScroll);
})();
