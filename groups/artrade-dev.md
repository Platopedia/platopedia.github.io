---
layout: tool-content
title: Artrade - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/art-logo.png" />&nbsp;Artrade
---

<style>
h2 { color:#E44026 !important }
h4 { color:#008080 !important;font-size:var(--unit-text-B) !important }
</style>

<div class="linebreak"></div>

Artrade helps you connect with trusted item traders and merchants from our community.

<div class="content-contents text-left" data-open="true" data-icon="&#xf068;,&#xf067;">We provide <embed/></div>

<div class="linebreak"></div>

## 1. Free Membership

Become a member of Artrade. Join our group by clicking the link below!

<p><strong>Currently Unavailable</strong></p>

<div class="linebreak"></div>

## 2. Item Trading

**Merchants -** Group moderators or traders endorsed by Artrade.

**Requesters -** Group members or traders not endorsed by Artrade.

To take part in item trading, request for your desired item/s in the group, and wait for a merchant to accept your trade.

<div class="linebreak"></div>

#### Incentive Bonus

Merchants receive an incentive bonus from the requester's end. Some important points are listed below.

- Incentive bonus is determined by the total value of the items you're trading for. It's not counted separately for each item.
- If a merchant requests for items, they should also pay the incentive. For merchant-merchant trade, the requester sends first. For merchant-member trade, the member sends first, even if the merchant is the requester. The member will receive incentive.
- Use the calculator below to determine the trade price for an item.

<div class="card" style="padding:20px;border:1px solid var(--color-B);background:linear-gradient(var(--color-C),var(--color-D));max-width:520px">

<h4>Trade Price Calculator</h4>

<label>Item Price (Coins)</label>
<input id="coinInput" type="number" class="form-control" placeholder="Enter item price in coins" />

<div style="text-align:center;margin:10px 0;font-size:var(--unit-text-B)">or</div>

<label>Item Price (Pips)</label>
<input id="pipInput" type="number" class="form-control" placeholder="Enter item price in pips" />

<div class="linebreak"></div>

<div id="calcResult" style="font-weight:bold"></div>

</div>

<script>

function calculateTradeCoins(coins){
  const increased = coins * 1.25;
  return Math.ceil(increased / 50) * 50;
}

function updateCalc(){
  const coinInput = document.getElementById("coinInput");
  const pipInput = document.getElementById("pipInput");
  const result = document.getElementById("calcResult");

  let coins = 0;

  if (coinInput.value) {
    coins = parseInt(coinInput.value);
    pipInput.value = (coins / 250).toFixed(2);
  }
  else if (pipInput.value) {
    const pips = parseFloat(pipInput.value);
    coins = Math.round(pips * 250);
    coinInput.value = coins;
  }

  if (coins > 0) {
    const tradePrice = calculateTradeCoins(coins);

    result.innerHTML = `
      Item Value: <b>${coins.toLocaleString()} Coins</b><br>
      Trade Price: <span style="color:#E44026"><b>${tradePrice.toLocaleString()} Coins</b></span>
    `;
  }
  else{
    result.innerHTML = "";
  }
}

document.getElementById("coinInput").addEventListener("input", updateCalc);
document.getElementById("pipInput").addEventListener("input", updateCalc);

</script>

<div class="linebreak"></div>

#### Artrade's Trading Rules

During a trade, merchants and requesters must follow the trading rules listed below.

- We highly recommend that requesters only trade with our merchants, and not the members.
- Requesters need to send the full amount (including bonus) before merchants can proceed with their part.
- Both parties are only allowed to exchange items, and must not involve any other types of exchanges.
- Both parties are advised to take screenshots or screen recordings during a trade.
- If there's an issue, you must report to the group owners.
- Members can only request items for their main account. Requesting items for other accounts, even your own, is prohibited.
- Not following Artrade's trading rules can get you permanently removed from the group.

<div class="linebreak"></div>

## 3. Scam Insurance

Artrade provides insurance for any scam related incidents during a trade. You must share screenshots or screen recordings of the incident with one of our group owners. Once the evidence is verified, our insurance account will send you the full amount in items. The conditions are listed below.

- You must be a member of the group to claim the insurance.
- The insurance only applies when trading with one of our merchants.
- The insurance does not cover trade value exceeding 10,000 coins.

<div class="linebreak"></div>

## 4. Plato Items Website

The following website contains the entire list of Plato Items (including images & audios).

<span class="content-link" data-url="https://platopedia.com/items" data-text="" data-copy="true"></span>

<div class="linebreak"></div>

## 5. Trusted Merchants

All of our merchants and their stats are listed below. If you wish to become a merchant, contact our group owners.

<table class="table table-bordered">
<thead>
<tr>
<th class="">Plato ID</th>
</tr>
</thead>
<tbody>
<tr><td>Fear</td></tr>
<tr><td>Focus</td></tr>
<tr><td>Rose</td></tr>
<tr><td>Spring</td></tr>
<tr><td>zos</td></tr>
<tr><td>Acer</td></tr>
<tr><td>arlovp</td></tr>
<tr><td>Aura</td></tr>
<tr><td>badfacewanda</td></tr>
<tr><td>ChicaaG</td></tr>
<tr><td>DPN</td></tr>
<tr><td>Fairy</td></tr>
<tr><td>Nefya</td></tr>
<tr><td>QueenyMeany</td></tr>
<tr><td>sohee</td></tr>
<tr><td>Trolledyou</td></tr>
<tr><td>userstrange</td></tr>
<tr><td>_ilsx</td></tr>
<tr><td>Arts</td></tr>
<tr><td>Darktored</td></tr>
<tr><td>EmpressT</td></tr>
<tr><td>Gift</td></tr>
<tr><td>Hades</td></tr>
<tr><td>Hera</td></tr>
<tr><td>Lagirl</td></tr>
<tr><td>mishii</td></tr>
<tr><td>RBT</td></tr>
<tr><td>Ritme</td></tr>
<tr><td>UniqueM_</td></tr>
</tbody>
</table>

<div class="linebreak"></div>