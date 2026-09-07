(() => {
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

  function parseCounter(element) {
    const original = element.textContent.trim();
    const match = original.match(/^(.*?)(-?\d[\d,]*(?:\.\d+)?)(.*)$/);
    if (!match) return null;
    const numericText = match[2];
    const target = Number(numericText.replace(/,/g, ''));
    if (!Number.isFinite(target)) return null;
    const decimals = (numericText.split('.')[1] || '').length;
    return {
      original,
      prefix: match[1],
      suffix: match[3],
      target,
      decimals,
      grouped: numericText.includes(',') || Math.abs(target) >= 1000
    };
  }

  function setupCountUp() {
    const counters = [...document.querySelectorAll([
      '.phase1-home .yw-stat-grid strong',
      '.phase1-manufacturing .mfg34-hero-stat strong',
      '.phase1-manufacturing .mfg34-metric strong'
    ].join(','))].map((element) => ({ element, data: parseCounter(element) })).filter((item) => item.data);

    if (!counters.length || reduced.matches) return;

    const formatter = (data, value) => new Intl.NumberFormat('en-US', {
      useGrouping: data.grouped,
      minimumFractionDigits: data.decimals,
      maximumFractionDigits: data.decimals
    }).format(value);

    const animate = ({ element, data }) => {
      if (element.dataset.vsCountDone === 'true') return;
      element.dataset.vsCountDone = 'true';
      element.setAttribute('aria-label', data.original);
      const duration = Math.min(1900, 1150 + Math.log10(Math.abs(data.target) + 1) * 150);
      const started = performance.now();
      const easeOutCubic = (progress) => 1 - Math.pow(1 - progress, 3);
      element.textContent = `${data.prefix}${formatter(data, 0)}${data.suffix}`;

      const tick = (now) => {
        const progress = Math.min(1, (now - started) / duration);
        const eased = easeOutCubic(progress);
        const rawValue = data.target * eased;
        const value = data.decimals ? rawValue : Math.round(rawValue);
        element.textContent = `${data.prefix}${formatter(data, value)}${data.suffix}`;
        if (progress < 1) {
          requestAnimationFrame(tick);
        } else {
          element.textContent = data.original;
          element.animate([
            { transform: 'translateY(0) scale(1)' },
            { transform: 'translateY(-2px) scale(1.025)', offset: .58 },
            { transform: 'translateY(0) scale(1)' }
          ], { duration: 220, easing: 'ease-out' });
        }
      };
      requestAnimationFrame(tick);
    };

    if (!('IntersectionObserver' in window)) {
      counters.forEach(animate);
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = counters.find((candidate) => candidate.element === entry.target);
        if (item) animate(item);
        observer.unobserve(entry.target);
      });
    }, { threshold: .45, rootMargin: '0px 0px -6% 0px' });

    counters.forEach(({ element }) => observer.observe(element));
  }

  function setupScrollReveal() {
    if (reduced.matches || !('IntersectionObserver' in window)) return;

    const groups = [
      ['.phase1-home .yw-company-copy, .phase1-home .yw-stat-grid article', 70],
      ['.phase1-home .v3p-products-home .v3p-title, .phase1-home .v3p-family-card', 65],
      ['.phase1-home .ty15-head, .phase1-home .ty15-band', 75],
      ['.phase1-home .ty16-head, .phase1-home .ty16-filters, .phase1-home .ty16-map-stage, .phase1-home .ty16-card', 70],
      ['.phase1-home .v5-certificate-coverflow, .phase1-home .ty18-news-card, .phase1-home .vs-home-evidence-head, .phase1-home .vs-home-evidence-grid figure, .phase1-home .vs-home-cta .v3p-shell', 70],
      ['.phase1-products .v23-family-heading, .phase1-products .v23-family-grid > a, .phase1-products .v12-directory-head, .phase1-products .v3p-platform-card', 55],
      ['.phase1-detail .v3p-spec, .phase1-detail .v3p-table-wrap, .phase1-detail .v3p-two-col > div, .phase1-detail .v3p-photo, .phase1-detail .vs-doc-card, .phase1-detail .vs-related-card, .phase1-detail .v3p-cta > *', 65],
      ['.phase1-manufacturing .mfg34-head, .phase1-manufacturing .mfg34-metric, .phase1-manufacturing .mfg34-step, .phase1-manufacturing .mfg34-system, .phase1-manufacturing .mfg34-digital-visual, .phase1-manufacturing .mfg34-test-item, .phase1-manufacturing .mfg34-test-photo, .phase1-manufacturing .mfg34-gallery figure, .phase1-manufacturing .mfg34-faq details, .phase1-manufacturing .mfg34-cta-inner > *', 55]
    ];

    const revealItems = [];
    const seen = new Set();

    groups.forEach(([selector, delayStep]) => {
      const items = [...document.querySelectorAll(selector)];
      items.forEach((element, index) => {
        if (seen.has(element)) return;
        seen.add(element);
        const delay = Math.min(280, (index % 5) * delayStep);
        element.dataset.vsReveal = 'pending';
        element.style.opacity = '0';
        element.style.transform = 'translateY(20px)';
        element.style.willChange = 'opacity, transform';
        revealItems.push({ element, delay });
      });
    });

    const reveal = ({ element, delay }) => {
      if (element.dataset.vsReveal === 'done') return;
      element.dataset.vsReveal = 'done';
      const animation = element.animate([
        { opacity: 0, transform: 'translateY(20px)' },
        { opacity: 1, transform: 'translateY(0)' }
      ], {
        duration: 680,
        delay,
        easing: 'cubic-bezier(.2,.72,.25,1)',
        fill: 'forwards'
      });
      animation.addEventListener('finish', () => {
        element.style.opacity = '';
        element.style.transform = '';
        element.style.willChange = '';
      }, { once: true });
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const item = revealItems.find((candidate) => candidate.element === entry.target);
        if (item) reveal(item);
        observer.unobserve(entry.target);
      });
    }, { threshold: .12, rootMargin: '0px 0px 8% 0px' });

    revealItems.forEach(({ element }) => observer.observe(element));
  }

  setupCountUp();
  setupScrollReveal();

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
