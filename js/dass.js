const COL = ["--ok", "--ok", "--mid", "--warn", "--warn"];
const CLR = { stress: "#1f7a84", anxiety: "#c58a1d", depression: "#b8456f" };
const nm = k => t(NAME[k]), lv = l => t("level." + l);
const qs = () => t("q", { returnObjects: true }), ans4 = () => t("ans", { returnObjects: true });
function enc(l) { const a = t("quotes." + (l >= 3 ? "high" : l >= 1 ? "mid" : "low"), { returnObjects: true }); return a[Math.floor(Math.random() * a.length)] }
