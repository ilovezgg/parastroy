'use client';
import { motion } from 'framer-motion';
import './Options.css';

const list = [
  {
    n: "01", t: "Двери", d: "Входные и межкомнатные стальные / деревянные, замки повышенной безопасности",
    icon: <path d="M6 21V4a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v17M6 21h11M9 12h.01" />,
  },
  {
    n: "02", t: "Окна", d: "ПВХ двойное остекление, энергосберегающие, москитные сетки",
    icon: <><rect x="4" y="4" width="16" height="16" rx="1" /><path d="M12 4v16M4 12h16" /></>,
  },
  {
    n: "03", t: "Электрика", d: "Щиты, автоматы, розетки, освещение, заземление по ПУЭ",
    icon: <path d="M13 3 5 14h6l-1 7 8-11h-6l1-7Z" />,
  },
  {
    n: "04", t: "Климат", d: "Конвекторы, сплит-системы, тепловые завесы, котлы",
    icon: <path d="M12 2v20M4.5 6.5l15 11M19.5 6.5l-15 11" />,
  },
  {
    n: "05", t: "Сантехника", d: "Водопровод, бойлеры, умывальники, унитазы, душевые",
    icon: <path d="M12 3C9 7 6 10.5 6 14a6 6 0 0 0 12 0c0-3.5-3-7-6-11Z" />,
  },
  {
    n: "06", t: "СЛС", d: "Видеонаблюдение, контроль доступа, LAN, Wi-Fi",
    icon: <><path d="M5 12.5a10 10 0 0 1 14 0" /><path d="M8 16a5.5 5.5 0 0 1 8 0" /><circle cx="12" cy="19.5" r="1" fill="currentColor" stroke="none" /></>,
  },
];

export default function Options(){
  return (
    <section id="options">
      <div className="sec-head"><h2>Дополнительно<br/><em>укомплектуем</em></h2><p>Двери, окна ПВХ, электрика по ПУЭ, отопление, сантехника, слаботочка.</p></div>
      <div className="flow">
        {list.map((c,i)=>(
          <motion.div
            key={c.n}
            initial={{opacity:0,y:20}}
            whileInView={{opacity:1,y:0}}
            viewport={{once:true}}
            transition={{delay:i*0.05, duration:0.6, ease:[0.16,1,0.3,1]}}
            whileHover={{y:-4}}
            className="s"
          >
            <div className="s-top">
              <span className="s-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">{c.icon}</svg></span>
              <u>{c.n}</u>
            </div>
            <h4>{c.t}</h4>
            <p>{c.d}</p>
            <div className="when">по запросу к менеджеру<i>→</i></div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}
