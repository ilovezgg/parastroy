'use client';
import { motion } from 'framer-motion';
import './Options.css';

const list = [
  {n:"01", t:"Двери", d:"Входные и межкомнатные стальные / деревянные, замки повышенной безопасности"},
  {n:"02", t:"Окна", d:"ПВХ двойное остекление, энергосберегающие, москитные сетки"},
  {n:"03", t:"Электрика", d:"Щиты, автоматы, розетки, освещение, заземление по ПУЭ"},
  {n:"04", t:"Климат", d:"Конвекторы, сплит-системы, тепловые завесы, котлы"},
  {n:"05", t:"Сантехника", d:"Водопровод, бойлеры, умывальники, унитазы, душевые"},
  {n:"06", t:"СЛС", d:"Видеонаблюдение, контроль доступа, LAN, Wi-Fi"},
];

export default function Options(){
  return (
    <section id="options">
      <div className="sec-head"><h2>Дополнительно<br/><em>укомплектуем</em></h2><p>Двери, окна ПВХ, электрика по ПУЭ, отопление, сантехника, слаботочка.</p></div>
      <div className="flow">
        {list.map((c,i)=>(
          <motion.div key={c.n} initial={{opacity:0,y:20}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{delay:i*0.05}} className="s">
            <u>{c.n}</u><h4>{c.t}</h4><p>{c.d}</p><div className="when">по запросу к менеджеру →</div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}