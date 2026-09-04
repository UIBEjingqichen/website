(() => {
  const metrics = [...document.querySelectorAll('.ab30-metric strong[data-count]')];
  if (!metrics.length) return;

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

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    metrics.forEach(showFinal);
    return;
  }

  metrics.forEach((el) => {
    el.textContent = formatValue(0, el);
  });

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

  const section = document.querySelector('.ab30-metrics');
  if (!section || !('IntersectionObserver' in window)) {
    metrics.forEach(animateMetric);
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    const entry = entries[0];
    if (!entry?.isIntersecting) return;
    metrics.forEach((el, index) => {
      window.setTimeout(() => animateMetric(el), index * 55);
    });
    observer.disconnect();
  }, { threshold: 0.28 });

  observer.observe(section);
})();
