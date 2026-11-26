/* ---------- Journal ---------- */
function vJournal() {
  const j = load("mp_journal", []);
  const mo = t("j.moods", { returnObjects: true });

  $("#main").innerHTML = `
    <div class="card card-body mb-3">
      <h2>${t("j.title")}</h2>
      <p class="text-body-secondary">${t("j.intro")}</p>
      <div class="mb-2 text-body-secondary" id="ml">${t("j.feel")}</div>
      <div class="d-flex flex-wrap gap-2 mb-3" role="group" aria-labelledby="ml">
          ${mo.map((m, i) => `
              <input type="radio" class="btn-check" name="mood" id="m${i}" value="${i}" autocomplete="off" ${i === 2 ? "checked" : ""}>
              <label class="btn btn-outline-secondary m-0" for="m${i}">${m}</label>
          `).join("")}
      </div>
      <button class="btn btn-outline-secondary mb-3 ms-0" id="pr">${t("j.prompt")}</button>
      <div class="mb-2"><label for="jt" class="text-body-secondary m-0">${t("j.mind")}</label></div>
      <textarea class="form-control mb-3" id="jt" placeholder="${t("j.ph")}"></textarea>
      <button class="btn btn-primary mt-2" id="js">${t("j.save")}</button>
    </div>
    <div class="card card-body mb-3">
      <h3>${t("j.past")}</h3>
      ${j.length
        ? j.slice().reverse().map(e => `
            <div class="entry">
              <small>${typeof e.m === "number" && mo[e.m] ? mo[e.m] + " · " : ""}${new Date(e.t).toLocaleString()}</small>
              <p style="margin:.3em 0;white-space:pre-wrap"></p>
              <button class="del" data-t="${e.t}">${t("j.del")}</button>
            </div>
          `).join("")
        : `<p class="text-body-secondary">${t("j.empty")}</p>`}
    </div>
  `;

  const ps = document.querySelectorAll(".entry p");
  j.slice().reverse().forEach((e, i) => ps[i].textContent = e.x);

  $("#pr").onclick = () => {
    const P = t("j.prompts", { returnObjects: true });
    $("#jt").placeholder = P[Math.floor(Math.random() * P.length)];
  };

  $("#js").onclick = () => {
    const x = $("#jt").value.trim();
    if (!x) return $("#jt").focus();
    j.push({
      t: Date.now(),
      x,
      m: +(document.querySelector("input[name=mood]:checked") || {}).value
    });
    save("mp_journal", j);
    vJournal();
  };

  document.querySelectorAll(".del").forEach(b => {
    b.onclick = () => {
      save("mp_journal", j.filter(e => String(e.t) !== b.dataset.t));
      vJournal();
    };
  });
}