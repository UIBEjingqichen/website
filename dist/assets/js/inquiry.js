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
        if (model) form.elements.namedItem('model').value = model;
        if (product) form.elements.namedItem('product').value = product;
        state.sent = false; state.id = null; submit.textContent = 'Send Inquiry'; report('Enter your next inquiry.'); update(); return;
      }
      if (!form.reportValidity()) return;
      if (!state.token) { report('Please complete verification before sending.'); await start(); return; }
      const file = form.querySelector('[type=file]')?.files?.[0];
      if (file && file.size > 8 * 1024 * 1024) { report('The attachment must be 8 MB or smaller. Please choose a smaller file.'); return; }
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
