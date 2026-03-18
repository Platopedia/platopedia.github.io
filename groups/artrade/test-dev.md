## Generate Trade Ticket

<div class="trade-card">
  <h2>🎟 Generate Trade Ticket</h2>
  <p class="subtitle">Request a trade ticket securely in seconds.</p>

  <button id="genTicketBtn" class="primary-btn">
    <span class="btn-text">Generate Secure Ticket</span>
    <span class="btn-loader" hidden></span>
  </button>

  <p class="security-note">🔒 Secured and verified automatically</p>

  <!-- Hidden Turnstile -->
  <div id="captcha-container" class="captcha-hidden"></div>

  <div id="genTicketResult" class="status-text"></div>
</div>

<style>
.trade-card {
  max-width: 420px;
  margin: 60px auto;
  padding: 28px;
  border-radius: 18px;
  background: linear-gradient(135deg, #111 0%, #1a1a1a 100%);
  color: #fff;
  text-align: center;
  box-shadow: 0 20px 50px rgba(0,0,0,0.5);
  transition: 0.3s ease;
}

.trade-card h2 {
  margin-bottom: 6px;
  font-size: 22px;
}

.subtitle {
  color: #aaa;
  font-size: 14px;
  margin-bottom: 24px;
}

.primary-btn {
  width: 100%;
  padding: 14px;
  background: linear-gradient(135deg, #CD9B1E, #f4c542);
  border: none;
  border-radius: 12px;
  cursor: pointer;
  font-weight: 600;
  position: relative;
  overflow: hidden;
  transition: 0.2s ease;
}

.primary-btn:hover {
  transform: translateY(-1px);
}

.primary-btn:active {
  transform: scale(0.98);
}

.primary-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  filter: grayscale(0.3);
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
  margin-top: 16px;
  font-weight: 600;
  min-height: 24px;
  transition: 0.2s ease;
}

.status-text.success {
  color: #16A34A;
  text-shadow: 0 0 8px rgba(22,163,74,0.4);
}

.status-text.error {
  color: #E1100D;
}

.security-note {
  margin-top: 12px;
  font-size: 12px;
  color: #888;
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
let isInitialized = false;

function onTurnstileLoad(){
  initCaptcha();
}

function initCaptcha(){
  if(!window.turnstile || isInitialized) return;

  widgetId = turnstile.render('#captcha-container', {
    sitekey: '0x4AAAAAACsY3XYA6cc6K6Ks',
    callback: handleSuccess,
    execution: 'execute'
  });

  isInitialized = true;
}

function setLoading(btn, loading){
  const text = btn.querySelector(".btn-text");
  const loader = btn.querySelector(".btn-loader");

  if(loading){
    text.textContent = "Processing...";
    loader.hidden = false;
  } else {
    text.textContent = "Generate Secure Ticket";
    loader.hidden = true;
  }
}

function setStatus(message, type = ""){
  const el = document.getElementById("genTicketResult");
  el.textContent = message;
  el.className = "status-text " + type;
}

async function handleSuccess(token){
  if(!awaitingToken || isProcessing) return;

  isProcessing = true;
  awaitingToken = false;

  const btn = document.getElementById("genTicketBtn");

  setLoading(btn, true);
  setStatus("⚙️ Generating your ticket...");

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

    setStatus("✅ Ticket ready!", "success");

    requestAnimationFrame(() => {
      window.location.replace(`/groups/artrade/ticket?t=${data.ticket}`);
    });

  }catch(e){
    setStatus("❌ Something went wrong. Please try again.", "error");

    setLoading(btn, false);
    btn.disabled = false;
    isProcessing = false;

    if(widgetId) turnstile.reset(widgetId);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  isProcessing = false;
  awaitingToken = false;

  const btn = document.getElementById("genTicketBtn");

  btn.disabled = false;
  setLoading(btn, false);
  setStatus("");

  btn.addEventListener("click", () => {
    if(btn.disabled || isProcessing) return;

    if(!widgetId){
      setStatus("❌ Verification not ready. Please refresh.", "error");
      return;
    }

    awaitingToken = true;
    btn.disabled = true;

    setStatus("🔐 Verifying your request...");

    try{
      turnstile.execute(widgetId);
    }catch{
      setStatus("❌ Verification failed. Please try again.", "error");
      btn.disabled = false;
      awaitingToken = false;
    }
  });
});

window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    const btn = document.getElementById("genTicketBtn");

    isProcessing = false;
    awaitingToken = false;

    if (btn) {
      btn.disabled = false;
      setLoading(btn, false);
    }

    setStatus("");

    if (widgetId && window.turnstile) {
      try { turnstile.reset(widgetId); } catch {}
    }
  }
});
</script>
