"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Gallery.css";

const EASE = [0.16, 1, 0.3, 1];

/* ровно одна крупная плитка: 8 + 7×4 = 36 колонок = три ряда без дыр */
const SHOTS = [
  { src: "/images/construction_cabin_sideview_3.webp", tag: "Б-01 · ФБС · RAL 7024", sub: "Пестово · 6 × 2,4 м", big: true },
  { src: "/images/construction_cabin_interior_2.webp", tag: "Интерьер · ДВП", sub: "стол прораба" },
  { src: "/images/construction_cabin_sideview.webp", tag: "Экстерьер", sub: "профлист С8 0,45 мм" },
  { src: "/images/construction_cabin_sideview_1.webp", tag: "Боковой вид", sub: "установка на ФБС" },
  { src: "/images/construction_cabin_sideview_2.webp", tag: "На ФБС блоках", sub: "без фундамента" },
  { src: "/images/construction_cabin_interior.webp", tag: "Интерьер", sub: "пол ДСП 16 мм" },
  { src: "/images/construction_cabin_interior_1.webp", tag: "Отделка ДВП", sub: "утеплитель 50 мм" },
  { src: "/images/construction_cabin_interior_3.webp", tag: "Окно ПВХ", sub: "1000 × 1000 мм" },
];

export default function Gallery() {
  const [index, setIndex] = useState(null);
  const open = index !== null;
  const shot = open ? SHOTS[index] : null;

  const close = useCallback(() => setIndex(null), []);
  const step = useCallback((d) => setIndex((i) => (i === null ? i : (i + d + SHOTS.length) % SHOTS.length)), []);

  /* клавиатура + блокировка прокрутки под лайтбоксом */
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close, step]);

  return (
    <section id="gallery" className="gallery">
      <div className="sec-head">
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE }}
        >
          Б-01 вживую — <em>экстерьер и интерьер</em>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.7, ease: EASE, delay: 0.08 }}
        >
          Реальные фото с площадки в Пестово: RAL 7024, профлист С8 0,45 мм, установка на ФБС.
        </motion.p>
      </div>

      <div className="g-grid">
        {SHOTS.map((g, i) => (
          <motion.button
            key={g.src}
            type="button"
            className={`g-card${g.big ? " big" : ""}`}
            onClick={() => setIndex(i)}
            aria-label={`Открыть фото: ${g.tag}`}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: Math.min(i * 0.04, 0.24), duration: 0.55, ease: EASE }}
            whileHover={{ y: -5 }}
          >
            <span className="g-media">
              <img src={g.src} alt={`${g.tag} — ${g.sub}`} loading="lazy" />
            </span>
            <span className="g-meta">
              <span className="g-text">
                <span className="g-tag mono">{g.tag}</span>
                <span className="g-sub">{g.sub}</span>
              </span>
              <span className="g-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={shot.tag}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={close}
          >
            <button type="button" className="lb-close" onClick={close} aria-label="Закрыть">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </button>

            <button
              type="button"
              className="lb-nav prev"
              aria-label="Предыдущее фото"
              onClick={(e) => {
                e.stopPropagation();
                step(-1);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>

            <motion.figure
              className="lb-frame"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, y: 14, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            >
              <img key={shot.src} src={shot.src} alt={`${shot.tag} — ${shot.sub}`} />
              <figcaption>
                <span>
                  <b className="mono">{shot.tag}</b>
                  <i>{shot.sub}</i>
                </span>
                <span className="lb-count mono">
                  {String(index + 1).padStart(2, "0")} / {String(SHOTS.length).padStart(2, "0")}
                </span>
              </figcaption>
            </motion.figure>

            <button
              type="button"
              className="lb-nav next"
              aria-label="Следующее фото"
              onClick={(e) => {
                e.stopPropagation();
                step(1);
              }}
            >
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}