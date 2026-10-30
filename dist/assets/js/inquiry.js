/* Same-origin Pages Function submission; no browser email application required. */
(() => {
  const forms = [...document.querySelectorAll('.quote-form')];
  let configuration, turnstileScript;
  const config = () => configuration ||= fetch('/api/contact', { headers: { Accept: 'application/json' }, cache: 'no-store' })
    .then(async response => { if (!response.ok) throw new Error(); const data = await response.json(); if (!data.ready || !data.siteKey) throw new Error(); return data; });
  const loadVerification = () => turnstileScript ||= new Promise((resolve, reject) => {
    if (window.turnstile) { resolve(); return; }
    const script = document.createElement('script');
    script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.append(script);
  });
  forms.forEach(form => {
    const submit = form.querySelector('[type=submit]');
    const message = form.querySelector('.form-message');
    const verification = form.querySelector('[data-inquiry-verification]');
    const state = { widget: null, started: false, token: '', pending: false, id: null, sent: false };
    const report = text => { if (message) message.textContent = text; };
    const controls = [...form.querySelectorAll('input:not([type=hidden]):not([type=file]),textarea,select')];
    form.noValidate = true;
    const errors = new Map();
    const validate = field => {
      const error = errors.get(field);
      if (!error) return true;
      const text = field.required && !field.value.trim() ? (field.name === 'name' ? 'Please enter your name.' : 'Please enter your email address.')
        : field.validity.typeMismatch || (field.name === 'email' && field.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim())) ? 'Please enter a valid email address.'
        : field.validity.tooLong ? `Please use ${field.maxLength} characters or fewer.` : '';
      error.textContent = text;
      field.setAttribute('aria-invalid', String(!!text));
      return !text;
    };
    controls.filter(field => field.matches('input,textarea')).forEach((field, index) => {
      if (field.required && !field.closest('label').querySelector('.rfq-required')) {
        const star = document.createElement('span'); star.className = 'rfq-required'; star.textContent = '*'; star.setAttribute('aria-hidden','true'); field.before(star);
      }
      const error = document.createElement('span'); error.className = 'rfq-field-error';
      error.id = `inquiry-error-${forms.indexOf(form)}-${index}`; error.setAttribute('aria-live','polite');
      field.after(error); errors.set(field,error);
      field.setAttribute('aria-describedby',[field.getAttribute('aria-describedby'),error.id].filter(Boolean).join(' '));
      field.addEventListener('blur',() => validate(field));
      field.addEventListener('input',() => { if (field.getAttribute('aria-invalid') === 'true') validate(field); });
    });
    controls.filter(field => field.matches('input,textarea')).forEach((field, index) => {
      field.maxLength = field.name === 'name' ? 100 : field.name === 'email' ? 254 : field.tagName === 'TEXTAREA' ? 6000 : 1000;
      if (field.tagName !== 'TEXTAREA') return;
      const count = document.createElement('small');
      count.className = 'rfq-character-count'; count.id = `inquiry-count-${forms.indexOf(form)}-${index}`;
      field.setAttribute('aria-describedby', [field.getAttribute('aria-describedby'), count.id].filter(Boolean).join(' '));
      field.after(count);
      const refresh = () => { count.textContent = `${field.maxLength - field.value.length} characters remaining`; };
      field.addEventListener('input', refresh); field.addEventListener('inquiry-refresh', refresh); refresh();
    });
    const attachment = form.querySelector('[type=file]');
    const fileStatus = document.createElement('p');
    fileStatus.className = 'rfq-file-status full'; fileStatus.setAttribute('aria-live', 'polite');
    fileStatus.id = `inquiry-file-${forms.indexOf(form)}`;
    attachment.setAttribute('aria-describedby', fileStatus.id); attachment.after(fileStatus);
    const upload = document.createElement('div'); upload.className = 'rfq-upload-control';
    const uploadButton = document.createElement('button'); uploadButton.type = 'button'; uploadButton.className = 'rfq-upload-button'; uploadButton.textContent = 'Choose file';
    uploadButton.setAttribute('aria-label','Choose specification or single-line diagram file'); uploadButton.setAttribute('aria-describedby',fileStatus.id);
    const filename = document.createElement('span'); filename.textContent = 'No file selected';
    upload.append(uploadButton,filename); attachment.after(upload);
    attachment.classList.add('rfq-native-file'); attachment.tabIndex = -1; attachment.setAttribute('aria-hidden','true');
    uploadButton.addEventListener('click',() => attachment.click());
    const checkAttachment = () => {
      const file = attachment.files?.[0];
      const error = file && file.size > 8 * 1024 * 1024 ? 'Choose a file that is 8 MB or smaller.'
        : file && !/\.(pdf|docx?|xlsx?|dwg|dxf|jpe?g|png)$/i.test(file.name) ? 'Choose a PDF, Word, Excel, DWG, DXF, JPG or PNG file.' : '';
      attachment.setCustomValidity(error);
      attachment.setAttribute('aria-invalid', String(!!error));
      uploadButton.setAttribute('aria-invalid',String(!!error));
      filename.textContent = file ? file.name : 'No file selected';
      fileStatus.classList.toggle('is-error', !!error);
      fileStatus.textContent = error || (file ? `${(file.size / 1024 / 1024).toFixed(2)} MB · Ready to attach.` : '');
      return !error;
    };
    attachment.addEventListener('change', checkAttachment);
    // Draft storage is opt-in, limited to this tab, and never includes attachment bytes.
    const draftKey = `tianyu-inquiry-v1:${location.pathname}:${form.classList.contains('compact') ? 'modal' : 'page'}`;
    const draft = document.createElement('div'); draft.className = 'rfq-draft full';
    const keepLabel = document.createElement('label'), keep = document.createElement('input');
    keep.type = 'checkbox'; keepLabel.append(keep, ' Keep a text draft in this tab');
    const clear = document.createElement('button'); clear.type = 'button'; clear.className = 'rfq-draft-clear'; clear.textContent = 'Clear draft'; clear.hidden = true;
    const draftStatus = document.createElement('small'); draftStatus.setAttribute('aria-live', 'polite');
    draft.append(keepLabel, clear, draftStatus);
    // The note paragraph was removed from some templates; fall back so the script never stops here.
    (form.querySelector('.inquiry-note') || verification || submit).before(draft);
    const removeDraft = () => { try { sessionStorage.removeItem(draftKey); } catch {} };
    const saveDraft = () => {
      if (!keep.checked || state.sent) return;
      try {
        sessionStorage.setItem(draftKey, JSON.stringify(Object.fromEntries(controls.map(field => [field.name, field.value]))));
        clear.hidden = false; draftStatus.textContent = 'Text draft saved. Attachments are not saved.';
      } catch { keep.checked = false; draftStatus.textContent = 'Draft saving is unavailable. Keep this page open until you send.'; }
    };
    try {
      const saved = JSON.parse(sessionStorage.getItem(draftKey) || 'null');
      if (saved && typeof saved === 'object') {
        controls.forEach(field => { if (typeof saved[field.name] === 'string') field.value = saved[field.name].slice(0, field.maxLength > 0 ? field.maxLength : 1000); });
        keep.checked = true; clear.hidden = false; draftStatus.textContent = 'Text draft restored. Please reattach your file.';
      }
    } catch { removeDraft(); }
    controls.forEach(field => field.dispatchEvent(new Event('inquiry-refresh')));
    keep.addEventListener('change', () => { if (keep.checked) saveDraft(); else { removeDraft(); clear.hidden = true; draftStatus.textContent = 'Draft saving is off.'; } });
    clear.addEventListener('click', () => { removeDraft(); keep.checked = false; clear.hidden = true; draftStatus.textContent = 'Saved draft cleared. Your current entries are kept.'; keep.focus(); });
    form.addEventListener('input', saveDraft);
    form.addEventListener('change', saveDraft);
    const update = () => { submit.disabled = state.pending || (!state.sent && !state.token); };
    const start = async () => {
      if (state.started) return;
      state.started = true;
      submit.disabled = true;
      report('Preparing verification…');
      try {
        const settings = await config();
        await loadVerification();
        report('Complete verification to send your inquiry.');
        state.widget = window.turnstile.render(verification, {
          sitekey: settings.siteKey, action: 'inquiry', size: 'flexible',
          callback: token => { state.token = token; update(); if (!state.pending && !state.sent) report('Ready to send your inquiry.'); },
          'expired-callback': () => { state.token = ''; update(); if (!state.sent) report('Verification expired. Please verify again.'); },
          'error-callback': () => { state.token = ''; update(); if (!state.sent) report('Verification could not load. Please retry or use the email link below.'); }
        });
      } catch {
        state.started = false;
        configuration = undefined;
        if (!window.turnstile) turnstileScript = undefined;
        report('Online inquiries are temporarily unavailable. Your entries are kept. Please use the email link below.');
      }
    };
    form.addEventListener('focusin', start);
    form.addEventListener('input', () => { state.id = null; });
    form.addEventListener('submit', async event => {
      event.preventDefault();
      if (state.pending) return;
      if (state.sent) {
        const model = form.elements.namedItem('model')?.value;
        const product = form.elements.namedItem('product')?.value;
        form.reset();
        removeDraft(); clear.hidden = true; draftStatus.textContent = '';
        checkAttachment(); controls.forEach(field => field.dispatchEvent(new Event('inquiry-refresh')));
        if (model) form.elements.namedItem('model').value = model;
        if (product) form.elements.namedItem('product').value = product;
        state.sent = false; state.id = null; submit.textContent = 'Send Inquiry'; report('Enter your next inquiry.'); update(); return;
      }
      checkAttachment();
      const invalid = controls.filter(field => !validate(field));
      if (invalid.length || !attachment.checkValidity()) {
        const first = invalid[0] || attachment;
        const details = first.closest('details'); if (details) details.open = true;
        report('Please check the highlighted fields.'); (first === attachment ? uploadButton : first).focus(); return;
      }
      if (!state.token) { report('Please complete verification before sending.'); await start(); return; }
      const file = attachment.files?.[0];
      state.pending = true; update(); form.setAttribute('aria-busy', 'true');
      submit.textContent = 'Sending…'; report('Sending your inquiry and attachment…');
      const data = new FormData(form);
      data.set('sourcePage', location.href);
      state.id ||= crypto.randomUUID();
      data.set('submissionId', state.id);
      data.set('cf-turnstile-response', state.token);
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 40000);
      try {
        const response = await fetch('/api/contact', { method: 'POST', body: data, headers: { Accept: 'application/json' }, signal: controller.signal });
        const result = await response.json();
        if (!response.ok || !result.success || !result.reference) throw new Error(result.error || 'We could not confirm sending. Please retry or use the email link below.');
        state.sent = true;
        removeDraft(); clear.hidden = true; draftStatus.textContent = 'Inquiry sent. Saved draft cleared.';
        report(`Your inquiry was accepted for email delivery to Tianyu Electric${file ? ', including your attachment' : ''}. Reference: ${result.reference}.`);
      } catch (error) {
        report(error.name === 'AbortError' || error instanceof TypeError || error instanceof SyntaxError
          ? 'Sending could not be confirmed. Your entries are kept; please retry or use the email link below.' : error.message);
      } finally {
        clearTimeout(timer);
        state.pending = false;
        form.removeAttribute('aria-busy');
        submit.textContent = state.sent ? 'Start another inquiry' : 'Send Inquiry';
        state.token = '';
        if (state.widget !== null) window.turnstile.reset(state.widget);
        update();
      }
    });
  });
})();
