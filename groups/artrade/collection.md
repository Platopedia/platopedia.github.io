---
layout: tool-content
title: Artrade Collection - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade Collection
---

<style>

.collection-panel{
  padding:20px;
  border:1px solid var(--color-B);
  background:linear-gradient(var(--color-C),var(--color-D));
  box-sizing:border-box;
}

.collection-top{
  display:flex;
  gap:12px;
  align-items:flex-start;
  justify-content:space-between;
  flex-wrap:wrap;
}

.collection-title{
  margin:0;
  color:#CD9B1E;
}

.collection-muted{
  opacity:.72;
  font-size:14px;
}

.collection-stats{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:12px;
}

.collection-pill{
  padding:5px 8px;
  border:1px solid var(--color-B);
  background:var(--color-D);
  font-size:13px;
  font-weight:600;
}

.collection-controls{
  display:grid;
  gap:12px;
  margin-top:16px;
}

.collection-field{
  display:grid;
  gap:5px;
}

.collection-field span{
  font-weight:700;
}

.collection-field small,
.collection-filter-status{
  opacity:.72;
  font-size:13px;
}

.collection-filter-panel{
  display:grid;
  gap:10px;
  padding:10px;
  border:1px solid var(--color-B);
  background:var(--color-D);
}

.collection-filter-bar{
  display:grid;
  grid-template-columns:minmax(0,1fr) auto;
  gap:8px;
}

.collection-filter-toggle{
  display:flex;
  align-items:center;
  justify-content:space-between;
  gap:10px;
  padding:10px 14px;
  background:#CD9B1E;
  color:#1A1A1A;
  border:none;
  border-radius:6px;
  cursor:pointer;
  font-weight:700;
  text-align:left;
}

.collection-filter-toggle small{
  font-size:13px;
  font-weight:600;
  opacity:.75;
  white-space:nowrap;
}

.collection-filter-body{
  display:grid;
  gap:12px;
}

.collection-filter-body[hidden]{
  display:none;
}

.collection-filter-row,
.collection-dropdown-filters{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  align-items:flex-end;
}

.collection-dropdown-filters .collection-field{
  flex:1 1 140px;
  min-width:0;
}

.collection-sort-filter{
  display:grid;
  gap:8px;
  grid-template-columns:repeat(2,minmax(0,1fr));
}

.collection-price-filters{
  display:grid;
  gap:8px;
  grid-template-columns:repeat(2,minmax(0,1fr));
}

.collection-search,
.collection-input{
  width:100%;
  padding:9px 10px;
  box-sizing:border-box;
  background:var(--color-D);
  color:var(--color-text);
  border:1px solid #CD9B1E;
  border-radius:6px;
  font-size:16px;
}

.collection-search:focus,
.collection-input:focus{
  outline:none;
}

.collection-invite{
  flex:1 1 260px;
}

.collection-filter-button{
  padding:10px 14px;
  background:#CD9B1E;
  color:#1A1A1A;
  border:none;
  border-radius:6px;
  cursor:pointer;
  font-weight:600;
}

.collection-filter-button.secondary{
  background:var(--color-D);
  color:var(--color-text);
  border:1px solid var(--color-B);
}

.collection-filter-button:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.collection-clear-filters{
  white-space:nowrap;
}

.collection-filter-status.error{
  color:#e74c3c;
  opacity:1;
}

.collection-list{
  display:grid;
  gap:8px;
  margin-top:16px;
}

.collection-item{
  display:grid;
  grid-template-columns:58px minmax(0,1fr) auto;
  gap:10px;
  align-items:center;
  padding:10px;
  border:1px solid var(--color-B);
  background:var(--color-D);
}

.collection-item img{
  width:58px;
  height:40px;
  object-fit:contain;
}

.collection-empty{
  padding:10px;
  border:1px solid var(--color-B);
  background:var(--color-D);
  font-weight:700;
}

.collection-name{
  font-weight:700;
  overflow-wrap:anywhere;
}

.collection-meta{
  margin-top:3px;
  font-size:13px;
  opacity:.74;
}

.collection-price{
  font-weight:700;
  white-space:nowrap;
  color:#CD9B1E;
}

.collection-actions{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
  margin-top:16px;
}

.collection-actions button{
  padding:10px 14px;
  background:#CD9B1E;
  color:#1A1A1A;
  border:none;
  border-radius:6px;
  cursor:pointer;
  font-weight:600;
}

.collection-actions button:disabled{
  opacity:.6;
  cursor:not-allowed;
}

.collection-error{
  margin-top:14px;
  color:#e74c3c;
  display:none;
}

@media (max-width:560px){
  .collection-dropdown-filters,
  .collection-sort-filter{
    display:grid;
    grid-template-columns:1fr;
  }

  .collection-item{
    grid-template-columns:48px minmax(0,1fr);
  }

  .collection-item img{
    width:48px;
    height:34px;
  }

  .collection-price{
    grid-column:2;
  }

  .collection-filter-row{
    align-items:stretch;
  }

  .collection-filter-button{
    width:100%;
  }
}

</style>

<div class="collection-panel">
  <div class="collection-top">
    <div>
      <h2 id="collection-title" class="collection-title">Collection</h2>
      <div id="collection-subtitle" class="collection-muted">Loading collection...</div>
    </div>
    <div id="collection-id" class="collection-muted"></div>
  </div>

  <div id="collection-stats" class="collection-stats"></div>
  <div class="collection-controls">
    <label class="collection-field">
      <span>Your Invite Link</span>
      <small id="invite-help">Only show items you don't own.</small>
      <div class="collection-filter-row">
        <input id="owner-invite-link" class="collection-input collection-invite" type="url" autocomplete="off" autocapitalize="none">
        <button id="cross-check-go" class="collection-filter-button" type="button">Go</button>
        <button id="cross-check-clear" class="collection-filter-button secondary" type="button" hidden>Show all</button>
      </div>
      <div id="cross-check-status" class="collection-filter-status"></div>
    </label>

    <div class="collection-filter-panel">
      <div class="collection-filter-bar">
        <button id="filters-toggle" class="collection-filter-toggle" type="button" aria-expanded="false" aria-controls="collection-filter-body">
          <span>Filters</span>
          <small id="filters-summary">No filters</small>
        </button>
        <button id="clear-filters" class="collection-filter-button secondary collection-clear-filters" type="button" disabled>Clear all</button>
      </div>

      <div id="collection-filter-body" class="collection-filter-body" hidden>
        <div class="collection-dropdown-filters">
          <label class="collection-field">
            <span>Category</span>
            <select id="category-filter" class="collection-input">
              <option value="">All categories</option>
            </select>
          </label>
          <label class="collection-field">
            <span>Rarity</span>
            <select id="rarity-filter" class="collection-input">
              <option value="">All rarities</option>
              <option value="rare">Rare</option>
              <option value="non-rare">Non-rare</option>
            </select>
          </label>
        </div>

        <div class="collection-sort-filter">
          <label class="collection-field">
            <span>Sort</span>
            <select id="sort-filter" class="collection-input">
              <option value="">Default</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
              <option value="price-asc">Price low-high</option>
              <option value="price-desc">Price high-low</option>
            </select>
          </label>
          <label class="collection-field">
            <span>Currency</span>
            <select id="currency-filter" class="collection-input">
              <option value="">All currencies</option>
              <option value="c">Coins</option>
              <option value="p">Pips</option>
            </select>
          </label>
        </div>

        <div class="collection-price-filters">
          <label class="collection-field">
            <span>Min price</span>
            <input id="min-price" class="collection-input" type="number" min="0" step="1" inputmode="numeric" autocomplete="off">
          </label>
          <label class="collection-field">
            <span>Max price</span>
            <input id="max-price" class="collection-input" type="number" min="0" step="1" inputmode="numeric" autocomplete="off">
          </label>
        </div>
      </div>
    </div>

    <input id="collection-search" class="collection-search" autocomplete="off" placeholder="Search SKU, name, category, or price">
  </div>

  <div id="collection-error" class="collection-error"></div>
  <div id="collection-list" class="collection-list"></div>

  <div class="collection-actions">
    <button id="load-more" type="button">Load more</button>
    <button id="copy-skus" type="button">Copy SKU IDs</button>
  </div>
</div>

<script>

const COLLECTION_API_BASE = "https://artrade-collection.platopedia.workers.dev";
const PAGE_SIZE = 120;

const params = new URLSearchParams(location.search);
const rawCollectionId = (params.get("id") || "").trim();
const normalizedCollectionId = /^[A-Za-z0-9_-]{12,64}$/.test(rawCollectionId) ? rawCollectionId : "";
const hasCollectionId = Boolean(normalizedCollectionId);

const titleEl = document.getElementById("collection-title");
const subtitleEl = document.getElementById("collection-subtitle");
const idEl = document.getElementById("collection-id");
const statsEl = document.getElementById("collection-stats");
const searchEl = document.getElementById("collection-search");
const ownerInviteEl = document.getElementById("owner-invite-link");
const inviteHelpEl = document.getElementById("invite-help");
const crossCheckGoBtn = document.getElementById("cross-check-go");
const crossCheckClearBtn = document.getElementById("cross-check-clear");
const crossCheckStatusEl = document.getElementById("cross-check-status");
const categoryEl = document.getElementById("category-filter");
const rarityEl = document.getElementById("rarity-filter");
const sortEl = document.getElementById("sort-filter");
const currencyEl = document.getElementById("currency-filter");
const minPriceEl = document.getElementById("min-price");
const maxPriceEl = document.getElementById("max-price");
const filtersToggleBtn = document.getElementById("filters-toggle");
const filtersBodyEl = document.getElementById("collection-filter-body");
const filtersSummaryEl = document.getElementById("filters-summary");
const clearFiltersBtn = document.getElementById("clear-filters");
const errorEl = document.getElementById("collection-error");
const listEl = document.getElementById("collection-list");
const loadMoreBtn = document.getElementById("load-more");
const copyBtn = document.getElementById("copy-skus");

let skuIds = [];
let itemMap = new Map();
let visibleItems = [];
let renderedCount = 0;
let collectionMeta = {};
let viewerSkuSet = null;
let viewerItemCount = 0;
let requesterCollectionLoaded = false;

function escapeHtml(value){
  return String(value).replace(/[&<>"']/g, char => ({
    "&":"&amp;",
    "<":"&lt;",
    ">":"&gt;",
    "\"":"&quot;",
    "'":"&#39;"
  })[char]);
}

function showError(message){
  errorEl.textContent = formatStatusMessage(message);
  errorEl.style.display = "block";
}

function clearError(){
  errorEl.textContent = "";
  errorEl.style.display = "none";
}

function pill(label, value){
  return `<span class="collection-pill">${escapeHtml(label)}: ${escapeHtml(value)}</span>`;
}

async function loadCatalog(){
  const response = await fetch("/items.html", { cache:"force-cache" });
  if(!response.ok) throw new Error("Could not load item catalog.");

  const html = await response.text();
  const doc = new DOMParser().parseFromString(html, "text/html");
  const rows = doc.querySelectorAll("#tool_items_table_default tbody tr");
  const imageMatch = html.match(/var items = (\{[\s\S]*?\});/);
  const images = imageMatch ? JSON.parse(imageMatch[1]) : {};
  const map = new Map();

  rows.forEach(row => {
    const id = row.children[0]?.textContent.trim();
    if(!id) return;

    const type = row.children[1]?.textContent.trim() || "Unknown";
    const name = row.children[2]?.textContent.trim() || `Item ${id}`;
    const priceCell = row.children[3];
    const rare = row.children[7]?.textContent.trim() === "1";
    let currency = "";
    let price = "";
    let priceValue = null;

    if(priceCell){
      const icon = priceCell.querySelector("i");
      if(icon?.classList.contains("c")) currency = "c";
      if(icon?.classList.contains("p")) currency = "p";
      const parsed = priceCell.textContent.replace(/,/g, "").trim();
      const numeric = parseInt(parsed, 10);
      if(!Number.isNaN(numeric)) priceValue = numeric;
      if(parsed) price = currency ? `${parsed}${currency}` : parsed;
    }

    const imgUri = images[id]?.med?.images?.find(image => image.uri)?.uri;
    map.set(id, {
      id,
      type,
      name,
      price,
      priceValue,
      currency,
      rare,
      img: imgUri ? "https://profile.platocdn.com/" + imgUri : "",
      search: `${id} ${type} ${name} ${price} ${rare ? "rare" : "non-rare"}`.toLowerCase()
    });
  });

  itemMap = map;
  populateCategoryFilter();
}

async function loadRequesterCollection(){
  const response = await fetch(`${COLLECTION_API_BASE}/collections/${encodeURIComponent(normalizedCollectionId)}`, {
    cache:"no-store"
  });
  const data = await response.json().catch(() => null);

  if(!response.ok || !data?.ok){
    throw new Error(data?.error === "not_found" ? "Collection link expired or was not found." : "Could not load collection.");
  }

  showCollection({
    requester:true,
    data,
    ids:Array.isArray(data.skuIds) ? data.skuIds.map(String) : []
  });
}

function setCollectionHeader({ title, subtitle, idText = "", inviteHelp, actionLabel }){
  titleEl.textContent = title;
  subtitleEl.textContent = subtitle;
  idEl.textContent = idText;
  inviteHelpEl.textContent = inviteHelp;
  crossCheckGoBtn.textContent = actionLabel;
}

function showEmptyCollection({ requester = false, subtitle, error = "" } = {}){
  requesterCollectionLoaded = false;
  skuIds = [];
  collectionMeta = {};
  viewerSkuSet = null;
  viewerItemCount = 0;
  crossCheckClearBtn.hidden = true;
  setCollectionHeader({
    title:requester ? "Requester Collection" : "My Collection",
    subtitle,
    idText:requester && hasCollectionId ? `ID ${normalizedCollectionId}` : "",
    inviteHelp:requester ? "Only show items you don't own." : "Show your collection from your Plato invite link.",
    actionLabel:requester || hasCollectionId ? "Go" : "Show My Collection"
  });
  if(error) showError(error);
  else clearError();
}

function showCollection({ requester, data, ids }){
  requesterCollectionLoaded = requester;
  skuIds = ids;
  collectionMeta = data;
  viewerSkuSet = null;
  viewerItemCount = 0;
  crossCheckClearBtn.hidden = true;
  setCollectionHeader({
    title:requester ? "Requester Collection" : "My Collection",
    subtitle:`${skuIds.length} unique SKU IDs`,
    idText:requester ? `ID ${normalizedCollectionId}` : data.uid ? `UID ${data.uid}` : "",
    inviteHelp:requester ? "Only show items you don't own." : "Show your collection from your Plato invite link.",
    actionLabel:requester || hasCollectionId ? "Go" : "Show My Collection"
  });
}

function buildVisibleItems(){
  const q = searchEl.value.trim().toLowerCase();
  const category = categoryEl.value;
  const rarity = rarityEl.value;
  const sort = sortEl.value;
  const currency = currencyEl.value;
  const minPrice = parsePriceBound(minPriceEl.value);
  const maxPrice = parsePriceBound(maxPriceEl.value);

  visibleItems = skuIds
    .map(sku => itemMap.get(sku))
    .filter(Boolean)
    .filter(item => {
      if(q && !item.search.includes(q)) return false;
      if(category && item.type !== category) return false;
      if(rarity === "rare" && !item.rare) return false;
      if(rarity === "non-rare" && item.rare) return false;
      if(currency && item.currency !== currency) return false;
      if(viewerSkuSet && viewerSkuSet.has(item.id)) return false;
      if(minPrice !== null || maxPrice !== null){
        if(item.priceValue === null) return false;
        if(minPrice !== null && item.priceValue < minPrice) return false;
        if(maxPrice !== null && item.priceValue > maxPrice) return false;
      }
      return true;
    });

  sortVisibleItems(sort);

  updateStats();

  renderedCount = 0;
  listEl.innerHTML = "";
  renderMore();
}

function setFiltersOpen(open){
  filtersBodyEl.hidden = !open;
  filtersToggleBtn.setAttribute("aria-expanded", String(open));
}

function getActiveFilterCount(){
  return [
    categoryEl.value,
    rarityEl.value,
    sortEl.value,
    currencyEl.value,
    minPriceEl.value.trim(),
    maxPriceEl.value.trim()
  ].filter(Boolean).length;
}

function updateFilterSummary(){
  const count = getActiveFilterCount();
  filtersSummaryEl.textContent = count ? `${count} active` : "No filters";
  clearFiltersBtn.disabled = count === 0;
}

function handleFilterChange(){
  updateFilterSummary();
  buildVisibleItems();
}

function clearFilters(){
  categoryEl.value = "";
  rarityEl.value = "";
  sortEl.value = "";
  currencyEl.value = "";
  minPriceEl.value = "";
  maxPriceEl.value = "";
  handleFilterChange();
}

function sortVisibleItems(sort){
  const byName = (a, b) =>
    a.name.localeCompare(b.name) || String(a.id).localeCompare(String(b.id), undefined, { numeric:true });
  const priceGroup = (item, highToLow) => {
    if(item.currency === "p") return highToLow ? 0 : 1;
    if(item.currency === "c") return highToLow ? 1 : 0;
    return 2;
  };
  const byPriceLowHigh = (a, b) =>
    priceGroup(a, false) - priceGroup(b, false) ||
    (a.priceValue ?? Number.POSITIVE_INFINITY) - (b.priceValue ?? Number.POSITIVE_INFINITY) ||
    byName(a, b);
  const byPriceHighLow = (a, b) =>
    priceGroup(a, true) - priceGroup(b, true) ||
    (b.priceValue ?? Number.NEGATIVE_INFINITY) - (a.priceValue ?? Number.NEGATIVE_INFINITY) ||
    byName(a, b);

  if(sort === "name-asc"){
    visibleItems.sort(byName);
  }else if(sort === "name-desc"){
    visibleItems.sort((a, b) => byName(b, a));
  }else if(sort === "price-asc"){
    visibleItems.sort(byPriceLowHigh);
  }else if(sort === "price-desc"){
    visibleItems.sort(byPriceHighLow);
  }
}

function populateCategoryFilter(){
  const currentValue = categoryEl.value;
  const categories = [...new Set([...itemMap.values()].map(item => item.type).filter(type => type && type !== "Hype"))]
    .sort((a, b) => a.localeCompare(b));

  categoryEl.innerHTML = `<option value="">All categories</option>` + categories
    .map(category => `<option value="${escapeHtml(category)}">${escapeHtml(category)}</option>`)
    .join("");

  if(categories.includes(currentValue)){
    categoryEl.value = currentValue;
  }

  updateFilterSummary();
}

function parsePriceBound(value){
  const trimmed = String(value || "").trim();
  if(!trimmed) return null;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
}

function updateStats(){
  const hiddenOwned = viewerSkuSet
    ? skuIds.reduce((count, sku) => count + (viewerSkuSet.has(sku) ? 1 : 0), 0)
    : 0;

  statsEl.innerHTML = [
    pill("Items", skuIds.length),
    pill("Showing", visibleItems.length),
    viewerSkuSet ? pill("You own", viewerItemCount || viewerSkuSet.size) : "",
    viewerSkuSet ? pill("Hidden owned", hiddenOwned) : "",
    collectionMeta.inventoryRowCount ? pill("Rows", collectionMeta.inventoryRowCount) : "",
    collectionMeta.chunkCount ? pill("Chunks", collectionMeta.chunkCount) : "",
    collectionMeta.version ? pill("Version", collectionMeta.version) : ""
  ].filter(Boolean).join("");
}

function renderMore(){
  const nextItems = visibleItems.slice(renderedCount, renderedCount + PAGE_SIZE);
  renderedCount += nextItems.length;

  if(renderedCount === 0 && !nextItems.length && skuIds.length){
    listEl.innerHTML = `<div class="collection-empty">No matching items.</div>`;
  }

  const html = nextItems.map(item => `
    <div class="collection-item">
      ${item.img ? `<img loading="lazy" src="${escapeHtml(item.img)}" alt="">` : `<div></div>`}
      <div>
        <div class="collection-name">${escapeHtml(item.name)}</div>
        <div class="collection-meta">SKU ${escapeHtml(item.id)} · ${escapeHtml(item.type)}</div>
      </div>
      <div class="collection-price">${escapeHtml(item.price || "")}</div>
    </div>
  `).join("");

  listEl.insertAdjacentHTML("beforeend", html);
  loadMoreBtn.disabled = renderedCount >= visibleItems.length;
  copyBtn.disabled = visibleItems.length === 0;
  loadMoreBtn.textContent = renderedCount >= visibleItems.length
    ? "All loaded"
    : `Load more (${visibleItems.length - renderedCount})`;
}

searchEl.addEventListener("input", buildVisibleItems);
filtersToggleBtn.addEventListener("click", () => {
  setFiltersOpen(filtersBodyEl.hidden);
});
clearFiltersBtn.addEventListener("click", clearFilters);
categoryEl.addEventListener("change", handleFilterChange);
rarityEl.addEventListener("change", handleFilterChange);
sortEl.addEventListener("change", handleFilterChange);
currencyEl.addEventListener("change", handleFilterChange);
minPriceEl.addEventListener("input", handleFilterChange);
maxPriceEl.addEventListener("input", handleFilterChange);
loadMoreBtn.addEventListener("click", renderMore);
copyBtn.addEventListener("click", async () => {
  if(!visibleItems.length) return;
  await navigator.clipboard.writeText(visibleItems.map(item => item.id).join("\n"));
  copyBtn.textContent = "Copied";
  setTimeout(() => {
    copyBtn.textContent = "Copy SKU IDs";
  }, 1200);
});

crossCheckGoBtn.addEventListener("click", startCrossCheck);
ownerInviteEl.addEventListener("keydown", event => {
  if(event.key !== "Enter") return;
  event.preventDefault();
  startCrossCheck();
});
crossCheckClearBtn.addEventListener("click", () => {
  viewerSkuSet = null;
  viewerItemCount = 0;
  crossCheckClearBtn.hidden = true;
  setCrossCheckStatus("");
  buildVisibleItems();
});

function setCrossCheckStatus(message, isError = false){
  crossCheckStatusEl.textContent = formatStatusMessage(message);
  crossCheckStatusEl.classList.toggle("error", Boolean(isError));
}

function formatStatusMessage(message){
  const text = String(message || "").trim();
  if(!text) return "";

  return text
    .replace(/\bread-timeout\b/gi, "Read timeout")
    .replace(/\bremote-ended\b/gi, "Remote ended")
    .replace(/\bsocket-error\b/gi, "Socket error")
    .replace(/\binvalid_collection_id\b/gi, "Invalid collection link")
    .replace(/\binvalid_invite_link\b/gi, "Invalid Plato invite link")
    .replace(/\bnot_found\b/gi, "Not found")
    .replace(/\bdb_not_configured\b/gi, "Service database is not configured")
    .replace(/\bforbidden\b/gi, "Request was not allowed")
    .replace(/\bcollection id\b/gi, "collection ID")
    .replace(/\b[a-z][a-z0-9]*(?:_[a-z0-9]+)+\b/g, value =>
      value.split("_").join(" ")
    )
    .replace(/^\w/, char => char.toUpperCase());
}

async function startCrossCheck(){
  const inviteLink = ownerInviteEl.value.trim();
  if(!/^https:\/\/platoapp\.com\/link\/[A-Za-z0-9_-]+\/?$/i.test(inviteLink)){
    setCrossCheckStatus("Enter a valid Plato invite link.", true);
    return;
  }

  crossCheckGoBtn.disabled = true;
  crossCheckClearBtn.hidden = true;
  clearError();
  setCrossCheckStatus("Starting cross-check...");

  try{
    const createResponse = await fetch(`${COLLECTION_API_BASE}/cross-checks`, {
      method:"POST",
      headers:{ "content-type":"application/json" },
      body:JSON.stringify({
        inviteLink,
        ...(hasCollectionId ? { requesterCollectionId:normalizedCollectionId } : {})
      })
    });
    const created = await createResponse.json().catch(() => null);
    if(!createResponse.ok || !created?.id){
      throw new Error(created?.error || "Could not start cross-check.");
    }

    const result = await waitForCrossCheck(created.id);
    const ownerSkuIds = Array.isArray(result.skuIds) ? result.skuIds.map(String) : [];
    if(!ownerSkuIds.length) throw new Error("Your collection returned no SKU IDs.");

    if(requesterCollectionLoaded){
      viewerSkuSet = new Set(ownerSkuIds);
      viewerItemCount = Number(result.itemCount || ownerSkuIds.length);
      crossCheckClearBtn.textContent = "Show all";
      crossCheckClearBtn.hidden = false;
      setCrossCheckStatus("Cross-check active. Hiding items you already own.");
    }else{
      showCollection({ requester:false, data:result, ids:ownerSkuIds });
      setCrossCheckStatus("My collection loaded.");
    }
    buildVisibleItems();
  }catch(error){
    setCrossCheckStatus(error.message || "Cross-check failed.", true);
  }finally{
    crossCheckGoBtn.disabled = false;
  }
}

async function waitForCrossCheck(id){
  for(let attempt = 0; attempt < 120; attempt++){
    if(attempt > 0) await delay(1000);

    const response = await fetch(`${COLLECTION_API_BASE}/cross-checks/${encodeURIComponent(id)}`, {
      cache:"no-store"
    });
    const data = await response.json().catch(() => null);
    if(!response.ok || !data?.ok){
      throw new Error(data?.error || "Could not load cross-check status.");
    }

    if(data.status === "complete") return data;
    if(data.status === "failed") throw new Error(data.error || "Cross-check failed.");
    setCrossCheckStatus(data.status === "running" ? "Checking your collection..." : "Waiting for checker...");
  }

  throw new Error("Cross-check timed out. Try again in a moment.");
}

function delay(ms){
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function init(){
  if(hasCollectionId){
    showEmptyCollection({
      requester:true,
      subtitle:"Loading collection..."
    });
  }else{
    showEmptyCollection({
      subtitle:"Paste your Plato invite link to load your collection.",
      error:rawCollectionId ? "Invalid collection link." : ""
    });
  }

  try{
    await loadCatalog();
    if(getActiveFilterCount()){
      setFiltersOpen(true);
    }
  }catch(error){
    subtitleEl.textContent = "Could not load catalog.";
    loadMoreBtn.disabled = true;
    copyBtn.disabled = true;
    showError(error.message);
    return;
  }

  if(hasCollectionId){
    try{
      await loadRequesterCollection();
      clearError();
    }catch(error){
      showEmptyCollection({
        requester:true,
        subtitle:"Requester collection could not be loaded.",
        error:error.message
      });
    }
  }

  buildVisibleItems();
}

init();

</script>
