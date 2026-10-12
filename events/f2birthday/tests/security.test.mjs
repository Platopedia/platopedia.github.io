import test from 'node:test';
import assert from 'node:assert/strict';
import { handle, sign, verify, digest, ipNetwork, validateMessage, limitedJson, WishStore, writeSheet, googleToken } from '../server/worker.mjs';
const BASE = Date.parse('2026-10-12T12:00:00Z');
const ORIGIN = 'https://platopedia.com';
class Storage {
  constructor() { this.data = new Map(); this.alarmTime = null; this.queue = Promise.resolve(); }
  async get(key) { return structuredClone(this.data.get(key)); }
  async put(key, value) { if (typeof key === 'object') { for (const [name, item] of Object.entries(key)) this.data.set(name, structuredClone(item)); } else this.data.set(key, structuredClone(value)); }
  async delete(key) { return this.data.delete(key); }
  async getAlarm() { return this.alarmTime; }
  async setAlarm(value) { this.alarmTime = value; }
  async list({ prefix = '', limit = Infinity, startAfter = '' } = {}) { return new Map([...this.data.entries()].filter(([key]) => key.startsWith(prefix) && key > startAfter).sort(([a], [b]) => a.localeCompare(b)).slice(0, limit)); }
  async transaction(callback) { const previous = this.queue; let release; this.queue = new Promise(resolve => { release = resolve; }); await previous; const snapshot = structuredClone(this.data); const alarm = this.alarmTime; try { return await callback(this); } catch (error) { this.data = snapshot; this.alarmTime = alarm; throw error; } finally { release(); } }
}
function setup() {
  const storage = new Storage();
  const env = { SIGNING_SECRET: 'testing-secret-32-characters-long-for-hmac', TURNSTILE_SECRET: 'private-test-key', GOOGLE_SHEET_ID: 'test-sheet', GOOGLE_CLIENT_EMAIL: 'test@example.com', GOOGLE_PRIVATE_KEY: 'not-used-for-submission', ALLOWED_ORIGINS: ORIGIN };
  const store = new WishStore({ storage }, env); env.WISH_STORE = { idFromName: name => name, get: () => store };
  return { env, store, storage };
}
async function client(env, ip = '203.0.113.4', now = BASE, cookie = '') {
  const req = new Request('https://post.platopedia.com/api/challenge', { headers: { Origin: ORIGIN, 'CF-Connecting-IP': ip, ...(cookie ? { Cookie: cookie } : {}) } });
  const response = await handle(req, env, undefined, { now: () => now });
  assert.equal(response.status, 200);
  return { ip, cookie: response.headers.get('Set-Cookie')?.split(';')[0] || cookie, challenge: await response.json() };
}
async function submit(env, person, message = 'Happy birthday, captain F2!', opts = {}) {
  const body = { message, website: '', challenge: person.challenge.token, turnstileToken: 'verified-token', ...opts.body };
  const req = new Request('https://post.platopedia.com/api/wishes', { method: 'POST', headers: { Origin: opts.origin || ORIGIN, 'CF-Connecting-IP': opts.ip || person.ip, Cookie: opts.cookie ?? person.cookie, 'Content-Type': 'application/json', ...(opts.headers || {}) }, body: JSON.stringify(body) });
  return handle(req, env, undefined, { now: () => opts.now ?? BASE + 4000, fetch: async () => Response.json({ success: true, action: 'birthday-wish', cdata: person.challenge.nonce, hostname: 'platopedia.com', ...opts.verification }) });
}
test('HMAC signatures reject tampering and malformed tokens', async () => {
  const token = await sign('a long private secret', { hello: 'captain' }); assert.deepEqual(await verify('a long private secret', token), { hello: 'captain' });
  assert.equal(await verify('wrong secret', token), null); assert.equal(await verify('a long private secret', `${token}extra`), null); assert.equal(await verify('a long private secret', 'invalid'), null);
});
test('IP parsing canonicalizes IPv6 and groups privacy addresses at /64', () => {
  assert.deepEqual(ipNetwork('203.0.113.8'), { ip: '203.0.113.8', subnet: '203.0.113.0/24' });
  assert.equal(ipNetwork('2001:db8:1234:abcd::1').subnet, ipNetwork('2001:0db8:1234:abcd:0:0:0:ffff').subnet);
  assert.equal(ipNetwork('2001:db8::1').ip, ipNetwork('2001:0db8:0:0:0:0:0:1').ip);
  assert.equal(ipNetwork('::ffff:203.0.113.8').ip, '203.0.113.8');
  for (const value of ['999.1.2.3', '1.2.3', 'garbage', '1::2::3', '12345::', ':1:2:3:4:5:6:7']) assert.equal(ipNetwork(value), null);
});
test('message validation rejects links, tiny messages, control characters and repeated spam', () => {
  for (const value of ['hi', 'Go to https://spam.test now', 'www.spam.test birthday', 'a'.repeat(25), 'Birthday\u0000message', 'x'.repeat(601)]) assert.throws(() => validateMessage(value));
  assert.equal(validateMessage('  Happy birthday F2! 🎉  '), 'Happy birthday F2! 🎉');
});
test('unconfigured Google Sheets fails closed', async () => {
  const { env } = setup(); env.GOOGLE_SHEET_ID = '';
  const response = await handle(new Request('https://post.platopedia.com/api/challenge', { headers: { Origin: ORIGIN, 'CF-Connecting-IP': '203.0.113.4' } }), env);
  assert.equal(response.status, 503); assert.match((await response.json()).error, /not open/);
});
test('CORS and CSRF reject unapproved origins; preflight allows only the page', async () => {
  const { env } = setup();
  const denied = await handle(new Request('https://post.platopedia.com/api/challenge', { headers: { Origin: 'https://evil.test' } }), env); assert.equal(denied.status, 403); assert.equal(denied.headers.get('Access-Control-Allow-Origin'), null);
  const allowed = await handle(new Request('https://post.platopedia.com/api/wishes', { method: 'OPTIONS', headers: { Origin: ORIGIN } }), env); assert.equal(allowed.status, 204); assert.equal(allowed.headers.get('Access-Control-Allow-Origin'), ORIGIN); assert.equal(allowed.headers.get('Access-Control-Allow-Credentials'), 'true');
});
test('challenge cookie is signed, HTTP-only, secure and host-scoped', async () => {
  const { env } = setup(); const req = new Request('https://post.platopedia.com/api/challenge', { headers: { Origin: ORIGIN, 'CF-Connecting-IP': '203.0.113.4' } });
  const response = await handle(req, env, undefined, { now: () => BASE });
  const cookie = response.headers.get('Set-Cookie'); assert.match(cookie, /^__Host-f2device=/); assert.match(cookie, /Secure; HttpOnly; SameSite=None; Path=\//); assert.doesNotMatch(cookie, /Domain=/);
});
test('accepted wish is private and survives delivery being offline', async () => {
  const { env, storage } = setup(); const person = await client(env); const response = await submit(env, person);
  assert.equal(response.status, 201); assert.equal((await response.json()).saved, true);
  const [wish] = [...(await storage.list({ prefix: 'wish:' })).values()]; assert.equal(wish.message, 'Happy birthday, captain F2!'); assert.equal(wish.status, 'pending'); assert.equal(wish.row, 2);
  assert.equal(Object.hasOwn(wish, 'ip'), false); assert.equal(Object.hasOwn(wish, 'deviceHash'), false); assert.ok(storage.alarmTime);
});
test('signed device limit survives changing IP', async () => {
  const { env } = setup(); const first = await client(env); assert.equal((await submit(env, first)).status, 201);
  const next = await client(env, '198.51.100.7', BASE + 5000, first.cookie); assert.equal((await submit(env, next, 'Another new birthday wish for F2.', { now: BASE + 9000 })).status, 429);
});
test('clearing cookies cannot bypass the IP quota', async () => {
  const { env } = setup();
  for (let n = 0; n < 7; n++) { const person = await client(env); const response = await submit(env, person, `Personal birthday wish number ${n} for F2.`); assert.equal(response.status, n < 6 ? 201 : 429); }
});
test('subnet quota prevents cycling IPs inside one network', async () => {
  const { env } = setup();
  for (let n = 0; n < 31; n++) { const person = await client(env, `203.0.113.${n + 1}`); const response = await submit(env, person, `From our crewmate number ${n}, happy birthday F2!`); assert.equal(response.status, n < 30 ? 201 : 429); }
});
test('atomic concurrent acceptance cannot exceed one device limit', async () => {
  const { store } = setup(); const responses = await Promise.all(Array.from({ length: 8 }, (_, n) => store.fetch(new Request('https://internal/accept', { method: 'POST', body: JSON.stringify({ now: BASE, message: `A separate lovely birthday wish ${n}`, nonce: `nonce-${n}`, nonceExp: BASE + 60000, deviceHash: 'same-device', ip: 'same-ip', subnet: 'same-subnet', duplicateHash: `different-${n}` }) }))));
  assert.equal(responses.filter(response => response.status === 201).length, 1); assert.equal(responses.filter(response => response.status === 429).length, 7);
});
test('a challenge nonce cannot be replayed for a different wish', async () => {
  const { env } = setup(); const person = await client(env); assert.equal((await submit(env, person)).status, 201); assert.equal((await submit(env, person, 'A second distinct birthday wish.')).status, 409);
});
test('expiry, minimum writing time, IP binding, cookie tampering and honeypot are enforced', async () => {
  const { env } = setup(); const person = await client(env);
  assert.equal((await submit(env, person, undefined, { now: BASE + 1000 })).status, 400);
  assert.equal((await submit(env, person, undefined, { now: BASE + 16 * 60000 })).status, 403);
  assert.equal((await submit(env, person, undefined, { ip: '203.0.113.10' })).status, 403);
  assert.equal((await submit(env, person, undefined, { cookie: `${person.cookie}tamper` })).status, 403);
  assert.equal((await submit(env, person, undefined, { body: { website: 'bot.example' } })).status, 400);
});
test('Turnstile success, hostname, action and challenge data must all match', async () => {
  const { env } = setup(); const person = await client(env);
  for (const verification of [{ success: false }, { hostname: 'evil.test' }, { action: 'login' }, { cdata: 'other-challenge' }]) assert.equal((await submit(env, person, undefined, { verification })).status, 403);
});
test('exact normalized duplicate wishes are rejected across devices and IPs', async () => {
  const { env } = setup(); const first = await client(env); const second = await client(env, '198.51.100.9');
  assert.equal((await submit(env, first, 'Happy birthday F2, our wonderful captain!')).status, 201);
  assert.equal((await submit(env, second, 'HAPPY birthday F2,  our wonderful captain!')).status, 409);
});
test('rolling quota expires after 24 hours', async () => {
  const { env } = setup(); const first = await client(env); assert.equal((await submit(env, first)).status, 201);
  const next = await client(env, first.ip, BASE + 86410000, first.cookie); assert.equal((await submit(env, next, 'A fresh birthday greeting for you, F2!', { now: BASE + 86414000 })).status, 201);
});
test('spoofed forwarded IP cannot bypass the trusted IP binding', async () => {
  const { env } = setup(); const person = await client(env);
  assert.equal((await submit(env, person, undefined, { ip: '198.51.100.4', headers: { 'X-Forwarded-For': person.ip } })).status, 403);
});
test('challenge issuance and failed-attempt quotas are bounded', async () => {
  const { env } = setup(); const person = await client(env);
  for (let n = 0; n < 21; n++) { const response = await submit(env, person, 'bad'); assert.equal(response.status, n < 20 ? 400 : 429); }
  for (let n = 1; n < 31; n++) {
    const response = await handle(new Request('https://post.platopedia.com/api/challenge', { headers: { Origin: ORIGIN, 'CF-Connecting-IP': person.ip } }), env, undefined, { now: () => BASE }); assert.equal(response.status, n < 30 ? 200 : 429);
  }
});
test('global quota remains an independent backstop', async () => {
  const { store, storage } = setup(); await storage.put('rate:global', { count: 500, expires: BASE + 60000 });
  const response = await store.fetch(new Request('https://internal/accept', { method: 'POST', body: JSON.stringify({ now: BASE, message: 'A new greeting', nonce: 'n', deviceHash: 'd', ip: 'i', subnet: 's', duplicateHash: 'm' }) })); assert.equal(response.status, 429); assert.equal((await storage.list({ prefix: 'wish:' })).size, 0);
});
test('oversized request bodies are rejected without trusting Content-Length', async () => {
  await assert.rejects(() => limitedJson(new Request('https://example.test', { method: 'POST', body: JSON.stringify({ message: 'x'.repeat(10000) }) })), error => error.status === 413);
});
test('Sheets retries address the same row and use RAW to avoid formulas', async () => {
  const calls = []; const fetcher = async (url, init) => { calls.push({ url, init }); return new Response('{}'); };
  const env = { GOOGLE_SHEET_ID: 'private-sheet-id', GOOGLE_SHEET_TAB: 'Wishes' }; const values = ['id', 'UTC', '=SUM(A1:A3)', 'F2', 'New'];
  await writeSheet(env, 'secret-access-token', 42, values, fetcher); await writeSheet(env, 'secret-access-token', 42, values, fetcher);
  assert.equal(calls[0].url, calls[1].url); assert.match(calls[0].url, /valueInputOption=RAW/); assert.equal(JSON.parse(calls[0].init.body).range, "'Wishes'!A42:E42"); assert.equal(JSON.parse(calls[0].init.body).values[0][2], '=SUM(A1:A3)');
});
test('service-account authorization signs a JWT locally and only returns access token', async () => {
  const pair = await crypto.subtle.generateKey({ name: 'RSASSA-PKCS1-v1_5', modulusLength: 2048, publicExponent: new Uint8Array([1, 0, 1]), hash: 'SHA-256' }, true, ['sign', 'verify']);
  const pem = `-----BEGIN PRIVATE KEY-----\n${Buffer.from(await crypto.subtle.exportKey('pkcs8', pair.privateKey)).toString('base64')}\n-----END PRIVATE KEY-----`;
  const token = await googleToken({ GOOGLE_CLIENT_EMAIL: 'test@example.com', GOOGLE_PRIVATE_KEY: pem }, async (url, init) => { assert.equal(url, 'https://oauth2.googleapis.com/token'); const assertion = init.body.get('assertion'); const [head, claims, signature] = assertion.split('.'); assert.equal(JSON.parse(Buffer.from(claims, 'base64url')).iss, 'test@example.com'); assert.ok(await crypto.subtle.verify('RSASSA-PKCS1-v1_5', pair.publicKey, Buffer.from(signature, 'base64url'), new TextEncoder().encode(`${head}.${claims}`))); return Response.json({ access_token: 'only-token' }); });
  assert.equal(token, 'only-token');
});
test('delivery outages preserve pending messages and schedule retry', async () => {
  const { env, store, storage } = setup(); const person = await client(env); await submit(env, person);
  await store.alarm(); const [wish] = [...(await storage.list({ prefix: 'wish:' })).values()]; assert.equal(wish.status, 'pending'); assert.equal((await storage.list({ prefix: 'pending:' })).size, 1); assert.ok(storage.alarmTime > Date.now());
});
