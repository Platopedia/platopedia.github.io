const SVG_NS = 'http://www.w3.org/2000/svg';
const READ_KEY = 'f2-sea-opened-v1';
const COLORS = ['#80c9b1', '#93c9cb', '#b9c792', '#8db6ca', '#cbb98a', '#9dbfaf'];

export function shuffle(items, random = Math.random) {
  const result = [...items];
  for (let n = result.length - 1; n > 0; n--) { const at = Math.floor(random() * (n + 1)); [result[n], result[at]] = [result[at], result[n]]; }
  return result;
}

// Stratified randomness keeps drifting bottles apart and safely inside the water.
export function bottleLayout(width, height, count, random = Math.random) {
  const columns = width < 420 ? 3 : width < 740 ? 4 : 6;
  const visible = Math.min(count, columns * 4);
  const rows = Math.ceil(visible / columns);
  const baseWidth = width < 420 ? 64 : 76, baseHeight = width < 420 ? 100 : 117;
  return Array.from({ length: visible }, (_, n) => {
    const row = Math.floor(n / columns), col = n % columns;
    const inRow = Math.min(columns, visible - row * columns);
    const cellWidth = width / inRow, cellHeight = height / Math.max(rows, 4);
    const angle = 19 * Math.PI / 180;
    const scale = Math.min(.68 + row * .04 + random() * .05, (cellWidth - 14) / (baseWidth * Math.cos(angle) + baseHeight * Math.sin(angle)), (cellHeight - 14) / (baseHeight * Math.cos(angle) + baseWidth * Math.sin(angle)));
    const safeWidth = (baseWidth * Math.cos(angle) + baseHeight * Math.sin(angle)) * scale + 12;
    const safeHeight = (baseHeight * Math.cos(angle) + baseWidth * Math.sin(angle)) * scale + 12;
    const jitterX = Math.max(0, (cellWidth - safeWidth) / 3);
    const jitterY = Math.max(0, (cellHeight - safeHeight) / 3);
    return { x: cellWidth * (col + .5) + (random() - .5) * jitterX, y: cellHeight * (row + .5) + (random() - .5) * jitterY + (4 - rows) * cellHeight / 2,
      scale, tilt: (random() - .5) * 30, duration: 5 + random() * 4, delay: -random() * 9, color: COLORS[Math.floor(random() * COLORS.length)], safeWidth, safeHeight, baseWidth, baseHeight };
  });
}

export function safeFeed(data) {
  if (!data || !Array.isArray(data.wishes) || !Number.isSafeInteger(data.total) || data.total < data.wishes.length || data.total > 10000 || data.wishes.length > 32) throw new Error('Invalid tide.');
  if (data.nextCursor !== null && (typeof data.nextCursor !== 'string' || !/^[1-9]\d{0,4}$/.test(data.nextCursor) || Number(data.nextCursor) > 10000)) throw new Error('Invalid tide.');
  const seen = new Set();
  const wishes = data.wishes.map(wish => {
    if (!wish || typeof wish.id !== 'string' || !/^sea_[A-Za-z0-9_-]{22}$/.test(wish.id) || seen.has(wish.id) || typeof wish.message !== 'string' || [...wish.message].length > 600 || wish.message.length < 10 || typeof wish.senderName !== 'string' || [...wish.senderName].length > 40) throw new Error('Invalid bottle.');
    seen.add(wish.id);
    return { id: wish.id, message: wish.message, senderName: wish.senderName };
  });
  return { wishes, total: data.total, nextCursor: data.nextCursor };
}

export function pickWish(wishes, currentId, random = Math.random) {
  const others = wishes.filter(wish => wish.id !== currentId);
  const pool = others.length ? others : wishes;
  return pool.length ? pool[Math.floor(random() * pool.length)] : null;
}

export const SAMPLE_WISHES = [
  { senderName: 'A fellow nakama', message: 'Happy birthday, F2! Here’s to the people who turn an ordinary day into a good one. You’re one of them. Hope today gives you a little of that love back. ❤️' },
  { senderName: '', message: 'Another year, another adventure. Wishing you good company, ridiculous laughs, and a birthday you’ll still be talking about next year. Have the best day, F2!' },
  { senderName: 'The birthday crew', message: 'Captain’s orders for today: eat something good, accept all the birthday love, and let someone else do the planning for once. Happy birthday, F2! 🏴‍☠️' },
  { senderName: '', message: 'Hope this year brings you more of what makes you happy, and a few lovely surprises you didn’t even know you needed. Happy birthday, F2. You deserve a good one.' },
  { senderName: 'Someone from Arcade', message: 'Happy birthday to the reason we’re all here causing chaos! Thanks for the memories, the games, and the company. Same time next year? 🎂' },
  { senderName: 'Your navigator', message: 'I was going to write a very serious birthday speech, but the tide took it. So: happy birthday, F2. Very glad we crossed paths. Here’s to plenty more adventures together.' },
  { senderName: '', message: 'A tiny wish from across the sea: may you feel properly celebrated today. Not just for your birthday, but for the person you are. Much love, F2. 💛' },
  { senderName: 'A wandering pirate', message: 'Good food, good friends, and absolutely no responsibilities. That’s my birthday wish for you. Happy birthday, F2! Save us some cake.' },
  { senderName: 'One of your people', message: 'Some of the best friendships start with one random game. Really glad ours did. Happy birthday, F2! Let’s make some more memories.' },
  { senderName: '', message: 'No grand speech from me. Just a happy birthday, a big thank you, and a little wish that this next year treats you kindly. Have a lovely day, F2. ❤️' },
  { senderName: 'The cake lookout', message: 'The treasure has been located. It’s cake. Wishing you the biggest slice and a day full of your favourite people. Happy birthday, captain!' },
  { senderName: '', message: 'Happy birthday, F2! Sending a little birthday love your way. Hope there’s plenty to smile about today, and even more waiting around the corner.' },
].map((wish, n) => ({ id: `sea_${String(n).padStart(22, '0')}`, ...wish }));

export function mountSea(root, { config = globalThis.F2_BIRTHDAY_CONFIG || {}, fetcher = globalThis.fetch.bind(globalThis), location = globalThis.location, storage } = {}) {
  const find = selector => root.querySelector(selector);
  const elements = Object.fromEntries(['bottles', 'water', 'letter', 'random', 'shuffle', 'pause', 'retry'].map(name => [name, find(`[data-${name}]`)]));
  let wishes = [], total = 0, cursor = null, pageCursor = null, current = null, trigger = null, loading = false, paused = false, resizeTimer, refreshTimer, requestController;
  let surfaced = new Set(), visibleWishes = [];
  let read = new Set();
  try { storage ||= globalThis.sessionStorage; const saved = JSON.parse(storage.getItem(READ_KEY) || '[]'); if (Array.isArray(saved)) read = new Set(saved.filter(id => /^sea_[A-Za-z0-9_-]{22}$/.test(id)).slice(-500)); } catch { /* The sea works when browser storage is unavailable. */ }
  const preview = location.origin !== new URL(config.eventPageUrl || 'https://platopedia.com/f2birthday/').origin;
  find('[data-sample-label]').hidden = !preview;
  const motion = globalThis.matchMedia?.('(prefers-reduced-motion: reduce)');
  function setPaused(value) { paused = value; root.dataset.paused = String(value || elements.letter.open); elements.pause.setAttribute('aria-pressed', String(value)); find('[data-pause-label]').textContent = value ? 'Let it drift' : 'Pause the sea'; }
  setPaused(motion?.matches || false);
  motion?.addEventListener('change', event => setPaused(event.matches));
  const setText = (selector, text) => { find(selector).textContent = text; };
  function remember(id) {
    read.delete(id); read.add(id); if (read.size > 500) read.delete(read.values().next().value);
    try { storage.setItem(READ_KEY, JSON.stringify([...read])); } catch { /* Storage is optional. */ }
  }
  function updateRead() {
    for (const button of elements.bottles.querySelectorAll('button')) { const opened = read.has(button.dataset.id); button.classList.toggle('is-read', opened); button.setAttribute('aria-label', `${opened ? 'Read again' : 'Open'} birthday wish ${button.dataset.number}`); }
    const opened = wishes.filter(wish => read.has(wish.id)).length;
    setText('[data-read-note]', wishes.length ? `${opened} of ${wishes.length} bottles on this tide opened${preview ? ' · Sample wishes' : ' · Approved wishes only'}` : 'Every bottle holds a wish approved for the sea.');
  }
  function render(newTide = false) {
    const width = elements.bottles.clientWidth, height = elements.bottles.clientHeight;
    if (!width || !height) return;
    const layout = bottleLayout(width, height, wishes.length);
    if (newTide || !visibleWishes.length) visibleWishes = [...shuffle(wishes.filter(wish => !surfaced.has(wish.id))), ...shuffle(wishes.filter(wish => surfaced.has(wish.id)))];
    elements.bottles.replaceChildren();
    layout.forEach((point, n) => {
      const wish = visibleWishes[n], button = document.createElement('button'), art = document.createElement('span');
      surfaced.add(wish.id);
      button.type = 'button'; button.className = 'sea-bottle'; button.dataset.id = wish.id; button.dataset.number = String(n + 1);
      button.style.left = `${point.x}px`; button.style.top = `${point.y}px`; button.style.width = `${point.baseWidth * point.scale}px`; button.style.height = `${point.baseHeight * point.scale}px`;
      for (const [key, value] of Object.entries({ '--glass': point.color, '--tilt': `${point.tilt}deg`, '--duration': `${point.duration}s`, '--delay': `${point.delay}s`, '--arrival': `${Math.min(n * .025, .35)}s` })) button.style.setProperty(key, value);
      art.className = 'sea-bottle-art'; const svg = document.createElementNS(SVG_NS, 'svg'), use = document.createElementNS(SVG_NS, 'use');
      svg.setAttribute('viewBox', '0 0 90 140'); svg.setAttribute('aria-hidden', 'true'); use.setAttribute('href', '#sea-bottle'); svg.append(use); art.append(svg); button.append(art);
      button.addEventListener('click', () => openWish(wish, button)); elements.bottles.append(button);
    });
    updateRead();
  }
  function showMessage(state, title, detail) {
    root.dataset.seaState = state; find('[data-sea-message]').hidden = false;
    setText('[data-message-title]', title); setText('[data-message-detail]', detail);
    elements.retry.hidden = state !== 'error'; find('[data-empty-link]').hidden = state !== 'empty';
    find('[data-tap-hint]').hidden = true;
  }
  function populateLetter(wish) {
    current = wish; remember(wish.id);
    setText('[data-letter-message]', wish.message); setText('[data-letter-from]', wish.senderName || 'An anonymous nakama');
    setText('[data-letter-note]', preview ? 'Preview bottle · this is a sample wish.' : 'A birthday wish, sent with love.');
    find('[data-next]').disabled = wishes.length < 2;
    find('[data-letter-message]').scrollTop = 0;
    updateRead();
  }
  function openWish(wish, button) {
    if (!wish) return;
    trigger = button || document.activeElement; populateLetter(wish);
    if (!elements.letter.open) {
      elements.letter.showModal();
      // Start at the letter heading instead of highlighting the close button.
      find('[data-letter-heading]').focus({ preventScroll: true });
    }
    root.dataset.paused = 'true';
  }
  function closeLetter() { elements.letter.close(); }
  elements.letter.addEventListener('close', () => { current = null; setPaused(paused); (trigger?.isConnected ? trigger : find('.sea-send'))?.focus({ preventScroll: true }); });
  elements.letter.addEventListener('click', event => { if (event.target !== elements.letter) return; const bounds = elements.letter.getBoundingClientRect(); if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closeLetter(); });
  find('[data-close]').addEventListener('click', closeLetter); find('[data-return]').addEventListener('click', closeLetter);
  find('[data-next]').addEventListener('click', () => populateLetter(pickWish(wishes, current?.id)));
  elements.random.addEventListener('click', () => openWish(pickWish(wishes, current?.id), elements.random));
  elements.pause.addEventListener('click', () => setPaused(!paused));
  async function load({ next = false, quiet = false } = {}) {
    if (loading) return; loading = true;
    elements.shuffle.disabled = true; elements.retry.disabled = true;
    if (!quiet && !wishes.length) showMessage('loading', 'Following the tide…', 'Your bottles are on their way.');
    try {
      let feed;
      if (preview) feed = { wishes: SAMPLE_WISHES, total: SAMPLE_WISHES.length, nextCursor: null };
      else {
        const api = new URL('/api/bottles', config.wishesApi);
        const requestedCursor = next ? cursor : quiet ? pageCursor : null;
        if (requestedCursor) api.searchParams.set('cursor', requestedCursor);
        requestController = new AbortController();
        const timeout = setTimeout(() => requestController.abort(), 25000);
        try {
          const readTide = async () => { const response = await fetcher(api.href, { credentials: 'omit', cache: 'no-store', signal: requestController.signal }); if (!response.ok) throw new Error('Tide unavailable.'); return safeFeed(await response.json()); };
          feed = await readTide(); pageCursor = requestedCursor;
          // Rows may have been removed since a previous page was fetched.
          if (!feed.wishes.length && feed.total > 0 && requestedCursor) { api.searchParams.delete('cursor'); feed = await readTide(); pageCursor = null; }
        }
        finally { clearTimeout(timeout); }
      }
      const unchanged = quiet && JSON.stringify(wishes) === JSON.stringify(feed.wishes);
      wishes = feed.wishes; total = feed.total; cursor = feed.nextCursor;
      if (!unchanged) { surfaced = new Set(); visibleWishes = []; }
      if (current && !unchanged) {
        const refreshed = wishes.find(wish => wish.id === current.id);
        if (!refreshed) closeLetter(); else populateLetter(refreshed);
      }
      setText('[data-sea-count]', `${total.toLocaleString()} ${total === 1 ? 'wish' : 'wishes'} ${preview ? 'in the preview' : 'afloat for F2'}`);
      if (wishes.length) { root.dataset.seaState = 'ready'; find('[data-sea-message]').hidden = true; find('[data-tap-hint]').hidden = false; if (!unchanged) render(true); }
      else { elements.bottles.replaceChildren(); showMessage('empty', 'The sea is waiting.', 'The first birthday bottles will float in once their wishes are approved.'); updateRead(); }
    } catch {
      // Do not keep expired public messages visible if approvals cannot be refreshed.
      wishes = []; cursor = null; elements.bottles.replaceChildren();
      if (elements.letter.open) closeLetter();
      showMessage('error', 'A little pause in the tide.', 'We couldn’t bring the bottles in just now. Give it a moment, then try again.');
      setText('[data-sea-count]', 'Waiting for the tide'); updateRead();
    } finally {
      loading = false; elements.shuffle.disabled = !wishes.length; elements.random.disabled = !wishes.length; elements.retry.disabled = false;
      clearTimeout(refreshTimer);
      if (!preview && !document.hidden) refreshTimer = setTimeout(() => load({ quiet: true }), 60000);
    }
  }
  elements.shuffle.addEventListener('click', () => {
    if (wishes.some(wish => !surfaced.has(wish.id))) render(true);
    else if (cursor) load({ next: true });
    else if (!preview && total > wishes.length) load();
    else { surfaced = new Set(); render(true); }
  });
  elements.retry.addEventListener('click', () => load());
  document.addEventListener('visibilitychange', () => { root.dataset.background = String(document.hidden); if (document.hidden) clearTimeout(refreshTimer); else if (!preview) load({ quiet: true }); });
  if (typeof ResizeObserver !== 'undefined') new ResizeObserver(() => { clearTimeout(resizeTimer); resizeTimer = setTimeout(render, 120); }).observe(elements.bottles);
  else globalThis.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(render, 120); });
  globalThis.addEventListener('pagehide', () => { clearTimeout(refreshTimer); clearTimeout(resizeTimer); requestController?.abort(); });
  load();
  return { load, openWish };
}

if (typeof document !== 'undefined') {
  const root = document.querySelector('#f2-wishsea');
  if (root) mountSea(root);
}
