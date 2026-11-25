/* ---------- Trends ---------- */
function insights(h) { return analyse(h).map(i => ({ c: i.c, txt: t("trend." + i.id, { name: i.k ? nm(i.k) : "", now: i.now, slope: i.slope }) + (i.severe ? t("trend.severe") : "") })) }
function vTrends() {
  const h = load("mp_hist", []);
  if (!h.length) {
    $("#main").innerHTML = `<div class="card card-body mb-3"><h2>${t("tr.none")}</h2><p>${t("tr.noneBody")}</p><button class="btn btn-primary" id="a">${t("home.now")}</button> <button class="btn btn-outline-secondary" id="d">${t("tr.sample")}</button></div>`;
    $("#a").onclick = () => go("checkin");
    $("#d").onclick = () => { const n = Date.now(), D = 864e5, v = [[10, 6, 8], [12, 8, 10], [14, 8, 12], [20, 12, 14], [28, 14, 18], [34, 18, 22], [22, 12, 16]]; save("mp_hist", v.map((x, i) => ({ t: n - (v.length - i) * 5 * D, stress: x[0], anxiety: x[1], depression: x[2] }))); vTrends() }; return
  }
  const ins = insights(h), K = Object.keys(NAME);
  $("#main").innerHTML = `<div class="card card-body mb-3"><h2>${t("tr.title")}</h2><div style="height:270px"><canvas id="ch" role="img" aria-label="${t("tr.alt")}"></canvas></div></div>
  <div class="card card-body mb-3"><h3>${t("tr.says")}</h3>${ins.map(i => `<p style="color:var(${i.c});margin:.4em 0">${i.txt}</p>`).join("")}</div>
  <div class="card card-body mb-3"><h3>${t("tr.hist")}</h3><div class="table-responsive"><table class="table table-sm align-middle"><tr><th>${t("tr.date")}</th>${K.map(k => `<th>${nm(k)}</th>`).join("")}</tr>${h.slice().reverse().map(e => `<tr><td>${new Date(e.t).toLocaleDateString()}</td>${K.map(k => `<td>${e[k]} <span class="text-body-secondary">${lv(level(k, e[k]))}</span></td>`).join("")}</tr>`).join("")}</table></div>
  <p><button class="btn btn-primary" id="pdf">${t("tr.pdf")}</button> <button class="btn btn-outline-secondary" id="cp">${t("tr.copy")}</button> <button class="btn btn-outline-secondary" id="clr">${t("tr.del")}</button></p><p class="text-body-secondary small">${t("tr.pdfWarn")}</p></div>`;
  /* Reused components: Chart.js draws the lines; the dashed line is the simple-statistics regression */
  const css = n => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
  if (window.Chart) {
    const ds = K.map(k => ({ label: nm(k), data: h.map(e => e[k]), borderColor: CLR[k], backgroundColor: CLR[k], tension: .3 })), fs = fit(h, "stress");
    if (fs) ds.push({ label: nm("stress") + " (" + t("tr.line") + ")", data: fs, borderColor: CLR.stress, borderDash: [6, 4], pointRadius: 0, borderWidth: 2 });
    const ch = new Chart($("#ch"), { type: "line", data: { labels: h.map(e => new Date(e.t).toLocaleDateString(undefined, { day: "numeric", month: "short" })), datasets: ds }, options: { maintainAspectRatio: false, scales: { y: { min: 0, max: 42, ticks: { color: css("--mute") }, grid: { color: css("--line") } }, x: { ticks: { color: css("--mute") }, grid: { display: false } } }, plugins: { legend: { labels: { color: css("--ink") } } } } }); stopFns.push(() => ch.destroy())
  }
  else $("#ch").parentNode.innerHTML = '<p class="text-body-secondary">Chart library failed to load. Check your connection.</p>';
  $("#pdf").onclick = makePdf;
  $("#cp").onclick = () => { const c = "date,stress,anxiety,depression\n" + h.map(e => [new Date(e.t).toISOString().slice(0, 10), e.stress, e.anxiety, e.depression].join(",")).join("\n"); (navigator.clipboard ? navigator.clipboard.writeText(c) : Promise.reject()).then(() => { $("#cp").textContent = t("tr.copied") }).catch(() => { $("#cp").insertAdjacentHTML("afterend", `<textarea class="form-control mt-2" readonly>${c}</textarea>`) }) };
  let sure = false; $("#clr").onclick = e => { if (sure) { save("mp_hist", []); vTrends() } else { sure = true; e.target.textContent = t("tr.delSure") } };
}
