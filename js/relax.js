/* ============================================================
   RELAX MODULE
   Mindful breathing, ambient sounds, bubble-popping game,
   and mini-activities (memory match, ripple canvas).
   ============================================================ */

/* ---------- View ---------- */
function vRelax() {
  $("#main").innerHTML = `
  <!-- ROW 1: BREATHING + SOUNDS -->
  <div class="d-grid gap-3 mb-3" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr))">

    <!-- GUIDED BREATHING -->
    <div class="card card-body h-100 d-flex flex-column">
        <h3 class="mb-4">${t("rx.breath")}</h3>

        <div class="breath-module d-flex flex-column align-items-center justify-content-center flex-grow-1 p-4" style="background: var(--bs-body-bg); border-radius: 20px; border: 1px solid var(--line);">
            <div class="breath"><div id="orb"><span id="ph">${t("rx.ready")}</span></div></div>

            <div class="d-flex gap-2 mt-4 w-100 justify-content-center flex-nowrap align-items-center">
                <div class="dropdown">
                    <button class="btn btn-outline-secondary dropdown-toggle" type="button" id="bpBtn" data-bs-toggle="dropdown" aria-expanded="false">
                        <span id="bpText">${t("rx.p478")}</span>
                    </button>
                    <ul class="dropdown-menu">
                        <li><button class="dropdown-item active" data-val="478">${t("rx.p478")}</button></li>
                        <li><button class="dropdown-item" data-val="box">${t("rx.box")}</button></li>
                    </ul>
                </div>
                <button class="btn btn-primary px-4 text-nowrap" id="bs">${t("rx.start")}</button>
            </div>
        </div>
    </div>

    <!-- CALMING SOUNDS -->
    <div class="card card-body h-100">
        <h3 class="mb-1">${t("rx.sounds")}</h3>
        <p class="text-body-secondary small mb-4">${t("rx.soundsDesc")}</p>
        <div class="sound-grid" id="snd"></div>
        <div class="volume">
            <span class="volume-label">${t("rx.vol")}</span>
            <input type="range" class="vol-range" id="vol" min="0" max="100" value="40" aria-label="${t("rx.vol")}">
            <output class="volume-val" id="volv" for="vol">40%</output>
        </div>
        <p id="sndmsg" class="small mt-3 mb-0" role="status" style="color:var(--warn)"></p>
    </div>

  </div>

  <!-- ROW 2: GAMES -->
  <div class="d-grid gap-3 mb-3" style="grid-template-columns:repeat(auto-fit,minmax(340px,1fr))">

    <!-- BUBBLE POP -->
    <div class="card card-body h-100">
        <h3 class="mb-1">${t("rx.bubble")}</h3>
        <p class="text-body-secondary small mb-3">${t("rx.bubbleHint")}</p>
        <div id="arena" role="group" aria-label="${t("rx.area")}"></div>
        <div class="d-flex justify-content-between align-items-center mt-3">
            <span id="sc" class="text-body-secondary fw-bold">${t("rx.pops", { n: 0 })}</span>
            <button class="btn btn-primary px-4" id="gs">${t("rx.start")}</button>
        </div>
    </div>

    <!-- MORE GAMES -->
    <div class="card card-body h-100">
        <h3>${t("rx.more")}</h3>
        <div class="d-flex flex-wrap gap-2 mt-3 mb-2">
            <button class="btn btn-outline-secondary flex-fill" data-m="mem">${t("rx.mem")}</button>
            <button class="btn btn-outline-secondary flex-fill" data-m="rip">${t("rx.rip")}</button>
        </div>
        <div id="ga" class="d-none mt-3"></div>
    </div>

  </div>

  <!-- QUOTE -->
  <div class="card card-body text-center mx-auto mb-3" style="max-width: 720px;">
      <p class="quote mb-4 fs-4 mt-2" id="q">${enc(0)}</p>
      <div>
          <button class="btn btn-outline-secondary" id="more">${t("rx.newMsg")}</button>
      </div>
  </div>`;

  $("#more").onclick = () => { const h = load("mp_hist", []); $("#q").textContent = enc(h.length ? maxLv(h[h.length - 1]) : 0) };
  breathing(); sounds(); game(); minis();
}

/* ---------- Breathing ---------- */
function breathing() {
  const PAT = {
    "478": [["in", 4], ["hold", 7], ["out", 8]],
    box:   [["in", 4], ["hold", 4], ["out", 4], ["hold", 4]],
  };

  let P = PAT["478"],
      on = false,
      T,
      i = 0,
      c = 0;

  const orb = $("#orb"),
        ph  = $("#ph"),
        btn = $("#bs");

  function stop() {
    on = false;
    clearTimeout(T);
    orb.style.transitionDuration = "1s";
    orb.style.transform = "scale(.6)";
    ph.textContent = t("rx.ready");
    btn.textContent = t("rx.start");
  }

  function step() {
    if (!on) return;
    const [n, s, sc] = P[i];
    c = s;
    if (n === "in" || n === "out") {
      orb.style.transitionDuration = s + "s";
      orb.style.transform = `scale(${n === "in" ? 1.5 : .6})`;
    }
    (function tick() {
      if (!on) return;
      ph.innerHTML = t("rx." + n) + "<br>" + c;
      if (c-- > 0) T = setTimeout(tick, 1000);
      else { i = (i + 1) % P.length; step(); }
    })();
  }

  // Find this part inside breathing():
  btn.onclick = () => {
    if (on) stop();
    else {
      // CHANGE THIS LINE:
      // P = PAT[$("#bp").value]; 
      
      // TO THIS:
      const selectedVal = document.querySelector("#bpBtn").dataset.val || "478";
      P = PAT[selectedVal];
      
      on = true;
      i = 0;
      btn.textContent = t("rx.stop");
      step();
    }
  };

    // Add this to make the dropdown items work
  document.querySelectorAll(".dropdown-menu [data-val]").forEach(item => {
    item.onclick = (e) => {
      e.preventDefault();
      // Update the text on the button
      $("#bpText").textContent = item.textContent;
      // Save the value (478 or box) to the button so JS can read it
      $("#bpBtn").dataset.val = item.dataset.val;
      // Update active styling
      document.querySelectorAll(".dropdown-menu [data-val]").forEach(i => i.classList.remove("active"));
      item.classList.add("active");
    };
  });

  stopFns.push(stop);
}

/* ---------- Sounds ---------- */
/* Reused components: Tone.js plays the recordings (data/sounds.js)
   and generates white noise. */
function sounds() {
  const box = $("#snd"),
        types = {};

  (typeof SOUND_FILES !== "undefined" ? SOUND_FILES : []).forEach(f => {
    types[(i18next.language === "ms" && f.ms) || f.name] = "file:" + f.file;
  });
  types[t("rx.white")] = "white";

  if (!window.Tone) {
    box.innerHTML = `<p class="text-body-secondary">${t("snd.lib")}</p>`;
    return;
  }

  let cur = null,
      nodes = [];

  const add = n => (nodes.push(n), n);
  const db  = v => Tone.gainToDb(Math.max(v / 100, .001));

  function stop() {
    nodes.forEach(n => {
      try { n.stop && n.stop(); n.dispose(); } catch (e) {}
    });
    nodes = [];
    cur = null;
    draw();
  }

  function fail() { stop(); const m = $("#sndmsg"); if (m) m.textContent = t("snd.fail"); }

  async function play(kind) {
    stop();
    const m = $("#sndmsg"); if (m) m.textContent = "";
    try {
      await Tone.start();
      Tone.Destination.volume.value = db($("#vol").value);
      cur = kind;
      if (kind === "white") {
        const n = add(new Tone.Noise("white")), f = add(new Tone.Filter(9000, "lowpass"));
        n.volume.value = -24; n.chain(f, Tone.Destination); n.start();
      } else {
        add(new Tone.Player({ url: kind.slice(5), loop: true, autostart: true, fadeIn: 1, fadeOut: 1, onerror: fail }).toDestination());
      }
      draw();
    } catch (e) { fail(); }
  }

  function draw() {
    box.innerHTML = Object.keys(types)
      .map(k => `<button class="sound" data-t="${types[k]}" aria-pressed="${cur === types[k]}"><span class="sound-ic" aria-hidden="true">${cur === types[k] ? "■" : "▶"}</span><span>${k}</span></button>`)
      .join("");

    box.querySelectorAll("button").forEach(b => {
      b.onclick = () => (cur === b.dataset.t ? stop() : play(b.dataset.t));
    });
  }

  const vol = $("#vol"), volv = $("#volv");
  const paint = () => { vol.style.setProperty("--v", vol.value + "%"); volv.textContent = vol.value + "%"; };
  vol.oninput = e => { paint(); Tone.Destination.volume.value = db(e.target.value); };
  paint();

  draw();
  stopFns.push(stop);
}

/* ---------- Bubble game ---------- */
function game() {
  let tm,
      sp,
      left = 0,
      pops = 0;

  const ar = $("#arena"),
        b  = $("#gs");

  function end() {
    clearInterval(tm);
    clearInterval(sp);
    b.textContent = t("rx.start");
    if (left <= 0 && pops) $("#sc").textContent = t("rx.nice", { n: pops });
  }

  b.onclick = () => {
    if (tm) {
      left = 0;
      end();
      tm = null;
      return;
    }

    pops = 0;
    left = 30;
    ar.innerHTML = "";
    $("#sc").textContent = t("rx.popsTime", { n: 0, s: 30 });
    b.textContent = t("rx.stop");

    sp = setInterval(() => {
      const s = 30 + Math.random() * 40,
            e = document.createElement("div");

      e.className = "bub";
      e.style.cssText = `width:${s}px;height:${s}px;left:${Math.random() * (ar.clientWidth - s)}px;animation-duration:${4 + Math.random() * 3}s`;

      e.onclick = () => {
        e.remove();
        pops++;
        $("#sc").textContent = t("rx.popsTime", { n: pops, s: left });
      };
      e.onanimationend = () => e.remove();

      ar.appendChild(e);
    }, 650);

    tm = setInterval(() => {
      left--;
      $("#sc").textContent = t("rx.popsTime", { n: pops, s: left });
      if (left <= 0) {
        end();
        tm = null;
        ar.innerHTML = "";
      }
    }, 1000);
  };

  stopFns.push(() => {
    clearInterval(tm);
    clearInterval(sp);
  });
}

/* ---------- Mini activities ---------- */
function minis() {
  const ga = $("#ga");
  let raf;

  stopFns.push(() => cancelAnimationFrame(raf));

  const G = {
    mem() {
      const E = ["🌲", "🌊", "🦉", "🦋", "🌸", "🐢"],
            d = [...E, ...E].sort(() => Math.random() - .5);

      let open = [],
          done = 0,
          mv = 0;

      ga.innerHTML = `
        <div class="memory-grid">
          ${d.map((e, i) => `<button class="memory-card" data-i="${i}" aria-label="${t("rx.card", { n: i + 1 })}">?</button>`).join("")}
        </div>
        <p class="text-body-secondary mt-3 mb-0" id="mm">${t("rx.memHelp", { n: 0 })}</p>`;

      ga.querySelectorAll("[data-i]").forEach(b => {
        b.onclick = () => {
          if (open.length > 1 || b.disabled || open.includes(b)) return;
          b.textContent = d[+b.dataset.i];
          b.classList.add("flipped");
          open.push(b);
          if (open.length === 2) {
            mv++;
            const [a, c] = open;
            if (a.textContent === c.textContent) {
              a.disabled = c.disabled = true;
              a.classList.add("matched"); c.classList.add("matched");
              done++;
              open = [];
            } else {
              setTimeout(() => {
                a.textContent = c.textContent = "?";
                a.classList.remove("flipped"); c.classList.remove("flipped");
                open = [];
              }, 700);
            }
            $("#mm").textContent = done === 6 ? t("rx.memDone", { n: mv }) : t("rx.memHelp", { n: mv });
          }
        };
      });
    },

    rip() {
      ga.innerHTML = `
        <canvas id="cv" style="width:100%;height:230px;background:var(--soft);border-radius:12px;touch-action:none"></canvas>
        <p class="text-body-secondary">${t("rx.ripHelp")}</p>`;

      const c = $("#cv"),
            x = c.getContext("2d"),
            R = [],
            col = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#1f7a84";

      c.width  = c.clientWidth * 2;
      c.height = 460;

      const add = e => {
        const r = c.getBoundingClientRect();
        R.push({
          x: (e.clientX - r.left) * c.width / r.width,
          y: (e.clientY - r.top)  * c.height / r.height,
          r: 4,
          a: .8,
        });
      };

      c.onpointerdown = add;
      c.onpointermove = e => {
        if (e.buttons && Math.random() < .3) add(e);
      };

      (function f() {
        x.clearRect(0, 0, c.width, c.height);
        x.strokeStyle = col;
        x.lineWidth = 3;

        for (let i = R.length - 1; i >= 0; i--) {
          const o = R[i];
          o.r += 2.2;
          o.a -= .007;
          if (o.a <= 0) { R.splice(i, 1); continue; }
          x.globalAlpha = o.a;
          x.beginPath();
          x.arc(o.x, o.y, o.r, 0, 7);
          x.stroke();
        }
        raf = requestAnimationFrame(f);
      })();
    },
  };

  document.querySelectorAll("[data-m]").forEach(b => {
    b.onclick = () => {
      cancelAnimationFrame(raf);
      // Remove the hidden class so the game becomes visible
      ga.classList.remove("d-none"); 
      G[b.dataset.m]();
    };
  });
}