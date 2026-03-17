---
layout: tool-content
title: Artrade - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade
---

<style>
h2 { color:#CD9B1E !important }
</style>

## Generate Trade Ticket

<div class="trade-card" style="text-align:center;margin-bottom:20px;">
  <p>Need a trade ticket? Generate one instantly.</p>

  <button id="genTicketBtn" style="
    padding:12px 20px;
    background:#CD9B1E;
    border:none;
    border-radius:8px;
    cursor:pointer;
    font-weight:600;
    transition:0.2s;
  ">
    Generate Ticket
  </button>

  <div id="captcha-container" style="margin-top:12px;"></div>

  <div id="genTicketResult" style="margin-top:12px;font-weight:600;"></div>
</div>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script>

let widgetId = null;
let generating = false;

function initCaptcha(){
  widgetId = turnstile.render('#captcha-container', {
    sitekey: '0x4AAAAAACsY3XYA6cc6K6Ks', // your site key
    appearance: 'interaction-only',

    callback: onCaptchaSuccess,

    'expired-callback': () => {
      turnstile.reset(widgetId);
    },

    'error-callback': () => {
      turnstile.reset(widgetId);
    }
  });
}

async function onCaptchaSuccess(token){
  if(generating) return;
  generating = true;

  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  btn.disabled = true;
  btn.textContent = "Generating...";
  result.textContent = "";

  try{
    const res = await fetch("https://ticket-generator.platopedia.workers.dev/generate-ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        captchaToken: token,
        fingerprint: navigator.userAgent
      })
    });

    const data = await res.json();

    if(!res.ok || !data.ticket){
      throw new Error("Failed");
    }

    // Redirect to ticket page
    window.location.href = `/groups/artrade/ticket?t=${data.ticket}`;

  }catch(e){
    result.textContent = "Failed to generate ticket. Try again.";

    turnstile.reset(widgetId);

    btn.disabled = false;
    btn.textContent = "Generate Ticket";
    generating = false;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("genTicketBtn");
  if (!btn) return;

  initCaptcha();

  btn.addEventListener("click", () => {
    turnstile.execute(widgetId);
  });
});

</script>
