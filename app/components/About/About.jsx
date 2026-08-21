"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import "./About.css";

const EASE = [0.16, 1, 0.3, 1];
const rise = { hidden: { opacity: 0, y: 28 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } } };
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } };

const FOUNDER = {
  name: "Сергей Ковалёв",
  role: "основатель и директор завода",
  photo: "/founder.jpg",
  since: "на производстве с 2011 года",
  phone: "+7 (812) 250-10-25",
  phoneHref: "+78122501025",
  mail: "info@unistroy.pro",
};

const PILLARS = [
  { n: "01", title: "Свой цех, а не перепродажа", text: "Варим металлокаркас, собираем деревянный каркас, утепляем, обшиваем и разводим электрику на одной площадке в Пестово. Между вами и цехом нет посредников." },
  { n: "02", title: "Склад и сборка под заказ", text: "Популярные модели стоят готовыми — отгрузка за 1–2 дня. С перегородками, тамбуром или санузлом — 3–5 дней в зависимости от загрузки цеха." },
  { n: "03", title: "Довозим и ставим сами", text: "Собственный автопарк и проверенные перевозчики, доставка по всей России от 105 ₽/км. Установка чаще всего без фундамента — на блоки ФБС." },
  { n: "04", title: "Тендеры и госконтракты", text: "Паспорт изделия и пакет документов в комплекте. Постоянным клиентам — рассрочка до 60 дней, на складские позиции скидка до 15%." },
];

export default function About() {
  return (
    <section id="about" className="about">
      <motion.div className="sec-head" variants={grid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }}>
        <motion.h2 variants={rise}>Завод, у которого <em>есть<br/>хозяин</em></motion.h2>
        <motion.p variants={rise}>Пестово, Новгородская область. Здесь варят каркас, утепляют и грузят на трал — и здесь же отвечают, если что-то пошло не так.</motion.p>
      </motion.div>

      <motion.div className="about-grid" variants={grid} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }}>
        <motion.figure className="about-portrait" variants={rise}>
          <Image src={FOUNDER.photo} alt={FOUNDER.name} width={900} height={1200} sizes="(max-width: 1180px) 100vw, 34vw" />
          <span className="about-portrait-badge mono">{FOUNDER.since}</span>
          <figcaption><b>{FOUNDER.name}</b><span>{FOUNDER.role}</span></figcaption>
        </motion.figure>

        <motion.div className="about-word" variants={rise}>
          <span className="about-kicker mono">слово владельца</span>
          <blockquote>Я не отгружаю блок, <em>который не поставил бы себе на участок</em>. Поэтому каждую отгрузку смотрю лично.</blockquote>
          <p>Мы делаем строительные, жилые, санитарные и охранные бытовки — от поста охраны до общежития из состыкованных блоков. Каждый блок собирается под крышей цеха, поэтому на площадку приезжает готовое изделие, а не конструктор.</p>
          <p className="about-word-muted">Цену и срок фиксируем в договоре до отгрузки. Если по гарантии что-то пойдёт не так — заявка идёт не подрядчику, а нам: принимаем и выезжаем сами.</p>
          <div className="about-sign">
            <svg viewBox="0 0 220 60" aria-hidden="true"><path d="M6 44c14-4 22-24 30-30 6-4 8 2 5 10-4 12-14 22-8 24 7 3 16-14 22-22 5-7 9-4 7 4-2 9-9 16-4 18 6 3 14-10 19-18 4-6 8-4 6 3-2 8-8 14-3 16 7 3 20-12 28-22 6-7 11-8 15-6" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" /></svg>
            <div><b>{FOUNDER.name}</b><span>{FOUNDER.role}</span></div>
          </div>
          <div className="about-contacts">
            <a href={`tel:${FOUNDER.phoneHref}`}><span className="mono">прямой телефон</span><b>{FOUNDER.phone}</b></a>
            <a href={`mailto:${FOUNDER.mail}`}><span className="mono">почта</span><b>{FOUNDER.mail}</b></a>
            <div><span className="mono">производство</span><b>г. Пестово, Новгородская обл.</b></div>
          </div>
        </motion.div>

        {PILLARS.map(p => (
          <motion.article className="about-card" key={p.n} variants={rise} whileHover={{ y: -6 }} transition={{ type: "spring", stiffness: 320, damping: 22 }}>
            <span className="mono">{p.n}</span><h3>{p.title}</h3><p>{p.text}</p>
          </motion.article>
        ))}
      </motion.div>
    </section>
  );
}