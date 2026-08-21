"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./FAQ.css";

const EASE = [0.16, 1, 0.3, 1];

const GROUPS = ["Все", "Продукция", "Комплектация", "Сроки и доставка", "Гарантия и оплата"];

const FAQS = [
  {
    g: "Продукция",
    q: "Какие типы бытовок вы производите?",
    a: "Строительные, жилые, санитарные и охранные. Строительные ставят на площадках, жилые — для временного проживания рабочих, санитарные оснащаются душем и туалетом, охранные и КПП делаем со смотровыми окнами и компактной планировкой.",
  },
  {
    g: "Продукция",
    q: "Какие размеры и планировки доступны?",
    a: "Типовой размер — 2,4 × 6 м. Есть варианты с перегородками, тамбуром и санузлом, делаем и по индивидуальным размерам. Несколько блоков стыкуются между собой в модульное здание — от бытового городка до общежития.",
  },
  {
    g: "Комплектация",
    q: "Что входит в конструкцию?",
    a: "Сварной металлический каркас, утепление 50–100 мм, наружная обшивка оцинкованным профлистом С8 0,45 мм, внутренняя отделка ДВП, деревянные окна и двери. Проводка и розетка идут в базовой комплектации.",
  },
  {
    g: "Комплектация",
    q: "Какие опции можно добавить и сколько это стоит?",
    a: "Двери стальные и деревянные, окна ПВХ, электрика по ПУЭ, конвекторы, сплит-системы, тепловые завесы, сантехника и бойлеры, слаботочка — видеонаблюдение и СКС. Цена зависит от набора, менеджер сориентирует по вашему списку.",
  },
  {
    g: "Сроки и доставка",
    q: "Это готовый товар или изготавливается под заказ?",
    a: "Популярные модели стоят на складе — отгружаем за 1–2 дня. Индивидуальные конфигурации собираем за 3–5 дней: срок зависит от сложности и загрузки производства.",
  },
  {
    g: "Сроки и доставка",
    q: "Как организуется доставка и установка?",
    a: "Возим по всей России собственным автопарком и с проверенными перевозчиками, от 105 ₽/км. Ставим на подготовленное место, чаще всего без фундамента — на блоки ФБС. Нужна подъездная дорога, разгрузка краном-манипулятором за счёт заказчика. Средний срок доставки 1–2 дня.",
  },
  {
    g: "Гарантия и оплата",
    q: "Какая гарантия и как подать заявку на ремонт?",
    a: "24 месяца на каркас и конструкцию, 12 месяцев на отделку и инженерные системы. Заявка принимается по телефону +7 (812) 250-10-25 или на info@unistroy.pro, специалист выезжает в течение 5–7 рабочих дней.",
  },
  {
    g: "Гарантия и оплата",
    q: "Как оформить заказ и каков график платежей?",
    a: "Заказ онлайн или по телефону +7 (812) 250-10-25. Аванс 50%, остаток при сдаче. Постоянным клиентам даём рассрочку до 60 дней, на складские позиции действует скидка до 15%.",
  },
];

export default function FAQ() {
  const [group, setGroup] = useState("Все");
  const [open, setOpen] = useState(0);

  const list = group === "Все" ? FAQS : FAQS.filter((f) => f.g === group);

  return (
    <section id="faq" className="faq">
      <div className="faq-grid">
        {/* левая колонка */}
        <aside className="faq-aside">
          <motion.h2
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            Частые <em>вопросы</em>
          </motion.h2>
          <p>Производство, комплектация, сроки, гарантия и оплата — коротко и по делу.</p>

          <div className="faq-tabs">
            {GROUPS.map((g) => (
              <button
                key={g}
                type="button"
                className={group === g ? "on" : ""}
                onClick={() => {
                  setGroup(g);
                  setOpen(0);
                }}
              >
                {g}
              </button>
            ))}
          </div>

          <a className="faq-ask" href="#contacts">
            <span className="mono">не нашли ответ</span>
            <b>Спросить менеджера</b>
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </a>
        </aside>

        {/* аккордеон */}
        <div className="faq-list">
          {list.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={f.q}
                className={`faq-item${isOpen ? " open" : ""}`}
                layout
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, ease: EASE, delay: Math.min(i * 0.04, 0.2) }}
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  aria-controls={`faq-a-${i}`}
                >
                  <span className="faq-n mono">{String(i + 1).padStart(2, "0")}</span>
                  <b>{f.q}</b>
                  <span className="faq-sign" aria-hidden="true">
                    <i />
                    <i />
                  </span>
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={`faq-a-${i}`}
                      key="a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.35, ease: EASE }}
                      style={{ overflow: "hidden" }}
                    >
                      <div className="faq-answer">
                        <span className="faq-tag mono">{f.g}</span>
                        <p>{f.a}</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}