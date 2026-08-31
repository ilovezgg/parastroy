'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Header from './components/Header/Header';
import FreeDesign from './components/Footer/FreeDesign';
import Footer from './components/Footer/Footer';
import './not-found.css';

export default function NotFound() {
  return (
    <>
      <Header />

      <div className="shell">
      <section className="nf">
        <motion.div
          className="nf-card"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="nf-kicker mono">ошибка 404</span>
          <div className="nf-num" aria-hidden="true">
            4<em>0</em>4
          </div>
          <h1>Такой бытовки на складе нет</h1>
          <p>Страница уехала вместе с доставкой или никогда не существовала. Проверьте адрес — либо возвращайтесь на главную и соберите модуль заново.</p>

          <div className="nf-actions">
            <Link href="/" className="nf-btn-dark">
              <span>На главную</span>
              <i>→</i>
            </Link>
            <Link href="/catalog/bytovki" className="nf-btn-glass">
              Смотреть каталог
            </Link>
          </div>
        </motion.div>
      </section>

      <FreeDesign />
      <Footer />
      </div>
    </>
  );
}
