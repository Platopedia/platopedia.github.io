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
">
Generate Ticket
</button>

  <!-- Hidden but renderable captcha -->
  <div id="captcha-container" style="
    position:absolute;
    width:1px;
    height:1px;
    opacity:0;
    pointer-events:none;
  "></div>

  <div id="genTicketResult" style="margin-top:12px;font-weight:600;"></div>
</div>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>

<script>
let widgetId = null;
let isProcessing = false;

function initCaptcha(){
  widgetId = turnstile.render('#captcha-container', {
    sitekey: '0x4AAAAAACsY3XYA6cc6K6Ks',
    callback: handleSuccess
  });
}

async function handleSuccess(token){
  if(isProcessing) return;
  isProcessing = true;

  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  btn.disabled = true;
  btn.textContent = "Generating...";
  result.textContent = "";

  // ⏱️ Safety timeout (prevents stuck button)
  const timeout = setTimeout(() => {
    if(isProcessing){
      btn.disabled = false;
      btn.textContent = "Generate Ticket";
      result.textContent = "Verification timeout. Try again.";
      isProcessing = false;

      if(widgetId){
        turnstile.reset(widgetId);
      }
    }
  }, 10000);

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
      throw new Error("failed");
    }

    clearTimeout(timeout);

    // ✅ redirect on success
    window.location.href = `/groups/artrade/ticket?t=${data.ticket}`;

  }catch(e){
    clearTimeout(timeout);

    result.textContent = "Failed to generate ticket. Try again.";

    btn.disabled = false;
    btn.textContent = "Generate Ticket";
    isProcessing = false;

    if(widgetId){
      turnstile.reset(widgetId);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  initCaptcha();

  btn.addEventListener("click", () => {

    if(isProcessing) return;

    if(!widgetId){
      result.textContent = "Verification not ready. Refresh.";
      return;
    }

    result.textContent = "Verifying...";

    try{
      turnstile.execute(widgetId);
    }catch(e){
      result.textContent = "Verification failed. Refresh page.";
    }

  });
});
</script>
