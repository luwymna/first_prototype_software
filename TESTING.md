# Testing MindPulse

1. Install Node.js (nodejs.org), then in this folder run: `npm install`
2. Unit tests (scoring, severity cut-offs, trend rules, language files, sound files): `npm test`
3. Accessibility scan: `npx playwright install chromium` once, then `npm run a11y`
4. Manual checks: use the whole app with only the Tab and Enter keys, switch to Bahasa Melayu on every tab, and try a screen reader.
