import { renderPostMarkdown, renderPostTitle } from "./group-feed-markdown.js?v=20261114.1";

(function initGroupFeed() {
  const root = document.querySelector("[data-group-feed]");
  if (!root) return;

  // Reload closes dialogs but preserves their same-URL history entries.
  const abandonedPopups = history.state?.gfPopup?.stack;
  if (Array.isArray(abandonedPopups) && abandonedPopups.length) {
    function resumeFeed() {
      if (history.state?.gfPopup?.stack?.length) return;
      window.removeEventListener("popstate", resumeFeed);
      initGroupFeed();
    }
    window.addEventListener("popstate", resumeFeed);
    history.go(-abandonedPopups.length);
    return;
  }

  const api = new URL(root.dataset.api);
  const mode = root.dataset.mode;
  const isFeed = mode === "feed";
  const isEmbed = mode === "embed";
  let profileSlug = isEmbed ? root.dataset.group : new URLSearchParams(location.search).get("group");
  const find = (name) => root.querySelector(`[data-gf-${name}]`);
  const postsNode = find("posts");
  const status = find("status");
  const more = find("more");
  const dialog = find("dialog");
  const popupScroller = popup => popup.querySelector(".gf-dialog-scroll");
  const dialogScroll = popupScroller(dialog);
  const dialogContent = find("dialog-content");
  const linkDialog = find("link-dialog");
  const regionControls = find("regions");
  const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
  const groupKey = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const postKey = /^\d{17,20}$/;
  const viewButtons = new Map([...root.querySelectorAll('[data-gf-action="view"]')].map(button => [button.dataset.key, button]));
  const palette = ["#1266bf", "#0a747e", "#3e57a1", "#12618c", "#455c7a"];
  const iconPaths = {
    plus: "M12 5v14M5 12h14",
    check: "m5 13 4 4L19 7",
    close: "m6 6 12 12M18 6 6 18",
    external: "M7 17 17 7M7 7h10v10",
    right: "M5 12h14m-6-6 6 6-6 6",
    copy: "M8 8H3v13h13v-5M8 3h13v13H8z",
  };
  const savedKey = "platopedia.groupFeed.saved";
  const followingKey = "platopedia.groupFeed.following";
  const trustedSitesKey = "platopedia.groupFeed.trustedSites";
  const freshFor = 60_000;
  const recoveryCooldown = 10_000;
  const maxRefreshBatch = 100;
  const recentViewLimit = 8;
  // Keep the first-view avatar requests bounded, even with a large directory.
  const initialFeedAvatars = 3;
  const imageRecovery = new WeakMap();
  const failedPostChecks = new Map();
  const pendingPostChecks = new Set();
  let postCheckTimer;
  let checkingPosts = false;

  let route = routeFromUrl();
  const groups = new Map();
  const groupRequestIds = new Map();
  const knownPosts = new Map();
  const renderedPosts = new Map();
  const renderedGroups = new Map();
  const storageSnapshots = new Map();
  let saved = storedSet(savedKey, postKey) ?? new Set();
  let following = storedSet(followingKey, groupKey) ?? new Set();
  const trustedSites = storedSet(trustedSitesKey, /^https?:\/\/[^/?#]+$/) ?? new Set();
  let linkDialogFocus;
  let catalogComplete = false;
  let catalogLoadedAt = 0;
  let catalogRequestId = 0;
  let catalogVersion = -1;
  let latestCatalogVersion = -1;
  let discoveryRequestId = 0;
  const summaries = new Map();
  let feedRequestId = 0;
  let catalogLoad;
  let catalogError = false;
  let sidebarActive = false;
  let sidebarObserver;
  const timelines = new Map();
  let timeline = { key: "", posts: [], cursor: null, loadedAt: 0 };
  let savedView = { posts: [], loaded: new Set(), loadedAt: 0 };
  let activeLoad;
  let activeKey;
  let activeStartedAt = 0;
  let lastRecoveryAt = 0;
  let recoveryRetryAt = 0;
  let errorMessage = "";
  let lastDialogFocus;
  let openDialogItem;
  let searchReturn;
  let lastSearchEntry;
  const popupOwner = `${Date.now()}-${Math.random()}`;
  const popupCloseEvents = new WeakMap();
  let popupSequence = 0;
  let popupStack = [];
  let changingPopupHistory = false;
  let popupHistoryPending = false;
  let popupNavigation;
  let toastTimeout;
  let refreshSpinTimeout;
  let profileSignature = "";
  // The inline script restores display labels before the feed module loads.
  const initialRegionButtons = [...(regionControls?.children || [])];
  let regionLabels = initialRegionButtons.slice(1)
    .filter(button => !button.hasAttribute("data-region-from-url"))
    .map(button => button.dataset.key);
  let regionSignature = JSON.stringify([
    initialRegionButtons.map(button => button.dataset.key),
    initialRegionButtons.find(button => button.getAttribute("aria-pressed") === "true")?.dataset.key.toLocaleLowerCase(),
  ]);

  function routeFromUrl() {
    const query = new URLSearchParams(location.search);
    const group = query.get("group");
    const post = query.get("post");
    const requestedView = query.get("view");
    const view = viewButtons.has(requestedView) && !post ? requestedView : "latest";
    return {
      view: isFeed ? view : "latest",
      group: isFeed && view === "latest" && group && group.length <= 60 && groupKey.test(group) ? group : "",
      region: isFeed ? (query.get("region") || "").slice(0, 60) : "",
      post: isFeed && postKey.test(post) ? post : "",
    };
  }

  function storedSet(key, pattern) {
    try {
      const raw = localStorage.getItem(key);
      if (raw === storageSnapshots.get(key)) return null;
      const values = JSON.parse(raw);
      storageSnapshots.set(key, raw);
      return new Set(Array.isArray(values) ? values.filter((value) => typeof value === "string" && pattern.test(value)) : []);
    } catch {
      return null;
    }
  }

  function saveSet(key, values) {
    try {
      const raw = JSON.stringify([...values]);
      localStorage.setItem(key, raw);
      storageSnapshots.set(key, raw);
    } catch {
      // Keep the current tab usable when browser storage is unavailable.
    }
  }

  function syncSelections() {
    // Back can restore a running page after another document changed the local selections.
    const nextSaved = storedSet(savedKey, postKey);
    const nextFollowing = storedSet(followingKey, groupKey);
    if (nextSaved) {
      saved = nextSaved;
      savedView.posts = savedView.posts.filter(post => saved.has(post.id));
      for (const id of savedView.loaded) if (!saved.has(id)) savedView.loaded.delete(id);
      savedView.loadedAt = 0;
      updateSelectionButtons("save");
    }
    if (nextFollowing) {
      following = nextFollowing;
      updateSelectionButtons("follow");
    }
    if (!(nextSaved && route.view === "saved" || nextFollowing && route.view === "following")) return false;
    activeLoad?.abort();
    activeLoad = null;
    return true;
  }

  function rememberRegions(values) {
    if (!isFeed) return;
    const labels = new Map();
    for (const region of values) if (region) labels.set(region.toLocaleLowerCase(), region);
    const nextLabels = [...labels.values()].sort((a, b) => a.localeCompare(b));
    if (nextLabels.length === regionLabels.length && nextLabels.every((label, i) => label === regionLabels[i])) return;
    regionLabels = nextLabels;
    try { sessionStorage.setItem(regionControls.dataset.cacheKey, JSON.stringify({ api: api.href, regions: regionLabels })); } catch {}
  }

  function rememberRecent(cache, key, value) {
    cache.delete(key);
    cache.set(key, value);
    if (cache.size > recentViewLimit) cache.delete(cache.keys().next().value);
  }

  function catalogCurrent() {
    return catalogComplete && catalogVersion === latestCatalogVersion;
  }

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function reconcileRows(parent, entries) {
    const previous = new Map([...parent.children].map(row => [row.dataset.gfRow, row]));
    const rows = entries.map(({ key, signature = "", create }) => {
      let row = previous.get(key);
      if (!row || row.dataset.gfSignature !== signature) {
        row = create();
        row.dataset.gfRow = key;
        row.dataset.gfSignature = signature;
      }
      return row;
    });
    const visible = new Set(rows);
    for (const row of [...parent.children]) if (!visible.has(row)) row.remove();
    rows.forEach((row, index) => {
      if (parent.children[index] !== row) parent.insertBefore(row, parent.children[index] || null);
    });
  }

  function action(name, label, key, className = "gf-button") {
    const button = el("button", className, label);
    button.type = "button";
    button.dataset.gfAction = name;
    if (key) button.dataset.key = key;
    return button;
  }

  function icon(name) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("class", "gf-icon");
    svg.setAttribute("viewBox", "0 0 24 24");
    svg.setAttribute("aria-hidden", "true");
    svg.setAttribute("focusable", "false");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", iconPaths[name]);
    svg.append(path);
    return svg;
  }

  function link(href, label, className, iconName) {
    const anchor = el("a", className, label);
    anchor.href = href;
    if (iconName) anchor.append(icon(iconName));
    return anchor;
  }

  function safeUrl(value, origins) {
    if (!value) return null;
    try {
      const url = new URL(value);
      return origins.includes(url.origin) ? url.href : null;
    } catch {
      return null;
    }
  }

  function profileUrl(group) {
    return `/groups/profile/?group=${encodeURIComponent(group.slug)}`;
  }

  function platoLinkUrl(group) {
    return safeUrl(group.friendUrl, ["https://platoapp.com", "https://www.platoapp.com"]);
  }

  function postUrl(post) {
    return `/groups/?post=${encodeURIComponent(post.id)}`;
  }

  function colorFor(slug) {
    let hash = 0;
    for (const character of slug) hash += character.codePointAt(0);
    return palette[hash % palette.length];
  }

  function avatar(group, immediate = false) {
    const frame = el("span", "gf-avatar");
    const fallback = el("span", "gf-avatar-fallback", Array.from(group.name)[0]?.toLocaleUpperCase() || "•");
    frame.append(fallback);
    frame.style.setProperty("--avatar-color", colorFor(group.slug));
    frame.setAttribute("aria-hidden", "true");
    const url = safeUrl(group.iconUrl, [api.origin]);
    if (url) {
      const image = el("img");
      image.alt = "";
      image.loading = immediate ? "eager" : "lazy";
      image.decoding = "async";
      watchImage(image, fallback);
      image.src = url;
      frame.append(image);
    }
    return frame;
  }

  function prioritizeAvatar(node) {
    const image = node.querySelector(".gf-avatar img");
    if (image?.loading === "lazy") image.loading = "eager";
  }

  function readerImageState(frame, state) {
    if (!frame) return;
    frame.dataset.state = state;
    frame.setAttribute("aria-busy", String(state === "loading"));
  }

  function watchImage(image, fallback, postId, frame) {
    const recovery = { fallback, frame, retryAt: 0, version: 0 };
    imageRecovery.set(image, recovery);
    image.addEventListener("error", () => {
      recovery.version += 1;
      image.dataset.gfImageFailed = "true";
      recovery.retryAt = Date.now() + 30_000;
      image.hidden = true;
      if (fallback) fallback.hidden = false;
      readerImageState(frame, "error");
      if (postId && image.isConnected) queuePostCheck(postId);
    });
    image.addEventListener("load", () => {
      const version = recovery.version;
      const reveal = () => {
        if (version !== recovery.version) return;
        image.removeAttribute("data-gf-image-failed");
        image.hidden = false;
        if (fallback) fallback.hidden = true;
        readerImageState(frame, "ready");
      };
      // Keep the preview visible until the full image is ready to paint.
      if (frame && typeof image.decode === "function") return image.decode().then(reveal, reveal);
      reveal();
    });
  }

  function queuePostCheck(id) {
    if (Date.now() < (failedPostChecks.get(id) || 0)) return;
    failedPostChecks.delete(id);
    failedPostChecks.set(id, Date.now() + 30_000);
    if (failedPostChecks.size > maxRefreshBatch) failedPostChecks.delete(failedPostChecks.keys().next().value);
    pendingPostChecks.add(id);
    schedulePostChecks();
  }

  function schedulePostChecks() {
    if (!pendingPostChecks.size || postCheckTimer || checkingPosts || activeLoad || document.visibilityState === "hidden") return;
    postCheckTimer = setTimeout(checkFailedPosts, 100);
  }

  async function checkFailedPosts() {
    postCheckTimer = null;
    if (activeLoad || document.visibilityState === "hidden") return;
    const ids = [...pendingPostChecks].slice(0, maxRefreshBatch);
    for (const id of ids) pendingPostChecks.delete(id);
    checkingPosts = true;
    try {
      const data = await requestFeed({ posts: ids.join(","), catalog: "0" });
      // Keep the newer request in charge, then check again against the current state.
      if (data.requestId !== feedRequestId) {
        for (const id of ids) pendingPostChecks.add(id);
        return;
      }
      const checked = new Set(ids);
      const available = new Map(data.posts.map(post => [post.id, post]));
      ingest(data);
      for (const view of new Set([timeline, savedView, ...timelines.values()])) {
        view.posts = view.posts.flatMap(post => checked.has(post.id) ? available.get(post.id) || [] : post);
      }
      for (const id of ids) {
        if (available.has(id)) {
          if (knownPosts.has(id)) knownPosts.set(id, available.get(id));
        } else {
          knownPosts.delete(id);
          renderedPosts.get(id)?.card.remove();
          renderedPosts.delete(id);
        }
      }
      if (dialog.open && openDialogItem?.kind === "post" && checked.has(openDialogItem.id) && !available.has(openDialogItem.id)) {
        closePopup(dialog);
        toast("This post is no longer available.");
      }
      render();
      reconcileDialog();
      if (dialog.open && dialog.dataset.kind === "search") renderSearch(dialog.querySelector("[data-gf-search-input]").value);
    } catch {
      // A network failure cannot prove that a post was removed. Keep its content and image retry.
    } finally {
      checkingPosts = false;
      schedulePostChecks();
    }
  }

  function retryImages(scope = root, force = false) {
    for (const image of scope.querySelectorAll("img[data-gf-image-failed]")) {
      const recovery = imageRecovery.get(image);
      if (!recovery || !force && Date.now() < recovery.retryAt) continue;
      recovery.version += 1;
      image.removeAttribute("data-gf-image-failed");
      image.hidden = false;
      if (recovery.fallback) recovery.fallback.hidden = true;
      readerImageState(recovery.frame, "loading");
      // Reuse the same URL and element; healthy images never enter this path.
      image.src = image.src;
    }
  }

  function identity(group, immediate = false) {
    const control = action("group", undefined, group.slug, "gf-identity");
    const text = el("span", "gf-identity-text");
    const name = el("strong", null, group.name);
    name.dir = "auto";
    text.append(name, el("span", "gf-region", group.region));
    control.append(avatar(group, immediate), text);
    return control;
  }

  function updateToggle(button, active) {
    const isSave = button.dataset.gfAction === "save";
    button.setAttribute("aria-pressed", String(active));
    if (isSave) {
      const glyph = el("span", "gf-save-icon");
      glyph.setAttribute("aria-hidden", "true");
      button.replaceChildren(glyph, document.createTextNode(active ? "Saved" : "Save"));
    } else {
      button.replaceChildren(icon(active ? "check" : "plus"), document.createTextNode(active ? "Following" : "Follow"));
    }
  }

  function updateSelectionButtons(key) {
    for (const button of root.querySelectorAll(`[data-gf-action="${key}"]`)) {
      const id = button.dataset.key;
      const group = key === "follow" ? groupForSlug(id) : null;
      const active = key === "save" ? saved.has(id) : group ? Boolean(followsGroup(group)) : following.has(id);
      if (button.getAttribute("aria-pressed") !== String(active)) updateToggle(button, active);
    }
  }

  function followButton(group) {
    const button = action("follow", undefined, group.slug, "gf-button gf-follow");
    button.setAttribute("aria-label", `Follow ${group.name}`);
    updateToggle(button, followsGroup(group));
    return button;
  }

  function postActions(post, includeRead = true) {
    const actions = el("div", "gf-card-actions");
    if (includeRead) {
      const read = action("read", "Read post", post.id, "gf-button gf-read");
      read.append(icon("external"));
      actions.append(read);
    }
    const save = action("save", undefined, post.id, "gf-button gf-save");
    save.setAttribute("aria-label", `Save ${post.title}`);
    updateToggle(save, saved.has(post.id));
    const share = action("share-post", "Share", post.id);
    share.setAttribute("aria-label", `Share ${post.title}`);
    actions.append(save, share);
    return actions;
  }

  function groupBio(text) {
    const bio = el("div", "gf-group-bio post-markdown");
    bio.innerHTML = renderPostMarkdown(text);
    bio.dir = "auto";
    return bio;
  }

  function profileContent(group, headingLevel, headingText, inDialog) {
    const fragment = document.createDocumentFragment();
    const overview = el("div", "gf-profile-overview");
    const identityRow = el("div", "gf-profile-identity");
    const text = el("div", "gf-profile-name");
    const heading = el(headingLevel, null, headingText);
    heading.dir = "auto";
    if (inDialog) heading.id = "gf-dialog-title";
    const region = el("p", "gf-region gf-profile-region", group.region);
    region.setAttribute("aria-label", `Server: ${group.region}`);
    text.append(el("p", "gf-profile-eyebrow", "Plato group"), heading, region);
    identityRow.append(avatar(group, inDialog || !isEmbed), text);
    const tools = el("div", "gf-profile-tools");
    tools.append(followButton(group), action("share-group", "Share", group.slug, "gf-button gf-profile-share"));
    overview.append(identityRow, tools);
    fragment.append(overview);
    const details = el("div", "gf-profile-details");
    if (group.bio) {
      const about = el("section", "gf-profile-about");
      about.append(el("h3", "gf-profile-label", "About the group"), groupBio(group.bio));
      details.append(about);
    }
    const friendUrl = platoLinkUrl(group);
    if (friendUrl) {
      const contact = el("section", "gf-manager-contact");
      const label = el("h3", "gf-profile-label", "Plato link");
      const linkText = el("span", "gf-friend-url", friendUrl);
      linkText.dir = "ltr";
      const field = el("div", "gf-friend-field");
      const copy = action("copy-friend", undefined, group.slug, "gf-button gf-friend-copy");
      copy.setAttribute("aria-label", `Copy ${group.name} Plato link`);
      copy.title = "Copy Plato link";
      copy.append(icon("copy"));
      const notice = el("p", "gf-copy-status");
      notice.setAttribute("role", "status");
      field.append(linkText, copy);
      const connect = link(friendUrl, "Open on Plato", "gf-button gf-primary", "external");
      connect.rel = "noreferrer";
      contact.append(label, el("p", "gf-contact-help", "Open this link to add the manager or join the waiting group."), field, notice, connect);
      details.append(contact);
    }
    if (details.children.length) fragment.append(details);
    if (inDialog) {
      const footer = el("div", "gf-profile-footer");
      footer.append(link(profileUrl(group), "View group page", "gf-button gf-profile-open", "right"));
      fragment.append(footer);
    }
    return fragment;
  }

  function renderProfile() {
    const group = groupForSlug(profileSlug);
    if (!group) return;
    const profile = find("profile");
    const signature = JSON.stringify([group.slug, group.name, group.region, group.bio, group.friendUrl, group.iconUrl]);
    if (profileSignature === signature) return;
    const card = el("header", "gf-profile");
    card.append(profileContent(group, isEmbed ? "h2" : "h1", isEmbed ? `${group.name} group feed` : group.name, false));
    profile.replaceChildren(card);
    profile.hidden = false;
    profileSignature = signature;
    if (!isEmbed) document.title = `${group.name} · Platopedia Groups`;
    root.hidden = false;
  }

  function postImage(post, inReader = false) {
    const url = safeUrl(inReader ? post.originalImageUrl || post.imageUrl : post.imageUrl, [api.origin]);
    if (!url) return null;
    const image = el("img", "gf-post-image");
    image.alt = `Image attached to ${post.title}`;
    image.decoding = "async";
    if (inReader && Number.isInteger(post.imageWidth) && Number.isInteger(post.imageHeight) &&
        post.imageWidth > 0 && post.imageHeight > 0) {
      image.setAttribute("width", String(post.imageWidth));
      image.setAttribute("height", String(post.imageHeight));
      image.style.width = `${post.imageWidth}px`;
      image.style.aspectRatio = `${post.imageWidth} / ${post.imageHeight}`;
    }
    if (!inReader) {
      image.loading = route.post ? "eager" : "lazy";
      watchImage(image, undefined, post.id);
      image.src = url;
      return image;
    }
    const frame = el("div", "gf-reader-image");
    if (image.style.width) frame.style.setProperty("--gf-image-width", image.style.width);
    readerImageState(frame, "loading");
    const fallback = el("div", "gf-image-error");
    fallback.hidden = true;
    fallback.setAttribute("role", "status");
    fallback.append(el("p", null, "Image could not load."), action("retry-image", "Retry image"));
    watchImage(image, fallback, post.id, frame);
    image.src = url;
    const thumbnail = renderedPosts.get(post.id)?.card.querySelector(".gf-post-image");
    if (image.style.width && thumbnail?.complete && thumbnail.src === safeUrl(post.imageUrl, [api.origin]) &&
        thumbnail.naturalWidth > 0 && thumbnail.naturalHeight > 0) {
      // Copy already-loaded pixels; this adds no preview download or encoded image copy.
      const preview = el("canvas", "gf-reader-preview");
      preview.setAttribute("aria-hidden", "true");
      const scale = Math.min(1, 640 / thumbnail.naturalWidth, 480 / thumbnail.naturalHeight);
      preview.width = Math.max(1, Math.round(thumbnail.naturalWidth * scale));
      preview.height = Math.max(1, Math.round(thumbnail.naturalHeight * scale));
      try {
        const context = preview.getContext("2d");
        if (context) {
          context.drawImage(thumbnail, 0, 0, preview.width, preview.height);
          frame.append(preview);
        }
      } catch { /* The quiet placeholder remains available if a pixel copy fails. */ }
    }
    frame.append(image, fallback);
    return frame;
  }

  function postMeta(post, immediate = false) {
    const meta = el("div", "gf-card-meta");
    const timestamp = new Date(post.publishedAt);
    meta.append(identity(post.group, immediate));
    if (!Number.isNaN(timestamp.getTime())) {
      const time = el("time", "gf-date", dateFormat.format(timestamp));
      time.dateTime = timestamp.toISOString();
      meta.append(time);
    }
    return meta;
  }

  function postCard(post, immediate = false) {
    const article = el("article", "gf-card");
    article.id = `post-${post.id}`;
    article.dataset.gfPost = post.id;
    article.tabIndex = 0;
    const heading = el("h3");
    heading.dir = "auto";
    const title = action("read", undefined, post.id, "gf-post-title");
    title.id = `gf-post-title-${post.id}`;
    article.setAttribute("aria-labelledby", title.id);
    title.innerHTML = renderPostTitle(post.title);
    heading.append(title);
    const body = el("div", "gf-post-text post-markdown is-preview");
    body.innerHTML = renderPostMarkdown(post.body);
    body.dir = "auto";
    article.append(postMeta(post, immediate), heading, body);
    const image = postImage(post);
    if (image) article.append(image);
    article.append(postActions(post));
    return article;
  }

  function visibleGroups(query = "") {
    const normalized = query.trim().toLocaleLowerCase();
    return [...groups.values()]
      .filter((group) => (!route.region || group.region.toLocaleLowerCase() === route.region.toLocaleLowerCase()) &&
        `${group.name} ${group.region} ${group.bio || ""}`.toLocaleLowerCase().includes(normalized))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  function setStatus(node, message, loading = false) {
    if (!node) return;
    node.textContent = message;
    node.hidden = !message;
    node.dataset.state = loading ? "loading" : "ready";
  }

  function renderDiscovery() {
    if (!isFeed) return;
    if (sidebarActive && !catalogCurrent() && !catalogLoad && !catalogError) ensureCatalog();
    const labels = new Map(regionLabels.map(region => [region.toLocaleLowerCase(), region]));
    if (route.region && !labels.has(route.region.toLocaleLowerCase())) labels.set(route.region.toLocaleLowerCase(), route.region);
    const regions = ["", ...[...labels.values()].sort((a, b) => a.localeCompare(b))];
    const nextRegionSignature = JSON.stringify([regions, route.region.toLocaleLowerCase()]);
    if (regionSignature !== nextRegionSignature) {
      const controls = regions.map((region) => {
        const button = action("region", region || "All servers", region, "");
        button.setAttribute("aria-pressed", String(region.toLocaleLowerCase() === route.region.toLocaleLowerCase()));
        return button;
      });
      const focusedRegion = regionControls.contains(document.activeElement) ? document.activeElement.dataset.key : null;
      regionControls.replaceChildren(...controls);
      if (focusedRegion !== null) {
        controls.find((control) => control.dataset.key === focusedRegion)?.focus({ preventScroll: true });
      }
      regionSignature = nextRegionSignature;
    }
    const groupLabel = groupForSlug(route.group)?.name || route.group;
    const groupFilterLabel = find("group-filter-label");
    if (groupFilterLabel.textContent !== groupLabel) groupFilterLabel.textContent = groupLabel;
    find("group-filter").hidden = !route.group || Boolean(route.post);
    find("filterbar").hidden = Boolean(route.post);

    const summary = summaries.get(route.region);
    const complete = catalogCurrent();
    const sidebarGroups = complete ? visibleGroups()
      : summary?.version === latestCatalogVersion ? summary.slugs.map(groupForSlug).filter(Boolean) : [];
    const list = find("group-list");
    list.setAttribute("aria-busy", String(Boolean(catalogLoad)));
    const entries = sidebarGroups.map(group => ({
      key: group.slug,
      signature: JSON.stringify([group.name, group.region, group.iconUrl]),
      create: () => {
        const item = el("li");
        item.append(identity(group));
        return item;
      },
    }));
    if (!complete && !catalogError && sidebarGroups.length >= 5) {
      for (let index = 0; index < 2; index++) entries.push({
        key: `:pending-${index}`,
        create: () => {
          const row = el("li", "gf-group-placeholder");
          row.setAttribute("aria-hidden", "true");
          return row;
        },
      });
    }
    reconcileRows(list, entries);
    const sidebarStatus = find("sidebar-status");
    const failed = !complete && catalogError;
    const message = failed ? "Could not load groups. " : complete && !sidebarGroups.length ? "No groups in this view." : "";
    setStatus(sidebarStatus, message);
    if (failed) sidebarStatus.append(action("sidebar-groups", "Retry"));
  }

  function renderDirectory() {
    if (!isFeed || route.view !== "directory") return;
    const available = catalogCurrent() ? visibleGroups(find("directory-search").value) : [];
    const count = find("directory-count");
    count.textContent = available.length ? `${available.length} ${available.length === 1 ? "group" : "groups"}` : "";
    const visible = new Set(available.map(group => group.slug));
    const initialAvatars = matchMedia("(max-width: 465px)").matches ? 2
      : matchMedia("(max-width: 950px)").matches ? 4 : 6;
    for (const [slug, entry] of renderedGroups) if (!visible.has(slug)) {
      entry.card.remove();
      renderedGroups.delete(slug);
    }
    available.forEach((group, index) => {
      const immediate = index < initialAvatars;
      const signature = JSON.stringify([group.name, group.region, group.bio, group.iconUrl]);
      let entry = renderedGroups.get(group.slug);
      if (entry?.signature !== signature) {
        const card = el("article", "gf-directory-card");
        card.dataset.gfGroup = group.slug;
        card.tabIndex = 0;
        card.setAttribute("aria-label", `${group.name} group details`);
        card.setAttribute("aria-haspopup", "dialog");
        card.style.setProperty("--avatar-color", colorFor(group.slug));
        card.append(identity(group, immediate));
        if (group.bio) card.append(groupBio(group.bio));
        const actions = el("div", "gf-profile-actions");
        actions.append(followButton(group), link(profileUrl(group), "Open profile", "gf-button", "external"));
        card.append(actions);
        entry?.card.remove();
        entry = { card, signature };
        renderedGroups.set(group.slug, entry);
      } else if (immediate) prioritizeAvatar(entry.card);
      const grid = find("directory-grid");
      if (grid.children[index] !== entry.card) grid.insertBefore(entry.card, grid.children[index] || null);
    });
    const directoryStatus = find("directory-status");
    const message = catalogError ? "Could not load the directory. " : !catalogCurrent() ? "Loading groups…" :
      available.length ? "" : "No groups match this search.";
    setStatus(directoryStatus, message, Boolean(catalogLoad));
    if (catalogError) directoryStatus.append(action("refresh", "Retry"));
  }

  function filteredPosts() {
    const source = route.view === "saved" ? savedView.posts.filter((post) => saved.has(post.id)) : timeline.posts;
    return source.filter((post) => {
      const current = groupForSlug(post.group.slug);
      const group = current || post.group;
      return (!catalogComplete || current) && (route.view !== "following" || followsGroup(group)) &&
        (!route.region || group.region.toLocaleLowerCase() === route.region.toLocaleLowerCase());
    });
  }

  function renderPosts(posts) {
    const active = new Set(posts.map((post) => post.id));
    for (const [id, entry] of renderedPosts) {
      if (!active.has(id)) entry.card.remove();
    }
    posts.forEach((post, index) => {
      const immediate = !isEmbed && index < initialFeedAvatars;
      let entry = renderedPosts.get(post.id);
      const signature = JSON.stringify([post.title, post.body, post.publishedAt, post.imageUrl,
        post.originalImageUrl, post.imageWidth, post.imageHeight, post.group.slug, post.group.name, post.group.region, post.group.iconUrl]);
      if (entry?.signature !== signature) {
        entry?.card.remove();
        entry = { signature, card: postCard(post, immediate) };
      } else if (immediate) prioritizeAvatar(entry.card);
      renderedPosts.delete(post.id);
      renderedPosts.set(post.id, entry);
      const save = entry.card.querySelector('[data-gf-action="save"]');
      if (save.getAttribute("aria-pressed") !== String(saved.has(post.id))) updateToggle(save, saved.has(post.id));
      if (postsNode.children[index] !== entry.card) {
        postsNode.insertBefore(entry.card, postsNode.children[index] || null);
      }
    });
    // Preserve recently viewed cards and their decoded images without accumulating detached pages.
    let detached = renderedPosts.size - active.size;
    for (const id of renderedPosts.keys()) {
      if (detached <= 24) break;
      if (!active.has(id)) { renderedPosts.delete(id); detached -= 1; }
    }
  }

  function render() {
    schedulePostChecks();
    if (isFeed) {
      for (const [view, button] of viewButtons) {
        if (view === route.view) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
      }
      find("feed-view").hidden = route.view === "directory";
      find("directory-view").hidden = route.view !== "directory";
      find("back").hidden = !route.post;
      find("heading").textContent = route.post ? "Group post" : route.group
        ? `${groupForSlug(route.group)?.name || "Group"} posts` : viewButtons.get(route.view).dataset.heading;
      renderDiscovery();
      renderDirectory();
    }

    if (isFeed && route.view === "directory") {
      retryImages();
      return;
    }
    const posts = filteredPosts();
    const awaitingProfile = mode === "profile" && !groupForSlug(profileSlug);
    const postsHeader = find("posts-header");
    if (postsHeader) postsHeader.hidden = awaitingProfile;
    replaceKnownPosts(posts);
    postsNode.setAttribute("aria-busy", String(Boolean(activeLoad)));
    renderPosts(posts);
    reconcileDialog();
    retryImages();
    const refresh = find("refresh");
    if (refresh) {
      refresh.disabled = Boolean(activeLoad);
      refresh.setAttribute("aria-busy", String(Boolean(activeLoad)));
    }
    const hasMore = route.view === "saved" ? savedView.loaded.size > 0 && [...saved].some((id) => !savedView.loaded.has(id)) :
      Boolean(timeline.cursor && (route.view !== "following" || following.size));
    more.hidden = !hasMore;
    more.disabled = Boolean(activeLoad);
    more.firstChild.textContent = route.view === "saved" ? "Load more saved posts " : "Load older posts ";
    const noPosts = route.post ? "This post is unavailable." :
      route.view === "following" ? (!following.size ? "Follow a group to see its posts here." :
        hasMore ? "No followed groups in these posts yet. Load older posts to keep looking." : "No posts from followed groups.") :
      route.view === "saved" ? (!saved.size ? "Save a post to find it here again." : "No saved posts in this view.") :
      "No posts found.";
    const loadingMessage = awaitingProfile ? "Loading group profile…" : "Loading group posts…";
    const message = errorMessage || (activeLoad ? (posts.length ? "" : loadingMessage) : posts.length ? "" : noPosts);
    setStatus(status, message, Boolean(activeLoad) && !errorMessage && !awaitingProfile);
    if (errorMessage) {
      const retry = action("refresh", "Retry");
      retry.disabled = Boolean(activeLoad);
      status.append(document.createTextNode(" "), retry);
    }
    observeSidebar();
  }

  async function requestFeed(params, signal) {
    const requestId = ++feedRequestId;
    const url = new URL(api);
    for (const [key, value] of Object.entries(params)) if (value) url.searchParams.set(key, value);
    const controller = new AbortController();
    let timedOut = false;
    const cancel = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 12_000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
      if (response.status === 404 && params.group) return { missing: true, requestId };
      if (!response.ok) throw new Error("Group feed request failed");
      const data = await response.json();
      if (!Array.isArray(data.groups) || !Array.isArray(data.posts)) throw new Error("Unexpected group feed response");
      return { ...data, requestId, discoveryRegion: params.featuredRegion || params.region || "" };
    } catch (error) {
      if (timedOut) throw new Error("The group feed took too long to respond.");
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", cancel);
    }
  }

  function matchesSlug(group, slug) {
    return group.slug === slug || group.previousSlugs?.includes(slug);
  }

  function groupForSlug(slug) {
    if (!slug) return undefined;
    const current = groups.get(slug);
    if (current) return current;
    for (const group of groups.values()) if (matchesSlug(group, slug)) return group;
  }

  function followsGroup(group) {
    return following.has(group.slug) || group.previousSlugs?.some(slug => following.has(slug));
  }

  function mergeGroup(group) {
    const previous = groups.get(group.slug);
    if (!previous || !previous.updatedAt || !group.updatedAt || group.updatedAt >= previous.updatedAt) groups.set(group.slug, group);
  }

  function replaceKnownPosts(posts) {
    knownPosts.clear();
    for (const post of posts) knownPosts.set(post.id, post);
    if (dialog.open && dialog.dataset.kind === "search") {
      const input = dialog.querySelector("[data-gf-search-input]");
      if (input) renderSearch(input.value);
    }
  }

  function ingest(data, replacing = false) {
    const newerVersion = data.catalogVersion > latestCatalogVersion;
    if (data.catalogVersion < latestCatalogVersion || !newerVersion && data.requestId < catalogRequestId) return false;
    if (newerVersion) {
      if (latestCatalogVersion >= 0) {
        for (const cached of timelines.values()) cached.loadedAt = 0;
        savedView.loadedAt = 0;
      }
      latestCatalogVersion = data.catalogVersion;
    }
    const reported = replacing ? new Set() : null;
    for (const group of [...data.groups, ...(data.featured || []), ...data.posts.map(post => post.group)]) {
      reported?.add(group.slug);
      if (groupRequestIds.get(group.slug) > data.requestId) continue;
      mergeGroup(group);
      groupRequestIds.set(group.slug, data.requestId);
      for (const slug of group.previousSlugs || []) {
        if (groupRequestIds.get(slug) > data.requestId) continue;
        groups.delete(slug);
        groupRequestIds.set(slug, data.requestId);
        reported?.add(slug);
      }
    }
    if (replacing) {
      catalogRequestId = data.requestId;
      catalogComplete = true;
      catalogVersion = data.catalogVersion ?? latestCatalogVersion;
      catalogLoadedAt = Date.now();
      catalogError = false;
      // A newer filtered response may already have confirmed or removed a group.
      for (const [slug, requestId] of groupRequestIds) {
        if (reported.has(slug) || requestId > data.requestId) continue;
        groups.delete(slug);
        groupRequestIds.delete(slug);
      }
      for (const [id, post] of knownPosts) if (!groupForSlug(post.group.slug)) knownPosts.delete(id);
      if (dialog.open && dialog.dataset.group && !groupForSlug(dialog.dataset.group)) closePopup(dialog);
    }
    if (data.featured) {
      rememberRecent(summaries, data.discoveryRegion, {
        slugs: data.featured.map(group => group.slug), version: data.catalogVersion, loadedAt: Date.now(),
      });
    }
    if (data.regions) {
      if (newerVersion || data.requestId >= discoveryRequestId) {
        discoveryRequestId = data.requestId;
        rememberRegions(data.regions);
      }
    } else if (catalogCurrent() && (replacing || data.groups.length || data.posts.length)) {
      rememberRegions([...groups.values()].map(group => group.region));
    }
    if (openDialogItem?.kind === "group") reconcileDialog();
    return true;
  }

  function startCatalog(params) {
    catalogError = false;
    const load = { controller: new AbortController(), startedAt: Date.now() };
    catalogLoad = load;
    const request = requestFeed(params, load.controller.signal);
    const requestId = feedRequestId;
    let superseded = false;
    load.promise = request.then(data => {
      if (catalogLoad === load && !data.missing) superseded = !ingest(data, true);
      return data;
    }).catch(error => {
      if (catalogLoad === load && requestId >= catalogRequestId) catalogError = true;
      throw error;
    }).finally(() => {
      if (catalogLoad !== load) return;
      catalogLoad = null;
      const input = dialog.open && dialog.querySelector("[data-gf-search-input]");
      // A newer summary can prove a slower directory response has outdated visibility.
      if (superseded && !catalogCurrent() && requestId < discoveryRequestId && (route.view === "directory" || input)) ensureCatalog();
      render();
      if (input) renderSearch(input.value);
    });
    return load.promise;
  }

  function ensureCatalog(force = false) {
    if (!force && !catalogError && catalogCurrent() && Date.now() - catalogLoadedAt < freshFor) return;
    return (catalogLoad?.promise || startCatalog({ catalog: "only" })).catch(() => {});
  }

  function loadSidebar() {
    sidebarActive = true;
    if (catalogCurrent() || catalogLoad) return;
    ensureCatalog();
    renderDiscovery();
  }

  function observeSidebar() {
    if (!isFeed || activeLoad || sidebarActive || sidebarObserver || catalogCurrent() || typeof IntersectionObserver !== "function") return;
    sidebarObserver = new IntersectionObserver(entries => {
      if (!entries.some(entry => entry.isIntersecting)) return;
      sidebarObserver.disconnect();
      loadSidebar();
    }, { rootMargin: "600px 0px" });
    sidebarObserver.observe(find("group-list"));
  }

  function discoveryMode(force, refresh) {
    if (!isFeed) return "";
    const searching = dialog.open && dialog.dataset.kind === "search";
    const directoryDue = !catalogCurrent() || Date.now() - catalogLoadedAt >= freshFor;
    if (catalogComplete && !catalogLoad && (force || searching && directoryDue)) return "all";
    const summary = summaries.get(route.region);
    const summaryAt = summary?.version === latestCatalogVersion ? summary.loadedAt : 0;
    const checkedAt = Math.max(summaryAt, catalogCurrent() ? catalogLoadedAt : 0);
    return force || refresh || !checkedAt || Date.now() - checkedAt >= freshFor ? "summary" : "0";
  }

  function timelineParams() {
    return { group: isFeed ? route.group : profileSlug, region: route.region, post: route.post,
      groups: isFeed && route.view === "following" ? [...following].sort().join(",") : "" };
  }

  function timelineId(params) {
    return JSON.stringify({ ...params, following: route.view === "following" });
  }

  function isBeforeCursor(post, [timestamp, id]) {
    const publishedAt = Number(timestamp);
    return post.publishedAt < publishedAt || post.publishedAt === publishedAt && post.id < id;
  }

  function invalidateMissingPosts(view, posts) {
    const filters = JSON.parse(view.key);
    const existing = new Set(view.posts.map(post => post.id));
    const boundary = view.cursor?.split(".");
    if (posts.some(post => !existing.has(post.id) &&
      (!filters.group || matchesSlug(post.group, filters.group)) &&
      (!filters.post || post.id === filters.post) &&
      (!filters.region || post.group.region.toLowerCase() === filters.region.toLowerCase()) &&
      (!filters.following || filters.groups.split(",").some(slug => matchesSlug(post.group, slug))) &&
      (!boundary || !isBeforeCursor(post, boundary)))) view.loadedAt = 0;
  }

  function reconcileCachedPosts(posts, cursor, params, before) {
    const latest = new Map(posts.map(post => [post.id, post]));
    const lower = cursor?.split(".");
    const upper = before && before.split(".");
    const covered = post => {
      if (params.post && post.id !== params.post ||
        params.group && !matchesSlug(post.group, params.group) ||
        params.region && post.group.region.toLowerCase() !== params.region.toLowerCase() ||
        route.view === "following" && !followsGroup(post.group)) return false;
      return (!lower || !isBeforeCursor(post, lower)) && (!upper || isBeforeCursor(post, upper));
    };
    if (dialog.open && openDialogItem?.kind === "post" &&
      covered(openDialogItem.data) && !latest.has(openDialogItem.id)) closePopup(dialog);
    function reconcile(view) {
      view.posts = view.posts.flatMap(post => {
        if (latest.has(post.id)) return latest.get(post.id);
        if (!covered(post)) return post;
        // A region filter cannot tell us whether a missing post or its region changed.
        if (!params.region) return [];
        view.loadedAt = 0;
        return post;
      });
    }
    if (savedView.loaded.size) {
      reconcile(savedView);
      const byId = new Map(savedView.posts.map(post => [post.id, post]));
      for (const post of latest.values()) if (savedView.loaded.has(post.id)) byId.set(post.id, post);
      savedView.posts = [...saved].reverse().map(id => byId.get(id)).filter(Boolean);
    }
    const key = timelineId(params);
    for (const cached of timelines.values()) {
      if (cached.key === key) continue;
      reconcile(cached);
      invalidateMissingPosts(cached, posts);
    }
  }

  async function loadTimeline(append = false, catalog = isFeed ? "0" : "") {
    const params = timelineParams();
    const key = timelineId(params);
    if (append && (!timeline.cursor || timeline.key !== key)) return;
    activeLoad?.abort();
    if (activeKey !== key) errorMessage = "";
    const controller = new AbortController();
    activeLoad = controller;
    activeKey = key;
    activeStartedAt = Date.now();
    const startingCursor = append ? timeline.cursor : null;
    const nextTimeline = {
      key, posts: append ? [...timeline.posts] : [], cursor: startingCursor,
      loadedAt: append ? timeline.loadedAt : 0,
    };
    const keepCount = !append && timeline.key === key ? timeline.posts.length : 0;
    if (timeline.key !== key) timeline = { key, posts: [], cursor: null, loadedAt: 0 };
    render();
    try {
      if (route.view === "following" && !following.size) {
        if (catalog === "all" || catalog === "summary") {
          const data = catalog === "all" ? await startCatalog({ catalog: "only" })
            : await requestFeed({ catalog: "summary-only", region: params.region }, controller.signal);
          if (activeLoad !== controller) return;
          if (catalog === "summary") ingest(data);
        }
        errorMessage = "";
        recoveryRetryAt = 0;
        timeline = { ...nextTimeline, loadedAt: Date.now() };
        rememberRecent(timelines, key, timeline);
        return;
      }
      let before = startingCursor || "";
      do {
        activeStartedAt = Date.now();
        const limit = Math.min(maxRefreshBatch, keepCount - nextTimeline.posts.length);
        const query = { ...params, before, limit: limit > 12 ? limit : "", catalog: catalog === "0" && params.group ? "" : catalog };
        if (append && catalog === "0" && !catalogCurrent() && !params.group) query.labels = "1";
        const data = catalog === "all" ? await startCatalog(query) : await requestFeed(query, controller.signal);
        if (activeLoad !== controller) return;
        if (data.missing) {
          if (data.requestId >= (groupRequestIds.get(params.group) || catalogRequestId)) {
            groups.delete(params.group);
            if (catalogCurrent()) rememberRegions([...groups.values()].map(group => group.region));
            groupRequestIds.set(params.group, data.requestId);
            for (const cached of [...timelines.values(), savedView]) {
              cached.posts = cached.posts.filter(post => post.group.slug !== params.group);
              cached.loadedAt = 0;
            }
            if (dialog.open && dialog.dataset.group === params.group) closePopup(dialog);
          }
          nextTimeline.posts = [];
          nextTimeline.cursor = null;
          if (isEmbed) root.hidden = true;
          if (!isFeed) {
            find("profile").hidden = true;
            profileSignature = "";
          }
          errorMessage = "This group could not be found.";
          if (isFeed && !route.post && !catalogCurrent() && !summaries.has(params.region)) {
            const summary = await requestFeed({ catalog: "summary-only", region: params.region }, controller.signal).catch(() => null);
            if (activeLoad !== controller) return;
            if (summary) ingest(summary);
          }
          timeline = nextTimeline;
          recoveryRetryAt = Date.now() + recoveryCooldown;
          return;
        } else {
          if (catalog !== "all") ingest(data);
          const group = params.group && !isEmbed && groupForSlug(params.group);
          if (group && group.slug !== params.group) {
            const url = new URL(location.href);
            url.searchParams.set("group", group.slug);
            history.replaceState(history.state, "", url);
            if (isFeed) route.group = group.slug;
            else profileSlug = group.slug;
            params.group = group.slug;
            nextTimeline.key = timelineId(params);
            activeKey = nextTimeline.key;
          }
          const existing = new Set(nextTimeline.posts.map((post) => post.id));
          nextTimeline.posts.push(...data.posts.filter((post) => !existing.has(post.id)));
          nextTimeline.cursor = data.next;
          reconcileCachedPosts(data.posts, data.next, params, before);
          if (!append) {
            const lower = data.next?.split(".");
            const olderPosts = lower ? timeline.posts.filter(post => isBeforeCursor(post, lower)) : [];
            timeline = { ...nextTimeline, posts: [...nextTimeline.posts, ...olderPosts], cursor: lower ? timeline.cursor : null };
            rememberRecent(timelines, timeline.key, timeline);
          }
          if (!isFeed) renderProfile();
        }
        catalog = isFeed ? "0" : "";
        if (!nextTimeline.cursor || nextTimeline.cursor === before) break;
        before = nextTimeline.cursor;
        if (nextTimeline.posts.length < keepCount) render();
      } while (nextTimeline.posts.length < keepCount);
      errorMessage = "";
      recoveryRetryAt = 0;
      if (!append) nextTimeline.loadedAt = Date.now();
      rememberRecent(timelines, nextTimeline.key, nextTimeline);
      timeline = nextTimeline;
    } catch (error) {
      if (activeLoad !== controller || controller.signal.aborted) return;
      errorMessage = mode === "profile" && !groupForSlug(profileSlug) ? "Could not load the group profile." : "Could not load group posts.";
      recoveryRetryAt = Date.now() + recoveryCooldown;
    } finally {
      if (activeLoad === controller) {
        activeLoad = null;
        render();
      }
    }
  }

  async function loadSaved(append = false, catalog = "0") {
    const key = "saved:" + route.region;
    activeLoad?.abort();
    if (activeKey !== key) errorMessage = "";
    const controller = new AbortController();
    activeLoad = controller;
    activeKey = key;
    activeStartedAt = Date.now();
    const featuredRegion = route.region;
    const savedAtStart = new Set(saved);
    const nextSaved = {
      posts: append ? [...savedView.posts] : [], loaded: append ? new Set(savedView.loaded) : new Set(),
      loadedAt: append ? savedView.loadedAt : 0,
    };
    const count = append ? 8 : Math.max(8, savedView.loaded.size);
    const ids = [...saved].reverse().filter((id) => !nextSaved.loaded.has(id)).slice(0, count);
    render();
    try {
      const batchSize = append ? 8 : maxRefreshBatch;
      for (let offset = 0; offset < Math.max(1, ids.length); offset += batchSize) {
        activeStartedAt = Date.now();
        const batch = ids.slice(offset, offset + batchSize);
        const data = catalog === "all" ? await startCatalog(batch.length ? { posts: batch.join(","), catalog } : { catalog: "only" })
          : batch.length ? await requestFeed({ posts: batch.join(","), catalog, ...(catalog === "summary" ? { featuredRegion } : {}) }, controller.signal)
            : catalog === "summary" ? await requestFeed({ catalog: "summary-only", featuredRegion }, controller.signal) : null;
        if (activeLoad !== controller) return;
        if (data) {
          if (catalog !== "all") ingest(data);
          const byId = new Map(data.posts.map(post => [post.id, post]));
          const checked = new Set(batch);
          if (dialog.open && openDialogItem?.kind === "post" &&
            checked.has(openDialogItem.id) && !byId.has(openDialogItem.id)) closePopup(dialog);
          const current = new Map(savedView.posts.filter(post => !checked.has(post.id)).map(post => [post.id, post]));
          for (const post of data.posts) current.set(post.id, post);
          savedView.posts = [...saved].reverse().map(id => current.get(id)).filter(Boolean);
          for (const id of batch) {
            if (saved.has(id)) savedView.loaded.add(id);
            if (byId.has(id)) nextSaved.posts.push(byId.get(id));
            nextSaved.loaded.add(id);
          }
          for (const cached of timelines.values()) {
            cached.posts = cached.posts.flatMap(post => checked.has(post.id) ? byId.get(post.id) || [] : post);
            invalidateMissingPosts(cached, data.posts);
          }
          if (!append) savedView.loadedAt = 0;
        }
        catalog = "0";
        if (offset + batchSize < ids.length) render();
      }
      if (!append) nextSaved.loadedAt = Date.now();
      const currentPosts = new Map(nextSaved.posts.map(post => [post.id, post]));
      nextSaved.posts = [...saved].reverse().map(id => currentPosts.get(id)).filter(Boolean);
      for (const id of nextSaved.loaded) if (!saved.has(id)) nextSaved.loaded.delete(id);
      if ([...saved].some(id => !savedAtStart.has(id))) nextSaved.loadedAt = 0;
      errorMessage = "";
      recoveryRetryAt = 0;
      savedView = nextSaved;
    } catch (error) {
      if (activeLoad !== controller || controller.signal.aborted) return;
      errorMessage = "Could not load saved posts.";
      recoveryRetryAt = Date.now() + recoveryCooldown;
    } finally {
      if (activeLoad === controller) {
        activeLoad = null;
        render();
      }
    }
  }

  function sync(force = false, preservePages = false) {
    syncSelections();
    if (force) {
      retryImages(root, true);
      if (route.view !== "saved") savedView.loadedAt = 0;
    }
    if (route.view === "directory") {
      activeLoad?.abort();
      activeLoad = null;
      ensureCatalog(force);
      render();
      return;
    }
    const isSaved = route.view === "saved";
    const key = isSaved ? "saved:" + route.region : timelineId(timelineParams());
    if (!force && activeLoad && activeKey === key) return;
    let catalog = discoveryMode(force, preservePages);
    const emptySelection = isSaved ? !saved.size : route.view === "following" && !following.size;
    if (catalog === "summary" && emptySelection && !force && !preservePages && !regionLabels.length && !route.region) catalog = "0";
    const cached = isSaved ? savedView : timelines.get(key);
    if (cached && !isSaved) {
      timeline = cached;
      rememberRecent(timelines, key, cached);
    }
    if (!force && !errorMessage && catalog !== "all" && catalog !== "summary" && cached?.loadedAt &&
      Date.now() - cached.loadedAt < freshFor &&
      (route.view !== "following" || !following.size || filteredPosts().length || !timeline.cursor)) {
      activeLoad?.abort();
      activeLoad = null;
      render();
    } else if (isSaved) {
      loadSaved(false, catalog);
    } else {
      loadTimeline(false, catalog);
    }
  }

  function recover(event) {
    if (document.visibilityState === "hidden") return;
    schedulePostChecks();
    if (!isFeed && (!profileSlug || !groupKey.test(profileSlug))) return;
    retryImages(root, event.type === "online" || event.type === "visibilitychange" || event.type === "pageshow" && event.persisted);
    if (syncSelections()) {
      sync();
      return;
    }
    const now = Date.now();
    if (catalogLoad && now - catalogLoad.startedAt >= 12_000) {
      catalogLoad.controller.abort();
      catalogLoad = null;
    }
    if (activeLoad) {
      if (now - activeStartedAt < 12_000) return;
      activeLoad.abort();
      activeLoad = null;
    }
    if (event.type !== "online" && (now < recoveryRetryAt || now - lastRecoveryAt < 1_000)) return;
    const loadedAt = route.view === "directory" ? catalogLoadedAt : route.view === "saved" ? savedView.loadedAt : timeline.loadedAt;
    if (!errorMessage && (route.view !== "directory" || !catalogError) && loadedAt && now - loadedAt < freshFor) {
      if (dialog.open && dialog.dataset.kind === "search") ensureCatalog();
      return;
    }
    lastRecoveryAt = now;
    sync(false, true);
  }

  function navigate(change, scroll = false) {
    if (popupStack.length || popupHistoryPending) {
      leavePopups(() => navigate(change, scroll));
      return;
    }
    route = { ...route, ...change };
    const url = new URL(location.href);
    for (const [key, value] of Object.entries(route)) {
      if (!value || (key === "view" && value === "latest")) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    }
    if (url.href !== location.href) history.pushState(null, "", url);
    sync();
    if (scroll) {
      const workspace = root.querySelector(".gf-workspace");
      workspace.focus({ preventScroll: true });
      workspace.scrollIntoView({ behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "start" });
    }
  }

  function closePopup(popup) {
    if (!popup.open) return;
    if (!changingPopupHistory) forgetPopup(popup === linkDialog ? "link" : "dialog");
    popupCloseEvents.set(popup, (popupCloseEvents.get(popup) || 0) + 1);
    popup.close();
  }

  function expectedPopupClose(popup) {
    const count = popupCloseEvents.get(popup) || 0;
    if (count) popupCloseEvents.set(popup, count - 1);
    return count > 0;
  }

  function popupHistory() {
    const value = history.state?.gfPopup;
    return value?.owner === popupOwner && Array.isArray(value.stack) ? value.stack : null;
  }

  function writePopupHistory(method, stack = popupStack) {
    history[method]({ ...history.state, gfPopup: { owner: popupOwner, stack: [...stack] } }, "", location.href);
  }

  function capturePopup(persist = true) {
    if (!dialog.open) return;
    const entry = popupStack.findLast(item => item.kind !== "link");
    if (!entry) return;
    entry.scroll = dialogScroll.scrollTop;
    const input = dialog.querySelector("[data-gf-search-input]");
    if (input) {
      entry.query = input.value;
      entry.selection = [input.selectionStart, input.selectionEnd, input.selectionDirection];
      lastSearchEntry = entry;
    }
    if (persist && !popupHistoryPending) writePopupHistory("replaceState");
  }

  function rememberPopup(kind, key = "", replace = false, target = "") {
    if (changingPopupHistory) return;
    capturePopup();
    const previous = popupStack.at(-1);
    if (previous?.kind === kind && previous.key === key) return;
    if (!popupStack.length && !popupHistoryPending) writePopupHistory("replaceState", []);
    const entry = { id: ++popupSequence, kind, key, target };
    if (replace && popupStack.length) popupStack[popupStack.length - 1] = entry;
    else popupStack.push(entry);
    // History stores small descriptors, never reader DOM or decoded images.
    if (!popupHistoryPending) writePopupHistory(replace ? "replaceState" : "pushState");
  }

  function forgetPopup(kind) {
    if (changingPopupHistory) return;
    const index = kind === "link" ? popupStack.length - 1
      : popupStack.findLastIndex(entry => entry.kind !== "link");
    if (index < 0) return;
    popupStack = popupStack.slice(0, index);
    if (kind !== "link" && linkDialog.open) {
      changingPopupHistory = true;
      closePopup(linkDialog);
      changingPopupHistory = false;
    }
    const current = popupHistory();
    if (!popupHistoryPending && current?.length > popupStack.length) {
      popupHistoryPending = true;
      history.go(popupStack.length - current.length);
    }
  }

  function leavePopups(action, keepOpen = false) {
    const current = popupHistory();
    const pending = popupHistoryPending;
    clearDialogs(keepOpen);
    if (!current?.length && !pending) { action(); return; }
    popupNavigation = action;
    if (!pending) {
      popupHistoryPending = true;
      history.go(-current.length);
    }
  }

  function followPopupLink(event, anchor) {
    if ((!popupStack.length && !popupHistoryPending) || !anchor || event.defaultPrevented || event.button > 0 ||
        event.ctrlKey || event.metaKey || event.shiftKey || event.altKey || anchor.hasAttribute("download") ||
        anchor.target && anchor.target !== "_self") return false;
    event.preventDefault();
    const url = anchor.href;
    // Keep the current popup visible until pagehide replaces this document.
    leavePopups(() => location.assign(url), true);
    return true;
  }

  function restorePopupHistory() {
    const target = popupHistory();
    if (popupHistoryPending) {
      popupHistoryPending = false;
      if (target?.length > popupStack.length && popupStack.every((entry, index) => entry.id === target[index]?.id)) {
        popupHistoryPending = true;
        history.go(popupStack.length - target.length);
        return true;
      }
      if (target && JSON.stringify(target) !== JSON.stringify(popupStack)) writePopupHistory("pushState");
      const action = popupNavigation;
      popupNavigation = undefined;
      action?.();
      return true;
    }
    if (!target || isFeed && JSON.stringify(routeFromUrl()) !== JSON.stringify(route)) return false;
    capturePopup(false);
    changingPopupHistory = true;
    if (target.length <= popupStack.length && target.every((entry, index) => entry.id === popupStack[index]?.id)) {
      while (popupStack.length > target.length) {
        const entry = popupStack.pop();
        if (entry?.kind === "link") closePopup(linkDialog);
        else closePopup(dialog);
      }
      if (!popupStack.some(entry => entry.kind === "search")) searchReturn = null;
    } else {
      clearDialogs();
      for (const storedEntry of target) {
        const entry = storedEntry.kind === "search" && storedEntry.id === lastSearchEntry?.id ? lastSearchEntry : storedEntry;
        if (entry.kind === "search") {
          searchDialog();
          const input = dialog.querySelector("[data-gf-search-input]");
          input.value = entry.query || "";
          renderSearch(input.value);
          if (entry.selection) input.setSelectionRange(...entry.selection);
        } else if (entry.kind === "post" && knownPosts.has(entry.key)) postDialog(knownPosts.get(entry.key));
        else if (entry.kind === "group" && groupForSlug(entry.key)) groupDialog(groupForSlug(entry.key));
        else if (entry.kind === "share") shareDialog(entry.key);
        else if (entry.kind === "link") {
          const url = new URL(entry.key);
          if (!["http:", "https:"].includes(url.protocol)) break;
          openExternalLink(url, entry.target, document.activeElement);
        } else break;
        popupStack.push(entry);
        if (entry.kind !== "link") dialogScroll.scrollTop = entry.scroll || 0;
      }
      if (popupStack.length !== target.length) writePopupHistory("replaceState");
    }
    changingPopupHistory = false;
    return true;
  }

  function updatePopupScrollHint(scroller) {
    const popup = scroller.closest(".gf-dialog");
    if (!popup.open || popup.dataset.scrollHint === "dismissed") return;
    if (scroller.scrollTop > 0) popup.dataset.scrollHint = "dismissed";
    else if (scroller.scrollHeight > scroller.clientHeight + 1) popup.dataset.scrollHint = "visible";
    else popup.removeAttribute("data-scroll-hint");
  }

  function resetPopupScroll(popup) {
    if (!popup.open) popup.showModal();
    popup.removeAttribute("data-scroll-hint");
    const scroller = popupScroller(popup);
    scroller.scrollTop = 0;
    updatePopupScrollHint(scroller);
  }

  function showDialog(kind, content, { focusTarget, key = "", skipEntrance = dialog.open } = {}) {
    const child = dialog.open && dialog.dataset.kind === "search" && (kind === "group" || kind === "post");
    rememberPopup(kind, key, dialog.open && !child);
    if (child) {
      searchReturn = { content: dialogContent.firstChild, focus: document.activeElement, scrollTop: dialogScroll.scrollTop };
    }
    if (skipEntrance) dialog.dataset.gfSkipEntrance = "";
    else dialog.removeAttribute("data-gf-skip-entrance");
    if (!dialog.open) lastDialogFocus = document.activeElement;
    openDialogItem = null;
    dialog.dataset.kind = kind;
    dialog.dataset.group = "";
    dialogContent.replaceChildren(content);
    resetPopupScroll(dialog);
    (focusTarget || dialog.querySelector(".gf-dialog-close")).focus({ preventScroll: true });
  }

  function clearDialogs(keepOpen = false) {
    const changing = changingPopupHistory;
    changingPopupHistory = true;
    popupStack = [];
    searchReturn = null;
    lastDialogFocus = null;
    linkDialogFocus = null;
    openDialogItem = null;
    if (!keepOpen && dialog.open) closePopup(dialog);
    if (!keepOpen && linkDialog.open) closePopup(linkDialog);
    changingPopupHistory = changing;
  }

  function confirmExternalLink(event) {
    if (event.defaultPrevented || event.button > 1) return false;
    const anchor = event.target.closest?.("a[href]");
    if (!anchor || linkDialog.contains(anchor)) return false;
    let url;
    try { url = new URL(anchor.href); } catch { return false; }
    if (!["http:", "https:"].includes(url.protocol) || url.origin === location.origin || trustedSites.has(url.origin)) return false;
    event.preventDefault();
    openExternalLink(url, event.button === 1 || event.ctrlKey || event.metaKey || event.shiftKey ? "_blank" : anchor.getAttribute("target") || "_self", anchor);
    return true;
  }

  function openExternalLink(url, target, anchor) {
    rememberPopup("link", url.href, linkDialog.open, target);
    linkDialogFocus = anchor;
    const credentials = url.username || url.password ? `${url.username}${url.password ? ":" + url.password : ""}@` : "";
    find("link-url").replaceChildren(document.createTextNode(url.protocol + "//" + credentials),
      el("strong", null, url.host), document.createTextNode(url.pathname + url.search + url.hash));
    find("link-host").textContent = url.host;
    find("link-trust").checked = false;
    const visit = find("link-visit");
    visit.href = url.href;
    visit.target = target;
    resetPopupScroll(linkDialog);
    find("link-back").focus({ preventScroll: true });
    return true;
  }

  function visitExternalLink(event) {
    if (find("link-trust").checked) {
      trustedSites.add(new URL(find("link-visit").href).origin);
      saveSet(trustedSitesKey, trustedSites);
    }
    if (!followPopupLink(event, find("link-visit"))) closePopup(linkDialog);
  }

  function groupDialog(group) {
    showDialog("group", profileContent(group, "h2", group.name, true), { key: group.slug });
    dialog.dataset.group = group.slug;
    openDialogItem = { kind: "group", id: group.slug, data: group };
  }

  function postDialog(post) {
    const panel = el("div");
    const title = el("h2");
    title.innerHTML = renderPostTitle(post.title);
    title.id = "gf-dialog-title";
    title.dir = "auto";
    const body = el("div", "gf-post-text post-markdown");
    body.innerHTML = renderPostMarkdown(post.body);
    body.dir = "auto";
    panel.append(postMeta(post, true), title, body);
    const image = postImage(post, true);
    if (image) panel.append(image);
    panel.append(postActions(post, false));
    showDialog("post", panel, { key: post.id });
    dialog.dataset.group = post.group.slug;
    openDialogItem = { kind: "post", id: post.id, data: post };
  }

  function reconcileDialog() {
    if (!dialog.open || !openDialogItem || activeLoad && openDialogItem.kind === "post") return;
    const { kind, id, data } = openDialogItem;
    const current = kind === "group" ? groupForSlug(id) : knownPosts.get(id);
    if (!current) {
      if (!errorMessage) closePopup(dialog);
      return;
    }
    if (current === data) return;
    if (JSON.stringify(current) === JSON.stringify(data)) {
      openDialogItem.data = current;
      return;
    }
    const scroll = dialogScroll.scrollTop;
    if (kind === "group") groupDialog(current);
    else postDialog(current);
    dialogScroll.scrollTop = scroll;
  }

  function renderSearch(query) {
    const results = dialog.querySelector("[data-gf-search-results]");
    if (!results) return;
    const loading = !catalogCurrent() && !catalogError;
    results.setAttribute("aria-busy", String(loading));
    if (loading) {
      reconcileRows(results, [{ key: "loading", create: () => el("p", "gf-caption", "Loading groups…") }]);
      return;
    }
    const text = query.trim().toLocaleLowerCase();
    const matchingGroups = (catalogCurrent() ? [...groups.values()] : []).filter((group) =>
      `${group.name} ${group.region} ${group.bio || ""}`.toLocaleLowerCase().includes(text)).slice(0, 7);
    const matchingPosts = [...knownPosts.values()].filter((post) =>
      `${post.title} ${post.body} ${post.group.name}`.toLocaleLowerCase().includes(text)).slice(0, 7);
    const rows = [];
    if (matchingGroups.length) {
      rows.push({ key: "groups-heading", create: () => el("h3", null, "Groups") });
      for (const group of matchingGroups) {
        rows.push({
          key: "group:" + group.slug,
          signature: JSON.stringify([group.name, group.region, group.iconUrl]),
          create: () => {
            const button = identity(group, true);
            button.classList.add("gf-search-result");
            return button;
          },
        });
      }
    }
    if (matchingPosts.length) {
      rows.push({ key: "posts-heading", create: () => el("h3", null, "Loaded posts") });
      for (const post of matchingPosts) {
        rows.push({
          key: "post:" + post.id,
          signature: JSON.stringify([post.title, post.group.name]),
          create: () => {
            const button = action("read", undefined, post.id, "gf-search-result gf-search-post");
            const title = el("span");
            title.innerHTML = renderPostTitle(post.title);
            button.append(title, el("span", "gf-region", post.group.name));
            return button;
          },
        });
      }
    }
    if (!catalogCurrent() || !rows.length) {
      const message = catalogError ? "Could not load groups. Reopen search to retry."
        : !catalogCurrent() ? "Loading groups…" : "No matching groups or loaded posts.";
      rows.push({ key: "empty", signature: message, create: () => el("p", "gf-caption", message) });
    }
    reconcileRows(results, rows);
  }

  function searchDialog() {
    searchReturn = null;
    const panel = el("div");
    const title = el("h2", null, "Find your next group");
    title.id = "gf-dialog-title";
    const field = el("label", "gf-search-field");
    const searchIcon = el("span", "gf-search-icon");
    searchIcon.setAttribute("aria-hidden", "true");
    const input = el("input");
    input.type = "search";
    input.placeholder = "Search groups or posts…";
    input.setAttribute("aria-label", "Search groups and loaded posts");
    input.autocomplete = "off";
    input.maxLength = 80;
    input.dataset.gfSearchInput = "";
    field.append(searchIcon, input);
    const results = el("div", "gf-dialog-results");
    results.dataset.gfSearchResults = "";
    results.setAttribute("aria-live", "polite");
    panel.append(title, field, results);
    showDialog("search", panel, { focusTarget: input });
    ensureCatalog();
    renderSearch("");
  }

  function toast(message) {
    const notice = find("toast");
    notice.textContent = message;
    notice.hidden = false;
    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => { notice.hidden = true; }, 2400);
  }

  async function copyPlatoLink(group, button) {
    const url = platoLinkUrl(group);
    if (!url) return;
    const contact = button.closest(".gf-manager-contact");
    const notice = contact.querySelector(".gf-copy-status");
    try {
      await navigator.clipboard.writeText(url);
      notice.textContent = "Plato link copied.";
      button.replaceChildren(icon("check"));
      button.title = "Plato link copied";
      setTimeout(() => {
        if (!button.isConnected) return;
        button.replaceChildren(icon("copy"));
        button.title = "Copy Plato link";
      }, 2000);
    } catch {
      const selection = window.getSelection?.();
      selection?.selectAllChildren(contact.querySelector(".gf-friend-url"));
      notice.textContent = selection?.toString() === url
        ? "Link selected. Use your device's Copy option."
        : "Select the Plato link to copy it.";
    }
  }

  async function share(path, button) {
    const url = new URL(path, location.href).href;
    try {
      await navigator.clipboard.writeText(url);
      if (dialog.open && dialog.contains(button)) {
        const label = button.textContent;
        button.replaceChildren(icon("check"), document.createTextNode("Copied"));
        setTimeout(() => { if (button.isConnected) button.textContent = label; }, 2000);
      } else {
        toast("Link copied.");
      }
    } catch {
      shareDialog(url);
    }
  }

  function shareDialog(url) {
    const panel = el("div");
    const title = el("h2", null, "Share this link");
    title.id = "gf-dialog-title";
    const field = el("label", "gf-search-field gf-link-box");
    const input = el("input");
    input.value = url;
    input.readOnly = true;
    input.setAttribute("aria-label", "Link to copy");
    field.append(input);
    panel.append(title, field);
    showDialog("share", panel, { focusTarget: input, key: url });
    input.select();
  }

  function toggle(key, id) {
    const selectionChanged = syncSelections();
    const isSave = key === "save";
    const values = isSave ? saved : following;
    const group = isSave ? undefined : groupForSlug(id);
    const active = group ? !followsGroup(group) : !values.has(id);
    if (!isSave && active && values.size >= 200) {
      if (selectionChanged) sync();
      toast("You can follow up to 200 groups. Unfollow a group to add another.");
      return;
    }
    if (active) values.add(group?.slug || id);
    else {
      values.delete(group?.slug || id);
      for (const slug of group?.previousSlugs || []) values.delete(slug);
    }
    if (isSave && !active) {
      savedView.loaded.delete(id);
      savedView.posts = savedView.posts.filter(post => post.id !== id);
    }
    if (isSave && active && !savedView.loaded.has(id)) savedView.loadedAt = 0;
    saveSet(isSave ? savedKey : followingKey, values);
    updateSelectionButtons(key);
    if (!dialog.open) toast(isSave ? (active ? "Post saved." : "Post removed from Saved.") : (active ? "Group followed." : "Group unfollowed."));
    if (selectionChanged || !isSave && route.view === "following") sync();
    else if (isSave && route.view === "saved") render();
  }

  // Safari can carry a dialog's focus ring back to its mouse/touch opener.
  document.addEventListener("pointerdown", () => { root.dataset.gfPointer = "true"; }, true);
  document.addEventListener("keydown", event => {
    if (!event.metaKey && !event.ctrlKey && !event.altKey) root.removeAttribute("data-gf-pointer");
  }, true);

  root.addEventListener("click", (event) => {
    if (event.target === dialog || event.target === linkDialog) {
      const popup = event.target;
      const bounds = popup.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) closePopup(popup);
      return;
    }
    if (linkDialog.contains(event.target)) {
      if (event.target.closest?.("[data-gf-link-visit]")) visitExternalLink(event);
      else if (event.target.closest?.("[data-gf-link-back]")) closePopup(linkDialog);
      return;
    }
    if (confirmExternalLink(event)) return;
    if (followPopupLink(event, event.target.closest?.("a[href]"))) return;
    const spoiler = event.target.closest?.("[data-post-spoiler]");
    if (spoiler) {
      const expanded = spoiler.getAttribute("aria-expanded") !== "true";
      spoiler.setAttribute("aria-expanded", String(expanded));
      spoiler.setAttribute("aria-label", expanded ? spoiler.textContent + ". Hide spoiler" : "Reveal spoiler");
      return;
    }
    const button = event.target.closest?.("[data-gf-action]");
    if (!button) {
      const card = event.target.closest?.("[data-gf-post], [data-gf-group]");
      if (!card || dialog.open || event.defaultPrevented || event.button > 0 || event.ctrlKey || event.metaKey || event.shiftKey || event.altKey ||
        event.target.closest?.("a,button,input,textarea,select,label,details,[contenteditable]")) return;
      const post = knownPosts.get(card.dataset.gfPost);
      const group = groupForSlug(card.dataset.gfGroup);
      if (!post && !group) return;
      if (window.getSelection?.()?.toString()) return;
      card.focus({ preventScroll: true });
      if (post) postDialog(post);
      else groupDialog(group);
      return;
    }
    if (button.disabled) return;
    const { gfAction, key } = button.dataset;
    const group = groupForSlug(key);
    const post = knownPosts.get(key);
    switch (gfAction) {
      case "view":
      case "jump":
        navigate({ view: key, post: "", group: key === "latest" ? route.group : "" }, gfAction === "jump");
        break;
      case "region":
        navigate({ region: key || "", group: "" });
        break;
      case "clear-group":
        navigate({ group: "" });
        break;
      case "refresh": {
        const refresh = find("refresh");
        if (refresh) {
          clearTimeout(refreshSpinTimeout);
          refresh.dataset.spinning = "true";
          refreshSpinTimeout = setTimeout(() => refresh.removeAttribute("data-spinning"), 800);
        }
        sync(true);
        break;
      }
      case "retry-image":
        retryImages(button.closest(".gf-reader-image"), true);
        break;
      case "more":
        if (route.view === "saved") loadSaved(true);
        else loadTimeline(true);
        break;
      case "search":
        searchDialog();
        break;
      case "sidebar-groups":
        loadSidebar();
        break;
      case "group":
        if (group) {
          button.focus({ preventScroll: true });
          groupDialog(group);
        }
        break;
      case "read":
        if (post) {
          if (dialog.open && dialog.dataset.kind === "search") button.focus({ preventScroll: true });
          postDialog(post);
        }
        break;
      case "save":
      case "follow":
        toggle(gfAction, key);
        break;
      case "share-post":
        if (post) share(postUrl(post), button);
        break;
      case "share-group":
        if (group) share(profileUrl(group), button);
        break;
      case "copy-friend": {
        if (group) copyPlatoLink(group, button);
        break;
      }
      case "close":
        closePopup(dialog);
        break;
    }
  });

  root.addEventListener("auxclick", event => {
    if (event.button !== 1) return;
    if (event.target.closest?.("[data-gf-link-visit]")) visitExternalLink(event);
    else confirmExternalLink(event);
  });

  root.addEventListener("keydown", event => {
    if ((event.key === "Enter" || event.key === " ") && event.target.matches?.("[data-gf-post], [data-gf-group]")) {
      const post = knownPosts.get(event.target.dataset.gfPost);
      const group = groupForSlug(event.target.dataset.gfGroup);
      if (post || group) {
        event.preventDefault();
        if (post) postDialog(post);
        else groupDialog(group);
      }
    }
  });

  root.addEventListener("error", event => {
    const image = event.target;
    if (!image.matches?.("img.md-emoji")) return;
    (image.closest("picture") || image).replaceWith(document.createTextNode(image.getAttribute("alt") || ":emoji:"));
  }, true);

  root.addEventListener("input", (event) => {
    if (event.target === find("directory-search")) renderDirectory();
    if (event.target.matches("[data-gf-search-input]")) {
      renderSearch(event.target.value);
      // Keep the latest query for Back and Forward without writing browser history on each edit.
      capturePopup(false);
    }
  });
  const popupScrollObserver = typeof ResizeObserver === "function" ? new ResizeObserver(entries => {
    for (const { target } of entries) updatePopupScrollHint(target.closest(".gf-dialog-scroll"));
  }) : null;
  for (const popup of [dialog, linkDialog]) {
    const scroller = popupScroller(popup);
    popupScrollObserver?.observe(scroller);
    popupScrollObserver?.observe(scroller.firstElementChild);
    scroller.addEventListener("scroll", () => updatePopupScrollHint(scroller), { passive: true });
    popup.addEventListener("cancel", event => {
      event.preventDefault();
      closePopup(popup);
    });
  }
  dialog.addEventListener("close", () => {
    const expected = expectedPopupClose(dialog);
    if (dialog.open) return;
    if (!expected) forgetPopup("dialog");
    openDialogItem = null;
    if (searchReturn) {
      const previous = searchReturn;
      const opener = lastDialogFocus;
      searchReturn = null;
      showDialog("search", previous.content, { skipEntrance: true });
      lastDialogFocus = opener;
      renderSearch(dialog.querySelector("[data-gf-search-input]").value);
      ensureCatalog();
      const focus = previous.content.contains(previous.focus) ? previous.focus : dialog.querySelector("[data-gf-search-input]");
      focus.focus({ preventScroll: true });
      dialogScroll.scrollTop = previous.scrollTop;
      return;
    }
    if (lastDialogFocus?.isConnected) lastDialogFocus.focus({ preventScroll: true });
  });
  linkDialog.addEventListener("close", () => {
    const expected = expectedPopupClose(linkDialog);
    if (linkDialog.open) return;
    if (!expected) forgetPopup("link");
    if (linkDialogFocus?.isConnected) linkDialogFocus.focus({ preventScroll: true });
    else if (dialog.open) dialog.querySelector(".gf-dialog-close").focus({ preventScroll: true });
    linkDialogFocus = null;
  });
  document.addEventListener("visibilitychange", recover);
  window.addEventListener("pagehide", () => {
    clearDialogs();
    popupHistoryPending = false;
    popupNavigation = undefined;
  });
  window.addEventListener("pageshow", event => {
    if (event.persisted) leavePopups(() => {});
    recover(event);
  });
  for (const event of ["focus", "online"]) window.addEventListener(event, recover);
  if (isFeed) {
    find("group-list").addEventListener("focusin", () => {
      if (!catalogError) loadSidebar();
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !dialog.open && !linkDialog.open &&
        !event.target.closest?.("input, textarea, select, [contenteditable]")) {
        event.preventDefault();
        searchDialog();
      }
    });
    const hero = find("hero");
    if (matchMedia("(hover: hover) and (prefers-reduced-motion: no-preference)").matches) {
      hero.addEventListener("pointermove", (event) => {
        const box = hero.getBoundingClientRect();
        hero.style.setProperty("--gf-glow-x", `${(event.clientX - box.left) / box.width * 100}%`);
        hero.style.setProperty("--gf-glow-y", `${(event.clientY - box.top) / box.height * 100}%`);
      });
    }
  }
  window.addEventListener("popstate", () => {
    if (restorePopupHistory()) return;
    clearDialogs();
    if (isFeed) { route = routeFromUrl(); sync(); }
  });
  if (mode === "profile" && (!profileSlug || !groupKey.test(profileSlug))) {
    postsNode.setAttribute("aria-busy", "false");
    setStatus(status, "Choose a group from the directory.");
  } else {
    sync();
  }
})();
