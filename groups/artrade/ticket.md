---
layout: tool-content
title: Artrade Ticket - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade Ticket
---

<style>

.button-row{
  display:flex;
  gap:8px;
  flex-wrap:wrap;
}

.button-row button{
  margin-top:16px;
}

html{
  min-height:100%;
  overflow-x:hidden;
  -webkit-text-size-adjust:100%;
}

body{
  min-height:100%;
  height:auto;
  overflow-x:hidden;
  overflow-anchor:none;
}

input, textarea {
  font-size: 16px;
}

.ticket-panel{
  padding:20px;
  border:1px solid var(--color-B);
  background:linear-gradient(var(--color-C),var(--color-D));
  max-width:600px;
  margin:0 auto;
  box-sizing:border-box;
}

.ticket-panel label{
  display:block;
  margin-top:12px;
  font-weight:600;
}

.ticket-panel input,
.ticket-panel textarea,
.ticket-panel select{
  width:100%;
  padding:8px;
  margin-top:4px;
  box-sizing:border-box;
  background:var(--color-D);
  color:var(--color-text);
  border:1px solid var(--color-B);
  border-radius:6px;
  scroll-margin-top:90px;
  scroll-margin-bottom:360px;
}

.ticket-panel input:focus,
.ticket-panel select:focus{
  outline:none;
}

/* Chrome autofill background correction */
.ticket-panel input:-webkit-autofill{
  -webkit-box-shadow: 0 0 0 1000px var(--color-D) inset !important;
  -webkit-text-fill-color: var(--color-text) !important;
  caret-color: var(--color-text) !important;
}

/* When focused, restore the normal glow and force gold border */
.ticket-panel input:-webkit-autofill:focus{
  -webkit-box-shadow:
    0 0 8px var(--color-form-field-box),
    0 0 0 1000px var(--color-D) inset !important;
  border:1px solid var(--color-D) !important;
  caret-color: var(--color-text) !important;
}

#items{
  border:1px solid #CD9B1E;
  outline:none;
  resize:none;
}

#items:hover,
#items:focus{
  border:1px solid #CD9B1E;
  outline:none;
}

.ticket-panel #plato-error,
.ticket-panel #items-error,
.ticket-panel #friend-error,
.ticket-panel #submit-error{
  margin-top:4px;
  font-size:13px;
  color:#e74c3c;
  display:none;
}

.ticket-panel button{
  margin-top:16px;
  padding:10px 16px;
  background:#CD9B1E;
  color:#1A1A1A;
  border:none;
  border-radius:6px;
  cursor:pointer;
  transition:transform 0.05s ease;
  font-weight:500;
  touch-action: manipulation;
}

.ticket-panel button:hover{
  box-shadow:0 3px 8px rgba(0,0,0,.35);
}

/* Confirm loading slide effect */
.ticket-panel button.loading{
  position:relative;
  overflow:hidden;
}

.ticket-panel button.loading::before{
  content:"";
  position:absolute;
  top:0;
  left:0;
  width:100%;
  height:100%;
  background:#CD9B1E;
  transform:translateX(-100%);
  animation:confirmSlide .6s ease forwards;
}

@keyframes confirmSlide{
  from{ transform:translateX(-100%); }
  to{ transform:translateX(0); }
}

.ticket-panel button.loading span{
  position:relative;
  z-index:1;
}

/* Button tap/pressed feedback */
.ticket-panel button:active{
  transform:scale(.90);
}
.ticket-panel button.pressed{
  transform:scale(.90);
}

.ticket-panel button:disabled{
  opacity:0.6;
  cursor:not-allowed;
}

.input-wrap{
  position:relative;
}

.input-wrap input{
  padding-right:28px;
}

.input-clear{
  position:absolute;
  right:6px;
  top:50%;
  transform:translateY(-50%);
  font-size:20px;
  color:#CD9B1E;
  display:none;
  padding:6px 8px;
  cursor:pointer;
}

.input-clear:hover{
  color:#b8860b;
}

.item-name:hover{
  color:#CD9B1E;
}

/* Small shake animation for the Selected Items box */
@keyframes itemsShake{
  0%{ transform:translateX(0); }
  25%{ transform:translateX(-3px); }
  50%{ transform:translateX(3px); }
  75%{ transform:translateX(-2px); }
  100%{ transform:translateX(0); }
}

.items-shake{
  animation:itemsShake .25s ease;
}

/* Gold scrollbar thumb */
#items-dropdown::-webkit-scrollbar{
  width:8px;
}

#items-dropdown::-webkit-scrollbar-thumb{
  background:#CD9B1E;
  border-radius:4px;
}

</style>

<div class="ticket-panel">

<label>Plato ID</label>
<div class="input-wrap">
<input id="plato" placeholder="Enter Plato ID" autocomplete="off">
  <span class="input-clear" id="plato-clear">×</span>
</div>
<div id="plato-error">
  Invalid Plato ID (3–12 characters: letters, numbers, underscores)
</div>

<label>Plato Invite Link</label>
<div class="input-wrap">
  <input id="friend-link" placeholder="Enter Plato Invite Link (https://...)" autocomplete="off">
  <span class="input-clear" id="friend-clear">×</span>
</div>

<div id="friend-error">
  Please enter a valid Plato Invite Link (https://platoapp.com/link/...)
</div>

<label>Search Item</label>
<div class="input-wrap">
<input id="item-search" placeholder="Search item name..." autocomplete="off">
  <span class="input-clear" id="search-clear">×</span>
</div>

<div id="items-dropdown" style="max-height:220px;overflow:auto;margin-top:6px;background:var(--color-D);border:1px solid var(--color-B);padding:4px;display:none"></div>

<label>Selected Items</label>
<textarea id="items" rows="6" readonly placeholder="Selected items will appear here (Max 5 items)"></textarea>
  <div id="totals-box" style="margin-top:10px;padding:10px;border:1px solid var(--color-B);background:var(--color-D);display:none">
  <div style="font-size:14px;"><strong>Total Value:</strong> <span id="total-price">0</span></div>
  <div style="margin-top:4px;font-size:14px;"><strong>Total Trade Price:</strong> <span id="total-trade-price">0</span></div>
  <div style="margin-top:6px;font-size:12px;color:var(--color-text);opacity:.85">
  </div>
</div>

<!-- Optional Payment Method -->
<div style="margin-top:12px;">
  <div id="optional-toggle" style="cursor:pointer;font-weight:600;">
    Optional ▸
  </div>

  <div id="optional-content" style="display:none;margin-top:8px;">
    <label>Select Payment Method</label>
    <select id="trade-method">
      <option value="coins" selected>Coins</option>
      <option value="pips">Pips</option>
    </select>
  </div>
</div>

<div id="items-error">
  Please add at least one item (Max 5 items)
</div>

<div class="button-row">
  <button id="submit-btn" onclick="prepareSubmit()">Submit Request</button>
  <button type="button" onclick="clearItems()" style="background:#888">Clear All</button>
</div>
<div id="submit-error"></div>

</div>

<div class="linebreak"></div>

<div id="ticket-note" class="ticket-panel" style="text-align:center;">
  Each generated ticket can be <strong>used only once</strong>. Invalid or reused tickets will not be processed as Artrade trade requests.
</div>

<div id="discord-invite" class="ticket-panel" style="display:none;text-align:center;">
  <span id="ticket-id" class="ticket-copy" style="cursor:pointer;font-weight:600;"></span>
</div>

<div class="linebreak"></div>

<script>

const MERCHANT_COINS_PER_PIP = 250;
const COINS_TO_PIPS_COINS_PER_PIP = 200;
const COINS_TO_PIPS_MARKUP_MULTIPLIER = 1.2;

const params = new URLSearchParams(location.search);
const ticket = params.get("t");
document.addEventListener("DOMContentLoaded", ()=>{
  const ticketEl = document.getElementById("ticket-id");
  if(ticketEl && ticket){
    ticketEl.textContent = ticket + " (tap to copy)";
    ticketEl.addEventListener("click", ()=>{
      navigator.clipboard.writeText(ticket);
      ticketEl.textContent = ticket + " (copied)";
      setTimeout(()=>{
        ticketEl.textContent = ticket + " (tap to copy)";
      },1500);
    });
  }
});
const submitted = params.get("submitted");

if(ticket && submitted === "1"){
  localStorage.setItem("artrade_submitted_"+ticket,"1");
}

if(ticket && submitted !== "1" && localStorage.getItem("artrade_submitted_"+ticket) === "1"){
  const url = new URL(window.location.href);
  url.searchParams.set("submitted","1");
  window.location.replace(url.toString());
}

if(!ticket){
  document.querySelector(".ticket-panel").innerHTML = "Invalid or missing ticket.";
}

if(submitted === "1"){
  const panel = document.querySelector(".ticket-panel");
  panel.innerHTML = `
    <div style="text-align:center;">
      Your trade request has been submitted.<br><br><strong>Ticket ID:</strong> ${ticket}<br><br>Please save this ID and keep it private. If the trade is accepted, an <strong>Artrade Merchant</strong> will add you using your Plato link and provide the same <strong>Ticket ID</strong> to confirm they are part of our team.
    </div>
  `;
  document.addEventListener("DOMContentLoaded", ()=>{
    const invite = document.getElementById("discord-invite");
    if(invite) invite.style.display = "block";
  });
}

// Hide the ticket note on the success page
if(submitted === "1"){
  const note = document.getElementById("ticket-note");
  if(note) note.style.display = "none";
}

const platoRegex = /^[A-Za-z0-9_]{3,12}$/;

const platoInput = document.getElementById("plato");
const platoError = document.getElementById("plato-error");
const friendInput = document.getElementById("friend-link");
const friendError = document.getElementById("friend-error");
const itemsError = document.getElementById("items-error");
const submitError = document.getElementById("submit-error");
const searchInput = document.getElementById("item-search");
const dropdown = document.getElementById("items-dropdown");

const itemsBox = document.getElementById("items");
const optionalToggle = document.getElementById("optional-toggle");
const optionalContent = document.getElementById("optional-content");
const tradeMethodSelect = document.getElementById("trade-method");

if(tradeMethodSelect){
  tradeMethodSelect.addEventListener("change", ()=>{
    updateTotals();
  });
}

if(optionalToggle && optionalContent){
  optionalToggle.addEventListener("click", ()=>{
    const isHidden = optionalContent.style.display === "none";

    optionalContent.style.display = isHidden ? "block" : "none";

    // Update arrow
    optionalToggle.textContent = isHidden ? "Optional ▾" : "Optional ▸";
  });
}

document.addEventListener("focusin", e=>{
  if(!e.target.matches("input, textarea, select")) return;

  setTimeout(()=>{
    e.target.scrollIntoView({
      block:"center",
      inline:"nearest",
      behavior:"smooth"
    });
  },250);
});

// Haptic feedback when tapping the Selected Items box (supported mobile browsers)
itemsBox.addEventListener("click", ()=>{
  if(navigator.vibrate){
    navigator.vibrate(25);
  }

  // small shake so users know it is not editable
  itemsBox.classList.remove("items-shake");
  void itemsBox.offsetWidth;
  itemsBox.classList.add("items-shake");
});

// Haptic feedback for all buttons
document.querySelectorAll(".ticket-panel button").forEach(btn=>{
  btn.addEventListener("click", ()=>{
    if(navigator.vibrate){
      navigator.vibrate(25);
    }
  });
});

// Enable :active on iOS Safari (kept minimal)
document.addEventListener("touchstart", ()=>{}, { passive: true });

// Pointer events for mouse/trackpad (Mac tap-to-click support)
document.querySelectorAll(".ticket-panel button").forEach(btn=>{
  btn.addEventListener("pointerdown", ()=>{
    btn.classList.add("pressed");
  });

  btn.addEventListener("pointerup", ()=>{
    setTimeout(()=>btn.classList.remove("pressed"), 60);
  });

  btn.addEventListener("pointerleave", ()=>{
    btn.classList.remove("pressed");
  });
});

const platoClear = document.getElementById("plato-clear");
const friendClear = document.getElementById("friend-clear");
const searchClear = document.getElementById("search-clear");

let itemImages = {};
let itemsIndex = [];
let selectedItems = [];
let submitting = false;

function updateTotals(){

  let totalCoins = 0;
  let totalPips = 0;

  selectedItems.forEach(i=>{
    if(i.currency === "p"){
      totalPips += (i.price || 0);
    }else{
      totalCoins += (i.price || 0);
    }
  });

  const totalsBox = document.getElementById("totals-box");
  const totalPriceEl = document.getElementById("total-price");
  const totalTradePriceEl = document.getElementById("total-trade-price");

  if(selectedItems.length === 0){
    totalsBox.style.display = "none";
    return;
  }

  totalsBox.style.display = "block";

  // Total price always displayed in coins (pips converted)
  const totalPriceCoins = totalCoins + (totalPips * MERCHANT_COINS_PER_PIP);

  // Coin items follow +25% then round up to nearest 50
  const coinTrade = totalCoins > 0
    ? Math.ceil((totalCoins * 1.25) / 50) * 50
    : 0;

  // Pip items convert directly to coins
  const pipTrade = totalPips * MERCHANT_COINS_PER_PIP;

  const totalTradeCoins = coinTrade + pipTrade;

  // Display total price with separate currencies
  if(totalCoins > 0 && totalPips > 0){
    totalPriceEl.textContent = totalCoins + " Coins | " + totalPips + " Pips";
  }else if(totalPips > 0){
    totalPriceEl.textContent = totalPips + " Pips";
  }else{
    totalPriceEl.textContent = totalCoins + " Coins";
  }

    // Apply payment method
    if(tradeMethodSelect && tradeMethodSelect.value === "pips"){

      // IMPORTANT: do NOT round here — keep raw value for accurate final calculation
      const coinsToPips = (totalCoins / COINS_TO_PIPS_COINS_PER_PIP) * COINS_TO_PIPS_MARKUP_MULTIPLIER;

      // Apply +25% ONLY to pips items
      const pipsWithMarkup = Math.ceil(totalPips * 1.25);

      const totalTradePips = Math.ceil(pipsWithMarkup + coinsToPips);

      totalTradePriceEl.textContent = totalTradePips + " Pips";

    }else{

      // Default Coins method (existing logic)
      totalTradePriceEl.textContent = totalTradeCoins + " Coins";

    }

  // Dynamically update the formula box
  const formulaBox = totalsBox.querySelector("div:last-child");

  if(tradeMethodSelect && tradeMethodSelect.value === "pips"){
    formulaBox.innerHTML = `
      <div>Formula (Pips → Pips): +25% value, rounded up to the nearest 1 Pip.</div>
      <div>Formula (Coins → Pips): 1 Pip = 200 Coins, then +20%. (Requester Rate)</div>
    `;
  }else{
    formulaBox.innerHTML = `
      <div>Formula (Coins → Coins): +25% value, rounded up to the nearest 50 Coins.</div>
      <div>Formula (Pips → Coins): 1 Pip = 250 Coins. (Merchant Rate)</div>
    `;
  }

}

platoInput.addEventListener("input",()=>{
  platoClear.style.display = platoInput.value ? "block" : "none";

  const val = platoInput.value.trim();
  platoError.style.display = (val === "" || platoRegex.test(val)) ? "none" : "block";
});

friendInput.addEventListener("input",()=>{
  friendClear.style.display = friendInput.value ? "block" : "none";

  const val = friendInput.value.trim();
  if(val === ""){
    friendError.style.display = "none";
  }else if(val.length > 50){
    friendError.style.display = "block";
  }else{
    friendError.style.display = /^https:\/\/platoapp\.com\/link\/.+/i.test(val) ? "none" : "block";
  }
});

searchInput.addEventListener("input",()=>{
  searchClear.style.display = searchInput.value ? "block" : "none";
});

platoClear.onclick = ()=>{
  platoInput.value = "";
  platoClear.style.display = "none";
  platoError.style.display = "none";
};

friendClear.onclick = ()=>{
  friendInput.value = "";
  friendClear.style.display = "none";
  friendError.style.display = "none";
};

searchClear.onclick = ()=>{
  searchInput.value = "";
  dropdown.innerHTML = "";
  dropdown.style.display = "none";
};

async function loadItems(){

  const res = await fetch("/items.html");
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html,"text/html");

  const rows = doc.querySelectorAll("#tool_items_table_default tbody tr");

  const imgMatch = html.match(/var items = (\{[\s\S]*?\});/);

  if(imgMatch){
    itemImages = JSON.parse(imgMatch[1]);
  }

  rows.forEach(row=>{

    const id = row.children[0].textContent.trim();
    const type = row.children[1].textContent.trim();
    const name = row.children[2].textContent.trim();

    const rareFlag = row.children[7]?.textContent.trim() === "1";

    // 🚫 Exclude Bundle + rare items
    if(type === "Bundle" && rareFlag){
      return;
    }

    // Extract price cell (4th column)
    const priceCell = row.children[3];

    let price = null;
    let currency = null;

    if(priceCell){
      const icon = priceCell.querySelector("i");

      if(icon){
        if(icon.classList.contains("c")) currency = "c";
        if(icon.classList.contains("p")) currency = "p";
      }

      const priceText = priceCell.textContent.replace(/,/g,"").trim();
      const parsed = parseInt(priceText,10);
      if(!isNaN(parsed)) price = parsed;
    }

    const imgUri = itemImages[id]?.med?.images?.find(i=>i.uri)?.uri;

    itemsIndex.push({
      id,
      name,
      img: imgUri ? "https://profile.platocdn.com/" + imgUri : "",
      price,
      currency
    });

  });

  searchInput.addEventListener("input", e=>{

    const q = e.target.value.toLowerCase().trim();

    dropdown.innerHTML = "";
    dropdown.style.display = "none";

    if(q.length < 2) return;

    const matches = itemsIndex
      .filter(i=>i.name.toLowerCase().includes(q) || i.id.toLowerCase().includes(q))
      .slice(0,50);

    if(matches.length) dropdown.style.display = "block";

    matches.forEach(i=>{

      const item = document.createElement("div");

      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "8px";
      item.style.padding = "4px";
      item.style.cursor = "pointer";

      // Show price and currency before the item name
      const currencyLabel = i.currency === "p" ? "p" : "c";
      const priceLabel = i.price ? `${i.price}${currencyLabel}` : "";

      item.innerHTML = `
        <img src="${i.img}" style="width:40px;height:26px;object-fit:contain;flex-shrink:0;">
        <span class="item-name">${i.name}${priceLabel ? ` (${priceLabel})` : ""}</span>
      `;

      item.onclick = ()=>{

        if(selectedItems.length >= 5){

          itemsError.textContent = "Maximum 5 items allowed";
          itemsError.style.display = "block";

          searchInput.value = "";
          searchClear.style.display = "none";
          dropdown.innerHTML = "";
          dropdown.style.display = "none";

          return;
        }

        if(selectedItems.find(x=>x.id===i.id)) return;

        selectedItems.push({ id:i.id, name:i.name, price:i.price, currency:i.currency });

        document.getElementById("items").value = selectedItems
          .map((x,i)=>{
            const priceLabel = x.price ? ` (${x.price}${x.currency === "p" ? "p" : "c"})` : "";
            return `${i+1}. ${x.name}${priceLabel}`;
          })
          .join("\n");
        updateTotals();

        itemsError.style.display = "none";

        searchInput.value = "";
        searchClear.style.display = "none";
        dropdown.innerHTML = "";
        dropdown.style.display = "none";

      };

      dropdown.appendChild(item);

    });

  });

}

let itemsLoaded = false;

searchInput.addEventListener("focus", async ()=>{
  if(!itemsLoaded){
    await loadItems();
    itemsLoaded = true;

    // Re-trigger search after items load (fix for typing before load completes)
    searchInput.dispatchEvent(new Event("input"));
  }
});

function clearItems(){

  selectedItems = [];
  updateTotals();

  document.getElementById("items").value = "";
  document.getElementById("plato").value = "";
  friendInput.value = "";
  searchInput.value = "";
  // Hide the clear buttons after clearing
  platoClear.style.display = "none";
  friendError.style.display = "none";
  friendClear.style.display = "none";
  searchClear.style.display = "none";

  platoError.style.display = "none";

  itemsError.style.display = "none";
  itemsError.textContent = "Please add at least one item (Max 5 items)";

  dropdown.innerHTML = "";
  dropdown.style.display = "none";

  // Reset submit/confirm button back to Submit state
  const submitBtn = document.getElementById("submit-btn");
  if(submitBtn){
    submitBtn.textContent = "Submit Request";
    submitBtn.style.background = "#CD9B1E";
    submitBtn.disabled = false;
    submitBtn.onclick = prepareSubmit;
  }

  // Clear submit error
  submitError.style.display = "none";
  submitError.textContent = "";
}

function prepareSubmit(){

  // Clear any previous submit error
  submitError.style.display = "none";
  submitError.textContent = "";

  const submitBtn = document.getElementById("submit-btn");
  const platoId = platoInput.value.trim();
  const friendLink = friendInput.value.trim();

  let hasError = false;

  if(!platoRegex.test(platoId)){
    platoError.style.display = "block";
    hasError = true;
  }

  if(friendLink.length > 50 || !/^https:\/\/platoapp\.com\/link\/.+/i.test(friendLink)){
    friendError.style.display = "block";
    hasError = true;
  }

  if(selectedItems.length === 0){
    itemsError.textContent = "Please add at least one item (Max 5 items)";
    itemsError.style.display = "block";
    hasError = true;
  }

  if(hasError) return;

  submitBtn.textContent = "Confirm";
  submitBtn.style.background = "#28a745";
  submitBtn.onclick = submitTrade;
}

async function submitTrade(){

  const btn = document.getElementById("submit-btn");
  const clearBtn = document.querySelector('button[onclick="clearItems()"]');

  // Trigger gold slide loading effect
  btn.classList.add("loading");

  const platoId = platoInput.value.trim();
  const friendLink = friendInput.value.trim();

  if(submitting) return;
  submitting = true;

  btn.disabled = true;
  if(clearBtn) clearBtn.disabled = true;
  const processingTimeout = setTimeout(()=>{
    if(submitting){
      btn.textContent = "Processing...";
    }
  },120);

  try{

    const res = await fetch(
      "https://artrade-ticket.platopedia.workers.dev",
      {
        method:"POST",
        headers:{"Content-Type":"application/json"},
        body:JSON.stringify({
          ticket,
          platoId,
          friendLink,
          tradeMethod: tradeMethodSelect ? tradeMethodSelect.value : "coins",
          items:selectedItems.map(i=>"https://platopedia.com/items?id="+i.id)
        })
      }
    );

    let data = null;

    try{
      data = await res.json();
    }catch(e){
      data = null;
    }

    // Invalid ticket response (handle all 400s)
    if(res.status === 400){

      clearTimeout(processingTimeout);
      btn.classList.remove("loading");
      btn.disabled = false;
      if(clearBtn) clearBtn.disabled = false;
      btn.textContent = "Submit Request";
      btn.style.background = "#CD9B1E";
      btn.onclick = prepareSubmit;

      submitError.textContent = data?.message || "Invalid ticket. Please generate a new ticket.";
      submitError.style.display = "block";

      submitting = false;

      return;
    }

    // Duplicate ticket response
    if(res.status === 409 && data && data.status === "duplicate"){

      clearTimeout(processingTimeout);
      btn.classList.remove("loading");
      btn.disabled = false;
      if(clearBtn) clearBtn.disabled = false;
      btn.textContent = "Submit Request";
      btn.style.background = "#CD9B1E";
      btn.onclick = prepareSubmit;

      submitError.textContent = "This ticket has already been used for a trade request. Please generate a new ticket.";
      submitError.style.display = "block";

      submitting = false;

      return;
    }

    if(!res.ok){
      throw new Error(data?.message || "Worker request failed");
    }

    clearTimeout(processingTimeout);
    const url = new URL(window.location.href);
    url.searchParams.set("submitted","1");
    window.location.replace(url.toString());

  }catch(err){
    clearTimeout(processingTimeout);
    // Reset button if Worker/network fails
    btn.classList.remove("loading");
    btn.disabled = false;
    if(clearBtn) clearBtn.disabled = false;
    btn.textContent = "Submit Request";
    btn.style.background = "#CD9B1E";
    btn.onclick = prepareSubmit;

    submitError.textContent = err?.message || "Submission failed. Please try again.";
    submitError.style.display = "block";

    submitting = false;

  }

}

</script>
