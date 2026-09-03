(() => {
  const root = document.querySelector('[data-ty15-capabilities]');
  if (!root) return;
  const tabs = [...root.querySelectorAll('[data-ty15-tab]')];
  const panels = [...root.querySelectorAll('[data-ty15-panel]')];

  function activate(id) {
    tabs.forEach((tab) => {
      const active = tab.dataset.ty15Tab === id;
      tab.classList.toggle('active', active);
      tab.setAttribute('aria-selected', active ? 'true' : 'false');
      tab.tabIndex = active ? 0 : -1;
    });
    panels.forEach((panel) => {
      const active = panel.dataset.ty15Panel === id;
      panel.classList.toggle('active', active);
      panel.hidden = !active;
    });
  }

  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => activate(tab.dataset.ty15Tab));
    tab.addEventListener('keydown', (event) => {
      if (!['ArrowLeft','ArrowRight'].includes(event.key)) return;
      event.preventDefault();
      const delta = event.key === 'ArrowRight' ? 1 : -1;
      const next = tabs[(index + delta + tabs.length) % tabs.length];
      activate(next.dataset.ty15Tab);
      next.focus();
    });
  });

  activate(tabs.find(tab => tab.classList.contains('active'))?.dataset.ty15Tab || tabs[0]?.dataset.ty15Tab);
})();
