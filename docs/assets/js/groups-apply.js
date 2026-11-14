const form = document.getElementById("group-application");
const errorMessage = document.getElementById("group-application-error");
const thanks = document.getElementById("group-application-thanks");
const button = form.querySelector('button[type="submit"]');
const label = button.querySelector("span");
const fields = Array.from(form.querySelectorAll("input, textarea"));
const defaultLabel = label.textContent;
const connectionError = "We couldn't confirm that your application was received. Your answers are still here. Please try again shortly.";
let lastAttempt;

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (button.disabled) return;
  const answers = Object.fromEntries(fields.map((field) => [field.name, field.value.trim()]));
  const original = JSON.stringify(answers);
  const requestId = lastAttempt?.original === original ? lastAttempt.requestId : crypto.randomUUID();
  lastAttempt = { original, requestId };

  errorMessage.hidden = true;
  errorMessage.textContent = "";
  button.disabled = true;
  label.textContent = "Submitting…";
  fields.forEach((field) => { field.readOnly = true; });
  try {
    const response = await fetch(form.dataset.endpoint, {
      method: "POST",
      credentials: "omit",
      headers: { "content-type": "text/plain;charset=UTF-8" },
      body: JSON.stringify({ ...answers, requestId }),
      signal: AbortSignal.timeout(30_000),
    });
    const result = await response.json();
    if (response.status !== 201 || result?.ok !== true) {
      errorMessage.hidden = false;
      errorMessage.textContent = typeof result?.error === "string" ? result.error : connectionError;
      return;
    }
    form.reset();
    lastAttempt = undefined;
    form.hidden = true;
    thanks.hidden = false;
    thanks.querySelector("h2").focus();
  } catch {
    errorMessage.hidden = false;
    errorMessage.textContent = connectionError;
  } finally {
    button.disabled = false;
    label.textContent = defaultLabel;
    fields.forEach((field) => { field.readOnly = false; });
  }
});

button.disabled = false;
