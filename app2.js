// Timeline of dates, web of remarkable men, inline period photograph
(function(){
const esc=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const A=()=>window.ATLAS||{};

/* ---------- timeline ---------- */
// lane: book (d = dated in the book, i = placed by a clue), out = outside evidence, else = Gurdjieff's dates elsewhere
const EVS=[
 {l:'book',y:1888,t:'1888',s:'He letters the year 1888 on a wedding shield on the day he sees the Yezidi boy trapped in a circle (p. c. 65).',r:'youth'},
 {l:'book',y:1894.4,i:1,t:'survey',s:'Vasiliev hires him for the survey of the new railway toward Kars (p. c. 86); the survey began in spring 1894.',r:'youth'},
 {l:'book',y:1898,t:'Gobi',s:'Soloviev is killed by a wild camel in the “Gobi”, in 1898 (p. 165).',r:'gobi'},
 {l:'book',y:1898.1,i:1,t:'',s:'The Transcaspian workshops open about two years before the meeting at Chardzhou (p. c. 252), in the same year as the Gobi expedition.',r:'transcaspia',dy:1,o:13},
 {l:'book',y:1900,t:'Chardzhou',s:'The Seekers meet at Chardzhou on 2 January 1900 for the Pamir expedition (p. c. 252).',r:'pamir',dy:1},
 {l:'book',y:1901.9,i:1,t:'Andronik',s:'“Young Andronik” is on everyone’s lips as the journey with Pogossian begins (p. c. 92): a clue pointing to about 1901.',r:'pogossian'},
 {l:'book',y:1908,t:'1908',s:'Pogossian turns to business in 1908 (p. c. 108).',r:'pogpath'},
 {l:'book',y:1913.9,t:'Moscow',s:'He moves to Moscow near the end of 1913 (p. 270).',r:'west'},
 {l:'book',y:1916,t:'',s:'He sees his father for the last time, in 1916 (p. c. 45); the father dies “a year later” of wounds from the Turkish attack on Alexandropol.',r:'family',dy:1},
 {l:'book',y:1918,t:'1918',s:'The “scientific expedition” leaves Essentuki and is held up at Maikop (p. c. 273).',r:'west'},
 {l:'book',y:1922.5,t:'France',s:'Arrival in France, summer 1922 (p. 285).',r:'west'},
 {l:'book',y:1924.27,t:'',s:'New York, 8 April 1924 (p. c. 246).',r:'west',dy:1},
 {l:'out',y:1877.9,t:'Kars',s:'Russia takes Kars in November 1877 and keeps it under the Treaty of Berlin (1878). The family’s move to Kars follows.'},
 {l:'out',y:1888.4,t:'Borsh',s:'Dean Borsh is posted to Kars in 1888 (Benham 2025): Gurdjieff would then be eleven if born in 1877, twenty-two if in 1866.',dy:1},
 {l:'out',y:1895.5,t:'',s:'The Emir of Afghanistan conquers Kafiristan and forcibly converts it, 1895–96.',dy:1},
 {l:'out',y:1896.05,t:'Hedin',s:'Sven Hedin finds the buried town of Dandan-Uiliq near Keriya, January 1896.'},
 {l:'out',y:1898.9,t:'Kushka',s:'The Merv–Kushka railway branch opens in December 1898; Soloviev’s service on it cannot precede his death in 1898 by the years the book requires.'},
 {l:'out',y:1900.7,t:'Stein',s:'Aurel Stein excavates Dandan-Uiliq and Niya, 1900–01.',dy:1},
 {l:'out',y:1901.85,t:'Andranik',s:'Andranik becomes famous after the siege of the Holy Apostles monastery near Mush, November 1901.'},
 {l:'out',y:1912,t:'1912',s:'Most chronologies have Gurdjieff teaching in Moscow by 1912.'},
 {l:'out',y:1915.3,t:'Ouspensky',s:'Ouspensky meets him in Moscow after Easter 1915 (Ouspensky, ch. 1).',dy:1},
 {l:'out',y:1918.37,t:'',s:'The Ottoman army takes Alexandropol on 15 May 1918: the father’s death cannot fall in 1917.'},
 {l:'out',y:1922.8,t:'Prieuré',s:'The Institute opens at the Prieuré, October 1922.'},
 {l:'else',y:1896,t:'Crete',s:'Hit by a stray bullet in Crete, 1896 (prologue to Life Is Real Only Then, When “I Am”); not in Meetings.'},
 {l:'else',y:1902,t:'Tibet',s:'Hit by a stray bullet in Tibet, 1902, a year before the British expedition to Lhasa (same source); Meetings mentions Tibet only in passing.'},
 {l:'else',y:1904.9,t:'Chiatura',s:'Hit by a stray bullet near the Chiatura tunnel in Transcaucasia, end of 1904 (same source).'}
];
const tl=document.getElementById('timeline'), cap=document.getElementById('tlcap');
const LANES=[['birth','Birth'],['book','The book'],['out','Outside'],['else','Elsewhere']];
const idle='The shaded band, 1894–1900, is where the book fits most of its travels.';
function drawTL(){
  if(!tl) return;
  tl.innerHTML='';
  const Wd=Math.max(320,tl.clientWidth), narrow=Wd<640, lw=narrow?66:92, rp=14;
  const laneH=narrow?44:50, top=10, Hh=top+laneH*LANES.length+26;
  const x=d3.scaleLinear().domain([1864,1926]).range([lw,Wd-rp]);
  const ly=l=>top+laneH*LANES.findIndex(d=>d[0]===l)+laneH/2;
  const s=d3.select(tl).append('svg').attr('viewBox',`0 0 ${Wd} ${Hh}`).attr('role','group').attr('aria-label','Timeline of the book’s dates against outside evidence');
  s.append('rect').attr('class','band').attr('x',x(1894)).attr('width',x(1900)-x(1894)).attr('y',top).attr('height',laneH*LANES.length);
  s.append('text').attr('class','bandlbl').attr('x',(x(1894)+x(1900))/2).attr('y',top+13).attr('text-anchor','middle').text(narrow?'crowded':'the crowded years');
  s.selectAll('text.lane').data(LANES).join('text').attr('class','lane').attr('x',0).attr('y',d=>ly(d[0])+4).text(d=>d[1].toLowerCase());
  s.selectAll('line.lg').data(LANES).join('line').attr('x1',lw).attr('x2',Wd-rp).attr('y1',d=>ly(d[0])).attr('y2',d=>ly(d[0])).attr('stroke','var(--line)');
  const by=ly('birth');
  const bg=s.append('g').attr('class','ev').attr('tabindex',0).attr('role','img').attr('aria-label','Proposed birth years, 1866 to 1877');
  bg.append('rect').attr('class','birth').attr('x',x(1866)).attr('width',x(1877)-x(1866)).attr('y',by-7).attr('height',14).attr('rx',3);
  bg.append('text').attr('class','elbl').attr('x',x(1877)+6).attr('y',by+4).text('1866 to 1877 proposed');
  const bs='Birth: dates from 1866 to 1877 have been proposed; Benham (2025) argues from documents for 1877, Moore favoured 1866.';
  bg.on('mouseenter focus',()=>cap.textContent=bs).on('mouseleave blur',()=>cap.textContent=idle);
  const ax=s.append('g').attr('class','axis').attr('transform',`translate(0,${top+laneH*LANES.length})`).call(d3.axisBottom(x).tickValues(narrow?[1870,1890,1910,1925]:[1865,1870,1875,1880,1885,1890,1895,1900,1905,1910,1915,1920,1925]).tickFormat(d3.format('d')).tickSize(4));
  ax.select('.domain').remove();
  const g=s.selectAll('g.evm').data(EVS).join('g').attr('class',d=>`ev evm ${d.l}${d.i?' inf':''}${d.r?' go':''}`)
    .attr('transform',d=>`translate(${x(d.y)},${ly(d.l)+(d.o||0)})`).attr('tabindex',0).attr('role',d=>d.r?'button':'img').attr('aria-label',d=>d.s);
  g.append('circle').attr('r',narrow?4.5:5.2);
  if(!narrow) g.append('text').attr('class','elbl').attr('text-anchor','middle').attr('y',d=>d.dy?17:-9).text(d=>d.t);
  const show=d=>{cap.innerHTML=esc(d.s)+(d.r?` <span class="meta">Click to open the journey on the map.</span>`:'');};
  g.on('mouseenter focus',(e,d)=>show(d)).on('mouseleave blur',()=>{cap.textContent=idle;})
   .on('click',(e,d)=>{if(d.r&&A().showRoute){A().setChapter&&A().setChapter(null,false);A().showRoute(d.r);}})
   .on('keydown',(e,d)=>{if((e.key==='Enter'||e.key===' ')&&d.r){e.preventDefault();A().setChapter&&A().setChapter(null,false);A().showRoute(d.r);}});
  cap.textContent=idle;
}

/* ---------- web of remarkable men ---------- */
// k: t teacher, c companion, o other, g Gurdjieff; p: subject of a chapter portrait
const NODES=[
 ['gurdjieff','Gurdjieff','g',1],['adash','His father','t',1],['borsh','Borsh','t',1],['bogachevsky','Bogachevsky','t',1],
 ['pogossian-sarkis','Pogossian','c',1],['yelov-abram','Yelov','c',1],['lubovedsky-prince-yuri','Lubovedsky','c',1],
 ['ekim-bey','Ekim Bey','c',1],['karpenko-piotr','Karpenko','c',1],['skridlov','Skridlov','c',1],
 ['soloviev','Soloviev','c',0],['vitvitskaia','Vitvitskaia','c',0],['sari-ogli','Sari-Ogli','c',0],['dashtamirov','Dashtamirov','c',0],['nijeradze','Nijeradze','c',0],
 ['vasiliaki','Vasiliaki','o',0],['father-giovanni','Father Giovanni','t',0],['bogga-eddin','Bogga-Eddin','t',0],
 ['the-persian-dervish','Persian dervish','t',0],['the-old-man-of-the-sarmoung','Old man of the Sarmoung','t',0]
].map(([id,n,k,p])=>({id,n,k,p}));
const G='gurdjieff';
const LINKS=[[G,'adash','II'],['adash','borsh','II'],['borsh',G,'III'],['bogachevsky',G,'IV'],['borsh','bogachevsky','IV'],
 ['pogossian-sarkis',G,'V'],['yelov-abram',G,'VI'],['pogossian-sarkis','yelov-abram','VI'],
 ['lubovedsky-prince-yuri',G,'VII'],['skridlov',G,'VII, X'],['lubovedsky-prince-yuri','skridlov','VII'],['lubovedsky-prince-yuri','vitvitskaia','VII'],
 ['lubovedsky-prince-yuri','the-old-man-of-the-sarmoung','VII'],['bogga-eddin',G,'VII'],['bogga-eddin','the-old-man-of-the-sarmoung','VII'],
 ['soloviev',G,'VII'],['sari-ogli',G,'VII'],['dashtamirov',G,'VII'],['vitvitskaia',G,'VII'],['karpenko-piotr',G,'VII, IX'],
 ['ekim-bey',G,'VIII'],['nijeradze',G,'VIII'],['the-persian-dervish',G,'VIII'],['ekim-bey','the-persian-dervish','VIII'],
 ['vasiliaki',G,'X'],['father-giovanni','skridlov','X'],['father-giovanni',G,'X']
].map(([s,t,ch])=>({source:s,target:t,ch}));
const web=document.getElementById('web');
const firstCh={};document.querySelectorAll('#characters .gi').forEach(el=>{const m=(el.querySelector('.gbody p')||{}).textContent||'';firstCh[el.id.slice(2)]=(m.match(/^\(Ch\. ([IVX]+|MQ)/)||[])[1];});
function openEntry(id){
  const el=document.getElementById('g-'+id); if(!el) return;
  el.hidden=false; el.open=true; el.scrollIntoView({block:'center'});
  el.classList.add('flash'); setTimeout(()=>el.classList.remove('flash'),1600);
}
let wsvg=null, wcard=null, pinned=null;
if(web){web.innerHTML='<div class="wsvg"></div><div class="wcard" aria-live="polite"></div>';wsvg=web.querySelector('.wsvg');wcard=web.querySelector('.wcard');}
const cardIdle='<p class="meta">Point at a name to read about him, or click it to keep the entry open. Lines join people the book shows meeting; point at a line for the chapter.</p>';
function card(id){
  if(!wcard) return;
  if(!id){wcard.innerHTML=cardIdle;return;}
  const el=document.getElementById('g-'+id); if(!el){wcard.innerHTML=cardIdle;return;}
  const head=el.querySelector('summary em').innerHTML, body=el.querySelector('.gbody').innerHTML;
  wcard.innerHTML=`<h3 class="wh">${head}</h3>${body}${pinned===id?'<p class="meta wpin">Kept open; click the name again or elsewhere in the web to release it.</p>':''}`;
}
let webCh=null;
function drawWeb(){
  if(!web) return;
  wsvg.innerHTML='';
  const Wd=Math.max(300,wsvg.clientWidth), narrow=Wd<600, Hh=narrow?560:500;
  const ORDER=['adash','borsh','bogachevsky','pogossian-sarkis','yelov-abram','lubovedsky-prince-yuri','vitvitskaia','the-old-man-of-the-sarmoung','bogga-eddin','soloviev','sari-ogli','dashtamirov','karpenko-piotr','ekim-bey','the-persian-dervish','nijeradze','vasiliaki','father-giovanni','skridlov'];
  const nodes=NODES.map(d=>Object.assign({},d)), byN=Object.fromEntries(nodes.map(n=>[n.id,n]));
  const links=LINKS.map(d=>({source:byN[d.source],target:byN[d.target],ch:d.ch}));
  const cx=Wd/2, cy=Hh/2, rx=narrow?Math.max(60,Wd/2-128):Math.min(260,Wd/2-150), ry=narrow?Hh/2-40:Hh/2-40;
  byN[G].x=cx; byN[G].y=cy;
  ORDER.forEach((id,i)=>{const a=-Math.PI/2+2*Math.PI*i/ORDER.length, n=byN[id]; n.a=a; n.x=cx+rx*Math.cos(a); n.y=cy+ry*Math.sin(a);});
  const s=d3.select(wsvg).append('svg').attr('viewBox',`0 0 ${Wd} ${Hh}`).attr('role','group').attr('aria-label','Web of the remarkable men');
  const lk=s.append('g').selectAll('line').data(links).join('line').attr('class','lk')
    .attr('x1',d=>d.source.x).attr('y1',d=>d.source.y).attr('x2',d=>d.target.x).attr('y2',d=>d.target.y);
  lk.append('title').text(d=>`${d.source.n} and ${d.target.n}: Ch. ${d.ch}`);
  const nd=s.append('g').selectAll('g').data(nodes).join('g').attr('class',d=>`nd ${d.k}${d.p?' p':''}`).attr('transform',d=>`translate(${d.x},${d.y})`)
    .attr('tabindex',0).attr('role','button').attr('aria-label',d=>d.n+(firstCh[d.id]?`, first met in Ch. ${firstCh[d.id]}`:''));
  nd.append('circle').attr('r',d=>d.k==='g'?9:d.p?7.5:5.5);
  nd.append('text').attr('text-anchor',d=>{if(d.k==='g')return 'middle';const c=Math.cos(d.a),th=narrow?.05:.2;return c>th?'start':c<-th?'end':'middle';})
    .attr('dx',d=>{if(d.k==='g')return 0;const c=Math.cos(d.a),th=narrow?.05:.2;return c>th?12:c<-th?-12:0;})
    .attr('dy',d=>{if(d.k==='g')return 26;const c=Math.cos(d.a),s=Math.sin(d.a),th=narrow?.05:.2;return Math.abs(c)>th?4.5:(s<0?-12:22);})
    .style('font-size',narrow?'12.5px':null).text(d=>narrow&&d.id==='the-old-man-of-the-sarmoung'?'Old man (Sarmoung)':d.n);
  const hi=d=>{
    if(!d){web.classList.remove('dim');nd.classed('hi',false);lk.classed('hi',false);nd.classed('hi',false);lk.classed('hi',false);applyWebCh();return;}
    const near=new Set([d.id]);links.forEach(l=>{if(l.source.id===d.id)near.add(l.target.id);if(l.target.id===d.id)near.add(l.source.id);});
    web.classList.add('dim');nd.classed('hi',n=>near.has(n.id));lk.classed('hi',l=>l.source.id===d.id||l.target.id===d.id);
  };
  const pin=d=>{pinned=(d&&pinned!==d.id)?d.id:null;const pd=pinned&&nodes.find(n=>n.id===pinned);nd.classed('pinned',n=>n.id===pinned);hi(pd||null);card(pinned);};
  nd.on('mouseenter focus',(e,d)=>{hi(d);card(d.id);}).on('mouseleave blur',()=>{const pd=pinned&&nodes.find(n=>n.id===pinned);hi(pd||null);card(pinned);})
    .on('click',(e,d)=>{e.stopPropagation();pin(d);}).on('keydown',(e,d)=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();pin(d);}else if(e.key==='Escape'){pin(null);}});
  s.on('click',()=>{if(pinned)pin(null);});
  drawWeb.pinId=id=>{const d=nodes.find(n=>n.id===id);if(d&&pinned!==id)pin(d);};
  if(pinned){const pd=nodes.find(n=>n.id===pinned);nd.classed('pinned',n=>n.id===pinned);hi(pd);}
  card(pinned);
  function applyWebCh(){
    if(!webCh){web.classList.remove('dim');nd.classed('hi',false);lk.classed('hi',false);return;}
    const inCh=l=>l.ch.split(',').map(x=>x.trim()).includes(webCh);
    const on=new Set();links.forEach(l=>{if(inCh(l)){on.add(l.source.id);on.add(l.target.id);}});
    web.classList.add('dim');nd.classed('hi',n=>on.has(n.id));lk.classed('hi',inCh);
  }
  drawWeb.apply=applyWebCh; applyWebCh();
}
window.ATLASWEB={show:id=>{if(drawWeb.pinId)drawWeb.pinId(id);if(web)web.scrollIntoView({block:'center'});}};
document.addEventListener('atlas:chapter',e=>{webCh=e.detail;if(!pinned&&drawWeb.apply)drawWeb.apply();});

webCh=A().ch||null;
drawTL(); drawWeb();
let rt,lw0=tl?tl.clientWidth:0;
window.addEventListener('resize',()=>{clearTimeout(rt);rt=setTimeout(()=>{const w=tl?tl.clientWidth:0;if(Math.abs(w-lw0)<2)return;lw0=w;drawTL();drawWeb();},200);});
})();
