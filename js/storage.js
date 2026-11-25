/* Reused component: store2 (localStorage wrapper). Falls back to memory if storage is blocked. */
const $ = s => document.querySelector(s);
const mem = {};
function load(k, d) { try { const v = store.get(k); return v == null ? d : v } catch (e) { return mem[k] ?? d } }
function save(k, v) { try { store.set(k, v) } catch (e) { mem[k] = v } }
