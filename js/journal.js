/* ---------- Journal ---------- */
function vJournal(){
  const j=load("mp_journal",[]);
  $("#main").innerHTML=`<div class="card"><h2>Private journal</h2><p class="mute">Stored only in this browser. Write whatever is on your mind.</p><label for="mood" class="mute">Mood</label> <select id="mood" class="btn"><option>😞</option><option>😕</option><option selected>😐</option><option>🙂</option><option>😄</option></select> <button class="btn" id="pr">Need a prompt?</button><br><label for="jt" class="mute">What’s on your mind?</label><textarea id="jt" placeholder="Today I felt…"></textarea><p><button class="btn primary" id="js">Save entry</button></p></div>
  <div class="card"><h3>Past entries</h3>${j.length?j.slice().reverse().map(e=>`<div class="entry"><small>${e.m||""} ${new Date(e.t).toLocaleString()}</small><p style="margin:.3em 0;white-space:pre-wrap"></p><button class="del" data-t="${e.t}">Delete</button></div>`).join(""):'<p class="mute">No entries yet. Your first one will appear here.</p>'}</div>`;
  const ps=document.querySelectorAll(".entry p");j.slice().reverse().forEach((e,i)=>ps[i].textContent=e.x);
  $("#pr").onclick=()=>{const P=["What is weighing on me most today?","What is one thing that went okay this week?","What would I say to a friend feeling this way?","What can I let go of until tomorrow?"];$("#jt").placeholder=P[Math.floor(Math.random()*P.length)]};
  $("#js").onclick=()=>{const x=$("#jt").value.trim();if(!x)return $("#jt").focus();j.push({t:Date.now(),x,m:$("#mood").value});save("mp_journal",j);vJournal()};
  document.querySelectorAll(".del").forEach(b=>b.onclick=()=>{save("mp_journal",j.filter(e=>String(e.t)!==b.dataset.t));vJournal()});
}
