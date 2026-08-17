'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import './FAQ.css';

const faqs = [
  ["Какие типы бытовок вы производите?","Строительные, жилые, санитарные и охранные."],
  ["Какие размеры доступны?","Типовой 2.4×6м, делаем под заказ, компонуем в модульные здания."],
  ["Что входит в конструкцию?","Сварной каркас, минвата 50мм, профлист С8 0.45, ДВП, окна, проводка."],
  ["Какие опции можно добавить?","Двери, окна ПВХ, электрика по ПУЭ, отопление, сантехника, СЛС."],
  ["Это готовый товар или под заказ?","Популярные на складе 1-2 дня, под заказ 3-5 дней."],
  ["Как доставка и установка?","По РФ, на ФБС блоки, без фундамента, кран заказчика."],
  ["Какая гарантия?","24 мес каркас, 12 мес отделка. Заявка по телефону."],
  ["Как оформить заказ?","Аванс 50%, остаток при сдаче, рассрочка до 60 дней."],
];

export default function FAQ(){
  const [open, setOpen] = useState(null);
  return (
    <section id="faq">
      <div className="sec-head"><h2>Частые <em>вопросы</em></h2><p>8 самых популярных вопросов — производство, доставка, гарантия.</p></div>
      <div className="faq-list">
        {faqs.map((f,i)=>(
          <div key={i} className="faq-item">
            <button onClick={()=>setOpen(open===i?null:i)}><b>{f[0]}</b><span>{open===i?"−":"+"}</span></button>
            <motion.div initial={false} animate={{height: open===i?"auto":0}} style={{overflow:"hidden"}}>
              <div className="answer">{f[1]}</div>
            </motion.div>
          </div>
        ))}
      </div>
    </section>
  )
}