const esc = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[char]);
const list = items => items.map(item => `<li>${esc(item)}</li>`).join('');
const rows = items => items.map(([label, value]) => `<div class="c8d-fact"><dt>${esc(label)}</dt><dd>${esc(value)}</dd></div>`).join('');
const panel = (title, body) => `<article class="c8d-panel"><h3>${esc(title)}</h3><p>${esc(body)}</p></article>`;
const table = (head, body) => `<div class="c8d-table-scroll"><table class="c8d-table"><thead><tr>${head.map(cell => `<th scope="col">${esc(cell)}</th>`).join('')}</tr></thead><tbody>${body.map(row => `<tr>${row.map(cell => `<td>${esc(cell)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`;

const details = {
  'sz20-on-load-oil-immersed-transformer': {
    eyebrow: 'On-load tap changing · oil-immersed distribution',
    summary: 'The SZ20 series combines an on-load tap changer with a 6–11 kV / 0.4 kV distribution transformer. The published table covers 200–2,500 kVA and identifies losses, no-load current and short-circuit impedance by capacity.',
    badges: ['200–2,500 kVA', '6–11 / 0.4 kV', '±4 × 2.5% taps'],
    facts: [['Rated capacity', '200–2,500 kVA'], ['High-voltage options', '6 / 6.3 / 10 / 10.5 / 11 kV'], ['Low voltage', '0.4 kV'], ['HV tap range', '±4 × 2.5%'], ['Vector group', 'Yyn0 or Dyn11'], ['Tap changing', 'On-load']],
    ratingTitle: 'SZ20 published series parameters',
    ratingIntro: 'Select the capacity first, then compare the associated no-load loss, load loss, no-load current and short-circuit impedance.',
    ratingTable: true,
    engineering: [
      ['On-load voltage regulation', 'The tap changer adjusts the high-voltage winding ratio without interrupting the connected load. Specify the required regulation range, control method and network voltage profile.'],
      ['Loss and impedance coordination', 'The catalog publishes separate loss and impedance values for each rated capacity. Check these against the project efficiency target, available fault level and protection settings.'],
      ['Controls and accessories', 'The source describes an optional intelligent control arrangement. Define monitoring, alarms, communications and accessory requirements in the approved project schedule.']
    ],
    applications: ['Distribution feeders with changing supply voltage', 'Industrial and mining distribution systems', 'Replacement projects requiring on-load regulation'],
    inquiry: ['Capacity and HV/LV voltage', 'Tap range and automatic voltage control requirements', 'Loss, impedance and accessory requirements'],
    source: 'Tianyu Electric Integrated Catalog, 2026-05-19, printed pp. 13–14.'
  },
  'oil-immersed-split-winding-transformer': {
    eyebrow: 'Split low-voltage windings · oil-immersed power',
    summary: 'A split-winding transformer divides the low-voltage winding into separately connected branches with weak magnetic coupling. The arrangement is used where large auxiliary or industrial loads require two output circuits and short-circuit current coordination.',
    badges: ['Two LV branches', 'Radial or axial split', 'Project engineered'],
    facts: [['Winding system', 'One HV winding; split LV branches'], ['Branch connection', 'No direct electrical connection between LV branches'], ['Split arrangements', 'Radial or axial'], ['Operating arrangements', 'Through, half-through or split']],
    ratingTitle: 'Published 110 kV contract example',
    ratingIntro: 'The catalog describes a specific SZ-50000/110 transformer. These figures illustrate one engineered design and are not fixed ratings for the complete product family.',
    example: [['Example model', 'SZ-50000/110'], ['Rated capacity', '50,000 kVA at 110 kV'], ['Voltage ratio', '110 / 6.3 / 6.3 kV'], ['LV branches', 'Two; up to 30,000 kVA per branch'], ['Vector group', 'YNd11d11'], ['Through impedance', '10.5%'], ['Half-through impedance', '19%'], ['Branch deviation', '≤ ±5%'], ['Split coefficient', '≥ 3.4']],
    engineering: [
      ['Branch and fault coordination', 'The separately connected branches help contain the effect of a fault on the other branch. The final impedance and protection study must reflect the actual network.'],
      ['Winding geometry', 'The source describes radial and axial splitting. The selected arrangement depends on capacity, physical layout and the required impedance relationship.'],
      ['Operating modes', 'The catalog identifies through, half-through and split operation. Specify expected loading on each branch and contingency operation before design approval.']
    ],
    applications: ['Large substation auxiliary power systems', 'Industrial plants with two separately fed LV branches', 'Projects requiring defined branch impedances'],
    inquiry: ['HV and both LV voltages', 'Total and per-branch capacity', 'Fault level, impedance targets and operating modes'],
    source: 'Tianyu Electric Integrated Catalog, 2026-05-19, printed pp. 15–16.'
  },
  'intelligent-low-noise-dry-type-transformer': {
    eyebrow: 'Dry-type distribution · intelligent monitoring',
    summary: 'This configuration pairs a dry-type transformer with an intelligent terminal for operating-state monitoring. The English catalog describes power-quality, temperature, loss and energy-use data, together with alarms, storage, remote transmission and fan control.',
    badges: ['Dry-type platform', 'Condition monitoring', 'Model-specific rating'],
    facts: [['Product configuration', 'Dry-type transformer with intelligent terminal'], ['Measured information', 'Power quality, temperature, losses and energy use'], ['Terminal functions', 'Alarms, storage and remote transmission'], ['Auxiliary control', 'Fan control and life-status monitoring']],
    ratingTitle: 'Configuration and rating basis',
    ratingIntro: 'The catalog does not publish a separate capacity-and-loss table for this intelligent configuration. Electrical ratings are confirmed from the selected dry-type transformer model.',
    familyReference: [['Family voltage classes', '35 / 20 / 10 kV HV; 0.4 / 0.69 / 0.8 kV LV'], ['Frequency', '50 / 60 Hz'], ['Vector groups listed', 'Dyn11 / Yyn0 / Yd11'], ['Insulation class', 'F or higher']],
    referenceCaveat: 'Family-level dry-type catalog reference only. The intelligent low-noise model must be selected and approved separately; acoustic data, dimensions and guaranteed losses are not published for this configuration.',
    engineering: [
      ['Electrical platform', 'Select the dry-type transformer by rated capacity, voltage ratio, vector group, impedance and site conditions before specifying the monitoring package.'],
      ['Monitoring architecture', 'Define the required measurements, alarm thresholds, storage and communications interface for integration with the site control system.'],
      ['Noise and thermal control', 'Request the guaranteed sound level and temperature-rise data for the selected model. Confirm fan-control logic and ventilation provisions for the room.']
    ],
    applications: ['Indoor distribution requiring remote status', 'Industrial power rooms with centralized monitoring', 'Facilities that need temperature and fan supervision'],
    inquiry: ['Selected dry-type model and electrical ratings', 'Required monitoring points and communications protocol', 'Sound-level limit, ambient temperature and ventilation'],
    source: 'Tianyu Electric English Catalog, printed pp. 14–17; 2026-05-19 integrated catalog, printed pp. 5–6.'
  },
  'zbs-rectifier-transformer': {
    eyebrow: 'Industrial rectifier supply · converter duty',
    summary: 'ZBS / ZBSCB rectifier transformers are configured for converter supply. The catalog describes dry-type and oil-immersed options and calls for the design to account for rectifier overload, harmonic heating and the required phase or winding scheme.',
    badges: ['Converter duty', 'Dry or oil-immersed options', 'Scheme-specific rating'],
    facts: [['Primary duty', 'AC supply to rectifier equipment'], ['Construction options', 'Dry type or oil immersed by design'], ['Design inputs', 'Converter scheme, harmonics and overload'], ['Winding features described', 'Grounded HV/LV screen; LV foil winding']],
    ratingTitle: 'Published rectifier project example',
    ratingIntro: 'The catalog gives the following ZS-8000/10-0.66 oil-immersed example. It is a reference configuration, not a common rating for every ZBS / ZBSCB variant.',
    example: [['Example model', 'ZS-8000/10-0.66'], ['Rated capacity', '8,000 / 4,000 / 4,000 kVA'], ['Rated voltage', '10 / 0.66 / 0.66 kV'], ['Rated current', '461.9 / 3,499 A (as printed)'], ['Vector group', 'Dy11d0 (as printed)'], ['Cooling', 'ONAN'], ['Phases / frequency', '3 / 50 Hz']],
    engineering: [
      ['Converter interface', 'Provide the rectifier topology, pulse number, AC input and DC output duty so the winding and phase relationship can be designed together with the converter.'],
      ['Thermal duty', 'Specify harmonic spectrum, operating cycle and overload profile. Converter currents affect winding heating and therefore the final thermal design.'],
      ['Electrical separation', 'The catalog describes an earthed screen between HV and LV windings and low-voltage foil construction for equipment protection and short-circuit duty. Confirm these requirements in the project specification.']
    ],
    applications: ['Electrolysis and electroplating supplies', 'Industrial DC drives', 'Charging and other converter-fed industrial systems'],
    inquiry: ['Rectifier topology and pulse number', 'AC voltages, DC output and load cycle', 'Harmonic spectrum, overload and cooling requirements'],
    source: 'Tianyu Electric Integrated Catalog, 2026-05-19, printed pp. 7–8.'
  }
};

export function renderSupplementalProductDetail(product, sz20Rows) {
  const d = details[product.slug];
  if (!d) throw new Error(`No technical detail for ${product.slug}`);
  const specTable = d.ratingTable ? table(['Capacity (kVA)', 'No-load loss (W)', 'Load loss (W)', 'No-load current (%)', 'Short-circuit impedance (%)'], sz20Rows) : '';
  const example = d.example ? `<p class="c8d-scope">Contract example · values vary with the approved project design</p><dl class="c8d-facts c8d-example">${rows(d.example)}</dl>` : '';
  const familyReference = d.familyReference ? `<p class="c8d-scope">Dry-type family reference · not a guaranteed intelligent-model datasheet</p><dl class="c8d-facts">${rows(d.familyReference)}</dl><p class="c8d-caveat">${esc(d.referenceCaveat)}</p>` : '';
  return `<main class="c8d-main"><section class="v3p-hero c8d-hero"><div class="v3p-hero-copy"><div class="v3p-breadcrumb"><a href="../../products.html">Products</a><span>/</span><a href="../${esc(product.familyHref)}/index.html">${esc(product.family)}</a><span>/</span><span>${esc(product.title)}</span></div><p class="v3p-kicker">${esc(d.eyebrow)}</p><h1>${esc(product.title)}</h1><p>${esc(d.summary)}</p><div class="v3p-hero-proof">${d.badges.map(b => `<span>${esc(b)}</span>`).join('')}</div><div class="ty-system__detail-hero-actions"><button class="ty-system__button primary" type="button" data-quote-open>Request a Quote</button><a class="ty-system__button" href="#ratings">Technical data</a></div></div><div class="v3p-hero-media"><img src="../../assets/media/${esc(product.image)}" alt="${esc(product.title)}"></div></section><nav class="ty-system__detail-jump" aria-label="Product sections"><div class="ty-system__detail-jump-inner"><a href="#ratings">Ratings</a><a href="#engineering">Engineering</a><a href="#applications">Applications</a><a href="#documents">Catalog basis</a><a href="#contact-rfq">Inquiry</a></div></nav><section class="v3p-section c8d-section" id="ratings"><div class="v3p-shell"><p class="v3p-kicker">Technical data</p><h2 class="v3p-title">${esc(d.ratingTitle)}</h2><p class="c8d-intro">${esc(d.ratingIntro)}</p>${specTable ? `<dl class="c8d-facts">${rows(d.facts)}</dl><p class="c8d-table-help">On small screens, swipe horizontally to inspect all table columns.</p>${specTable}<p class="c8d-caveat">The catalog prints two load-loss figures at 200, 400 and 500 kVA without defining their individual conditions. Both are retained as published; confirm the selected guarantee before ordering.</p>` : `<dl class="c8d-facts">${rows(d.facts)}</dl>${example}${familyReference}`}</div></section><section class="v3p-section v3p-soft c8d-section" id="engineering"><div class="v3p-shell"><p class="v3p-kicker">Engineering considerations</p><h2 class="v3p-title">Design and selection</h2><div class="c8d-panel-grid">${d.engineering.map(([title, body]) => panel(title, body)).join('')}</div></div></section><section class="v3p-section c8d-section" id="applications"><div class="v3p-shell c8d-two-col"><div><p class="v3p-kicker">Applications</p><h2 class="v3p-title">Where it is specified</h2><ul class="c8d-list">${list(d.applications)}</ul></div><div class="c8d-inquiry"><h3>Information for model selection</h3><ul class="c8d-list">${list(d.inquiry)}</ul></div></div></section><section class="v3p-section v3p-soft c8d-section" id="documents"><div class="v3p-shell c8d-document"><div><p class="v3p-kicker">Catalog basis</p><h2 class="v3p-title">Reference and project documents</h2><p>Catalog reference: ${esc(d.source)}</p><p>For an order, request the selected model datasheet, guaranteed performance schedule and approved drawings.</p></div><a class="ty-system__button" href="../../resources.html">Certificates &amp; reports</a></div></section><section class="v3p-cta" id="contact-rfq"><div><p class="v3p-kicker">Technical inquiry</p><h2>Discuss your operating requirements</h2><p>Send the electrical schedule, site conditions and applicable standards for model selection.</p></div><button class="btn btn-primary" type="button" data-quote-open>Request a Quote</button></section></main>`;
}
