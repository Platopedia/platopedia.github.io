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

<label>Select Item</label>
<input id="item-search" list="items-list" placeholder="Search items">
<datalist id="items-list"></datalist>

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

let itemsData = {};

async function loadItems(){

  const res = await fetch("/items.html");
  const html = await res.text();

  const match = html.match(/var items = (\{[\s\S]*?\});/);

  if(!match){
    console.error("Items dataset not found");
    return;
  }

  itemsData = JSON.parse(match[1]);

  const list = document.getElementById("items-list");

  for(const id in itemsData){
    const opt = document.createElement("option");
    opt.value = id;
    list.appendChild(opt);
  }

}

function addItem(){

  const id = document.getElementById("item-search").value.trim();
  if(!id) return;

  const textarea = document.getElementById("items");

  const link = "https://platopedia.com/items?id=" + id;

  if(!textarea.value.includes(link)){
    textarea.value += (textarea.value ? "\n" : "") + link;
  }

  document.getElementById("item-search").value = "";

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
