export const S = 25;
export const COS = Math.cos(Math.PI/6);
export const SIN = 0.5;
export const NS = "http://www.w3.org/2000/svg";

export function P(x,y,z, bb){
  const px = (x-y)*COS*S, py = ((x+y)*SIN - z)*S;
  if(bb){
    if(px<bb.minx)bb.minx=px; if(px>bb.maxx)bb.maxx=px;
    if(py<bb.miny)bb.miny=py; if(py>bb.maxy)bb.maxy=py;
  }
  return px.toFixed(2)+","+py.toFixed(2);
}
export function el(tag,attrs){
  const e=document.createElementNS(NS,tag);
  for(const k in attrs) e.setAttribute(k,attrs[k]);
  return e;
}
export function quad(g, pts, fill, extra, bb){
  const p = pts.map(v=>P(v[0],v[1],v[2], bb)).join(" ");
  const polygon = el("polygon",Object.assign({points:p,fill:fill},extra||{}));
  g.appendChild(polygon);
  return polygon;
}
export const MAT = {
  steel:{t:"#3B4642",r:"#1E2523",l:"#252D2A"},
  pier:{t:"#4A5450",r:"#232A27",l:"#2C3431"},
  floor:{t:"#8E7355",r:"#4A3D2F",l:"#5C4A38"},
  wall:{t:"#242B28",r:"#141918",l:"#1B211F"},
  roof:{t:"#333B37",r:"#101514",l:"#161C1A"},
  deck:{t:"#C3A176",r:"#7C6244",l:"#9A7C56"},
  wood:{t:"#CBA97F",r:"#8A6C4A",l:"#A0805B"},
  dark:{t:"#1A201E",r:"#0E1211",l:"#131817"},
  deckAlt:{t:"#C3A176",r:"#7C6244",l:"#9A7C56"}
};
