const M={f:'all',fv:false,add:false,pt:null,
init(){
  M.map=L.map('map',{zoomControl:false}).setView([-33.9,151.2],10);
  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap contributors',maxZoom:19}).addTo(M.map);
  M.cl=L.markerClusterGroup({maxClusterRadius:45}).addTo(M.map);
  M.map.on('click',e=>{if(!M.add)return;M.add=false;M.pt=e.latlng;V.newSpot()});
  $('#chips').innerHTML=
    `<button class="chip on" data-k="all" onclick="M.set('all',this)">All</button>`+
    Object.entries(T).map(([k,t])=>`<button class="chip" data-k="${k}" onclick="M.set('${k}',this)">${t.e} ${t.n}</button>`).join('')+
    `<button class="chip" onclick="M.fv=!M.fv;this.classList.toggle('on',M.fv);M.draw()">❤️ Saved</button>`+
    `<label class="chip" style="margin:0">Min height <input id="mh" type="range" min="0" max="30" value="0" oninput="M.draw()"><b id="mhv">0</b></label>`;
  M.draw();
},
set(k,b){M.f=k;document.querySelectorAll('.chip[data-k]').forEach(c=>c.classList.toggle('on',c===b));M.draw()},
draw(){
  const q=$('#q').value.toLowerCase(),mh=+$('#mh').value;$('#mhv').textContent=mh;
  M.cl.clearLayers();
  S.spots.filter(s=>(M.f=='all'||s.type==M.f)&&s.h>=mh&&s.name.toLowerCase().includes(q)&&(!M.fv||S.fav.includes(s.id))).forEach(s=>{
    const t=T[s.type];
    L.marker([s.lat,s.lng],{icon:L.divIcon({className:'',iconSize:[42,52],iconAnchor:[21,50],html:`<div class="pin" style="--c:${t.c}">${t.e}</div>`})})
      .on('click',()=>V.spot(s.id)).addTo(M.cl);
  });
},
locate(){
  if(!navigator.geolocation)return toast('No GPS available');
  navigator.geolocation.getCurrentPosition(p=>{
    here={lat:p.coords.latitude,lng:p.coords.longitude};
    M.map.flyTo([here.lat,here.lng],12);
    L.circleMarker([here.lat,here.lng],{radius:8,color:'#fff',fillColor:'#2e8bff',fillOpacity:1}).addTo(M.map);
    toast('Found you 📍');
  },()=>toast('Location blocked (needs https or localhost)'));
},
addMode(){go('map');M.add=true;toast('Tap the map to place your spot')}
};
