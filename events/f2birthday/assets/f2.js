(() => {
  'use strict';
  const root = document.getElementById('f2birthday');
  if (!root || root.dataset.initialized) return;
  root.dataset.initialized = 'true';
  const config = window.F2_BIRTHDAY_CONFIG;
  const $ = selector => root.querySelector(selector);
  const $$ = selector => root.querySelectorAll(selector);
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const date = Date.parse(config.eventDate);
  const values = {};
  function countdown() {
    const time = Math.max(0, date - Date.now());
    const next = { days: Math.floor(time / 86400000), hours: Math.floor(time / 3600000) % 24, minutes: Math.floor(time / 60000) % 60, seconds: Math.floor(time / 1000) % 60 };
    for (const [name, value] of Object.entries(next)) {
      if (values[name] === value) continue;
      const el = $(`[data-time="${name}"]`); el.textContent = String(value).padStart(2, '0');
      if (!reduced && values[name] !== undefined) { el.classList.remove('is-ticking'); requestAnimationFrame(() => el.classList.add('is-ticking')); }
      values[name] = value;
    }
    $('.f2-countdown').setAttribute('aria-label', time ? `${next.days} days, ${next.hours} hours, ${next.minutes} minutes, ${next.seconds} seconds until F2's birthday` : 'Happy birthday, F2!');
    if (!time) $('[data-birthday-status]').textContent = 'HAPPY BIRTHDAY, F2! Let the adventure begin!';
  }
  $('[data-event-label]').textContent = config.eventLabel;
  if (Number.isFinite(date)) { countdown(); setInterval(countdown, 1000); }
  else $('[data-event-label]').textContent = 'The captain is still charting the party date.';
  if (config.groupUrl) {
    $('[data-group-link]').href = config.groupUrl;
    $('[data-group-label]').textContent = config.groupLabel;
    $('[data-group-link]').hidden = false;
    $('[data-group-pending]').hidden = true;
  }
  root.addEventListener('click', event => {
    const link = event.target.closest('a[href^="#"]'); if (!link || !root.contains(link)) return;
    const target = document.getElementById(link.hash.slice(1)); if (!target || !root.contains(target)) return;
    event.preventDefault(); target.scrollIntoView({ behavior: reduced ? 'instant' : 'smooth', block: 'start' });
    target.setAttribute('tabindex', '-1'); target.focus({ preventScroll: true });
  });
  function celebrate() {
    if (reduced) return;
    root.querySelector('.f2-confetti')?.remove();
    const layer = document.createElement('div'); layer.className = 'f2-confetti'; layer.setAttribute('aria-hidden', 'true');
    for (let n = 0; n < 32; n++) {
      const piece = document.createElement('i'); piece.style.setProperty('--x', `${Math.random() * 100}%`); piece.style.setProperty('--r', `${Math.random() * 180}deg`); piece.style.setProperty('--delay', `${Math.random() * .7}s`); piece.style.setProperty('--confetti', ['#ffce49', '#f65449', '#46c8d3', '#fff9e7'][n % 4]); layer.append(piece);
    }
    root.append(layer); setTimeout(() => layer.remove(), 4400);
  }
  let party = 0;
  $('[data-luffy-party]').addEventListener('click', () => {
    const cheers = ['SHISHISHI!!', 'F2! F2! F2!', 'LET’S SET SAIL!', 'PARTY TIME!!'];
    $('[data-luffy-speech]').textContent = cheers[party++ % cheers.length];
    const button = $('[data-luffy-party]'); button.classList.remove('is-partying'); requestAnimationFrame(() => button.classList.add('is-partying')); celebrate();
  });

  for (const button of $$('[data-frame-bg]')) button.addEventListener('click', () => {
    $('[data-frame-object]').classList.toggle('is-clear', button.dataset.frameBg === 'clear');
    for (const other of $$('[data-frame-bg]')) { other.classList.toggle('is-active', other === button); other.setAttribute('aria-pressed', String(other === button)); }
  });
  if (config.frameUrl) {
    $('[data-frame-preview]').src = config.frameUrl; $('[data-frame-preview]').alt = "F2's official birthday frame";
    $('[data-frame-caption]').textContent = 'F2’s official birthday frame';
    $('[data-frame-details]').textContent = 'Download the official birthday frame and give your profile the crew treatment.';
    $('[data-download-frame]').innerHTML = 'Grab your birthday frame <span aria-hidden="true">↓</span>';
    $('[data-download-caption]').textContent = 'Official birthday frame · transparent background';
  }
  $('[data-download-frame]').addEventListener('click', async () => {
    const button = $('[data-download-frame]'); const label = button.innerHTML; const url = config.frameUrl || $('[data-frame-preview]').src;
    button.disabled = true;
    try {
      const response = await fetch(url); if (!response.ok) throw new Error('Unavailable frame');
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = objectUrl; link.download = config.frameUrl ? config.frameFilename : 'f2-birthday-frame-concept.svg'; root.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      button.innerHTML = 'Treasure collected! <span aria-hidden="true">✓</span>'; setTimeout(() => { button.innerHTML = label; button.disabled = false; }, 1800);
    } catch {
      const link = document.createElement('a'); link.href = url; link.download = config.frameUrl ? config.frameFilename : 'f2-birthday-frame-concept.svg'; link.target = '_blank'; link.rel = 'noopener'; root.append(link); link.click(); link.remove(); button.disabled = false;
      $('[data-download-caption]').textContent = 'The frame opened in a new tab. Save it to collect your treasure.';
    }
  });

  const form = $('[data-wish-form]'); const message = $('#f2-wish-message'); const status = $('[data-form-status]'); const send = $('.f2-send'); const dialog = $('[data-bottle-dialog]');
  const api = config.wishesApi.replace(/\/$/, ''); const connected = Boolean(api && config.turnstileSiteKey);
  let challenge = null, botToken = '', widget = null, busy = false, widgetScript = null;
  message.addEventListener('input', () => { $('[data-char-count]').textContent = [...message.value].length; message.removeAttribute('aria-invalid'); status.textContent = ''; });
  for (const button of $$('[data-close-bottle]')) button.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); });
  function showBottle(text, delivered) {
    $('[data-dialog-message]').textContent = text;
    $('[data-dialog-title]').innerHTML = delivered ? 'Wish <em>on board!</em>' : 'That’s a <em>keeper!</em>';
    $('[data-dialog-kicker]').textContent = delivered ? 'ONE VERY HAPPY CAPTAIN, COMING UP.' : 'ONE BOTTLE. LOTS OF HEART.';
    $('[data-dialog-note]').textContent = delivered ? 'Your anonymous wish is safely saved for F2. Thanks for being part of the crew!' : 'This is a preview. Your wish hasn’t been submitted yet. You can send it when the birthday post opens.';
    dialog.showModal();
  }
  async function getChallenge() {
    const response = await fetch(`${api}/api/challenge`, { credentials: 'include', cache: 'no-store' });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'The birthday post is taking a little break. Please try later.'); challenge = result;
  }
  async function loadBotWidget() {
    if (window.turnstile) return;
    if (!widgetScript) widgetScript = new Promise((resolve, reject) => {
      const script = document.createElement('script'); script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit'; script.async = true; script.onload = resolve; script.onerror = () => { widgetScript = null; reject(new Error('The security check could not load. Check your connection and reload.')); }; document.head.append(script);
    });
    await widgetScript;
  }
  async function preparePost() {
    botToken = ''; challenge = null;
    await getChallenge(); await loadBotWidget();
    if (widget !== null) window.turnstile.remove(widget);
    widget = window.turnstile.render($('[data-bot-check]'), { sitekey: config.turnstileSiteKey, theme: 'light', action: 'birthday-wish', cData: challenge.nonce, callback: token => { botToken = token; }, 'expired-callback': () => { botToken = ''; }, 'error-callback': () => { botToken = ''; status.textContent = 'A tiny storm in the security check. Please try it again.'; } });
    $('[data-send-label]').textContent = 'Seal it & set it sailing!';
    $('[data-post-note]').textContent = 'One wish per device each day. No name, no account, just your birthday message.';
  }
  if (connected) preparePost().catch(error => { status.textContent = error.message; $('[data-send-label]').textContent = 'Try the birthday post'; });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    const text = message.value.trim(); const length = [...text].length;
    if (length < 10 || length > 600) { status.textContent = 'Give your wish a little heart: 10 to 600 characters, please!'; message.setAttribute('aria-invalid', 'true'); message.focus(); return; }
    if (!connected) { showBottle(text, false); return; }
    if (!challenge || !window.turnstile) { try { await preparePost(); } catch (error) { status.textContent = error.message; } return; }
    if (!botToken) { status.textContent = 'Finish the quick security check before your bottle sets sail.'; return; }
    busy = true; send.disabled = true; status.textContent = ''; $('[data-send-label]').textContent = 'Setting sail…';
    try {
      const response = await fetch(`${api}/api/wishes`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: text, website: form.elements.website.value, challenge: challenge.token, turnstileToken: botToken }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Your wish could not set sail. Please try again.');
      showBottle(text, true); form.reset(); $('[data-char-count]').textContent = '0'; botToken = ''; challenge = null;
      try { await preparePost(); } catch { status.textContent = 'Your wish was saved. Reload if you want to write another later.'; }
    } catch (error) {
      status.textContent = error.message; botToken = ''; challenge = null;
      try { await preparePost(); } catch { /* Keep the first error and written message. */ }
    } finally { busy = false; send.disabled = false; $('[data-send-label]').textContent = 'Seal it & set it sailing!'; }
  });
})();
