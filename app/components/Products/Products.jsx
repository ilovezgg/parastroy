'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import './Products.css';

const data = [
  {
    id: "01",
    title: "Бытовки",
    sub: "Б-01 · 6×2.4м",
    desc: "Зимние, утепленные, металлические. Готова за 24ч.",
    price: "от 150 000 ₽",
    img: "/images/construction_cabin_sideview_3.webp",
    accent: "Хит"
  },
  {
    id: "02",
    title: "Блок-контейнеры",
    sub: "2.4×6м / 3×6м",
    desc: "Посты охраны, офисы, дачные. Собираются в комплексы.",
    price: "от 200 000 ₽",
    img: "/images/construction_cabin_sideview.webp",
    accent: "Для бизнеса"
  },
  {
    id: "03",
    title: "Модульные здания",
    sub: "До 3 этажей",
    desc: "Общежития, школы, столовые. Под ключ по РФ.",
    price: "от 400 000 ₽",
    img: "/images/construction_cabin_sideview_2.webp",
    accent: "Под ключ"
  }
];

export default function Products(){
  const [active, setActive] = useState(0);
  return (
    <section id="products" className="products-sec">
      <div className="sec-head">
        <h2>Продукция <em>завода</em></h2>
        <p>Веди мышкой по блокам — они разъезжаются как контейнеры на площадке. 3 типа, все в наличии в Пестово.</p>
      </div>

      <div className="prod-rail">
        {data.map((p,i)=>(
          <motion.div 
            key={p.id}
            className={`prod-rail-item ${active===i?'is-active':''}`}
            onMouseEnter={()=>setActive(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i*0.1, duration: .7, ease:[0.16,1,0.3,1] }}
          >
            <div className="rail-bg">
              <img src={p.img} alt={p.title}/>
            </div>

            <div className="rail-wm">{p.id}</div>
            
            <div className="rail-top">
              <span className="rail-id">{p.id} / {p.sub}</span>
            </div>

            <div className="rail-bottom">
              <div className="rail-headline">
                <h3>{p.title}</h3>
                <span className="rail-accent">{p.accent}</span>
              </div>

              <span className="rail-price">{p.price}</span>
              <p className="rail-desc">{p.desc}</p>

              <a href="#models" className="rail-btn">
                <span>Подробнее</span>
                <i>↗</i>
              </a>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}