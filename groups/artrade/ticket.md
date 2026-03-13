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

if(!ticket){
 document.querySelector(".ticket-panel").innerHTML =
 "Invalid or missing ticket.";
}

async function submitTrade(){

 const platoId = document.getElementById("plato").value;
 const items = document.getElementById("items").value;

 const res = await fetch("https://YOUR_BOT_API/artrade-request",{
  method:"POST",
  headers:{ "Content-Type":"application/json" },
  body:JSON.stringify({
   ticket,
   platoId,
   items
  })
 });

 const data = await res.json();
 alert(data.message);

}

</script>