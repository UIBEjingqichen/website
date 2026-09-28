(() => {
  const flow = document.querySelector('[data-energy-flow]');
  const toggle = flow?.querySelector('[data-energy-flow-toggle]');
  if (!flow || !toggle) return;
  toggle.addEventListener('click', () => {
    const paused = flow.classList.toggle('is-paused');
    toggle.setAttribute('aria-pressed', String(paused));
    toggle.setAttribute('aria-label', paused ? 'Play energy flow animation' : 'Pause energy flow animation');
    toggle.textContent = paused ? 'Play motion' : 'Pause motion';
  });
})();
