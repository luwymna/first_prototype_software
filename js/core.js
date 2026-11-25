/* ---------- Views ---------- */
const VIEWS = { home: "Home", checkin: "Check-in", trends: "Trends", relax: "Relax", journal: "Journal" };
const IC = { home: "⌂", checkin: "✓", trends: "↗", relax: "❀", journal: "✎" };
let view = "home", qi = 0, ans = [], stopFns = [];
function go(v) { stopFns.forEach(f => f()); stopFns = []; view = v; qi = 0; ans = []; try { history.replaceState(null, "", "#" + v) } catch (e) { } render() }
function render() {
  $("#nav").innerHTML = Object.keys(VIEWS).map(k => `<button data-v="${k}" ${k === view ? 'aria-current="true"' : ''}>${t("nav." + k)}</button>`).join("");
  $("#nav").querySelectorAll("button").forEach(b => b.onclick = () => go(b.dataset.v));
  $("#main").dataset.view = view;
  ({ home: vHome, checkin: vCheck, trends: vTrends, relax: vRelax, journal: vJournal })[view]();
}
