(function(){
const P=window.PLACES, R=window.ROUTES, G=window.GEO, PH=window.PHOTOS||{}, PG=window.PAGES||{}, EV=window.EV||{};
const svg=d3.select('#map'), box=document.querySelector('.mapbox'), panel=document.getElementById('panel');
const byId=Object.fromEntries(R.map(r=>[r.id,r]));
const colOf=r=>r.g==='c'?'var(--rc)':`var(${r.col})`;
// which routes contain each place
const inRoutes={};R.forEach(r=>{new Set(r.legs.flat().concat(r.x||[])).forEach(p=>{(inRoutes[p]=inRoutes[p]||[]).push(r.id)})});

// chapters
const CHS=['I','II','III','IV','V','VI','VII','VIII','IX','X','MQ'];
const CHN={I:'Introduction',II:'My Father',III:'My First Tutor',IV:'Bogachevsky',V:'Mr X or Captain Pogossian',VI:'Abram Yelov',VII:'Prince Yuri Lubovedsky',VIII:'Ekim Bey',IX:'Piotr Karpenko',X:'Professor Skridlov',MQ:'The Material Question'};
function chList(s){const out=new Set();String(s||'').split(',').map(x=>x.trim()).filter(Boolean).forEach(x=>{const m=x.split(/[–-]/);if(m.length===2){const a=CHS.indexOf(m[0].trim()),b=CHS.indexOf(m[1].trim());if(a>=0&&b>=a)for(let i=a;i<=b;i++)out.add(CHS[i]);}else out.add(x);});return out;}
const placeCh={};Object.entries(P).forEach(([id,p])=>placeCh[id]=chList(p.ch));
const routeCh={};R.forEach(r=>routeCh[r.id]=chList(r.ch));
let curCh=null;
// variant readings: where the English and Adelphi editions put a place differently
const VAR={
  ganges:{txt:'English: up the Ganges. Adelphi: up the Indus. The dotted pin marks the Indus reading, placed on the river’s upper course only for illustration; neither edition gives a route.',ghost:[77.5,34.2],gl:'Indus (Adelphi)'},
  pointf:{txt:'English: “up the course of the river Sharakshan”, a river unknown to geography. Adelphi: the Charchan Darya (Qarqan). The pin follows the Adelphi reading; on the English reading there is nothing to place.',note:'“Sharakshan” (Eng.) · Charchan (Adelphi)',end:1},
  margelan:{txt:'Known only from the Adelphi edition, because the page is missing from the scanned English copy; the English wording and spelling could not be checked.',note:'Adelphi only'}
};
let W=box.clientWidth,H=box.clientHeight;
const proj=d3.geoMercator();
const extentGeo={type:'MultiPoint',coordinates:[[-3,50],[100,40],[40,6],[45,60],[82,8]]};
function fit(){W=box.clientWidth;H=box.clientHeight;svg.attr('viewBox',`0 0 ${W} ${H}`);proj.fitExtent([[20,20],[W-20,H-20]],extentGeo);}
fit();
const path=d3.geoPath(proj);
const world=svg.append('g');
const gBase=world.append('g'), gRel=world.append('g').attr('class','relief'), gBord=world.append('g').attr('display','none'), gHist=world.append('g'), gRiv=world.append('g'), gWater=world.append('g'), gPol=world.append('g');
const gZone=world.append('g'), gRoutes=world.append('g'), gCap=world.append('g'), gPts=world.append('g'), gLbl=world.append('g'), gVar=world.append('g').attr('class','var').attr('display','none');
const POL=[['Russian Empire',52,54,1],['Ottoman Empire',33.5,39.3,1],['Persia',55,32.3,1],['Afghanistan',65.3,33.0,1],['Bukhara & Khiva',61.2,40.9,2],['British India',77.5,22.5,1],['Qing Empire',89,35.5,1],['Egypt',28.3,25.2,1],['Ethiopia',39.2,8.3,2],['Arabia',45.5,24.5,2],['Austria-Hungary',17,47.9,2],['German Empire',10.5,51.0,2],['France',2.3,46.6,2],['Italy',13.8,42.3,3],['Greece',21.8,39.3,3],['Bulgaria',25.3,42.9,3],['Romania',25,45.9,3],['Serbia',21,43.9,3],['United Kingdom',-3.5,52.3,3]];
const CAP=[['St Petersburg',30.32,59.94,0],['Constantinople',28.98,41.01,0],['Teheran',51.39,35.69,1],['Kabul',69.17,34.53,0],['Bukhara',64.42,39.77,0],['Khiva',60.36,41.38,2],['Calcutta',88.36,22.57,1],['Cairo',31.24,30.05,0],['Addis Ababa',38.75,9.03,2],['Vienna',16.37,48.21,2],['Berlin',13.40,52.52,0],['Paris',2.35,48.86,0],['London',-0.13,51.51,0],['Rome',12.50,41.90,0],['Athens',23.73,37.98,2],['Sofia',23.32,42.70,3],['Bucharest',26.10,44.43,3],['Belgrade',20.46,44.82,3]];

function drawBase(){
  gBase.selectAll('*').remove();gRiv.selectAll('*').remove();gBord.selectAll('*').remove();gWater.selectAll('*').remove();
  gBase.append('path').attr('class','grat').attr('d',path(d3.geoGraticule().step([10,10]).extent([[-20,-10],[120,70]])()));
  gBase.append('path').attr('class','land').attr('d',path({type:'MultiPolygon',coordinates:G.land}));
  gBase.append('path').attr('class','lake').attr('d',path({type:'MultiPolygon',coordinates:G.lakes.map(l=>l.c)}));
  gRel.selectAll('*').remove();
  if(window.RELIEF){const [L0,L1,B0,B1]=RELIEF.b, a=proj([L0,B1]), z=proj([L1,B0]);
    gRel.append('image').attr('href',RELIEF.src).attr('x',a[0]).attr('y',a[1]).attr('width',z[0]-a[0]).attr('height',z[1]-a[1]).attr('preserveAspectRatio','none');}
  gBord.append('path').attr('class','bord').attr('d',path({type:'MultiLineString',coordinates:G.borders}));
  gHist.selectAll('*').remove();gPol.selectAll('*').remove();gCap.selectAll('*').remove();
  gHist.append('path').attr('class','hist').attr('d',path({type:'MultiLineString',coordinates:window.HIST}));
  gPol.selectAll('text').data(POL).join('text').attr('class','polity').attr('text-anchor','middle').attr('transform',d=>`translate(${proj([d[1],d[2]])})`).text(d=>d[0]);
  const cg=gCap.selectAll('g').data(CAP).join('g').attr('class','cap').attr('transform',d=>`translate(${proj([d[1],d[2]])})`);
  cg.append('title').text(d=>d[0]+', capital c. 1900');
  cg.append('rect');
  cg.filter(d=>d[3]>0).append('text').attr('class','caplbl').text(d=>d[0]);
  gRiv.selectAll('path').data(G.rivers).join('path').attr('class','river')
    .attr('stroke-width',d=>d.s<=3?1.3:d.s<=5?.9:.7).attr('d',d=>path({type:'LineString',coordinates:d.c}));
  const waters=[['Black Sea',34.5,43.1],['Caspian Sea',50.8,42.0],['Mediterranean Sea',19,34.8],['Red Sea',38.3,20.3],['Persian Gulf',51.3,27.2],['Aral Sea',59.8,45.2],['Arabian Sea',63,17],['Bay of Bengal',88,15]];
  gWater.selectAll('text').data(waters).join('text').attr('class','water').attr('text-anchor','middle')
    .attr('transform',d=>`translate(${proj([d[1],d[2]])})`).text(d=>d[0]);
  const rl=[['Amu Darya',63.9,39.4],['Nile',31.3,27.6],['Euphrates',41.0,34.6],['Tigris',43.9,35.6],['Volga',46.6,50.4],['Indus',70.2,28.4],['Aras',45.6,39.45],['Kura',47.2,40.6],['Panj',70.4,37.6],['Syr Darya',66.2,44.6],['Tarim',84.6,41.0],['Zarafshon',66.0,39.95],['Ganges',82.5,25.1]];
  gRiv.selectAll('text').data(rl).join('text').attr('class','rlabel').attr('text-anchor','middle')
    .attr('transform',d=>`translate(${proj([d[1],d[2]])})`).text(d=>d[0]);
}

function drawRoutes(){
  gRoutes.selectAll('*').remove();gZone.selectAll('*').remove();
  R.forEach(r=>{
    const g=gRoutes.append('g').attr('class','route'+(r.g==='c'?' comp':'')).attr('data-id',r.id);
    r.legs.forEach((leg,li)=>{
      for(let i=0;i<leg.length-1;i++){
        const a=P[leg[i]],b=P[leg[i+1]];
        const cj=a.c==='cj'||b.c==='cj';
        g.append('path').attr('class','seg'+(cj?' cj':'')+(r.g==='c'?' comp':''))
          .attr('style',`stroke:${colOf(r)}`+((r.id==='sarmoung'&&li===1)?';opacity:.55':''))
          .attr('d',path({type:'LineString',coordinates:[a.ll,b.ll]}));
      }
    });
  });
}

function drawVar(){
  gVar.selectAll('*').remove();
  Object.entries(VAR).forEach(([id,v])=>{
    const a=proj(P[id].ll), g=gVar.append('g').attr('data-id',id);
    g.append('circle').attr('class','ring').attr('cx',a[0]).attr('cy',a[1]).attr('data-r',14);
    if(v.ghost){const b=proj(v.ghost);
      g.append('path').attr('class','vlink').attr('d',`M${a[0]},${a[1]}L${b[0]},${b[1]}`);
      g.append('circle').attr('class','vghost').attr('cx',b[0]).attr('cy',b[1]).attr('data-r',5).on('click',e=>{e.stopPropagation();showPlace(id);}).append('title').text(v.gl);
      g.append('text').attr('class','vlbl').attr('x',b[0]).attr('y',b[1]).attr('data-dx',8).attr('data-dy',4).text(v.gl);
    } else g.append('text').attr('class','vlbl').attr('x',a[0]).attr('y',a[1]).attr('data-dx',v.end?-10:10).attr('data-dy',18).attr('text-anchor',v.end?'end':null).text(v.note);
  });
}
let k=1;
function drawPoints(){
  gPts.selectAll('*').remove();gLbl.selectAll('*').remove();
  const ents=Object.entries(P).sort((a,b)=>b[1].ll[1]-a[1].ll[1]);
  const pts=gPts.selectAll('g').data(ents).join('g').attr('class',([id,p])=>`pt ${p.c}`).attr('data-id',([id])=>id).attr('data-ev',([id])=>(EV[id]||['pl'])[0])
    .attr('tabindex',0).attr('role','button').attr('aria-label',([id,p])=>p.n)
    .attr('transform',([id,p])=>`translate(${proj(p.ll)})`)
    .on('click',(e,[id])=>{e.stopPropagation();showPlace(id)})
    .on('keydown',(e,[id])=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();showPlace(id)}});
  pts.append('title').text(([id,p])=>`${p.n} — ${p.m}`);
  const inner=pts.append('g').attr('class','pin');
  inner.append('path').attr('class','mk').attr('d','M0,0 C-1.6,-4.2 -6,-7.6 -6,-12.5 A6,6 0 1 1 6,-12.5 C6,-7.6 1.6,-4.2 0,0Z');
  inner.append('circle').attr('class','dot').attr('cy',-12.5).attr('r',2.2);
  gLbl.selectAll('text').data(ents).join('text').attr('class',([id,p])=>'lbl '+p.c).attr('data-id',([id])=>id)
    .attr('transform',([id,p])=>`translate(${proj(p.ll)})`).text(([id,p])=>p.n.replace(/^“|”$/g,''));
  scaleMarks();
}

function scaleMarks(){
  const sm=W<600?.9:1;
  gPts.selectAll('g.pin').attr('transform',`scale(${sm*1.05/k})`);
  const fs=13.5*sm/k;
  gLbl.selectAll('text').attr('font-size',fs).attr('dx',8.5/k).attr('dy',-9/k)
    .attr('display',function([id,p]){
      const on=this.classList.contains('on')||this.classList.contains('inch');
      if(on) return null;
      const t=p.t, thr=W<600?[1,2.2,4.5]:[1,1.8,3.6];
      return k>=thr[t-1]?null:'none';
    });
  gWater.selectAll('text').attr('font-size',13.5/k);
  const thr=W<600?[1,2.2,4.5]:[1,1.8,3.6];
  gPol.selectAll('text').attr('font-size',(14.5*sm)/Math.sqrt(k)/Math.sqrt(k)*(k>1?1:1)).attr('display',d=>k>=thr[d[3]-1]?null:'none');
  const cs=9*sm/k; gCap.selectAll('rect').attr('x',-cs/2).attr('y',-cs/2).attr('width',cs).attr('height',cs);
  gCap.selectAll('text').attr('font-size',13*sm/k).attr('dx',7/k).attr('dy',4/k).attr('display',d=>k>=thr[d[3]-1]?null:'none');
  gRiv.selectAll('text').attr('font-size',11.5/k).attr('display',k>=1.8?null:'none');
  // halos are drawn in map units, so thin them as the map is magnified
  gLbl.selectAll('text').style('stroke-width',3.5/k+'px');
  gPol.selectAll('text').style('stroke-width',3/k+'px');
  gCap.selectAll('text').style('stroke-width',3/k+'px');
  gWater.selectAll('text').style('stroke-width',2/k+'px');
  gRiv.selectAll('text').style('stroke-width',2.5/k+'px');
  // the relief is a 2-arc-minute image: fade it out before its pixels show
  gRel.attr('opacity',k<=2.5?1:k>=6?0:1-(k-2.5)/3.5);
  gVar.selectAll('circle').attr('r',function(){return (+this.dataset.r)/k;});
  gVar.selectAll('text').attr('font-size',13*sm/k).attr('dx',function(){return (+this.dataset.dx)/k}).attr('dy',function(){return (+this.dataset.dy)/k}).style('stroke-width',3/k+'px');
}

const zoom=d3.zoom().scaleExtent([1,40]).on('zoom',e=>{world.attr('transform',e.transform);if(Math.abs(e.transform.k-k)>1e-3){k=e.transform.k;scaleMarks();}});
svg.call(zoom).on('dblclick.zoom',null);
svg.on('click',()=>{});
document.getElementById('zin').onclick=()=>svg.transition().duration(300).call(zoom.scaleBy,1.6);
document.getElementById('zout').onclick=()=>svg.transition().duration(300).call(zoom.scaleBy,1/1.6);
document.getElementById('zreset').onclick=()=>svg.transition().duration(450).call(zoom.transform,d3.zoomIdentity);

function zoomToIds(ids,maxK=7){
  const xy=ids.map(i=>proj(P[i].ll));
  const [x0,x1]=d3.extent(xy,d=>d[0]),[y0,y1]=d3.extent(xy,d=>d[1]);
  const pad=60, sk=Math.min(maxK,.9/Math.max((x1-x0+pad)/W,(y1-y0+pad)/H));
  const kk=Math.max(1,sk), cx=(x0+x1)/2, cy=(y0+y1)/2;
  const t=d3.zoomIdentity.translate(W/2,H/2).scale(kk).translate(-cx,-cy);
  const reduce=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  (reduce?svg:svg.transition().duration(650)).call(zoom.transform,t);
}

// selection
let curRoute=null,curPlace=null;
function applySel(){
  const on=new Set();
  if(curRoute){byId[curRoute].legs.flat().concat(byId[curRoute].x||[]).forEach(p=>on.add(p));}
  world.classed('sel',!!curRoute);
  gRoutes.selectAll('.route').classed('on',function(){return this.dataset.id===curRoute});
  gRoutes.selectAll('.route').filter(function(){return this.dataset.id===curRoute}).raise();
  const rc=curRoute?colOf(byId[curRoute]):null;
  gPts.selectAll('.pt').classed('on',function(){return on.has(this.dataset.id)}).classed('cur',function(){return this.dataset.id===curPlace})
    .style('--pc',function(){return rc&&!evOn&&on.has(this.dataset.id)?rc:null});
  gLbl.selectAll('.lbl').classed('on',function(){return on.has(this.dataset.id)||this.dataset.id===curPlace});
  world.classed('chap',!!curCh);
  gRoutes.selectAll('.route').classed('inch',function(){return !!curCh&&routeCh[this.dataset.id].has(curCh)});
  gPts.selectAll('.pt').classed('inch',function(){return !!curCh&&placeCh[this.dataset.id].has(curCh)});
  gLbl.selectAll('.lbl').classed('inch',function(){return !!curCh&&placeCh[this.dataset.id].has(curCh)});
  scaleMarks();
}

let evOn=false;
function setHash(h){try{history.replaceState(null,'',h?('#'+h):(location.pathname+location.search));}catch(e){}}
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const evTxt={doc:'Documented',pl:'Plausible',un:'Unverifiable',pr:'Problematic'};
const certTxt={id:'Named and identified',ap:'Named; location approximate',cj:'Unnamed or withheld; placed by conjecture'};
const certSvg={id:'<svg width="12" height="16" viewBox="-7 -20 14 21"><path d="M0,0 C-1.6,-4.2 -6,-7.6 -6,-12.5 A6,6 0 1 1 6,-12.5 C6,-7.6 1.6,-4.2 0,0Z" fill="var(--ink)" stroke="#fff" stroke-width="1"/><circle cx="0" cy="-12.5" r="2.2" fill="#fff"/></svg>',ap:'<svg width="12" height="16" viewBox="-7 -20 14 21"><path d="M0,0 C-1.6,-4.2 -6,-7.6 -6,-12.5 A6,6 0 1 1 6,-12.5 C6,-7.6 1.6,-4.2 0,0Z" fill="#fff" stroke="var(--ink)" stroke-width="1.5"/><circle cx="0" cy="-12.5" r="2.2" fill="var(--ink)"/></svg>',cj:'<svg width="12" height="16" viewBox="-7 -20 14 21"><path d="M0,0 C-1.6,-4.2 -6,-7.6 -6,-12.5 A6,6 0 1 1 6,-12.5 C6,-7.6 1.6,-4.2 0,0Z" fill="#fff" stroke="var(--ink)" stroke-width="1.4" stroke-dasharray="2.4 1.8"/></svg>'};

function showHome(){
  curRoute=null;curPlace=null;applySel();
  if(curCh){showChapter();return;}
  const item=r=>`<li><button class="rbtn" data-r="${r.id}"><span class="sw" style="background:${colOf(r)}"></span><span class="ti">${esc(r.t)}</span><span class="ch">${esc(r.w==='Undated'?'Ch. '+r.ch:r.w)}</span></button></li>`;
  panel.innerHTML=`<h2>The journeys</h2>
    <p class="meta">Gurdjieff calls his circle the Seekers of Truth. Its travels run from Ani to Keriya and from Abyssinia to Siberia; the book’s later chapters add his flight west after 1917.</p>
    <h3>Gurdjieff’s journeys</h3><ul class="rlist">${R.filter(r=>r.g==='g').map(item).join('')}</ul>
    <h3>Companions’ paths</h3><ul class="rlist">${R.filter(r=>r.g==='c').map(item).join('')}</ul>
    <p class="meta" style="margin-top:16px">Chapter numbers follow the book: II My Father, III My First Tutor, IV Bogachevsky, V Captain Pogossian, VI Abram Yelov, VII Prince Yuri Lubovedsky, VIII Ekim Bey, IX Piotr Karpenko, X Professor Skridlov; MQ The Material Question.</p>`;
  panel.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>showRoute(b.dataset.r));
  panel.scrollTop=0;
  if(hashReady) setHash('');
}

function chIds(){return Object.keys(P).filter(id=>placeCh[id].has(curCh));}
function showChapter(){
  const item=r=>`<li><button class="rbtn" data-r="${r.id}"><span class="sw" style="background:${colOf(r)}"></span><span class="ti">${esc(r.t)}</span><span class="ch">${esc(r.w==='Undated'?'Ch. '+r.ch:r.w)}</span></button></li>`;
  const rs=R.filter(r=>routeCh[r.id].has(curCh)), ids=chIds().sort((a,b)=>P[a].n.replace(/[“”]/g,'').localeCompare(P[b].n.replace(/[“”]/g,'')));
  panel.innerHTML=`<button class="back" id="bk">← The whole book</button>
    <h2>${curCh==='MQ'?'':'Chapter '+curCh+': '}${esc(CHN[curCh])}</h2>
    <p class="meta">${ids.length} place${ids.length===1?'':'s'} and ${rs.length||'no'} journey${rs.length===1?'':'s'} in this ${curCh==='MQ'?'closing account':'chapter'}.</p>
    ${rs.length?`<h3>Journeys</h3><ul class="rlist">${rs.map(item).join('')}</ul>`:''}
    ${ids.length?`<h3>Places</h3><div class="chips">${ids.map(p=>`<button class="chip" data-p="${p}">${esc(P[p].n)}</button>`).join('')}</div>`:''}`;
  document.getElementById('bk').onclick=()=>setChapter(null);
  panel.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>showRoute(b.dataset.r));
  panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>showPlace(b.dataset.p));
  panel.scrollTop=0;
  if(hashReady) setHash('ch-'+curCh);
}
const chBtns=[...document.querySelectorAll('.chapbar [data-ch]')];
function filterLists(){
  document.querySelectorAll('#glossary,#characters').forEach(sec=>{
    let n=0;
    sec.querySelectorAll('.glist .gi').forEach(el=>{
      const m=(el.querySelector('.gbody p')||{}).textContent||'', c=(m.match(/^\(Ch\. ([IVX]+|MQ)/)||[])[1];
      const show=!curCh||c===curCh; el.hidden=!show; if(show)n++;
    });
    const note=sec.querySelector('.chnote');
    if(note){note.hidden=!curCh;
      if(curCh){note.innerHTML=`${n?`Showing the ${sec.id==='characters'?(n===1?'one other figure':n+' other figures'):(n===1?'one entry':n+' entries')} first met in ${curCh==='MQ'?'The Material Question':'Chapter '+curCh}.`:`No ${sec.id==='characters'?'other figure':'entry'} is first met in ${curCh==='MQ'?'The Material Question':'Chapter '+curCh}.`} <button type="button">Show all</button>`;note.querySelector('button').onclick=()=>setChapter(null);}}
  });
  document.dispatchEvent(new CustomEvent('atlas:chapter',{detail:curCh}));
}
function setChapter(c,zoomIt=true){
  curCh=c||null;
  chBtns.forEach(b=>b.setAttribute('aria-pressed',(b.dataset.ch||null)===curCh));
  filterLists();
  showHome();
  if(curCh){const ids=chIds();if(ids.length)zoomToIds(ids,5);}
  else if(zoomIt) svg.transition().duration(450).call(zoom.transform,d3.zoomIdentity);
}
chBtns.forEach(b=>b.onclick=()=>setChapter(b.dataset.ch));
function showRoute(id,zoomIt=true){
  const r=byId[id];curRoute=id;curPlace=null;applySel();
  if(r.g==='c'&&!compOn){setComp(true);}
  const legs=r.legs.map((leg,i)=>{
    const lab=r.legs.length>1?`<div class="leg">${i===0?'Main route':'Further leg '+i}</div>`:'';
    return lab+`<ol class="stops">${leg.map(p=>`<li><button data-p="${p}"><span class="nm">${esc(P[p].n)}<span class="md">${esc(P[p].m)}</span></span></button></li>`).join('')}</ol>`;
  }).join('');
  const extra=(r.x||[]).length?`<h3>Also in this part of the book</h3><div class="chips">${r.x.map(p=>`<button class="chip" data-p="${p}">${esc(P[p].n)}</button>`).join('')}</div>`:'';
  panel.innerHTML=`<button class="back" id="bk">← ${curCh?(curCh==='MQ'?'The Material Question':'Chapter '+curCh):'All journeys'}</button>
    <h2 style="display:flex;gap:10px;align-items:center"><span style="width:18px;height:4px;border-radius:2px;background:${colOf(r)};flex:none"></span>${esc(r.t)}</h2>
    <p class="meta">${r.ch==='MQ'?'The Material Question':'Chapter '+esc(r.ch)} · ${esc(r.w)}</p>
    <p>${esc(r.s)}</p>
    <h3>Stops in the book’s order</h3>${legs}${extra}`;
  document.getElementById('bk').onclick=showHome;
  panel.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>showPlace(b.dataset.p,id));
  panel.scrollTop=0;
  if(zoomIt){const ids=[...new Set(r.legs.flat())];zoomToIds(ids,6);}
  setHash('r-'+id);
}

function showPlace(id,fromRoute){
  const p=P[id];curPlace=id;
  if(fromRoute) curRoute=fromRoute;
  applySel();
  const rs=(inRoutes[id]||[]).map(i=>byId[i]);
  const backBtn=curRoute?`<button class="back" id="bk">← ${esc(byId[curRoute].t)}</button>`:`<button class="back" id="bk">← ${curCh?(curCh==='MQ'?'The Material Question':'Chapter '+curCh):'All journeys'}</button>`;
  panel.innerHTML=`${backBtn}
    <h2>${esc(p.n)}</h2>
    <p class="meta">${esc(p.m)}${p.ch?' · Chapter '+esc(p.ch):''}</p>
    <p><span class="badge">${certSvg[p.c]}${certTxt[p.c]}</span></p>
    ${PH[id]?`<figure class="ph"><img src="${PH[id].src}" alt="${esc(PH[id].cap)}" width="${id==='echmiadzin'||id==='samarkand'?160:220}"><figcaption>${esc(PH[id].cap)}<span class="cr">${esc(PH[id].cr)}</span></figcaption></figure>`:''}
    <p>${esc(p.d)}</p>
    ${EV[id]?`<p class="evline"><i class="evd" style="background:var(--ev-${EV[id][0]})"></i> <b>${evTxt[EV[id][0]]}.</b>${(EV[id][0]==='doc'||EV[id][0]==='pr')?' '+esc(EV[id][1]):''}</p>`:''}
    ${VAR[id]?`<p class="varline"><b>Variant reading.</b> ${esc(VAR[id].txt)}</p>`:''}
    ${PG[id]?`<p class="pages">Pages in the English edition: ${PG[id].map(esc).join(', ')}</p>`:(id==='margelan'?'<p class="pages">The English scan lacks the page on which Margelan appears; the name is taken from the Adelphi edition.</p>':'')}
    ${rs.length?`<h3>Appears in</h3><div class="chips">${rs.map(r=>`<button class="chip" data-r="${r.id}"><i style="background:${colOf(r)}"></i>${esc(r.t)}</button>`).join('')}</div>`:''}
    <p class="meta" style="margin-top:14px">Coordinates used: ${p.ll[1].toFixed(2)}° N, ${p.ll[0].toFixed(2)}° E</p>`;
  document.getElementById('bk').onclick=()=>curRoute?showRoute(curRoute,false):showHome();
  panel.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>showRoute(b.dataset.r));
  panel.scrollTop=0;
  setHash('p-'+id);
  const t=d3.zoomTransform(svg.node()), xy=proj(p.ll), sx=t.applyX(xy[0]), sy=t.applyY(xy[1]);
  if(sx<40||sx>W-40||sy<40||sy>H-40||t.k<2.2){zoomToIds([id],Math.max(t.k,3.2));}
}

// toggles
const tH=document.getElementById('tHist');
tH.onclick=()=>{const v=tH.getAttribute('aria-pressed')!=='true';tH.setAttribute('aria-pressed',v);[gHist,gPol,gCap].forEach(g=>g.attr('display',v?null:'none'));};
const tR=document.getElementById('tRel');
tR.onclick=()=>{const v=tR.getAttribute('aria-pressed')!=='true';tR.setAttribute('aria-pressed',v);gRel.attr('display',v?null:'none');};
const tB=document.getElementById('tBorders'),tC=document.getElementById('tComp'),tO=document.getElementById('tOnly');
tB.onclick=()=>{const v=tB.getAttribute('aria-pressed')!=='true';tB.setAttribute('aria-pressed',v);gBord.attr('display',v?null:'none');};
let compOn=false;
function setComp(v){compOn=v;tC.setAttribute('aria-pressed',v);gRoutes.selectAll('.route.comp').attr('display',v?null:'none');}
tC.onclick=()=>setComp(!compOn);
const tE=document.getElementById('tEv'), keyEv=document.getElementById('keyEv');
tE.onclick=()=>{evOn=!evOn;tE.setAttribute('aria-pressed',evOn);world.classed('ev',evOn);keyEv.hidden=!evOn;applySel();};
const tV=document.getElementById('tVar');
tV.onclick=()=>{const v=tV.getAttribute('aria-pressed')!=='true';tV.setAttribute('aria-pressed',v);gVar.attr('display',v?null:'none');};
tO.onclick=()=>{const v=tO.getAttribute('aria-pressed')!=='true';tO.setAttribute('aria-pressed',v);world.classed('hideall',v);};

function drawAll(){drawBase();drawRoutes();drawVar();drawPoints();setComp(compOn);applySel();}
drawAll();
let rt;window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{const w=box.clientWidth,h=box.clientHeight;if(Math.abs(w-W)<2&&Math.abs(h-H)<2)return;fit();drawAll();svg.call(zoom.transform,d3.zoomIdentity);},200);});

let hashReady=false;
function fromHash(){
  const h=decodeURIComponent((location.hash||'').slice(1));
  if(h.startsWith('ch-')&&CHS.includes(h.slice(3))) {setChapter(h.slice(3));return true;}
  if(h.startsWith('r-')&&byId[h.slice(2)]) {showRoute(h.slice(2));return true;}
  if(h.startsWith('p-')&&P[h.slice(2)]) {showPlace(h.slice(2));return true;}
  if(byId[h]) {showRoute(h);return true;}
  if(P[h]) {showPlace(h);return true;}
  return false;
}
if(!fromHash()) showHome();
hashReady=true;
window.addEventListener('hashchange',()=>{if(fromHash()) document.querySelector('.layout').scrollIntoView({block:'start'});});
// search
const q=document.getElementById('q'), qres=document.getElementById('qres');
const norm=s=>s.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLowerCase();
const IDX=[];
Object.entries(P).forEach(([id,p])=>IDX.push({t:p.n.replace(/[“”]/g,''),x:p.n+' '+p.m,k:'Place',go:()=>{showPlace(id);document.querySelector('.layout').scrollIntoView({block:'start'});}}));
R.forEach(r=>IDX.push({t:r.t.replace(/[“”]/g,''),x:r.t,k:'Journey',go:()=>{showRoute(r.id);document.querySelector('.layout').scrollIntoView({block:'start'});}}));
document.querySelectorAll('.gi[id]').forEach(el=>{const t=el.querySelector('em').textContent;IDX.push({t,x:t,k:el.closest('#characters')?'Character':'Glossary',go:()=>{if(el.closest('#webdata')){window.ATLASWEB&&window.ATLASWEB.show(el.id.slice(2));return;}el.hidden=false;el.open=true;el.scrollIntoView({block:'center'});el.classList.add('flash');setTimeout(()=>el.classList.remove('flash'),1600);}});});
IDX.forEach(o=>o.n=norm(o.x));
let hits=[],sel=-1;
function renderHits(){
  qres.innerHTML=hits.map((o,i)=>`<li role="option" id="qo${i}" aria-selected="${i===sel}"><span>${esc(o.t)}</span><span class="k">${o.k}</span></li>`).join('');
  qres.hidden=!hits.length; q.setAttribute('aria-expanded',!!hits.length);
  qres.querySelectorAll('li').forEach((li,i)=>li.onmousedown=e=>{e.preventDefault();pick(i);});
}
function pick(i){const o=hits[i];if(!o)return;hits=[];renderHits();q.value=o.t;o.go();}
q.addEventListener('input',()=>{
  const s=norm(q.value.trim());sel=-1;
  if(s.length<2){hits=[];renderHits();return;}
  const starts=IDX.filter(o=>norm(o.t).startsWith(s)), inner=IDX.filter(o=>!norm(o.t).startsWith(s)&&o.n.includes(s));
  hits=starts.concat(inner).slice(0,12);renderHits();
});
q.addEventListener('keydown',e=>{
  if(e.key==='ArrowDown'){sel=Math.min(hits.length-1,sel+1);renderHits();e.preventDefault();}
  else if(e.key==='ArrowUp'){sel=Math.max(0,sel-1);renderHits();e.preventDefault();}
  else if(e.key==='Enter'){pick(sel<0?0:sel);e.preventDefault();}
  else if(e.key==='Escape'){hits=[];renderHits();}
});
window.ATLAS={showRoute:id=>{showRoute(id);document.querySelector('.layout').scrollIntoView({block:'start'});},showPlace,setChapter,P,R,get ch(){return curCh;}};
q.addEventListener('blur',()=>setTimeout(()=>{hits=[];renderHits();},150));
})();
