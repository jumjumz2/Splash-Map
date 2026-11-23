const KEY='splashmap.v2',$=s=>document.querySelector(s);
let saved={};try{saved=JSON.parse(localStorage.getItem(KEY)||'{}')}catch(e){}
const S=Object.assign({spots:SEED.spots,acts:SEED.acts,fav:[],follow:['kaiwater'],fo:0,xp:0,streak:0,last:'',unit:'m',vib:1,accent:'#00e5d0',rate:{},crowd:{},ch:0},saved);
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){toast('Storage full, export your data')}};

const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const fh=m=>S.unit==='m'?m+'m':Math.round(m*3.28)+'ft';
const ago=t=>{const m=(Date.now()-t)/6e4;return m<1?'now':m<60?Math.round(m)+'m':m<1440?Math.round(m/60)+'h':Math.round(m/1440)+'d'};
const dist=(a,b,c,d)=>{const r=x=>x*Math.PI/180,q=Math.sin(r(c-a)/2)**2+Math.cos(r(a))*Math.cos(r(c))*Math.sin(r(d-b)/2)**2;return 12742*Math.asin(Math.sqrt(q))};
const wk0=()=>{const d=new Date();d.setHours(0,0,0,0);d.setDate(d.getDate()-(d.getDay()+6)%7);return d.getTime()};
const lv=()=>Math.min(5,Math.floor(S.xp/150));
let here=null;

function toast(m){const t=$('#toast');t.textContent=m;t.classList.add('on');clearTimeout(t._t);t._t=setTimeout(()=>t.classList.remove('on'),2300)}
function buzz(){if(S.vib&&navigator.vibrate)navigator.vibrate(30)}
function sheet(h){clearInterval(V.tmr);$('#sheet').innerHTML='<div class="grab"></div>'+h;$('#sheet').classList.add('open')}
function closeSheet(){clearInterval(V.tmr);$('#sheet').classList.remove('open')}
function confetti(){for(let i=0;i<40;i++){const c=document.createElement('i');c.className='cf';c.style.left=Math.random()*100+'%';c.style.background=['#00e5d0','#ffc233','#ff6b3d','#2ec5ff'][i%4];c.style.animationDelay=Math.random()*.4+'s';document.body.appendChild(c);setTimeout(()=>c.remove(),2600)}}
