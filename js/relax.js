/* ---------- Relax ---------- */
function vRelax(){
  $("#main").innerHTML=`<div class="row2">
  <div class="card"><h3>Guided breathing</h3><div class="breath"><div id="orb"><span id="ph">Ready</span></div></div><select id="bp" class="btn" aria-label="Breathing pattern"><option value="478">4-7-8 (calming)</option><option value="box">Box 4-4-4-4 (focus)</option></select> <button class="btn primary" id="bs">Start</button></div>
  <div class="card"><h3>Calming sounds</h3><p class="mute">Generated in your browser, no downloads.</p><div class="opts" id="snd"></div><label class="mute">Volume<input type="range" id="vol" min="0" max="100" value="40"></label></div></div>
  <div class="card"><h3>Bubble pop <span class="mute">(30 seconds, no score pressure)</span></h3><div id="arena" aria-label="Game area"></div><span id="sc" class="mute">Pops: 0</span> <button class="btn" id="gs">Start</button></div>
  <div class="card"><h3>More games</h3><button class="btn" data-m="mem">Memory match</button> <button class="btn" data-m="rip">Water ripples</button> <button class="btn" data-m="word">Calm words</button><div id="ga" style="margin-top:12px"></div></div>
  <div class="card"><p class="quote" id="q">${enc(0)}</p><button class="btn" id="more">New message</button></div>`;
  $("#more").onclick=()=>{const h=load("mp_hist",[]);$("#q").textContent=enc(h.length?maxLv(h[h.length-1]):0)};
  breathing();sounds();game();minis();
}
function breathing(){
  const PAT={"478":[["Breathe in",4],["Hold",7],["Breathe out",8]],box:[["Breathe in",4],["Hold",4],["Breathe out",4],["Hold",4]]};let P=PAT["478"],on=false,T,i=0,c=0;
  const orb=$("#orb"),ph=$("#ph"),btn=$("#bs");
  function stop(){on=false;clearTimeout(T);orb.style.transitionDuration="1s";orb.style.transform="scale(.6)";ph.textContent="Ready";btn.textContent="Start"}
  function step(){if(!on)return;const[n,s,sc]=P[i];c=s;if(n==="Breathe in"||n==="Breathe out"){orb.style.transitionDuration=s+"s";orb.style.transform=`scale(${n==="Breathe in"?1.5:.6})`}
    (function tick(){if(!on)return;ph.innerHTML=n+"<br>"+c;if(c-->0)T=setTimeout(tick,1000);else{i=(i+1)%P.length;step()}})()}
  btn.onclick=()=>{if(on)stop();else{P=PAT[$("#bp").value];on=true;i=0;btn.textContent="Stop";step()}};
  stopFns.push(stop);
}
function sounds(){
  let ctx,src,g,lfo,cur=null,tm,ex=[];const box=$("#snd");
  const types={"Forest + animals":"forest","Windy ocean + gulls":"storm",Ocean:"ocean",White:"white",Brown:"brown"};
  function stop(){clearTimeout(tm);ex.forEach(n=>{try{n.stop()}catch(e){}});ex=[];try{src&&src.stop();lfo&&lfo.stop()}catch(e){}src=lfo=null;cur=null;draw()}
  function play(t){
    stop();ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();ctx.resume();
    const len=ctx.sampleRate*3,buf=ctx.createBuffer(1,len,ctx.sampleRate),d=buf.getChannelData(0);let last=0;
    for(let i=0;i<len;i++){const w=Math.random()*2-1;if(t==="white")d[i]=w*.5;else{last=(last+.02*w)/1.02;d[i]=last*3.5}}
    src=ctx.createBufferSource();src.buffer=buf;src.loop=true;g=ctx.createGain();g.gain.value=$("#vol").value/100;
    src.connect(g);g.connect(ctx.destination);
    if(t==="ocean"){lfo=ctx.createOscillator();lfo.frequency.value=.1;const lg=ctx.createGain();lg.gain.value=.3;lfo.connect(lg);const m=ctx.createGain();m.gain.value=.7;src.disconnect();src.connect(m);m.connect(g);lg.connect(m.gain);lfo.start()}
    src.start();cur=t;draw();if(t==="forest"||t==="storm")nature(t);
  }
  function nature(t){
    const f=ctx.createBiquadFilter(),sw=ctx.createGain(),add=o=>{ex.push(o);return o},fo=t==="forest";
    f.type="lowpass";f.frequency.value=fo?500:1000;sw.gain.value=.7;src.disconnect();src.connect(f);f.connect(sw);sw.connect(g);
    const l=add(ctx.createOscillator()),ld=ctx.createGain();l.frequency.value=fo?.07:.11;ld.gain.value=.35;l.connect(ld);ld.connect(sw.gain);l.start();
    const wb=ctx.createBuffer(1,ctx.sampleRate*2,ctx.sampleRate),wd=wb.getChannelData(0);for(let i=0;i<wd.length;i++)wd[i]=Math.random()*2-1;
    const ws=add(ctx.createBufferSource()),bp=ctx.createBiquadFilter(),wg=ctx.createGain(),gl=add(ctx.createOscillator()),gd=ctx.createGain(),dp=fo?.1:.3;
    ws.buffer=wb;ws.loop=true;bp.type="bandpass";bp.frequency.value=fo?350:650;bp.Q.value=.7;wg.gain.value=dp;gl.frequency.value=.06;gd.gain.value=dp;
    ws.connect(bp);bp.connect(wg);wg.connect(g);gl.connect(gd);gd.connect(wg.gain);ws.start();gl.start();
    if(fo){const c=add(ctx.createOscillator()),cg=ctx.createGain(),cl=add(ctx.createOscillator()),cd=ctx.createGain();c.frequency.value=4300;cg.gain.value=.02;cl.frequency.value=13;cd.gain.value=.02;c.connect(cg);cg.connect(g);cl.connect(cd);cd.connect(cg.gain);c.start();cl.start()}
    const tone=(a,b,d,ty,v,w)=>{const o=ctx.createOscillator(),e=ctx.createGain();o.type=ty;o.frequency.setValueAtTime(a,w);o.frequency.exponentialRampToValueAtTime(b,w+d);e.gain.setValueAtTime(.001,w);e.gain.linearRampToValueAtTime(v,w+d*.25);e.gain.exponentialRampToValueAtTime(.001,w+d);o.connect(e);e.connect(g);o.start(w);o.stop(w+d+.05)};
    const loop=()=>{if(cur!==t)return;const n=ctx.currentTime+.05,r=Math.random();
      if(fo){if(r<.65){const b=1800+Math.random()*2200,k=2+Math.floor(Math.random()*4);for(let i=0;i<k;i++)tone(b,b*(1.15+Math.random()*.5),.12,"sine",.25,n+i*.17)}else{tone(400,310,.5,"sine",.4,n);tone(400,300,.8,"sine",.4,n+.75)}}
      else{tone(1000,1700,.3,"triangle",.15,n);tone(1600,800,.5,"triangle",.15,n+.3)}
      tm=setTimeout(loop,2000+Math.random()*4000)};
    tm=setTimeout(loop,700);
  }
  function draw(){box.innerHTML=Object.keys(types).map(k=>`<button class="opt" data-t="${types[k]}" aria-pressed="${cur===types[k]}">${cur===types[k]?"■ Stop ":"▶ "}${k}</button>`).join("");
    box.querySelectorAll("button").forEach(b=>b.onclick=()=>cur===b.dataset.t?stop():play(b.dataset.t))}
  $("#vol").oninput=e=>{if(g)g.gain.value=e.target.value/100};
  draw();stopFns.push(()=>{clearTimeout(tm);try{src&&src.stop();lfo&&lfo.stop();ctx&&ctx.close()}catch(e){}});
}
function game(){
  let tm,sp,left=0,pops=0;const ar=$("#arena"),b=$("#gs");
  function end(){clearInterval(tm);clearInterval(sp);b.textContent="Start";if(left<=0&&pops)$("#sc").textContent=`Nice. You popped ${pops}. Take a slow breath.`}
  b.onclick=()=>{if(tm){left=0;end();tm=null;return}
    pops=0;left=30;ar.innerHTML="";$("#sc").textContent="Pops: 0 · 30s";b.textContent="Stop";
    sp=setInterval(()=>{const s=30+Math.random()*40,e=document.createElement("div");e.className="bub";e.style.cssText=`width:${s}px;height:${s}px;left:${Math.random()*(ar.clientWidth-s)}px;animation-duration:${4+Math.random()*3}s`;
      e.onclick=()=>{e.remove();pops++;$("#sc").textContent=`Pops: ${pops} · ${left}s`};e.onanimationend=()=>e.remove();ar.appendChild(e)},650);
    tm=setInterval(()=>{left--;$("#sc").textContent=`Pops: ${pops} · ${left}s`;if(left<=0){end();tm=null;ar.innerHTML=""}},1000)};
  stopFns.push(()=>{clearInterval(tm);clearInterval(sp)});
}

function minis(){
  const ga=$("#ga");let raf;stopFns.push(()=>cancelAnimationFrame(raf));
  const G={
  mem(){const E=["🌲","🌊","🦉","🦋","🌸","🐢"],d=[...E,...E].sort(()=>Math.random()-.5);let open=[],done=0,mv=0;
    ga.innerHTML=`<div style="display:grid;grid-template-columns:repeat(4,1fr);gap:8px;max-width:360px">${d.map((e,i)=>`<button class="opt" data-i="${i}" style="font-size:1.8rem;text-align:center;height:64px;padding:0" aria-label="Card ${i+1}">?</button>`).join("")}</div><p class="mute" id="mm">Find all six pairs. Moves: 0</p>`;
    ga.querySelectorAll("[data-i]").forEach(b=>b.onclick=()=>{if(open.length>1||b.disabled||open.includes(b))return;b.textContent=d[+b.dataset.i];open.push(b);
      if(open.length===2){mv++;const[a,c]=open;if(a.textContent===c.textContent){a.disabled=c.disabled=true;done++;open=[]}else setTimeout(()=>{a.textContent=c.textContent="?";open=[]},700);
        $("#mm").textContent=done===6?`All pairs found in ${mv} moves. Well done.`:`Moves: ${mv}`}})},
  rip(){ga.innerHTML=`<canvas id="cv" style="width:100%;height:230px;background:var(--soft);border-radius:12px;touch-action:none"></canvas><p class="mute">Tap or drag on the water.</p>`;
    const c=$("#cv"),x=c.getContext("2d"),R=[],col=getComputedStyle(document.documentElement).getPropertyValue("--accent").trim()||"#1f7a84";c.width=c.clientWidth*2;c.height=460;
    const add=e=>{const r=c.getBoundingClientRect();R.push({x:(e.clientX-r.left)*c.width/r.width,y:(e.clientY-r.top)*c.height/r.height,r:4,a:.8})};
    c.onpointerdown=add;c.onpointermove=e=>{if(e.buttons&&Math.random()<.3)add(e)};
    (function f(){x.clearRect(0,0,c.width,c.height);x.strokeStyle=col;x.lineWidth=3;for(let i=R.length-1;i>=0;i--){const o=R[i];o.r+=2.2;o.a-=.007;if(o.a<=0){R.splice(i,1);continue}x.globalAlpha=o.a;x.beginPath();x.arc(o.x,o.y,o.r,0,7);x.stroke()}raf=requestAnimationFrame(f)})()},
  word(){const W=["BREATHE","RELAX","PEACEFUL","GENTLE","SUNRISE","FOREST","HARMONY","SERENE","BALANCE","GRATEFUL"];let w,n=0;
    function nx(){w=W[Math.floor(Math.random()*W.length)];let s;do{s=[...w].sort(()=>Math.random()-.5).join("")}while(s===w);
      ga.innerHTML=`<p style="font:700 1.8rem 'Bricolage Grotesque',sans-serif;letter-spacing:.2em;margin:4px 0">${s}</p><input id="wi" class="opt" style="width:100%;max-width:300px" placeholder="Type the calm word" autocomplete="off" aria-label="Your answer"> <button class="btn primary" id="wc">Check</button> <button class="btn" id="wn">Skip</button><p class="mute" id="wm">Solved: ${n}</p>`;
      const ck=()=>{if($("#wi").value.trim().toUpperCase()===w){n++;nx()}else $("#wm").textContent="Not quite. Try again."};$("#wc").onclick=ck;$("#wi").onkeydown=e=>{if(e.key==="Enter")ck()};$("#wn").onclick=nx}
    nx()}};
  document.querySelectorAll("[data-m]").forEach(b=>b.onclick=()=>{cancelAnimationFrame(raf);G[b.dataset.m]()});
}
