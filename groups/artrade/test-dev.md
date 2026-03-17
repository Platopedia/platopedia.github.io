---
layout: tool-content
title: Artrade - Platopedia
heading: <img src="/docs/assets/images/groups/artrade/artrade-thumbnail.webp" />&nbsp;Artrade
---

<style>
h2 { color:#CD9B1E !important }
h4 { color:#008080 !important;font-size:var(--unit-text-B) !important }
</style>

<div class="linebreak"></div>

## Generate Trade Ticket

<div class="trade-card" style="text-align:center;margin-bottom:20px;">
  <p>Need a trade ticket? Generate one instantly.</p>
  <button id="genTicketBtn" style="padding:10px 18px;background:#CD9B1E;border:none;border-radius:6px;cursor:pointer;">
    Generate Ticket
  </button>
  <div id="captcha-container" style="display:none;"></div>
  <div id="genTicketResult" style="margin-top:12px;font-weight:600;"></div>
</div>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
<script>

let widgetId = null;

// Refactored: ticket generation is now done in onCaptchaSuccess
async function onCaptchaSuccess(token) {
  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  btn.disabled = true;
  btn.textContent = "Generating...";
  result.textContent = "";

  try{
    const res = await fetch("https://ticket-generator.platopedia.workers.dev/generate-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        captchaToken: token,
        fingerprint: navigator.userAgent
      })
    });

    const data = await res.json();

    if(!res.ok || !data.ticket){
      throw new Error("Failed");
    }

    window.location.href = `/groups/artrade/ticket?t=${data.ticket}`;

  }catch(e){
    result.textContent = "Failed to generate ticket. Try again.";
    btn.disabled = false;
    btn.textContent = "Generate Ticket";
    turnstile.reset(widgetId);
  }
}

function initCaptcha(){
  widgetId = turnstile.render('#captcha-container', {
    sitekey: '0x4AAAAAACsY3XYA6cc6K6Ks',
    appearance: 'interaction-only',
    execution: 'execute',
    callback: onCaptchaSuccess,
    'expired-callback': () => turnstile.reset(widgetId),
    'error-callback': () => turnstile.reset(widgetId)
  });
}

/* =========================
   SIMPLE TICKET GENERATOR
   ========================= */

document.addEventListener("DOMContentLoaded", () => {

  const btn = document.getElementById("genTicketBtn");
  if (!btn) return;

  initCaptcha();

  setTimeout(() => {
    if(!widgetId){
      const result = document.getElementById("genTicketResult");
      result.textContent = "Captcha failed to load. Refresh page.";
    }
  }, 3000);

  btn.addEventListener("click", function(){

    if(!widgetId){
      const result = document.getElementById("genTicketResult");
      result.textContent = "Verification not ready. Try again.";
      return;
    }

    const result = document.getElementById("genTicketResult");
    result.textContent = "Verifying...";

    turnstile.execute(widgetId);

  });

});

</script>
