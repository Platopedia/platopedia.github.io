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

.collection-search{
  width:100%;
  margin-top:16px;
  padding:9px 10px;
  box-sizing:border-box;
  background:var(--color-D);
  color:var(--color-text);
  border:1px solid #CD9B1E;
  border-radius:6px;
  font-size:16px;
}

.collection-search:focus{
  outline:none;
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
}

</style>

<div class="collection-panel">
  <div class="collection-top">
    <div>
      <h2 class="collection-title">Requester Collection</h2>
      <div id="collection-subtitle" class="collection-muted">Loading collection...</div>
    </div>
    <div id="collection-id" class="collection-muted"></div>
  </div>

  <div id="collection-stats" class="collection-stats"></div>
  <input id="collection-search" class="collection-search" autocomplete="off" placeholder="Search SKU, name, type, or price">

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
const collectionId = params.get("id") || "";

const subtitleEl = document.getElementById("collection-subtitle");
const idEl = document.getElementById("collection-id");
const statsEl = document.getElementById("collection-stats");
const searchEl = document.getElementById("collection-search");
const errorEl = document.getElementById("collection-error");
const listEl = document.getElementById("collection-list");
const loadMoreBtn = document.getElementById("load-more");
const copyBtn = document.getElementById("copy-skus");

let skuIds = [];
let itemMap = new Map();
let visibleItems = [];
let renderedCount = 0;

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
  errorEl.textContent = message;
  errorEl.style.display = "block";
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
    let currency = "";
    let price = "";

    if(priceCell){
      const icon = priceCell.querySelector("i");
      if(icon?.classList.contains("c")) currency = "c";
      if(icon?.classList.contains("p")) currency = "p";
      const parsed = priceCell.textContent.replace(/,/g, "").trim();
      if(parsed) price = currency ? `${parsed}${currency}` : parsed;
    }

    const imgUri = images[id]?.med?.images?.find(image => image.uri)?.uri;
    map.set(id, {
      id,
      type,
      name,
      price,
      img: imgUri ? "https://profile.platocdn.com/" + imgUri : "",
      search: `${id} ${type} ${name} ${price}`.toLowerCase()
    });
  });

  itemMap = map;
}

async function loadCollection(){
  if(!collectionId){
    throw new Error("Missing collection id.");
  }

  const response = await fetch(`${COLLECTION_API_BASE}/collections/${encodeURIComponent(collectionId)}`, {
    cache:"no-store"
  });
  const data = await response.json().catch(() => null);

  if(!response.ok || !data?.ok){
    throw new Error(data?.error === "not_found" ? "Collection link expired or was not found." : "Could not load collection.");
  }

  skuIds = Array.isArray(data.skuIds) ? data.skuIds.map(String) : [];
  idEl.textContent = `ID ${collectionId}`;
  subtitleEl.textContent = `${skuIds.length} unique SKU IDs`;
  statsEl.innerHTML = [
    pill("Items", skuIds.length),
    data.inventoryRowCount ? pill("Rows", data.inventoryRowCount) : "",
    data.chunkCount ? pill("Chunks", data.chunkCount) : "",
    data.version ? pill("Version", data.version) : ""
  ].filter(Boolean).join("");
}

function buildVisibleItems(){
  const q = searchEl.value.trim().toLowerCase();

  visibleItems = skuIds.map(sku => {
    const catalogItem = itemMap.get(sku);
    return catalogItem || {
      id:sku,
      type:"Unknown",
      name:`Unknown SKU ${sku}`,
      price:"",
      img:"",
      search:sku
    };
  }).filter(item => !q || item.search.includes(q));

  renderedCount = 0;
  listEl.innerHTML = "";
  renderMore();
}

function renderMore(){
  const nextItems = visibleItems.slice(renderedCount, renderedCount + PAGE_SIZE);
  renderedCount += nextItems.length;

  if(renderedCount === 0 && !nextItems.length){
    listEl.innerHTML = `<div class="collection-item"><div class="collection-name">No matching items.</div></div>`;
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
  loadMoreBtn.textContent = renderedCount >= visibleItems.length
    ? "All loaded"
    : `Load more (${visibleItems.length - renderedCount})`;
}

searchEl.addEventListener("input", buildVisibleItems);
loadMoreBtn.addEventListener("click", renderMore);
copyBtn.addEventListener("click", async () => {
  if(!skuIds.length) return;
  await navigator.clipboard.writeText(skuIds.join("\n"));
  copyBtn.textContent = "Copied";
  setTimeout(() => {
    copyBtn.textContent = "Copy SKU IDs";
  }, 1200);
});

Promise.all([loadCatalog(), loadCollection()])
  .then(buildVisibleItems)
  .catch(error => {
    subtitleEl.textContent = "Could not load collection.";
    loadMoreBtn.disabled = true;
    copyBtn.disabled = true;
    showError(error.message);
  });

</script>
