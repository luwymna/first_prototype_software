function vCheck() {
  const m = $("#main");
  if (qi === 0 && !ans.length) {
    m.innerHTML = `<div class="card card-body mb-3"><h2>${t("ci.title")}</h2><p>${t("ci.body")}</p><button class="btn btn-primary" id="go">${t("ci.start")}</button>${load("mp_draft", null) ? ` <button class="btn btn-outline-secondary" id="rs">${t("ci.resume")}</button>` : ''}</div>`;
    $("#go").onclick = () => { save("mp_draft", null); qi = 1; vCheck() }; const rs = $("#rs"); if (rs) rs.onclick = () => { const d = load("mp_draft", null); ans = d.ans; qi = Math.min(d.qi, 21); vCheck() }; return
  }
  if (qi > 0 && qi <= 21) {
    m.innerHTML = `<div class="card card-body mb-3"><div class="progress" role="progressbar" aria-valuenow="${qi - 1}" aria-valuemax="21"><div class="progress-bar" style="width:${(qi - 1) / 21 * 100}%"></div></div><p class="text-body-secondary">${t("ci.stmt", { n: qi })}</p><h2>${qs()[qi - 1]}</h2><div class="d-grid gap-2 my-3">${ans4().map((x, i) => `<button class="opt btn btn-outline-primary text-start" data-n="${i}">${x}</button>`).join("")}</div>${qi > 1 ? `<button class="btn btn-outline-secondary" id="back">${t("ci.back")}</button>` : ''}</div>`;
    const hh = m.querySelector("h2"); hh.tabIndex = -1; hh.focus({ preventScroll: true }); m.querySelectorAll(".opt").forEach(b => b.onclick = () => { ans[qi - 1] = +b.dataset.n; qi++; save("mp_draft", { ans, qi }); if (qi > 21) finish(); else vCheck() });
    if (qi > 1) $("#back").onclick = () => { qi--; vCheck() }; return
  }
}
function finish() {
  const r = score(ans), h = load("mp_hist", []);
  h.push({ t: Date.now(), ...r }); save("mp_hist", h); save("mp_draft", null); showResult(r);
}
function showResult(r) {
  const hh = load("mp_hist", []), pv = hh[hh.length - 2];
  const lv = maxLv(r);
  $("#main").innerHTML = `<div class="card card-body mb-3"><h2>${t("res.title")}</h2>${Object.keys(NAME).map(k => { const l = level(k, r[k]); return `<div class="meter"><div class="d-flex justify-content-between fw-semibold"><span>${nm(k)}</span><span class="tag" style="color:var(${COL[l]})">${r[k]} · ${lv(l)}${pv ? ` ${r[k] > pv[k] ? "▲" : r[k] < pv[k] ? "▼" : "="}${Math.abs(r[k] - pv[k])}` : ""}</span></div><div class="progress mt-1" style="height:14px"><div class="progress-bar" style="width:${Math.min(r[k] / 42 * 100, 100)}%;background:var(${COL[l]})"></div></div></div>` }).join("")}
  ${Object.keys(NAME).filter(k => level(k, r[k]) >= 2).map(k => `<p><b>${nm(k)}:</b> ${t("tip." + k)}</p>`).join("")}${lv >= 3 ? `<div class="alert alert-warning"><b>${t("res.severe")}</b> ${t("res.severe2")} <br>${t("help")}</div>` : ""}</div>
  <div class="card card-body mb-3"><p class="quote" id="q">${enc(lv)}</p><button class="btn btn-outline-secondary" id="more">${t("res.another")}</button></div>
  <div class="card card-body mb-3"><h3>${t("res.unwind")}</h3><button class="btn btn-primary" id="r1">${t("res.openRelax")}</button> <button class="btn btn-outline-secondary" id="r2">${t("res.seeTrends")}</button></div>`;
  $("#more").onclick = () => $("#q").textContent = enc(lv);
  $("#r1").onclick = () => go("relax"); $("#r2").onclick = () => go("trends");
}
