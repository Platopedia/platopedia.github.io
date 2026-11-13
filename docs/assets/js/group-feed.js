import { renderPostMarkdown } from "./group-feed-markdown.js?v=20261113.1";

(() => {
  const root = document.querySelector("[data-group-feed]");
  if (!root) return;

  const api = new URL(root.dataset.api);
  const mode = root.dataset.mode;
  const isFeed = mode === "feed";
  const isEmbed = mode === "embed";
  const profileSlug = isEmbed ? root.dataset.group : new URLSearchParams(location.search).get("group");
  const find = (name) => root.querySelector(`[data-gf-${name}]`);
  const postsNode = find("posts");
  const status = find("status");
  const more = find("more");
  const dialog = find("dialog");
  const dialogContent = find("dialog-content");
  const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
  const groupKey = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
  const postKey = /^\d{17,20}$/;
  const views = new Set(["latest", "directory", "following", "saved"]);
  const palette = ["#1266bf", "#0a747e", "#3e57a1", "#12618c", "#455c7a"];
  const iconPaths = {
    plus: "M12 5v14M5 12h14",
    check: "m5 13 4 4L19 7",
    close: "m6 6 12 12M18 6 6 18",
    external: "M7 17 17 7M7 7h10v10",
    right: "M5 12h14m-6-6 6 6-6 6",
    expand: "M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5",
    copy: "M8 8H3v13h13v-5M8 3h13v13H8z",
  };
  const savedKey = "platopedia.groupFeed.saved";
  const followingKey = "platopedia.groupFeed.following";
  const freshFor = 60_000;
  const imageRecovery = new WeakMap();

  let route = routeFromUrl();
  const groups = new Map();
  const knownPosts = new Map();
  const renderedPosts = new Map();
  const renderedGroups = new Map();
  let saved = storedSet(savedKey, postKey);
  let following = storedSet(followingKey, groupKey);
  let catalogComplete = false;
  let catalogLoadedAt = 0;
  let catalogLoad;
  let catalogError = false;
  let timeline = { key: "", posts: [], cursor: null, loadedAt: 0 };
  let savedView = { posts: [], loaded: new Set(), loadedAt: 0 };
  let activeLoad;
  let activeStartedAt = 0;
  let lastRecoveryAt = 0;
  let errorMessage = "";
  let lastDialogFocus;
  let toastTimeout;
  let discoverySignature = "";
  let profileSignature = "";

  function routeFromUrl() {
    const query = new URLSearchParams(location.search);
    const group = query.get("group");
    const post = query.get("post");
    const view = query.get("view");
    return {
      view: isFeed && views.has(view) && !post ? view : "latest",
      group: isFeed && group && group.length <= 60 && groupKey.test(group) ? group : "",
      region: isFeed ? (query.get("region") || "").slice(0, 60) : "",
      post: isFeed && postKey.test(post) ? post : "",
    };
  }

  function storedSet(key, pattern) {
    try {
      const values = JSON.parse(localStorage.getItem(key));
      return new Set(Array.isArray(values) ? values.filter((value) => typeof value === "string" && pattern.test(value)) : []);
    } catch {
      return new Set();
    }
  }

  function saveSet(key, values) {
    try {
      localStorage.setItem(key, JSON.stringify([...values]));
    } catch {
      // Keep the current tab usable when browser storage is unavailable.
    }
  }

  function el(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
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

  function managerFriendUrl(group) {
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

  function avatar(group) {
    const frame = el("span", "gf-avatar", Array.from(group.name)[0]?.toLocaleUpperCase() || "•");
    frame.style.setProperty("--avatar-color", colorFor(group.slug));
    frame.setAttribute("aria-hidden", "true");
    const url = safeUrl(group.iconUrl, [api.origin]);
    if (url) {
      const image = el("img");
      image.alt = "";
      image.loading = "lazy";
      image.decoding = "async";
      watchImage(image);
      image.src = url;
      frame.append(image);
    }
    return frame;
  }

  function watchImage(image, target = image, fallback) {
    const recovery = { target, fallback, retryAt: 0 };
    imageRecovery.set(image, recovery);
    image.addEventListener("error", () => {
      image.dataset.gfImageFailed = "true";
      recovery.retryAt = Date.now() + 30_000;
      target.hidden = true;
      if (fallback) fallback.hidden = false;
    });
    image.addEventListener("load", () => {
      image.removeAttribute("data-gf-image-failed");
      target.hidden = false;
      if (fallback) fallback.hidden = true;
    });
  }

  function retryImages(scope = root, force = false) {
    for (const image of scope.querySelectorAll("img[data-gf-image-failed]")) {
      const recovery = imageRecovery.get(image);
      if (!recovery || !force && Date.now() < recovery.retryAt) continue;
      image.removeAttribute("data-gf-image-failed");
      recovery.target.hidden = false;
      if (recovery.fallback) recovery.fallback.hidden = true;
      // Reuse the same URL and element; healthy images never enter this path.
      image.src = image.src;
    }
  }

  function identity(group) {
    const control = action("group", undefined, group.slug, "gf-identity");
    const text = el("span", "gf-identity-text");
    const name = el("strong", null, group.name);
    name.dir = "auto";
    text.append(name, el("span", "gf-region", group.region));
    control.append(avatar(group), text);
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

  function followButton(group) {
    const button = action("follow", undefined, group.slug, "gf-button gf-follow");
    button.setAttribute("aria-label", `Follow ${group.name}`);
    updateToggle(button, following.has(group.slug));
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
    identityRow.append(avatar(group), text);
    const tools = el("div", "gf-profile-tools");
    tools.append(followButton(group), action("share-group", "Share", group.slug, "gf-button gf-profile-share"));
    overview.append(identityRow, tools);
    fragment.append(overview);
    const details = el("div", "gf-profile-details");
    if (group.bio) {
      const about = el("section", "gf-profile-about");
      const bio = el("p", "gf-group-bio", group.bio);
      bio.dir = "auto";
      about.append(el("h3", "gf-profile-label", "About the group"), bio);
      details.append(about);
    }
    const friendUrl = managerFriendUrl(group);
    if (friendUrl) {
      const contact = el("section", "gf-manager-contact");
      const label = el("label", "gf-profile-label", "Manager's friend link");
      const input = el("textarea", "gf-friend-input");
      input.id = `gf-friend-${inDialog ? "dialog" : mode}-${group.slug}`;
      input.value = friendUrl;
      input.readOnly = true;
      input.rows = 2;
      input.spellcheck = false;
      input.dir = "ltr";
      input.setAttribute("aria-label", `${group.name} manager's Plato friend link`);
      input.setAttribute("autocapitalize", "off");
      input.addEventListener("focus", () => input.select());
      label.htmlFor = input.id;
      const field = el("div", "gf-friend-field");
      const copy = action("copy-friend", undefined, group.slug, "gf-button gf-friend-copy");
      copy.setAttribute("aria-label", `Copy ${group.name} manager's friend link`);
      copy.title = "Copy friend link";
      copy.append(icon("copy"));
      const notice = el("p", "gf-copy-status");
      notice.setAttribute("role", "status");
      field.append(input, copy);
      const connect = link(friendUrl, "Connect on Plato", "gf-button gf-primary", "external");
      connect.rel = "noreferrer";
      contact.append(label, el("p", "gf-contact-help", "Add the manager on Plato to ask about joining."), field, notice, connect);
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
    const group = groups.get(profileSlug);
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
    const image = el("img");
    image.alt = `Image attached to ${post.title}`;
    image.decoding = "async";
    if (inReader) {
      image.className = "gf-dialog-image";
      const frame = el("div", "gf-reader-image");
      const fallback = el("p", "gf-status", "Image could not load. ");
      fallback.hidden = true;
      fallback.append(action("retry-image", "Retry image"));
      watchImage(image, image, fallback);
      image.src = url;
      frame.append(image, fallback);
      return frame;
    }
    image.loading = "lazy";
    const control = action("image", undefined, post.id, "gf-image-button");
    control.setAttribute("aria-label", `Enlarge image for ${post.title}`);
    const expand = el("span", "gf-image-expand");
    expand.setAttribute("aria-hidden", "true");
    expand.append(icon("expand"));
    watchImage(image, control);
    image.src = url;
    control.append(image, expand);
    return control;
  }

  function postMeta(post) {
    const meta = el("div", "gf-card-meta");
    const timestamp = new Date(post.publishedAt);
    meta.append(identity(post.group));
    if (!Number.isNaN(timestamp.getTime())) {
      const time = el("time", "gf-date", dateFormat.format(timestamp));
      time.dateTime = timestamp.toISOString();
      meta.append(time);
    }
    return meta;
  }

  function postCard(post) {
    const article = el("article", "gf-card");
    article.id = `post-${post.id}`;
    const heading = el("h3");
    heading.dir = "auto";
    heading.append(action("read", post.title, post.id, "gf-post-title"));
    const body = el("div", "gf-post-text post-markdown is-preview");
    body.innerHTML = renderPostMarkdown(post.body);
    body.dir = "auto";
    article.append(postMeta(post), heading, body);
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
    const labels = new Map();
    for (const group of groups.values()) labels.set(group.region.toLocaleLowerCase(), group.region);
    const regions = ["", ...[...labels.values()].sort((a, b) => a.localeCompare(b))];
    const controls = regions.map((region) => {
      const button = action("region", region || "All servers", region, "");
      button.setAttribute("aria-pressed", String(region.toLocaleLowerCase() === route.region.toLocaleLowerCase()));
      return button;
    });
    const regionControls = find("regions");
    const focusedRegion = regionControls.contains(document.activeElement) ? document.activeElement.dataset.key : null;
    regionControls.replaceChildren(...controls);
    if (focusedRegion !== null) {
      controls.find((control) => control.dataset.key === focusedRegion)?.focus({ preventScroll: true });
    }
    const groupFilter = find("group-filter");
    groupFilter.replaceChildren(document.createTextNode(groups.get(route.group)?.name || route.group), icon("close"));
    groupFilter.hidden = !route.group;
    find("filterbar").hidden = Boolean(route.post) || (regions.length <= 1 && !route.group);

    const available = visibleGroups();
    const featured = available.slice(0, 5);
    const signature = JSON.stringify(featured.map((group) => [group.slug, group.name, group.region, group.iconUrl]));
    if (discoverySignature !== signature) {
      find("group-list").replaceChildren(...featured.map((group) => {
        const item = el("li");
        item.append(identity(group));
        return item;
      }));
      discoverySignature = signature;
    }
    setStatus(find("sidebar-status"), available.length ? "" : activeLoad ? "Loading groups…" : "No groups in this view.");
  }

  function renderDirectory() {
    if (!isFeed || route.view !== "directory") return;
    const available = visibleGroups(find("directory-search").value);
    const count = find("directory-count");
    count.textContent = available.length ? `${available.length} ${available.length === 1 ? "group" : "groups"}` : "";
    const visible = new Set(available.map(group => group.slug));
    for (const [slug, entry] of renderedGroups) if (!visible.has(slug)) {
      entry.card.remove();
      renderedGroups.delete(slug);
    }
    available.forEach((group, index) => {
      const signature = JSON.stringify([group.name, group.region, group.bio, group.iconUrl]);
      let entry = renderedGroups.get(group.slug);
      if (entry?.signature !== signature) {
        const card = el("article", "gf-directory-card");
        card.style.setProperty("--avatar-color", colorFor(group.slug));
        card.append(identity(group));
        if (group.bio) card.append(el("p", "gf-group-bio", group.bio));
        const actions = el("div", "gf-profile-actions");
        actions.append(followButton(group), link(profileUrl(group), "Open profile", "gf-button", "external"));
        card.append(actions);
        entry?.card.remove();
        entry = { card, signature };
        renderedGroups.set(group.slug, entry);
      }
      const grid = find("directory-grid");
      if (grid.children[index] !== entry.card) grid.insertBefore(entry.card, grid.children[index] || null);
    });
    const directoryStatus = find("directory-status");
    const message = catalogError ? "Could not load the directory. " : !catalogComplete ? "Loading groups…" :
      available.length ? "" : "No groups match this search.";
    setStatus(directoryStatus, message, Boolean(catalogLoad));
    if (catalogError) directoryStatus.append(action("refresh", "Retry"));
  }

  function filteredPosts() {
    const source = route.view === "saved" ? savedView.posts.filter((post) => saved.has(post.id)) : timeline.posts;
    return source.filter((post) => (!catalogComplete || groups.has(post.group.slug)) &&
      (route.view !== "following" || following.has(post.group.slug)) &&
      (route.view !== "saved" || !route.region || post.group.region.toLocaleLowerCase() === route.region.toLocaleLowerCase()));
  }

  function renderPosts(posts) {
    const active = new Set(posts.map((post) => post.id));
    for (const [id, entry] of renderedPosts) {
      if (!active.has(id)) entry.card.remove();
    }
    posts.forEach((post, index) => {
      let entry = renderedPosts.get(post.id);
      const signature = JSON.stringify([post.title, post.body, post.publishedAt, post.imageUrl,
        post.originalImageUrl, post.group.slug, post.group.name, post.group.region, post.group.iconUrl]);
      if (entry?.signature !== signature) {
        entry?.card.remove();
        entry = { signature, card: postCard(post) };
      }
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
    if (isFeed) {
      for (const button of root.querySelectorAll('[data-gf-action="view"]')) {
        if (button.dataset.key === route.view) button.setAttribute("aria-current", "page");
        else button.removeAttribute("aria-current");
      }
      find("feed-view").hidden = route.view === "directory";
      find("directory-view").hidden = route.view !== "directory";
      find("back").hidden = !route.post;
      find("heading").textContent = route.post ? "Group post" : ({
        latest: route.group ? `${groups.get(route.group)?.name || "Group"} posts` : "Latest posts",
        following: "Following",
        saved: "Saved posts",
      })[route.view] || "Latest posts";
      renderDiscovery();
      renderDirectory();
    }

    if (isFeed && route.view === "directory") {
      retryImages();
      return;
    }
    const posts = filteredPosts();
    replaceKnownPosts(posts);
    postsNode.setAttribute("aria-busy", String(Boolean(activeLoad)));
    renderPosts(posts);
    retryImages();
    const refresh = find("refresh");
    if (refresh) {
      refresh.disabled = Boolean(activeLoad);
      refresh.setAttribute("aria-busy", String(Boolean(activeLoad)));
    }
    const hasMore = route.view === "saved" ? [...saved].some((id) => !savedView.loaded.has(id)) :
      Boolean(timeline.cursor && (route.view !== "following" || following.size));
    more.hidden = !hasMore;
    more.disabled = Boolean(activeLoad);
    more.firstChild.textContent = route.view === "saved" ? "Load more saved posts " : "Load older posts ";
    const noPosts = route.post ? "This post is unavailable." :
      route.view === "following" ? (!following.size ? "Follow a group to see its posts here." :
        hasMore ? "No followed groups in these posts yet. Load older posts to keep looking." : "Your followed groups have no posts in this view.") :
      route.view === "saved" ? (!saved.size ? "Save a post to find it here again." : "No saved posts in this view.") :
      "No posts have been published here yet.";
    const message = errorMessage || (activeLoad ? (posts.length ? "" : "Loading group posts…") : posts.length ? "" : noPosts);
    setStatus(status, message, Boolean(activeLoad) && !errorMessage);
    if (errorMessage) {
      status.append(document.createTextNode(" "), action("refresh", "Retry"));
    }
  }

  async function requestFeed(params, signal) {
    const url = new URL(api);
    const query = { ...params, catalog: params.catalog ?? (catalogComplete ? "0" : "") };
    for (const [key, value] of Object.entries(query)) if (value) url.searchParams.set(key, value);
    const controller = new AbortController();
    let timedOut = false;
    const cancel = () => controller.abort();
    if (signal?.aborted) controller.abort();
    else signal?.addEventListener("abort", cancel, { once: true });
    const timer = setTimeout(() => { timedOut = true; controller.abort(); }, 12_000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { accept: "application/json" } });
      if (response.status === 404 && params.group) return null;
      if (!response.ok) throw new Error("Group feed request failed");
      const data = await response.json();
      if (!Array.isArray(data.groups) || !Array.isArray(data.posts)) throw new Error("Unexpected group feed response");
      return data;
    } catch (error) {
      if (timedOut) throw new Error("The group feed took too long to respond.");
      throw error;
    } finally {
      clearTimeout(timer);
      signal?.removeEventListener("abort", cancel);
    }
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

  function ingest(data, allGroups = false) {
    const replacing = allGroups && (data.catalogIncluded !== false && data.groups.length || data.catalogIncluded === true);
    const previous = replacing ? new Map(groups) : null;
    if (replacing) {
      groups.clear();
      catalogComplete = true;
      catalogLoadedAt = Date.now();
      catalogError = false;
    }
    for (const group of data.groups) {
      const remembered = previous?.get(group.slug);
      mergeGroup(remembered?.updatedAt > group.updatedAt ? remembered : group);
    }
    for (const post of data.posts) {
      mergeGroup(post.group);
    }
    if (replacing) {
      for (const [id, post] of knownPosts) if (!groups.has(post.group.slug)) knownPosts.delete(id);
      if (dialog.open && dialog.dataset.group && !groups.has(dialog.dataset.group)) dialog.close();
    }
  }

  async function ensureCatalog(force = false) {
    if (!force && !catalogError && catalogComplete && Date.now() - catalogLoadedAt < freshFor) return;
    if (!catalogLoad) {
      catalogError = false;
      const load = { controller: new AbortController(), startedAt: Date.now() };
      catalogLoad = load;
      load.promise = requestFeed({ catalog: "only" }, load.controller.signal).then((data) => {
        if (catalogLoad === load) ingest(data, true);
      }).catch(() => {
        if (catalogLoad === load) catalogError = true;
      }).finally(() => {
        if (catalogLoad !== load) return;
        catalogLoad = null;
        render();
        const input = dialog.querySelector("[data-gf-search-input]");
        if (dialog.open && input) renderSearch(input.value);
      });
    }
    return catalogLoad.promise;
  }

  function timelineParams() {
    return { group: isFeed ? route.group : profileSlug, region: route.region, post: route.post,
      groups: isFeed && route.view === "following" ? [...following].sort().join(",") : "" };
  }

  function timelineId(params) {
    return JSON.stringify({ ...params, following: route.view === "following" });
  }

  async function loadTimeline(append = false, refreshCatalog = false, preservePages = false) {
    const params = timelineParams();
    const key = timelineId(params);
    if (append && (!timeline.cursor || timeline.key !== key)) return;
    activeLoad?.abort();
    const controller = new AbortController();
    activeLoad = controller;
    activeStartedAt = Date.now();
    errorMessage = "";
    const nextTimeline = {
      key, posts: append ? [...timeline.posts] : [], cursor: append ? timeline.cursor : null,
      loadedAt: append ? timeline.loadedAt : 0,
    };
    const keepCount = preservePages && timeline.key === key ? timeline.posts.length : 0;
    if (timeline.key !== key) timeline = { key, posts: [], cursor: null, loadedAt: 0 };
    render();
    try {
      if (route.view === "following" && !following.size) {
        if (refreshCatalog) {
          const data = await requestFeed({ catalog: "only" }, controller.signal);
          if (activeLoad !== controller) return;
          ingest(data, true);
        }
        timeline = { ...nextTimeline, loadedAt: Date.now() };
        return;
      }
      let before = append ? timeline.cursor : "";
      do {
        activeStartedAt = Date.now();
        const data = await requestFeed({ ...params, before, ...(refreshCatalog ? { catalog: "all" } : {}) }, controller.signal);
        if (activeLoad !== controller) return;
        if (!data) {
          groups.delete(params.group);
          if (dialog.open && dialog.dataset.group === params.group) dialog.close();
          if (isEmbed) root.hidden = true;
          if (!isFeed) {
            find("profile").hidden = true;
            profileSignature = "";
          }
          errorMessage = "This group could not be found.";
          break;
        } else {
          ingest(data, refreshCatalog || isFeed && !params.group && !params.post);
          const existing = new Set(nextTimeline.posts.map((post) => post.id));
          nextTimeline.posts.push(...data.posts.filter((post) => !existing.has(post.id)));
          nextTimeline.cursor = data.next;
          if (!isFeed) renderProfile();
        }
        refreshCatalog = false;
        if (!nextTimeline.cursor || nextTimeline.cursor === before) break;
        before = nextTimeline.cursor;
      } while (nextTimeline.posts.length < keepCount);
      if (!errorMessage && !append) nextTimeline.loadedAt = Date.now();
      timeline = nextTimeline;
    } catch (error) {
      if (activeLoad !== controller || controller.signal.aborted) return;
      errorMessage = "Could not load group posts.";
    } finally {
      if (activeLoad === controller) {
        activeLoad = null;
        render();
      }
    }
  }

  async function loadSaved(append = false, refreshCatalog = false, preservePages = false) {
    activeLoad?.abort();
    const controller = new AbortController();
    activeLoad = controller;
    activeStartedAt = Date.now();
    errorMessage = "";
    const nextSaved = {
      posts: append ? [...savedView.posts] : [], loaded: append ? new Set(savedView.loaded) : new Set(),
      loadedAt: append ? savedView.loadedAt : 0,
    };
    const count = preservePages ? Math.max(8, savedView.loaded.size) : 8;
    const ids = [...saved].reverse().filter((id) => !nextSaved.loaded.has(id)).slice(0, count);
    render();
    try {
      const byId = new Map();
      for (let offset = 0; offset < Math.max(1, ids.length); offset += 8) {
        activeStartedAt = Date.now();
        const batch = ids.slice(offset, offset + 8);
        const data = batch.length ? await requestFeed({ posts: batch.join(","), catalog: refreshCatalog ? "all" : "0" }, controller.signal)
          : refreshCatalog ? await requestFeed({ catalog: "only" }, controller.signal) : { groups: [], posts: [] };
        if (activeLoad !== controller) return;
        ingest(data, refreshCatalog);
        for (const post of data.posts) byId.set(post.id, post);
        nextSaved.posts.push(...batch.map(id => byId.get(id)).filter(Boolean));
        for (const id of batch) nextSaved.loaded.add(id);
        refreshCatalog = false;
      }
      if (!append) nextSaved.loadedAt = Date.now();
      savedView = nextSaved;
      // Keep an already loaded timeline consistent with the posts just rechecked in Saved.
      const checked = new Set(ids);
      timeline.posts = timeline.posts.flatMap(post => checked.has(post.id) ? byId.get(post.id) || [] : post);
    } catch (error) {
      if (activeLoad !== controller || controller.signal.aborted) return;
      errorMessage = "Could not load saved posts.";
    } finally {
      if (activeLoad === controller) {
        activeLoad = null;
        render();
      }
    }
  }

  function sync(force = false, preservePages = false) {
    if (force) retryImages(root, true);
    const refreshCatalog = isFeed && (force || preservePages || catalogError || catalogComplete && Date.now() - catalogLoadedAt >= freshFor);
    if (route.view === "directory") {
      activeLoad?.abort();
      activeLoad = null;
      ensureCatalog(force);
      render();
    } else if (route.view === "saved") {
      loadSaved(false, refreshCatalog, preservePages || !force);
    } else if (!force && !errorMessage && !catalogError && !activeLoad && timeline.loadedAt && Date.now() - timeline.loadedAt < freshFor &&
      timeline.key === timelineId(timelineParams()) &&
      (route.view !== "following" || !following.size || filteredPosts().length || !timeline.cursor)) {
      render();
    } else {
      loadTimeline(false, refreshCatalog, preservePages || !force);
    }
  }

  function recover(event) {
    if (document.visibilityState === "hidden") return;
    if (!isFeed && (!profileSlug || !groupKey.test(profileSlug))) return;
    retryImages(root, event.type === "online" || event.type === "visibilitychange" || event.type === "pageshow" && event.persisted);
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
    if (now - lastRecoveryAt < 1_000 && event.type !== "online") return;
    const loadedAt = route.view === "directory" ? catalogLoadedAt : route.view === "saved" ? savedView.loadedAt : timeline.loadedAt;
    if (!errorMessage && !catalogError && loadedAt && now - loadedAt < freshFor) return;
    lastRecoveryAt = now;
    sync(false, true);
  }

  function navigate(change, scroll = false) {
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

  function showDialog(kind, content, focusTarget) {
    if (!dialog.open) lastDialogFocus = document.activeElement;
    dialog.dataset.kind = kind;
    dialog.dataset.group = "";
    dialogContent.replaceChildren(content);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    (focusTarget || dialog.querySelector(".gf-dialog-close")).focus({ preventScroll: true });
  }

  function groupDialog(group) {
    showDialog("group", profileContent(group, "h2", group.name, true));
    dialog.dataset.group = group.slug;
  }

  function postDialog(post, imageOnly) {
    const panel = el("div");
    const title = el("h2", null, post.title);
    title.id = "gf-dialog-title";
    title.dir = "auto";
    if (!imageOnly) panel.append(postMeta(post));
    panel.append(title);
    if (!imageOnly) {
      const body = el("div", "gf-post-text post-markdown");
      body.innerHTML = renderPostMarkdown(post.body);
      body.dir = "auto";
      panel.append(body);
    }
    const image = postImage(post, true);
    if (image) panel.append(image);
    panel.append(postActions(post, false));
    showDialog(imageOnly ? "image" : "post", panel);
    dialog.dataset.group = post.group.slug;
  }

  function renderSearch(query) {
    const results = dialog.querySelector("[data-gf-search-results]");
    if (!results) return;
    const text = query.trim().toLocaleLowerCase();
    const matchingGroups = [...groups.values()].filter((group) =>
      `${group.name} ${group.region} ${group.bio || ""}`.toLocaleLowerCase().includes(text)).slice(0, 7);
    const matchingPosts = [...knownPosts.values()].filter((post) =>
      `${post.title} ${post.body} ${post.group.name}`.toLocaleLowerCase().includes(text)).slice(0, 7);
    const rows = [];
    if (matchingGroups.length) {
      rows.push(el("h3", null, "Groups"));
      for (const group of matchingGroups) {
        const button = identity(group);
        button.classList.add("gf-search-result");
        rows.push(button);
      }
    }
    if (matchingPosts.length) {
      rows.push(el("h3", null, "Loaded posts"));
      for (const post of matchingPosts) {
        const button = action("read", post.title, post.id, "gf-search-result");
        button.append(el("span", "gf-region", post.group.name));
        rows.push(button);
      }
    }
    results.replaceChildren(...rows);
    if (!rows.length) {
      results.append(el("p", "gf-caption", catalogLoad ? "Loading groups…" : "No matching groups or loaded posts."));
    }
  }

  function searchDialog() {
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
    showDialog("search", panel, input);
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

  async function copyFriend(group, button) {
    const url = managerFriendUrl(group);
    if (!url) return;
    const contact = button.closest(".gf-manager-contact");
    const notice = contact.querySelector(".gf-copy-status");
    try {
      await navigator.clipboard.writeText(url);
      notice.textContent = "Friend link copied.";
      button.replaceChildren(icon("check"));
      button.title = "Friend link copied";
      setTimeout(() => {
        if (!button.isConnected) return;
        button.replaceChildren(icon("copy"));
        button.title = "Copy friend link";
      }, 2000);
    } catch {
      const input = contact.querySelector(".gf-friend-input");
      input.focus();
      input.select();
      notice.textContent = "Link selected. Use your device's Copy option.";
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
      showDialog("share", panel, input);
      input.select();
    }
  }

  function toggle(key, id) {
    const isSave = key === "save";
    const values = isSave ? saved : following;
    const active = !values.has(id);
    if (!isSave && active && values.size >= 200) {
      toast("You can follow up to 200 groups. Unfollow a group to add another.");
      return;
    }
    if (active) values.add(id);
    else values.delete(id);
    saveSet(isSave ? savedKey : followingKey, values);
    for (const button of root.querySelectorAll(`[data-gf-action="${key}"]`)) {
      if (button.dataset.key === id) updateToggle(button, active);
    }
    if (!dialog.open) toast(isSave ? (active ? "Post saved." : "Post removed from Saved.") : (active ? "Group followed." : "Group unfollowed."));
    if (isFeed && route.view === (isSave ? "saved" : "following")) {
      if (!isSave) sync();
      else render();
    }
  }

  root.addEventListener("click", (event) => {
    if (event.target === dialog) {
      const bounds = dialog.getBoundingClientRect();
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
      return;
    }
    const button = event.target.closest?.("[data-gf-action]");
    if (!button || button.disabled) return;
    const { gfAction, key } = button.dataset;
    const group = groups.get(key);
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
      case "refresh":
        sync(true);
        break;
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
      case "group":
        if (group) groupDialog(group);
        break;
      case "read":
      case "image":
        if (post) postDialog(post, gfAction === "image");
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
        if (group) copyFriend(group, button);
        break;
      }
      case "close":
        dialog.close();
        break;
    }
  });

  root.addEventListener("input", (event) => {
    if (event.target === find("directory-search")) renderDirectory();
    if (event.target.matches("[data-gf-search-input]")) renderSearch(event.target.value);
  });
  dialog.addEventListener("close", () => {
    if (lastDialogFocus?.isConnected) lastDialogFocus.focus({ preventScroll: true });
  });
  document.addEventListener("visibilitychange", recover);
  root.addEventListener("click", event => {
    const spoiler = event.target.closest?.("[data-post-spoiler]");
    if (!spoiler) return;
    const expanded = spoiler.getAttribute("aria-expanded") !== "true";
    spoiler.setAttribute("aria-expanded", String(expanded));
    spoiler.setAttribute("aria-label", expanded ? spoiler.textContent + ". Hide spoiler" : "Reveal spoiler");
  });
  for (const event of ["pageshow", "focus", "online"]) window.addEventListener(event, recover);
  if (isFeed) {
    document.addEventListener("keydown", (event) => {
      if (event.key === "/" && !event.ctrlKey && !event.metaKey && !event.altKey && !dialog.open &&
        !event.target.closest?.("input, textarea, select, [contenteditable]")) {
        event.preventDefault();
        searchDialog();
      }
    });
    window.addEventListener("popstate", () => {
      if (dialog.open) dialog.close();
      route = routeFromUrl();
      sync();
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
  if (mode === "profile" && (!profileSlug || !groupKey.test(profileSlug))) {
    postsNode.setAttribute("aria-busy", "false");
    setStatus(status, "Choose a group from the directory.");
    const refresh = find("refresh");
    if (refresh) refresh.hidden = true;
  } else {
    sync();
  }
})();
