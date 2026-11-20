const VIEWS = {
  home: "Home",
  checkin: "Check-in",
  trends: "Trends",
  relax: "Relax",
  journal: "Journal"
};

const IC = {
  home: "⌂",
  checkin: "✓",
  trends: "↗",
  relax: "❀",
  journal: "✎"
};

//tips
const TIP = {
  stress: "Break big tasks into 25‑minute blocks with 5‑minute rests, and protect your sleep.",
  anxiety: "Try slow breathing for a few minutes, and limit caffeine late in the day.",
  depression: "Small steps count: get daylight, move a little, and tell someone how you’re really doing."
};

const HELP = `
  <b>Need to talk to someone?</b> In Malaysia, Befrienders KL is on 03‑7627 2929 and Talian Kasih on 15999, or visit your university counselling centre. Elsewhere, contact your local crisis service.
`;

let view = "home",
    qi = 0,
    ans = [],
    stopFns = [];

/**go to a different view*/
function go(v) {
  stopFns.forEach(f => f());
  stopFns = [];
  view = v;
  qi = 0;
  ans = [];
  try {
    history.replaceState(null, "", "#" + v);
  } catch (e) {
    //ignore history error
  }
  render();
}

/** Render navigation and current view */
function render() {
  //populate navigation bar
  $("#nav").innerHTML = Object.keys(VIEWS)
    .map(k => `
      <button data-v="${k}" ${k === view ? 'aria-current="true"' : ''}>
        <span aria-hidden="true">${IC[k]}</span>${VIEWS[k]}
      </button>`)
    .join("");

  // Attach click listeners for navigation
  $("#nav").querySelectorAll("button").forEach(b => {
    b.onclick = () => go(b.dataset.v);
  });

  // Render the selected view component
  const viewMap = {
    home: vHome,
    checkin: vCheck,
    trends: vTrends,
    relax: vRelax,
    journal: vJournal
  };
  viewMap[view]();
}
