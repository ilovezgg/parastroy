'use client';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { Phone, X } from 'lucide-react';
import Quiz from '../Quiz/Quiz';
import useScrollLock from '../../lib/useScrollLock';
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
  const [quizOpen, setQuizOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useScrollLock(open || quizOpen);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const quizModal = (
    <AnimatePresence>
      {quizOpen && (
        <motion.div
          className="header-quiz-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={() => setQuizOpen(false)}
        >
          <motion.div
            className="header-quiz-modal"
            initial={{ opacity: 0, y: 24, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.98 }}
            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.button
              type="button"
              className="header-quiz-close"
              aria-label="Закрыть"
              onClick={() => setQuizOpen(false)}
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                variants={{ rest: { rotate: 0 }, hover: { rotate: 90 } }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-flex' }}
              >
                <X size={18} strokeWidth={1.7} />
              </motion.span>
            </motion.button>
            <Quiz id="header-quiz" variant="modal" />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return (
    <div className={`topbar${scrolled ? ' is-scrolled' : ''}`}>
      <Link href="/" className="brand">
        <span className="brand-logo-frame">
          <Image
            src="/para_modul_logo.png"
            alt="ПАРА МОДУЛЬ"
            className="brand-logo"
            fill
            sizes="104px"
            priority
          />
        </span>
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
        <button type="button" className="btn-light" onClick={() => setQuizOpen(true)}>Рассчитать ваш проект</button>
        <a className="phone" href="tel:+79211992303">
          <i>
            <Phone size={15} strokeWidth={1.6} />
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
                fill
                sizes="72px"
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

      {mounted && createPortal(quizModal, document.body)}
    </div>
  )
}