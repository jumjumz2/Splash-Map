function go(t){
  document.querySelectorAll('.tab').forEach(x=>x.classList.toggle('on',x.id==='t-'+t));
  document.querySelectorAll('.nb').forEach(b=>b.classList.toggle('on',b.dataset.t===t));
  closeSheet();
  if(t==='feed')V.feed();else if(t==='rank')V.rank();else if(t==='me')V.me();
  else setTimeout(()=>M.map.invalidateSize(),350);
}
document.documentElement.style.setProperty('--aqua',S.accent);
M.init();V.feed();
