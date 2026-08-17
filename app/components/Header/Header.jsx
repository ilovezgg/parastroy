'use client';
import './Header.css';

export default function Header(){
  return (
    <div className="topbar">
      <div className="brand">
        <svg width="46" height="22" viewBox="0 0 46 22" fill="none">
          <path d="M2 20V8l10-6 10 6v12" stroke="#0F1614" strokeWidth="1.3"/>
          <path d="M24 20V11l10-5 10 5v9" stroke="#1E5A47" strokeWidth="1.3"/>
        </svg>
        <b>СЕВЕРМОДУЛЬ</b>
        <span>бытовки и блок-контейнеры</span>
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