import { describe, it, expect } from "vitest";
import { createRequire } from "node:module";
import fs from "node:fs";
const require = createRequire(import.meta.url);
const L = require("../js/logic.js"), EN = require("../locales/en.js"), MS = require("../locales/ms.js"), SOUND = require("../data/sounds.js");
const all = v => Array(21).fill(v);
const hist = s => s.map((x, i) => ({ t: i, stress: x, anxiety: 5, depression: 5 }));
const stripPlural = k => k.replace(/_(zero|one|two|few|many|other)$/, "");

describe("DASS-21 scoring", () => {
  it("all answers 0 give 0 and Normal", () => {
    const r = L.score(all(0));
    expect(r).toEqual({ stress: 0, anxiety: 0, depression: 0 });
    expect(L.maxLv(r)).toBe(0);
  });
  it("all answers 3 give 42 and Extremely severe", () => {
    const r = L.score(all(3));
    expect(r).toEqual({ stress: 42, anxiety: 42, depression: 42 });
    for (const k of Object.keys(r)) expect(L.level(k, r[k])).toBe(4);
  });
  it("scores are doubled (item 1 is a stress item)", () => {
    const a = all(0); a[0] = 3;
    expect(L.score(a).stress).toBe(6);
  });
  it("each scale uses exactly 7 items and every item is used once", () => {
    const ids = Object.values(L.SCALES).flat().sort((a, b) => a - b);
    expect(ids).toEqual(Array.from({ length: 21 }, (_, i) => i + 1));
  });
  it("severity boundaries match the published cut-offs", () => {
    for (const k of Object.keys(L.CUT)) L.CUT[k].forEach((c, i) => {
      expect(L.level(k, c)).toBe(i);
      expect(L.level(k, c + 1)).toBe(i + 1);
    });
    expect(L.level("stress", 14)).toBe(0); expect(L.level("stress", 15)).toBe(1);
    expect(L.level("anxiety", 7)).toBe(0); expect(L.level("anxiety", 8)).toBe(1);
    expect(L.level("depression", 9)).toBe(0); expect(L.level("depression", 10)).toBe(1);
  });
});

describe("trend analysis (simple-statistics)", () => {
  const stress = h => L.analyse(hist(h)).find(i => i.k === "stress");
  it("needs at least three check-ins", () => expect(L.analyse(hist([10, 12]))[0].id).toBe("needMore"));
  it("detects a rising trend", () => expect(stress([10, 12, 14, 16, 18, 20]).id).toBe("rising"));
  it("detects an easing trend", () => expect(stress([20, 18, 16, 14, 12, 10]).id).toBe("easing"));
  it("reports a steady series as steady", () => expect(stress([14, 15, 14, 15, 14, 15]).id).toBe("steady"));
  it("flags a jump of 8 or more since the last check-in", () => expect(stress([10, 10, 11, 10, 28]).id).toBe("spike"));
  it("marks severe scores", () => expect(stress([30, 31, 32, 34, 36, 38]).severe).toBe(true));
  it("fit() returns one value per check-in, null before the window", () => {
    const f = L.fit(hist([1, 2, 3, 4, 5, 6, 7, 8]), "stress");
    expect(f).toHaveLength(8); expect(f[0]).toBeNull(); expect(f[7]).toBeCloseTo(8, 0);
  });
});

describe("language files", () => {
  it("have 21 DASS items and 4 answer labels in both languages", () => {
    expect(EN.q).toHaveLength(21); expect(MS.q).toHaveLength(21);
    expect(EN.ans).toHaveLength(4); expect(MS.ans).toHaveLength(4);
  });
  it("Malay has every English key (ignoring plural suffixes)", () => {
    const ms = new Set(Object.keys(MS).map(stripPlural));
    const missing = Object.keys(EN).map(stripPlural).filter(k => !ms.has(k));
    expect(missing).toEqual([]);
  });
  it("Malay DASS items are complete (not cut off)", () => {
    MS.q.forEach((s, i) => {
      expect(s.length).toBeGreaterThan(EN.q[i].length * 0.6);
      expect((s.match(/\(/g) || []).length).toBe((s.match(/\)/g) || []).length);
    });
  });
  it("no empty strings", () => {
    for (const lang of [EN, MS]) for (const v of Object.values(lang)) {
      for (const s of [].concat(v)) expect(String(s).trim().length).toBeGreaterThan(0);
    }
  });
});

describe("data files", () => {
  it("every listed sound file exists", () => SOUND.forEach(f => expect(fs.existsSync(f.file)).toBe(true)));
});
