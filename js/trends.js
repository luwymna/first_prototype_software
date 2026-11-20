/* ---------- Trends ---------- */
function analyse(h){
  if(h.length<2)return[{txt:"Complete at least two check-ins to see trends.",c:"--mute"}];
  const last=h[h.length-1],prev=h.slice(Math.max(0,h.length-4),h.length-1),out=[];
  for(const k in NAME){
    const avg=prev.reduce((t,e)=>t+e[k],0)/prev.length,d=last[k]-avg,l=level(k,last[k]);
    let t,c;
    if(d>=4){t=`${NAME[k]} is rising: ${last[k]} now versus an average of ${avg.toFixed(0)} before.`;c="--warn"}
    else if(d<=-4){t=`${NAME[k]} is easing: down ${Math.abs(d).toFixed(0)} points from your recent average. Good recovery.`;c="--ok"}
    else{t=`${NAME[k]} is steady around ${last[k]}.`;c="--mute"}
    if(l>=3)t+=" This is in the severe range, so please seek support.";
    out.push({txt:t,c});
  }
  const sp=h.length>=3&&h.slice(-3).every((e,i,a)=>i===0||e.stress>a[i-1].stress);
  if(sp)out.push({txt:"Your stress has risen across the last three check-ins. This often happens near exam or deadline periods; plan breaks now.",c:"--warn"});
  return out;
}
function vTrends(){
  const h=load("mp_hist",[]);
  if(!h.length){$("#main").innerHTML=`<div class="card"><h2>No check-ins yet</h2><p>Take your first check-in to start your history. Want to see how this looks with data?</p><button class="btn primary" id="a">Check in now</button> <button class="btn" id="d">Load sample data</button></div>`;
    $("#a").onclick=()=>go("checkin");
    $("#d").onclick=()=>{const n=Date.now(),D=864e5,v=[[10,6,8],[12,8,10],[14,8,12],[20,12,14],[28,14,18],[34,18,22],[22,12,16]];save("mp_hist",v.map((x,i)=>({t:n-(v.length-i)*5*D,stress:x[0],anxiety:x[1],depression:x[2]})));vTrends()};return}
  const W=640,H=220,p=34,n=h.length,X=i=>p+(n===1?0:i*(W-2*p)/(n-1)),Y=v=>H-p-v/42*(H-2*p);
  const lines=Object.keys(NAME).map(k=>`<polyline fill="none" stroke="${CLR[k]}" stroke-width="2.5" points="${h.map((e,i)=>X(i)+","+Y(Math.min(e[k],42))).join(" ")}"/>`+h.map((e,i)=>`<circle cx="${X(i)}" cy="${Y(Math.min(e[k],42))}" r="3.5" fill="${CLR[k]}"/>`).join("")).join("");
  const grid=[0,14,28,42].map(v=>`<line x1="${p}" x2="${W-p}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/><text x="4" y="${Y(v)+4}" font-size="11" fill="var(--mute)">${v}</text>`).join("");
  const xl=h.map((e,i)=>(n<=8||i%Math.ceil(n/8)===0)?`<text x="${X(i)}" y="${H-8}" font-size="10" text-anchor="middle" fill="var(--mute)">${new Date(e.t).toLocaleDateString(undefined,{day:"numeric",month:"short"})}</text>`:"").join("");
  const ins=analyse(h);
  $("#main").innerHTML=`<div class="card"><h2>Your trends</h2><div class="scroll"><svg viewBox="0 0 ${W} ${H}" style="min-width:480px;width:100%" role="img" aria-label="Line chart of stress, anxiety and depression scores over time">${grid}${lines}${xl}</svg></div><div class="legend">${Object.keys(NAME).map(k=>`<span style="--c:${CLR[k]}">${NAME[k]}</span>`).join("")}</div></div>
  <div class="card"><h3>What the pattern says</h3>${ins.map(i=>`<p style="color:var(${i.c});margin:.4em 0">${i.txt}</p>`).join("")}</div>
  <div class="card"><h3>History</h3><div class="scroll"><table style="width:100%;border-collapse:collapse;font-size:.92rem"><tr style="text-align:left"><th>Date</th><th>Stress</th><th>Anxiety</th><th>Depression</th></tr>${h.slice().reverse().map(e=>`<tr style="border-top:1px solid var(--line)"><td>${new Date(e.t).toLocaleDateString()}</td>${["stress","anxiety","depression"].map(k=>`<td>${e[k]} <span class="mute">${LV[level(k,e[k])]}</span></td>`).join("")}</tr>`).join("")}</table></div><p><button class="btn" id="cp">Copy data as CSV</button> <button class="btn" id="clr">Delete all history</button></p></div>`;
  $("#cp").onclick=()=>{const c="date,stress,anxiety,depression\n"+h.map(e=>[new Date(e.t).toISOString().slice(0,10),e.stress,e.anxiety,e.depression].join(",")).join("\n");(navigator.clipboard?navigator.clipboard.writeText(c):Promise.reject()).then(()=>{$("#cp").textContent="Copied"}).catch(()=>{$("#cp").insertAdjacentHTML("afterend",`<textarea readonly>${c}</textarea>`)})};
  let sure=false;$("#clr").onclick=e=>{if(sure){save("mp_hist",[]);vTrends()}else{sure=true;e.target.textContent="Tap again to delete everything"}};
}
