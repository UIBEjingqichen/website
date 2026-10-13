const RECIPIENT = 'tianyuelectric@yeah.net';
const MAX_FILE = 8 * 1024 * 1024;
const MAX_BODY = MAX_FILE + 128 * 1024;
const DEFAULT_HOSTS = ['www.tianyuelectric.com', 'tianyuelectric.com', 'website-qd8.pages.dev'];
const FIELDS = {
  name: 'Name', email: 'Email', company: 'Company', country: 'Destination country',
  product: 'Product family', model: 'Product / model', rating: 'Capacity / voltage',
  quantity: 'Quantity', requiredDelivery: 'Required delivery', ratedPower: 'Rated power',
  hvVoltage: 'HV voltage', lvVoltage: 'LV / MV voltage', frequency: 'Frequency',
  vectorGroup: 'Vector group', impedance: 'Impedance', tapRange: 'Tap range',
  tapChanger: 'Tap changer', cooling: 'Cooling', installation: 'Installation',
  altitude: 'Altitude', ambient: 'Ambient temperature', requiredStandard: 'Standard',
  efficiency: 'Loss / efficiency', enclosure: 'Enclosure / IP', windingMaterial: 'Winding material',
  accessories: 'Accessories', siteConditions: 'Site conditions', message: 'Project requirements',
  sourcePage: 'Source page', requestContext: 'Request context'
};
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }
});
const hosts = (env) => (env.INQUIRY_HOSTNAMES || DEFAULT_HOSTS.join(',')).split(',').map(v => v.trim()).filter(Boolean);
const missingSettings = (env) => ['RESEND_API_KEY', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY'].filter(key => !env[key]);
const configured = (env) => missingSettings(env).length === 0;

async function boundedForm(request) {
  if (!request.headers.get('Content-Type')?.startsWith('multipart/form-data')) throw new Error('type');
  const reader = request.body?.getReader();
  if (!reader) throw new Error('body');
  const chunks = [];
  let length = 0;
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    length += value.byteLength;
    if (length > MAX_BODY) { await reader.cancel(); throw new Error('size'); }
    chunks.push(value);
  }
  const bytes = new Uint8Array(length);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  return new Request(request.url, { method: 'POST', headers: request.headers, body: bytes }).formData();
}

export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  if (!hosts(env).includes(url.hostname)) return json({ error: 'This website is not enabled for inquiries.' }, 403);
  if (request.method === 'GET') return json({ ready: configured(env), siteKey: configured(env) ? env.TURNSTILE_SITE_KEY : null, maxFileBytes: MAX_FILE, missingSettings: missingSettings(env) });
  if (request.method !== 'POST') return json({ error: 'Use the inquiry form to submit a request.' }, 405);
  if (request.headers.get('Origin') !== url.origin) return json({ error: 'Please submit from the Tianyu website.' }, 403);
  if (!configured(env)) return json({ error: 'Online inquiries are temporarily unavailable. Please email tianyuelectric@yeah.net.' }, 503);
  let form;
  try { form = await boundedForm(request); }
  catch (error) { return json({ error: error.message === 'size' ? 'The attachment must be 8 MB or smaller.' : 'Please use the website inquiry form.' }, error.message === 'size' ? 413 : 400); }
  const values = {};
  let total = 0;
  for (const key of Object.keys(FIELDS)) {
    if (form.getAll(key).length > 1) return json({ error: 'Please check the form and try again.' }, 400);
    const raw = form.get(key);
    if (raw != null && typeof raw !== 'string') return json({ error: 'Please check the text fields.' }, 400);
    const value = String(raw || '').trim();
    if (value.length > (['message','siteConditions','accessories'].includes(key) ? 6000 : 1000)) return json({ error: `${FIELDS[key]} is too long. Please shorten it.` }, 400);
    values[key] = value;
    total += value.length;
  }
  if (total > 30000 || !values.name || values.name.length > 100 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email) || values.email.length > 254) return json({ error: 'Please enter your name and a valid email address.' }, 400);
  const submissionId = String(form.get('submissionId') || '');
  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(submissionId)) return json({ error: 'Please refresh the page and try again.' }, 400);
  const token = form.get('cf-turnstile-response');
  if (typeof token !== 'string' || !token || token.length > 2048) return json({ error: 'Please complete the verification and try again.' }, 400);
  const files = form.getAll('file').filter(file => typeof file !== 'string' && file.size);
  if (files.length > 1 || files.some(file => file.size > MAX_FILE)) return json({ error: 'Please attach one file, 8 MB or smaller.' }, 413);
  if (files.some(file => !/\.(pdf|docx?|xlsx?|dwg|dxf|jpe?g|png)$/i.test(file.name))) return json({ error: 'Please attach a PDF, Word, Excel, DWG, DXF, JPG or PNG file.' }, 400);
  try {
    const verification = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, signal: AbortSignal.timeout(10000),
      body: JSON.stringify({ secret: env.TURNSTILE_SECRET_KEY, response: token, remoteip: request.headers.get('CF-Connecting-IP') || undefined })
    });
    if (!verification.ok) return json({ error: 'Verification is unavailable. Please try again.' }, 503);
    const verified = await verification.json();
    if (!verified.success || verified.action !== 'inquiry' || !hosts(env).includes(verified.hostname)) return json({ error: 'Verification expired or failed. Please verify again.' }, 400);
    const attachments = [];
    for (const file of files) {
      const bytes = new Uint8Array(await file.arrayBuffer());
      let binary = '';
      for (let i = 0; i < bytes.length; i += 8192) binary += String.fromCharCode(...bytes.subarray(i, i + 8192));
      attachments.push({ filename: file.name.replace(/[\r\n\\/]/g, '_').slice(-180), content: btoa(binary) });
    }
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST', signal: AbortSignal.timeout(15000),
      headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json', 'Idempotency-Key': `inquiry/${submissionId}` },
      body: JSON.stringify({
        from: env.INQUIRY_FROM || 'Tianyu Electric <noreply@tianyuelectric.com>',
        to: [RECIPIENT], reply_to: values.email,
        subject: `Website inquiry — ${(values.model || values.product || values.name).replace(/[\r\n]/g, ' ').slice(0, 140)}`,
        text: Object.entries(FIELDS).filter(([key]) => values[key]).map(([key, label]) => `${label}: ${values[key]}`).join('\n\n'),
        ...(attachments.length ? { attachments } : {})
      })
    });
    if (!response.ok) return json({ error: 'We could not send your inquiry. Your entries are kept; please retry or email tianyuelectric@yeah.net.' }, 502);
    const sent = await response.json();
    if (!sent.id) return json({ error: 'We could not confirm sending. Please retry or email tianyuelectric@yeah.net.' }, 502);
    return json({ success: true, reference: sent.id });
  } catch {
    return json({ error: 'Sending could not be confirmed. Your entries are kept; please retry or email tianyuelectric@yeah.net.' }, 503);
  }
}
