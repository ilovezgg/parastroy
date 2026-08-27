"use client";

import "./Footer.css";

/* ↓↓↓ TODO: часы работы, telegram и адрес производства пока временные ↓↓↓ */
const CO = {
  name: "ПАРА | МОДУЛЬ",
  since: "завод бытовок с 2011 года", // TODO: уточнить год основания
  phone: "+7 921 199 23 03",
  phoneHref: "+79211992303",
  mail: "antonpara90@gmail.com",
  address: "г. Пестово, Новгородская обл.", // TODO: реальный адрес производства
  hours: "пн–сб, 9:00–19:00 (мск)", // TODO: уточнить часы работы
  telegram: "https://t.me/para_modul_manager", // TODO: реальный telegram
  legal: "ООО «ПАРА МОДУЛЬ»",
};

const NAV = [
  ["Главная", "/#hero"],
  ["Продукция", "/products"],
  ["Галерея", "/#gallery"],
  ["Доставка", "/#delivery"],
  ["Вопросы", "/#faq"],
  ["О заводе", "/#about"],
  ["Контакты", "/#contacts"],
  ["Статьи", "/blog"],
];

const CATALOG_LINKS = [
  ["Бытовки", "/catalog/bytovki"],
  ["Блок-контейнеры", "/catalog/blok-konteinery"],
  ["Модульные здания", "/catalog/modulnye-zdaniya"],
];

const SOCIAL_LINKS = [
  { name: "Telegram", short: "TG", url: "https://t.me/para_modul" },
  { name: "YouTube", short: "YT", url: "https://youtube.com/@para_modul" },
  { name: "ВКонтакте", short: "VK", url: "https://vk.com/para_modul" },
  { name: "Instagram", short: "IG", url: "https://instagram.com/para_modul" },
];

export default function Footer() {
  return (
    <>
      <footer className="site-footer">
        <div className="f-glow" aria-hidden="true" />

        <div className="f-top">
          <div className="f-brand">
            <a href="/" className="f-mark">
              {CO.name}
            </a>
            <p>{CO.since}</p>

            <div className="f-contacts">
              <a href={`tel:${CO.phoneHref}`}>{CO.phone}</a>
              <a href={`mailto:${CO.mail}`}>{CO.mail}</a>
            </div>

            <div className="f-socials">
              {SOCIAL_LINKS.map((s) => (
                <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer" title={s.name}>
                  {s.short}
                </a>
              ))}
            </div>
          </div>

          <nav className="f-nav">
            <h4 className="mono">Разделы сайта</h4>
            <div className="f-links">
              {NAV.map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <nav className="f-nav">
            <h4 className="mono">Каталог</h4>
            <div className="f-links f-links-col">
              {CATALOG_LINKS.map(([label, href]) => (
                <a key={label} href={href}>
                  {label}
                </a>
              ))}
            </div>
          </nav>

          <div className="f-nav f-meta-col">
            <h4 className="mono">Реквизиты</h4>
            <dl className="f-meta">
              <div>
                <dt className="mono">производство</dt>
                <dd>{CO.address}</dd>
              </div>
              <div>
                <dt className="mono">часы работы</dt>
                <dd>{CO.hours}</dd>
              </div>
            </dl>
          </div>
        </div>

        <div className="f-bottom">
          <span>© {new Date().getFullYear()} {CO.name}. Все права защищены.</span>
          <span className="f-legal">{CO.legal}</span>
          <button
            type="button"
            className="f-up"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Наверх
            <i aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none">
                <path d="M12 19V5M6 11l6-6 6 6" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </i>
          </button>
        </div>
      </footer>
    </>
  );
}