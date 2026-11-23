let deferred = null;
const standalone = matchMedia('(display-mode: standalone)').matches || navigator.standalone;

if (standalone) $('#inst').hidden = true;

addEventListener('beforeinstallprompt', e => { e.preventDefault(); deferred = e; });

function installApp() {
  if (deferred) { deferred.prompt(); deferred = null; return; }
  sheet(`<h2>Install Splash Map</h2>
    <div class="warn"><b>iPhone / iPad:</b> tap the Share button in Safari, then <b>Add to Home Screen</b>.</div>
    <div class="warn"><b>Android / Chrome:</b> open the browser menu (⋮), then <b>Install app</b>.</div>
    <button class="btn ghost" onclick="closeSheet()">Got it</button>`);
}

function netState() { $('#off').hidden = navigator.onLine; }
addEventListener('online', netState);
addEventListener('offline', netState);
netState();

if ('serviceWorker' in navigator) {
  const had = !!navigator.serviceWorker.controller;
  navigator.serviceWorker.register('sw.js').catch(() => {});
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (had) { toast('Updated, reloading…'); setTimeout(() => location.reload(), 900); }
  });
}

if (location.hash === '#log') V.record();
