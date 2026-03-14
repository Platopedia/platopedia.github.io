---
layout: tool-content
title: Artrade Ticket - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade
---

<style>
.ticket-panel{
padding:20px;
border:1px solid var(--color-B);
background:linear-gradient(var(--color-C),var(--color-D));
max-width:600px;
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

.ticket-panel button{
margin-top:16px;
padding:10px 16px;
background:#CD9B1E;
border:none;
cursor:pointer;
}
</style>

<div class="ticket-panel">

<label>Plato ID</label>
<input id="plato">

<label>Search Item</label>
<input id="item-search" placeholder="Search item name...">

<div id="items-dropdown" style="max-height:220px;overflow:auto;border:1px solid var(--color-B);margin-top:6px"></div>

<button type="button" onclick="addItem()">Add Item</button>

<label>Selected Items</label>
<textarea id="items" rows="6"
placeholder="Selected item links will appear here (one per line)"></textarea>

<button onclick="submitTrade()">Submit Request</button>

</div>

<script>

const params = new URLSearchParams(location.search);
const ticket = params.get("t");

// Client-side expiry check (tickets older than 10 minutes)
if(ticket && ticket.includes("-")){
 const parts = ticket.split("-");
 const created = parseInt(parts[1]);
 if(created && Date.now() - created > 600000){
   document.querySelector(".ticket-panel").innerHTML =
   "This ticket has expired.";
 }
}

if(!ticket){
 document.querySelector(".ticket-panel").innerHTML =
 "Invalid or missing ticket.";
}

let itemImages = {};
let selectedItem = null;

async function loadItems(){

  const res = await fetch("/items.html");
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html,"text/html");

  const rows = doc.querySelectorAll("#tool_items_table_default tbody tr");

  const imgMatch = html.match(/var items = (\{[\s\S]*?\});/);

  if(imgMatch){
    itemImages = JSON.parse(imgMatch[1]);
  }

  const dropdown = document.getElementById("items-dropdown");

  rows.forEach(row => {

    const id = row.children[0].textContent.trim();
    const name = row.children[2].textContent.trim();

    let img = "";
    const imgUri = itemImages[id]?.med?.images?.find(i => i.uri)?.uri;
    if(imgUri){
      img = "https://profile.platocdn.com/" + imgUri;
    }

    const item = document.createElement("div");

    item.style.display = "flex";
    item.style.alignItems = "center";
    item.style.gap = "8px";
    item.style.padding = "4px";
    item.style.cursor = "pointer";

    item.innerHTML = `
      <img src="${img}" width="26" height="26">
      <span>${id} — ${name}</span>
    `;

    item.onclick = () => {
      selectedItem = id;
      document.getElementById("item-search").value = `${id} — ${name}`;
    };

    dropdown.appendChild(item);

  });

  document.getElementById("item-search").addEventListener("input", e => {

    const q = e.target.value.toLowerCase();

    dropdown.childNodes.forEach(n => {
      n.style.display =
        n.textContent.toLowerCase().includes(q) ? "flex" : "none";
    });

  });

}

function addItem(){

  if(!selectedItem) return;

  const textarea = document.getElementById("items");

  const link = "https://platopedia.com/items?id=" + selectedItem;

  if(!textarea.value.includes(link)){
    textarea.value += (textarea.value ? "\n" : "") + link;
  }

  selectedItem = null;
}

loadItems();

async function submitTrade(){

 // disable button and show loading feedback
 const btn = document.querySelector(".ticket-panel button");
 if(btn){
   btn.disabled = true;
   btn.textContent = "Submitting...";
 }

 const platoId = document.getElementById("plato").value;
 const items = document.getElementById("items").value;

 const res = await fetch("https://discord.com/api/webhooks/1482087912295104614/ro6kzQvLhc5vCJq6vMSA66jdiEm8WnNECdZN9jHk1KhQETik74XyvMJusIv3k_A4mzd3",{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body: JSON.stringify({
    content:
      "🌐 **Website Trade Request**\n\n" +
      "**Ticket:** " + ticket + "\n" +
      "**Plato ID:** " + platoId + "\n\n" +
      "**Items:**\n" + items
  })
 });

 // Discord webhooks don't return a JSON body we can use reliably
 // so just check the HTTP status
 if(!res.ok){
   if(btn){
     btn.disabled = false;
     btn.textContent = "Submit Request";
   }
   document.querySelector(".ticket-panel").innerHTML =
   "Failed to submit request. Please try again.";
   return;
 }

 // mark ticket as used in this browser
 localStorage.setItem("artrade_ticket_" + ticket, "used");


 // replace panel with confirmation message
 document.querySelector(".ticket-panel").innerHTML =
 "Your trade request has been submitted.";

}

</script>
