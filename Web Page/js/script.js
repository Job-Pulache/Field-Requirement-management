
// ─── LANG ───
let lang = 'en';
const labels = {
  area:{en:['Field Operations','Logistics','Packaging','Administration'],es:['Operaciones de Campo','Logística','Empaque','Administración']},
  type:{en:['Materials','Personnel','Equipment','Supplies'],es:['Materiales','Personal','Equipos','Suministros']},
  status:{en:['Approved','Rejected'],es:['Aprobados','Rechazados']},
  chartTitle:{area:{en:'Requests by Area',es:'Solicitudes por Área'},type:{en:'Requests by Type',es:'Solicitudes por Tipo'},status:{en:'Approval Status',es:'Estado de Aprobación'}}
};
function setLang(l){
  lang=l;
  document.querySelectorAll('.lang-btn').forEach(b=>b.classList.remove('active'));
  document.querySelector(`.lang-btn:${l==='en'?'first':'last'}-child`).classList.add('active');
  document.querySelectorAll('[data-en]').forEach(el=>{
    if(el.tagName==='H1'){el.innerHTML=el.dataset[l];}
    else{el.textContent=el.dataset[l];}
  });
  if(currentChart) switchChart(currentMode, document.querySelector('.chart-tab.active'));
}

// ─── CHART ───
let currentChart=null, currentMode='area';
const chartData={
  area:{vals:[6,9,9,6],color:'#39D353'},
  type:{vals:[8,6,10,6],color:'#58A6FF'},
  status:{vals:[19,11],colors:['#39D353','#F85149']}
};
function buildChart(mode){
  if(currentChart){currentChart.destroy();}
  const d=chartData[mode];
  const ctx=document.getElementById('mainChart').getContext('2d');
  const lbls=labels[mode][lang];
  if(mode==='status'){
    currentChart=new Chart(ctx,{
      type:'doughnut',
      data:{labels:lbls,datasets:[{data:d.vals,backgroundColor:d.colors,borderColor:'#161B22',borderWidth:3,hoverOffset:8}]},
      options:{
        responsive:true,maintainAspectRatio:false,
        plugins:{legend:{labels:{color:'#8B949E',font:{family:"'Space Grotesk',sans-serif",size:12},padding:16}},tooltip:{backgroundColor:'#1C2330',titleColor:'#E6EDF3',bodyColor:'#8B949E',borderColor:'#30363D',borderWidth:1}},
        cutout:'68%'
      }
    });
  } else {
    currentChart=new Chart(ctx,{
      type:'bar',
      data:{labels:lbls,datasets:[{data:d.vals,backgroundColor:d.color+'22',borderColor:d.color,borderWidth:1.5,borderRadius:3,hoverBackgroundColor:d.color+'44'}]},
      options:{
        responsive:true,maintainAspectRatio:false,indexAxis:'y',
        plugins:{legend:{display:false},tooltip:{backgroundColor:'#1C2330',titleColor:'#E6EDF3',bodyColor:'#8B949E',borderColor:'#30363D',borderWidth:1}},
        scales:{
          x:{grid:{color:'rgba(255,255,255,0.04)'},ticks:{color:'#8B949E',font:{family:"'Space Grotesk',sans-serif",size:11}},border:{color:'rgba(255,255,255,0.08)'}},
          y:{grid:{display:false},ticks:{color:'#8B949E',font:{family:"'Space Grotesk',sans-serif",size:11}},border:{color:'rgba(255,255,255,0.08)'}}
        }
      }
    });
  }
}
function switchChart(mode,btn){
  currentMode=mode;
  document.querySelectorAll('.chart-tab').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  const lbl=document.getElementById('chartLabel');
  if(lbl) lbl.textContent=labels.chartTitle[mode][lang];
  buildChart(mode);
}
buildChart('area');

// ─── SCROLL REVEAL ───
const obs=new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(e.isIntersecting){
      e.target.classList.add('visible');
      e.target.querySelectorAll('[data-count]').forEach(animateCount);
      e.target.querySelectorAll('.kpi-bar-fill').forEach(b=>{
        setTimeout(()=>{b.style.width=b.dataset.width+'%';},200);
      });
    }
  });
},{threshold:0.1});
document.querySelectorAll('.reveal').forEach(el=>obs.observe(el));

// ─── COUNTER ANIM ───
function animateCount(el){
  const target=parseInt(el.dataset.count);
  const suffix=el.dataset.suffix||'';
  const dur=1400;const start=performance.now();
  function upd(now){
    const p=Math.min((now-start)/dur,1);
    const e=1-Math.pow(1-p,3);
    el.textContent=Math.round(e*target)+suffix;
    if(p<1) requestAnimationFrame(upd);
  }
  requestAnimationFrame(upd);
}

// ─── LIGHTBOX ───
function openLightbox(type){
  const src=type==='as-is'?'requirement-process-as-is.png':'requirement-process-to-be.png';
  document.getElementById('lb-img').src=src;
  document.getElementById('lightbox').classList.add('open');
}
function closeLightbox(){document.getElementById('lightbox').classList.remove('open');}
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox();});

// ─── NAV SHADOW ───
window.addEventListener('scroll',()=>{
  document.querySelector('nav').style.borderBottomColor=
    window.scrollY>40?'rgba(255,255,255,0.12)':'rgba(255,255,255,0.08)';
});
