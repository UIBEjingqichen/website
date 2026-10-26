import { readFile } from 'node:fs/promises';
import { test, afterEach } from 'node:test';
import assert from 'node:assert/strict';
const source = await readFile(new URL('../functions/api/contact.js', import.meta.url), 'utf8');
const { onRequest } = await import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`);
const originalFetch = globalThis.fetch;
afterEach(() => { globalThis.fetch = originalFetch; });
const origin = 'https://www.tianyuelectric.com';
const env = { RESEND_API_KEY: 'test-only-key', TURNSTILE_SECRET_KEY: 'test-only-secret', TURNSTILE_SITE_KEY: 'test-only-public-key' };
const id = 'a23318ce-6c6e-4bd2-9e94-01dfb6a7e786';
function inquiry(overrides = {}, file) {
  const form = new FormData();
  for (const [key, value] of Object.entries({ name: 'Test buyer', email: 'buyer@example.com', model: '220 kV transformer', product: 'Power Transformers', rating: '63 MVA', sourcePage: `${origin}/dist/products/220kv-power-transformer/`, submissionId: id, 'cf-turnstile-response': 'test-token', ...overrides })) form.set(key, value);
  if (file) form.append('file', file.blob, file.name);
  return new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin }, body: form });
}
function mockedDelivery({ verification = { success: true, hostname: 'www.tianyuelectric.com', action: 'inquiry' }, status = 200, result = { id: 'test-reference' } } = {}) {
  const calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    return url.includes('siteverify') ? Response.json(verification) : Response.json(result, { status });
  };
  return calls;
}
test('GET returns only public configuration; incomplete configuration is unavailable', async () => {
  const good = await onRequest({ request: new Request(`${origin}/api/contact`), env });
  assert.deepEqual(await good.json(), { ready: true, siteKey: env.TURNSTILE_SITE_KEY, maxFileBytes: 8388608, missingSettings: [] });
  const missing = await onRequest({ request: new Request(`${origin}/api/contact`), env: {} });
  const missingData = await missing.json();
  assert.equal(missingData.ready, false);
  assert.deepEqual(missingData.missingSettings, ['RESEND_API_KEY', 'TURNSTILE_SECRET_KEY', 'TURNSTILE_SITE_KEY']);
  assert.equal(good.headers.get('Cache-Control'), 'no-store');
});
test('sends all technical context, fixed recipient and reply-to, with real attachment bytes', async () => {
  const calls = mockedDelivery();
  const response = await onRequest({ request: inquiry({ vectorGroup: 'YNyn0d11', country: 'Brazil' }, { blob: new Blob(['sample technical file']), name: 'specification.pdf' }), env });
  assert.equal(response.status, 200);
  assert.deepEqual(await response.json(), { success: true, reference: 'test-reference' });
  const sent = JSON.parse(calls[1].options.body);
  assert.deepEqual(sent.to, ['sales@tianyuelectric.com']);
  assert.equal(sent.reply_to, 'buyer@example.com');
  assert.match(sent.text, /YNyn0d11/);
  assert.match(sent.text, /Brazil/);
  assert.match(sent.text, /63 MVA/);
  assert.equal(Buffer.from(sent.attachments[0].content, 'base64').toString(), 'sample technical file');
  assert.equal(calls[1].options.headers['Idempotency-Key'], `inquiry/${id}`);
});
test('missing name, invalid email, excessive text and duplicate fields never send', async () => {
  const calls = mockedDelivery();
  for (const overrides of [{ name: '' }, { email: 'invalid' }, { message: 'x'.repeat(6001) }, { submissionId: 'invalid' }]) {
    assert.equal((await onRequest({ request: inquiry(overrides), env })).status, 400);
  }
  const duplicate = await inquiry().formData(); duplicate.append('email', 'other@example.com');
  assert.equal((await onRequest({ request: new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin }, body: duplicate }), env })).status, 400);
  assert.equal(calls.length, 0);
});
test('rejects foreign origins, unknown hosts and missing server secrets', async () => {
  const calls = mockedDelivery();
  const foreign = inquiry(); foreign.headers.set('Origin', 'https://other.example');
  assert.equal((await onRequest({ request: foreign, env })).status, 403);
  assert.equal((await onRequest({ request: new Request('https://other.example/api/contact'), env })).status, 403);
  assert.equal((await onRequest({ request: inquiry(), env: {} })).status, 503);
  assert.equal(calls.length, 0);
});
test('attachment type and size limits run before provider calls', async () => {
  const calls = mockedDelivery();
  const badType = inquiry({}, { blob: new Blob(['bad']), name: 'bad.exe' });
  assert.equal((await onRequest({ request: badType, env })).status, 400);
  const large = inquiry({}, { blob: new Blob([new Uint8Array(8388609)]), name: 'large.pdf' });
  assert.equal((await onRequest({ request: large, env })).status, 413);
  const tooLargeBody = new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'multipart/form-data; boundary=test' }, body: new Uint8Array(9 * 1024 * 1024) });
  assert.equal((await onRequest({ request: tooLargeBody, env })).status, 413);
  assert.equal(calls.length, 0);
});
test('failed, expired, wrong-action and wrong-host verification never send mail', async () => {
  for (const verification of [{ success: false }, { success: true, hostname: 'other.example', action: 'inquiry' }, { success: true, hostname: 'www.tianyuelectric.com', action: 'other' }]) {
    const calls = mockedDelivery({ verification });
    assert.equal((await onRequest({ request: inquiry(), env })).status, 400);
    assert.equal(calls.length, 1);
  }
});
test('provider failure is generic, contains no secrets, and never reports success', async () => {
  mockedDelivery({ status: 401, result: { message: 'private provider details test-only-key' } });
  const response = await onRequest({ request: inquiry(), env });
  assert.equal(response.status, 502);
  const body = await response.text();
  assert.doesNotMatch(body, /test-only-key|private provider details|success/);
});
test('network failure and missing provider receipt never report success', async () => {
  globalThis.fetch = async () => { throw new Error('private network data'); };
  assert.equal((await onRequest({ request: inquiry(), env })).status, 503);
  mockedDelivery({ result: {} });
  assert.equal((await onRequest({ request: inquiry(), env })).status, 502);
});
test('unsupported method and malformed body return controlled errors', async () => {
  assert.equal((await onRequest({ request: new Request(`${origin}/api/contact`, { method: 'PUT' }), env })).status, 405);
  const malformed = new Request(`${origin}/api/contact`, { method: 'POST', headers: { Origin: origin, 'Content-Type': 'application/json' }, body: '{broken' });
  assert.equal((await onRequest({ request: malformed, env })).status, 400);
});
