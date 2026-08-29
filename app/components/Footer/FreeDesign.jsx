"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import PhoneInput from "../PhoneInput/PhoneInput";
import "./Footer.css";

const EASE = [0.16, 1, 0.3, 1];
const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

const PHONE = "+7 921 199 23 03";

export default function FreeDesign() {
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
      setError(`${err.message}. Можно позвонить: ${PHONE}`);
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

            <motion.div variants={rise}>
              <PhoneInput
                aria-label="Телефон"
                value={form.phone}
                onChange={(next) => {
                  setForm((f) => ({ ...f, phone: next }));
                  if (status === "error") setStatus("idle");
                }}
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
                <ArrowUpRight size={18} strokeWidth={1.7} />
              </i>
            </motion.button>

            <motion.small variants={rise} className={status === "error" ? "err" : ""}>
              {status === "error" ? error : status === "done" ? `Перезвоним на ${form.phone}` : "Отвечаем за 12 минут · Пестово, отгрузка по РФ"}
            </motion.small>
          </motion.form>
        </motion.div>
      </motion.div>
    </section>
  );
}
