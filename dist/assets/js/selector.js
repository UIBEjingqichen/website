/* Product selector: matches project requirements against the published range of every series,
   explains each result, compares up to three series, prints a spec sheet and pre-fills the inquiry.
   Data: database/selector-products.json (copied from the product pages). */
(() => {
  const root = document.querySelector('[data-selector]');
  if (!root) return;
  const $ = (s, el = root) => el.querySelector(s);
  const $$ = (s, el = root) => [...el.querySelectorAll(s)];
  const form = $('[data-sel-form]');
  const list = $('[data-sel-list]');
  const outside = $('[data-sel-outside]');
  const outsideList = $('[data-sel-outside-list]');
  const heading = $('[data-sel-heading]');
  const summary = $('[data-sel-summary]');
  const facets = $('[data-sel-facets]');
  const tray = document.querySelector('[data-sel-tray]');
  const compare = document.querySelector('[data-sel-compare]');
  const MAX_COMPARE = 3;
  const FAMILY = { power: 'Power transformer', distribution: 'Distribution transformer', substation: 'Prefabricated substation' };
  const FAMILY_INQUIRY = { power: 'Power Transformers', distribution: 'Distribution Transformers', substation: 'Prefabricated Substations' };
  const SPEC_ORDER = ['Rated power', 'High voltage', 'Low voltage', 'Frequency', 'Insulation', 'Tap changer', 'Tapping range', 'Vector group', 'Impedance', 'Enclosure', 'Efficiency / standard'];
  const STATUS = {
    match: { rank: 0, label: 'Matches your inputs' },
    confirm: { rank: 1, label: 'Likely fit · confirm details' },
    outside: { rank: 2, label: 'Outside published range' },
    browse: { rank: 0, label: '' }
  };
  let DATA = null;
  let APPS = {};
  let family = 'all';
  const picked = new Set();

  const esc = s => String(s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const num = v => { const n = parseFloat(String(v).replace(/,/g, '')); return Number.isFinite(n) && n > 0 ? n : null; };
  const fmtKva = k => k >= 1000 ? `${(+(k / 1000).toFixed(k % 1000 ? 2 : 0)).toLocaleString('en')} MVA` : `${Math.round(k).toLocaleString('en')} kVA`;
  const fmtKv = v => `${+v.toFixed(2)} kV`;
  const rangeText = (r, fmt) => r[0] == null ? `up to ${fmt(r[1])}` : r[0] === r[1] ? fmt(r[0]) : `${fmt(r[0])}–${fmt(r[1])}`;

  /* ---------- requirements <-> form <-> URL ---------- */
  function readForm() {
    const d = new FormData(form);
    const power = num(d.get('power'));
    return {
      kva: power ? power * (d.get('unit') === 'MVA' ? 1000 : 1) : null,
      power: power, unit: d.get('unit') || 'kVA',
      kv: num(d.get('kv')),
      hz: d.get('hz') || '', ins: d.get('ins') || '', inst: d.get('inst') || '', tap: d.get('tap') || '', app: d.get('app') || ''
    };
  }
  function writeForm(q) {
    const set = (name, value) => { const el = form.elements.namedItem(name); if (el) el.value = value ?? ''; };
    set('power', q.power ?? ''); set('unit', q.unit || 'kVA'); set('kv', q.kv ?? '');
    ['hz', 'ins', 'inst', 'tap', 'app'].forEach(k => set(k, q[k]));
  }
  function fromURL() {
    const p = new URLSearchParams(location.search);
    const q = { power: num(p.get('power')), unit: p.get('unit') === 'MVA' ? 'MVA' : 'kVA', kv: num(p.get('kv')) };
    for (const k of ['hz', 'ins', 'inst', 'tap', 'app']) q[k] = p.get(k) || '';
    (p.get('compare') || '').split(',').filter(Boolean).slice(0, MAX_COMPARE).forEach(id => picked.add(id));
    family = ['power', 'distribution', 'substation'].includes(p.get('family')) ? p.get('family') : 'all';
    return q;
  }
  function shareURL(q = readForm()) {
    const p = new URLSearchParams();
    if (q.power) { p.set('power', q.power); p.set('unit', q.unit); }
    if (q.kv) p.set('kv', q.kv);
    for (const k of ['hz', 'ins', 'inst', 'tap', 'app']) if (q[k]) p.set(k, q[k]);
    if (family !== 'all') p.set('family', family);
    if (picked.size) p.set('compare', [...picked].join(','));
    const s = p.toString();
    return location.pathname + (s ? `?${s}` : '');
  }

  /* ---------- matching ---------- */
  function evaluate(p, q) {
    const c = [];
    if (q.kva) {
      if (!p.kva) c.push({ key: 'Rated power', status: 'check', text: `${fmtKva(q.kva)}: rating set per project` });
      else {
        const [lo, hi] = p.kva; const ok = (lo == null || q.kva >= lo) && q.kva <= hi;
        c.push({ key: 'Rated power', status: ok ? 'ok' : 'no', text: `${fmtKva(q.kva)} ${ok ? 'within' : 'outside'} ${rangeText(p.kva, fmtKva)}` });
      }
    }
    if (q.kv) {
      if (!p.hvSystem) c.push({ key: 'High voltage', status: 'check', text: `${fmtKv(q.kv)}: voltage not published` });
      else {
        const tol = p.hvClass ? 0.1 : 0.02; const lo = p.hvSystem[0] ?? 0, hi = p.hvSystem[1];
        const ok = q.kv >= lo * (1 - tol) && q.kv <= hi * (1 + tol);
        const shown = p.hvSystem[0] == null ? `≤ ${fmtKv(hi)}` : lo === hi ? `${fmtKv(hi)} class` : `${fmtKv(lo)}–${fmtKv(hi)}`;
        c.push({ key: 'High voltage', status: ok ? 'ok' : 'no', text: `${fmtKv(q.kv)} ${ok ? 'within' : 'outside'} ${shown}` });
      }
    }
    if (q.ins) {
      const ok = p.insulation.includes(q.ins);
      c.push({ key: 'Insulation', status: ok ? 'ok' : 'no', text: ok ? (q.ins === 'oil' ? 'Oil-immersed available' : 'Dry-type available') : (p.insulation[0] === 'oil' ? 'Oil-immersed only' : 'Dry-type only') });
    }
    if (q.app) {
      const ok = p.apps.includes(q.app);
      c.push({ key: 'Application', status: ok ? 'ok' : 'no', text: ok ? `Used for ${APPS[q.app].toLowerCase()}` : `Not listed for ${APPS[q.app].toLowerCase()}` });
    }
    if (q.inst) {
      const ok = p.installation.includes(q.inst);
      c.push({ key: 'Installation', status: ok ? 'ok' : 'check', text: ok ? `${q.inst === 'indoor' ? 'Indoor' : 'Outdoor'} installation` : p.installation.length ? `Published for ${p.installation.join(' / ')} use; enclosure to confirm` : 'Installation per project' });
    }
    if (q.hz) {
      const hz = +q.hz; const ok = p.frequency?.includes(hz);
      c.push({ key: 'Frequency', status: ok ? 'ok' : 'check', text: ok ? `${hz} Hz published` : p.frequency ? `${p.frequency.join(' / ')} Hz published; ${hz} Hz on request` : `${hz} Hz to confirm` });
    }
    if (q.tap) {
      const ok = p.tap?.includes(q.tap);
      const name = q.tap === 'oltc' ? 'On-load tap changer' : 'Off-circuit tap changer';
      c.push({ key: 'Tap changer', status: ok ? 'ok' : 'check', text: ok ? `${name} available` : `${name} to confirm` });
    }
    const status = !c.length ? 'browse' : c.some(x => x.status === 'no') ? 'outside' : c.some(x => x.status === 'check') ? 'confirm' : 'match';
    // tightness: how closely the published maximum brackets the requirement (smaller is better)
    const tight = (q.kva && p.kva ? Math.abs(Math.log10(p.kva[1] / q.kva)) : 2) + (q.kv && p.hvSystem ? Math.abs(Math.log10((p.hvSystem[1] || 1) / q.kv)) : 1);
    return { p, c, status, ok: c.filter(x => x.status === 'ok').length, checks: c.filter(x => x.status === 'check').length, tight };
  }

  /* ---------- rendering ---------- */
  const KVA_AXIS = [10, 500000], KV_AXIS = [0.4, 250];
  const pos = (v, [a, b]) => Math.max(0, Math.min(100, (Math.log10(v) - Math.log10(a)) / (Math.log10(b) - Math.log10(a)) * 100));
  function gauge(label, range, axis, value, fmt) {
    if (!range) return `<div class="sel-gauge is-empty"><span class="sel-gauge-label">${label}</span><span class="sel-gauge-track"></span><span class="sel-gauge-value">Per project</span></div>`;
    const lo = range[0] ?? axis[0], hi = range[1];
    const a = pos(lo, axis), b = pos(hi, axis);
    const marker = value ? `<i class="sel-gauge-marker" style="left:${pos(value, axis).toFixed(1)}%" title="Your input: ${fmt(value)}"></i>` : '';
    return `<div class="sel-gauge"><span class="sel-gauge-label">${label}</span><span class="sel-gauge-track"><b style="left:${a.toFixed(1)}%;width:${Math.max(1.5, b - a).toFixed(1)}%"></b>${marker}</span><span class="sel-gauge-value">${rangeText(range, fmt)}</span></div>`;
  }
  function card(r, q) {
    const p = r.p; const on = picked.has(p.id);
    const crit = r.c.length ? `<ul class="sel-criteria">${r.c.map(x => `<li class="is-${x.status}"><span class="sel-mark" aria-hidden="true"></span><span><strong>${esc(x.key)}</strong> ${esc(x.text)}</span><span class="sel-sr">${x.status === 'ok' ? 'meets' : x.status === 'no' ? 'does not meet' : 'to confirm'}</span></li>`).join('')}</ul>` : '';
    const badge = r.status === 'browse' ? '' : `<p class="sel-badge is-${r.status}">${STATUS[r.status].label}</p>`;
    return `<article class="sel-card is-${r.status}" data-id="${p.id}">
      <a class="sel-card-media" href="${esc(p.href)}" tabindex="-1" aria-hidden="true"><img src="../${esc(p.image)}" alt="" loading="lazy" decoding="async"></a>
      <div class="sel-card-body">
        <p class="sel-card-meta">${FAMILY[p.family]} · ${esc(p.series)}</p>
        <h3><a href="${esc(p.href)}">${esc(p.name)}</a></h3>
        ${badge}
        <div class="sel-gauges">${gauge('Power', p.kva, KVA_AXIS, q.kva, fmtKva)}${gauge('HV', p.hvSystem, KV_AXIS, q.kv, fmtKv)}</div>
        ${crit}
        <div class="sel-card-actions">
          <button type="button" class="sel-compare-toggle" data-compare="${p.id}" aria-pressed="${on}">${on ? 'Added to compare' : 'Compare'}</button>
          <a class="sel-card-link" href="${esc(p.href)}">Product details</a>
        </div>
      </div>
    </article>`;
  }

  let lastResults = [];
  function render() {
    const q = readForm();
    const results = DATA.products.map(p => evaluate(p, q)).sort((a, b) =>
      STATUS[a.status].rank - STATUS[b.status].rank || b.ok - a.ok || a.checks - b.checks || a.tight - b.tight);
    lastResults = results;
    const counts = { all: 0, power: 0, distribution: 0, substation: 0 };
    results.filter(r => r.status !== 'outside').forEach(r => { counts.all++; counts[r.p.family]++; });
    $$('[data-family]', facets).forEach(b => {
      const f = b.dataset.family; b.querySelector('span').textContent = counts[f];
      b.setAttribute('aria-pressed', String(f === family)); b.disabled = !counts[f] && f !== 'all';
    });
    if (family !== 'all' && !counts[family]) { family = 'all'; $$('[data-family]', facets).forEach(b => b.setAttribute('aria-pressed', String(b.dataset.family === 'all'))); }
    const view = results.filter(r => family === 'all' || r.p.family === family);
    const inside = view.filter(r => r.status !== 'outside');
    const out = view.filter(r => r.status === 'outside');
    list.innerHTML = inside.map(r => card(r, q)).join('') || `<p class="sel-empty">No published series covers this combination. Engineering can still review a custom design — send the requirement with a quote request.</p>`;
    outsideList.innerHTML = out.map(r => card(r, q)).join('');
    outside.hidden = !out.length;
    outside.querySelector('[data-sel-outside-count]').textContent = out.length;
    const active = results[0]?.status !== 'browse';
    const matches = inside.filter(r => r.status === 'match').length;
    heading.textContent = !active ? `${inside.length} product series` : `${inside.length} series fit your inputs`;
    summary.textContent = !active ? 'Enter a rating or choose conditions to rank the catalogue.'
      : `${matches} match every input; ${inside.length - matches} need an engineering check. Ranked by fit, then by how closely the published range brackets your rating.`;
    history.replaceState(null, '', shareURL(q));
    renderTray();
    if (!compare.hidden) renderCompare();
  }

  /* ---------- compare ---------- */
  function renderTray() {
    tray.hidden = !picked.size;
    const items = [...picked].map(id => DATA.products.find(p => p.id === id)).filter(Boolean);
    tray.querySelector('[data-sel-tray-items]').innerHTML = items.map(p => `<li><span>${esc(p.name)}</span><button type="button" data-remove="${p.id}" aria-label="Remove ${esc(p.name)} from comparison">×</button></li>`).join('');
    tray.querySelector('[data-sel-tray-count]').textContent = `${picked.size} of ${MAX_COMPARE}`;
    tray.querySelector('[data-sel-open-compare]').disabled = picked.size < 1;
  }
  function shortlist() {
    const ids = picked.size ? [...picked] : lastResults.filter(r => r.status === 'match' || r.status === 'confirm').slice(0, MAX_COMPARE).map(r => r.p.id);
    return ids.map(id => lastResults.find(r => r.p.id === id)).filter(Boolean);
  }
  function specTable(rows, { diffOnly = false } = {}) {
    const labels = SPEC_ORDER.filter(l => rows.some(r => r.p.specs[l]));
    const body = labels.map(l => {
      const vals = rows.map(r => r.p.specs[l] || '—');
      const same = new Set(vals).size === 1;
      if (diffOnly && same && rows.length > 1) return '';
      return `<tr class="${same ? '' : 'is-diff'}"><th scope="row">${l}</th>${vals.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`;
    }).join('');
    const fit = rows.some(r => r.status !== 'browse') ? `<tr class="sel-fit-row"><th scope="row">Fit to your inputs</th>${rows.map(r => `<td><span class="sel-badge is-${r.status}">${STATUS[r.status].label || '—'}</span>${r.c.filter(x => x.status !== 'ok').map(x => `<small>${esc(x.key)}: ${esc(x.text)}</small>`).join('')}</td>`).join('')}</tr>` : '';
    return `<table class="sel-table"><thead><tr><th scope="col"><span class="sel-sr">Parameter</span></th>${rows.map(r => `<th scope="col"><small>${esc(r.p.series)}</small><a href="${esc(r.p.href)}">${esc(r.p.name)}</a></th>`).join('')}</tr></thead><tbody>${fit}${body}</tbody></table>`;
  }
  function renderCompare() {
    const rows = [...picked].map(id => lastResults.find(r => r.p.id === id)).filter(Boolean);
    const diffOnly = compare.querySelector('[data-sel-diff]').checked;
    compare.querySelector('[data-sel-compare-table]').innerHTML = rows.length ? specTable(rows, { diffOnly }) : '<p class="sel-empty">Add up to three series with “Compare”.</p>';
  }
  function toggle(id) {
    if (picked.has(id)) picked.delete(id);
    else if (picked.size >= MAX_COMPARE) { announce(`You can compare up to ${MAX_COMPARE} series. Remove one first.`); return; }
    else picked.add(id);
    $$(`[data-compare="${id}"]`).forEach(b => { const on = picked.has(id); b.setAttribute('aria-pressed', String(on)); b.textContent = on ? 'Added to compare' : 'Compare'; });
    if (!picked.size) compare.hidden = true;
    history.replaceState(null, '', shareURL());
    renderTray();
    if (!compare.hidden) renderCompare();
  }
  const live = root.querySelector('[data-sel-live]');
  const announce = t => { live.textContent = ''; requestAnimationFrame(() => { live.textContent = t; }); };

  /* ---------- print sheet ---------- */
  function requirementLines(q = readForm()) {
    return [
      q.kva && ['Rated power', fmtKva(q.kva)], q.kv && ['HV system voltage', fmtKv(q.kv)],
      q.hz && ['Frequency', `${q.hz} Hz`], q.ins && ['Insulation', q.ins === 'oil' ? 'Oil-immersed' : 'Dry-type'],
      q.inst && ['Installation', q.inst === 'indoor' ? 'Indoor' : 'Outdoor'], q.tap && ['Tap changer', q.tap === 'oltc' ? 'On-load (OLTC)' : 'Off-circuit (OCTC)'],
      q.app && ['Application', APPS[q.app]]
    ].filter(Boolean);
  }
  function printSheet() {
    const rows = shortlist();
    let sheet = document.querySelector('.sel-print');
    if (!sheet) { sheet = document.createElement('div'); sheet.className = 'sel-print'; document.body.append(sheet); }
    const req = requirementLines();
    const url = new URL(shareURL(), location.href).href;
    sheet.innerHTML = `<header><img src="../public/tianyu-brandmark-550.png" alt="" width="40" height="40"><div><strong>Tianyu Electric</strong><span>Transformer pre-selection sheet · ${new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</span></div></header>
      <h1>${rows.length ? rows.map(r => esc(r.p.name)).join(' · ') : 'Product selection'}</h1>
      <h2>Requirements entered</h2>
      ${req.length ? `<dl>${req.map(([k, v]) => `<div><dt>${k}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>` : '<p>No requirements entered; catalogue overview.</p>'}
      <h2>${picked.size ? 'Shortlisted series' : 'Best-matching series'}</h2>
      ${rows.length ? specTable(rows) : '<p>No series selected.</p>'}
      <p class="sel-print-note">Values are the published series ranges from tianyuelectric.com. Final ratings, losses, dimensions and test scope are confirmed by Tianyu engineering against the project specification.</p>
      <p class="sel-print-note">Reopen this selection: ${esc(url)} · Contact: sales@tianyuelectric.com</p>`;
    window.print();
  }

  /* ---------- inquiry pre-fill ---------- */
  function requestQuote() {
    const modalForm = document.querySelector('[data-quote-modal] .quote-form');
    const opener = document.querySelector('[data-sel-quote-opener]');
    if (!modalForm || !opener) { location.href = 'contact.html'; return; }
    const q = readForm(); const rows = shortlist();
    const fill = (name, value) => {
      const el = modalForm.elements.namedItem(name); if (!el || value == null || value === '') return;
      if (el.tagName === 'SELECT') { const opt = [...el.options].find(o => o.value === value || o.text === value); if (!opt) return; el.value = opt.value; } else el.value = value;
      el.dispatchEvent(new Event('input', { bubbles: true })); el.dispatchEvent(new Event('change', { bubbles: true }));
    };
    if (rows.length) {
      fill('product', FAMILY_INQUIRY[rows[0].p.family]);
      fill('model', rows.map(r => `${r.p.name} (${r.p.series})`).join('; '));
    }
    if (q.kva) fill('ratedPower', fmtKva(q.kva));
    if (q.kv) fill('hvVoltage', fmtKv(q.kv));
    if (q.hz) fill('frequency', `${q.hz} Hz`);
    if (q.inst) fill('installation', q.inst === 'indoor' ? 'Indoor' : 'Outdoor');
    if (q.tap) fill('tapChanger', q.tap === 'oltc' ? 'OLTC' : 'OCTC / off-circuit');
    const message = modalForm.elements.namedItem('message');
    if (message && !message.value.trim()) {
      const req = requirementLines(q).map(([k, v]) => `${k}: ${v}`).join('; ');
      fill('message', [`Product selector shortlist: ${rows.map(r => r.p.name).join('; ') || 'none selected'}.`, req && `Requirements: ${req}.`, `Selection link: ${new URL(shareURL(), location.href).href}`].filter(Boolean).join('\n'));
    }
    const details = modalForm.querySelector('details'); if (details && (q.kva || q.kv || q.hz || q.inst || q.tap)) details.open = true;
    opener.click();
  }

  /* ---------- wiring ---------- */
  form.addEventListener('input', render);
  form.addEventListener('change', render);
  form.addEventListener('submit', e => { e.preventDefault(); render(); list.closest('.sel-results').scrollIntoView({ behavior: 'smooth', block: 'start' }); });
  form.addEventListener('reset', () => setTimeout(() => { family = 'all'; render(); }));
  $$('[data-preset]').forEach(b => b.addEventListener('click', () => {
    const q = Object.fromEntries(new URLSearchParams(b.dataset.preset));
    writeForm({ power: q.power, unit: q.unit || 'kVA', kv: q.kv, hz: q.hz, ins: q.ins, inst: q.inst, tap: q.tap, app: q.app });
    family = 'all'; render(); announce(`${b.textContent.trim()} applied.`);
  }));
  facets.addEventListener('click', e => { const b = e.target.closest('[data-family]'); if (!b) return; family = b.dataset.family; render(); });
  root.addEventListener('click', e => { const b = e.target.closest('[data-compare]'); if (b) toggle(b.dataset.compare); });
  tray.addEventListener('click', e => {
    const r = e.target.closest('[data-remove]'); if (r) { toggle(r.dataset.remove); return; }
    if (e.target.closest('[data-sel-open-compare]')) { compare.hidden = false; renderCompare(); compare.scrollIntoView({ behavior: 'smooth', block: 'start' }); compare.querySelector('h2').focus({ preventScroll: true }); }
    if (e.target.closest('[data-sel-quote]')) requestQuote();
  });
  compare.addEventListener('click', e => {
    if (e.target.closest('[data-sel-print]')) printSheet();
    if (e.target.closest('[data-sel-quote]')) requestQuote();
    if (e.target.closest('[data-sel-close-compare]')) { compare.hidden = true; tray.querySelector('[data-sel-open-compare]').focus(); }
  });
  compare.querySelector('[data-sel-diff]').addEventListener('change', renderCompare);
  $('[data-sel-print-all]').addEventListener('click', printSheet);
  const copy = $('[data-sel-copy]');
  copy.addEventListener('click', async () => {
    const url = new URL(shareURL(), location.href).href;
    try { await navigator.clipboard.writeText(url); copy.textContent = 'Link copied'; announce('Selection link copied.'); }
    catch { window.prompt('Copy this link', url); }
    setTimeout(() => { copy.textContent = 'Copy link'; }, 2000);
  });

  const initial = fromURL();
  fetch('../database/selector-products.json', { cache: 'no-cache' })
    .then(r => { if (!r.ok) throw new Error(r.status); return r.json(); })
    .then(data => {
      DATA = data; APPS = data.applications;
      [...picked].forEach(id => { if (!DATA.products.some(p => p.id === id)) picked.delete(id); });
      writeForm(initial);
      root.classList.add('is-ready');
      render();
      if (picked.size && new URLSearchParams(location.search).has('compare')) { compare.hidden = false; renderCompare(); }
    })
    .catch(() => { list.innerHTML = '<p class="sel-empty">The product data could not be loaded. Please browse <a href="products.html">all products</a> or contact sales@tianyuelectric.com.</p>'; heading.textContent = 'Product data unavailable'; });
})();
