// Check‑in view
function vCheck() {
  const m = $("#main");

  if (qi === 0 && !ans.length) {
    m.innerHTML = `
      <div class="card">
        <h2>How have you felt this past week?</h2>
        <p>21 short statements from the DASS-21, a validated scale for depression, anxiety and stress. It takes about 3 minutes and nothing is tied to your name.</p>
        <button class="btn primary" id="go">Start check-in</button>
        ${load("mp_draft", null) ? ' <button class="btn" id="rs">Resume where I stopped</button>' : ''}
      </div>`;
    $("#go").onclick = () => {
      save("mp_draft", null);
      qi = 1;
      vCheck();
    };
    const rs = $("#rs");
    if (rs) {
      rs.onclick = () => {
        const d = load("mp_draft", null);
        ans = d.ans;
        qi = Math.min(d.qi, 21);
        vCheck();
      };
    }
    return;
  }

  //show a question
  if (qi > 0 && qi <= 21) {
    m.innerHTML = `
      <div class="card">
        <div class="bar" role="progressbar" aria-valuenow="${qi - 1}" aria-valuemax="21">
          <i style="width:${(qi - 1) / 21 * 100}%"></i>
        </div>
        <p class="mute">Statement ${qi} of 21</p>
        <h2>${Q[qi - 1]}</h2>
        <div class="opts">
          ${ANS.map((t, i) => `<button class="opt" data-n="${i}">${t}</button>`).join("")}
        </div>
        ${qi > 1 ? '<button class="btn" id="back">Back</button>' : ''}
      </div>`;
    const hh = m.querySelector("h2");
    hh.tabIndex = -1;
    hh.focus({ preventScroll: true });
    m.querySelectorAll(".opt").forEach(b => {
      b.onclick = () => {
        ans[qi - 1] = +b.dataset.n;
        qi++;
        save("mp_draft", { ans, qi });
        if (qi > 21) finish();
        else vCheck();
      };
    });
    if (qi > 1) $("#back").onclick = () => { qi--; vCheck(); };
    return;
  }
}

function finish() {
  const r = score(ans),
        h = load("mp_hist", []);
  h.push({ t: Date.now(), ...r });
  save("mp_hist", h);
  save("mp_draft", null);
  showResult(r);
}

function showResult(r) {
  const hh = load("mp_hist", []),
        pv = hh[hh.length - 2];
  const lv = maxLv(r);
  $("#main").innerHTML = `
    <div class="card">
      <h2>Your results</h2>
      ${Object.keys(NAME).map(k => {
        const l = level(k, r[k]);
        return `<div class="meter">
          <div class="row">
            <span>${NAME[k]}</span>
            <span class="tag" style="color:var(${COL[l]})">${r[k]} · ${LV[l]}${pv ? ` ${r[k] > pv[k] ? "▲" : r[k] < pv[k] ? "▼" : "="}${Math.abs(r[k] - pv[k])}` : ""}</span>
          </div>
          <div class="bar"><i style="width:${Math.min(r[k] / 42 * 100, 100)}%;background:var(${COL[l]})"></i></div>
        </div>`;
      }).join("")}
      ${Object.keys(NAME).filter(k => level(k, r[k]) >= 2).map(k => `<p><b>${NAME[k]}:</b> ${TIP[k]}</p>`).join("")}
      ${lv >= 3 ? `<div class="note"><b>One or more scores are in the severe range.</b> Please consider talking to a counsellor, doctor or someone you trust soon.<br>${HELP}</div>` : ""}
    </div>
    <div class="card">
      <p class="quote" id="q">${enc(lv)}</p>
      <button class="btn" id="more">Another message</button>
    </div>
    <div class="card">
      <h3>Take a few minutes to unwind</h3>
      <button class="btn primary" id="r1">Open relaxation tools</button>
      <button class="btn" id="r2">See my trends</button>
    </div>`;
  $("#more").onclick = () => $("#q").textContent = enc(lv);
  $("#r1").onclick = () => go("relax");
  $("#r2").onclick = () => go("trends");
}
