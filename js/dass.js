/* ---------- DASS-21 ---------- */
const Q=["I found it hard to wind down","I was aware of dryness of my mouth","I couldn’t seem to experience any positive feeling at all","I experienced breathing difficulty (e.g. rapid breathing, breathlessness without exertion)","I found it difficult to work up the initiative to do things","I tended to over-react to situations","I experienced trembling (e.g. in the hands)","I felt that I was using a lot of nervous energy","I was worried about situations in which I might panic and make a fool of myself","I felt that I had nothing to look forward to","I found myself getting agitated","I found it difficult to relax","I felt down-hearted and blue","I was intolerant of anything that kept me from getting on with what I was doing","I felt I was close to panic","I was unable to become enthusiastic about anything","I felt I wasn’t worth much as a person","I felt that I was rather touchy","I was aware of the action of my heart in the absence of physical exertion","I felt scared without any good reason","I felt that life was meaningless"];
const SCALES={stress:[1,6,8,11,12,14,18],anxiety:[2,4,7,9,15,19,20],depression:[3,5,10,13,16,17,21]};
const CUT={depression:[9,13,20,27],anxiety:[7,9,14,19],stress:[14,18,25,33]};
const LV=["Normal","Mild","Moderate","Severe","Extremely severe"];
const COL=["--ok","--ok","--mid","--warn","--warn"];
const NAME={stress:"Stress",anxiety:"Anxiety",depression:"Depression"};
const CLR={stress:"#1f7a84",anxiety:"#c58a1d",depression:"#b8456f"};
const ANS=["Did not apply to me at all","Applied to me to some degree","Applied to me a considerable degree","Applied to me very much"];
function level(k,s){const c=CUT[k];let i=0;while(i<4&&s>c[i])i++;return i}
function score(a){const r={};for(const k in SCALES)r[k]=SCALES[k].reduce((t,n)=>t+a[n-1],0)*2;return r}

/* ---------- Encouragement ---------- */
const MSG={low:["You’re doing better than you think. Keep the habits that work for you.","Checking in on yourself is a strength. Keep it up.","Steady is good. Protect your sleep and your breaks."],mid:["Tough weeks pass. One small task at a time is enough today.","You don’t have to do everything today. Pick one thing and begin.","Feeling pressure means you care. Be as kind to yourself as you’d be to a friend."],high:["This is heavy, and you don’t have to carry it alone. Reaching out to someone you trust is a brave step.","Take a slow breath first. Then consider talking to your campus counsellor or a friend today.","Your worth isn’t your grade. Rest counts as progress."]};
function enc(lv){const a=MSG[lv>=3?"high":lv>=1?"mid":"low"];return a[Math.floor(Math.random()*a.length)]}
function maxLv(r){return Math.max(...Object.keys(NAME).map(k=>level(k,r[k])))}
