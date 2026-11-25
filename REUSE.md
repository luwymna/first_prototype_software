# MindPulse: Reuse-Oriented Development Record

Hosting is on Vercel (unchanged). Deploy the `mindpulse-app` folder as a static site.

## Reused components (pinned, loaded from cdnjs)
| Need | Component | Version | Licence | Where used |
|---|---|---|---|---|
| Local data storage | store2 | 2.14.2 | MIT | js/storage.js |
| Trend charts | Chart.js | 4.4.1 | MIT | js/trends.js |
| Audio playback of recordings and white noise generation | Tone.js | 14.8.49 | MIT | js/relax.js |
| Trend statistics (regression) | simple-statistics | 7.8.3 | ISC | js/logic.js |
| Language switch (English, Bahasa Melayu) | i18next | 23.11.5 | MIT | js/i18n.js, locales/ |
| PDF report | jsPDF | 2.5.1 | MIT | js/report.js |
| Unit tests | Vitest (dev only) | ^2.1 | MIT | tests/ |
| Accessibility scan | axe-core + Playwright (dev only) | ^4.9 / ^1.47 | MPL-2.0 / Apache-2.0 | a11y/ |
| Malay DASS-21 items | Musa et al. Malay version (file supplied by the team; confirm citation and permission) | n/a | Check | locales/ms.js |
| UI framework (layout, cards, buttons, forms, tables, progress bars, dark mode) | Bootstrap | 5.3.3 | MIT | index.html, all views |
| Supportive messages | Own wording, 17 messages in 3 tiers, in English and Malay (draft, needs native review) | n/a | Project-owned | locales/ |
| Assessment instrument | DASS-21 (Lovibond & Lovibond, 1995) | n/a | Free for non-commercial use, cite the authors | js/dass.js |
| Fonts | Bricolage Grotesque, Figtree (Google Fonts) | n/a | OFL | index.html |

## Custom glue code (not reusable off the shelf)
DASS scoring and severity lookup, trend rules (rising, easing, three-in-a-row), encouragement selection, breathing timer, the three mini-games (bubble pop, memory match, water ripples), journal, screen routing.

## Component analysis, still to complete for the SRS/SDD
Compare two or three candidates per need (e.g. Chart.js vs Plotly; Tone.js vs Howler.js with licensed recordings) on licence, size, maintenance and fit.

## Risks
CDN outage (mitigate by copying the files into /vendor), library updates (versions are pinned), synthesised animal sounds are approximations.

## Audio recordings
List each file in assets/audio/ with its source URL and licence (e.g. CC0 from Freesound or Pixabay).

| File | Source | Author | Licence |
|---|---|---|---|
| night-wildlife.mp3 | Freesound #352514 "ambience-night-wildlife-a" | InspectorJ | Check the Freesound page (likely CC BY, credit required) |
| seaside-waves.mp3 | Freesound #400632 "ambience-seaside-waves-close-a" | InspectorJ | Check the Freesound page (likely CC BY, credit required) |
| rainforest-rain.mp3 | Freesound #457447 "rain-sound-and-rainforest" | innorecords | Check the Freesound page |
The two WAV recordings were converted to 128 kbps MP3 to reduce size (about 77 MB down to about 5 MB for the waves).

## Trend rule assumptions (document in SDD)
Rising or easing = regression slope of at least 2 points per check-in over the last 6 check-ins with r-squared of at least 0.5. Jump = increase of 8 or more points since the previous check-in. These are project assumptions, not clinical standards.
