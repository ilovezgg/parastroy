'use client';
import { motion, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import Scene from '../../Scene';
import './Hero.css';

function Counter({ value }){
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const mv = useMotionValue(0);
  const spring = useSpring(mv, { stiffness: 90, damping: 20 });
  const [d, setD] = useState(0);
  useEffect(()=>{ if(inView) mv.set(value); }, [inView, value]);
  useEffect(()=> spring.on("change", v=> setD(Math.round(v))), [spring]);
  return <span ref={ref}>{d.toLocaleString()}</span>;
}

export default function Hero(){
  const STAGES = ["Обвязка","Пол","Стены","Кровля","Окно и дверь","Обшивка"];
  const { scrollY } = useScroll();
  const y = useTransform(scrollY, [0, 600], [0, -60]);

  return (
    <motion.div id="hero" className="hero" style={{ y }}>
      <div className="hero-grid">
        <div>
          <div className="eyebrow"><s></s>В НАЛИЧИИ 12 БЛОКОВ · ОТГРУЗКА ЗА 24 ЧАСА · -52 500 ₽ НА ДОСТАВКЕ</div>
          <h1>Бытовки и модульные здания <em>от 150 000 ₽</em><br/><u>доставка 2 блоков по цене 1 доставки</u> — за 48 часов под ключ</h1>
          <p className="lede">Завод в Пестово, без посредников. Доставка 105 ₽/км — шаланда везет 2 бытовки по цене одной доставки, экономия 52 500 ₽ на примере СПб 500 км.</p>
          <button className="cta"><span>Рассчитать с доставкой<br/>за 1 минуту + скидка 15%</span><i>↗</i></button>
          <div className="assurances">
            <div className="ic">⌂</div><p>Отгрузка со склада завтра, документы для тендера в комплекте</p>
            <div className="div"></div><p>Гарантия 24 мес, установка на ФБС</p>
          </div>
        </div>

        <div className="stage-wrap">
          <div className="model-head"><div className="t">Бытовка Б 01 · 6,0 × 2,4 м</div><div className="c mono">05 / 06</div></div>
          <motion.div animate={{ y: [0,-6,0] }} transition={{ duration: 9, repeat: Infinity }}><Scene /></motion.div>
          <div className="steps">{STAGES.map((s,i)=><button key={i} className="step"><u>0{i+1}</u><b>{s}</b><span className="bar"></span></button>)}</div>
          <div className="stats">
            <div className="stat"><div className="n"><Counter value={150000}/><small>₽</small></div><p>цена блока без доставки</p></div>
            <div className="stat"><div className="n"><Counter value={2}/><small>дня</small></div><p>средний срок доставки</p></div>
            <div className="stat"><div className="n"><Counter value={105}/><small>₽/км</small></div><p>доставка по России</p></div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}