const COL = ["--ok", "--ok", "--mid", "--warn", "--warn"];
const cssv = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
const CLR = { get stress() { return cssv("--accent") }, get anxiety() { return cssv("--mid") }, get depression() { return cssv("--warn") } };
const nm = k => t(NAME[k]), lv = l => t("level." + l);
const qs = () => t("q", { returnObjects: true }), ans4 = () => t("ans", { returnObjects: true });
function enc(l) { const a = t("quotes." + (l >= 3 ? "high" : l >= 1 ? "mid" : "low"), { returnObjects: true }); return a[Math.floor(Math.random() * a.length)] }
