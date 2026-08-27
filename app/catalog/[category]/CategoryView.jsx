'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

function priceToNumber(price) {
  return parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;
}

// Модели типа, включая слитые по subtype подклассы (та же логика, что в TypeView) —
// нужно, чтобы найти самую популярную модель класса для фото на плитке.
function resolveTypeModels(category, type) {
  if (!type.mergeSubtype) return type.models || [];
  const merged = [];
  category.types.forEach((t) => {
    (t.models || []).forEach((m) => {
      if (m.subtype === type.mergeSubtype) merged.push(m);
    });
  });
  return merged;
}

// «Популярность» модели на сайте нигде явно не отслеживается — как и в блоке
// «Популярные модели» на /products, в качестве прокси берётся самая доступная цена.
function pickPopularModel(category, type) {
  const models = resolveTypeModels(category, type).filter((m) => m.image);
  if (models.length === 0) return null;
  return [...models].sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price))[0];
}

export default function CategoryView({ category }) {
  const popularByType = useMemo(() => {
    const map = {};
    category.types.forEach((type) => {
      map[type.slug] = pickPopularModel(category, type);
    });
    return map;
  }, [category]);

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
                  {popularByType[type.slug] ? (
                    <Image
                      src={popularByType[type.slug].image}
                      alt={type.title}
                      fill
                      sizes="(max-width: 700px) 50vw, 25vw"
                      className="cat-card-photo-img"
                    />
                  ) : (
                    <span className="cat-card-wm mono">{String(i + 1).padStart(2, '0')}</span>
                  )}
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
