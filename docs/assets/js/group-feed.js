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
  const palette = ["#bda2ff", "#dfeb93", "#83dce4", "#f6a7bd", "#f1c58a"];
  const savedKey = "platopedia.groupFeed.saved";
  const followingKey = "platopedia.groupFeed.following";

  let route = routeFromUrl();
  const groups = new Map();
  const knownPosts = new Map();
  const renderedPosts = new Map();
  let saved = storedSet(savedKey, postKey);
  let following = storedSet(followingKey, groupKey);
  let catalogComplete = false;
  let catalogLoad;
  let catalogError = false;
  let timeline = { key: "", posts: [], cursor: null };
  let savedView = { posts: [], loaded: new Set() };
  let activeLoad;
  let errorMessage = "";
  let lastDialogFocus;
  let toastTimeout;

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

  function icon(mark) {
    const span = el("span", null, mark);
    span.setAttribute("aria-hidden", "true");
    return span;
  }

  function link(href, label, className) {
    const anchor = el("a", className, label);
    anchor.href = href;
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
    const fallback = group.slug === "arcade" ? "/groups/arcade" : `/groups/profile/?group=${encodeURIComponent(group.slug)}`;
    return safeUrl(group.url, [location.origin, "https://platopedia.com"]) || fallback;
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
      image.addEventListener("error", () => image.remove(), { once: true });
      image.src = url;
      frame.append(image);
    }
    return frame;
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
      button.replaceChildren(icon(active ? "✓" : "+"), document.createTextNode(active ? "Following" : "Follow"));
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
      read.append(icon("↗"));
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

  function profileActions(group, inDialog) {
    const actions = el("div", "gf-profile-actions");
    const friendUrl = safeUrl(group.friendUrl, ["https://platoapp.com", "https://www.platoapp.com"]);
    if (friendUrl) {
      const friend = link(friendUrl, "Find the manager on Plato ↗", "gf-button gf-primary");
      friend.rel = "noreferrer";
      actions.append(friend);
    }
    actions.append(followButton(group), action("share-group", "Share group", group.slug));
    if (inDialog) {
      actions.append(link(profileUrl(group), "Open profile ↗", "gf-button"));
      if (isFeed) actions.append(action("filter-group", "See group posts", group.slug));
    }
    return actions;
  }

  function profileContent(group, headingLevel, headingText, inDialog) {
    const fragment = document.createDocumentFragment();
    const identityRow = el("div", "gf-profile-identity");
    const text = el("div");
    const heading = el(headingLevel, null, headingText);
    heading.dir = "auto";
    if (inDialog) heading.id = "gf-dialog-title";
    text.append(heading, el("p", "gf-region", group.region));
    identityRow.append(avatar(group), text);
    fragment.append(identityRow);
    if (group.bio) {
      const bio = el("p", "gf-group-bio", group.bio);
      bio.dir = "auto";
      fragment.append(bio);
    }
    fragment.append(profileActions(group, inDialog));
    return fragment;
  }

  function renderProfile() {
    const group = groups.get(profileSlug);
    if (!group) return;
    const profile = find("profile");
    const card = el("header", "gf-profile");
    card.style.background = `radial-gradient(ellipse at 6% 0%, ${colorFor(group.slug)}24, transparent 65%), var(--gf-surface)`;
    card.append(profileContent(group, isEmbed ? "h2" : "h1", isEmbed ? `${group.name} group feed` : group.name, false));
    profile.replaceChildren(card);
    profile.hidden = false;
    if (!isEmbed) document.title = `${group.name} · Platopedia Groups`;
    root.hidden = false;
  }

  function postImage(post, inReader = false) {
    const url = safeUrl(post.imageUrl, [api.origin]);
    if (!url) return null;
    const image = el("img");
    image.alt = `Image attached to ${post.title}`;
    image.decoding = "async";
    image.src = url;
    if (inReader) {
      image.className = "gf-dialog-image";
      return image;
    }
    image.loading = "lazy";
    const control = action("image", undefined, post.id, "gf-image-button");
    control.setAttribute("aria-label", `Enlarge image for ${post.title}`);
    control.append(image, icon("⤢"));
    image.addEventListener("error", () => control.remove(), { once: true });
    return control;
  }

  function postMeta(post) {
    const meta = el("div", "gf-card-meta");
    const timestamp = new Date(post.publishedAt);
    const date = link(postUrl(post), undefined, "gf-date");
    if (!Number.isNaN(timestamp.getTime())) {
      const time = el("time", null, dateFormat.format(timestamp));
      time.dateTime = timestamp.toISOString();
      date.setAttribute("aria-label", `Permalink for ${post.title}`);
      date.append(time);
    }
    meta.append(identity(post.group), date);
    return meta;
  }

  function postCard(post) {
    const article = el("article", "gf-card");
    article.id = `post-${post.id}`;
    const heading = el("h3");
    heading.dir = "auto";
    heading.append(action("read", post.title, post.id, "gf-post-title"));
    const body = el("p", "gf-post-text is-preview", post.body);
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
    const spotlight = find("spotlight");
    const spotlightGroup = timeline.posts[0]?.group || [...groups.values()][0];
    if (spotlightGroup) {
      const label = el("span");
      label.append(el("small", null, "Group spotlight"), el("strong", null, spotlightGroup.name));
      spotlight.dataset.key = spotlightGroup.slug;
      spotlight.replaceChildren(avatar(spotlightGroup), label, icon("↗"));
      spotlight.hidden = false;
    } else {
      spotlight.hidden = true;
    }

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
    groupFilter.textContent = `${groups.get(route.group)?.name || route.group} ×`;
    groupFilter.hidden = !route.group;
    find("filterbar").hidden = Boolean(route.post) || (regions.length <= 1 && !route.group);

    const available = visibleGroups();
    find("group-list").replaceChildren(...available.slice(0, 5).map((group) => {
      const item = el("li");
      item.append(identity(group));
      return item;
    }));
    setStatus(find("sidebar-status"), available.length ? "" : activeLoad ? "Loading groups…" : "No groups in this view.");
  }

  function renderDirectory() {
    if (!isFeed || route.view !== "directory") return;
    const available = visibleGroups(find("directory-search").value);
    const count = find("directory-count");
    count.textContent = available.length ? `${available.length} ${available.length === 1 ? "group" : "groups"}` : "";
    find("surprise").hidden = !available.length;
    const cards = available.map((group) => {
      const card = el("article", "gf-directory-card");
      card.style.setProperty("--avatar-color", colorFor(group.slug));
      card.append(identity(group));
      if (group.bio) card.append(el("p", "gf-group-bio", group.bio));
      const actions = el("div", "gf-profile-actions");
      actions.append(followButton(group), link(profileUrl(group), "Profile ↗", "gf-button"));
      card.append(actions);
      return card;
    });
    find("directory-grid").replaceChildren(...cards);
    const directoryStatus = find("directory-status");
    const message = catalogError ? "Could not load the directory. " : !catalogComplete ? "Loading groups…" :
      available.length ? "" : "No groups match this search.";
    setStatus(directoryStatus, message, Boolean(catalogLoad));
    if (catalogError) directoryStatus.append(action("refresh", "Retry"));
  }

  function filteredPosts() {
    const source = route.view === "saved" ? savedView.posts.filter((post) => saved.has(post.id)) : timeline.posts;
    return source.filter((post) => (route.view !== "following" || following.has(post.group.slug)) &&
      (route.view !== "saved" || !route.region || post.group.region.toLocaleLowerCase() === route.region.toLocaleLowerCase()));
  }

  function renderPosts(posts) {
    const active = new Set(posts.map((post) => post.id));
    for (const [id, entry] of renderedPosts) {
      if (!active.has(id)) {
        entry.card.remove();
        renderedPosts.delete(id);
      }
    }
    posts.forEach((post, index) => {
      let entry = renderedPosts.get(post.id);
      if (entry?.post !== post) {
        entry?.card.remove();
        entry = { post, card: postCard(post) };
        renderedPosts.set(post.id, entry);
      }
      if (postsNode.children[index] !== entry.card) {
        postsNode.insertBefore(entry.card, postsNode.children[index] || null);
      }
    });
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

    if (isFeed && route.view === "directory") return;
    const posts = filteredPosts();
    postsNode.setAttribute("aria-busy", String(Boolean(activeLoad)));
    renderPosts(posts);
    const refresh = find("refresh");
    if (refresh) refresh.disabled = Boolean(activeLoad);
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
    const message = errorMessage || (activeLoad ? (posts.length ? "Loading more posts…" : "Loading group posts…") : posts.length ? "" : noPosts);
    setStatus(status, message, Boolean(activeLoad) && !errorMessage);
    if (errorMessage) {
      status.append(document.createTextNode(" "), action("refresh", "Retry"));
    }
  }

  async function requestFeed(params, signal) {
    const url = new URL(api);
    for (const [key, value] of Object.entries(params)) if (value) url.searchParams.set(key, value);
    const response = await fetch(url, { signal, headers: { accept: "application/json" } });
    if (response.status === 404 && params.group) return null;
    if (!response.ok) throw new Error("Group feed request failed");
    const data = await response.json();
    if (!Array.isArray(data.groups) || !Array.isArray(data.posts)) throw new Error("Unexpected group feed response");
    return data;
  }

  function ingest(data, allGroups = false) {
    if (allGroups) {
      groups.clear();
      catalogComplete = true;
      catalogError = false;
    }
    for (const group of data.groups) groups.set(group.slug, group);
    for (const post of data.posts) {
      if (!groups.has(post.group.slug)) groups.set(post.group.slug, post.group);
      knownPosts.set(post.id, post);
    }
  }

  async function ensureCatalog(force = false) {
    if (!force && catalogComplete) return;
    if (!catalogLoad) {
      catalogError = false;
      catalogLoad = requestFeed({}, undefined).then((data) => ingest(data, true)).catch(() => {
        catalogError = true;
      }).finally(() => {
        catalogLoad = null;
        render();
        const input = dialog.querySelector("[data-gf-search-input]");
        if (dialog.open && input) renderSearch(input.value);
      });
    }
    return catalogLoad;
  }

  function timelineParams() {
    return { group: isFeed ? route.group : profileSlug, region: route.region, post: route.post };
  }

  function timelineId(params) {
    return JSON.stringify(params);
  }

  async function loadTimeline(append = false) {
    const params = timelineParams();
    const key = timelineId(params);
    if (append && (!timeline.cursor || timeline.key !== key)) return;
    activeLoad?.abort();
    const controller = new AbortController();
    activeLoad = controller;
    errorMessage = "";
    if (!append) timeline = { key, posts: [], cursor: null };
    render();
    try {
      let before = append ? timeline.cursor : "";
      for (let page = 0; page < 3; page += 1) {
        const data = await requestFeed({ ...params, before }, controller.signal);
        if (activeLoad !== controller) return;
        if (!data) {
          if (isEmbed) root.hidden = true;
          errorMessage = "This group could not be found.";
          break;
        }
        ingest(data, isFeed && !params.group && !params.post);
        const existing = new Set(timeline.posts.map((post) => post.id));
        timeline.posts.push(...data.posts.filter((post) => !existing.has(post.id)));
        timeline.cursor = data.next;
        if (!isFeed) renderProfile();
        if (append || route.view !== "following" || !following.size || filteredPosts().length || !data.next || data.next === before) break;
        before = data.next;
      }
    } catch (error) {
      if (activeLoad !== controller || error.name === "AbortError") return;
      errorMessage = "Could not load group posts.";
    } finally {
      if (activeLoad === controller) {
        activeLoad = null;
        render();
      }
    }
  }

  async function loadSaved(append = false) {
    activeLoad?.abort();
    const controller = new AbortController();
    activeLoad = controller;
    errorMessage = "";
    if (!append) savedView = { posts: [], loaded: new Set() };
    const ids = [...saved].reverse().filter((id) => !savedView.loaded.has(id)).slice(0, 8);
    render();
    try {
      const pages = await Promise.all(ids.map((id) => requestFeed({ post: id }, controller.signal)));
      if (activeLoad !== controller) return;
      for (const data of pages) {
        ingest(data);
        savedView.posts.push(...data.posts);
      }
      for (const id of ids) savedView.loaded.add(id);
    } catch (error) {
      if (activeLoad !== controller || error.name === "AbortError") return;
      errorMessage = "Could not load saved posts.";
    } finally {
      if (activeLoad === controller) {
        activeLoad = null;
        render();
      }
    }
  }

  function sync(force = false) {
    if (route.view === "directory") {
      activeLoad?.abort();
      activeLoad = null;
      ensureCatalog(force);
      render();
    } else if (route.view === "saved") {
      loadSaved();
    } else if (!force && !errorMessage && !activeLoad && timeline.key === timelineId(timelineParams()) &&
      (route.view !== "following" || !following.size || filteredPosts().length || !timeline.cursor)) {
      render();
    } else {
      loadTimeline();
    }
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
    dialogContent.replaceChildren(content);
    if (!dialog.open) dialog.showModal();
    dialog.scrollTop = 0;
    (focusTarget || dialog.querySelector(".gf-dialog-close")).focus({ preventScroll: true });
  }

  function groupDialog(group) {
    showDialog("group", profileContent(group, "h2", group.name, true));
  }

  function postDialog(post, imageOnly) {
    const panel = el("div");
    const title = el("h2", null, post.title);
    title.id = "gf-dialog-title";
    title.dir = "auto";
    if (!imageOnly) panel.append(postMeta(post));
    panel.append(title);
    if (!imageOnly) {
      const body = el("p", "gf-post-text", post.body);
      body.dir = "auto";
      panel.append(body);
    }
    const image = postImage(post, true);
    if (image) panel.append(image);
    panel.append(postActions(post, false));
    showDialog(imageOnly ? "image" : "post", panel);
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

  async function share(path, button) {
    const url = new URL(path, location.href).href;
    try {
      await navigator.clipboard.writeText(url);
      if (dialog.open && dialog.contains(button)) {
        button.textContent = "Link copied ✓";
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
    if (active) values.add(id);
    else values.delete(id);
    saveSet(isSave ? savedKey : followingKey, values);
    for (const button of root.querySelectorAll(`[data-gf-action="${key}"]`)) {
      if (button.dataset.key === id) updateToggle(button, active);
    }
    if (!dialog.open) toast(isSave ? (active ? "Post saved." : "Post removed from Saved.") : (active ? "Group followed." : "Group unfollowed."));
    if (isFeed && route.view === (isSave ? "saved" : "following")) {
      render();
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
      case "more":
        if (route.view === "saved") loadSaved(true);
        else loadTimeline(true);
        break;
      case "search":
        searchDialog();
        break;
      case "surprise": {
        const candidates = visibleGroups(find("directory-search").value);
        const choice = candidates[Math.floor(Math.random() * candidates.length)];
        if (choice) groupDialog(choice);
        break;
      }
      case "group":
        if (group) groupDialog(group);
        break;
      case "filter-group":
        if (group) {
          dialog.close();
          navigate({ group: group.slug, region: "", post: "", view: "latest" }, true);
        }
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
