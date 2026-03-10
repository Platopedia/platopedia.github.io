---
layout: tool-content
title: Artrade - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade
---

<style>
h2 { color:#AE8940 !important }
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

.trade-card{
padding:20px;
border:1px solid var(--color-B);
background:linear-gradient(var(--color-C),var(--color-D));
box-sizing:border-box;
min-width:0;
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
color:#AE8940;
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
}

.trade-desc{
font-size:0.85em;
opacity:0.7;
margin-bottom:6px;
}

.trade-highlight{
color:#AE8940;
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
</style>

<div class="linebreak"></div>

Artrade helps you connect with trusted item traders and merchants from our community.

<div class="content-contents text-left" data-open="true" data-icon="&#xf068;,&#xf067;">Contents <embed/></div>

<div class="linebreak"></div>

## 1. Artrade Invite

**Artrade (Plato Group):**<br>
Currently Unavailable

**Artrade (Discord Server):**
<span class="content-link" data-url="https://discord.com/invite/ardc" data-text="" data-copy="true"></span>

<div class="linebreak"></div>

## 2. Item Trading

**Merchants -** Group admins or traders endorsed by Artrade.

**Requesters -** Group members or traders not endorsed by Artrade.

To take part in item trading, request for your desired item/s in the group, and wait for a merchant to accept your trade.

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

## 3. Artrade Calculator {#artrade-calculator}

Use the calculator to check the total trade price of one or more items.

<div class="trade-calculators">

<div class="trade-card">

<h4>Trade Calculator (Coins)</h4>
<p class="trade-desc">Formula: +25% value, then rounded up to the nearest 50 coins.</p>

<label>Item/s Price (Coins)</label>

<div class="trade-input-wrap">
<input id="coinInput" class="form-control trade-input" type="number" placeholder="Enter item/s price in Coins">
<button class="trade-clear" onclick="clearCoin()">×</button>
</div>

<div id="coinResult" class="trade-result"></div>

</div>

<div class="trade-card">

<h4>Trade Calculator (Pips)</h4>
<p class="trade-desc">Formula: 1 Pip = 250 Coins.</p>

<label>Item/s Price (Pips)</label>

<div class="trade-input-wrap">
<input id="pipInput" class="form-control trade-input" type="number" placeholder="Enter item/s price in Pips">
<button class="trade-clear" onclick="clearPip()">×</button>
</div>

<div id="pipResult" class="trade-result"></div>

</div>

</div>

The page below contains the entire list of Plato Items with their base prices (including images & audios).

<span class="content-link" data-url="https://platopedia.com/items" data-text="" data-copy="true"></span>

<div class="linebreak"></div>

## 4. Scam Insurance

Artrade provides insurance for any scam related incidents during a trade. You must share screenshots or screen recordings of the incident with one of our group owners. Once the evidence is verified, our insurance account will send you the full amount in items. The conditions are listed below.

- You must be a member of the group to claim the insurance.
- The insurance only applies when trading with one of our merchants.
- The insurance does not cover trade value exceeding 10,000 coins.

<div class="linebreak"></div>

## 5. Merchant Application

Apply to become an Artrade Merchant and join our trusted network of traders. Fill out the form below to submit your application.

<span class="content-link" data-url="https://forms.gle/TaB5PGsjS7LhyPoq5" data-text="" data-copy="true"></span>

<div class="linebreak"></div>

<script>

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

const coins=parseInt(this.value,10);
const clearBtn=this.parentElement.querySelector('.trade-clear');
clearBtn.style.display=this.value ? 'flex' : 'none';

const result=document.getElementById("coinResult");

if(!coins){
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

const pips=parseFloat(this.value);
const clearBtn=this.parentElement.querySelector('.trade-clear');
clearBtn.style.display=this.value ? 'flex' : 'none';

const result=document.getElementById("pipResult");

if(!pips){
result.innerHTML="";
return;
}

const tradePrice=Math.round(pips*250);

result.innerHTML=`
Item/s Value: <b>${pips} Pips</b><br>
Trade Price: <span class="trade-highlight"><b>${tradePrice.toLocaleString()} Coins</b></span>
`;

});

</script>
