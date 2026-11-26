function vHome() {
  const h = load("mp_hist", []),
        l = h[h.length - 1],
        pv = h[h.length - 2],
        days = l ? Math.floor((Date.now() - l.t) / 864e5) : 0,
        due = !l || days >= 7;

  const when = days === 0 ? t("home.today") : t("home.ago", { count: days });

  const top = !l 
    ? `<h2>${t("home.welcomeTitle")}</h2>
       <p>${t("home.welcomeBody")}</p>
       <button class="btn btn-primary btn-lg px-4" data-g="checkin">${t("home.first")}</button>`
    : `<h2>${due ? t("home.due") : t("home.ok")}</h2>
       <p class="text-body-secondary">
         ${when} ${due ? t("home.dueHint") : t("home.next", { count: 7 - days })}
       </p>
       <div class="scores">
         ${Object.keys(NAME).map(k => {
           const v = level(k, l[k]),
                 d = pv ? l[k] - pv[k] : 0;
           return `<div>
                     <span class="text-body-secondary">${nm(k)}</span>
                     <div class="big">
                       ${l[k]} 
                       <small style="font-size:.85rem;color:var(${d > 0 ? "--warn" : d < 0 ? "--ok" : "--mute"})">
                         ${pv && d ? (d > 0 ? "▲" : "▼") + Math.abs(d) : ""}
                       </small>
                     </div>
                     <span class="tag" style="color:var(${COL[v]})">${lv(v)}</span>
                   </div>`;
         }).join("")}
       </div>
       <p><button class="btn btn-primary btn-lg px-4" data-g="checkin">${t("home.now")}</button></p>`;

  $("#main").innerHTML = `
    <section class="hero text-center">${top}</section>
    
    <h3 class="text-center mt-4 mb-3">${t("home.quick")}</h3>
    
    <div class="tiles">
      ${[
        ["relax", "home.toRelax"], 
        ["journal", "home.toJournal"], 
        ["trends", "home.toTrends"]
      ].map(([g, k]) => `
        <button class="tile" data-g="${g}">
          ${t(k)}
          <span aria-hidden="true">›</span>
        </button>
      `).join("")}
    </div>
    
    <section class="band">
      <p class="quote">${enc(l ? maxLv(l) : 0)}</p>
    </section>
    
    <div class="alert alert-warning">${t("help")}</div>
  `;

  document.querySelectorAll("[data-g]").forEach(b => {
    b.onclick = () => go(b.dataset.g);
  });
}