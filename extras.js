/* ---------- Map styles: dark / standard / satellite ---------- */
const BASES = {
  dark: ['https://tile.openstreetmap.org/{z}/{x}/{y}.png', '© OpenStreetMap contributors'],
  std:  ['https://tile.openstreetmap.org/{z}/{x}/{y}.png', '© OpenStreetMap contributors'],
  sat:  ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', 'Imagery © Esri']
};
function setBase(k) {
  S.base = k; save();
  M.map.eachLayer(l => { if (l instanceof L.TileLayer && !(l instanceof L.MarkerClusterGroup)) M.map.removeLayer(l); });
  L.tileLayer(BASES[k][0], { attribution: BASES[k][1], maxZoom: 19 }).addTo(M.map).bringToBack();
  $('#map').classList.toggle('dark', k === 'dark');
}
function cycleBase() {
  const o = ['dark', 'std', 'sat'], n = o[(o.indexOf(S.base || 'dark') + 1) % 3];
  setBase(n); toast({ dark: 'Dark map', std: 'Standard map', sat: 'Satellite 🛰️' }[n]);
}

/* ---------- Nearest spot ---------- */
function nearest() {
  if (!navigator.geolocation) return toast('No GPS available');
  navigator.geolocation.getCurrentPosition(p => {
    here = { lat: p.coords.latitude, lng: p.coords.longitude };
    const l = S.spots.map(s => [dist(here.lat, here.lng, s.lat, s.lng), s]).sort((a, b) => a[0] - b[0]);
    if (!l.length) return toast('No spots yet');
    toast(`Nearest: ${l[0][1].name} (${l[0][0].toFixed(1)} km)`);
    V.spot(l[0][1].id);
  }, () => toast('Location blocked'));
}

/* ---------- Emergency ---------- */
const EM = { AU: '000', NZ: '111', US: '911', UK: '999', EU: '112', JP: '119' };
function shareLoc() {
  if (!navigator.geolocation) return toast('No GPS available');
  navigator.geolocation.getCurrentPosition(p => {
    const t = `I need help. My location: https://maps.google.com/?q=${p.coords.latitude},${p.coords.longitude}`;
    navigator.share ? navigator.share({ text: t }).catch(() => {}) : (navigator.clipboard.writeText(t), toast('Location copied'));
  }, () => toast('Location blocked'));
}
function sos() {
  const c = S.em || 'AU';
  sheet(`<h2>🆘 Emergency</h2>
    <label>Country</label><select onchange="S.em=this.value;save();sos()">${Object.keys(EM).map(k => `<option ${k == c ? 'selected' : ''}>${k}</option>`).join('')}</select>
    <a class="btn" style="background:#ff4d4d;color:#fff;text-decoration:none" href="tel:${EM[c]}">📞 Call ${EM[c]}</a>
    <button class="btn ghost" onclick="shareLoc()">📍 Send my location</button>
    <div class="warn">Tell them: water rescue, the spot name, how many people, and whether anyone is injured. Stay on the line.</div>
    <button class="btn ghost" onclick="closeSheet()">Close</button>`);
}

/* ---------- Buddy timer ---------- */
let BT = null;
function buddy() {
  if (BT) return buddyRun();
  sheet(`<h2>⏱️ Buddy timer</h2><small>Set it before you jump. If you don't tap "I'm safe" in time, you get an alarm with quick call and location buttons.</small>
    <label>Check in within</label><select id="bm"><option value="15">15 min</option><option value="30">30 min</option><option value="60">1 hour</option><option value="120">2 hours</option></select>
    <button class="btn" onclick="buddyStart()">Start</button><button class="btn ghost" onclick="closeSheet()">Cancel</button>`);
}
function buddyStart() {
  if ('Notification' in window && Notification.permission === 'default') Notification.requestPermission();
  BT = { end: Date.now() + +$('#bm').value * 6e4 };
  BT.iv = setInterval(buddyTick, 1000); buddyRun();
}
function buddyRun() {
  sheet(`<h2>⏱️ Timer running</h2><div class="big" id="bt">--</div>
    <button class="btn" onclick="buddyStop()">✅ I'm safe</button>`);
  buddyTick();
}
function buddyStop() { clearInterval(BT.iv); BT = null; closeSheet(); toast('Checked in ✅'); }
function buddyTick() {
  if (!BT) return;
  const s = Math.ceil((BT.end - Date.now()) / 1e3), el = $('#bt');
  if (s <= 0) {
    clearInterval(BT.iv); BT = null;
    if (navigator.vibrate) navigator.vibrate([500, 200, 500, 200, 500]);
    if ('Notification' in window && Notification.permission === 'granted') new Notification('Splash Map', { body: 'Buddy timer finished. Are you safe?' });
    sheet(`<h2>⏰ Timer finished</h2><div class="warn bad">You didn't check in. Are you OK?</div>
      <button class="btn" onclick="closeSheet()">✅ I'm fine</button>
      <button class="btn ghost" onclick="shareLoc()">📍 Send my location</button>
      <button class="btn ghost" onclick="sos()">🆘 Emergency</button>`);
  } else if (el) el.textContent = Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}
addEventListener('visibilitychange', () => { if (!document.hidden) buddyTick(); });

/* ---------- Better conditions: waves, wind, UV, sunset, traffic light ---------- */
V.cond = async function (s) {
  const el = $('#cond');
  try {
    const [m, f] = await Promise.all([
      fetch(`https://marine-api.open-meteo.com/v1/marine?latitude=${s.lat}&longitude=${s.lng}&current=wave_height,sea_surface_temperature`).then(r => r.json()),
      fetch(`https://api.open-meteo.com/v1/forecast?latitude=${s.lat}&longitude=${s.lng}&current=wind_speed_10m,uv_index&daily=sunset&timezone=auto`).then(r => r.json())
    ]);
    const a = m.current || {}, c = f.current || {}, w = a.wave_height, k = c.wind_speed_10m;
    const lv = (w > 1.5 || k > 40) ? ['🔴 Rough', '#ff4d4d'] : (w > .8 || k > 25) ? ['🟠 Caution', '#ffc233'] : ['🟢 Calm', '#00e5d0'];
    el.style.borderColor = lv[1];
    el.innerHTML = `<b>${lv[0]}</b> · 🌊 ${w ?? '?'}m · 🌡️ ${a.sea_surface_temperature ?? '?'}°C · 💨 ${k ?? '?'} km/h · ☀️ UV ${c.uv_index ?? '?'}<br><small>Sunset ${((f.daily && f.daily.sunset[0]) || '').slice(11)} · Indicative only, always check locally.</small>`;
  } catch (e) { el.textContent = 'Conditions unavailable offline'; }
};

setBase(S.base || 'dark');
