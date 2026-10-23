(() => {
  const form = document.querySelector('main .quote-form');
  if (!form) return;
  const url = new URL(location.href);
  const requestType = url.searchParams.get('requestType');
  const reference = (url.searchParams.get('reference') || '').slice(0, 160);
  // Only published project identifiers may produce a return link.
  const projectReferences = {
    'brazil-cemig-155mw-pv': 'CEMIG 155 MW photovoltaic project in Brazil',
    'drc-cmoc-mining-solar': '9 MVA substations for a mining energy project in the DRC',
    'malaysia-esc-steel-132kv': '132 kV substation for the steel industry in Malaysia',
    'nigeria-atlantic-132kv': 'Atlantic Industrial Park 132 kV Substation',
    'pakistan-bcl-hattar-cement': 'BCL Hattar Line 2 7200 TPD Cement Plant',
    'uae-methanol-mobile-substation': 'Mobile substation export project for the UAE',
    'vietnam-long-son-cement': 'Long Son Company Cement Grinding Project',
    'zambia-sunshare-nambala-solar': 'Sunshare Nambala 100 MW Solar Project'
  };
  const projectTitle = Object.hasOwn(projectReferences, reference) ? projectReferences[reference] : '';
  const select = form.querySelector('select[name="requestContext"]');
  if (!select) {
    if (requestType || reference) {
      let hidden = form.querySelector('[name="requestContext"]');
      if (!hidden) { hidden = document.createElement('input'); hidden.type = 'hidden'; hidden.name = 'requestContext'; form.append(hidden); }
      hidden.value = [requestType, reference].filter(Boolean).join(' · ').slice(0, 1000);
    }
    return;
  }
  const main = form.closest('main');
  const needs = form.querySelector('[data-contact-needs]');
  const targets = {
    title: main.querySelector('h1'), lead: main.querySelector('.pd-lead'),
    legend: needs.querySelector('legend'), summary: needs.querySelector('[data-contact-summary]'),
    attachment: needs.querySelector('[data-contact-attachment]'), help: needs.querySelector('.rfq-help:not([data-contact-reference])'),
    sideTitle: main.querySelector('.pg-contact-side > h2'),
    sideHelp: main.querySelector('.pg-contact-side > .contact-guidance')
  };
  const defaults = Object.fromEntries(Object.entries(targets).map(([key, node]) => [key, node.textContent]));
  const list = main.querySelector('.pg-ticks');
  const defaultItems = [...list.children].map(node => node.textContent);
  const message = form.elements.namedItem('message');
  const placeholder = message.placeholder;
  const modes = {
    'Service support': {
      title: 'Get support for your equipment', lead: 'Tell us which equipment needs attention, where it is installed and what support you need.',
      legend: 'Your service request', summary: 'Equipment, site and support needed', attachment: 'Nameplate photo, alarm record or site document',
      help: 'Include the model, serial number and site contact if available. Attach one PDF, Word, Excel, drawing or image, up to 8 MB.',
      sideTitle: 'What helps the service team', sideHelp: 'For an immediate safety concern, follow site emergency procedures and contact qualified on-site personnel. Do not wait for a web-form response.',
      items: ['Equipment model and serial number', 'Site location and on-site contact', 'Commissioning, maintenance or training needs', 'Symptoms, alarms and when they started', 'Relevant photos or records, where safe to obtain'],
      placeholder: 'Equipment / serial number:\nSite and contact:\nSupport needed or symptoms:\nPreferred coordination window:'
    },
    'Spare parts': {
      title: 'Find the right replacement part', lead: 'Share the equipment identification and part details so the technical team can check the matching requirement.',
      legend: 'Your spare-part request', summary: 'Equipment and part required', attachment: 'Nameplate or part photo', sideTitle: 'What helps identify the part',
      items: ['Equipment model and serial number', 'Part name, marking or drawing reference', 'Clear photos of the part and nameplate', 'Quantity and delivery destination', 'Required date or maintenance window'],
      placeholder: 'Equipment / serial number:\nPart and quantity:\nDelivery destination:\nRequired date:'
    },
    'Project documentation': {
      title: 'Request project documentation', lead: 'Identify the equipment or project and tell us which documents your team needs.',
      legend: 'Your document request', summary: 'Project and documents required', attachment: 'Document list or project reference', sideTitle: 'What helps locate the documents',
      items: ['Project or order reference', 'Equipment model and serial number, if available', 'Drawing, manual or test document required', 'Language and revision requirements', 'Purpose and required date'],
      placeholder: 'Project / order reference:\nEquipment:\nDocuments and revision required:\nRequired date:'
    },
    'Technical consultation': {
      title: 'Discuss a technical requirement', lead: 'Share your equipment application, technical question and any relevant ratings or drawings.',
      legend: 'Your technical question', summary: 'Application and technical question',
      placeholder: 'Application:\nEquipment or ratings:\nTechnical question:\nRelevant standard or document:'
    }
  };
  if (projectTitle) {
    modes['Project inquiry'] = {
      title: 'Plan a similar project',
      lead: 'Use the project reference as a starting point. Tell us your own application, electrical ratings and site requirements.',
      legend: 'Your project requirements', summary: 'Application, ratings and destination',
      sideTitle: 'What helps match your project',
      items: ['Application and project location', 'Required capacity and winding voltages', 'Frequency and applicable standards', 'Site environment and installation constraints', 'Equipment quantity and project schedule', 'Specification or single-line diagram, if available'],
      placeholder: 'Application and destination:\nRequired capacity / winding voltages:\nSite conditions:\nQuantity and project schedule:'
    };
  }
  // A restored draft takes precedence over an entry-link hint; never replace user text.
  const restored = form.querySelector('.rfq-draft input[type="checkbox"]')?.checked;
  if (!restored && [...select.options].some(option => option.value === requestType)) select.value = requestType;
  if (!select.value) select.value = 'Project inquiry';
  const referenceNote = form.querySelector('[data-contact-reference]');
  if (reference) {
    const label = document.createElement('strong');
    label.textContent = `Project reference: ${projectTitle || reference}`;
    referenceNote.replaceChildren(label);
    if (projectTitle) {
      const link = document.createElement('a');
      link.className = 'pd-link';
      link.href = new URL(`projects/${reference}.html`, location.href).href;
      link.textContent = 'View project (new tab)';
      link.target = '_blank';
      link.rel = 'noopener';
      referenceNote.append(link);
    }
    if (restored) {
      const hint = document.createElement('span');
      hint.textContent = 'Your saved entries have been kept. Check that they match this reference.';
      referenceNote.append(hint);
    }
    referenceNote.hidden = false;
  }
  const originalSideHelp = targets.sideHelp.cloneNode(true);
  function applyContext() {
    const mode = modes[select.value] || {};
    for (const [key, node] of Object.entries(targets)) {
      if (key === 'sideHelp' && !mode[key]) node.replaceChildren(...[...originalSideHelp.childNodes].map(child => child.cloneNode(true)));
      else node.textContent = mode[key] || defaults[key];
    }
    list.replaceChildren(...(mode.items || defaultItems).map(text => { const li = document.createElement('li'); li.textContent = text; return li; }));
    message.placeholder = mode.placeholder || placeholder;
    form.querySelector('.rfq-upload-button')?.setAttribute('aria-label', `Choose file: ${targets.attachment.textContent}`);
  }
  select.addEventListener('change', applyContext);
  form.addEventListener('reset', () => setTimeout(applyContext, 0));
  applyContext();
})();
