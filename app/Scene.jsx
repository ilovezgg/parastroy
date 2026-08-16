'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const S = 25, COS = Math.cos(Math.PI/6), SIN = 0.5;
const NS = "http://www.w3.org/2000/svg";

function P(x,y,z, bb){
  const px = (x-y)*COS*S, py = ((x+y)*SIN - z)*S;
  if(bb){
    if(px<bb.minx)bb.minx=px; if(px>bb.maxx)bb.maxx=px;
    if(py<bb.miny)bb.miny=py; if(py>bb.maxy)bb.maxy=py;
  }
  return px.toFixed(2)+","+py.toFixed(2);
}
function el(tag,attrs){
  const e=document.createElementNS(NS,tag);
  for(const k in attrs) e.setAttribute(k,attrs[k]);
  return e;
}
function quad(pts,fill,extra, bb){
  const p = pts.map(v=>P(v[0],v[1],v[2], bb)).join(" ");
  return el("polygon",Object.assign({points:p,fill:fill},extra||{}));
}
function box(g,x,y,z,w,d,h,c, bb){
  const b = el("g",{class:"pc"}); g.appendChild(b);
  b.appendChild(quad([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]], c.l, {}, bb));
  b.appendChild(quad([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]], c.r, {}, bb));
  b.appendChild(quad([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]], c.t, {}, bb));
  return b;
}
function faceY(g,x1,x2,z1,z2,Y,fill,extra, bb){
  g.appendChild(quad([[x1,Y,z1],[x2,Y,z1],[x2,Y,z2],[x1,Y,z2]], fill, extra, bb));
}

const MAT = {
  steel:{t:"#3B4642",r:"#1E2523",l:"#252D2A"},
  pier:{t:"#4A5450",r:"#232A27",l:"#2C3431"},
  floor:{t:"#8E7355",r:"#4A3D2F",l:"#5C4A38"},
  wall:{t:"#242B28",r:"#141918",l:"#1B211F"},
  roof:{t:"#333B37",r:"#101514",l:"#161C1A"},
  deck:{t:"#C3A176",r:"#7C6244",l:"#9A7C56"},
  wood:{t:"#CBA97F",r:"#8A6C4A",l:"#A0805B"},
  dark:{t:"#1A201E",r:"#0E1211",l:"#131817"},
};

export default function Scene(){
  const svgRef = useRef(null);
  const [cur, setCur] = useState(0);
  const [counts, setCounts] = useState({});
  const inView = useInView(svgRef, { once: false, margin: "-20%" });

  useEffect(()=>{
    const svg = svgRef.current;
    if(!svg) return;
    svg.innerHTML = "";
    const bb = {minx:1e9, miny:1e9, maxx:-1e9, maxy:-1e9};

    const defs = el("defs",{});
    svg.appendChild(defs);
    defs.innerHTML = `
<linearGradient id="gl" x1="0" y1="0" x2="0.4" y2="1">
  <stop offset="0%" stop-color="#8FB6B0" stop-opacity=".45"/>
  <stop offset="55%" stop-color="#2B3A38" stop-opacity=".75"/>
  <stop offset="100%" stop-color="#F0A94C" stop-opacity=".55"/>
</linearGradient>
<radialGradient id="warm"><stop offset="0%" stop-color="#FFC576" stop-opacity=".85"/><stop offset="100%" stop-color="#FFB25C" stop-opacity="0"/></radialGradient>
<radialGradient id="shade"><stop offset="0%" stop-color="#0F1614" stop-opacity=".28"/><stop offset="100%" stop-color="#0F1614" stop-opacity="0"/></radialGradient>`;

    const drift = el("g",{id:"drift"});
    svg.appendChild(drift);

    const allParts = [];
    const stageCounts = {};
    function part(stage,dx,dy){
      const g = el("g",{class:"part"});
      g.dataset.stage = stage;
      g.dataset.bx = dx; g.dataset.by = dy;
      drift.appendChild(g);
      allParts.push(g);
      return g;
    }
    function pxy(x,y,z){ const s = P(x,y,z, bb).split(","); return [+s[0], +s[1]]; }
    function glow(g,x,y,z,rx,ry,op){
      const c = pxy(x,y,z);
      const e = el("ellipse",{class:"lamp",cx:c[0].toFixed(1),cy:c[1].toFixed(1),rx:rx,ry:ry,fill:"url(#warm)"});
      e.style.setProperty("--lo",op);
      g.appendChild(e);
    }

    const LEN = 12.4, DEP = 5.6, H = 4.5, FL = 0.95;
    const BX = -5.6, BLEN = 5.6, BY = -0.6, BDEP = 4.2, BH = 3.9;
    const FY = DEP, BFY = BY + BDEP;

    const g1 = part(1,0,80);
    g1.appendChild(quad([[-6.6,-1.2,0],[13.4,-1.2,0],[13.4,9.9,0],[-6.6,9.9,0]],"#E2E5DC",{opacity:".9"}, bb));
    const shadow = part(1,0,10);
    {
      const c = pxy(LEN/2-0.5, DEP/2+0.6, 0);
      shadow.appendChild(el("ellipse",{cx:c[0].toFixed(1),cy:c[1].toFixed(1),rx:LEN*S*0.72,ry:DEP*S*0.44,fill:"url(#shade)"}));
    }
    for(let i=0;i<3;i++){
      const px = BX+0.4 + i*(BLEN-1.6)/2;
      box(g1,px,BY+0.4,-0.75,0.8,0.8,0.75,MAT.pier, bb);
      box(g1,px,BY+BDEP-1.2,-0.75,0.8,0.8,0.75,MAT.pier, bb);
    }
    box(g1,BX,BY+0.35,0,BLEN,0.7,0.5,MAT.steel, bb);
    box(g1,BX,BY+BDEP-1.05,0,BLEN,0.7,0.5,MAT.steel, bb);
    for(let i=0;i<4;i++){
      const px = 0.4 + i*(LEN-1.6)/3;
      box(g1,px,0.5,-0.75,0.85,0.85,0.75,MAT.pier, bb);
      box(g1,px,DEP-1.35,-0.75,0.85,0.85,0.75,MAT.pier, bb);
    }
    box(g1,0,0.45,0,LEN,0.75,0.5,MAT.steel, bb);
    box(g1,0,DEP-1.2,0,LEN,0.75,0.5,MAT.steel, bb);
    for(let i=0;i<5;i++) box(g1,0.6+i*(LEN-1.8)/4,0.45,0.05,0.5,DEP-1.5,0.4,MAT.steel, bb);

    const g2 = part(2,0,-70);
    box(g2,BX,BY,0.5,BLEN,BDEP,0.45,MAT.floor, bb);
    box(g2,0,0,0.5,LEN,DEP,0.45,MAT.floor, bb);

    const g3B = part(3,-90,-40);
    box(g3B,BX,BY,FL,BLEN,0.3,BH,MAT.wall, bb);
    box(g3B,BX,BY,FL,0.3,BDEP,BH,MAT.wall, bb);
    box(g3B,BX,BFY-0.3,FL,BLEN,0.3,BH,MAT.wall, bb);
    const g3a = part(3,-70,-30);
    box(g3a,0,0,FL,LEN,0.3,H,MAT.wall, bb);
    const g3b = part(3,70,-20);
    box(g3b,LEN-0.3,0,FL,0.3,DEP,H,MAT.wall, bb);
    const g3c = part(3,-30,60);
    box(g3c,0,DEP-0.3,FL,LEN,0.3,H,MAT.wall, bb);

    const g4 = part(4,0,-110);
    const BRD = BDEP+0.85;
    box(g4,BX-0.35,BY-0.35,FL+BH,BLEN+0.3,BRD,0.38,MAT.roof, bb);
    box(g4,BX-0.35,BY-0.35,FL+BH+0.38,BLEN+0.3,BRD,0.1,{t:"#39433F",r:"#1A211F",l:"#212927"}, bb);
    const RD = DEP+0.95;
    box(g4,-0.35,-0.35,FL+H,LEN+0.7,RD,0.42,MAT.roof, bb);
    box(g4,-0.35,-0.35,FL+H+0.42,LEN+0.7,RD,0.1,{t:"#39433F",r:"#1A211F",l:"#212927"}, bb);

    const g5B = part(5,-60,30);
    g5B.appendChild(quad([[BX+0.9,BFY+0.02,1.45],[BX+4.5,BFY+0.02,1.45],[BX+4.5,BFY+0.02,3.85],[BX+0.9,BFY+0.02,3.85]],"url(#gl)",{class:"glass",stroke:"rgba(255,255,255,.26)","stroke-width":"1.1"}, bb));
    [BX+2.1,BX+3.3].forEach(x=>g5B.appendChild(quad([[x-0.05,BFY+0.04,1.45],[x+0.05,BFY+0.04,1.45],[x+0.05,BFY+0.04,3.85],[x-0.05,BFY+0.04,3.85]],"#0F1413",{opacity:".85"}, bb)));

    const g5 = part(5,0,50);
    glow(g5,6.2,FY,3.0,150,95,".5");
    faceY(g5,2.6,8.4,1.25,4.55,FY+0.02,"url(#gl)",{class:"glass",stroke:"rgba(255,255,255,.30)","stroke-width":"1.2"}, bb);
    [4.0,5.5,7.0].forEach(x=>faceY(g5,x-0.05,x+0.05,1.25,4.55,FY+0.04,"#0F1413",{opacity:".85"}, bb));
    faceY(g5,2.6,8.4,4.42,4.55,FY+0.05,"#111615",{}, bb);
    faceY(g5,9.7,11.3,1.05,4.35,FY+0.02,"#141A19",{stroke:"rgba(255,255,255,.16)"}, bb);
    faceY(g5,10.95,11.05,2.5,3.05,FY+0.06,"#D9C7A8",{}, bb);
    faceY(g5,11.6,12.0,1.6,4.35,FY+0.02,"url(#gl)",{class:"glass",stroke:"rgba(255,255,255,.22)"}, bb);
    const g5b = part(5,60,20);
    g5b.appendChild(quad([[LEN+0.02,1.4,2.1],[LEN+0.02,3.6,2.1],[LEN+0.02,3.6,4.1],[LEN+0.02,1.4,4.1]],"url(#gl)",{class:"glass",stroke:"rgba(255,255,255,.28)","stroke-width":"1.1"}, bb));

    const g6 = part(6,-40,55);
    for(let x=BX+0.25;x<BX+0.85;x+=0.28) faceY(g6,x,x+0.18,FL+0.05,FL+BH-0.05,BFY+0.03,"#B08A5E",{opacity:".9"}, bb);
    for(let x=0.35;x<2.45;x+=0.30) faceY(g6,x,x+0.19,1.05,4.55,FY+0.03,"#B08A5E",{opacity:".9"}, bb);
    for(let x=8.6;x<9.6;x+=0.30) faceY(g6,x,x+0.19,1.05,4.55,FY+0.03,"#B08A5E",{opacity:".9"}, bb);
    box(g6,1.6,DEP,0.62,7.2,3.1,0.33,MAT.deck, bb);
    [4.9,6.6].forEach(x=>{
      box(g6,x,DEP+1.0,0.95,1.0,1.75,0.38,MAT.dark, bb);
      box(g6,x,DEP+1.0,1.33,1.0,0.28,0.62,MAT.dark, bb);
    });
    box(g6,4.15,DEP+1.4,0.95,0.34,0.34,0.6,{t:"#FFC97E",r:"#7A5F3C",l:"#8E7047"}, bb);
    glow(g6,4.3,DEP+1.6,1.2,54,24,".5");

    // split into pcs for animation
    let rnd = (()=>{let a=1234; return ()=> (a = (a*1103515245+12345) % 2147483647) / 2147483647;})();
    allParts.forEach(g=>{
      const children = Array.from(g.childNodes).filter(n=>n.nodeType===1);
      children.forEach(k=>{
        if(k.getAttribute && k.getAttribute("class")==="pc") return;
        const w = el("g",{class:"pc"});
        g.insertBefore(w,k); w.appendChild(k);
      });
      const pcs = Array.from(g.children).filter(n=>n.getAttribute && n.getAttribute("class")==="pc");
      const bx = +g.dataset.bx, by = +g.dataset.by;
      const step = Math.min(24, 430/Math.max(pcs.length,1));
      pcs.forEach((p,i)=>{
        p.style.setProperty("--px",(bx + (rnd()-0.5)*26).toFixed(1)+"px");
        p.style.setProperty("--py",(by + (rnd()-0.5)*26).toFixed(1)+"px");
        p.style.setProperty("--d",Math.round(i*step)+"ms");
      });
      const st = g.dataset.stage;
      stageCounts[st] = (stageCounts[st]||0) + pcs.length;
    });

    const ghost = el("g",{id:"ghost"});
    svg.appendChild(ghost);
    function ghostBox(x,y,z,w,d,h){
      ghost.appendChild(quad([[x,y+d,z],[x+w,y+d,z],[x+w,y+d,z+h],[x,y+d,z+h]],"none",{}, bb));
      ghost.appendChild(quad([[x+w,y,z],[x+w,y+d,z],[x+w,y+d,z+h],[x+w,y,z+h]],"none",{}, bb));
      ghost.appendChild(quad([[x,y,z+h],[x+w,y,z+h],[x+w,y+d,z+h],[x,y+d,z+h]],"none",{}, bb));
    }
    ghostBox(0,0,FL,LEN,DEP,H+0.5);
    ghostBox(BX,BY,FL,BLEN,BDEP,BH+0.45);

    const dims = el("g",{id:"dims"});
    svg.appendChild(dims);

    const pad = 46;
    const vw = bb.maxx-bb.minx+pad*2, vh = bb.maxy-bb.miny+pad*2;
    svg.setAttribute("viewBox", (bb.minx-pad).toFixed(0)+" "+(bb.miny-pad).toFixed(0)+" "+vw.toFixed(0)+" "+vh.toFixed(0));
    svg.setAttribute("preserveAspectRatio","xMidYMid meet");
    svg.style.aspectRatio = vw.toFixed(0)+" / "+vh.toFixed(0);

    setCounts(stageCounts);

    // expose for parent
    svg._allParts = allParts;
    svg._stageCounts = stageCounts;
    svg._ghost = ghost;

  }, []);

  useEffect(()=>{
    const svg = svgRef.current;
    if(!svg || !svg._allParts) return;
    const allParts = svg._allParts;
    const stageCounts = svg._stageCounts;
    const ghost = svg._ghost;
    const total = Object.values(stageCounts).reduce((a,b)=>a+b,0);
    const steps = document.querySelectorAll('.step');
    const counter = document.getElementById('stageCount');

    function pcsUpTo(n){ let k=0; for(let i=1;i<=n;i++) k += (stageCounts[i]||0); return k; }
    function render(n){
      allParts.forEach(p=>p.classList.toggle("on", +p.dataset.stage <= n));
      steps.forEach((e,i)=>{
        e.classList.toggle("on", i === n-1);
        e.classList.toggle("done", i < n-1);
      });
      ghost?.classList.toggle("gone", n >= 6);
      svg.classList.toggle("lit", n >= 6);
      if(counter) counter.textContent = "0"+Math.max(n,1)+" / 06 · "+pcsUpTo(n)+" из "+total+" деталей";
      setCur(n);
    }

    let curLocal = 0;
    let timer = null;
    function tick(){
      curLocal = curLocal >= 6 ? 0 : curLocal;
      curLocal++;
      render(curLocal);
      timer = setTimeout(tick, curLocal === 6 ? 2400 : 900);
    }

    const io = new IntersectionObserver(es=>{
      es.forEach(e=>{
        if(e.isIntersecting && !timer) timer = setTimeout(tick,350);
        else if(!e.isIntersecting && timer){ clearTimeout(timer); timer=null; }
      });
    },{threshold:.15});
    io.observe(svg);

    render(0);
    // attach jump to window
    window.__jump = (n)=>{
      clearTimeout(timer);
      curLocal = n; render(n);
      timer = setTimeout(tick, curLocal === 6 ? 2400 : 1500);
    };

    return ()=>{ clearTimeout(timer); io.disconnect(); };
  }, [counts]);

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: inView ? 1 : 0, y: inView ? 0 : 20 }} transition={{ duration: 0.8 }}>
      <svg id="scene" ref={svgRef} role="img" aria-label="Сборка бытовки Б 01 по деталям" />
    </motion.div>
  );
}
