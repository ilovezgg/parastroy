"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import "./Footer.css";

const EASE = [0.16, 1, 0.3, 1];
const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

/* ↓↓↓ TODO: часы работы, telegram и адрес производства пока временные ↓↓↓ */
const CO = {
  name: "ПАРА | МОДУЛЬ",
  since: "завод бытовок с 2011 года", // TODO: уточнить год основания
  phone: "+7 921 199 23 03",
  phoneHref: "+79211992303",
  mail: "antonpara90@gmail.com",
  address: "г. Пестово, Новгородская обл.", // TODO: реальный адрес производства
  hours: "пн–сб, 9:00–19:00 (мск)", // TODO: уточнить часы работы
  telegram: "https://t.me/para_modul_manager", // TODO: реальный telegram
  legal: "ООО «ПАРА МОДУЛЬ»",
};

const NAV = [
  ["Главная", "/#hero"],
  ["Продукция", "/products"],
  ["Галерея", "/#gallery"],
  ["Доставка", "/#delivery"],
  ["Вопросы", "/#faq"],
  ["О заводе", "/#about"],
  ["Контакты", "/#contacts"],
  ["Статьи", "/blog"],
];

const CATALOG_LINKS = [
  ["Бытовки", "/catalog/bytovki"],
  ["Блок-контейнеры", "/catalog/blok-konteinery"],
  ["Модульные здания", "/catalog/modulnye-zdaniya"],
];

const SOCIAL_LINKS = [
  { name: "Telegram", short: "TG", url: "https://t.me/para_modul" },
  { name: "YouTube", short: "YT", url: "https://youtube.com/@para_modul" },
  { name: "ВКонтакте", short: "VK", url: "https://vk.com/para_modul" },
  { name: "Instagram", short: "IG", url: "https://instagram.com/para_modul" },
];

export default function Footer() {
  const [form, setForm] = useState({ name: "", phone: "", mail: "", comment: "" });
  const [agree, setAgree] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    if (status === "sending" || status === "done") return;
    if (form.phone.replace(/\D/g, "").length < 10) {
      setStatus("error");
      setError("Проверьте номер телефона");
      return;
    }
    setStatus("sending");
    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone: form.phone,
          name: form.name,
          source: "футер",
          comment: `Бесплатное проектирование. Почта: ${form.mail || "—"}. ${form.comment || ""}`,
          utm: {
            source: params.get("utm_source") || "",
            medium: params.get("utm_medium") || "",
            campaign: params.get("utm_campaign") || "",
          },
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Не отправилось");
      setStatus("done");
    } catch (err) {
      setStatus("error");
      setError(`${err.message}. Можно позвонить: ${CO.phone}`);
    }
  }

  return (
    <section id="contact" className="calc-sec">
      <motion.div
        className="free-final"
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.2 }}
      >
        <motion.div className="free-left" variants={rise}>
          <motion.span className="calc-kicker mono" variants={rise}>
            бесплатно · за 1 день
          </motion.span>
          <motion.h2 variants={rise}>
            Бесплатное проектирование <em>под ваши задачи</em>
          </motion.h2>
          <motion.p variants={rise}>
            Разработаем планировку и подготовим проект с учётом ваших требований. Поможем подобрать
            комплектацию и рассчитаем стоимость с доставкой.
          </motion.p>

          <motion.div className="free-bullets" variants={grid}>
            {[
              "Планировка под ваш участок, количество людей и назначение",
              "Подбор комплектации и точная смета без скрытых доплат",
              "Фото готовых блоков с завода и сроки отгрузки",
            ].map((t, i) => (
              <motion.div key={t} variants={rise}>
                <i className="mono">{String(i + 1).padStart(2, "0")}</i>
                <span>{t}</span>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div className="free-right" variants={rise}>
          <motion.form className="free-form" onSubmit={submit} variants={grid}>
            <motion.input variants={rise} placeholder="Имя" value={form.name} onChange={set("name")} disabled={status === "done"} />

            <motion.div className="phone-input" variants={rise}>
              <span className="phone-flag" aria-hidden="true">
                +7
              </span>
              <input
                type="tel"
                aria-label="Телефон"
                value={form.phone}
                onChange={(e) => {
                  set("phone")(e);
                  if (status === "error") setStatus("idle");
                }}
                placeholder="(000) 000-00-00"
                disabled={status === "done"}
                required
              />
            </motion.div>

            <motion.input variants={rise} type="email" placeholder="Электронная почта" value={form.mail} onChange={set("mail")} disabled={status === "done"} />
            <motion.textarea variants={rise} rows={3} placeholder="Комментарий — что нужно разместить внутри?" value={form.comment} onChange={set("comment")} disabled={status === "done"} />

            <motion.label className="agree" variants={rise}>
              <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} required />
              <span>
                Я соглашаюсь с <a href="#contact">политикой обработки персональных данных</a> и даю{" "}
                <a href="#contact">согласие на обработку</a>
              </span>
            </motion.label>

            <motion.button
              className="btn-send"
              type="submit"
              variants={rise}
              disabled={!agree || status === "sending" || status === "done"}
              whileHover={agree && status === "idle" ? { scale: 1.01 } : {}}
              whileTap={{ scale: 0.98 }}
            >
              <span>{status === "sending" ? "Отправляем…" : status === "done" ? "Заявка принята" : "Отправить"}</span>
              <i aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </i>
            </motion.button>

            <motion.small variants={rise} className={status === "error" ? "err" : ""}>
              {status === "error" ? error : status === "done" ? `Перезвоним на ${form.phone}` : "Отвечаем за 12 минут · Пестово, отгрузка по РФ"}
            </motion.small>
          </motion.form>
        </motion.div>
      </motion.div>

      {/* ---------- футер ---------- */}
      <footer className="site-footer">
        <div className="f-glow" aria-hidden="true" />

        <div className="f-top">
          <div className="f-brand">
            <a href="/" className="f-mark">
              {CO.name}
            </a>
            <p>{CO.since}</p>

            <div className="f-contacts">
              <a href={`tel:${CO.phoneHref}`}>{CO.phone}</a>
              <a href={`mailto:${CO.mail}`}>{CO.mail}</a>
            </div>

            <div className="f-socials">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}>
                  {s.short}
                </a>
              ))}
            </div>
          </div>

          <nav className="f-nav">
            <h4 className="mono">Разделы сайта</h4>
            <div className="f-links">
              {NAV.map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <nav className="f-nav">
            <h4 className="mono">Каталог</h4>
            <div className="f-links f-links-col">
              {CATALOG_LINKS.map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <div className="f-nav f-meta-col">
            <h4 className="mono">Реквизиты</h4>
            <dl className="f-meta">
              <div>
                <dt className="mono">производство</dt>
                <dd>{CO.address}</dd>
              </div>
              <div>
                <dt className="mono">часы работы</dt>
                <dd>{CO.hours}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="f-bottom">
          <span>© {new Date().getFullYear()} {CO.name}. Все права защищены.</span>
          <span className="f-legal">{CO.legal}</span>
          <button
            type="button"
            className="f-up"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Наверх
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </button>
        </div>
      </footer>
    </section>
  );
}