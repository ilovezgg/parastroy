'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function CategoryView({ category }) {
  return (
    <main className="cat-page">
      <div className="shell">
        <nav className="cat-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><Link href="/">Главная</Link></li>
            <li aria-current="page">{category.title}</li>
          </ol>
        </nav>

        <motion.div className="cat-head" {...fadeUp}>
          <span className="cat-kicker">Каталог продукции</span>
          <h1>{category.title}</h1>
          <p className="cat-lede">{category.description}</p>
        </motion.div>

        <div className="cat-grid">
          {category.types.map((type, i) => (
            <motion.div
              key={type.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/catalog/${category.slug}/${type.slug}`} className="cat-card">
                <div className="cat-card-photo" aria-hidden="true">
                  <span className="cat-card-wm mono">{String(i + 1).padStart(2, '0')}</span>
                </div>
                <div className="cat-card-body">
                  <h2>{type.title}</h2>
                  <p>{type.description}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
