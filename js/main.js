const root = document.documentElement;
$("#th").onclick = () => { const n = root.dataset.bsTheme === "dark" ? "light" : "dark"; root.dataset.bsTheme = n; save("mp_theme", n) };
document.addEventListener("keydown", e => { if (view === "checkin" && qi > 0 && qi <= 21 && /^[1-4]$/.test(e.key) && !e.target.matches("textarea,input,select")) { const b = document.querySelector(`.opt[data-n="${e.key - 1}"]`); b && b.click() } });
const h0 = (location.hash || "").slice(1); if (VIEWS[h0]) view = h0;
applyStatic(); document.querySelectorAll("[data-lang]").forEach(b => b.onclick = () => setLang(b.dataset.lang));
render();

function syncLang() { const LN = { en: "English", ms: "Bahasa Melayu" }; $("#lgb").textContent = LN[i18next.language] || "English"; document.querySelectorAll("[data-lang]").forEach(b => b.classList.toggle("active", b.dataset.lang === i18next.language)) }
