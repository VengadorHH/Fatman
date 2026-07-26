/* ===== Fatman – Koalition der Willigen ===== */

/* Skurrile Objekte – Betrag der Veränderung seit letzter Messung, 100g-Skala */
const OBJECTS=[
  {g:100,  e:"🧦", n:"eine verschwitzte Sportsocke"},
  {g:150,  e:"🐹", n:"ein wohlgenährter Hamster"},
  {g:200,  e:"🥑", n:"eine reife Avocado"},
  {g:250,  e:"🍔", n:"ein Doppel-Cheeseburger"},
  {g:300,  e:"🐀", n:"eine ausgewachsene Ratte"},
  {g:400,  e:"🥫", n:"eine Dose Ravioli"},
  {g:500,  e:"📕", n:"ein Harry-Potter-Band"},
  {g:600,  e:"🐢", n:"eine kleine Schildkröte"},
  {g:750,  e:"🍍", n:"eine stachelige Ananas"},
  {g:900,  e:"🥔", n:"ein Riesen-Kartoffel-Klotz"},
  {g:1000, e:"🥛", n:"ein Liter Milch"},
  {g:1200, e:"👟", n:"ein klobiger Sneaker"},
  {g:1500, e:"🍉", n:"eine Mini-Wassermelone"},
  {g:1800, e:"🐔", n:"ein rupfiges Suppenhuhn"},
  {g:2000, e:"🐈", n:"ein fauler Kater"},
  {g:2500, e:"🍾", n:"eine Magnum-Sektflasche"},
  {g:3000, e:"🧱", n:"ein voller Ziegelstein"},
  {g:3500, e:"🎳", n:"eine Bowlingkugel"},
  {g:4000, e:"🐦‍⬛", n:"vier fette Raben"},
  {g:5000, e:"🐩", n:"ein kläffender Pudel"},
  {g:6000, e:"🎃", n:"ein prächtiger Halloween-Kürbis"},
  {g:7000, e:"🛞", n:"ein Autoreifen"},
  {g:8000, e:"🐙", n:"ein mittlerer Oktopus"},
  {g:10000,e:"🐕", n:"ein kompletter Beagle"},
  {g:12000,e:"🧳", n:"ein übervoller Urlaubskoffer"},
  {g:15000,e:"🐐", n:"eine meckernde Ziege"},
  {g:18000,e:"🍺", n:"ein Bierfass"},
  {g:22000,e:"🐕‍🦺", n:"ein Schäferhund"},
  {g:28000,e:"🛵", n:"ein Motorroller"},
  {g:35000,e:"🧑", n:"ein zehnjähriges Kind"},
  {g:45000,e:"🦌", n:"ein stattlicher Hirsch"},
  {g:60000,e:"🐗", n:"ein wütendes Wildschwein"},
  {g:80000,e:"🐋", n:"ein Baby-Beluga"},
];
function pickObject(absKg){
  const g=Math.round(absKg*1000);
  if(g<100) return {g:g,e:"🪶",n:"eine federleichte Kleinigkeit"};
  let best=OBJECTS[0];
  for(const o of OBJECTS){ if(Math.abs(o.g-g)<Math.abs(best.g-g)) best=o; }
  return best;
}

const KEY="fettschmelzer.v1";
let state=load()||{start:null,goal:null,entries:[]};
let lineVis={w:true,f:true,wa:true};

function load(){try{return JSON.parse(localStorage.getItem(KEY))}catch(e){return null}}
function save(){localStorage.setItem(KEY,JSON.stringify(state))}
function fmt(n,d=1){if(n==null||isNaN(n))return '–';return (Math.round(n*Math.pow(10,d))/Math.pow(10,d)).toString().replace('.',',')}
function sorted(){return [...state.entries].sort((a,b)=>a.t-b.t)}

function fmtDate(t){return new Date(t).toLocaleDateString('de-DE',{day:'2-digit',month:'2-digit',year:'2-digit'});}
function fmtTime(t){return new Date(t).toLocaleTimeString('de-DE',{hour:'2-digit',minute:'2-digit'})+' Uhr';}

function praiseGood(g){const a=["Weiter so!","Sauber abgetragen.","Die Willigen jubeln.","Feind besiegt.","Muskelkater lohnt sich.","Vorwärts marsch!"];return a[g%a.length];}
function praiseBad(g){const a=["Kleiner Rückzug.","Morgen wird zurückgeschlagen.","Nur eine Delle.","Das holen wir wieder rein.","Ruhig Blut, Genosse.","Nachschub gebunkert."];return a[g%a.length];}

function render(){
  if(state.goal==null||state.start==null){openSetup();return;}
  document.getElementById('goalTxt').textContent=fmt(state.goal)+' kg';
  document.getElementById('startTxt').textContent='Start '+fmt(state.start)+' kg';

  const es=sorted();
  const cur=es.length?es[es.length-1]:null;
  const curW=cur?cur.w:state.start;
  const prevW=es.length>1?es[es.length-2].w:(es.length===1?state.start:null);

  document.getElementById('pWeight').innerHTML=cur?fmt(cur.w)+'<small> kg</small>':'–';
  document.getElementById('pFat').innerHTML=(cur&&cur.f!=null)?fmt(cur.f)+'<small> %</small>':'–';
  document.getElementById('pWater').innerHTML=(cur&&cur.wa!=null)?fmt(cur.wa)+'<small> %</small>':'–';

  const obj=document.getElementById('obj'),ring=document.getElementById('ring'),
        name=document.getElementById('objname'),dn=document.getElementById('diffNum'),
        dl=document.getElementById('diffLabel'),vd=document.getElementById('verdict');

  if(cur&&curW<=state.goal){
    obj.textContent="🏆";ring.className="ring good";
    name.innerHTML="<b>Mission erfüllt, Genosse</b>";
    dn.className="diffnum good";dn.innerHTML=fmt(curW)+'<small> kg</small>';
    dl.textContent="Zielgewicht erreicht";
    vd.className="verdict good";vd.textContent="🎉 Die Koalition triumphiert!";
  } else if(prevW==null||!cur){
    obj.textContent="🦇";ring.className="ring neu";
    name.innerHTML="Erste Messung eingetragen – ab morgen zählt der Vergleich";
    dn.className="diffnum";dn.textContent="–";dl.textContent="seit letzter Messung";vd.textContent="";
  } else {
    const change=curW-prevW;
    const absKg=Math.abs(change);
    const towardGoal=change<0;
    const o=pickObject(absKg);
    const grams=Math.round(absKg*1000/100)*100;
    let disp,unit;if(grams>=1000){disp=fmt(grams/1000);unit='kg';}else{disp=grams;unit='g';}

    if(absKg<0.05){
      obj.textContent="😐";ring.className="ring neu";
      name.innerHTML="<b>Stillstand an der Front</b>";
      dn.className="diffnum";dn.innerHTML="±0";dl.textContent="keine Veränderung";
      vd.className="verdict neu";vd.textContent="Die Waage rührt sich nicht.";
    } else if(towardGoal){
      obj.textContent=o.e;ring.className="ring good";
      name.innerHTML='Weg mit <b>'+o.n+'</b>';
      dn.className="diffnum good";dn.innerHTML='−'+disp+'<small> '+unit+'</small>';
      dl.textContent="Richtung Ziel";
      vd.className="verdict good";vd.textContent="👊 "+praiseGood(grams);
    } else {
      obj.textContent=o.e;ring.className="ring bad";
      name.innerHTML='<b>'+o.n+'</b> obendrauf';
      dn.className="diffnum bad";dn.innerHTML='+'+disp+'<small> '+unit+'</small>';
      dl.textContent="vom Ziel entfernt";
      vd.className="verdict bad";vd.textContent="😬 "+praiseBad(grams);
    }
  }

  const total=state.start-state.goal;
  let pct=0;
  if(cur&&curW<=state.goal)pct=100;
  else if(total>0)pct=Math.min(100,Math.max(0,((state.start-curW)/total)*100));
  document.getElementById('fill').style.width=pct.toFixed(0)+'%';
  document.getElementById('pctTxt').textContent=pct.toFixed(0)+' % geschafft';

  updateLegend();
  renderChart();
  renderRows();
  save();
}

function updateLegend(){
  document.querySelectorAll('.legend .lg').forEach(el=>{
    el.classList.toggle('off',!lineVis[el.dataset.m]);
  });
}
function toggleLine(m){lineVis[m]=!lineVis[m];render();}

/* ---- Multi-Linien-Diagramm (SVG) ---- */
function renderChart(){
  const box=document.getElementById('chart');
  const es=sorted().slice(-20);
  if(es.length<1){box.innerHTML='<div class="chart-empty">Noch keine Daten für ein Diagramm.</div>';return;}

  const W=500,H=200,padL=34,padR=14,padT=14,padB=26;
  const innerW=W-padL-padR, innerH=H-padT-padB;
  const n=es.length;
  const xAt=i=> n===1? padL+innerW/2 : padL+(i/(n-1))*innerW;

  const series={
    w:{color:'var(--accent)',vals:es.map(e=>e.w)},
    f:{color:'var(--fat)',vals:es.map(e=>e.f)},
    wa:{color:'var(--water)',vals:es.map(e=>e.wa)},
  };

  // Achsen: Gewicht (kg) links eigene Skala; Fett & Wasser (%) teilen sich rechte 0-100 Skala,
  // aber für schöne Linien skalieren wir jede Serie autonom auf ihre eigene Min/Max.
  function scaleY(vals){
    const clean=vals.filter(v=>v!=null);
    if(!clean.length)return null;
    let mn=Math.min(...clean),mx=Math.max(...clean);
    if(mn===mx){mn-=1;mx+=1;}
    const pad=(mx-mn)*0.15; mn-=pad; mx+=pad;
    return v=> padT+innerH-((v-mn)/(mx-mn))*innerH;
  }

  let svg='<svg class="linechart" viewBox="0 0 '+W+' '+H+'" preserveAspectRatio="none">';

  // horizontale Gitterlinien
  for(let k=0;k<=3;k++){
    const y=padT+(k/3)*innerH;
    svg+='<line x1="'+padL+'" y1="'+y+'" x2="'+(W-padR)+'" y2="'+y+'" stroke="rgba(255,255,255,.06)" stroke-width="1"/>';
  }

  // x-Achsen-Labels (nur einige)
  const step=Math.ceil(n/5);
  for(let i=0;i<n;i+=step){
    svg+='<text class="axis-label" x="'+xAt(i)+'" y="'+(H-8)+'" text-anchor="middle">'+fmtDate(es[i].t).slice(0,5)+'</text>';
  }

  const dots=[];
  ['w','f','wa'].forEach(mk=>{
    if(!lineVis[mk])return;
    const s=series[mk];
    const sc=scaleY(s.vals);
    if(!sc)return;
    // Linie nur über vorhandene Punkte
    let d='',started=false;
    const pts=[];
    s.vals.forEach((v,i)=>{
      if(v==null){return;}
      const x=xAt(i),y=sc(v);
      d+=(started?' L':'M')+x+' '+y; started=true;
      pts.push({x,y,v,i,mk});
    });
    if(d){
      svg+='<path d="'+d+'" fill="none" stroke="'+s.color+'" stroke-width="2.5" stroke-linejoin="round" stroke-linecap="round"/>';
    }
    pts.forEach(p=>{dots.push(p);});
  });

  // Punkte oben drauf
  dots.forEach(p=>{
    svg+='<circle class="dot" cx="'+p.x+'" cy="'+p.y+'" r="4" fill="var(--bg)" stroke="'+series[p.mk].color+'" stroke-width="2.5" '+
         'data-i="'+p.i+'" data-mk="'+p.mk+'"/>';
  });

  svg+='</svg>';
  box.innerHTML=svg;

  // Tooltips
  const tt=document.getElementById('tooltip');
  box.querySelectorAll('.dot').forEach(dot=>{
    const show=(ev)=>{
      const i=+dot.dataset.i, e=es[i];
      const label={w:'Gewicht',f:'Fett',wa:'Wasser'}[dot.dataset.mk];
      const unit={w:'kg',f:'%',wa:'%'}[dot.dataset.mk];
      const val={w:e.w,f:e.f,wa:e.wa}[dot.dataset.mk];
      tt.innerHTML='<b>'+label+': '+fmt(val)+' '+unit+'</b><br>'+fmtDate(e.t)+' · '+fmtTime(e.t);
      tt.style.display='block';
      const px=(ev.touches?ev.touches[0].clientX:ev.clientX);
      const py=(ev.touches?ev.touches[0].clientY:ev.clientY);
      tt.style.left=Math.min(px+12,window.innerWidth-160)+'px';
      tt.style.top=(py-60)+'px';
    };
    dot.addEventListener('mouseenter',show);
    dot.addEventListener('mousemove',show);
    dot.addEventListener('touchstart',show,{passive:true});
    dot.addEventListener('mouseleave',()=>tt.style.display='none');
    dot.addEventListener('touchend',()=>setTimeout(()=>tt.style.display='none',1500));
  });
}

function renderRows(){
  const box=document.getElementById('rows');
  const es=sorted();
  if(!es.length){box.innerHTML='<div class="empty">Noch keine Einträge.</div>';return;}
  let html='';
  for(let i=es.length-1;i>=0;i--){
    const e=es[i], prev=i>0?es[i-1]:null;
    let delta='';
    if(prev){
      const d=e.w-prev.w;
      const cls=d<0?'good':(d>0?'bad':'');
      const sign=d>0?'+':(d<0?'−':'±');
      delta='<div class="delta '+cls+'">'+sign+fmt(Math.abs(d))+'</div>';
    }else{delta='<div class="delta"></div>';}
    let vals='<b>'+fmt(e.w)+' kg</b>';
    if(e.f!=null)vals+='<br>Fett '+fmt(e.f)+' %';
    if(e.wa!=null)vals+='<br>Wasser '+fmt(e.wa)+' %';
    html+='<div class="row"><div class="when"><div class="dt">'+fmtDate(e.t)+'</div><div class="tm">'+fmtTime(e.t)+
      '</div></div><div class="vals">'+vals+'</div>'+delta+
      '<button class="del" onclick="delEntry('+e.t+')">✕</button></div>';
  }
  box.innerHTML=html;
}

function addWeigh(){
  const w=parseFloat((document.getElementById('wIn').value||'').replace(',','.'));
  const f=parseFloat((document.getElementById('fIn').value||'').replace(',','.'));
  const wa=parseFloat((document.getElementById('waIn').value||'').replace(',','.'));
  if(isNaN(w)||w<=0){document.getElementById('wIn').focus();return;}
  const t=Date.now();  // Datum & Uhrzeit automatisch = jetzt
  state.entries.push({t,w,f:isNaN(f)?null:f,wa:isNaN(wa)?null:wa});
  document.getElementById('wIn').value='';
  document.getElementById('fIn').value='';
  document.getElementById('waIn').value='';
  if(document.activeElement)document.activeElement.blur();
  render();
}
function delEntry(t){state.entries=state.entries.filter(e=>e.t!==t);render();}

function openSetup(){
  document.getElementById('startIn').value=state.start!=null?state.start:'';
  document.getElementById('goalIn').value=state.goal!=null?state.goal:'';
  document.getElementById('modal').classList.add('on');
}
function saveSetup(){
  const s=parseFloat((document.getElementById('startIn').value||'').replace(',','.'));
  const g=parseFloat((document.getElementById('goalIn').value||'').replace(',','.'));
  if(isNaN(s)||isNaN(g))return;
  state.start=s;state.goal=g;
  document.getElementById('modal').classList.remove('on');
  render();
}

/* --- Robuste Button-Bindung (funktioniert auch zuverlässig auf Touch-Geräten) --- */
function bindTap(el, handler){
  if(!el) return;
  let touched=false;
  el.addEventListener('touchend', (e)=>{ touched=true; e.preventDefault(); handler(e); }, {passive:false});
  el.addEventListener('click', (e)=>{ if(touched){touched=false; return;} handler(e); });
}

bindTap(document.getElementById('goalchip'), openSetup);
bindTap(document.getElementById('goalEditBtn'), openSetup);
bindTap(document.getElementById('saveSetupBtn'), saveSetup);
bindTap(document.getElementById('addBtn'), addWeigh);

// Diagramm-Legende: Linien ein-/ausblenden
document.querySelectorAll('.legend .lg').forEach(el=>{
  bindTap(el, ()=>toggleLine(el.dataset.m));
});

// Enter-Taste im Gewichtsfeld trägt ein
const wInEl=document.getElementById('wIn');
if(wInEl) wInEl.addEventListener('keydown',e=>{if(e.key==='Enter')addWeigh();});

render();
