"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { FAQS } from "@/app/data/faq";
import "./FAQ.css";

const EASE = [0.16, 1, 0.3, 1];

const GROUPS = ["Все", "Продукция", "Комплектация", "Сроки и доставка", "Гарантия и оплата"];

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
              <ArrowRight size={16} strokeWidth={1.6} />
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

                <motion.div
                  id={`faq-a-${i}`}
                  initial={false}
                  animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                  transition={{ duration: 0.35, ease: EASE }}
                  style={{ overflow: "hidden" }}
                >
                  <div className="faq-answer">
                    <span className="faq-tag mono">{f.g}</span>
                    <p>{f.a}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}