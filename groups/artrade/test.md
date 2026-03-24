---
layout: tool-content
title: Artrade - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade
---

<style>

h2 { color:#CD9B1E !important }
h4 { color:#008080 !important;font-size:var(--unit-text-B) !important }

/* calculator layout */

.trade-calculators{
display:grid;
grid-template-columns:repeat(auto-fit,minmax(260px,1fr));
gap:20px;
width:100%;
max-width:100%;
box-sizing:border-box;
}

#coinsSection,
#pipsSection{
display:contents;
}

.trade-card{
padding:20px;
border:1px solid var(--color-B);
background:linear-gradient(var(--color-C),var(--color-D));
box-sizing:border-box;
min-width:0;
word-break:break-word;
overflow-wrap:anywhere;
}

.trade-card label{
display:block;
font-size:0.9em;
font-weight:600;
margin-bottom:8px;
color:var(--color-text);
}

.trade-input{
width:100%;
box-sizing:border-box;
padding-right:14px;
overflow:hidden;
text-overflow:ellipsis;
}

.trade-input-wrap{
position:relative;
}

.trade-clear{
position:absolute;
right:4px;
top:50%;
transform:translateY(-50%);
border:none;
background:none;
font-size:18px;
cursor:pointer;
color:#CD9B1E;
opacity:0.6;
width:28px;
height:28px;
display:none;
align-items:center;
justify-content:center;
}

.trade-clear:hover{
opacity:1;
}

.trade-result{
margin-top:10px;
font-weight:bold;
line-height:1.5;
word-break:break-word;
overflow-wrap:anywhere;
white-space:normal;
}

.trade-desc{
font-size:0.85em;
opacity:0.7;
margin-bottom:6px;
}

.trade-highlight{
color:#CD9B1E;
}

.content-link{
font-size:0.9em;
}

/* remove browser number arrows */

input[type=number]::-webkit-outer-spin-button,
input[type=number]::-webkit-inner-spin-button{
-webkit-appearance:none;
margin:0;
}

input[type=number]{
-moz-appearance:textfield;
appearance:textfield;
}

.ticket-card{
text-align:center;
}

.primary-btn{
width:100%;
max-width:320px;
margin:10px auto 0;
padding:12px;
background:linear-gradient(135deg,#CD9B1E,#f4c542);
border:none;
border-radius:10px;
cursor:pointer;
font-weight:600;
color:#1A1A1A;
transition:transform 0.05s ease;
}

.primary-btn:hover{
  box-shadow:0 3px 8px rgba(0,0,0,.35);
}

.primary-btn:active{
transform:scale(0.90);
}

.primary-btn.pressed{
  transform:scale(0.90);
}

.primary-btn:disabled{
opacity:0.6;
cursor:not-allowed;
}

.btn-loader{
width:16px;
height:16px;
border:3px solid rgba(255,255,255,0.3);
border-top:3px solid white;
border-radius:50%;
display:inline-block;
animation:spin 0.8s linear infinite;
}

@keyframes spin{
to{transform:rotate(360deg);}
}

.status-text{
margin-top:10px;
font-weight:600;
min-height:20px;
line-height:20px;
display:flex;
align-items:center;
justify-content:center;
}

.status-text.security-note{
font-weight:400;
font-size:12px;
color:#888;
}

.status-text.active{
font-size:12px;
color:#888;
font-weight:400;
}

.status-text.active.success{
color:#16A34A;
}

.status-text.active.error{
color:#E1100D;
}

.captcha-hidden{
position:fixed;
top:-100px;
left:-100px;
width:1px;
height:1px;
opacity:0;
}

</style>

<div class="linebreak"></div>

Artrade helps you connect with trusted item traders and merchants from our community. Tap the **+** icon below to see more.

<div class="content-contents text-left" data-open="false" data-icon="&#xf068;,&#xf067;">Contents <embed/></div>

<div class="linebreak"></div>

## Artrade Invite

**Artrade (Plato Group):**<br>
<span class="content-link" data-url="https://platoapp.com/link/1k601dxkdvd20" data-text="" data-copy="true"></span>

**Artrade (Discord Server):**
<span class="content-link" data-url="https://discord.com/invite/ardc" data-text="" data-copy="true"></span>

<div class="linebreak"></div>

## Artrade Ticket

<div class="trade-card ticket-card" style="margin-top:10px">

<h4>Item Trading</h4>
<p class="trade-desc">Trade rare or exclusive Plato items with trusted <strong>Artrade Merchants</strong>. Each generated ticket can be <strong>used only once</strong> and stays <strong>valid for 24 hours</strong>. <strong>Daily Create Limit:</strong> 2 per user.</p>

<button id="genTicketBtn" class="primary-btn">
  <span class="btn-text">Create Trade Ticket</span>
  <span class="btn-loader" hidden></span>
</button>

<div id="genTicketResult" class="status-text security-note">🔒 Safe and secure trading</div>

<div id="captcha-container" class="captcha-hidden"></div>

</div>

<div class="linebreak"></div>

## Item Trading Guide

**Merchants -** Group admins or traders endorsed by Artrade.

**Requesters -** Group members or traders not endorsed by Artrade.

To take part in item trading, press the **Create Trade Ticket** button above to request for your desired item/s, and wait for a merchant to accept your trade.

<div class="trade-card" style="margin-top:10px">
You can also join the <a href="https://discord.com/invite/ardc">Artrade (Discord Server)</a> to use our <strong>Items Request Panel</strong> in the <strong>#artrade-panel</strong> channel for safer and more efficient trading.
</div>

<div class="linebreak"></div>

#### Trade Price

The trade price is the final amount required for a trade. Some important points about how trade pricing works are listed below.

- The trade price is determined by the total value of items you're trading for. It's not counted separately for each item.
- Use the [**Artrade Calculator**](#artrade-calculator) below to determine the trade price.

<div class="linebreak"></div>

#### Artrade's Trading Rules

During a trade, merchants and requesters must follow the trading rules listed below.

- Both parties are only allowed to exchange items, and must not involve any other types of exchanges.
- Requesters need to send the full amount in items (trade price) before merchants can proceed with their part.
- Not following Artrade's trading rules can get you removed from the group.

<div class="linebreak"></div>

## Artrade Calculator {#artrade-calculator}

Use the calculator to check the total trade price of one or more items.

<div style="display:flex;gap:10px;margin-bottom:10px;">
  <button id="tabCoins" class="primary-btn" style="flex:1;">Coins</button>
  <button id="tabPips" class="primary-btn" style="flex:1;opacity:0.6;">Pips</button>
</div>
<div class="trade-calculators">

<div id="coinsSection">
<div style="grid-column:1/-1;"><h4>Coins Method</h4></div>

<div class="trade-card">

<h4>Trade Calculator (Coins → Coins)</h4>
<p class="trade-desc">Formula: +25% value, then rounded up to the nearest 50 Coins.</p>

<label>Item/s Price (Coins)</label>

<div class="trade-input-wrap">
<input id="coinInput" class="form-control trade-input" type="number" max="100000000" placeholder="Enter item/s price in Coins">
<button class="trade-clear" onclick="clearCoin()">×</button>
</div>

<div id="coinResult" class="trade-result"></div>

</div>

<div class="trade-card">

<h4>Trade Calculator (Pips → Coins)</h4>
<p class="trade-desc">Formula: 1 Pip = 250 Coins.</p>

<label>Item/s Price (Pips)</label>

<div class="trade-input-wrap">
<input id="pipInput" class="form-control trade-input" type="number" max="100000000" placeholder="Enter item/s price in Pips">
<button class="trade-clear" onclick="clearPip()">×</button>
</div>

<div id="pipResult" class="trade-result"></div>

</div>

</div>
<div id="pipsSection" style="display:none;">
<div style="grid-column:1/-1;"><h4>Pips Method</h4></div>

<div class="trade-card">

<h4>Trade Calculator (Pips → Pips)</h4>
<p class="trade-desc">Formula: +25% value, rounded up to the nearest 1 Pip.</p>

<label>Item/s Price (Pips)</label>

<div class="trade-input-wrap">
<input id="pipInputPips" class="form-control trade-input" type="number" max="100000000" placeholder="Enter item/s price in Pips">
<button class="trade-clear" onclick="clearPipPips()">×</button>
</div>

<div id="pipResultPips" class="trade-result"></div>

</div>

<div class="trade-card">

<h4>Trade Calculator (Pips → Coins)</h4>
<p class="trade-desc">Formula: 1 Pip = 200 Coins (Requester Rate).</p>

<label>Item/s Price (Pips)</label>

<div class="trade-input-wrap">
<input id="pipInputCoins" class="form-control trade-input" type="number" max="100000000" placeholder="Enter item/s price in Pips">
<button class="trade-clear" onclick="clearPipCoins()">×</button>
</div>

<div id="pipResultCoins" class="trade-result"></div>

</div>

</div>
</div>

The page below contains the entire list of Plato Items with their base prices (including images & audios).

<span class="content-link" data-url="https://platopedia.com/items" data-text="" data-copy="true"></span>

<div class="linebreak"></div>

## Scam Insurance

Artrade provides insurance for any scam related incidents during a trade. You must share screenshots or screen recordings of the incident with one of our group owners. Once the evidence is verified, our insurance account will send you the full amount in items. The conditions are listed below.

- You must be a member of the group to claim the insurance.
- The insurance only applies when trading with one of our merchants.
- The insurance does not cover trade value exceeding 10,000 coins.

<div class="linebreak"></div>

## Merchant Application

Apply to become an <strong>Artrade Merchant</strong> and join our trusted network of traders. Fill out the form below to submit your application.

<span class="content-link" data-url="https://forms.gle/TaB5PGsjS7LhyPoq5" data-text="" data-copy="true"></span>

<div class="linebreak"></div>

<script>

// Generate stable fingerprint per user
function getFingerprint(){
  let fp = localStorage.getItem("artrade_fp");
  if(!fp){
    fp = crypto.randomUUID();
    localStorage.setItem("artrade_fp", fp);
  }
  return fp;
}

function clearCoin(){
const input=document.getElementById("coinInput");
const result=document.getElementById("coinResult");

input.value="";
result.innerHTML="";
input.parentElement.querySelector('.trade-clear').style.display='none';
input.focus();
}

function clearPip(){
const input=document.getElementById("pipInput");
const result=document.getElementById("pipResult");

input.value="";
result.innerHTML="";
input.parentElement.querySelector('.trade-clear').style.display='none';
input.focus();
}

function calculateTradeCoins(coins){
const increased=coins*1.25;
return Math.ceil(increased/50)*50;
}

/* coin calculator */

document.getElementById("coinInput").addEventListener("input",function(){

let coins = Number(this.value);
if (coins > 100000000) {
  coins = 100000000;
  this.value = coins;
}

const clearBtn=this.parentElement.querySelector('.trade-clear');
clearBtn.style.display=this.value ? 'flex' : 'none';

const result=document.getElementById("coinResult");

if(isNaN(coins) || coins <= 0){
result.innerHTML="";
return;
}

const tradePrice=calculateTradeCoins(coins);

result.innerHTML=`
Item/s Value: <b>${coins.toLocaleString()} Coins</b><br>
Trade Price: <span class="trade-highlight"><b>${tradePrice.toLocaleString()} Coins</b></span>
`;

});

/* pip calculator */

document.getElementById("pipInput").addEventListener("input",function(){

let pips = Number(this.value);
if (pips > 100000000) {
  pips = 100000000;
  this.value = pips;
}

const clearBtn=this.parentElement.querySelector('.trade-clear');
clearBtn.style.display=this.value ? 'flex' : 'none';

const result=document.getElementById("pipResult");

if(isNaN(pips) || pips <= 0){
result.innerHTML="";
return;
}

const tradePrice=Math.round(pips*250);

result.innerHTML=`
Item/s Value: <b>${pips} Pips</b><br>
Trade Price: <span class="trade-highlight"><b>${tradePrice.toLocaleString()} Coins</b></span>
`;

});

/* pip → pips */

function clearPipPips(){
const input=document.getElementById("pipInputPips");
const result=document.getElementById("pipResultPips");

input.value="";
result.innerHTML="";
input.parentElement.querySelector('.trade-clear').style.display='none';
input.focus();
}

document.getElementById("pipInputPips").addEventListener("input",function(){

let pips = Number(this.value);
if (pips > 100000000) {
  pips = 100000000;
  this.value = pips;
}

const clearBtn=this.parentElement.querySelector('.trade-clear');
clearBtn.style.display=this.value ? 'flex' : 'none';

const result=document.getElementById("pipResultPips");

if(isNaN(pips) || pips <= 0){
result.innerHTML="";
return;
}

const tradePips = Math.ceil(pips * 1.25);

result.innerHTML=`
Item/s Value: <b>${pips} Pips</b><br>
Trade Price: <span class="trade-highlight"><b>${tradePips} Pips</b></span>
`;

});

/* pip → coins (requester) */

function clearPipCoins(){
const input=document.getElementById("pipInputCoins");
const result=document.getElementById("pipResultCoins");

input.value="";
result.innerHTML="";
input.parentElement.querySelector('.trade-clear').style.display='none';
input.focus();
}

document.getElementById("pipInputCoins").addEventListener("input",function(){

let pips = Number(this.value);
if (pips > 100000000) {
  pips = 100000000;
  this.value = pips;
}

const clearBtn=this.parentElement.querySelector('.trade-clear');
clearBtn.style.display=this.value ? 'flex' : 'none';

const result=document.getElementById("pipResultCoins");

if(isNaN(pips) || pips <= 0){
result.innerHTML="";
return;
}

const coins = pips * 200;

result.innerHTML=`
Item/s Value: <b>${pips} Pips</b><br>
Trade Price: <span class="trade-highlight"><b>${coins.toLocaleString()} Coins</b></span>
`;

});

let widgetId=null;
let isProcessing=false;
let awaitingToken=false;
let verifyTimeout=null;

function initTurnstile(){
  return turnstile.render('#captcha-container',{
    sitekey:'0x4AAAAAACsY3XYA6cc6K6Ks',
    callback:handleSuccess,
    execution:'execute'
  });
}

function setLoading(btn,loading){
  const text=btn.querySelector(".btn-text");
  const loader=btn.querySelector(".btn-loader");
  if(loading){
    text.textContent="Processing...";
    loader.hidden=false;
  }else{
    text.textContent="Create Trade Ticket";
    loader.hidden=true;
  }
}

function resetBtn(btn){
  btn.disabled = false;
  setLoading(btn,false);
}

function startVerifyTimeout(btn){
  try { if (verifyTimeout) clearTimeout(verifyTimeout); } catch {}

  verifyTimeout = setTimeout(() => {
    if (awaitingToken) {
      awaitingToken = false;
      resetBtn(btn);
      setStatus("❌ Verification timed out. Please try again later.","error");

      if(widgetId && window.turnstile){
        try { turnstile.reset(widgetId); } catch {}
      }
    }
  }, 15000);
}

function setStatus(msg,type){
const el=document.getElementById("genTicketResult");

if(!msg){
el.textContent="🔒 Safe and secure trading";
el.className="status-text security-note";
return;
}

el.textContent=msg;
el.className="status-text"+(type?` ${type}`:"")+" active";
}

async function handleSuccess(token){
if(!awaitingToken||isProcessing) return;

// clear fallback timeout
try { clearTimeout(verifyTimeout); } catch {}

isProcessing=true;
awaitingToken=false;

const btn=document.getElementById("genTicketBtn");

setStatus("⚙️ Generating your ticket...");

try{
const res=await fetch("https://ticket-generator.platopedia.workers.dev/generate-ticket",{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({
captchaToken:token,
fingerprint:getFingerprint()
})
});

const data = await res.json().catch(()=>({}));

if(!res.ok){
  if (data?.retryIn) {
    const h = Math.floor(data.retryIn / 3600);
    const m = Math.floor((data.retryIn % 3600) / 60);

    const timeStr = h > 0 ? `${h}h ${m}m` : `${m}m`;

    setStatus(`⏳ Try again in ${timeStr}. You have reached the 24-hour limit (2 tickets).`, "error");
  } else {
    setStatus(`❌ ${data?.message || data?.error || "Request failed"}`, "error");
  }
  resetBtn(btn);
  isProcessing=false;

  if(widgetId&&window.turnstile){
    try{turnstile.reset(widgetId);}catch{}
  }

  return;
}

if(!data.ticket){
  throw new Error("Invalid response");
}

setStatus("✅ Ticket ready!","success");

setTimeout(()=>{
window.location.href=`/groups/artrade/ticket?t=${data.ticket}`;
},1000);

}catch(err){
setStatus(`❌ ${err.message || "Something went wrong. Please try again later."}`,"error");
resetBtn(btn);
isProcessing=false;

if(widgetId&&window.turnstile){
  try{turnstile.reset(widgetId);}catch{}
}
}
}

document.addEventListener("DOMContentLoaded",()=>{
const btn=document.getElementById("genTicketBtn");

if(!btn) return;

resetBtn(btn);
setStatus("");

btn.addEventListener("click",()=>{
if(btn.disabled||isProcessing||awaitingToken) return;

if(navigator.vibrate){
navigator.vibrate([20,30,20]);
}

// Lazy-load Turnstile on click
if(!window.turnstile){
  awaitingToken = true;
  btn.disabled = true;
  setLoading(btn,true);
  setStatus("🔐 Preparing verification...");

  const script=document.createElement("script");
  script.src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
  script.async=true;

  script.onload=()=>{
    try{
      widgetId = initTurnstile();
      if(!widgetId){
        throw new Error("Turnstile init failed");
      }
      turnstile.execute(widgetId);
      // fallback in case Turnstile callback never fires (lazy-load path)
      startVerifyTimeout(btn);
    }catch{
      setStatus("❌ Verification failed. Please try again later.","error");
      resetBtn(btn);
      awaitingToken=false;
    }
  };
  script.onerror = () => {
    setStatus("❌ Failed to load verification. Please try again.", "error");
    resetBtn(btn);
    awaitingToken = false;
  };

  document.body.appendChild(script);
  return;
}

if(!widgetId){
  try{
    widgetId = initTurnstile();
    if(!widgetId){
      throw new Error("Turnstile init failed");
    }
  }catch{
    setStatus("❌ Verification not ready. Please refresh.","error");
    resetBtn(btn);
    awaitingToken=false;
    return;
  }
}

awaitingToken=true;
btn.disabled=true;
setStatus("🔐 Verifying your request...");

// trigger Turnstile execution
try{
  turnstile.execute(widgetId);
  // fallback in case Turnstile callback never fires
  startVerifyTimeout(btn);
}catch{
  setStatus("❌ Verification failed. Please try again later.","error");
  resetBtn(btn);
  awaitingToken=false;
  return;
}

});
});

// Safari tap bounce fix for generator button
document.addEventListener("touchstart", ()=>{}, { passive: true });

const genBtn = document.getElementById("genTicketBtn");

// Pointer-based press feedback for Mac trackpad taps etc.
if(genBtn){
  genBtn.addEventListener("pointerdown", ()=>{
    genBtn.classList.add("pressed");
  });

  genBtn.addEventListener("pointerup", ()=>{
    setTimeout(()=>genBtn.classList.remove("pressed"),60);
  });

  genBtn.addEventListener("pointerleave", ()=>{
    genBtn.classList.remove("pressed");
  });
}

window.addEventListener("pageshow",(e)=>{
if(e.persisted){
const btn=document.getElementById("genTicketBtn");

isProcessing=false;
awaitingToken=false;

if(btn){
  resetBtn(btn);
}

setStatus("");

if(widgetId&&window.turnstile){
try{turnstile.reset(widgetId);}catch{}
}
}
});

window.addEventListener("load", () => {
  if (!location.hash) return;

  const currentHash = location.hash;
  const lastHandled = sessionStorage.getItem("anchorHandled");

  // Skip if this exact hash was already handled (prevents refresh jump)
  if (lastHandled === currentHash) return;

  const el = document.querySelector(currentHash);
  if (!el) return;

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.scrollIntoView({
        behavior: "instant",
        block: "start"
      });
    });
  });

  // Remember which hash we handled
  sessionStorage.setItem("anchorHandled", currentHash);
});

/* tabs */

const tabCoins = document.getElementById("tabCoins");
const tabPips = document.getElementById("tabPips");
const coinsSection = document.getElementById("coinsSection");
const pipsSection = document.getElementById("pipsSection");

if(tabCoins && tabPips){
  tabCoins.onclick = () => {
    coinsSection.style.display = "block";
    pipsSection.style.display = "none";
    tabCoins.style.opacity = "1";
    tabPips.style.opacity = "0.6";
  };

  tabPips.onclick = () => {
    coinsSection.style.display = "none";
    pipsSection.style.display = "block";
    tabCoins.style.opacity = "0.6";
    tabPips.style.opacity = "1";
  };
}

</script>
