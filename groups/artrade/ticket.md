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

#items{
border:1px solid #CD9B1E;
}

.ticket-panel input + #plato-error,
.ticket-panel textarea + #items-error{
margin-top:4px;
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
<div id="plato-error" style="color:#e74c3c;font-size:13px;display:none;">
Invalid Plato ID (3–12 characters: letters, numbers, underscores)
</div>

<label>Search Item</label>
<input id="item-search" placeholder="Search item name...">

<div id="items-dropdown" style="max-height:220px;overflow:auto;margin-top:6px"></div>


<label>Selected Items</label>
<textarea id="items" rows="6" readonly
placeholder="Selected items will appear here (Max 5 items)"></textarea>
<div id="items-error" style="color:#e74c3c;font-size:13px;display:none;">
Please add at least one item (Max 5 items)
</div>

<button onclick="submitTrade()">Submit Request</button>
<button type="button" onclick="clearItems()" style="margin-left:8px;background:#555;">Clear All</button>

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
let itemsIndex = [];
let selectedItems = [];

const platoInput = document.getElementById("plato");
const platoError = document.getElementById("plato-error");
const platoRegex = /^[A-Za-z0-9_]{3,12}$/;
const itemsError = document.getElementById("items-error");

platoInput.addEventListener("input", () => {
  const val = platoInput.value.trim();
  if(val === "" || platoRegex.test(val)){
    platoError.style.display = "none";
  }else{
    platoError.style.display = "block";
  }
});

async function loadItems(){

  const res = await fetch("/items.html");
  const html = await res.text();

  const doc = new DOMParser().parseFromString(html,"text/html");

  const rows = doc.querySelectorAll("#tool_items_table_default tbody tr");

  const imgMatch = html.match(/var items = (\{[\s\S]*?\});/);

  if(imgMatch){
    itemImages = JSON.parse(imgMatch[1]);
  }

  rows.forEach(row => {

    const id = row.children[0].textContent.trim();
    const name = row.children[2].textContent.trim();

    const imgUri = itemImages[id]?.med?.images?.find(i => i.uri)?.uri;

    itemsIndex.push({
      id,
      name,
      img: imgUri ? "https://profile.platocdn.com/" + imgUri : ""
    });

  });

  const dropdown = document.getElementById("items-dropdown");

  document.getElementById("item-search").addEventListener("input", e => {

    const q = e.target.value.toLowerCase().trim();

    dropdown.innerHTML = "";

    if(q.length < 2) return;

    const matches = itemsIndex
      .filter(i =>
        i.name.toLowerCase().includes(q) ||
        i.id.includes(q)
      )
      .slice(0, 50);

    matches.forEach(i => {

      const item = document.createElement("div");

      item.style.display = "flex";
      item.style.alignItems = "center";
      item.style.gap = "8px";
      item.style.padding = "4px";
      item.style.cursor = "pointer";

      item.innerHTML = `
        <img src="${i.img}" width="26" height="26">
        <span>${i.id} — ${i.name}</span>
      `;

      item.onclick = () => {

        const textarea = document.getElementById("items");

        if(!selectedItems.find(x => x.id === i.id)){

          if(selectedItems.length >= 5){
            itemsError.textContent = "Maximum 5 items allowed";
            itemsError.style.display = "block";
            return;
          }

          selectedItems.push({
            id: i.id,
            name: i.name
          });

          const lines = selectedItems.map((x,idx) =>
            (idx+1) + ". " + x.name
          );

          textarea.value = lines.join("\n");

          itemsError.style.display = "none";

        }

        document.getElementById("item-search").value = "";
        dropdown.innerHTML = "";
        selectedItem = null;

      };

      dropdown.appendChild(item);

    });

  });

}


loadItems();

function clearItems(){
  const textarea = document.getElementById("items");
  const plato = document.getElementById("plato");

  if(textarea){
    textarea.value = "";
  }

  selectedItems = [];

  if(plato){
    plato.value = "";
  }

  if(platoError){
    platoError.style.display = "none";
  }
}

async function submitTrade(){

 const btn = document.querySelector(".ticket-panel button");

 const platoId = document.getElementById("plato").value.trim();

 if(!platoRegex.test(platoId)){
   platoError.style.display = "block";
   return;
 }

 const items = selectedItems
  .map(i => "https://platopedia.com/items?id=" + i.id)
  .join("\n");

 if(selectedItems.length === 0){
   itemsError.style.display = "block";
   if(btn){
     btn.disabled = false;
     btn.textContent = "Submit Request";
   }
   return;
 }else{
   itemsError.style.display = "none";
 }

 // disable button only AFTER validation passes
 if(btn){
   btn.disabled = true;
   btn.textContent = "Submitting...";
 }

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
