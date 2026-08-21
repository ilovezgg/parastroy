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
        <a className="on" href="#hero">Главная</a>
        <a href="#models">Продукция</a>
        <a href="#gallery">Галерея</a>
        <a href="#faq">Вопросы</a>
        <a href="#contacts">Контакты</a>
        <a href="#socials">Соц.сети</a>
      </nav>

      <div className="acts">
        <button className="btn-light">Рассчитать ваш проект</button>
        <a className="phone" href="tel:88003502418">
          <i>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6.5 4.5c-1 0-1.5.8-1.5 1.6 0 4.7 3.8 8.5 8.5 8.5.8 0 1.6-.5 1.6-1.5l-.2-1.5c-.1-.6-.5-1-1.1-1.2l-2-.6c-.4-.1-.8 0-1.1.3l-.8.8c-1-.5-1.8-1.3-2.3-2.3l.8-.8c.3-.3.4-.7.3-1.1l-.6-2C8 5.5 7.6 5.1 7 5l-1.5-.5h1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </i>
          <b>8 (800) 350-24-18</b>
        </a>
      </div>
    </div>
  )
}