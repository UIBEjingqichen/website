/* Reference list: reveal the collapsed rows of one application group. */
document.querySelectorAll('[data-ap60-more]').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('.ap60-reference-group');
    const open = group.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    const n = group.querySelectorAll('.ap60-reference').length;
    const name = group.querySelector('h3').textContent.toLowerCase();
    btn.textContent = open ? 'Show fewer' : `Show all ${n} ${name} references`;
  });
});

/* Reference list: row markers, capacity figures, sticky jump bar with scroll-spy. */
(function () {
  const list = document.querySelector('.ap60-list');
  if (!list) return;
  const jump = list.querySelector('.ap60-jump');
  const groups = Array.from(list.querySelectorAll('.ap60-reference-group'));
  const rows = Array.from(list.querySelectorAll('.ap60-reference'));

  // Row markers: project-page rows, international countries, capacity figure.
  rows.forEach(row => {
    if (row.querySelector('h4 a')) row.classList.add('has-page');
    const spans = row.querySelectorAll('.ap60-reference-meta > span');
    if (spans[0] && spans[0].textContent.trim() !== 'China') spans[0].classList.add('is-intl');
    if (spans[2]) {
      const m = /^([\d.,]+)\s*(.*)$/.exec(spans[2].textContent.trim());
      if (m) {
        const num = document.createElement('b');
        num.textContent = m[1];
        spans[2].textContent = '';
        spans[2].append(num, m[2] ? ' ' + m[2] : '');
      }
    }
  });

  // Keep the totals in the intro line in step with the list.
  const total = list.querySelector('[data-ap60-total]');
  const areas = list.querySelector('[data-ap60-areas]');
  if (total) total.textContent = rows.length;
  if (areas) areas.textContent = groups.length;

  if (!jump) return;
  const links = Array.from(jump.querySelectorAll('a'));

  // Segment width follows the number of references in each group.
  links.forEach(a => {
    const n = parseInt((a.querySelector('span') || {}).textContent, 10);
    if (n) a.style.setProperty('--n', n);
  });

  // Sticky offsets are measured, so the bar sits right under the site header.
  const header = document.querySelector('.site-header');
  const setOffsets = () => {
    const h = header ? header.getBoundingClientRect().height : 74;
    list.style.setProperty('--ap-header', h + 'px');
    list.style.setProperty('--ap-nav', jump.getBoundingClientRect().height + 'px');
  };
  setOffsets();
  window.addEventListener('resize', setOffsets);
  window.addEventListener('load', setOffsets);

  // Scroll-spy.
  let current = null, ticking = false;
  const update = () => {
    ticking = false;
    const line = (header ? header.getBoundingClientRect().height : 74) + jump.getBoundingClientRect().height + 48;
    const box = list.getBoundingClientRect();
    let id = null;
    if (box.top < line && box.bottom > line) {
      groups.forEach(g => { if (g.getBoundingClientRect().top <= line) id = g.id; });
    }
    const hh = header ? header.getBoundingClientRect().height : 74;
    jump.classList.toggle('is-stuck', jump.getBoundingClientRect().top <= hh + 1 && box.bottom > line);
    if (id === current) return;
    current = id;
    links.forEach(a => {
      const on = id && a.getAttribute('href') === '#' + id;
      a.classList.toggle('is-active', !!on);
      if (on) {
        a.setAttribute('aria-current', 'true');
        // On narrow screens the bar scrolls sideways: keep the active item visible.
        if (jump.scrollWidth > jump.clientWidth) {
          jump.scrollTo({ left: a.offsetLeft - (jump.clientWidth - a.offsetWidth) / 2, behavior: 'smooth' });
        }
      } else {
        a.removeAttribute('aria-current');
      }
    });
  };
  window.addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  }, { passive: true });
  update();

  // Collapsing a long group while looking at its end: bring its title back into view.
  list.querySelectorAll('[data-ap60-more]').forEach(btn => {
    btn.addEventListener('click', () => {
      const group = btn.closest('.ap60-reference-group');
      if (!group.classList.contains('is-open') && group.getBoundingClientRect().top < 0) {
        group.scrollIntoView({ block: 'start' });
      }
    });
  });
})();
