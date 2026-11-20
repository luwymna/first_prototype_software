// Load saved theme and apply if present
const th = load("mp_theme", null);
if (th) document.documentElement.dataset.theme = th;

// Theme toggle button
$("#th").onclick = () => {
  const current = document.documentElement.dataset.theme || (matchMedia("(prefers-color-scheme:dark)").matches ? "dark" : "light");
  const next = current === "dark" ? "light" : "dark";
  document.documentElement.dataset.theme = next;
  save("mp_theme", next);
};

// Keyboard shortcuts for check‑in options (1‑4)
document.addEventListener("keydown", e => {
  if (
    view === "checkin" &&
    qi > 0 && qi <= 21 &&
    /^[1-4]$/.test(e.key) &&
    !e.target.matches("textarea,input,select")
  ) {
    const btn = document.querySelector(`.opt[data-n="${e.key - 1}"]`);
    btn && btn.click();
  }
});

// Set initial view based on URL hash
const h0 = (location.hash || "").slice(1);
if (VIEWS[h0]) view = h0;

// Render the UI
render();
