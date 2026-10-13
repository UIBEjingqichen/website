/* Report-only filtering and stable links. Does not run on the homepage. */
(() => {
  const panel = document.querySelector('[data-report-navigation]');
  if (!panel) return;
  const cards = [...document.querySelectorAll('[data-evidence-card]')];
  const selectors = {product:'[data-document-product]',type:'[data-document-type]',voltage:'[data-document-voltage]',issuer:'[data-document-issuer]'};
  const controls = Object.fromEntries(Object.entries(selectors).map(([key,selector]) => [key,panel.querySelector(selector)]));
  const search = panel.querySelector('[data-document-search]');
  const count = document.querySelector('[data-document-count]');
  const more = document.querySelector('[data-document-more]');
  const empty = document.querySelector('[data-document-empty]');
  const normalize = text => text.toLowerCase().replace(/\s+/g,' ').trim();
  let limit = 12;
  function filter() {
    let matched = 0, shown = 0;
    const query = normalize(search.value);
    cards.forEach(card => {
      const match = Object.entries(controls).every(([key,input]) => input.value === 'all' || (key === 'product' ? card.dataset[key].includes(input.value) : card.dataset[key] === input.value))
        && (!query || normalize(card.innerText).includes(query));
      if (match) matched++;
      card.hidden = !match || matched > limit;
      if (!card.hidden) shown++;
    });
    count.textContent = matched ? `Showing ${shown} of ${matched} matching reports` : 'No matching reports';
    more.hidden = matched <= limit;
    empty.hidden = matched !== 0;
  }
  function clear() {
    Object.values(controls).forEach(input => { input.value = 'all'; });
    search.value = ''; limit = 12;
    cards.forEach(card => card.classList.remove('report-target'));
    const url = new URL(location.href);
    if (url.hash.startsWith('#report-')) url.hash = '#certificates';
    url.searchParams.delete('report');
    history.replaceState(null,'',url);
    filter(); search.focus();
  }
  function locate() {
    const url = new URL(location.href);
    const reference = url.searchParams.get('report') || url.hash.slice(1);
    const target = cards.find(card => card.id === reference || card.id === `report-${reference}`);
    if (!target) return;
    Object.values(controls).forEach(input => { input.value = 'all'; });
    search.value = target.querySelector('h3').textContent.trim();
    limit = cards.length; filter();
    cards.forEach(card => card.classList.toggle('report-target',card === target));
    target.tabIndex = -1;
    requestAnimationFrame(() => { target.scrollIntoView({block:'start'}); target.focus({preventScroll:true}); });
  }
  const update = () => { limit = 12; cards.forEach(card => card.classList.remove('report-target')); filter(); };
  Object.values(controls).forEach(input => input.addEventListener('change',update));
  search.addEventListener('input',update);
  more.addEventListener('click',() => { limit += 12; filter(); });
  document.querySelectorAll('[data-document-clear]').forEach(button => button.addEventListener('click',clear));
  addEventListener('hashchange',locate);
  filter(); locate();
})();
