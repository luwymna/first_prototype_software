/* Pure logic, no DOM. Used by the app and by the Vitest tests.
   Reused component: simple-statistics (linear regression, mean, standard deviation). */
var _ss = typeof ss !== "undefined" ? ss : require("simple-statistics");
const SCALES = { stress: [1, 6, 8, 11, 12, 14, 18], anxiety: [2, 4, 7, 9, 15, 19, 20], depression: [3, 5, 10, 13, 16, 17, 21] };
const CUT = { depression: [9, 13, 20, 27], anxiety: [7, 9, 14, 19], stress: [14, 18, 25, 33] };
const NAME = { stress: "scale.stress", anxiety: "scale.anxiety", depression: "scale.depression" };
/* Trend thresholds are project assumptions, not clinical standards. Document them in the SDD. */
const TREND = { slope: 2, r2: .5, jump: 8, window: 6 };
function level(k, s) { const c = CUT[k]; let i = 0; while (i < 4 && s > c[i]) i++; return i }
function score(a) { const r = {}; for (const k in SCALES) r[k] = SCALES[k].reduce((t, n) => t + a[n - 1], 0) * 2; return r }
function maxLv(r) { return Math.max(...Object.keys(NAME).map(k => level(k, r[k]))) }
function _reg(h, k) { const w = h.slice(-TREND.window), pts = w.map((e, i) => [i, e[k]]), m = _ss.linearRegression(pts), ln = _ss.linearRegressionLine(m); return { slope: m.m, r2: _ss.rSquared(pts, ln) || 0, line: ln, w } }
function analyse(h) {
  if (h.length < 3) return [{ id: "needMore", c: "--mute" }];
  const out = [];
  for (const k in NAME) {
    const g = _reg(h, k), now = h[h.length - 1][k], before = h[h.length - 2][k]; let id = "steady", c = "--mute";
    if (now - before >= TREND.jump) { id = "spike"; c = "--warn" }
    else if (g.slope >= TREND.slope && g.r2 >= TREND.r2) { id = "rising"; c = "--warn" }
    else if (g.slope <= -TREND.slope && g.r2 >= TREND.r2) { id = "easing"; c = "--ok" }
    out.push({ id, k, c, now, slope: Math.abs(g.slope).toFixed(1), severe: level(k, now) >= 3 });
  }
  return out;
}
function fit(h, k) { if (h.length < 3) return null; const g = _reg(h, k), off = h.length - g.w.length; return h.map((_, i) => i < off ? null : +g.line(i - off).toFixed(1)) }
if (typeof module !== "undefined") module.exports = { SCALES, CUT, NAME, TREND, level, score, maxLv, analyse, fit };
