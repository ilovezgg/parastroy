"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { motion, useMotionValue, useAnimationFrame, useReducedMotion, useInView } from "framer-motion";
import "./Floating.css";

const EASE = [0.16, 1, 0.3, 1];
const SPEED = 42; // px в секунду

/* картинки положить в public/images/float/ и заменить пути */
const CARDS = [
  { img: "/images/float/b01.webp", kind: "Бытовка", name: "Б-01", spec: "6,0 × 2,4 м · утеплённая", price: "от 150 000 ₽", stock: true },
  { img: "/images/float/post.webp", kind: "Пост охраны", name: "КПП", spec: "2,4 × 3,0 м · смотровые окна", price: "от 200 000 ₽" },
  { img: "/images/float/dacha.webp", kind: "Дачный модуль", name: "Хозблок", spec: "2,4 × 6,0 м · с верандой" },
  { img: "/images/float/sanitar.webp", kind: "Санитарный блок", name: "Душ + WC", spec: "душевые, бойлер, сток" },
  { img: "/images/float/office.webp", kind: "Офис", name: "Прорабская", spec: "перегородка, тамбур, свет", stock: true },
  { img: "/images/float/modul.webp", kind: "Модульное здание", name: "Из блоков", spec: "до 3 этажей · общежития", price: "от 400 000 ₽" },
];

export default function Floating() {
  const section = useRef(null);
  const track = useRef(null);
  const x = useMotionValue(0);
  const factor = useRef(1);
  const [slow, setSlow] = useState(false);
  const reduce = useReducedMotion();
  const inView = useInView(section, { margin: "200px" });

  useAnimationFrame((_, delta) => {
    if (reduce || !inView || !track.current) return;
    /* скорость меняется плавно, а не рывком на наведении */
    const target = slow ? 0.18 : 1;
    factor.current += (target - factor.current) * 0.05;

    const half = track.current.scrollWidth / 2;
    let next = x.get() - (SPEED * factor.current * delta) / 1000;
    if (half && next <= -half) next += half;
    x.set(next);
  });

  const items = [...CARDS, ...CARDS];

  return (
    <section id="lineup" className="floating" ref={section}>
      <div className="sec-head">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Что мы <em>делаем на заводе</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
        >
          Наведите на ряд — он замедлится. Все типы стыкуются между собой в бытовой городок или здание.
        </motion.p>
      </div>

      <div
        className="fl-viewport"
        onMouseEnter={() => setSlow(true)}
        onMouseLeave={() => setSlow(false)}
      >
        <motion.div className="fl-track" ref={track} style={{ x }}>
          {items.map((c, i) => (
            <a className="fl-card" key={`${c.name}-${i}`} href="#contacts" aria-hidden={i >= CARDS.length}>
              <Image
                src={c.img}
                alt={`${c.kind} ${c.name}`}
                fill
                sizes="(max-width: 680px) 270px, (max-width: 1180px) 330px, 380px"
                loading="lazy"
              />
              <span className="fl-veil" aria-hidden="true" />

              {c.stock && <span className="fl-stock mono">в наличии</span>}

              <span className="fl-plate">
                <span className="fl-text">
                  <span className="fl-title">
                    <span className="fl-kind">{c.kind}</span>
                    <b>{c.name}</b>
                  </span>
                  <span className="fl-spec mono">{c.spec}</span>
                </span>
                <span className="fl-side">
                  {c.price && <span className="fl-price mono">{c.price}</span>}
                  <span className="fl-go" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none">
                      <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </span>
              </span>
            </a>
          ))}
        </motion.div>
      </div>
    </section>
  );
}