import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFile, stat } from 'node:fs/promises';
const source = await readFile(new URL('../assets/f2.js', import.meta.url), 'utf8');
const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const css = await readFile(new URL('../assets/f2.css', import.meta.url), 'utf8');
class Element {
  constructor() { this.dataset = {}; this.events = {}; this.value = ''; this.textContent = ''; this.innerHTML = ''; this.hidden = false; this.attrs = {}; this.classes = new Set(); this.style = { setProperty() {} }; this.classList = { add: x => this.classes.add(x), remove: x => this.classes.delete(x), toggle: (x, on) => on ? this.classes.add(x) : this.classes.delete(x) }; }
  addEventListener(name, callback) { (this.events[name] ||= []).push(callback); }
  async fire(name, event = {}) { for (const callback of this.events[name] || []) await callback({ preventDefault() {}, ...event }); }
  setAttribute(name, value) { this.attrs[name] = value; }
  removeAttribute(name) { delete this.attrs[name]; }
  focus() { this.focused = true; }
  showModal() { this.open = true; }
  close() { this.open = false; }
  append() {}
  remove() {}
  reset() {}
  contains() { return true; }
}
function page(overrides = {}, date = '2026-10-12T00:00:00Z') {
  const nodes = new Map(); const get = key => { if (!nodes.has(key)) nodes.set(key, new Element()); return nodes.get(key); };
  const root = new Element(); root.querySelector = get;
  const controls = [new Element(), new Element()]; controls[0].dataset.frameBg = 'profile'; controls[1].dataset.frameBg = 'clear';
  const closeButtons = [new Element(), new Element()]; root.querySelectorAll = selector => selector === '[data-frame-bg]' ? controls : selector === '[data-close-bottle]' ? closeButtons : [];
  get('[data-wish-form]').elements = { website: { value: '' } }; get('[data-group-link]').hidden = true;
  let networkCalls = 0; class Clock extends Date { static now() { return Date.parse(date); } }
  const context = vm.createContext({ window: { F2_BIRTHDAY_CONFIG: { eventDate: '2026-10-18T00:00:00Z', eventLabel: '18 October 2026 · 00:00 UTC', groupUrl: '', groupLabel: 'Join the birthday crew', wishesApi: '', turnstileSiteKey: '', frameUrl: '', ...overrides } }, document: { getElementById: () => root, createElement: () => new Element() }, matchMedia: () => ({ matches: true }), Date: Clock, setInterval() {}, setTimeout() {}, requestAnimationFrame: fn => fn(), URL, fetch: async () => { networkCalls++; throw new Error('Unexpected network call'); } });
  vm.runInContext(source, context); return { get, root, controls, closeButtons, calls: () => networkCalls };
}
test('Jekyll page uses the existing shell and contains no second document or theme switcher', () => {
  assert.match(html, /^---\nlayout: tool-content\n/); assert.match(html, /permalink: \/events\/f2birthday\//); assert.doesNotMatch(html, /<!doctype|<html|<head>|<body|name="viewport"/i); assert.doesNotMatch(html, /name="util_theme"/);
});
test('subpage IDs and in-page anchors are valid and local asset paths exist', async () => {
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]); assert.equal(ids.length, new Set(ids).size);
  for (const match of html.matchAll(/href="#([^"]+)"/g)) assert.ok(ids.includes(match[1]), `Missing anchor ${match[1]}`);
  for (const match of html.matchAll(/(?:src|href)="\/events\/f2birthday\/([^"#]+)"/g)) assert.ok((await stat(new URL(`../${match[1]}`, import.meta.url))).isFile());
});
test('theme palettes follow Platopedia and responsive widths use the local container', () => {
  assert.match(css, /body\[data-theme="dark"\] #f2birthday/); assert.match(css, /container-type:inline-size/);
  for (const width of [920, 650, 440]) assert.ok(css.includes(`@container(max-width:${width}px)`));
  assert.doesNotMatch(css, /100vw|100vh/); assert.match(css, /prefers-reduced-motion:reduce/);
  assert.match(css, /#f2birthday \[hidden\]\{display:none!important\}/);
});
test('UTC countdown targets 2026 and ends instead of rolling to next year', () => {
  const before = page(); assert.equal(before.get('[data-time="days"]').textContent, '06'); assert.equal(before.get('[data-time="hours"]').textContent, '00');
  const after = page({}, '2026-10-18T02:00:00Z'); assert.equal(after.get('[data-time="days"]').textContent, '00'); assert.match(after.get('[data-birthday-status]').textContent, /HAPPY BIRTHDAY/);
});
test('unconfigured bottle previews are anonymous, escaped, and never submitted', async () => {
  const p = page(); const text = '<script>untrusted text</script> Happy birthday, F2!'; p.get('#f2-wish-message').value = text; await p.get('[data-wish-form]').fire('submit');
  assert.equal(p.calls(), 0); assert.equal(p.get('[data-bottle-dialog]').open, true); assert.equal(p.get('[data-dialog-message]').textContent, text); assert.equal(p.get('[data-dialog-message]').innerHTML, ''); assert.match(p.get('[data-dialog-note]').textContent, /hasn’t been submitted/);
  await p.closeButtons[0].fire('click'); assert.equal(p.get('[data-bottle-dialog]').open, false);
});
test('short wishes focus the field and emoji count correctly', async () => {
  const p = page(); await p.get('[data-wish-form]').fire('submit'); assert.equal(p.get('#f2-wish-message').focused, true); assert.match(p.get('[data-form-status]').textContent, /10 to 600/);
  p.get('#f2-wish-message').value = '🎉💛'; await p.get('#f2-wish-message').fire('input'); assert.equal(p.get('[data-char-count]').textContent, 2);
});
test('frame switch updates transparency and accessible pressed state', async () => {
  const p = page(); await p.controls[1].fire('click'); assert.ok(p.get('[data-frame-object]').classes.has('is-clear')); assert.equal(p.controls[1].attrs['aria-pressed'], 'true'); assert.equal(p.controls[0].attrs['aria-pressed'], 'false');
});
test('official frame settings replace concept labels', () => {
  const p = page({ frameUrl: 'https://platopedia.com/official.png' }); assert.equal(p.get('[data-frame-preview]').src, 'https://platopedia.com/official.png'); assert.match(p.get('[data-frame-caption]').textContent, /official/); assert.match(p.get('[data-download-frame]').innerHTML, /birthday frame/);
});
test('crew invite stays pending until a real group URL is supplied', () => {
  const empty = page(); assert.equal(empty.get('[data-group-link]').hidden, true);
  const ready = page({ groupUrl: 'https://platoapp.com/link/example' }); assert.equal(ready.get('[data-group-link]').href, 'https://platoapp.com/link/example'); assert.equal(ready.get('[data-group-link]').hidden, false); assert.equal(ready.get('[data-group-pending]').hidden, true);
});
test('Luffy cheer works with reduced motion and initialization is repeat-safe', async () => {
  const p = page(); await p.get('[data-luffy-party]').fire('click'); assert.equal(p.get('[data-luffy-speech]').textContent, 'SHISHISHI!!'); assert.equal(p.root.dataset.initialized, 'true');
});
