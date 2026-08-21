'use client';
import { useState } from 'react';
import { motion } from 'framer-motion';
import './Footer.css';

const EASE = [0.16, 1, 0.3, 1];
const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };

export default function Footer(){
  const [phone, setPhone] = useState('');

  return (
    <section id="contact" className="calc-sec">
      <motion.div className="final free-final" variants={grid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }}>
        
        {/* ЛЕВАЯ КОЛОНКА - ТЕКСТ С ВЕРХНЕГО ЛЕВОГО УГЛА */}
        <motion.div className="free-left" variants={rise}>
          <motion.span className="calc-kicker" variants={rise}>бесплатно · за 1 день</motion.span>
          <motion.h2 variants={rise}>Бесплатное проектирование <em>под ваши задачи</em></motion.h2>
          <motion.p variants={rise}>Разработаем оптимальную планировку и подготовим проект с учетом ваших требований. Поможем подобрать комплектацию и рассчитаем стоимость.</motion.p>
          
          <motion.div className="free-bullets" variants={grid}>
            <motion.div variants={rise}><i>01</i><span>Планировка под ваш участок, количество людей и назначение</span></motion.div>
            <motion.div variants={rise}><i>02</i><span>Подбор комплектации и точная смета без скрытых доплат</span></motion.div>
            <motion.div variants={rise}><i>03</i><span>Фото готовых блоков с завода и сроки отгрузки</span></motion.div>
          </motion.div>
        </motion.div>

        {/* ПРАВАЯ КОЛОНКА - ФОРМА С АНИМАЦИЕЙ */}
        <motion.div className="free-right" variants={rise}>
          <motion.div className="free-form" variants={grid} whileHover={{ y: -2 }} transition={{ type: "spring", stiffness: 300, damping: 20 }}>
            <motion.input variants={rise} placeholder="Имя" />
            
            <motion.div className="phone-input" variants={rise}>
              <span className="phone-flag">🇷🇺</span>
              <input value={phone} onChange={e=>setPhone(e.target.value)} placeholder="+7 (000) 000-00-00" />
            </motion.div>

            <motion.input variants={rise} placeholder="Электронная почта" type="email" />
            <motion.textarea variants={rise} placeholder="Комментарий — что нужно разместить внутри?" rows={3}></motion.textarea>

            <motion.label className="agree" variants={rise}>
              <input type="checkbox" />
              <span>Я соглашаюсь с <a href="#">политикой по обработке персональных данных</a> и даю своё <a href="#">согласие на обработку</a></span>
            </motion.label>

            <motion.button className="btn-send" variants={rise} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}>
              <span>Отправить</span>
              <i>↗</i>
            </motion.button>

            <motion.small variants={rise}>Отвечаем за 12 минут · Пестово, отгрузка по РФ</motion.small>
          </motion.div>
        </motion.div>

      </motion.div>

      <footer><div>ЮНИСТРОЙ · завод бытовок с 2011</div><div>г. Пестово · 8 (812) 250-10-25 · info@unistroy.pro</div></footer>
    </section>
  )
}