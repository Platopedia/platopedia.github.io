(() => {
  const root = document.documentElement;
  const key = "util_theme";
  const system = matchMedia("(prefers-color-scheme: dark)");
  let preference;
  let toggle;

  try {
    preference = localStorage.getItem(key);
  } catch {
    // The toggle also works when browser storage is unavailable.
  }

  function apply() {
    const theme = preference === "dark" || preference === "light" ? preference : system.matches ? "dark" : "light";
    root.dataset.theme = theme;
    if (document.body) document.body.dataset.theme = theme;
    const meta = document.querySelector('meta[name="theme-color"]');
    if (meta) meta.content = theme === "dark" ? "#0c1522" : "#1687ef";
    if (toggle) {
      toggle.setAttribute("aria-pressed", String(theme === "dark"));
      toggle.title = theme === "dark" ? "Switch to light mode" : "Switch to dark mode";
    }
  }

  // Apply the preference before the stylesheet and page content load.
  apply();
  system.addEventListener("change", apply);
  window.addEventListener("storage", (event) => {
    if (event.key !== key && event.key !== null) return;
    preference = event.newValue;
    apply();
  });
  document.addEventListener("DOMContentLoaded", () => {
    toggle = document.querySelector("[data-groups-theme-toggle]");
    if (!toggle) return;
    apply();
    toggle.hidden = false;
    toggle.addEventListener("click", () => {
      preference = root.dataset.theme === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(key, preference);
      } catch {
        // Keep the in-memory preference for this page.
      }
      apply();
    });
  });
})();
