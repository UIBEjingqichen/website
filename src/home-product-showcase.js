(() => {
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  function setup(viewport) {
    const container = viewport.closest('[data-product-showcase], .ty-carousel__cert-block');
    const rail = viewport.querySelector('.typs-rail') || viewport;
    const originals = [...rail.children];
    if (!container || originals.length < 2) return;
    const copies = originals.map(node => {
      const clone = node.cloneNode(true);
      clone.setAttribute('aria-hidden', 'true');
      clone.tabIndex = -1;
      clone.querySelectorAll('a,button').forEach(element => { element.tabIndex = -1; });
      return clone;
    });
    rail.append(...copies);

    const toggle = container.querySelector('[data-marquee-toggle]');
    const speed = Number(viewport.dataset.marqueeSpeed) || 20;
    let cycleWidth = 0;
    let lastFrame = 0;
    let visible = false;
    let focused = false;
    let dragging = false;
    let dragged = false;
    let startX = 0;
    let startScroll = 0;
    let manualPause = false;
    let holdUntil = 0;
    let position = viewport.scrollLeft;

    function measure() {
      cycleWidth = copies[0].getBoundingClientRect().left - originals[0].getBoundingClientRect().left;
      if (cycleWidth > 0 && viewport.scrollLeft >= cycleWidth) viewport.scrollLeft %= cycleWidth;
      position = viewport.scrollLeft;
    }

    function frame(now) {
      const elapsed = lastFrame ? Math.min(now - lastFrame, 50) : 0;
      lastFrame = now;
      if (visible && !document.hidden && !reducedMotion.matches && !manualPause && !focused && !dragging && now >= holdUntil && cycleWidth > 0) {
        position += speed * elapsed / 1000;
        if (position >= cycleWidth) position -= cycleWidth;
        viewport.scrollLeft = position;
      } else position = viewport.scrollLeft;
      requestAnimationFrame(frame);
    }

    function updateToggle() {
      if (!toggle) return;
      toggle.hidden = reducedMotion.matches;
      toggle.textContent = manualPause ? '▶' : 'Ⅱ';
      toggle.setAttribute('aria-pressed', String(manualPause));
      toggle.setAttribute('aria-label', `${manualPause ? 'Resume' : 'Pause'} ${viewport.closest('[data-product-showcase]') ? 'product' : 'certificate'} movement`);
    }

    toggle?.addEventListener('click', () => { manualPause = !manualPause; updateToggle(); });
    container.addEventListener('focusin', () => { focused = true; });
    container.addEventListener('focusout', () => window.setTimeout(() => {
      focused = container.contains(document.activeElement);
    }, 0));

    viewport.addEventListener('pointerdown', event => {
      if (event.pointerType !== 'mouse' || event.button !== 0) return;
      dragging = true;
      dragged = false;
      startX = event.clientX;
      startScroll = viewport.scrollLeft;
      viewport.setPointerCapture(event.pointerId);
      viewport.classList.add('is-dragging');
    });
    viewport.addEventListener('pointermove', event => {
      if (!dragging) return;
      const distance = event.clientX - startX;
      if (Math.abs(distance) > 5) dragged = true;
      viewport.scrollLeft = startScroll - distance;
      if (cycleWidth > 0 && viewport.scrollLeft >= cycleWidth) viewport.scrollLeft -= cycleWidth;
    });
    function endDrag() {
      dragging = false;
      viewport.classList.remove('is-dragging');
      holdUntil = performance.now() + 900;
    }
    viewport.addEventListener('pointerup', endDrag);
    viewport.addEventListener('pointercancel', endDrag);
    viewport.addEventListener('click', event => {
      if (dragged) { event.preventDefault(); event.stopPropagation(); dragged = false; }
    }, true);

    if ('IntersectionObserver' in window) {
      new IntersectionObserver(entries => { visible = entries[0].isIntersecting; }, { threshold: .08 }).observe(container);
    } else visible = true;
    window.addEventListener('resize', measure);
    reducedMotion.addEventListener('change', updateToggle);
    measure();
    updateToggle();
    requestAnimationFrame(frame);

    if (viewport.closest('[data-product-showcase]')) {
      const move = direction => {
        const gap = parseFloat(getComputedStyle(rail).gap) || 0;
        const amount = originals[0].getBoundingClientRect().width + gap;
        holdUntil = performance.now() + 1500;
        viewport.scrollBy({ left: direction * amount, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
      };
      container.querySelector('[data-typs-prev]')?.addEventListener('click', () => move(-1));
      container.querySelector('[data-typs-next]')?.addEventListener('click', () => move(1));
    }
  }

  document.querySelectorAll('[data-auto-marquee]').forEach(viewport => {
    if (!('IntersectionObserver' in window)) { setup(viewport); return; }
    const observer = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      observer.disconnect();
      setup(viewport);
    }, { rootMargin: '400px' });
    observer.observe(viewport);
  });
})();
