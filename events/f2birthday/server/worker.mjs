/* Deploy with server/wrangler.jsonc. All secrets belong in Worker environment bindings. */
const encoder = new TextEncoder();
const DAY = 86400000;
const CHALLENGE_LIFETIME = 15 * 60000;
const COOKIE = '__Host-f2device';
export class PublicError extends Error { constructor(message, status = 400, retryAfter = 0) { super(message); this.status = status; this.retryAfter = retryAfter; } }
function json(value, status = 200, extra = {}) { return new Response(JSON.stringify(value), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', ...extra } }); }
function base64url(bytes) { return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, ''); }
function unbase64url(text) { return Uint8Array.from(atob(text.replace(/-/g, '+').replace(/_/g, '/') + '='.repeat((4 - text.length % 4) % 4)), char => char.charCodeAt(0)); }
async function key(secret) { return crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']); }
export async function digest(secret, value) { return base64url(await crypto.subtle.sign('HMAC', await key(secret), encoder.encode(value))); }
export async function sign(secret, payload) { const body = base64url(encoder.encode(JSON.stringify(payload))); return `${body}.${await digest(secret, body)}`; }
export async function verify(secret, token) {
  try { if (typeof token !== 'string' || token.length > 2048) return null; const [body, signature, extra] = token.split('.'); if (extra || !signature) return null;
    if (!await crypto.subtle.verify('HMAC', await key(secret), unbase64url(signature), encoder.encode(body))) return null;
    return JSON.parse(new TextDecoder().decode(unbase64url(body)));
  } catch { return null; }
}
export function ipNetwork(input) {
  if (typeof input !== 'string' || !input) return null;
  // Cloudflare supplies CF-Connecting-IP; client X-Forwarded-For is deliberately ignored.
  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(input)) { const parts = input.split('.').map(Number); if (parts.some(part => part > 255)) return null; return { ip: parts.join('.'), subnet: `${parts.slice(0, 3).join('.')}.0/24` }; }
  let address = input.toLowerCase();
  // Convert IPv4-mapped/embedded IPv6 to its canonical form.
  if (address.includes('.')) { const index = address.lastIndexOf(':'); if (index < 0 || !/^\d{1,3}(\.\d{1,3}){3}$/.test(address.slice(index + 1))) return null; const ipv4 = ipNetwork(address.slice(index + 1)); if (!ipv4) return null; const octets = ipv4.ip.split('.').map(Number); address = `${address.slice(0, index + 1)}${((octets[0] << 8) | octets[1]).toString(16)}:${((octets[2] << 8) | octets[3]).toString(16)}`; }
  if (!/^[a-f0-9:]+$/.test(address) || (address.match(/::/g) || []).length > 1) return null;
  const [left, right = ''] = address.split('::'); const a = left ? left.split(':') : []; const b = right ? right.split(':') : [];
  const count = a.length + b.length; if (address.includes('::') ? count >= 8 : count !== 8) return null;
  const parts = address.includes('::') ? [...a, ...Array(8 - count).fill('0'), ...b] : a;
  if (parts.some(part => !/^[a-f0-9]{1,4}$/.test(part))) return null;
  const normal = parts.map(part => parseInt(part, 16).toString(16));
  if (normal.slice(0, 5).every(part => part === '0') && normal[5] === 'ffff') { const hi = parseInt(normal[6], 16), lo = parseInt(normal[7], 16); return ipNetwork(`${hi >> 8}.${hi & 255}.${lo >> 8}.${lo & 255}`); }
  return { ip: normal.join(':'), subnet: `${normal.slice(0, 4).join(':')}::/64` };
}
export function validateMessage(value) {
  if (typeof value !== 'string') throw new PublicError('Please write a birthday wish.');
  const message = value.normalize('NFKC').trim(); const length = [...message].length;
  if (length < 10 || length > 600) throw new PublicError('Please write between 10 and 600 characters.');
  if (/[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/u.test(message)) throw new PublicError('Please remove unsupported characters.');
  if (/(?:https?:\/\/|www\.)/i.test(message)) throw new PublicError('Keep your wish personal: links are not allowed.');
  if (/(.)\1{19}/u.test(message)) throw new PublicError('Please write a meaningful birthday wish.');
  return message;
}
export async function limitedJson(request) {
  if (!request.body) throw new PublicError('Please write a birthday wish.');
  const reader = request.body.getReader(); let total = 0, text = ''; const decoder = new TextDecoder();
  try { for (;;) { const { done, value } = await reader.read(); if (done) break; total += value.byteLength; if (total > 8192) { await reader.cancel(); throw new PublicError('This bottle is too large.', 413); } text += decoder.decode(value, { stream: true }); } text += decoder.decode(); }
  finally { reader.releaseLock(); }
  try { return JSON.parse(text); } catch { throw new PublicError('The bottle could not be read. Please try again.'); }
}
function configured(env) { return env.WISH_STORE && env.SIGNING_SECRET?.length >= 32 && env.TURNSTILE_SECRET && env.GOOGLE_SHEET_ID && env.GOOGLE_CLIENT_EMAIL && env.GOOGLE_PRIVATE_KEY; }
function origins(env) { return (env.ALLOWED_ORIGINS || '').split(',').map(value => value.trim()).filter(value => /^https:\/\//.test(value)); }
async function deviceFrom(request, env, now) {
  const token = (request.headers.get('Cookie') || '').split(';').map(value => value.trim()).find(value => value.startsWith(`${COOKIE}=`))?.slice(COOKIE.length + 1);
  const data = await verify(env.SIGNING_SECRET, token);
  return data?.kind === 'device' && typeof data.id === 'string' && data.exp > now ? data : null;
}
async function storeCall(env, pathname, body) { const stub = env.WISH_STORE.get(env.WISH_STORE.idFromName('f2-birthday-2026')); return stub.fetch(new Request(`https://wish-store${pathname}`, { method: 'POST', body: JSON.stringify(body) })); }

export async function handle(request, env, ctx = { waitUntil() {} }, deps = {}) {
  const url = new URL(request.url); const origin = request.headers.get('Origin'); const allowed = origins(env);
  const cors = allowed.includes(origin) ? { 'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Credentials': 'true', 'Vary': 'Origin' } : {};
  try {
    if (!allowed.includes(origin)) throw new PublicError('This birthday post only accepts messages from the event page.', 403);
    if (request.method === 'OPTIONS') return new Response(null, { status: 204, headers: { ...cors, 'Access-Control-Allow-Methods': 'GET, POST, OPTIONS', 'Access-Control-Allow-Headers': 'Content-Type', 'Access-Control-Max-Age': '600' } });
    if (!configured(env)) throw new PublicError('The birthday post is not open yet. Please check back soon.', 503);
    const now = deps.now?.() ?? Date.now();
    if (now > Date.parse(env.SUBMISSIONS_CLOSE_AT || '2026-10-20T23:59:59Z')) throw new PublicError('The birthday post has closed. Thank you for celebrating F2.', 410);
    const network = ipNetwork(request.headers.get('CF-Connecting-IP') || ''); if (!network) throw new PublicError('The birthday post could not verify your connection.', 403);
    const ip = await digest(env.SIGNING_SECRET, `ip:${network.ip}`); const subnet = await digest(env.SIGNING_SECRET, `net:${network.subnet}`);
    if (url.pathname === '/api/challenge' && request.method === 'GET') {
      const rate = await storeCall(env, '/gate', { now, keys: [{ key: `challenge-ip:${ip}`, limit: 30, window: 600000 }, { key: `challenge-net:${subnet}`, limit: 150, window: 600000 }, { key: 'challenge-global', limit: 3000, window: 600000 }] });
      if (!rate.ok) { const data = await rate.json(); throw new PublicError(data.error, rate.status, data.retryAfter); }
      const existing = await deviceFrom(request, env, now); const device = existing || { kind: 'device', id: crypto.randomUUID(), exp: now + DAY * 30 };
      const nonce = crypto.randomUUID().replace(/-/g, ''); const payload = { kind: 'challenge', nonce, device: device.id, ip, iat: now, exp: now + CHALLENGE_LIFETIME };
      const headers = { ...cors }; if (!existing) headers['Set-Cookie'] = `${COOKIE}=${await sign(env.SIGNING_SECRET, device)}; Secure; HttpOnly; SameSite=None; Path=/; Max-Age=2592000`;
      return json({ token: await sign(env.SIGNING_SECRET, payload), nonce, expiresAt: payload.exp }, 200, headers);
    }
    if (url.pathname !== '/api/wishes' || request.method !== 'POST') throw new PublicError('This route is not on the chart.', 404);
    const attemptRate = await storeCall(env, '/gate', { now, keys: [{ key: `attempt-ip:${ip}`, limit: 20, window: 600000 }, { key: `attempt-net:${subnet}`, limit: 100, window: 600000 }, { key: 'attempt-global', limit: 2000, window: 600000 }] });
    if (!attemptRate.ok) { const data = await attemptRate.json(); throw new PublicError(data.error, attemptRate.status, data.retryAfter); }
    if (!/^application\/json(?:;|$)/i.test(request.headers.get('Content-Type') || '')) throw new PublicError('Please use the event page to send your wish.', 415);
    const body = await limitedJson(request); if (!body || typeof body !== 'object' || Array.isArray(body)) throw new PublicError('The bottle could not be read.');
    if (body.website !== '' && body.website !== undefined) throw new PublicError('The birthday post could not accept this bottle.', 400);
    const message = validateMessage(body.message);
    const device = await deviceFrom(request, env, now); const challenge = await verify(env.SIGNING_SECRET, body.challenge);
    if (!device) throw new PublicError('Please allow cookies for the birthday post, then reload the event page.', 403);
    if (!challenge || challenge.kind !== 'challenge' || typeof challenge.nonce !== 'string' || challenge.device !== device.id || challenge.ip !== ip || challenge.exp <= now || challenge.iat > now) throw new PublicError('This bottle’s seal has expired. Please try the security check again.', 403);
    if (now - challenge.iat < 3000) throw new PublicError('Take a moment to write your wish, then try again.');
    if (typeof body.turnstileToken !== 'string' || !body.turnstileToken || body.turnstileToken.length > 2048) throw new PublicError('Please complete the security check.', 403);
    const verifyResponse = await (deps.fetch || fetch)('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ secret: env.TURNSTILE_SECRET, response: body.turnstileToken, remoteip: network.ip }), signal: AbortSignal.timeout(10000) });
    if (!verifyResponse.ok) throw new PublicError('The security check is temporarily unavailable. Please try again.', 503);
    const verification = await verifyResponse.json();
    if (!verification.success || verification.action !== 'birthday-wish' || verification.cdata !== challenge.nonce || !allowed.some(value => new URL(value).hostname === verification.hostname)) throw new PublicError('The security check did not pass. Please try again.', 403);
    const deviceHash = await digest(env.SIGNING_SECRET, `device:${device.id}`); const duplicateHash = await digest(env.SIGNING_SECRET, `message:${message.toLocaleLowerCase('en').replace(/\s+/g, ' ')}`);
    const response = await storeCall(env, '/accept', { now, message, nonce: challenge.nonce, nonceExp: challenge.exp, deviceHash, ip, subnet, duplicateHash });
    const result = await response.json(); return json(result, response.status, { ...cors, ...(result.retryAfter ? { 'Retry-After': String(result.retryAfter) } : {}) });
  } catch (error) {
    // Never return Google/Turnstile responses, credentials, raw addresses, or wish text in errors.
    return json({ error: error instanceof PublicError ? error.message : 'The birthday post is temporarily unavailable. Your message has not been confirmed; please try again.' }, error instanceof PublicError ? error.status : 503, { ...cors, ...(error.retryAfter ? { 'Retry-After': String(error.retryAfter) } : {}) });
  }
}
export default { fetch: handle };

export class WishStore {
  constructor(state, env) { this.state = state; this.env = env; this.flushing = false; }
  async gate(storage, keys, now) {
    const updates = {};
    for (const rule of keys) { const name = `rate:${rule.key}`; const old = await storage.get(name); const counter = old && old.expires > now ? old : { count: 0, expires: now + rule.window };
      if (counter.count >= rule.limit) return { error: 'Too many bottles from this connection. Please come back a little later.', retryAfter: Math.ceil((counter.expires - now) / 1000) };
      updates[name] = { ...counter, count: counter.count + 1 };
    }
    await storage.put(updates); return null;
  }
  async fetch(request) {
    const data = await request.json(); const path = new URL(request.url).pathname;
    if (path === '/gate') { const error = await this.state.storage.transaction(async tx => {
      const result = await this.gate(tx, data.keys, data.now);
      // Expired security counters are swept even if no visitor ever submits a wish.
      if (!await tx.getAlarm()) await tx.setAlarm(data.now + 60000);
      return result;
    }); return error ? json(error, 429) : json({ ok: true }); }
    if (path !== '/accept') return json({ error: 'Not found.' }, 404);
    const outcome = await this.state.storage.transaction(async tx => {
      if (await tx.get(`nonce:${data.nonce}`)) return { status: 409, error: 'This bottle has already been sent. Please start a new wish.' };
      const duplicate = await tx.get(`duplicate:${data.duplicateHash}`); if (duplicate?.expires > data.now) return { status: 409, error: 'That wish has already reached the birthday post. Try something personal for F2.' };
      const limits = [{ key: `device:${data.deviceHash}`, limit: 1, window: DAY }, { key: `ip:${data.ip}`, limit: 6, window: DAY }, { key: `network:${data.subnet}`, limit: 30, window: DAY }, { key: 'global', limit: 500, window: DAY }];
      const error = await this.gate(tx, limits, data.now); if (error) return { status: 429, ...error };
      const seq = (await tx.get('sequence') || 0) + 1; const id = crypto.randomUUID(); const key = `wish:${String(seq).padStart(8, '0')}`;
      const wish = { id, row: seq + 1, createdAt: new Date(data.now).toISOString(), message: data.message, status: 'pending', expires: data.now + 30 * DAY };
      await tx.put({ sequence: seq, [key]: wish, [`pending:${String(seq).padStart(8, '0')}`]: key, [`nonce:${data.nonce}`]: { expires: data.nonceExp }, [`duplicate:${data.duplicateHash}`]: { expires: data.now + 3600000 } });
      // Alarm and wish commit atomically, so a restart cannot strand an accepted message.
      if (!await tx.getAlarm()) await tx.setAlarm(data.now + 1000);
      return { status: 201, id, saved: true };
    });
    const { status, ...body } = outcome; return json(body, status);
  }
  async alarm() {
    if (this.flushing) return; this.flushing = true;
    try {
      const pending = await this.state.storage.list({ prefix: 'pending:', limit: 10 });
      if (pending.size) {
        const token = await googleToken(this.env);
        await writeSheet(this.env, token, 1, ['Bottle ID', 'Received (UTC)', 'Birthday wish', 'Occasion', 'Moderation']);
        for (const [pendingKey, wishKey] of pending) {
          const wish = await this.state.storage.get(wishKey); if (!wish) { await this.state.storage.delete(pendingKey); continue; }
          // Fixed row writes are idempotent even after a timeout: retries overwrite the same row.
          await writeSheet(this.env, token, wish.row, [wish.id, wish.createdAt, wish.message, 'F2 · 18 October 2026', 'New']);
          await this.state.storage.transaction(async tx => { await tx.put(wishKey, { ...wish, status: 'delivered', deliveredAt: new Date().toISOString() }); await tx.delete(pendingKey); });
        }
      }
      await this.cleanup();
    } catch { /* Preserve every pending wish; the alarm will retry. Do not log personal data. */ }
    finally { this.flushing = false; await this.state.storage.setAlarm(Date.now() + 60000); }
  }
  async cleanup() {
    // Bounded sweep with a persisted cursor so large event stores cannot starve cleanup.
    const cursor = await this.state.storage.get('cleanup-cursor');
    const entries = await this.state.storage.list({ limit: 100, ...(cursor ? { startAfter: cursor } : {}) }); const now = Date.now();
    for (const [key, value] of entries) { if (value?.expires && value.expires <= now && !(key.startsWith('wish:') && value.status === 'pending')) await this.state.storage.delete(key); }
    await this.state.storage.put('cleanup-cursor', entries.size === 100 ? [...entries.keys()].at(-1) : '');
  }
}
export async function googleToken(env, fetcher = fetch) {
  const now = Math.floor(Date.now() / 1000); const header = base64url(encoder.encode(JSON.stringify({ alg: 'RS256', typ: 'JWT' })));
  const claims = base64url(encoder.encode(JSON.stringify({ iss: env.GOOGLE_CLIENT_EMAIL, scope: 'https://www.googleapis.com/auth/spreadsheets', aud: 'https://oauth2.googleapis.com/token', iat: now, exp: now + 3600 })));
  const pem = env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n').replace(/-----BEGIN PRIVATE KEY-----|-----END PRIVATE KEY-----|\s/g, '');
  const privateKey = await crypto.subtle.importKey('pkcs8', Uint8Array.from(atob(pem), char => char.charCodeAt(0)), { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['sign']);
  const assertion = `${header}.${claims}.${base64url(await crypto.subtle.sign('RSASSA-PKCS1-v1_5', privateKey, encoder.encode(`${header}.${claims}`)))}`;
  const response = await fetcher('https://oauth2.googleapis.com/token', { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams({ grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer', assertion }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Google authorization unavailable.'); const data = await response.json(); if (!data.access_token) throw new Error('Google authorization unavailable.'); return data.access_token;
}
export async function writeSheet(env, token, row, values, fetcher = fetch) {
  const tab = (env.GOOGLE_SHEET_TAB || 'Wishes').replace(/'/g, "''"); const range = `'${tab}'!A${row}:E${row}`;
  const response = await fetcher(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(env.GOOGLE_SHEET_ID)}/values/${encodeURIComponent(range)}?valueInputOption=RAW`, { method: 'PUT', headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ range, majorDimension: 'ROWS', values: [values] }), signal: AbortSignal.timeout(10000) });
  if (!response.ok) throw new Error('Sheet delivery unavailable.');
}
