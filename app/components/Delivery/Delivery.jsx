"use client";

import { useEffect, useRef, useState } from "react";
import { motion, animate, useReducedMotion } from "framer-motion";
import "./Delivery.css";

const EASE = [0.16, 1, 0.3, 1];
const rise = {
  hidden: { opacity: 0, y: 26 },
  show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
};
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const BLOCK = 150000;
const RATE = 105;
const MIN = 50;
const MAX = 2000;
const PRESETS = [200, 500, 1000, 1500];

const rub = (n) => Math.round(n).toLocaleString("ru-RU") + " ₽";

/* число, которое перетекает между значениями */
function Money({ value, className }) {
  const [shown, setShown] = useState(value);
  const prev = useRef(value);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (reduce) {
      setShown(value);
      prev.current = value;
      return;
    }
    const controls = animate(prev.current, value, {
      duration: 0.45,
      ease: EASE,
      onUpdate: (v) => setShown(v),
    });
    prev.current = value;
    return () => controls.stop();
  }, [value, reduce]);

  return <span className={className}>{rub(shown)}</span>;
}

export default function Delivery() {
  const [km, setKm] = useState(500);

  const delivery = km * RATE;
  const oneTotal = BLOCK + delivery;
  const twoTotal = BLOCK * 2 + delivery;
  const perBlock = twoTotal / 2;
  const save = oneTotal - perBlock; // ровно половина перевозки

  const progress = ((km - MIN) / (MAX - MIN)) * 100;

  return (
    <section id="delivery" className="delivery">
      <motion.div
        className="sec-head"
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.h2 variants={rise}>
          Доставка <em>по всей России</em>
        </motion.h2>
        <motion.p variants={rise}>
          Отгружаем с производства в Пестово. Ставка 105 ₽/км, средний срок 1–2 дня. Шаланда везёт два блока
          за цену одной машины.
        </motion.p>
      </motion.div>

      <motion.div
        className="d-grid"
        variants={grid}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.12 }}
      >
        {/* ---------- калькулятор ---------- */}
        <motion.div className="d-calc" variants={rise}>
          <div className="d-calc-head">
            <span className="d-kicker mono">калькулятор доставки</span>
            <span className="d-formula mono">цена блока + км × 105</span>
          </div>

          {/* маршрут */}
          <div className="d-route" aria-hidden="true">
            <span className="d-point start">
              <i />
              Пестово
            </span>
            <span className="d-line">
              <span className="d-line-fill" style={{ width: `${progress}%` }} />
              <span className="d-truck" style={{ left: `${progress}%` }}>
                <svg viewBox="0 0 24 24" fill="none">
                  <path d="M2 7h11v9H2zM13 10h4l3 3v3h-7z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
                  <circle cx="6.5" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.4" />
                  <circle cx="16.5" cy="18" r="1.8" stroke="currentColor" strokeWidth="1.4" />
                </svg>
              </span>
            </span>
            <span className="d-point end">
              <i />
              ваш адрес
            </span>
          </div>

          <label className="d-slider">
            <span className="sr-only">Расстояние доставки, км</span>
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={10}
              value={km}
              onChange={(e) => setKm(+e.target.value)}
              style={{ "--p": `${progress}%` }}
            />
          </label>

          <div className="d-presets">
            {PRESETS.map((p) => (
              <button
                key={p}
                type="button"
                className={km === p ? "on" : ""}
                onClick={() => setKm(p)}
              >
                {p} км
              </button>
            ))}
            <span className="d-km mono">
              {km.toLocaleString("ru-RU")} км · {RATE} ₽/км
            </span>
          </div>

          <div className="d-total">
            <div>
              <span className="mono">стоимость перевозки</span>
              <Money value={delivery} className="d-total-n" />
            </div>
            <p>
              Цена за машину, а не за блок: вторым блоком перевозка не растёт. Разгрузка считается отдельно —
              вашей техникой или нашим манипулятором.
            </p>
          </div>
        </motion.div>

        {/* ---------- два сценария ---------- */}
        <motion.div className="d-compare" variants={rise}>
          <div className="d-opt">
            <span className="d-kicker mono">один блок</span>
            <Money value={oneTotal} className="d-opt-n" />
            <dl>
              <div>
                <dt>Блок Б 01</dt>
                <dd>{rub(BLOCK)}</dd>
              </div>
              <div>
                <dt>Перевозка</dt>
                <dd>{rub(delivery)}</dd>
              </div>
            </dl>
          </div>

          <div className="d-opt best">
            <span className="d-badge mono">выгоднее</span>
            <span className="d-kicker mono">два блока шаландой</span>
            <Money value={perBlock} className="d-opt-n" />
            <span className="d-opt-sub">за блок · всего {rub(twoTotal)}</span>
            <dl>
              <div>
                <dt>Два блока</dt>
                <dd>{rub(BLOCK * 2)}</dd>
              </div>
              <div>
                <dt>Перевозка</dt>
                <dd>{rub(delivery)}</dd>
              </div>
            </dl>
            <div className="d-save">
              экономия <b>{rub(save)}</b> на каждом блоке
            </div>
          </div>
        </motion.div>

        {/* ---------- условия ---------- */}
        <motion.div className="d-facts" variants={rise}>
          {[
            ["1–2 дня", "средний срок доставки с производства"],
            ["105 ₽/км", "ставка по всей России, без наценок за регион"],
            ["ФБС", "ставим на блоки, фундамент чаще всего не нужен"],
            ["манипулятор", "разгрузка вашей техникой или нашей"],
          ].map(([n, t]) => (
            <div className="d-fact" key={n}>
              <b>{n}</b>
              <span>{t}</span>
            </div>
          ))}
        </motion.div>
      </motion.div>
    </section>
  );
}