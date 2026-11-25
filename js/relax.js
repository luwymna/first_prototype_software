/* ---------- Relax ---------- */
function vRelax() {
  $("#main").innerHTML = `<div class="d-grid gap-3" style="grid-template-columns:repeat(auto-fit,minmax(260px,1fr))">
  <div class="card card-body mb-3"><h3>${t("rx.breath")}</h3><div class="breath"><div id="orb"><span id="ph">${t("rx.ready")}</span></div></div><select id="bp" class="form-select w-auto d-inline-block" aria-label="${t("rx.patLabel")}"><option value="478">${t("rx.p478")}</option><option value="box">${t("rx.box")}</option></select> <button class="btn btn-primary" id="bs">${t("rx.start")}</button></div>
  <div class="card card-body mb-3"><h3>${t("rx.sounds")}</h3><p class="text-body-secondary">${t("rx.soundsDesc")}</p><div class="d-grid gap-2 my-3" id="snd"></div><label class="text-body-secondary">${t("rx.vol")}<input type="range" class="form-range" id="vol" min="0" max="100" value="40"></label></div></div>
  <div class="card card-body mb-3"><h3>${t("rx.bubble")} <span class="text-body-secondary">${t("rx.bubbleHint")}</span></h3><div id="arena" role="group" aria-label="${t("rx.area")}"></div><span id="sc" class="text-body-secondary">${t("rx.pops", { n: 0 })}</span> <button class="btn btn-outline-secondary" id="gs">${t("rx.start")}</button></div>
  <div class="card card-body mb-3"><h3>${t("rx.more")}</h3><button class="btn btn-outline-secondary" data-m="mem">${t("rx.mem")}</button> <button class="btn btn-outline-secondary" data-m="rip">${t("rx.rip")}</button><div id="ga" style="margin-top:12px"></div></div>
  <div class="card card-body mb-3"><p class="quote" id="q">${enc(0)}</p><button class="btn btn-outline-secondary" id="more">${t("rx.newMsg")}</button></div>`;
  $("#more").onclick = () => { const h = load("mp_hist", []); $("#q").textContent = enc(h.length ? maxLv(h[h.length - 1]) : 0) };
  breathing(); sounds(); game(); minis();
}
function breathing() {
  const PAT = { "478": [["in", 4], ["hold", 7], ["out", 8]], box: [["in", 4], ["hold", 4], ["out", 4], ["hold", 4]] }; let P = PAT["478"], on = false, T, i = 0, c = 0;
  const orb = $("#orb"), ph = $("#ph"), btn = $("#bs");
  function stop() { on = false; clearTimeout(T); orb.style.transitionDuration = "1s"; orb.style.transform = "scale(.6)"; ph.textContent = t("rx.ready"); btn.textContent = t("rx.start") }
  function step() {
    if (!on) return; const [n, s, sc] = P[i]; c = s; if (n === "in" || n === "out") { orb.style.transitionDuration = s + "s"; orb.style.transform = `scale(${n === "in" ? 1.5 : .6})` }
    (function tick() { if (!on) return; ph.innerHTML = t("rx." + n) + "<br>" + c; if (c-- > 0) T = setTimeout(tick, 1000); else { i = (i + 1) % P.length; step() } })()
  }
  btn.onclick = () => { if (on) stop(); else { P = PAT[$("#bp").value]; on = true; i = 0; btn.textContent = t("rx.stop"); step() } };
  stopFns.push(stop);
}
/* Reused components: Tone.js plays the recordings (data/sounds.js) and generates white noise */
function sounds() {
  const box = $("#snd"), types = {};
  (typeof SOUND_FILES !== "undefined" ? SOUND_FILES : []).forEach(f => types[(i18next.language === "ms" && f.ms) || f.name] = "file:" + f.file); types[t("rx.white")] = "white";
  if (!window.Tone) { box.innerHTML = '<p class="text-body-secondary">Audio library failed to load. Check your connection.</p>'; return }
  let cur = null, nodes = []; const add = n => (nodes.push(n), n), db = v => Tone.gainToDb(Math.max(v / 100, .001));
  function stop() { nodes.forEach(n => { try { n.stop && n.stop(); n.dispose() } catch (e) { } }); nodes = []; cur = null; draw() }
  async function play(t) {
    stop(); await Tone.start(); Tone.Destination.volume.value = db($("#vol").value); cur = t;
    if (t === "white") { const n = add(new Tone.Noise("white")), f = add(new Tone.Filter(9000, "lowpass")); n.volume.value = -24; n.chain(f, Tone.Destination); n.start() }
    else add(new Tone.Player({ url: t.slice(5), loop: true, autostart: true, fadeIn: 1, fadeOut: 1 }).toDestination());
    draw()
  }
  function draw() {
    box.innerHTML = Object.keys(types).map(k => `<button class="opt btn btn-outline-primary text-start" data-t="${types[k]}" aria-pressed="${cur === types[k]}">${cur === types[k] ? "■ " + t("rx.stop") + " " : "▶ "}${k}</button>`).join("");
    box.querySelectorAll("button").forEach(b => b.onclick = () => cur === b.dataset.t ? stop() : play(b.dataset.t))
  }
  $("#vol").oninput = e => { Tone.Destination.volume.value = db(e.target.value) };
  draw(); stopFns.push(stop);
}
function game() {
  let tm, sp, left = 0, pops = 0; const ar = $("#arena"), b = $("#gs");
  function end() { clearInterval(tm); clearInterval(sp); b.textContent = t("rx.start"); if (left <= 0 && pops) $("#sc").textContent = t("rx.nice", { n: pops }) }
  b.onclick = () => {
    if (tm) { left = 0; end(); tm = null; return }
    pops = 0; left = 30; ar.innerHTML = ""; $("#sc").textContent = t("rx.popsTime", { n: 0, s: 30 }); b.textContent = t("rx.stop");
    sp = setInterval(() => {
      const s = 30 + Math.random() * 40, e = document.createElement("div"); e.className = "bub"; e.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * (ar.clientWidth - s)}px;animation-duration:${4 + Math.random() * 3}s`;
      e.onclick = () => { e.remove(); pops++; $("#sc").textContent = t("rx.popsTime", { n: pops, s: left }) }; e.onanimationend = () => e.remove(); ar.appendChild(e)
    }, 650);
    tm = setInterval(() => { left--; $("#sc").textContent = t("rx.popsTime", { n: pops, s: left }); if (left <= 0) { end(); tm = null; ar.innerHTML = "" } }, 1000)
  };
  stopFns.push(() => { clearInterval(tm); clearInterval(sp) });
}

function minis() {
  const ga = $("#ga"); let raf; stopFns.push(() => cancelAnimationFrame(raf));
  const G = {
    mem() {
      const E = ["🌲", "🌊", "🦉", "🦋", "🌸", "🐢"], d = [...E, ...E].sort(() => Math.random() - .5); let open = [], done = 0, mv = 0;
      ga.innerHTML = `<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:360px">${d.map((e, i) => `<button class="opt btn btn-outline-primary text-start" data-i="${i}" style="font-size:1.8rem;text-align:center;height:64px;padding:0" aria-label="${t("rx.card", { n: i + 1 })}">?</button>`).join("")}</div><p class="text-body-secondary" id="mm">${t("rx.memHelp", { n: 0 })}</p>`;
      ga.querySelectorAll("[data-i]").forEach(b => b.onclick = () => {
        if (open.length > 1 || b.disabled || open.includes(b)) return; b.textContent = d[+b.dataset.i]; open.push(b);
        if (open.length === 2) {
          mv++; const [a, c] = open; if (a.textContent === c.textContent) { a.disabled = c.disabled = true; done++; open = [] } else setTimeout(() => { a.textContent = c.textContent = "?"; open = [] }, 700);
          $("#mm").textContent = done === 6 ? t("rx.memDone", { n: mv }) : t("rx.memHelp", { n: mv })
        }
      })
    },
    rip() {
      ga.innerHTML = `<canvas id="cv" style="width:100%;height:230px;background:var(--soft);border-radius:12px;touch-action:none"></canvas><p class="text-body-secondary">${t("rx.ripHelp")}</p>`;
      const c = $("#cv"), x = c.getContext("2d"), R = [], col = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#1f7a84"; c.width = c.clientWidth * 2; c.height = 460;
      const add = e => { const r = c.getBoundingClientRect(); R.push({ x: (e.clientX - r.left) * c.width / r.width, y: (e.clientY - r.top) * c.height / r.height, r: 4, a: .8 }) };
      c.onpointerdown = add; c.onpointermove = e => { if (e.buttons && Math.random() < .3) add(e) };
      (function f() { x.clearRect(0, 0, c.width, c.height); x.strokeStyle = col; x.lineWidth = 3; for (let i = R.length - 1; i >= 0; i--) { const o = R[i]; o.r += 2.2; o.a -= .007; if (o.a <= 0) { R.splice(i, 1); continue } x.globalAlpha = o.a; x.beginPath(); x.arc(o.x, o.y, o.r, 0, 7); x.stroke() } raf = requestAnimationFrame(f) })()
    }
  };
  document.querySelectorAll("[data-m]").forEach(b => b.onclick = () => { cancelAnimationFrame(raf); G[b.dataset.m]() });
}
