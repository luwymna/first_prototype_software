# MindPulse

An anonymous web app that allow undergraduate students to check their stress, anxiety and depression with DASS-21, track their scores over time and relax straight afterwards. Built by Group Alif using reuse-oriented software engineering.

Everything runs in the browser. Results, history and journal entries stay on the student's own device and are never sent to a server. MindPulse is a self-check, not a diagnosis.

## Run it
- Open `index.html` in a browser or use the folder with any static server (for example `python -m http.server 8000`).
- Deploy as a static site (for example on Vercel). No build step is needed.
- The libraries load from the internet, so a connection is required unless you copy them into a local folder.

## Features
Check-in (DASS-21), scoring and severity, history, trend analysis, guided breathing, calming sounds, mini-games, private journal, words of encouragement, home dashboard, support information, English and Bahasa Melayu, and a PDF report.

## Project structure
```
index.html          page structure and library links
css/style.css       brand colours and layout (Bootstrap underneath)
js/storage.js       saving and loading data (store2)
js/i18n.js          language switching (i18next)
js/logic.js         DASS scoring and trend rules (no DOM, also used by tests)
js/dass.js          small helpers for names, levels, messages
js/core.js          navigation and page switching
js/checkin.js       questionnaire and results
js/trends.js        trend chart, insights, history table
js/report.js        PDF report (jsPDF)
js/relax.js         breathing, sounds, games
js/journal.js       journal
js/home.js          home dashboard
js/main.js          startup, theme, language menu
locales/en.js, ms.js   all interface text and the DASS items
data/sounds.js      list of sound recordings
assets/audio/       the recordings (MP3)
tests/              Vitest unit tests
a11y/               axe-core accessibility scan
```

## Reuse record

### 1. Reused libraries (third-party components)
| Library | Version | Licence | Used for | File |
|---|---|---|---|---|
| Bootstrap (CSS) | 5.3.3 | MIT | Grid, cards, buttons, forms, tables, progress bars, alerts, light and dark mode | `index.html`, all views |
| Bootstrap (JS bundle) | 5.3.3 | MIT | Dropdown menus (language, breathing pattern) | `index.html` |
| Chart.js | 4.4.1 | MIT | Trend line chart | `js/trends.js` |
| simple-statistics | 7.8.3 | ISC | Linear regression for trend detection and the dashed trend line | `js/logic.js` |
| i18next | 23.11.5 | MIT | English and Bahasa Melayu switching, plurals, filled-in values | `js/i18n.js`, `locales/` |
| jsPDF | 2.5.1 | MIT | PDF report built in the browser | `js/report.js` |
| Tone.js | 14.8.49 | MIT | Plays the recordings and generates white noise | `js/relax.js` |
| store2 | 2.14.2 | MIT | Saves history, journal, language and theme in the browser | `js/storage.js` |

### 2. Reused development tools (not shipped to users)
| Tool | Used for | File |
|---|---|---|
| Vitest | Unit tests of scoring, trends, language files and sound files | `tests/` |
| axe-core | Accessibility scanning | `a11y/` |
| Playwright | Opens a real browser for the accessibility scan | `a11y/` |

### 3. Reused content and assets
| Item | Source | Used in |
|---|---|---|
| DASS-21 (English) | Lovibond & Lovibond (1995): items, scale groupings, severity cut-offs | `locales/en.js`, `js/logic.js` |
| DASS-21 (Bahasa Malaysia) | Malay version supplied by the team (Musa et al.) | `locales/ms.js` |
| Sound recordings | Freesound: InspectorJ (night wildlife, seaside waves), innorecords (rain and rainforest) | `assets/audio/` |
| Typeface | Google Fonts (Figtree) | `index.html` |

### 4. Reused techniques and concepts
- 4-7-8 and box breathing patterns (established techniques).
- Bubble pop, Memory match and Water ripples (well-known game ideas, own implementation).
- Apple-style layout built from Bootstrap components.

### 5. Reused services and platforms
- Vercel for hosting and deployment.
- cdnjs and jsDelivr content delivery networks for the libraries.
- Befrienders KL, Talian Kasih and the university counselling centre, referenced instead of building a support service.

### 6. Reused browser features
- Canvas (Water ripples), clipboard (copy CSV) and the audio system underneath Tone.js.

### 7. Reuse inside the code
- Shared helpers `load`, `save`, `$`, `t`, `nm`, `lv`, `enc` used across screens.
- `js/logic.js` is loaded by both the app and the tests, so the tested code is the code that runs.
- Data-driven design: all text in `locales/`, sounds in `data/sounds.js`, DASS items and cut-offs in tables read by one scoring function.
- One page layout and one render cycle for all five tabs.

### Not reused (custom code)
Trend thresholds, breathing timer, the three games, journal, home dashboard, supportive messages, draft Malay interface text, and the glue code connecting everything.

## Trend rule assumptions
Rising or easing: regression slope of at least 2 points per check-in over the last 6 check-ins, with r-squared of at least 0.5. Sharp jump: an increase of 8 or more points since the previous check-in. These are project assumptions, not clinical standards.

## Testing
```
npm install
npm test                      # unit tests
npx playwright install chromium   # once
npm run a11y                  # accessibility scan, English and Malay
```
Also test by hand: use the whole app with only the keyboard, switch language on every tab, and try a screen reader.

## Open items
- Confirm each recording's licence on Freesound and keep the credit line in the page footer.
- Confirm the citation and permission to use the Malay DASS-21.
- Have a native speaker review the Malay interface text.
- Verify the helpline numbers before each release (Befrienders KL 03-7627 2929, Talian Kasih 15999, emergency 999).
- Have a counsellor or supervisor review the supportive messages and the trend thresholds.
