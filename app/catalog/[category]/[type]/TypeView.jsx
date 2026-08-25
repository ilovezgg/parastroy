'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function TypeView({ category, type }) {
  return (
    <main className="cat-page">
      <div className="shell">
        <nav className="cat-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><Link href="/">Главная</Link></li>
            <li><Link href={`/catalog/${category.slug}`}>{category.title}</Link></li>
            <li aria-current="page">{type.title}</li>
          </ol>
        </nav>

        <motion.div className="cat-head" {...fadeUp}>
          <span className="cat-kicker">{category.title}</span>
          <h1>{type.title}</h1>
          <p className="cat-lede">{type.description}</p>
        </motion.div>

        <div className="cat-grid">
          {type.models.map((model, i) => (
            <motion.div
              key={model.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/catalog/${category.slug}/${type.slug}/${model.slug}`} className="cat-card">
                <div className="cat-card-photo" aria-hidden="true">
                  <span className="cat-card-wm mono">{model.slug}</span>
                </div>
                <div className="cat-card-body">
                  <h2>{model.title}</h2>
                  <p>{model.size}</p>
                  <span className="cat-card-price mono">от {model.price}</span>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
