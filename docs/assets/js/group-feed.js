(() => {
  const root = document.querySelector("[data-group-feed]");
  if (!root) return;

  const api = new URL(root.dataset.api);
  const params = new URLSearchParams(location.search);
  const mode = root.dataset.mode;
  const embed = mode === "embed";
  const groupSlug = mode === "profile" ? params.get("group") : root.dataset.group;
  const postId = mode === "feed" ? params.get("post") : null;
  const profile = root.querySelector("[data-feed-profile]");
  const list = root.querySelector("[data-feed-posts]");
  const status = root.querySelector("[data-feed-status]");
  const directory = root.querySelector("[data-feed-directory]");
  const regions = root.querySelector("[data-feed-region]");
  const refresh = root.querySelector("[data-feed-refresh]");
  const more = root.querySelector("[data-feed-more]");
  const date = new Intl.DateTimeFormat(undefined, { dateStyle: "medium", timeStyle: "short" });
  let cursor;
  let active;

  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content) node.textContent = content;
    return node;
  }

  function urlOn(value, origins) {
    try {
      const url = new URL(value);
      return origins.includes(url.origin) ? url.href : null;
    } catch {
      return null;
    }
  }

  function avatar(group) {
    const box = element("span", "group-feed-avatar", Array.from(group.name)[0]?.toUpperCase());
    box.setAttribute("aria-hidden", "true");
    const source = urlOn(group.iconUrl, [api.origin]);
    if (source) {
      const image = element("img");
      image.alt = "";
      image.loading = "lazy";
      image.addEventListener("error", () => image.remove(), { once: true });
      image.src = source;
      box.append(image);
    }
    return box;
  }

  function identity(group) {
    const node = element("a", "group-feed-identity");
    node.href = urlOn(group.url, [location.origin, "https://platopedia.com"]) || "/groups/";
    const label = element("span", "group-feed-identity-text");
    label.append(element("strong", null, group.name), element("span", "group-feed-region", group.region));
    node.append(avatar(group), label);
    return node;
  }

  function renderProfile(group) {
    const heading = element(embed ? "h2" : "h1", null, embed ? "Arcade group feed" : group.name);
    const title = element("div", "group-feed-profile-title");
    const label = element("div");
    label.append(heading, element("p", "group-feed-region", group.region));
    title.append(avatar(group), label);
    profile.replaceChildren(title);
    if (group.bio) profile.append(element("p", "group-feed-text", group.bio));
    const url = urlOn(group.friendUrl, ["https://platoapp.com", "https://www.platoapp.com"]);
    if (url) {
      const friend = element("a", "group-feed-button", "Add the group manager on Plato");
      friend.href = url;
      friend.rel = "noreferrer";
      profile.append(friend);
    }
    if (!embed) {
      document.title = `${group.name} - Platopedia`;
      profile.append(element("h2", "group-feed-post-heading", "Group posts"));
    }
    profile.hidden = false;
  }

  function renderPost(post) {
    const article = element("article", "group-feed-card");
    article.id = `post-${post.id}`;
    const meta = element("div", "group-feed-meta");
    const link = element("a", "group-feed-date");
    const timestamp = element("time", null, date.format(post.publishedAt));
    timestamp.dateTime = new Date(post.publishedAt).toISOString();
    link.href = `/groups/?post=${encodeURIComponent(post.id)}`;
    link.setAttribute("aria-label", `Link to ${post.title}`);
    link.append(timestamp);
    meta.append(identity(post.group), link);
    article.append(meta, element(mode === "feed" ? "h2" : "h3", "group-feed-post-title", post.title),
      element("p", "group-feed-text", post.body));
    const source = urlOn(post.imageUrl, [api.origin]);
    if (source) {
      const image = element("img", "group-feed-image");
      image.src = source;
      image.loading = "lazy";
      image.alt = `Image attached to ${post.title}`;
      article.append(image);
    }
    return article;
  }

  function updateDirectory(groups) {
    if (!directory) return;
    const byRegion = new Map();
    for (const { region } of groups) {
      if (!byRegion.has(region.toLowerCase())) byRegion.set(region.toLowerCase(), region);
    }
    const selected = regions.value;
    const labels = [...byRegion.values()].sort((first, second) => first.localeCompare(second));
    regions.replaceChildren(new Option("All servers", ""), ...labels.map((label) => new Option(label, label)));
    regions.value = byRegion.get(selected.toLowerCase()) || "";
    const visibleGroups = groups.filter((group) => !selected || group.region.toLowerCase() === selected.toLowerCase());
    directory.replaceChildren(...visibleGroups.map((group) => {
      const item = element("li");
      item.append(identity(group));
      return item;
    }));
    if (!visibleGroups.length) directory.append(element("li", "group-feed-region", "No groups to display."));
  }

  async function load(append = false) {
    active?.abort();
    const request = new AbortController();
    active = request;
    const next = new URL(api);
    if (groupSlug) next.searchParams.set("group", groupSlug);
    if (postId) next.searchParams.set("post", postId);
    if (regions?.value && !postId) next.searchParams.set("region", regions.value);
    if (append && cursor) next.searchParams.set("before", cursor);

    if (!append) list.replaceChildren();
    more.disabled = true;
    if (refresh) refresh.disabled = true;
    status.hidden = false;
    status.textContent = "Loading group posts…";
    try {
      const response = await fetch(next, { signal: request.signal });
      if (response.status === 404 && groupSlug) {
        if (embed) {
          root.hidden = true;
        } else {
          status.textContent = "This group could not be found.";
        }
        return;
      }
      if (!response.ok) throw new Error("Feed unavailable");
      const data = await response.json();
      if (active !== request) return;
      if (groupSlug && !append) renderProfile(data.groups[0]);
      updateDirectory(data.groups);
      list.append(...data.posts.map(renderPost));
      cursor = data.next;
      more.hidden = !cursor;
      status.hidden = Boolean(list.childElementCount);
      status.textContent = postId ? "This post is no longer available." : "No posts have been published here yet.";
    } catch (error) {
      if (active !== request || error.name === "AbortError") return;
      if (embed && profile.hidden) root.hidden = true;
      status.textContent = "Could not load group posts. Try refreshing the page.";
      if (!append) more.hidden = true;
    } finally {
      if (active === request) {
        if (refresh) refresh.disabled = false;
        more.disabled = false;
      }
    }
  }

  if (postId) {
    root.querySelector("[data-feed-all]").hidden = false;
    root.querySelector(".group-feed-controls").hidden = true;
  }
  if (mode === "profile" && !groupSlug) {
    status.textContent = "Choose a group from the group directory.";
    return;
  }
  regions?.addEventListener("change", () => load());
  refresh?.addEventListener("click", () => load());
  more.addEventListener("click", () => load(true));
  load();
})();
