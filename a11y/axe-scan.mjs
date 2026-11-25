// Accessibility scan: opens each tab in a real browser (English and Malay) and runs axe-core (WCAG A and AA).
// Setup once: npm install && npx playwright install chromium     Run: npm run a11y
import { chromium } from "playwright";
import { createRequire } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";
const require = createRequire(import.meta.url);
const axeSrc = require.resolve("axe-core/axe.min.js");
const browser = await chromium.launch(), page = await browser.newPage();
await page.goto(pathToFileURL(path.resolve("index.html")).href);
await page.waitForSelector("#nav button");
let total = 0;
for (const lang of ["en", "ms"]) {
  await page.click("#lgb"); await page.click(`[data-lang=${lang}]`);
  for (const tab of ["home", "checkin", "trends", "relax", "journal"]) {
    await page.click(`nav button[data-v=${tab}]`);
    await page.waitForTimeout(600);
    await page.addScriptTag({ path: axeSrc });
    const r = await page.evaluate(() => axe.run({ runOnly: ["wcag2a", "wcag2aa"] }));
    console.log(`\n== ${lang} / ${tab}: ${r.violations.length} violation(s)`);
    for (const v of r.violations) { total++; console.log(`- [${v.impact}] ${v.id}: ${v.help} (${v.nodes.length} element(s))`); }
  }
}
await browser.close();
process.exit(total ? 1 : 0);
