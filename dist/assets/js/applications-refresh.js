/* Reference list: reveal the collapsed rows of one application group. */
document.querySelectorAll('[data-ap60-more]').forEach(btn => {
  btn.addEventListener('click', () => {
    const group = btn.closest('tbody');
    const open = group.classList.toggle('is-open');
    btn.setAttribute('aria-expanded', String(open));
    const n = group.querySelectorAll('tr:not(.ap60-group-head):not(.ap60-more-row)').length;
    const name = group.querySelector('th').firstChild.textContent.toLowerCase();
    btn.textContent = open ? 'Show fewer' : `Show all ${n} ${name} references`;
  });
});
