'use client';
import './Header.css';

export default function Header(){
  return (
    <div className="topbar">
      <div className="brand">
        <img src="/para_modul_logo.png" alt="ПАРА МОДУЛЬ" className="brand-logo" />
        <div className="brand-text">
          <b>ПАРА | МОДУЛЬ</b>
          <span>бытовки и блок-контейнеры</span>
        </div>
      </div>

      <nav className="nav">
        <a className="on" href="#models">Бытовки</a>
        <a href="#specs">ТТХ</a>
        <a href="#options">Опции</a>
        <a href="#delivery">Доставка</a>
        <a href="#faq">FAQ</a>
      </nav>

      <div className="acts">
        <button className="btn-light">Оставить заявку</button>
        <div className="phone"><i>📞</i><b>8 (800) 350-24-18</b></div>
      </div>
    </div>
  )
}