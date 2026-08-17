'use client';
import './Footer.css';

export default function Footer(){
  return (
    <section id="contact">
      <div className="final">
        <div><h2>Оставьте заявку <em>для расчёта в тендер</em></h2><p>Готовы рассмотреть предложения по участию в тендерах на строительство, монтаж и поставку бытовок.</p></div>
        <div className="form"><input placeholder="+7 (___) ___-__-__"/><button className="btn-light">Оставить заявку</button><small>Опыт работы с госконтрактами · гарантия и сервис</small></div>
      </div>
      <footer><div>СЕВЕРМОДУЛЬ · производство бытовок</div><div>г. Пестово · 8 (800) 350-24-18</div></footer>
    </section>
  )
}