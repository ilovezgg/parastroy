"use client";

import { motion } from "framer-motion";
import "./Socials.css";

const EASE = [0.16, 1, 0.3, 1];
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

/* TODO: ссылки и хендлы временные, заменить на реальные аккаунты ПАРА | МОДУЛЬ */
const SOCIALS = [
  { n: "01", name: "Telegram", handle: "@para_modul", text: "Сборки с цеха каждый день", meta: "канал", url: "https://t.me/para_modul" },
  { n: "02", name: "YouTube", handle: "PARA-MODUL", text: "Обзоры блоков и доставка", meta: "видео", url: "https://youtube.com/@para_modul" },
  { n: "03", name: "ВКонтакте", handle: "para-modul.ru", text: "Фото готовых блоков и отзывы", meta: "сообщество", url: "https://vk.com/para_modul" },
  { n: "04", name: "Instagram", handle: "@para_modul", text: "Reels со сварки каркаса", meta: "reels", url: "https://instagram.com/para_modul" },
  { n: "05", name: "TikTok", handle: "@para_modul", text: "Как варим и утепляем", meta: "короткие", url: "https://tiktok.com/@para_modul" },
  { n: "06", name: "Авито", handle: "12 блоков на складе", text: "Актуальные цены и наличие", meta: "объявления", url: "https://avito.ru/para_modul" },
];

const MANAGER = {
  handle: "@para_modul_manager",
  text: "Отвечаю за 5 минут: пришлю фото блока со склада и расчёт с доставкой до вашего адреса.",
  url: "https://t.me/para_modul_manager",
};

export default function Socials() {
  return (
    <section id="socials" className="socials">
      <motion.div
        className="sec-head"
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={rise}>
          Мы <em>в соцсетях</em>
        </motion.h2>
        <motion.p variants={rise}>
          Каждый день фото и видео с цеха в Пестово. Без монтажа, как есть.
        </motion.p>
      </motion.div>

      <motion.div
        className="socials-grid"
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.15 }}
      >
        {SOCIALS.map((s) => (
          <motion.a
            key={s.name}
            className="s-card"
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            variants={rise}
            whileHover={{ y: -6 }}
            transition={{ type: "spring", stiffness: 320, damping: 22 }}
          >
            <div className="s-top">
              <span className="mono">
                {s.n} · {s.name}
              </span>
              <span className="mono s-meta">{s.meta}</span>
            </div>
            <h3>{s.handle}</h3>
            <p>{s.text}</p>
            <i className="s-arrow" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </motion.a>
        ))}

        <motion.a
          className="s-card s-manager"
          href={MANAGER.url}
          target="_blank"
          rel="noopener noreferrer"
          variants={rise}
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 22 }}
        >
          <div>
            <span className="mono">прямая связь · telegram</span>
            <h3>{MANAGER.handle}</h3>
            <p>{MANAGER.text}</p>
          </div>
          <span className="s-manager-btn">
            Написать
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </span>
        </motion.a>
      </motion.div>
    </section>
  );
}