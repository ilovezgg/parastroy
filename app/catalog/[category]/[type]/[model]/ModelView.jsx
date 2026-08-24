'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function ModelView({ category, type, model, related }) {
  return (
    <main className="cat-page">
      <div className="shell">
        <nav className="cat-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><Link href="/">Главная</Link></li>
            <li><Link href={`/catalog/${category.slug}`}>{category.title}</Link></li>
            <li><Link href={`/catalog/${category.slug}/${type.slug}`}>{type.title}</Link></li>
            <li aria-current="page">{model.title}</li>
          </ol>
        </nav>

        <motion.div className="cat-hero" {...fadeUp}>
          <div className="cat-photo" aria-hidden="true">
            <span className="cat-photo-wm mono">{model.slug}</span>
            <span className="cat-photo-tag">{type.title}</span>
          </div>

          <div className="cat-info">
            <span className="cat-kicker">{category.title}</span>
            <h1>{model.title}</h1>
            <p className="cat-lede">{type.description}</p>

            <div className="cat-price-row">
              <span className="cat-price">{model.price}</span>
              <span className="cat-size mono">{model.size}</span>
            </div>

            <Link href="/#quiz" className="cat-cta">
              <span>Оставить заявку</span>
              <i>↗</i>
            </Link>
          </div>
        </motion.div>

        <motion.section className="cat-specs" {...fadeUp}>
          <div className="cat-specs-head">
            <span className="cat-kicker">Характеристики</span>
            <h2>Что входит в комплектацию</h2>
          </div>
          <dl>
            {model.specs.map((spec) => (
              <div key={spec.label}>
                <dt>{spec.label}</dt>
                <dd>{spec.value}</dd>
              </div>
            ))}
          </dl>
        </motion.section>

        {related.length > 0 && (
          <section className="cat-related">
            <div className="cat-related-head">
              <h2>Похожие <em>модели</em></h2>
              <p>Другие варианты из категории «{type.title.toLowerCase()}».</p>
            </div>

            <div className="models">
              {related.map((m, i) => (
                <motion.div
                  key={m.slug}
                  className="card"
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ delay: i * 0.08, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="tag">{type.title}</div>
                  <h3>{m.title}</h3>
                  <div className="size mono">{m.size}</div>

                  <ul>
                    {m.specs.slice(0, 3).map((spec) => (
                      <li key={spec.label}><span>{spec.label}</span><b>{spec.value}</b></li>
                    ))}
                  </ul>

                  <div className="price">
                    <em>{m.price}</em>
                    <Link href={`/catalog/${category.slug}/${type.slug}/${m.slug}`}>
                      <u>Подробнее →</u>
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
