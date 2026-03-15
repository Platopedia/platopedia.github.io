---
layout: tool-content
title: Artrade Ticket - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade
---


<style>

html, body {
  height: 100%;
  overflow-anchor: none;
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
.ticket-panel textarea{
  width:100%;
  padding:8px;
  margin-top:4px;
  box-sizing:border-box;
  background:var(--color-D);
  color:var(--color-text);
  border:1px solid var(--color-B);
}

.ticket-panel input:focus{
  outline:none;
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
.ticket-panel #friend-error{
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
  transition:transform .12s ease, box-shadow .12s ease;
  font-weight:500;
}

.ticket-panel button:hover{
  box-shadow:0 2px 6px rgba(0,0,0,.25);
}

.ticket-panel button:active{
  transform:scale(.95);
  box-shadow:0 1px 2px rgba(0,0,0,.25);
}

.ticket-panel button:disabled{
  opacity:1;
  color:#1A1A1A;
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

</style>

<div class="ticket-panel">

<label>Plato ID</label>
<div class="input-wrap">
  <input id="plato" placeholder="Enter Plato ID">
  <span class="input-clear" id="plato-clear">×</span>
</div>
<div id="plato-error">
  Invalid Plato ID (3–12 characters: letters, numbers, underscores)
</div>

<label>Plato Friend Link</label>
<div class="input-wrap">
  <input id="friend-link" placeholder="Enter Plato friend link (https://...)">
  <span class="input-clear" id="friend-clear">×</span>
</div>

<div id="friend-error">
  Please enter a valid Plato friend link (https://platoapp.com/link/...)
</div>

<label>Search Item</label>
<div class="input-wrap">
  <input id="item-search" placeholder="Search item name...">
  <span class="input-clear" id="search-clear">×</span>
</div>

<div id="items-dropdown" style="max-height:220px;overflow:auto;margin-top:6px;background:var(--color-D);border:1px solid var(--color-B);padding:4px;display:none"></div>

<label>Selected Items</label>
<textarea id="items" rows="6" readonly placeholder="Selected items will appear here (Max 5 items)"></textarea>
<div id="totals-box" style="margin-top:10px;padding:10px;border:1px solid var(--color-B);background:var(--color-D);display:none">
  <div><strong>Total Price:</strong> <span id="total-price">0</span></div>
  <div style="margin-top:4px"><strong>Total Trade Price:</strong> <span id="total-trade-price">0</span></div>
  <div style="margin-top:6px;font-size:12px;color:var(--color-text);opacity:.85">
    <div>Formula (Coins): +25% value, then rounded up to the nearest 50 coins.</div>
    <div>Formula (Pips): 1 Pip = 250 Coins.</div>
  </div>
</div>

<div id="items-error">
  Please add at least one item (Max 5 items)
</div>

<button id="submit-btn" onclick="prepareSubmit()">Submit Request</button>
<button type="button" onclick="clearItems()" style="margin-left:8px;background:#888">Clear All</button>

</div>

<div class="linebreak"></div>

<div id="ticket-note" class="ticket-panel" style="text-align:center;">
  Each generated ticket can be used only once. Only valid tickets will be processed as Artrade trade requests.
</div>

<div id="discord-invite" class="ticket-panel" style="display:none;text-align:center;">
  <span class="content-link" data-url="https://discord.com/invite/ardc" data-text="" data-copy="true"></span>
</div>

<div class="linebreak"></div>

<script>

const params = new URLSearchParams(location.search);
const ticket = params.get("t");
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
      Your trade request has been submitted. Join the group linked below to stay informed; we'll notify you there once a merchant accepts your trade.
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
const searchInput = document.getElementById("item-search");
const dropdown = document.getElementById("items-dropdown");

const itemsBox = document.getElementById("items");

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
  const totalPriceCoins = totalCoins + (totalPips * 250);

  // Coin items follow +25% then round up to nearest 50
  const coinTrade = Math.ceil((totalCoins * 1.25) / 50) * 50;

  // Pip items convert directly to coins
  const pipTrade = totalPips * 250;

  const totalTradeCoins = coinTrade + pipTrade;

  // Display total price with separate currencies
  if(totalCoins > 0 && totalPips > 0){
    totalPriceEl.textContent = totalCoins + " coins + " + totalPips + " pips";
  }else if(totalPips > 0){
    totalPriceEl.textContent = totalPips + " pips";
  }else{
    totalPriceEl.textContent = totalCoins + " coins";
  }

  // Trade price always displayed in coins
  totalTradePriceEl.textContent = totalTradeCoins + " coins";

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
  searchClear.style.display = "none";
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
    const name = row.children[2].textContent.trim();

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
      .filter(i=>i.name.toLowerCase().includes(q) || i.id.includes(q))
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
        <img src="${i.img}" style="height:26px;max-width:40px;object-fit:contain;">
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

loadItems();

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

  searchClear.style.display = "none";
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
}

function prepareSubmit(){

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
  const platoId = platoInput.value.trim();
  const friendLink = friendInput.value.trim();
  if(submitting) return;
  submitting = true;

  setTimeout(()=>{
    btn.disabled = true;
  },120);

  const res = await fetch(
    "https://discord.com/api/webhooks/1482087912295104614/ro6kzQvLhc5vCJq6vMSA66jdiEm8WnNECdZN9jHk1KhQETik74XyvMJusIv3k_A4mzd3",
    {
      method:"POST",
      headers:{"Content-Type":"application/json"},
      body:JSON.stringify({
        content:
        "🌐 **Website Trade Request**\n\n"+
        "**Ticket:** "+ticket+"\n"+
        "**Plato ID:** "+platoId+"\n"+
        "**Friend Link:** "+(friendLink ? friendLink : "Not provided")+"\n\n"+
        "**Items:**\n"+
        selectedItems.map(i=>"https://platopedia.com/items?id="+i.id).join("\n")
      })
    }
  );

  if(!res.ok){

    btn.disabled = false;

    document.querySelector(".ticket-panel").innerHTML =
      "Failed to submit request. Please try again.";

    return;
  }

  const url = new URL(window.location.href);
  url.searchParams.set("submitted","1");
  window.location.href = url.toString();

}

</script>
