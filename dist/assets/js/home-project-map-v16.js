(() => {
  const root = document.querySelector('[data-ty16-projects]');
  if (!root) return;

  const stage = root.querySelector('.ty16-map-stage');
  const floatCard = root.querySelector('[data-ty16-float-card]');
  const closeButton = root.querySelector('[data-ty16-close]');
  const pins = [...root.querySelectorAll('[data-ty16-pin]')];
  const cards = [...root.querySelectorAll('[data-ty16-card]')];
  const filters = [...root.querySelectorAll('[data-ty16-filter]')];
  const tooltip = root.querySelector('.ty16-tooltip');
  const tipCountry = root.querySelector('[data-ty16-tip-country]');
  const tipTitle = root.querySelector('[data-ty16-tip-title]');
  const image = root.querySelector('[data-ty16-image]');
  const country = root.querySelector('[data-ty16-country]');
  const title = root.querySelector('[data-ty16-title]');
  const summary = root.querySelector('[data-ty16-summary]');
  const application = root.querySelector('[data-ty16-application]');
  const industry = root.querySelector('[data-ty16-industry]');
  const scale = root.querySelector('[data-ty16-scale]');
  const product = root.querySelector('[data-ty16-product]');
  const scopeRow = root.querySelector('[data-ty16-scope-row]');
  const scope = root.querySelector('[data-ty16-scope]');
  const link = root.querySelector('[data-ty16-link]');
  const visibleCount = root.querySelector('[data-ty16-visible-count]');

  let selectedId = null;
  let switchTimer = null;

  function sameProject(el, id) {
    return el.dataset.projectId === id;
  }

  function setActive(id) {
    selectedId = id || null;
    pins.forEach(pin => pin.classList.toggle('active', Boolean(id) && sameProject(pin, id)));
    cards.forEach(card => card.classList.toggle('active', Boolean(id) && sameProject(card, id)));
    if (stage) stage.classList.toggle('has-selection', Boolean(id));
  }

  function updatePanel(el) {
    if (!el || el.hidden) return;
    clearTimeout(switchTimer);
    floatCard?.classList.add('is-switching');
    switchTimer = setTimeout(() => {
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
      const scopeText = el.dataset.scope || '';
      if (scopeRow && scope) {
        scope.textContent = scopeText;
        scopeRow.hidden = !scopeText;
      }
      floatCard?.classList.remove('is-switching');
    }, 120);
  }

  function openPanel(el) {
    if (!el || el.hidden) return;
    hideTooltip();
    setActive(el.dataset.projectId);
    updatePanel(el);
    if (floatCard) {
      floatCard.classList.add('open');
      floatCard.setAttribute('aria-hidden', 'false');
    }
  }

  function closePanel() {
    setActive(null);
    if (floatCard) {
      floatCard.classList.remove('open', 'is-switching');
      floatCard.setAttribute('aria-hidden', 'true');
    }
  }

  function showTooltip(el) {
    if (!tooltip || !el || el.hidden || el.dataset.projectId === selectedId) return;
    tipCountry.textContent = el.dataset.country || '';
    tipTitle.textContent = el.dataset.title || '';
    const x = Number(el.dataset.x || 50);
    const y = Number(el.dataset.y || 50);
    const safeX = Math.min(86, Math.max(14, x));
    const safeY = Math.min(86, Math.max(18, y));
    tooltip.style.left = `${safeX}%`;
    tooltip.style.top = `${safeY}%`;
    tooltip.classList.add('show');
    tooltip.setAttribute('aria-hidden', 'false');
  }

  function hideTooltip() {
    if (!tooltip) return;
    tooltip.classList.remove('show');
    tooltip.setAttribute('aria-hidden', 'true');
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
    hideTooltip();
    closePanel();
  }

  pins.forEach(pin => {
    pin.addEventListener('mouseenter', () => showTooltip(pin));
    pin.addEventListener('mouseleave', hideTooltip);
    pin.addEventListener('focus', () => showTooltip(pin));
    pin.addEventListener('blur', hideTooltip);
    pin.addEventListener('click', () => openPanel(pin));
  });

  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      const id = card.dataset.projectId;
      pins.forEach(pin => pin.classList.toggle('preview', sameProject(pin, id)));
    });
    card.addEventListener('mouseleave', () => pins.forEach(pin => pin.classList.remove('preview')));
    card.addEventListener('focus', () => {
      const id = card.dataset.projectId;
      pins.forEach(pin => pin.classList.toggle('preview', sameProject(pin, id)));
    });
    card.addEventListener('blur', () => pins.forEach(pin => pin.classList.remove('preview')));
  });

  filters.forEach(btn => {
    btn.addEventListener('click', () => applyFilter(btn.dataset.ty16Filter || 'all'));
  });

  closeButton?.addEventListener('click', closePanel);
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closePanel();
  });

  applyFilter('all');
})();
