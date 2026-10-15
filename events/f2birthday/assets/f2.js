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
    $('.f2-countdown').setAttribute('aria-label', time ? `${next.days} days, ${next.hours} hours, ${next.minutes} minutes, ${next.seconds} seconds until F2's main birthday event` : "F2's main birthday event is here!");
    if (!time) $('[data-birthday-status]').textContent = 'THE MAIN EVENT IS HERE! Let the adventure begin!';
  }
  $('[data-event-label]').textContent = config.eventLabel;
  if (Number.isFinite(date)) { countdown(); setInterval(countdown, 1000); }
  else $('[data-event-label]').textContent = 'The captain is still charting the party date.';
  if (config.groupUrl) {
    $('[data-group-link]').href = config.groupUrl;
    $('[data-group-label]').textContent = config.groupLabel;
    $('[data-group-link]').hidden = false;
    $('[data-group-pending]').hidden = true;
  } else {
    $('[data-group-link]').hidden = true;
    $('[data-group-link]').removeAttribute('href');
    $('[data-group-pending]').hidden = false;
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

  const frameButtons = $$('[data-frame-bg]'); const frameObject = $('[data-frame-object]');
  const frameCaption = $('[data-frame-caption]'); const portraitCache = new Map();
  let frameSelection = 0, frameErrorCaption = null;
  function warmPortrait(src) {
    if (!portraitCache.has(src)) {
      const image = new Image(); image.loading = 'eager'; image.decoding = 'async'; image.fetchPriority = 'low';
      const entry = { image, ready: null }; portraitCache.set(src, entry);
      let loaded;
      if (typeof image.decode === 'function') { image.src = src; loaded = image.decode(); }
      else loaded = new Promise((resolve, reject) => { image.onload = resolve; image.onerror = reject; image.src = src; });
      entry.ready = loaded.then(() => image).catch(() => { portraitCache.delete(src); return null; });
    }
    return portraitCache.get(src);
  }
  function selectFrameButton(active) {
    for (const button of frameButtons) { button.classList.toggle('is-active', button === active); button.setAttribute('aria-pressed', String(button === active)); }
  }
  // Warm both preview choices at low priority while the hero illustration loads.
  for (const button of frameButtons) if (button.dataset.frameSrc) warmPortrait(button.dataset.frameSrc);
  for (const button of frameButtons) button.addEventListener('click', async () => {
    const selection = ++frameSelection;
    const character = button.dataset.frameBg;
    for (const other of frameButtons) other.removeAttribute('aria-busy');
    selectFrameButton(button);
    if (character === 'clear') {
      frameObject.classList.add('is-clear');
      if (frameErrorCaption !== null) { frameCaption.textContent = frameErrorCaption; frameErrorCaption = null; }
      return;
    }
    if (button.dataset.frameSrc) {
      const entry = warmPortrait(button.dataset.frameSrc); entry.image.fetchPriority = 'high';
      button.setAttribute('aria-busy', 'true');
      const ready = await entry.ready;
      if (selection !== frameSelection) return;
      button.removeAttribute('aria-busy');
      if (!ready) {
        const current = frameObject.classList.contains('is-clear') ? 'clear' : frameObject.dataset.frameCharacter;
        selectFrameButton([...frameButtons].find(control => control.dataset.frameBg === current));
        if (frameErrorCaption === null) frameErrorCaption = frameCaption.textContent;
        frameCaption.textContent = 'That portrait couldn’t load. Tap again to retry.';
        return;
      }
      const portrait = $('[data-frame-avatar] img');
      portrait.loading = 'eager'; portrait.decoding = 'async'; portrait.src = button.dataset.frameSrc;
      portrait.alt = button.dataset.frameAlt;
      frameObject.dataset.frameCharacter = character; frameObject.classList.remove('is-clear');
      if (frameErrorCaption !== null) { frameCaption.textContent = frameErrorCaption; frameErrorCaption = null; }
    }
  });
  if (config.frameUrl) {
    $('[data-frame-preview]').src = config.frameUrl; $('[data-frame-preview]').alt = "F2's birthday frame";
    $('[data-frame-caption]').textContent = 'F2’s birthday frame';
    $('[data-frame-details]').textContent = 'Download the birthday frame and give your profile the crew treatment.';
    $('[data-download-frame]').innerHTML = 'Grab your birthday frame <span aria-hidden="true">↓</span>';
    $('[data-download-caption]').textContent = 'Birthday frame · transparent background';
  }
  $('[data-download-frame]').addEventListener('click', async () => {
    const button = $('[data-download-frame]'); const label = button.innerHTML;
    const preview = $('[data-frame-preview]'); const url = config.frameUrl || preview.dataset.frameDownload || preview.src;
    button.disabled = true;
    try {
      const response = await fetch(url); if (!response.ok) throw new Error('Unavailable frame');
      const objectUrl = URL.createObjectURL(await response.blob());
      const link = document.createElement('a'); link.href = objectUrl; link.download = config.frameFilename || 'f2-birthday-frame.png'; root.append(link); link.click(); link.remove(); setTimeout(() => URL.revokeObjectURL(objectUrl), 10000);
      button.innerHTML = 'Treasure collected! <span aria-hidden="true">✓</span>'; setTimeout(() => { button.innerHTML = label; button.disabled = false; }, 1800);
    } catch {
      const link = document.createElement('a'); link.href = url; link.download = config.frameFilename || 'f2-birthday-frame.png'; link.target = '_blank'; link.rel = 'noopener'; root.append(link); link.click(); link.remove(); button.disabled = false;
      $('[data-download-caption]').textContent = 'The frame opened in a new tab. Save it to collect your treasure.';
    }
  });

  const form = $('[data-wish-form]'); const message = $('#f2-wish-message'); const sender = $('#f2-sender-name'); const status = $('[data-form-status]'); const send = $('.f2-send'); const dialog = $('[data-bottle-dialog]');
  const receipt = $('[data-bottle-receipt]'); const receiptId = $('[data-bottle-id]'); const copyId = $('[data-copy-bottle-id]');
  const copyLabel = $('[data-copy-id-label]'); const copyStatus = $('[data-copy-id-status]'); let receiptVersion = 0;
  const botDialog = $('[data-bot-dialog]'); let awaitingCaptcha = false;
  function stopWaitingForCaptcha() {
    awaitingCaptcha = false;
    if (!busy) { send.disabled = false; $('[data-send-label]').textContent = 'Seal it & set it sailing!'; }
  }
  function openCrewCheck() {
    if (!needsCaptcha || widget === null || botToken || !challenge) return;
    if (!botDialog.open) botDialog.showModal();
  }
  for (const button of $$('[data-close-bot-check]')) button.addEventListener('click', () => { stopWaitingForCaptcha(); botDialog.close(); status.textContent = ''; });
  botDialog.addEventListener('cancel', () => { stopWaitingForCaptcha(); status.textContent = ''; });
  const api = config.wishesApi.replace(/\/$/, '');
  // Match the live event origin; local HTML previews should never try production submissions.
  let liveOrigin = '';
  try { liveOrigin = new URL(config.eventPageUrl).origin; } catch { /* Incomplete settings keep previews available. */ }
  const connected = Boolean(api && liveOrigin.startsWith('https://') && window.location?.origin === liveOrigin);
  let challenge = null, botToken = '', widget = null, busy = false, widgetScript = null, needsCaptcha = true;
  const deviceStorageKey = `f2birthday-device:${api}`;
  const validSeal = token => typeof token === 'string' && token.length <= 2048 && /^[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+$/.test(token);
  let deviceToken = '';
  if (connected) {
    try { const stored = window.localStorage.getItem(deviceStorageKey); if (validSeal(stored)) deviceToken = stored; } catch { /* The current visit can still use an in-memory seal. */ }
  }
  const deviceHeaders = () => deviceToken ? { 'X-F2-Device': deviceToken } : {};
  message.addEventListener('input', () => { $('[data-char-count]').textContent = [...message.value].length; message.removeAttribute('aria-invalid'); status.textContent = ''; });
  sender.addEventListener('input', () => { sender.removeAttribute('aria-invalid'); status.textContent = ''; });
  for (const button of $$('[data-close-bottle]')) button.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { const box = dialog.getBoundingClientRect(); if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close(); });
  copyId.addEventListener('click', async () => {
    if (receipt.hidden || !receiptId.textContent || copyId.disabled) return;
    const id = receiptId.textContent; const version = receiptVersion;
    copyId.disabled = true; copyStatus.textContent = '';
    try {
      if (!window.navigator?.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await window.navigator.clipboard.writeText(id);
      if (version === receiptVersion) { copyLabel.textContent = 'Copied!'; copyStatus.textContent = 'Bottle ID copied. Keep it with your treasure.'; }
    } catch {
      if (version === receiptVersion) {
        const selection = window.getSelection?.();
        if (selection && document.createRange) { const range = document.createRange(); range.selectNodeContents(receiptId); selection.removeAllRanges(); selection.addRange(range); }
        copyLabel.textContent = 'Copy ID'; copyStatus.textContent = 'Select your bottle ID above and copy it. Your wish is safely saved.';
      }
    } finally { if (version === receiptVersion) copyId.disabled = false; }
  });
  function showBottle(text, delivered, senderName, bottleId = '') {
    receiptVersion++;
    const hasId = delivered && typeof bottleId === 'string' && /^[A-Za-z0-9-]{1,64}$/.test(bottleId);
    receipt.hidden = !hasId; receiptId.textContent = hasId ? bottleId : '';
    copyStatus.textContent = ''; copyLabel.textContent = 'Copy ID'; copyId.disabled = false;
    $('[data-dialog-message]').textContent = text;
    $('[data-dialog-sender]').textContent = senderName ? `Signed, ${senderName}` : 'From an anonymous nakama';
    $('[data-dialog-title]').innerHTML = delivered ? 'Wish <em>on board!</em>' : 'That’s a <em>keeper!</em>';
    $('[data-dialog-kicker]').textContent = delivered ? 'ONE VERY HAPPY CAPTAIN, COMING UP.' : 'ONE BOTTLE. LOTS OF HEART.';
    $('[data-dialog-note]').textContent = delivered ? (senderName ? 'Your wish and bottle name are safely saved for F2. Thanks for being part of the crew!' : 'Your anonymous wish is safely saved for F2. Thanks for being part of the crew!') : 'This is a preview. Your wish hasn’t been submitted yet. You can send it when the birthday post opens.';
    dialog.showModal();
  }
  async function getChallenge() {
    const response = await fetch(`${api}/api/challenge`, { credentials: 'include', cache: 'no-store', headers: deviceHeaders() });
    const result = await response.json(); if (!response.ok) throw new Error(result.error || 'The birthday post is taking a little break. Please try later.');
    if (!validSeal(result.deviceToken)) throw new Error('The birthday post could not seal your bottle. Please reload and try again.');
    deviceToken = result.deviceToken;
    try { window.localStorage.setItem(deviceStorageKey, deviceToken); } catch { /* Network quotas remain enforced if local storage is unavailable. */ }
    needsCaptcha = result.captchaEnabled !== false;
    challenge = result;
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
    stopWaitingForCaptcha(); if (botDialog.open) botDialog.close();
    await getChallenge();
    if (widget !== null) { window.turnstile.remove(widget); widget = null; }
    const botCheck = $('[data-bot-check]'); botCheck.classList.remove('is-interactive');
    $('[data-send-label]').textContent = 'Seal it & set it sailing!';
    $('[data-post-note]').textContent = 'Two wishes per device each day. No account needed. Your name is optional.';
    if (!needsCaptcha) return;
    if (!config.turnstileSiteKey) throw new Error('The crew check is not configured. Please try the birthday post later.');
    await loadBotWidget();
    // The top-layer popup fits the full rectangle independently of the narrower poster.
    const showCheck = () => {
      botCheck.classList.add('is-interactive');
      if (awaitingCaptcha) { status.textContent = 'Finish the quick security check and your bottle will set sail.'; openCrewCheck(); }
    };
    const collapseCheck = () => {
      botCheck.classList.remove('is-interactive');
      if (botDialog.open) botDialog.close();
    };
    widget = window.turnstile.render(botCheck, {
      sitekey: config.turnstileSiteKey, theme: 'dark', appearance: 'interaction-only', size: 'normal',
      action: 'birthday-wish', cData: challenge.nonce,
      callback: token => {
        botToken = token; collapseCheck();
        const resumeSubmission = awaitingCaptcha; stopWaitingForCaptcha();
        if (resumeSubmission) form.requestSubmit();
      },
      'before-interactive-callback': showCheck,
      'after-interactive-callback': collapseCheck,
      'expired-callback': () => { botToken = ''; const wasWaiting = awaitingCaptcha; stopWaitingForCaptcha(); collapseCheck(); if (wasWaiting) status.textContent = 'The crew check expired. Seal your bottle again to retry.'; },
      'timeout-callback': () => { botToken = ''; stopWaitingForCaptcha(); collapseCheck(); status.textContent = 'The crew check timed out. Give it a moment, then seal your bottle again.'; },
      'error-callback': () => { botToken = ''; stopWaitingForCaptcha(); collapseCheck(); status.textContent = 'A tiny storm in the security check. Please try it again.'; }
    });
  }
  if (connected) preparePost().catch(error => { status.textContent = error.message; $('[data-send-label]').textContent = 'Try the birthday post'; });
  form.addEventListener('submit', async event => {
    event.preventDefault(); if (busy) return;
    if (awaitingCaptcha) { if ($('[data-bot-check]').classList.contains('is-interactive')) openCrewCheck(); return; }
    const text = message.value.trim(); const length = [...text].length;
    if (length < 10 || length > 600) { status.textContent = 'Give your wish a little heart: 10 to 600 characters, please!'; message.setAttribute('aria-invalid', 'true'); message.focus(); return; }
    const normalizedName = sender.value.normalize('NFKC'); const senderName = normalizedName.trim().replace(/\s+/gu, ' ');
    if (/[\u0000-\u001f\u007f]/u.test(normalizedName) || [...senderName].length > 40 || /(?:https?:\/\/|www\.)/i.test(senderName)) {
      status.textContent = 'Use a name or pirate alias up to 40 characters, without links or line breaks. You can leave it blank.';
      sender.setAttribute('aria-invalid', 'true'); sender.focus(); return;
    }
    if (!connected) { showBottle(text, false, senderName); return; }
    if (!challenge || (needsCaptcha && !window.turnstile)) { try { await preparePost(); } catch (error) { status.textContent = error.message; } return; }
    if (senderName && challenge.senderNameEnabled !== true) { status.textContent = 'Named bottles are getting ready. Leave the name blank to send anonymously, or try again later.'; return; }
    if (needsCaptcha && !botToken) {
      awaitingCaptcha = true; send.disabled = true; $('[data-send-label]').textContent = 'Checking your bottle…';
      const interactive = $('[data-bot-check]').classList.contains('is-interactive');
      status.textContent = interactive ? 'Finish the quick security check and your bottle will set sail.' : 'Your bottle is getting its final check.';
      if (interactive) openCrewCheck();
      return;
    }
    busy = true; send.disabled = true; status.textContent = ''; $('[data-send-label]').textContent = 'Setting sail…';
    try {
      const response = await fetch(`${api}/api/wishes`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', ...deviceHeaders() }, body: JSON.stringify({ message: text, senderName, website: form.elements.website.value, challenge: challenge.token, turnstileToken: botToken }) });
      const result = await response.json(); if (!response.ok) throw new Error(result.error || 'Your wish could not set sail. Please try again.');
      showBottle(text, true, senderName, result.id); form.reset(); $('[data-char-count]').textContent = '0'; botToken = ''; challenge = null;
      try { await preparePost(); } catch { status.textContent = 'Your wish was saved. Reload if you want to write another later.'; }
    } catch (error) {
      status.textContent = error.message; botToken = ''; challenge = null;
      try { await preparePost(); } catch { /* Keep the first error and written message. */ }
    } finally { busy = false; send.disabled = false; $('[data-send-label]').textContent = 'Seal it & set it sailing!'; }
  });
})();
