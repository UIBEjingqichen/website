/* Loaded only by secondary pages; preserves existing inquiry transport. */
(() => {
  if (!document.body.hasAttribute('data-review-refined')) return;
  const family = document.body.dataset.inquiryFamily;
  document.querySelectorAll('[data-quote-open]').forEach(button => {
    button.addEventListener('click', () => {
      const form = document.querySelector('[data-quote-modal] .quote-form');
      if (!form) return;
      const product = form.elements.namedItem('product');
      if (family && product && !product.value) product.value = family;
      const model = form.elements.namedItem('model');
      const title = document.querySelector('main h1')?.textContent.trim();
      const modelText = document.querySelector('main .pd-model')?.textContent.trim();
      const isFamily = !!document.querySelector('main.pd-hub');
      // A family is not a model. Keep a separate context note for these pages.
      if (isFamily && model && model.value === title) model.value = '';
      if (!isFamily && family && model && !model.value && title) {
        model.value = [title, modelText].filter(Boolean).join(' · ');
      }
      // Show already selected product context without making the visitor reopen details.
      const details = form.querySelector('details');
      const context = form.querySelector('[data-product-context]');
      if (context && family) {
        context.textContent = isFamily ? `Product family: ${product.value || family}.` : `Inquiry for ${model?.value || title}.`;
      }
      if (product?.value && !form.querySelector('[data-product-context]')) {
        const note = document.createElement('p');
        note.className = 'quote-context full'; note.dataset.productContext = '';
        note.textContent = `Inquiry for ${model?.value || product.value}. You can change the selection in optional details.`;
        details?.before(note);
      }
    });
  });

  const finder = document.querySelector('[data-product-finder]');
  if (!finder) return;
  const rows = [...document.querySelectorAll('main .pd-rows .pd-row')];
  const normalize = value => value.toLowerCase().replace(/[–—−]/g,'-').replace(/(\d)\s*(kv|mva|kva)\b/g,'$1 $2').replace(/\s+/g,' ').trim();
  function publishedVoltage(row) {
    const facts = [...row.querySelectorAll('.pd-row-facts > span')];
    const field = facts.find(fact => /voltage/i.test(fact.querySelector('em')?.textContent || ''));
    const source = field?.textContent || row.querySelector('.pd-row-main strong')?.textContent || '';
    const matches = [...normalize(source).matchAll(/(\d+(?:\.\d+)?)(?:\s*-\s*(\d+(?:\.\d+)?))?\s*kv/g)];
    const isUpperLimit = /≤|\band below\b|\bup to\b/i.test(source);
    return matches.map(match => [isUpperLimit ? 0 : Number(match[1]),Number(match[2] || match[1])]);
  }
  const indexed = rows.map(row => ({row, text:normalize(row.innerText), voltage:publishedVoltage(row), family:row.closest('section[id]')?.id || ''}));
  const search = finder.querySelector('[data-find-search]');
  const category = finder.querySelector('[data-find-family]');
  const application = finder.querySelector('[data-find-application]');
  const voltage = finder.querySelector('[data-find-voltage]');
  const comparisons = [...finder.querySelectorAll('[data-product-comparison]')];
  const terms = {wind:/wind/, solar:/photovoltaic|\bpv\b|solar|energy.storage/, industry:/industr|commercial|building|hospital|cement|electrolysis|rectifier|data cent/, temporary:/temporary|mobile|restoration/};
  const count = finder.querySelector('[data-find-count]');
  const empty = finder.querySelector('[data-find-empty]');
  const sections = [...new Set(rows.map(row => row.closest('section.pd-list')).filter(Boolean))];
  function update() {
    const query = normalize(search.value).split(' ').filter(Boolean);
    let matches = 0;
    indexed.forEach(({row,text,family,voltage:ranges}) => {
      const visible = (!category?.value || family === category.value)
        && query.every(token => text.includes(token))
        && (!voltage?.value || ranges.some(([min,max]) => Number(voltage.value) >= min && Number(voltage.value) <= max))
        && (!application.value || terms[application.value].test(text));
      row.hidden = !visible; if (visible) matches++;
    });
    const visibleLinks = new Set(rows.filter(row => !row.hidden).map(row => row.getAttribute('href')));
    comparisons.forEach(comparison => {
      const entries = [...comparison.querySelectorAll('[data-compare-href]')];
      entries.forEach(entry => { entry.hidden = !visibleLinks.has(entry.dataset.compareHref); });
      comparison.hidden = !entries.some(entry => !entry.hidden);
    });
    sections.forEach(section => { section.hidden = ![...section.querySelectorAll('.pd-row')].some(row => !row.hidden); });
    count.textContent = `${matches} of ${rows.length} products shown`;
    empty.hidden = matches !== 0;
  }
  search.addEventListener('input',update);
  category?.addEventListener('change',update);
  application.addEventListener('change',update);
  voltage?.addEventListener('change',update);
  finder.querySelector('[data-find-reset]').addEventListener('click', () => {
    search.value = ''; if (category) category.value = ''; if (voltage) voltage.value = ''; application.value = ''; update(); search.focus();
  });
  // Family jump links always reveal their full group, even after filtering.
  document.querySelectorAll('a[href^="#"]').forEach(link => {
    if (!sections.some(section => `#${section.id}` === link.getAttribute('href'))) return;
    link.addEventListener('click', () => {search.value=''; application.value=''; if(category)category.value=''; if(voltage)voltage.value=''; update();});
  });
  finder.hidden = false; update();
})();
