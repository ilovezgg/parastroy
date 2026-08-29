"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import ResultCard from "./ResultCard";
import PhoneInput from "../PhoneInput/PhoneInput";
import { getRecommendations } from "./matching";
import "./Quiz.css";

const EASE = [0.16, 1, 0.3, 1];

const STEPS = [
  {
    type: "single",
    q: "Для чего нужно помещение?",
    opts: ["Стройка и рабочие", "Охрана или КПП", "Дача, хозблок", "Офис, прорабская", "Проживание, общежитие", "Передвижной пункт"],
  },
  {
    type: "single",
    q: "Сколько человек и на какой срок?",
    opts: ["1–2 человека, на сезон", "3–4 человека, на год", "5–10 человек, надолго", "10+ человек, здание", "Под склад и оборудование"],
  },
  {
    type: "single",
    q: "Где будет стоять и какие условия?",
    opts: ["Область, ровная площадка", "Регион, далеко везти", "Бездорожье, север", "Город, нужен антивандал", "Зима до −40, тёплый"],
  },
  {
    type: "single",
    q: "Что важнее всего?",
    opts: ["Самая низкая цена", "Тепло зимой", "Перевезти за один день", "Чтобы не вскрыли", "Приличный внешний вид"],
  },
  {
    type: "single",
    q: "Какой бюджет закладываете?",
    opts: ["До 200 000 ₽", "200 000 – 500 000 ₽", "500 000 – 1 500 000 ₽", "От 1 500 000 ₽", "Пока не знаю, ориентируюсь на вас"],
  },
  {
    type: "single",
    q: "Сколько этажей нужно?",
    opts: ["Один уровень", "Два этажа", "Три этажа", "Ещё не думал(а), нужна помощь"],
  },
  {
    type: "single",
    q: "Место труднодоступное?",
    opts: ["Нет, обычный подъезд", "Да, нужна доставка на санях", "Да, нужна доставка на шасси/колёсах", "Не уверен(а), нужна консультация"],
  },
  {
    type: "multi",
    q: "Что должно быть внутри?",
    opts: ["Пустая коробка", "Кровати и спальные места", "Стол, стулья, свет", "Туалет, душ, кухня", "Два входа, тамбур, окна"],
  },
  {
    type: "double",
    q: "Когда нужно и кто принимает решение?",
    when: ["Срочно, на этой неделе", "В этом месяце", "Через 2–3 месяца", "Пока считаю"],
    who: ["Решаю сам", "Нужно согласовать", "Тендер, юрлицо"],
  },
  { type: "lead", q: "Расчёт готов" },
];

const BONUS = [
  "Расчёт доставки до участка",
  "Три варианта под бюджет",
  "Фиксация цены на 14 дней",
  "Чертёж и фото блока вживую",
];

function pluralModel(n) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return "модель";
  if ([2, 3, 4].includes(mod10) && ![12, 13, 14].includes(mod100)) return "модели";
  return "моделей";
}

export default function Quiz({ id = "quiz", variant = "page" }) {
  const compact = variant === "modal";
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState({});
  const [multi, setMulti] = useState([]);
  const [when, setWhen] = useState("");
  const [who, setWho] = useState("");
  const [phone, setPhone] = useState("");
  const [status, setStatus] = useState("idle"); // idle | sending | done | error
  const [error, setError] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const cur = STEPS[step];
  const total = STEPS.length;
  const progress = ((step + 1) / total) * 100;
  const canNext = cur.type === "multi" ? multi.length > 0 : cur.type === "double" ? Boolean(when && who) : true;

  const recommendation = useMemo(() => {
    if (step !== STEPS.length - 1) return null;
    return getRecommendations({
      purpose: answers[0],
      capacity: answers[1],
      priority: answers[3],
      budget: answers[4],
      accessibility: answers[6],
      interior: answers[7],
    });
  }, [step, answers]);

  const resultCount = recommendation ? recommendation.results.length : 0;

  const back = () => setStep((s) => Math.max(0, s - 1));

  const pick = (value) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    setAnswers((a) => ({ ...a, [step]: value }));
    setTimeout(() => {
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
      setIsTransitioning(false);
    }, 220);
  };

  async function submit(e) {
    e.preventDefault();
    if (status === "sending") return;
    if (phone.replace(/\D/g, "").length < 10) {
      setStatus("error");
      setError("Проверьте номер телефона");
      return;
    }
    setStatus("sending");
    const summary = STEPS.slice(0, STEPS.length - 1)
      .map((s, i) => {
        const v = answers[i];
        const text = Array.isArray(v) ? v.join(", ") : v && typeof v === "object" ? `${v.when} · ${v.who}` : v;
        return `${s.q} — ${text || "—"}`;
      })
      .join("\n");

    const params = typeof window !== "undefined" ? new URLSearchParams(window.location.search) : new URLSearchParams();
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          phone,
          source: "квиз",
          comment: `Квиз подбора блока:\n${summary}`,
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
      setError(`${err.message}. Можно позвонить: +7 921 199 23 03`);
    }
  }

  /* ---------- экран благодарности ---------- */
  if (status === "done") {
    return (
      <section id={id} className="quiz">
        <motion.div
          className="q-thanks"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: EASE }}
        >
          <span className="q-pill mono">
            <s />
            заявка принята
          </span>
          <h2>
            Считаем доставку — <em>перезвоним в течение 7 минут</em>
          </h2>
          <p>Наберём на {phone}. Пришлём три комплектации под ваш запрос и фото блока со склада.</p>
        </motion.div>
      </section>
    );
  }

  return (
    <section id={id} className="quiz">
      {/* шапка */}
      <div className="q-header">
        <div className="q-top">
          <span className="q-pill mono">
            <s />
            {step === STEPS.length - 1
              ? `расчёт готов · ${resultCount} ${pluralModel(resultCount)}`
              : "квиз за 60 секунд"}
          </span>
          <span className="q-step mono">
            {String(step + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
        <h2>
          {step === STEPS.length - 1 ? (
            resultCount <= 2 ? (
              <>
                Готово. <em>В этой нише у нас есть ровно то, что нужно</em>
              </>
            ) : (
              <>
                Готово. <em>Подобрали три варианта</em> под ваш запрос
              </>
            )
          ) : (
            <>
              Подберём блок и посчитаем доставку <em>за 60 секунд</em>
            </>
          )}
        </h2>
        <div className="q-progress">
          <motion.span animate={{ width: `${progress}%` }} transition={{ duration: 0.45, ease: EASE }} />
        </div>
      </div>

      {/* карточка шага */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.35, ease: EASE }}
          className={step === STEPS.length - 1 ? "q-card dark" : "q-card"}
        >
          {/* ---------- финальный шаг ---------- */}
          {cur.type === "lead" ? (
            <>
              {recommendation && recommendation.results.length > 0 && (
                <div className="q-results">
                  {recommendation.relaxedAccessibility && (
                    <p className="q-results-note">
                      Точных совпадений по вашим условиям доставки не нашлось — подобрали ближайшее по назначению, детали уточним по телефону.
                    </p>
                  )}
                  <div className="qr-grid" style={{ gridTemplateColumns: `repeat(${resultCount}, 1fr)` }}>
                    {recommendation.results.map((r) => (
                      <ResultCard key={r.model.slug} href={r.href} model={r.model} size={r.size} price={r.price} tags={r.tags} caption={r.caption} compact={compact} />
                    ))}
                  </div>
                </div>
              )}

              <div className="q-bonus">
                {BONUS.map((b, i) => (
                  <div key={b}>
                    <span className="q-bonus-i mono">{String(i + 1).padStart(2, "0")}</span>
                    {b}
                  </div>
                ))}
              </div>

              <form className="q-form" onSubmit={submit}>
                <PhoneInput
                  aria-label="Телефон"
                  value={phone}
                  onChange={(next) => {
                    setPhone(next);
                    if (status === "error") setStatus("idle");
                  }}
                />
                <button type="submit" className="q-submit" disabled={status === "sending"}>
                  {status === "sending" ? "Отправляем…" : "Получить расчёт"}
                  <i aria-hidden="true">
                    <ArrowUpRight size={18} strokeWidth={1.7} />
                  </i>
                </button>
              </form>

              <div className="q-nav">
                <button type="button" className="q-back" onClick={back}>
                  Назад
                </button>
                <small className={status === "error" ? "q-small err" : "q-small"}>
                  {status === "error" ? error : "Нажимая кнопку, вы соглашаетесь на обработку персональных данных."}
                </small>
              </div>
            </>
          ) : (
            <>
              <div className="q-question">
                <h3>{cur.q}</h3>
                <span className="mono">{String(step + 1).padStart(2, "0")}</span>
              </div>

              {/* один вариант */}
              {cur.type === "single" && (
                <div className="q-opts">
                  {cur.opts.map((o, i) => (
                    <button
                      type="button"
                      key={o}
                      className={`q-opt${answers[step] === o ? " sel" : ""}`}
                      disabled={isTransitioning}
                      onClick={() => pick(o)}
                    >
                      <span>
                        <span className="q-meta mono">
                          {String(i + 1).padStart(2, "0")} / вариант
                        </span>
                        <span className="q-label">{o}</span>
                      </span>
                      <span className="q-check" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}

              {/* несколько вариантов */}
              {cur.type === "multi" && (
                <div className="q-opts">
                  {cur.opts.map((o, i) => (
                    <button
                      type="button"
                      key={o}
                      aria-pressed={multi.includes(o)}
                      className={`q-opt${multi.includes(o) ? " sel" : ""}`}
                      onClick={() => setMulti((m) => (m.includes(o) ? m.filter((x) => x !== o) : [...m, o]))}
                    >
                      <span>
                        <span className="q-meta mono">
                          {String(i + 1).padStart(2, "0")} / опция
                        </span>
                        <span className="q-label">{o}</span>
                      </span>
                      <span className="q-check" aria-hidden="true" />
                    </button>
                  ))}
                </div>
              )}

              {/* срок + кто решает */}
              {cur.type === "double" && (
                <>
                  <div className="q-sub mono">срок</div>
                  <div className="q-opts tight">
                    {cur.when.map((o) => (
                      <button
                        type="button"
                        key={o}
                        className={`q-opt${when === o ? " sel" : ""}`}
                        onClick={() => setWhen(o)}
                      >
                        <span className="q-label">{o}</span>
                        <span className="q-check" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                  <div className="q-sub mono">кто принимает решение</div>
                  <div className="q-opts tight">
                    {cur.who.map((o) => (
                      <button
                        type="button"
                        key={o}
                        className={`q-opt${who === o ? " sel" : ""}`}
                        onClick={() => setWho(o)}
                      >
                        <span className="q-label">{o}</span>
                        <span className="q-check" aria-hidden="true" />
                      </button>
                    ))}
                  </div>
                </>
              )}

              <div className="q-nav">
                <button type="button" className="q-back" onClick={back} disabled={step === 0}>
                  Назад
                </button>

                {cur.type !== "single" && (
                  <button
                    type="button"
                    className="q-next"
                    disabled={!canNext}
                    onClick={() => {
                      if (cur.type === "multi") setAnswers((a) => ({ ...a, [step]: multi }));
                      if (cur.type === "double") setAnswers((a) => ({ ...a, [step]: { when, who } }));
                      setStep((s) => s + 1);
                    }}
                  >
                    Далее
                    <i aria-hidden="true">
                      <ArrowRight size={16} strokeWidth={1.6} />
                    </i>
                  </button>
                )}
              </div>
            </>
          )}
        </motion.div>
      </AnimatePresence>
    </section>
  );
}