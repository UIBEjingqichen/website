(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  const hero = document.querySelector('[data-product-hero]');
  if (hero) {
    const slides = [...hero.querySelectorAll('[data-product-slide]')];
    const dots = [...hero.querySelectorAll('[data-product-dot]')];
    const count = hero.querySelector('[data-product-count]');
    const toggle = hero.querySelector('[data-product-toggle]');
    let active = Math.max(0, slides.findIndex((slide) => slide.classList.contains('is-active')));
    let timer = null;
    let manualPause = false;
    let interactionPause = false;

    const render = (index) => {
      active = (index + slides.length) % slides.length;
      slides.forEach((slide, i) => {
        const current = i === active;
        slide.classList.toggle('is-active', current);
        slide.setAttribute('aria-hidden', current ? 'false' : 'true');
      });
      dots.forEach((dot, i) => {
        const current = i === active;
        dot.classList.toggle('is-active', current);
        dot.setAttribute('aria-current', current ? 'true' : 'false');
      });
      if (count) count.textContent = `${String(active + 1).padStart(2, '0')} / ${String(slides.length).padStart(2, '0')}`;
    };
    const stop = () => {
      if (timer) window.clearInterval(timer);
      timer = null;
    };
    const start = () => {
      stop();
      if (slides.length < 2 || manualPause || interactionPause || reduced.matches) return;
      timer = window.setInterval(() => render(active + 1), 8000);
    };
    const updateToggle = () => {
      if (!toggle) return;
      toggle.textContent = manualPause ? 'Play' : 'Pause';
      toggle.setAttribute('aria-pressed', manualPause ? 'true' : 'false');
    };
    dots.forEach((dot, index) => dot.addEventListener('click', () => { render(index); start(); }));
    toggle?.addEventListener('click', () => { manualPause = !manualPause; updateToggle(); start(); });
    hero.addEventListener('mouseenter', () => { interactionPause = true; stop(); });
    hero.addEventListener('mouseleave', () => { interactionPause = false; start(); });
    hero.addEventListener('focusin', () => { interactionPause = true; stop(); });
    hero.addEventListener('focusout', () => window.setTimeout(() => {
      if (!hero.contains(document.activeElement)) { interactionPause = false; start(); }
    }, 0));
    reduced.addEventListener?.('change', start);
    if (slides.length) render(active);
    updateToggle();
    start();
  }

  const shelf = document.querySelector('[data-phase1-evidence-shelf]');
  if (shelf) {
    const stage = shelf.querySelector('.v5-coverflow-stage');
    const previous = shelf.querySelector('.v5-coverflow-arrow.previous, .v5-coverflow-arrow.prev');
    const next = shelf.querySelector('.v5-coverflow-arrow.next');
    const move = (direction) => {
      if (!stage) return;
      const amount = Math.max(220, Math.round(stage.clientWidth * .72));
      stage.scrollBy({ left: direction * amount, behavior: reduced.matches ? 'auto' : 'smooth' });
    };
    previous?.addEventListener('click', (event) => { event.preventDefault(); move(-1); });
    next?.addEventListener('click', (event) => { event.preventDefault(); move(1); });
    shelf.addEventListener('keydown', (event) => {
      if (event.key === 'ArrowLeft') move(-1);
      if (event.key === 'ArrowRight') move(1);
    });
  }

  const manufacturingNav = document.querySelector('.phase1-manufacturing .mfg34-jump');
  if (manufacturingNav) {
    const links = [...manufacturingNav.querySelectorAll('a[href^="#"]')];
    const sections = links.map((link) => document.querySelector(link.getAttribute('href'))).filter(Boolean);
    const activate = (id) => links.forEach((link) => link.classList.toggle('is-active', link.getAttribute('href') === `#${id}`));
    links.forEach((link) => link.addEventListener('click', () => activate(link.getAttribute('href').slice(1))));
    if ('IntersectionObserver' in window) {
      const observer = new IntersectionObserver((entries) => {
        const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible?.target?.id) activate(visible.target.id);
      }, { rootMargin: '-20% 0px -65% 0px', threshold: [0, .15, .4, .8] });
      sections.forEach((section) => observer.observe(section));
    }
  }
})();
