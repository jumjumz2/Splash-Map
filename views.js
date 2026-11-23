const AV=['🦈','🐙','🐳','🐢'],av=w=>w==='you'?'🐬':AV[w.length%4];
const J=a=>a.n||1,mine=()=>S.acts.filter(a=>a.who==='you'),spotOf=id=>S.spots.find(x=>x.id==id);
const best=a=>Math.max(0,...a.map(x=>x.sc));

const V={tmr:0,rp:'a',rs:0,n:0,t0:0,eid:0,

/* ---------- FEED ---------- */
feed(){
  const l=S.acts.filter(a=>!S.fo||a.who==='you'||S.follow.includes(a.who));
  $('#t-feed').innerHTML=
   `<div class="seg"><button class="${S.fo?'':'on'}" onclick="S.fo=0;V.feed()">Everyone</button><button class="${S.fo?'on':''}" onclick="S.fo=1;V.feed()">Following</button></div>`+
   (l.map((a,i)=>{
    const s=spotOf(a.spot)||{name:'Deleted spot',d:0,type:'chill'},t=T[s.type];
    return `<article class="card" style="--i:${Math.min(i,8)}">
     <div class="who"><span class="av">${av(a.who)}</span><div><b>${esc(a.who)}</b><small>${t.e} ${esc(s.name)} · ${ago(a.ts)}</small></div>
     ${a.who!=='you'?`<button class="mini" onclick="V.follow('${esc(a.who)}')">${S.follow.includes(a.who)?'Following':'Follow'}</button>`:''}</div>
     ${a.photo?`<img class="ph" src="${esc(a.photo)}" alt="">`:''}
     <div class="row3"><div><b>${fh(a.h)}</b><small>Height</small></div><div><b>${a.sc.toFixed(1)}</b><small>Splash</small></div><div><b>${J(a)}</b><small>Jumps</small></div></div>
     <p>${esc(a.note)}</p>
     <div class="acts"><button class="stoke ${a.on?'on':''}" onclick="V.stoke(${a.id},this)">🤙 <span>${a.k}</span></button><button class="stoke" onclick="V.cm(${a.id})">💬 ${a.cm.length}</button></div></article>`}).join('')
   ||'<p class="mute">Nothing here yet. Follow some jumpers.</p>');
},
follow(w){const i=S.follow.indexOf(w);i<0?S.follow.push(w):S.follow.splice(i,1);save();V.feed()},
stoke(id,b){
  const a=S.acts.find(x=>x.id==id);a.on=!a.on;a.k+=a.on?1:-1;save();buzz();
  b.classList.toggle('on',a.on);b.querySelector('span').textContent=a.k;
  if(a.on)for(let i=0;i<8;i++){const p=document.createElement('span'),g=i/8*6.28;p.className='p';p.textContent=i%2?'💦':'🌊';p.style.setProperty('--x',Math.cos(g)*46+'px');p.style.setProperty('--y',Math.sin(g)*46+'px');b.appendChild(p);setTimeout(()=>p.remove(),700)}
},
cm(id){
  const a=S.acts.find(x=>x.id==id);
  sheet(`<h2>Comments</h2>${a.cm.map(c=>`<p class="cmt"><b>${esc(c[0])}</b> ${esc(c[1])}</p>`).join('')||'<p class="mute">Be the first.</p>'}
   <input id="ci" maxlength="120" placeholder="Say something"><button class="btn" onclick="V.addCm(${id})">Send</button>`);
},
addCm(id){const v=$('#ci').value.trim();if(!v)return;S.acts.find(x=>x.id==id).cm.push(['you',v]);save();V.cm(id);V.feed()},

/* ---------- RANKS ---------- */
rank(){
  const cut=V.rp=='w'?Date.now()-6048e5:0,u={};
  S.acts.filter(a=>a.ts>=cut&&(!V.rs||a.spot==V.rs)).forEach(a=>{const r=u[a.who]||(u[a.who]={w:a.who,sc:0,n:0});r.sc=Math.max(r.sc,a.sc);r.n+=J(a)});
  const l=Object.values(u).sort((a,b)=>b.sc-a.sc);
  $('#t-rank').innerHTML=`<h2>Leaderboard</h2>
   <div class="seg"><button class="${V.rp=='a'?'on':''}" onclick="V.rp='a';V.rank()">All time</button><button class="${V.rp=='w'?'on':''}" onclick="V.rp='w';V.rank()">This week</button></div>
   <select onchange="V.rs=+this.value;V.rank()"><option value="0">All spots</option>${S.spots.map(s=>`<option value="${s.id}" ${s.id==V.rs?'selected':''}>${esc(s.name)}</option>`).join('')}</select><div style="height:12px"></div>`+
   (l.map((r,i)=>`<div class="lb" style="--i:${i}"><span>${['🥇','🥈','🥉'][i]||i+1}</span><span>${av(r.w)} ${esc(r.w)}<br><small>${r.n} jumps</small></span><div class="bar"><u style="width:${r.sc*10}%"></u></div><b>${r.sc.toFixed(1)}</b></div>`).join('')||'<p class="mute">No jumps in this range.</p>');
},

/* ---------- PROFILE ---------- */
me(){
  const m=mine(),w0=wk0(),wm=m.filter(a=>a.ts>=w0),wj=nJ(wm),l=lv(),days=[0,0,0,0,0,0,0];
  wm.forEach(a=>days[(new Date(a.ts).getDay()+6)%7]+=J(a));
  const sp=new Set(wm.map(a=>a.spot)).size,pbs={};m.forEach(a=>pbs[a.spot]=Math.max(pbs[a.spot]||0,a.sc));
  const prog=(t,v,x)=>`<small>${t}: ${Math.min(v,x)}/${x}</small><div class="bar"><u style="width:${Math.min(v/x,1)*100}%"></u></div>`;
  $('#t-me').innerHTML=`
   <div class="ph2"><div class="av">🐬</div><div><h2>@you</h2><span class="lvl">LV ${l+1} · ${LEVELS[l]}</span></div></div>
   <h3>XP ${S.xp}</h3>${prog('Next level',S.xp%150,150)}
   <div class="ringw"><svg width="130" height="130" viewBox="0 0 130 130"><circle cx="65" cy="65" r="52" fill="none" stroke="#06182c" stroke-width="12"/>
    <circle id="ring" cx="65" cy="65" r="52" fill="none" stroke="var(--aqua)" stroke-width="12" stroke-linecap="round" stroke-dashoffset="${326.7*(1-Math.min(wj/5,1))}" transform="rotate(-90 65 65)"/></svg>
    <div class="rc"><b>${wj}</b><small>of 5 this week</small></div></div>
   <div class="row3"><div><b>${nJ(m)}</b><small>Jumps</small></div><div><b>${best(m).toFixed(1)}</b><small>Best</small></div><div><b>🔥${S.streak}</b><small>Day streak</small></div></div>
   <h3>This week</h3><div class="wk">${days.map((v,i)=>`<div class="wb"><u style="height:${6+v*20}px"></u><small>${'MTWTFSS'[i]}</small></div>`).join('')}</div>
   <h3>Weekly challenges</h3>${prog('Log 5 jumps (+50 XP)',wj,5)}${prog('Visit 2 spots',sp,2)}
   <h3>Badges</h3>${BADGES.map(b=>`<span class="bd ${b[2](m)?'on':''}">${b[0]} ${b[1]}</span>`).join('')}
   <h3>Personal bests</h3>${Object.entries(pbs).map(([id,v])=>`<span class="tg">${esc((spotOf(id)||{name:'?'}).name)}: <b>${v.toFixed(1)}</b></span>`).join('')||'<small>Log a jump to set one</small>'}
   <h3>Saved spots</h3>${S.fav.map(id=>spotOf(id)).filter(Boolean).map(s=>`<span class="tg" onclick="go('map');V.spot(${s.id})">${T[s.type].e} ${esc(s.name)}</span>`).join('')||'<small>Tap ❤️ on a spot to save it</small>'}`;
},

/* ---------- SPOT SHEET ---------- */
spot(id){
  const s=spotOf(id),t=T[s.type],cr=S.crowd[id],ra=S.rate[id]||0,avg=(((s.vb||4.5)*5+ra)/(ra?6:5)).toFixed(1);
  const top=Object.values(S.acts.filter(a=>a.spot==id).reduce((o,a)=>{if(!o[a.who]||a.sc>o[a.who].sc)o[a.who]=a;return o},{})).sort((a,b)=>b.sc-a.sc).slice(0,3);
  const age=Math.round((Date.now()-s.v)/864e5),pb=best(mine().filter(a=>a.spot==id));
  sheet(`<div class="hd"><h2>${t.e} ${esc(s.name)}</h2><button class="mini" onclick="V.fav(${id})">${S.fav.includes(id)?'❤️':'🤍'}</button></div>
   <small>${t.n}${here?' · '+dist(here.lat,here.lng,s.lat,s.lng).toFixed(1)+' km away':''}</small>
   <div class="row3"><div><b>${fh(s.h)}</b><small>Height</small></div><div><b>${fh(s.d)}</b><small>Depth</small></div><div><b>${avg}★</b><small>Vibe</small></div></div>
   <div class="warn">⚠️ ${esc(s.w||'No warnings yet. Check depth, tide and rocks first.')}</div>
   ${(s.hz||[]).slice(-2).map(h=>`<div class="warn bad">🚩 ${esc(h.t)} <small>${ago(h.ts)} ago</small></div>`).join('')}
   <small>${age>90?'⚠️ Stale: ':'✅ '}verified ${age}d ago · <a href="#" style="color:var(--aqua)" onclick="V.ver(${id});return false">Re-verify</a></small>
   <div class="warn" id="cond" style="border-color:var(--aqua)">Loading conditions…</div>
   <h3>Crowd</h3><div class="seg">${['Quiet','Okay','Busy'].map(c=>`<button class="${cr&&cr.v==c?'on':''}" onclick="V.crowd(${id},'${c}')">${c}</button>`).join('')}</div>${cr?`<small>Reported ${ago(cr.ts)} ago</small>`:''}
   <h3>Rate the vibe</h3><div class="stars">${[1,2,3,4,5].map(n=>`<span class="${n<=ra?'on':''}" onclick="V.rate(${id},${n})">★</span>`).join('')}</div>
   <h3>Amenities</h3><div>${(s.tags||[]).map(i=>`<span class="tg">${AMEN[i]}</span>`).join('')||'<small>None listed</small>'}</div>
   ${pb?`<h3>Your PB</h3><b>${pb.toFixed(1)} splash</b>`:''}
   <h3>Top splashes</h3>${top.map((a,i)=>`<div class="lb"><span>${['🥇','🥈','🥉'][i]}</span><span>${av(a.who)} ${esc(a.who)}</span><div class="bar"><u style="width:${a.sc*10}%"></u></div><b>${a.sc.toFixed(1)}</b></div>`).join('')||'<small>Nobody yet</small>'}
   <button class="btn" onclick="V.record(${id})">🤙 Log a jump</button>
   <button class="btn ghost" onclick="V.session(${id})">⏱️ Session mode</button>
   <div class="seg" style="margin-top:10px"><a href="https://www.google.com/maps/dir/?api=1&destination=${s.lat},${s.lng}" target="_blank" rel="noopener">🧭 Directions</a><button onclick="V.share(${id})">🔗 Share</button><button onclick="V.hazard(${id})">🚩 Hazard</button></div>
   ${s.own?`<div class="seg"><button onclick="V.newSpot(${id})">✏️ Edit</button><button onclick="V.del(${id})">🗑️ Delete</button></div>`:''}
   <button class="btn ghost" onclick="closeSheet()">Close</button>`);
  M.map.flyTo([s.lat,s.lng],Math.max(M.map.getZoom(),13),{duration:.7});
  V.cond(s);
},
async cond(s){
  const el=$('#cond');
  try{
    const j=(await(await fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${s.lat}&longitude=${s.lng}&current=wave_height,sea_surface_temperature`)).json()).current;
    el.textContent=j&&j.wave_height!=null?`🌊 Waves ${j.wave_height}m · 🌡️ Water ${j.sea_surface_temperature}°C`:'No marine data for this spot';
  }catch(e){el.textContent='Conditions unavailable'}
},
fav(id){const i=S.fav.indexOf(id);i<0?S.fav.push(id):S.fav.splice(i,1);save();M.draw();V.spot(id)},
crowd(id,c){S.crowd[id]={v:c,ts:Date.now()};save();V.spot(id)},
rate(id,n){S.rate[id]=n;save();V.spot(id)},
ver(id){spotOf(id).v=Date.now();save();V.spot(id)},
hazard(id){const t=prompt('Describe the hazard');if(t&&t.trim()){const s=spotOf(id);(s.hz=s.hz||[]).push({t:t.trim(),ts:Date.now()});save();V.spot(id)}},
share(id){const s=spotOf(id),u=`https://maps.google.com/?q=${s.lat},${s.lng}`;navigator.share?navigator.share({title:s.name+' on Splash Map',url:u}).catch(()=>{}):(navigator.clipboard.writeText(s.name+' '+u),toast('Link copied'))},
del(id){if(!confirm('Delete this spot and its jumps?'))return;S.spots=S.spots.filter(s=>s.id!=id);S.acts=S.acts.filter(a=>a.spot!=id);save();M.draw();closeSheet();V.feed()},

/* ---------- ADD / EDIT SPOT ---------- */
newSpot(id){
  const s=id?spotOf(id):{name:'',type:'manu',h:3,d:3,w:'',tags:[]};V.eid=id||0;
  sheet(`<h2>${id?'Edit':'New'} spot</h2>
   <label>Name</label><input id="nN" maxlength="40" value="${esc(s.name)}">
   <label>Type</label><select id="nT">${Object.entries(T).map(([k,t])=>`<option value="${k}" ${k==s.type?'selected':''}>${t.e} ${t.n}</option>`).join('')}</select>
   <label>Jump height (m)</label><input id="nH" type="number" value="${s.h}">
   <label>Water depth (m)</label><input id="nD" type="number" value="${s.d}">
   <label>Tide / current warning</label><input id="nW" maxlength="120" value="${esc(s.w)}">
   <label>Amenities</label>${AMEN.map((a,i)=>`<label class="tg ck"><input type="checkbox" class="am" value="${i}" ${(s.tags||[]).includes(i)?'checked':''}> ${a}</label>`).join('')}
   <button class="btn" onclick="V.saveSpot()">Save spot</button><button class="btn ghost" onclick="closeSheet()">Cancel</button>`);
},
saveSpot(){
  const n=$('#nN').value.trim();if(!n)return toast('Name it first');
  const d={name:n,type:$('#nT').value,h:+$('#nH').value,d:+$('#nD').value,w:$('#nW').value,tags:[...document.querySelectorAll('.am:checked')].map(x=>+x.value)};
  if(V.eid)Object.assign(spotOf(V.eid),d);else S.spots.push({...d,id:Date.now(),lat:M.pt.lat,lng:M.pt.lng,v:Date.now(),own:1,hz:[]});
  save();M.draw();closeSheet();toast('Saved 📍');
},

/* ---------- LOG A JUMP ---------- */
record(id){
  sheet(`<h2>Log a jump</h2>
   <label>Spot</label><select id="rS">${S.spots.map(s=>`<option value="${s.id}" ${s.id==id?'selected':''}>${esc(s.name)}</option>`).join('')}</select>
   <label>Height (m): <b id="rHo">5</b></label><input id="rH" type="range" min="1" max="30" value="5" oninput="$('#rHo').textContent=this.value">
   <label>Splash score: <b id="rCo">7.0</b></label><input id="rC" type="range" min="1" max="10" step=".1" value="7" oninput="$('#rCo').textContent=(+this.value).toFixed(1)">
   <label>Note</label><input id="rN" maxlength="80" placeholder="How was it?">
   <label>Photo</label><input id="rF" type="file" accept="image/*">
   <h3>Safety check</h3>${CHECK.map(c=>`<label class="tg ck"><input type="checkbox" class="sc" onchange="$('#rP').disabled=!!document.querySelector('.sc:not(:checked)')"> ${c}</label>`).join('')}
   <button class="btn" id="rP" disabled onclick="V.post()">Post splash</button><button class="btn ghost" onclick="closeSheet()">Cancel</button>`);
},
img(f){return new Promise(r=>{if(!f)return r('');const i=new Image;i.onerror=()=>r('');i.onload=()=>{const k=Math.min(1,480/i.width),c=document.createElement('canvas');c.width=i.width*k;c.height=i.height*k;c.getContext('2d').drawImage(i,0,0,c.width,c.height);r(c.toDataURL('image/jpeg',.6))};i.src=URL.createObjectURL(f)})},
async post(){V.log(+$('#rS').value,+$('#rH').value,+$('#rC').value,$('#rN').value.trim(),await V.img($('#rF').files[0]))},

/* ---------- SESSION MODE ---------- */
session(id){
  V.n=0;V.t0=Date.now();
  sheet(`<h2>Session mode</h2><small>${esc(spotOf(id).name)}</small>
   <div class="big"><span id="tm">0:00</span></div>
   <button class="tap" onclick="$('#sn').textContent=++V.n;buzz()">🤙</button>
   <div class="big" style="font-size:36px"><span id="sn">0</span> jumps</div>
   <label>Average splash: <b id="sCo">7.0</b></label><input id="sC" type="range" min="1" max="10" step=".1" value="7" oninput="$('#sCo').textContent=(+this.value).toFixed(1)">
   <button class="btn" onclick="V.endSes(${id})">Finish and post</button><button class="btn ghost" onclick="closeSheet()">Discard</button>`);
  V.tmr=setInterval(()=>{const s=Math.floor((Date.now()-V.t0)/1e3);$('#tm').textContent=Math.floor(s/60)+':'+String(s%60).padStart(2,'0')},500);
},
endSes(id){
  if(!V.n)return toast('Tap 🤙 for each jump');
  V.log(id,spotOf(id).h,+$('#sC').value,`Session: ${V.n} jumps in ${Math.max(1,Math.round((Date.now()-V.t0)/6e4))} min`,'',V.n);
},

/* ---------- LOG + XP ---------- */
log(spot,h,sc,note,photo,n=1){
  const prev=best(mine().filter(a=>a.spot==spot)),pb=prev>0&&sc>prev;let big=pb;
  let g=10+Math.round(sc*2)+n*4+(pb?25:0)+(h>=10?10:0);
  const td=new Date().toDateString(),y=new Date(Date.now()-864e5).toDateString();
  if(S.last!==td){S.streak=S.last===y?S.streak+1:1;S.last=td}
  S.acts.unshift({id:Date.now(),who:'you',spot:+spot,h,sc,note:note||'Sent it',ts:Date.now(),k:0,cm:[],photo,n});
  if(nJ(mine().filter(a=>a.ts>=wk0()))>=5&&S.ch!==wk0()){S.ch=wk0();g+=50;big=true;toast('Weekly challenge done! +50 XP 🏆')}
  else toast('+'+g+' XP 🌊'+(pb?' · new PB!':''));
  S.xp+=g;save();buzz();if(big)confetti();go('feed');
},

/* ---------- SETTINGS ---------- */
settings(){
  sheet(`<h2>Settings</h2>
   <label>Units</label><div class="seg"><button class="${S.unit=='m'?'on':''}" onclick="V.set('unit','m')">Metres</button><button class="${S.unit=='ft'?'on':''}" onclick="V.set('unit','ft')">Feet</button></div>
   <label>Haptics</label><div class="seg"><button class="${S.vib?'on':''}" onclick="V.set('vib',1)">On</button><button class="${S.vib?'':'on'}" onclick="V.set('vib',0)">Off</button></div>
   <label>Accent colour</label><div class="sw">${['#00e5d0','#ff6b3d','#ffc233','#a98bff'].map(c=>`<i style="background:${c}" onclick="V.set('accent','${c}')"></i>`).join('')}</div>
   <button class="btn ghost" onclick="V.exp()">⬇️ Export data</button>
   <label class="btn ghost" style="text-align:center">⬆️ Import data<input type="file" accept=".json" hidden onchange="V.imp(this.files[0])"></label>
   <button class="btn ghost" onclick="if(confirm('Reset everything?')){localStorage.removeItem(KEY);location.reload()}">Reset all data</button>
   <button class="btn" onclick="closeSheet()">Done</button>`);
},
set(k,v){S[k]=v;save();document.documentElement.style.setProperty('--aqua',S.accent);V.settings();V.feed()},
exp(){const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([JSON.stringify(S)],{type:'application/json'}));a.download='splashmap.json';a.click()},
async imp(f){try{Object.assign(S,JSON.parse(await f.text()));save();location.reload()}catch(e){toast('Not a valid file')}}
};
