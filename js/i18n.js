/* Reused component: i18next. Text lives in locales/en.js and locales/ms.js */
i18next.init({ lng: load("mp_lang", "en"), fallbackLng: "en", keySeparator: false, nsSeparator: false, interpolation: { escapeValue: false }, resources: { en: { translation: EN }, ms: { translation: MS } }, initImmediate: false });
const t = (k, o) => i18next.t(k, o);
function applyStatic() { document.documentElement.lang = i18next.language; if (typeof syncLang === "function") syncLang(); document.querySelectorAll("[data-i18n]").forEach(e => e.textContent = t(e.dataset.i18n)) }
function setLang(l) { i18next.changeLanguage(l).then(() => { save("mp_lang", l); applyStatic(); stopFns.forEach(f => f()); stopFns = []; render() }) }
