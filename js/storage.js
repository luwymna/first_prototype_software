const $=s=>document.querySelector(s);
const mem={};
function load(k,d){try{const v=localStorage.getItem(k);return v?JSON.parse(v):d}catch(e){return mem[k]??d}}
function save(k,v){try{localStorage.setItem(k,JSON.stringify(v))}catch(e){mem[k]=v}}
