(() => {
  const root = document.querySelector('[data-ty16-projects]');
  if (!root) return;

  const pins = [...root.querySelectorAll('[data-ty16-pin]')];
  const cards = [...root.querySelectorAll('[data-ty16-card]')];
  const filters = [...root.querySelectorAll('[data-ty16-filter]')];
  const image = root.querySelector('[data-ty16-image]');
  const imageNote = root.querySelector('[data-ty16-image-note]');
  const country = root.querySelector('[data-ty16-country]');
  const title = root.querySelector('[data-ty16-title]');
  const summary = root.querySelector('[data-ty16-summary]');
  const application = root.querySelector('[data-ty16-application]');
  const industry = root.querySelector('[data-ty16-industry]');
  const scale = root.querySelector('[data-ty16-scale]');
  const product = root.querySelector('[data-ty16-product]');
  const link = root.querySelector('[data-ty16-link]');
  const visibleCount = root.querySelector('[data-ty16-visible-count]');

  function sameProject(el, id) {
    return el.dataset.projectId === id;
  }

  function activate(el) {
    if (!el || el.hidden) return;
    const id = el.dataset.projectId;
    pins.forEach(pin => pin.classList.toggle('active', sameProject(pin, id)));
    cards.forEach(card => card.classList.toggle('active', sameProject(card, id)));
    country.textContent = el.dataset.country || '';
    title.textContent = el.dataset.title || '';
    summary.textContent = el.dataset.summary || '';
    application.textContent = el.dataset.application || 'Project-specific';
    industry.textContent = el.dataset.industry || 'Project-specific';
    scale.textContent = el.dataset.scale || 'Project-specific';
    product.textContent = el.dataset.product || 'Transformer / substation equipment';
    link.href = el.dataset.href || 'applications.html#projects';
    if (image) {
      image.src = el.dataset.image || '';
      image.alt = `${el.dataset.title || 'Tianyu project'} reference visual`;
    }
    if (imageNote) imageNote.textContent = el.dataset.imageNote || 'Project reference visual';
  }

  function matches(el, value) {
    return value === 'all' || el.dataset.application === value;
  }

  function applyFilter(value) {
    filters.forEach(btn => {
      const active = btn.dataset.ty16Filter === value;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-pressed', active ? 'true' : 'false');
    });

    pins.forEach(pin => {
      pin.hidden = !matches(pin, value);
    });

    let shown = 0;
    cards.forEach(card => {
      const visible = matches(card, value) && shown < 4;
      card.hidden = !visible;
      if (visible) shown += 1;
    });

    if (visibleCount) visibleCount.textContent = `${shown} selected reference${shown === 1 ? '' : 's'}`;

    const current = pins.find(pin => pin.classList.contains('active') && !pin.hidden);
    const first = current || pins.find(pin => !pin.hidden);
    if (first) activate(first);
  }

  pins.forEach(pin => {
    pin.addEventListener('mouseenter', () => activate(pin));
    pin.addEventListener('focus', () => activate(pin));
    pin.addEventListener('click', () => activate(pin));
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => activate(card));
    card.addEventListener('focus', () => activate(card));
  });

  filters.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.ty16Filter || 'all'));
  });

  applyFilter('all');
})();
