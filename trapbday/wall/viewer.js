'use strict';

const byId = id => document.getElementById(id);
const stage = byId('mural-stage');
const overview = byId('mural-overview');
const status = byId('stage-status');

async function startMural() {
  await overview.decode();
  enableViewer(TRAP_MURAL);
}

function enableViewer({ width, height, paintings, standard, detail }) {
  const shell = byId('mural-shell');
  const cameraLayer = byId('mural-camera');
  const tileLayer = byId('mural-tiles');
  const detailLayer = byId('mural-detail');
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const zoomIn = byId('zoom-in'), zoomOut = byId('zoom-out'), fitButton = byId('fit-wall');
  const zoomValue = byId('zoom-value');
  const mounted = new Map();
  const detailed = new Map();
  const pointers = new Map();
  let viewportWidth = 0, viewportHeight = 0, fit = 1, maxScale = 1;
  let camera, motion, frame, gesture, lastTap, selected, wheelSettle;
  let detailView, detailTimer;
  let velocity = { x: 0, y: 0 };

  const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
  function bounded({ x, y, scale }) {
    const boardWidth = width * scale, boardHeight = height * scale;
    const constrain = (offset, boardSize, viewportSize) => boardSize <= viewportSize
      ? (viewportSize - boardSize) / 2
      : clamp(offset, viewportSize - boardSize, 0);
    return { x: constrain(x, boardWidth, viewportWidth), y: constrain(y, boardHeight, viewportHeight), scale };
  }

  function inView([left, top, wide, tall], view, margin = 0) {
    const x = view.x + left * view.scale, y = view.y + top * view.scale;
    return x < viewportWidth + margin && y < viewportHeight + margin
      && x + wide * view.scale > -margin && y + tall * view.scale > -margin;
  }

  function tileImage(src, layer, images) {
    const img = new Image();
    img.alt = '';
    img.decoding = 'async';
    img.draggable = false;
    img.addEventListener('load', () => img.classList.add('ready'), { once: true });
    img.src = src;
    layer.append(img);
    images.set(src, img);
    return img;
  }

  function removeOffscreen(images, visible) {
    for (const [src, img] of images) {
      if (visible.has(src)) continue;
      img.remove();
      images.delete(src);
    }
  }

  function drawTiles() {
    const threshold = fit * 1.7;
    const visible = new Set();
    if (camera.scale > threshold) {
      for (const { box, src } of standard) {
        if (!inView(box, camera, 48)) continue;
        if (!mounted.has(src)) {
          if (motion?.target && (motion.target.scale <= threshold || !inView(box, motion.target, 48))) continue;
          const [left, top, wide, tall] = box;
          const img = tileImage(src, tileLayer, mounted);
          img.style.left = `${left / width * 100}%`;
          img.style.top = `${top / height * 100}%`;
          img.style.width = `${wide / width * 100}%`;
          img.style.height = `${tall / height * 100}%`;
        }
        visible.add(src);
      }
    }
    removeOffscreen(mounted, visible);
  }

  function drawDetail() {
    clearTimeout(detailTimer);
    const view = camera;
    const [, , tileWidth, tileHeight] = detail[0].box;
    // Limit how many vector tiles can be visible at once, including on wide screens.
    const detailScale = Math.max(fit * 1.7, viewportWidth / (5 * tileWidth), viewportHeight / (5 * tileHeight));
    if (view.scale <= detailScale) {
      detailLayer.hidden = true;
      detailView = null;
      for (const img of detailed.values()) img.remove();
      detailed.clear();
      return;
    }
    detailLayer.hidden = detailView !== view;
    if (detailView === view || motion || pointers.size || wheelSettle) return;

    // Render the original strokes at their final screen size, outside the moving camera.
    detailTimer = setTimeout(() => {
      if (camera !== view || motion || pointers.size || wheelSettle) return;
      const visible = new Set();
      for (const { box, src } of detail) {
        if (!inView(box, view)) continue;
        const [left, top, wide, tall] = box;
        const img = detailed.get(src) || tileImage(src, detailLayer, detailed);
        img.style.left = `${view.x + left * view.scale}px`;
        img.style.top = `${view.y + top * view.scale}px`;
        img.style.width = `${wide * view.scale}px`;
        img.style.height = `${tall * view.scale}px`;
        visible.add(src);
      }
      removeOffscreen(detailed, visible);
      detailView = view;
      detailLayer.hidden = false;
    }, 110);
  }

  function draw() {
    const { x, y, scale } = camera;
    cameraLayer.style.transform = `translate3d(${x}px,${y}px,0) scale(${scale / fit})`;
    drawTiles();
    drawDetail();
    const label = `${Math.round(scale / fit * 100)}%`;
    if (zoomValue.textContent !== label) zoomValue.textContent = label;
    const zoomed = scale > fit;
    stage.toggleAttribute('data-zoomed', zoomed);
    zoomOut.disabled = fitButton.disabled = !zoomed;
    zoomIn.disabled = scale >= maxScale;
  }

  function renderFrame(now) {
    frame = null;
    if (motion?.target) {
      const { from, target, start, duration } = motion;
      const time = clamp((now - start) / duration, 0, 1);
      const eased = 1 - (1 - time) ** 3;
      const scale = from.scale * (target.scale / from.scale) ** eased;
      const progress = target.scale === from.scale ? eased : (scale - from.scale) / (target.scale - from.scale);
      camera = time === 1 ? target : bounded({
        x: from.x + (target.x - from.x) * progress, y: from.y + (target.y - from.y) * progress, scale,
      });
      if (time === 1) motion = null;
    } else if (motion) {
      const elapsed = clamp(now - motion.previous, 0, 32);
      motion.previous = now;
      const next = bounded({ x: camera.x + motion.x * elapsed, y: camera.y + motion.y * elapsed, scale: camera.scale });
      const fade = Math.exp(-elapsed / 82);
      motion.x = next.x === camera.x && elapsed ? 0 : motion.x * fade;
      motion.y = next.y === camera.y && elapsed ? 0 : motion.y * fade;
      camera = next;
      if (Math.hypot(motion.x, motion.y) < .035) motion = null;
    }
    draw();
    if (motion) queueDraw();
  }

  function queueDraw() {
    if (frame == null) frame = requestAnimationFrame(renderFrame);
  }
  function moveTo(target, duration = 200) {
    lastTap = null;
    target = bounded(target);
    if (reduceMotion.matches) {
      motion = null;
      camera = target;
    } else motion = { from: camera, target, start: performance.now(), duration };
    queueDraw();
  }
  function zoom(factor, point = { x: viewportWidth / 2, y: viewportHeight / 2 }, animate = true) {
    lastTap = null;
    const base = motion?.target || camera;
    const scale = clamp(base.scale * factor, fit, maxScale);
    const ratio = scale / base.scale;
    const next = { x: point.x - (point.x - base.x) * ratio, y: point.y - (point.y - base.y) * ratio, scale };
    if (animate) moveTo(next, 165);
    else {
      motion = null;
      camera = bounded(next);
      queueDraw();
    }
  }
  function fitWall() {
    setSelected(null);
    moveTo({ x: 0, y: 0, scale: fit });
  }
  function toggleZoom(point) {
    if (camera.scale > fit * 1.01) fitWall();
    else zoom(4, point);
  }

  function resize() {
    const oldWidth = viewportWidth, oldHeight = viewportHeight, oldFit = fit;
    viewportWidth = stage.clientWidth;
    viewportHeight = stage.clientHeight;
    if (!viewportWidth || !viewportHeight) return;
    if (viewportWidth === oldWidth && viewportHeight === oldHeight) return;
    fit = Math.min(viewportWidth / width, viewportHeight / height);
    maxScale = Math.max(fit, Math.min(fit * 40, 1.05));
    const scale = camera ? clamp(camera.scale / oldFit * fit, fit, maxScale) : fit;
    const x = camera ? viewportWidth / 2 - (oldWidth / 2 - camera.x) * scale / camera.scale : 0;
    const y = camera ? viewportHeight / 2 - (oldHeight / 2 - camera.y) * scale / camera.scale : 0;
    motion = null;
    lastTap = null;
    camera = bounded({ x, y, scale });
    cameraLayer.style.width = `${width * fit}px`;
    cameraLayer.style.height = `${height * fit}px`;
    if (gesture) beginGesture(gesture.moved);
    queueDraw();
  }
  function clientPoint(event) {
    const bounds = stage.getBoundingClientRect();
    return { x: event.clientX - bounds.left - stage.clientLeft, y: event.clientY - bounds.top - stage.clientTop };
  }
  function pointerState() {
    const [a, b] = pointers.values();
    return b ? { x: (a.x + b.x) / 2, y: (a.y + b.y) / 2, distance: Math.max(1, Math.hypot(a.x - b.x, a.y - b.y)) }
      : { ...a, distance: 0 };
  }
  function beginGesture(moved = false) {
    const bounds = stage.getBoundingClientRect();
    gesture = { start: pointerState(), view: camera, moved, left: bounds.left + stage.clientLeft, top: bounds.top + stage.clientTop, time: performance.now() };
    velocity = { x: 0, y: 0 };
  }

  stage.addEventListener('pointerdown', event => {
    if (event.button !== 0 || pointers.size >= 2) return;
    motion = null;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (pointers.size > 1) lastTap = null;
    stage.setPointerCapture(event.pointerId);
    beginGesture(pointers.size > 1 || gesture?.moved);
    stage.classList.add('dragging');
  });
  stage.addEventListener('pointermove', event => {
    if (!pointers.has(event.pointerId)) return;
    pointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    const { start, view, left, top } = gesture;
    const next = pointerState();
    if (!gesture.moved && Math.hypot(next.x - start.x, next.y - start.y) < 5) return;
    gesture.moved = true;
    lastTap = null;
    if (!start.distance && view.scale <= fit) return;
    const scale = clamp(view.scale * (start.distance ? next.distance / start.distance : 1), fit, maxScale);
    const ratio = scale / view.scale;
    const nextCamera = bounded({ x: next.x - left - (start.x - left - view.x) * ratio, y: next.y - top - (start.y - top - view.y) * ratio, scale });
    const now = performance.now(), elapsed = Math.max(4, now - gesture.time);
    if (!start.distance) {
      velocity.x = velocity.x * .35 + (nextCamera.x - camera.x) / elapsed * .65;
      velocity.y = velocity.y * .35 + (nextCamera.y - camera.y) / elapsed * .65;
    }
    gesture.time = now;
    camera = nextCamera;
    queueDraw();
  });

  function finishPointer(event) {
    if (!pointers.delete(event.pointerId)) return;
    if (pointers.size) { beginGesture(true); return; }
    const finished = gesture;
    gesture = null;
    stage.classList.remove('dragging');
    if (event.type === 'pointerup' && !finished.moved && performance.now() - finished.time < 350) {
      const point = clientPoint(event), now = performance.now();
      const tolerance = event.pointerType === 'mouse' ? 10 : 28;
      if (lastTap && lastTap.type === event.pointerType && now - lastTap.time < 320
        && Math.hypot(point.x - lastTap.x, point.y - lastTap.y) < tolerance) {
        toggleZoom(point);
      } else {
        lastTap = { ...point, time: now, type: event.pointerType };
        selectAt(point);
      }
    } else {
      lastTap = null;
      if (event.type === 'pointerup' && event.pointerType === 'touch' && !reduceMotion.matches
        && performance.now() - finished.time < 75 && Math.hypot(velocity.x, velocity.y) > .12) {
        motion = { x: clamp(velocity.x, -2.5, 2.5), y: clamp(velocity.y, -2.5, 2.5), previous: performance.now() };
      }
    }
    queueDraw();
  }
  for (const event of ['pointerup', 'pointercancel', 'lostpointercapture']) stage.addEventListener(event, finishPointer);
  stage.addEventListener('wheel', event => {
    event.preventDefault();
    const delta = event.deltaY * (event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? viewportHeight : 1);
    const point = event.target === stage ? { x: event.offsetX, y: event.offsetY } : clientPoint(event);
    clearTimeout(wheelSettle);
    wheelSettle = setTimeout(() => { wheelSettle = null; queueDraw(); }, 100);
    zoom(Math.exp(-clamp(delta, -160, 160) * .004), point, false);
  }, { passive: false });

  const findButton = byId('find-button'), findDialog = byId('find-dialog'), query = byId('name-query');
  const nameList = byId('name-list'), resultCount = byId('result-count'), selection = byId('mural-selection');
  const wishDialog = byId('wish-dialog');
  function setSelected(painting) {
    selected = painting;
    selection.hidden = !painting;
    byId('selected-name').textContent = painting?.name || '';
  }
  function selectAt(point) {
    if (camera.scale < fit * 2) return;
    const x = (point.x - camera.x) / camera.scale, y = (point.y - camera.y) / camera.scale;
    setSelected(paintings.find(({ box: [left, top, wide, tall] }) => x >= left && x < left + wide && y >= top && y < top + tall));
  }
  function centerPainting(painting) {
    const [left, top, wide, tall] = painting.box;
    const scale = clamp(Math.min(viewportWidth / wide, viewportHeight / tall) * .83, fit, maxScale);
    setSelected(painting);
    moveTo({ x: viewportWidth / 2 - (left + wide / 2) * scale, y: viewportHeight / 2 - (top + tall / 2) * scale, scale }, 290);
  }
  const normalize = name => name.normalize('NFKC').toLocaleLowerCase();
  const sorted = [...paintings].sort((a, b) => a.name.localeCompare(b.name));
  function listNames() {
    const needle = normalize(query.value.trim());
    const matches = sorted.filter(painting => normalize(painting.name).includes(needle));
    resultCount.textContent = matches.length ? `${matches.length} ${matches.length === 1 ? 'painting' : 'paintings'}` : 'No matching names.';
    const items = document.createDocumentFragment();
    for (const painting of matches) {
      const row = document.createElement('li'), button = document.createElement('button');
      button.type = 'button';
      button.dir = 'auto';
      button.textContent = painting.name;
      if (painting === selected) button.setAttribute('aria-current', 'true');
      button.addEventListener('click', () => { findDialog.close(); centerPainting(painting); stage.focus({ preventScroll: true }); });
      row.append(button);
      items.append(row);
    }
    nameList.replaceChildren(items);
  }
  findButton.addEventListener('click', () => { listNames(); findDialog.showModal(); });
  query.addEventListener('input', listNames);
  byId('read-button').addEventListener('click', () => {
    if (!selected) return;
    byId('wish-title').textContent = selected.name;
    byId('wish-message').textContent = selected.message;
    wishDialog.showModal();
  });

  zoomIn.addEventListener('click', () => zoom(1.5));
  zoomOut.addEventListener('click', () => zoom(1 / 1.5));
  fitButton.addEventListener('click', fitWall);
  stage.addEventListener('keydown', event => {
    if (event.ctrlKey || event.metaKey || event.altKey) return;
    const step = event.shiftKey ? 140 : 50;
    const arrows = { ArrowLeft: [step, 0], ArrowRight: [-step, 0], ArrowUp: [0, step], ArrowDown: [0, -step] };
    if (arrows[event.key]) {
      const [x, y] = arrows[event.key];
      const base = motion?.target || camera;
      moveTo({ x: base.x + x, y: base.y + y, scale: base.scale }, 140);
    } else if (event.key === '+' || event.key === '=') zoom(1.5);
    else if (event.key === '-') zoom(1 / 1.5);
    else if (event.key === '0' || event.key === 'Home') fitWall();
    else return;
    event.preventDefault();
  });
  const expand = byId('expand-wall');
  if (document.fullscreenEnabled && shell.requestFullscreen) {
    expand.disabled = false;
    expand.addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await shell.requestFullscreen();
      } catch { /* Fullscreen can be denied by the embedding browser. */ }
    });
    document.addEventListener('fullscreenchange', () => {
      const label = document.fullscreenElement ? 'Exit fullscreen' : 'Enter fullscreen';
      expand.setAttribute('aria-label', label);
      expand.title = label;
    });
  } else expand.hidden = true;

  byId('mural-count').textContent = `${paintings.length} paintings · Made for Trap`;
  findButton.disabled = false;
  resize();
  new ResizeObserver(resize).observe(stage);
}

startMural().catch(() => {
  status.hidden = false;
});
