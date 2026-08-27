'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import './Header.css';

const LINKS = [
  ["Главная", "/#hero"],
  ["Продукция", "/products"],
  ["Галерея", "/#gallery"],
  ["Вопросы", "/#faq"],
  ["Контакты", "/#contacts"],
  ["Соц.сети", "/#socials"],
];

export default function Header(){
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    if (!open) return;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
      <Link href="/" className="brand">
        <Image
          src="/para_modul_logo.png"
          alt="ПАРА МОДУЛЬ"
          className="brand-logo"
          width={156}
          height={104}
          priority
        />
        <div className="brand-text">
          <b>ПАРА | МОДУЛЬ</b>
          <span>бытовки и блок-контейнеры</span>
        </div>
      </Link>

      <nav className="nav">
        <a className="on" href="/#hero">Главная</a>
        <a href="/products">Продукция</a>
        <a href="/#gallery">Галерея</a>
        <a href="/#faq">Вопросы</a>
        <a href="/#contacts">Контакты</a>
        <a href="/#socials">Соц.сети</a>
        <Link href="/blog">Статьи</Link>
      </nav>

      <div className="acts">
        <button className="btn-light">Рассчитать ваш проект</button>
        <a className="phone" href="tel:+79211992303">
          <i>
            <svg viewBox="0 0 24 24" fill="none">
              <path d="M6.5 4.5c-1 0-1.5.8-1.5 1.6 0 4.7 3.8 8.5 8.5 8.5.8 0 1.6-.5 1.6-1.5l-.2-1.5c-.1-.6-.5-1-1.1-1.2l-2-.6c-.4-.1-.8 0-1.1.3l-.8.8c-1-.5-1.8-1.3-2.3-2.3l.8-.8c.3-.3.4-.7.3-1.1l-.6-2C8 5.5 7.6 5.1 7 5l-1.5-.5h1z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </i>
          <b>+7 921 199 23 03</b>
        </a>
        <button
          type="button"
          className={`burger${open ? ' is-open' : ''}`}
          aria-label={open ? 'Закрыть меню' : 'Открыть меню'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span></span><span></span><span></span>
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            className="mnav"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
          >
            <motion.div
              className="mnav-logo"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            >
              <Image
                src="/para_modul_logo.png"
                alt="ПАРА МОДУЛЬ"
                width={72}
                height={48}
              />
            </motion.div>

            <motion.nav
              className="mnav-links"
              initial="closed"
              animate="open"
              exit="closed"
            >
              {LINKS.map(([label, href], i) => (
                <motion.a
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 16 }}
                  transition={{ delay: i * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                >
                  {label}
                </motion.a>
              ))}
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 16 }}
                transition={{ delay: LINKS.length * 0.04, duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link href="/blog" onClick={() => setOpen(false)}>Статьи</Link>
              </motion.div>
            </motion.nav>

            <motion.a
              className="mnav-phone"
              href="tel:+79211992303"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ delay: (LINKS.length + 1) * 0.04, duration: 0.35 }}
            >
              +7 921 199 23 03
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}