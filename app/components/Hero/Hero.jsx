'use client';
import { motion, AnimatePresence, useScroll, useTransform, useMotionValue, useSpring, useInView } from 'framer-motion';
import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import Scene from '../../Scene';
import Quiz from '../Quiz/Quiz';
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
  const [quizOpen, setQuizOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!quizOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [quizOpen]);

  const quizModal = (
    <AnimatePresence>
      {quizOpen && (
        <motion.div
          className="hero-quiz-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setQuizOpen(false)}
        >
          <motion.div
            className="hero-quiz-modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              className="hero-quiz-close"
              aria-label="Закрыть"
              onClick={() => setQuizOpen(false)}
            >
              ✕
            </button>
            <Quiz id="hero-quiz" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <motion.div id="hero" className="hero" style={{ y }}>
      <div className="hero-grid">
        <div>
          <div className="eyebrow">
            <s></s>
            <span className="eyebrow-line">В наличии 12 блоков ·</span>
            <span className="eyebrow-line eyebrow-line-2">Отгрузка за 24 часа · -52 500 ₽ на доставке</span>
          </div>
          <h1 className="hero-h1-full">Бытовки и модульные здания <em>от 150 000 ₽</em><br/><u>доставка 2 блоков по цене 1 доставки</u> — за 48 часов под ключ</h1>
          <h1 className="hero-h1-compact">
            Бытовки и модульные здания <em>от 150 000 ₽</em>
            <span className="hero-h1-sub">Доставка 2 блоков по цене 1 — под ключ за 48 часов</span>
          </h1>
          <p className="lede">Завод в Пестово, без посредников. Доставка 105 ₽/км — шаланда везет 2 бытовки по цене одной доставки, экономия 52 500 ₽ на примере СПб 500 км.</p>
          <button className="cta" onClick={() => setQuizOpen(true)}><span>Рассчитать с доставкой<br/>за 1 минуту</span><i>↗</i></button>
          <div className="assurances">
            <div className="a-row"><div className="ic">⌂</div><p>Отгрузка со склада завтра, документы для тендера в комплекте</p></div>
            <div className="a-row"><div className="ic">✓</div><p>Гарантия 24 мес, установка на ФБС</p></div>
          </div>
        </div>

        <div className="stage-wrap">
          <div className="model-head"><div className="t">Бытовка Б 01 · 6,0 × 2,4 м</div><div className="c mono">05 / 06</div></div>
          <motion.div className="scene-stage" animate={{ y: [0,-6,0] }} transition={{ duration: 9, repeat: Infinity }}><Scene /></motion.div>
          <div className="steps">{STAGES.map((s,i)=><button key={i} className="step"><u>0{i+1}</u><b>{s}</b><span className="bar"></span></button>)}</div>
          <div className="stats">
            <div className="stat"><div className="n"><Counter value={150000}/><small>₽</small></div><p>цена блока без доставки</p></div>
            <div className="stat"><div className="n"><Counter value={2}/><small>дня</small></div><p>средний срок доставки</p></div>
            <div className="stat"><div className="n"><Counter value={105}/><small>₽/км</small></div><p>доставка по России</p></div>
          </div>
        </div>
      </div>

      {mounted && createPortal(quizModal, document.body)}
    </motion.div>
  )
}