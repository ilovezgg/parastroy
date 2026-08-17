'use client';
import { motion } from 'framer-motion';
import './Models.css';

const items = [
  {
    tag: "Самовывоз",
    title: "Б 01",
    size: "6,0 × 2,4 м · высота 2,5 м · потолки 2,2 м",
    list: [
      ["Обвязка", "швеллер 120×50×3"],
      ["Утеплитель", "минвата 50 мм"],
      ["Обшивка", "профлист С8 0,45 мм"],
      ["Пол", "ДСП 16 мм"],
    ],
    price: "150 000 ₽",
    sub: "без доставки"
  },
  {
    tag: "Один блок с доставкой",
    title: "Б 01 + доставка",
    size: "пример: Пестово — СПб, 500 км",
    list: [
      ["Блок", "150 000 ₽"],
      ["Доставка", "105 ₽/км"],
      ["За 500 км", "52 500 ₽"],
      ["Срок", "1–2 дня"],
    ],
    price: "202 500 ₽",
    sub: "без разгрузки"
  },
  {
    tag: "Два блока шаландой",
    title: "Б 01 × 2",
    size: "шаланда везёт два блока по цене одной",
    list: [
      ["Два блока", "300 000 ₽"],
      ["Доставка", "52 500 ₽"],
      ["Цена за блок", "176 250 ₽"],
      ["Срок", "1–2 дня"],
    ],
    price: "352 500 ₽",
    sub: "без разгрузки"
  }
];

export default function Models(){
  return (
    <section id="models">
      <div className="sec-head">
        <h2>Цена блока <em>и что меняет</em><br/>доставка</h2>
        <p>Расчёт на примере Пестово — Санкт-Петербург, 500 км. Шаланда везёт сразу два блока по цене одной машины.</p>
      </div>

      <div className="models">
        {items.map((c,i)=>(
          <motion.div
            key={i}
            className="card"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.08 }}
          >
            <div className="tag">{c.tag}</div>
            <h3>{c.title}</h3>
            <div className="size">{c.size}</div>

            <ul>
              {c.list.map(([k,v])=>(
                <li key={k}><span>{k}</span><b>{v}</b></li>
              ))}
            </ul>

            <div className="price">
              <em>{c.price}</em>
              <u>{c.sub}</u>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  )
}