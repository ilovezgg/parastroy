"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ArrowUpRight, X } from "lucide-react";
import useScrollLock from "../../lib/useScrollLock";
import "./Gallery.css";

const EASE = [0.16, 1, 0.3, 1];

const SHOTS = [
  { src: "/images/construction_cabin_sideview_3.webp", tag: "Б-01 · ФБС · RAL 7024", sub: "Пестово · 6 × 2,4 м" },
  { src: "/images/construction_cabin_interior_2.webp", tag: "Интерьер · ДВП", sub: "стол прораба" },
  { src: "/images/construction_cabin_sideview.webp", tag: "Экстерьер", sub: "профлист С8 0,45 мм" },
  { src: "/images/construction_cabin_sideview_1.webp", tag: "Боковой вид", sub: "установка на ФБС" },
  { src: "/images/construction_cabin_sideview_2.webp", tag: "На ФБС блоках", sub: "без фундамента" },
  { src: "/images/construction_cabin_interior.webp", tag: "Интерьер", sub: "пол ДСП 16 мм" },
  { src: "/images/construction_cabin_interior_1.webp", tag: "Отделка ДВП", sub: "утеплитель 50 мм" },
  { src: "/images/construction_cabin_interior_3.webp", tag: "Окно ПВХ", sub: "1000 × 1000 мм" },
];

export default function Gallery() {
  /* ---------- слайдер ---------- */
  const rail = useRef(null);
  const [pos, setPos] = useState({ active: 0, progress: 0, atStart: true, atEnd: false });

  const measure = useCallback(() => {
    const el = rail.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    const p = max > 0 ? el.scrollLeft / max : 0;
    const card = el.querySelector(".g-card");
    const stepPx = card ? card.offsetWidth + 16 : el.clientWidth;
    setPos({
      active: Math.min(SHOTS.length - 1, Math.round(el.scrollLeft / stepPx)),
      progress: p,
      atStart: el.scrollLeft < 8,
      atEnd: el.scrollLeft > max - 8,
    });
  }, []);

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [measure]);

  const slide = (dir) => {
    const el = rail.current;
    if (!el) return;
    const card = el.querySelector(".g-card");
    const stepPx = card ? card.offsetWidth + 16 : el.clientWidth * 0.8;
    el.scrollBy({ left: dir * stepPx, behavior: "smooth" });
  };

  /* ---------- лайтбокс ---------- */
  const [index, setIndex] = useState(null);
  const open = index !== null;
  const shot = open ? SHOTS[index] : null;
  const close = useCallback(() => setIndex(null), []);
  const step = useCallback(
    (d) => setIndex((i) => (i === null ? i : (i + d + SHOTS.length) % SHOTS.length)),
    []
  );

  useScrollLock(open);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close, step]);

  return (
    <section id="gallery" className="gallery">
      <div className="g-head">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="g-kicker mono">галерея · площадка в пестово</span>
          <h2>
            Б-01 вживую — <em>экстерьер и интерьер</em>
          </h2>
        </motion.div>

        <motion.div
          className="g-head-right"
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE, delay: 0.08 }}
        >
          <p>Реальные фото: RAL 7024, профлист С8 0,45 мм, установка на ФБС. Клик — открыть в полный размер.</p>
          <div className="g-controls">
            <span className="g-count mono">
              {String(pos.active + 1).padStart(2, "0")} / {String(SHOTS.length).padStart(2, "0")}
            </span>
            <button type="button" onClick={() => slide(-1)} disabled={pos.atStart} aria-label="Предыдущее фото">
              <ChevronLeft size={16} strokeWidth={1.7} />
            </button>
            <button type="button" onClick={() => slide(1)} disabled={pos.atEnd} aria-label="Следующее фото">
              <ChevronRight size={16} strokeWidth={1.7} />
            </button>
          </div>
        </motion.div>
      </div>

      <div className="g-rail" ref={rail} onScroll={measure}>
        {SHOTS.map((g, i) => (
          <motion.button
            key={g.src}
            type="button"
            className="g-card"
            onClick={() => setIndex(i)}
            aria-label={`Открыть фото: ${g.tag}`}
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ delay: Math.min(i * 0.05, 0.25), duration: 0.6, ease: EASE }}
          >
            <span className="g-media">
              <Image src={g.src} alt={`${g.tag} — ${g.sub}`} fill sizes="(max-width: 768px) 80vw, 25vw" />
              <span className="g-fade" aria-hidden="true" />
            </span>

            <span className="g-top">
              <span className="g-num mono">{String(i + 1).padStart(2, "0")}</span>
              <span className="g-dot" aria-hidden="true" />
            </span>

            <span className="g-meta">
              <span className="g-text">
                <span className="g-tag mono">{g.tag}</span>
                <span className="g-sub">{g.sub}</span>
              </span>
              <span className="g-arrow" aria-hidden="true">
                <ArrowUpRight size={16} strokeWidth={1.7} />
              </span>
            </span>
          </motion.button>
        ))}
      </div>

      <div className="g-progress" aria-hidden="true">
        <span style={{ transform: `scaleX(${Math.max(pos.progress, 0.06)})` }} />
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
            <motion.button
              type="button"
              className="lb-close"
              onClick={close}
              aria-label="Закрыть"
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 90, scale: 1.12 } }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: "inline-flex" }}
              >
                <X size={20} strokeWidth={1.7} />
              </motion.span>
            </motion.button>

            <button type="button" className="lb-nav prev" aria-label="Предыдущее"
              onClick={(e) => { e.stopPropagation(); step(-1); }}>
              <ChevronLeft size={20} strokeWidth={1.7} />
            </button>

            <motion.figure
              className="lb-frame"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
            >
              <Image key={shot.src} src={shot.src} alt={`${shot.tag} — ${shot.sub}`} fill sizes="90vw" priority />
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

            <button type="button" className="lb-nav next" aria-label="Следующее"
              onClick={(e) => { e.stopPropagation(); step(1); }}>
              <ChevronRight size={20} strokeWidth={1.7} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}