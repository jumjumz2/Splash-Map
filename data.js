const T={manu:{n:'Manu',e:'💥',c:'#ff6b3d'},cliff:{n:'High Dive',e:'🪂',c:'#ffc233'},chill:{n:'Chill',e:'🌊',c:'#2ec5ff'}};
const AMEN=['🪜 Ladder','🅿️ Parking','🚻 Toilets','🌳 Shade','🍔 Food nearby','🚌 Transit'];
const CHECK=['I checked the water depth','I checked tide and current','Landing zone is clear of rocks and boats','I am not jumping alone'];
const LEVELS=['Pebble','Paddler','Swimmer','Bomber','Cliff Hanger','Legend'];
const nJ=m=>m.reduce((t,a)=>t+(a.n||1),0);
const BADGES=[
 ['🌱','First splash',m=>m.length>=1],['🔥','5 jumps',m=>nJ(m)>=5],['💯','25 jumps',m=>nJ(m)>=25],
 ['⭐','9+ splash',m=>m.some(a=>a.sc>=9)],['🏔️','10m+ jump',m=>m.some(a=>a.h>=10)],
 ['🗺️','3 spots',m=>new Set(m.map(a=>a.spot)).size>=3],['📆','3-day streak',()=>S.streak>=3],['❤️','3 saved',()=>S.fav.length>=3]];

/* Sample data only. Replace with your own spots. */
const SEED={
 spots:[
  {id:1,name:'Sample Wharf',type:'manu',lat:-33.855,lng:151.21,h:6,d:4,w:'Check tide and boat traffic first.',tags:[0,1],v:Date.now()-2592e6,vb:4.8,hz:[]},
  {id:2,name:'Sample Headland',type:'cliff',lat:-33.83,lng:151.28,h:12,d:6,w:'Strong current on the ebb. Scout the landing.',tags:[3],v:Date.now()-8e9,vb:4.5,hz:[]},
  {id:3,name:'Sample Cove',type:'chill',lat:-34.07,lng:151.15,h:1,d:2,w:'Shallow at low tide. Watch for rocks.',tags:[2,3,5],v:Date.now()-5e8,vb:4.9,hz:[]}],
 acts:[
  {id:1,who:'kaiwater',spot:1,h:6,sc:9.1,note:'Whole wharf cheered',ts:Date.now()-72e4,k:24,cm:[['marina_dives','Huge!']]},
  {id:2,who:'marina_dives',spot:2,h:12,sc:8.4,note:'Clean pike off the top ledge',ts:Date.now()-36e5,k:41,cm:[]},
  {id:3,who:'bomb_squad',spot:1,h:5,sc:8.7,note:'Triple bomb, all at once',ts:Date.now()-108e5,k:18,cm:[]},
  {id:4,who:'tide_chaser',spot:3,h:1,sc:7.2,note:'Water was glass today',ts:Date.now()-18e6,k:12,cm:[]}]
};
