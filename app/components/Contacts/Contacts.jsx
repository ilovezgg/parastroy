"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import "./Contacts.css";

const EASE = [0.16, 1, 0.3, 1];
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

/* ↓↓↓ ПРОВЕРИТЬ / ЗАМЕНИТЬ НА РЕАЛЬНЫЕ ДАННЫЕ ↓↓↓ */
const CONTACTS = {
  phoneFree: "8 (800) 350-24-18",
  phoneFreeHref: "88003502418",
  phoneOffice: "+7 (812) 250-10-25",
  phoneOfficeHref: "+78122501025",
  mail: "info@unistroy.pro",
  telegram: "@unistroy_manager",
  telegramUrl: "https://t.me/unistroy_manager",
  address: "г. Пестово, Новгородская обл.",
  hours: "пн–сб, 9:00–19:00 (мск)",
  mapUrl: "https://yandex.ru/maps/?text=Пестово%20Новгородская%20область%20производство%20бытовок",
};

const CHANNELS = [
  {
    n: "01",
    label: "звонок",
    value: CONTACTS.phoneFree,
    note: "бесплатно по России, отвечает менеджер отдела продаж",
    href: `tel:${CONTACTS.phoneFreeHref}`,
  },
  {
    n: "02",
    label: "телефон завода",
    value: CONTACTS.phoneOffice,
    note: "производство, гарантия, заявки на ремонт",
    href: `tel:${CONTACTS.phoneOfficeHref}`,
  },
  {
    n: "03",
    label: "почта",
    value: CONTACTS.mail,
    note: "счета, ТЗ, документы для тендера",
    href: `mailto:${CONTACTS.mail}`,
  },
  {
    n: "04",
    label: "telegram",
    value: CONTACTS.telegram,
    note: "ответ за 5 минут, пришлём фото блока со склада",
    href: CONTACTS.telegramUrl,
    external: true,
  },
];

export default function Contacts() {
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [state, setState] = useState("idle"); // idle | sending | ok | error
  const [message, setMessage] = useState("");

  async function submit(e) {
    e.preventDefault();
    if (state === "sending" || state === "ok") return;
    setState("sending");
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          name,
          comment: "Заявка из секции «Контакты»",
          utm: {
            source: params.get("utm_source") || "",
            medium: params.get("utm_medium") || "",
            campaign: params.get("utm_campaign") || "",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не отправилось");
      setState("ok");
      setMessage("Заявка у менеджера — перезвоним по этому номеру.");
    } catch (err) {
      setState("error");
      setMessage(`${err.message}. Можно позвонить: ${CONTACTS.phoneFree}`);
    }
  }

  return (
    <section id="contacts" className="contacts">
      <motion.div
        className="sec-head"
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={rise}>
          Свяжитесь <em>напрямую с заводом</em>
        </motion.h2>
        <motion.p variants={rise}>
          Считаем комплектацию и доставку до вашего адреса в день обращения. Работаем с физлицами, компаниями и
          по тендерам.
        </motion.p>
      </motion.div>

      <motion.div
        className="c-grid"
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        {/* форма */}
        <motion.div className="c-form" variants={rise}>
          <span className="c-kicker mono">расчёт за 1 минуту</span>
          <h3>Оставьте номер — пришлём цену с доставкой</h3>
          <p>
            Скажем стоимость блока, стоимость перевозки до адреса и что есть на складе прямо сейчас. Без
            рассылок и повторных звонков.
          </p>

          <form onSubmit={submit}>
            <div className="c-fields">
              <label>
                <span className="mono">как к вам обращаться</span>
                <input
                  type="text"
                  placeholder="Имя"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={state === "ok"}
                />
              </label>
              <label>
                <span className="mono">телефон</span>
                <input
                  type="tel"
                  placeholder="+7 (___) ___-__-__"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  required
                  disabled={state === "ok"}
                />
              </label>
            </div>

            <motion.button
              type="submit"
              className="c-submit"
              disabled={state === "sending" || state === "ok"}
              whileHover={state === "idle" ? { y: -2 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              {state === "sending" ? "Отправляем…" : state === "ok" ? "Отправлено" : "Получить расчёт"}
              <i aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M5 12h13M13 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </i>
            </motion.button>

            <small className={state === "error" ? "c-note err" : "c-note"} role={state === "error" ? "alert" : undefined}>
              {message || "Нажимая кнопку, вы соглашаетесь на обработку персональных данных."}
            </small>
          </form>
        </motion.div>

        {/* каналы связи */}
        <motion.div className="c-channels" variants={rise}>
          {CHANNELS.map((c) => (
            <a
              key={c.n}
              className="c-row"
              href={c.href}
              {...(c.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            >
              <span className="c-row-head">
                <span className="mono c-n">{c.n}</span>
                <span className="mono c-label">{c.label}</span>
              </span>
              <b>{c.value}</b>
              <span className="c-note-sm">{c.note}</span>
              <i className="c-arrow" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </i>
            </a>
          ))}
        </motion.div>

        {/* адрес и отгрузка */}
        <motion.div className="c-place" variants={rise}>
          <div>
            <span className="c-kicker mono">производство и отгрузка</span>
            <h3>{CONTACTS.address}</h3>
            <p>
              Отгружаем блоки с площадки завода. Доставка по всей России от 105 ₽/км, средний срок 1–2 дня.
              Шаланда везёт сразу два блока по цене одной машины.
            </p>
          </div>
          <div className="c-place-side">
            <dl>
              <div>
                <dt className="mono">часы работы</dt>
                <dd>{CONTACTS.hours}</dd>
              </div>
              <div>
                <dt className="mono">самовывоз</dt>
                <dd>по согласованию с менеджером</dd>
              </div>
              <div>
                <dt className="mono">разгрузка</dt>
                <dd>ваша техника или наш манипулятор</dd>
              </div>
            </dl>
            <a className="c-map" href={CONTACTS.mapUrl} target="_blank" rel="noopener noreferrer">
              Открыть на карте
              <i aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </i>
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  );
}