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

<label>Item Links</label>
<textarea id="items" rows="6"
placeholder="Paste Platopedia item links here (one per line)"></textarea>

<button onclick="submitTrade()">Submit Request</button>

</div>

<script>

const params = new URLSearchParams(location.search);
const ticket = params.get("t");

// Prevent reuse of the same ticket in the browser
if(ticket && localStorage.getItem("artrade_ticket_" + ticket)){
 document.querySelector(".ticket-panel").innerHTML =
 "This ticket has already been used.";
}

if(!ticket){
 document.querySelector(".ticket-panel").innerHTML =
 "Invalid or missing ticket.";
}

async function submitTrade(){

 // disable button to prevent double submit
 const btn = document.querySelector(".ticket-panel button");
 if(btn) btn.disabled = true;

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
   alert("Failed to submit request. Please try again.");
   if(btn) btn.disabled = false;
   return;
 }

 // mark ticket as used in this browser
 localStorage.setItem("artrade_ticket_" + ticket, "used");

 alert("Trade request submitted successfully.");

 // replace panel with confirmation message
 document.querySelector(".ticket-panel").innerHTML =
 "Your trade request has been submitted.";

}

</script>
