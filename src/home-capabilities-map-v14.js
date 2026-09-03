(() => {
  const root = document.querySelector('[data-ty-project-map]');
  if (!root) return;
  const pins = [...root.querySelectorAll('[data-project-pin]')];
  const cards = [...root.querySelectorAll('[data-project-mini]')];
  const country = root.querySelector('[data-map-country]');
  const title = root.querySelector('[data-map-title]');
  const summary = root.querySelector('[data-map-summary]');
  const scale = root.querySelector('[data-map-scale]');
  const equipment = root.querySelector('[data-map-equipment]');
  const year = root.querySelector('[data-map-year]');
  const link = root.querySelector('[data-map-link]');

  function activate(el) {
    if (!el) return;
    const id = el.dataset.projectId;
    pins.forEach(pin => pin.classList.toggle('active', pin.dataset.projectId === id));
    cards.forEach(card => card.classList.toggle('active', card.dataset.projectId === id));
    country.textContent = el.dataset.country || '';
    title.textContent = el.dataset.title || '';
    summary.textContent = el.dataset.summary || '';
    scale.textContent = el.dataset.scale || 'Project-specific';
    equipment.textContent = el.dataset.equipment || 'Transformer equipment';
    year.textContent = el.dataset.year || '';
    link.href = el.dataset.href || 'applications.html';
  }

  pins.forEach(pin => {
    pin.addEventListener('mouseenter', () => activate(pin));
    pin.addEventListener('focus', () => activate(pin));
    pin.addEventListener('click', () => {
      activate(pin);
      if (pin.dataset.href) window.location.href = pin.dataset.href;
    });
  });
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => activate(card));
    card.addEventListener('focus', () => activate(card));
  });
  activate(pins[0] || cards[0]);
})();
