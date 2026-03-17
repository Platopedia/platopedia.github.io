## Generate Trade Ticket

<div class="trade-card" style="text-align:center;margin-bottom:20px; position:relative;">
  <p>Need a trade ticket? Generate one instantly.</p>

<button id="genTicketBtn" type="button" style="
padding:12px 20px;
background:#CD9B1E;
border:none;
border-radius:8px;
cursor:pointer;
font-weight:600;
position:relative;
z-index:10;
">
Generate Ticket
</button>

  <!-- Hidden Turnstile (safe) -->
  <div id="captcha-container" style="
    position:fixed;
    top:-100px;
    left:-100px;
    width:1px;
    height:1px;
    opacity:0;
  "></div>

  <div id="genTicketResult" style="margin-top:12px;font-weight:600;"></div>
</div>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit" defer></script>

<script>
let widgetId = null;
let isProcessing = false;
let awaitingToken = false; // strict guard: only accept token after a click-triggered execute

function onTurnstileLoad(){
  initCaptcha();
}

function initCaptcha(){
  if(!window.turnstile){
    console.error("Turnstile not loaded");
    return;
  }

  widgetId = turnstile.render('#captcha-container', {
    sitekey: '0x4AAAAAACsY3XYA6cc6K6Ks',
    callback: handleSuccess,
    execution: 'execute'
  });
}

async function handleSuccess(token){
  if(!awaitingToken){
    // Ignore any auto / duplicate callbacks
    return;
  }
  if(isProcessing) return;
  isProcessing = true;
  awaitingToken = false; // consume this execution

  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  btn.disabled = true;
  btn.style.pointerEvents = "none";
  btn.textContent = "Generating...";

  result.textContent = "";
  result.style.color = "";

  const timeout = setTimeout(() => {
    if(isProcessing){
      btn.disabled = false;
      btn.style.pointerEvents = "auto";
      btn.textContent = "Generate Ticket";
      result.textContent = "Verification timeout. Try again.";
      result.style.color = "#ff4d4f";
      isProcessing = false;
      awaitingToken = false;

      if(widgetId) turnstile.reset(widgetId);
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

    if(!res.ok){
      clearTimeout(timeout);

      result.textContent = data.message || "Something went wrong.";
      result.style.color = "#ff4d4f";

      btn.disabled = false;
      btn.style.pointerEvents = "auto";
      btn.textContent = "Generate Ticket";
      isProcessing = false;
      awaitingToken = false;

      if(widgetId) turnstile.reset(widgetId);
      return;
    }

    if(!data.ticket){
      throw new Error("no_ticket");
    }

    clearTimeout(timeout);

    window.location.href = `/groups/artrade/ticket?t=${data.ticket}`;

  }catch(e){
    clearTimeout(timeout);

    result.textContent = "Failed to generate ticket. Try again.";
    result.style.color = "#ff4d4f";

    btn.disabled = false;
    btn.style.pointerEvents = "auto";
    btn.textContent = "Generate Ticket";
    isProcessing = false;
    awaitingToken = false;

    if(widgetId) turnstile.reset(widgetId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  btn.disabled = false;
  btn.style.pointerEvents = "auto";

  // Prevent duplicate binding
  if (!btn.dataset.bound) {
    btn.dataset.bound = "1";

    btn.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      if(btn.disabled || isProcessing) return;

      awaitingToken = true;

      if(!widgetId){
        result.textContent = "Verification not ready. Refresh.";
        result.style.color = "#ff4d4f";
        return;
      }

      result.textContent = "Verifying...";
      result.style.color = "";

      btn.disabled = true;
      btn.style.pointerEvents = "none";

      try{
        turnstile.execute(widgetId);
      }catch(err){
        result.textContent = "Verification failed. Please try again.";
        result.style.color = "#ff4d4f";

        btn.disabled = false;
        btn.style.pointerEvents = "auto";
        awaitingToken = false;
      }
    });
  }
});
</script>
