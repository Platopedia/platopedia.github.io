## Generate Trade Ticket

<div class="trade-card">
  <h2>🎟 Generate Trade Ticket</h2>
  <p class="subtitle">Secure, instant ticket generation powered by verification.</p>

  <button id="genTicketBtn" class="primary-btn">
    <span class="btn-text">Generate Ticket</span>
    <span class="btn-loader" hidden></span>
  </button>

  <!-- Hidden Turnstile -->
  <div id="captcha-container" class="captcha-hidden"></div>

  <div id="genTicketResult" class="status-text"></div>
</div>

<style>
.trade-card {
  max-width: 420px;
  margin: 40px auto;
  padding: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
  color: #fff;
  text-align: center;
  box-shadow: 0 10px 30px rgba(0,0,0,0.4);
}

.trade-card h2 {
  margin-bottom: 6px;
}

.subtitle {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 20px;
}

.primary-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #CD9B1E, #f4c542);
  border: none;
  border-radius: 10px;
  cursor: pointer;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: 0.2s;
}

.primary-btn:hover {
  transform: translateY(-1px);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-loader {
  width: 18px;
  height: 18px;
  border: 3px solid rgba(255,255,255,0.3);
  border-top: 3px solid white;
  border-radius: 50%;
  display: inline-block;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.status-text {
  margin-top: 14px;
  font-weight: 600;
  min-height: 20px;
}

.captcha-hidden {
  position: fixed;
  top: -100px;
  left: -100px;
  width: 1px;
  height: 1px;
  opacity: 0;
}
</style>

<script src="https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onTurnstileLoad&render=explicit" defer></script>

<script>
let widgetId = null;
let isProcessing = false;
let awaitingToken = false;

function onTurnstileLoad(){
  initCaptcha();
}

function initCaptcha(){
  if(!window.turnstile) return;

  widgetId = turnstile.render('#captcha-container', {
    sitekey: '0x4AAAAAACsY3XYA6cc6K6Ks',
    callback: handleSuccess,
    execution: 'execute'
  });
}

function setLoading(btn, loading){
  const text = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".btn-loader");

  if(loading){
    text.textContent = "Processing...";
    loader.hidden = false;
  } else {
    text.textContent = "Generate Ticket";
    loader.hidden = true;
  }
}

async function handleSuccess(token){
  if(!awaitingToken || isProcessing) return;

  isProcessing = true;
  awaitingToken = false;

  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  setLoading(btn, true);
  result.textContent = "Contacting server...";
  result.style.color = "#aaa";

  try{
    const res = await fetch("https://ticket-generator.platopedia.workers.dev/generate-ticket", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        captchaToken: token,
        fingerprint: navigator.userAgent
      })
    });

    const data = await res.json().catch(()=>({}));

    if(!res.ok){
      throw new Error(data.message || "Failed");
    }

    result.textContent = "✅ Ticket generated! Redirecting...";
    result.style.color = "#16A34A";

    setTimeout(()=>{
      window.location.href = `/groups/artrade/ticket?t=${data.ticket}`;
    }, 800);

  }catch(e){
    result.textContent = "❌ Failed to generate ticket.";
    result.style.color = "#E1100D";

    setLoading(btn, false);
    btn.disabled = false;
    isProcessing = false;

    if(widgetId) turnstile.reset(widgetId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("genTicketBtn");
  const result = document.getElementById("genTicketResult");

  btn.addEventListener("click", () => {
    if(btn.disabled || isProcessing) return;

    if(!widgetId){
      result.textContent = "Verification not ready. Refresh.";
      result.style.color = "#E1100D";
      return;
    }

    awaitingToken = true;
    btn.disabled = true;
    result.textContent = "🔐 Verifying...";
    result.style.color = "#aaa";

    try{
      turnstile.execute(widgetId);
    }catch{
      result.textContent = "Verification failed.";
      result.style.color = "#E1100D";
      btn.disabled = false;
      awaitingToken = false;
    }
  });
});
</script>
