'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function BlogListView({ articles }) {
  const sorted = [...articles].sort((a, b) => new Date(b.datePublished) - new Date(a.datePublished));
  const [feature, ...rest] = sorted;

  return (
    <main className="blog-page">
      <div className="blog-shell">
        <nav className="blog-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><Link href="/">Главная</Link></li>
            <li aria-current="page">Блог</li>
          </ol>
        </nav>

        <motion.div className="blog-head" {...fadeUp}>
          <span className="blog-kicker">Блог завода</span>
          <h1>Полезные <em>статьи</em></h1>
          <p>Отвечаем на частые вопросы про выбор, доставку и установку бытовок и блок-контейнеров.</p>
        </motion.div>

        {feature && (
          <motion.div {...fadeUp}>
            <Link href={`/blog/${feature.slug}`} className="blog-feature">
              <div className="blog-feature-photo" aria-hidden="true">
                <span className="blog-feature-wm mono">01</span>
              </div>
              <div className="blog-feature-meta">
                <span className="mono">статья</span>
                <span>{formatDate(feature.datePublished)}</span>
              </div>
              <h2>{feature.title}</h2>
              <p>{feature.excerpt}</p>
            </Link>
          </motion.div>
        )}

        <div className="blog-list">
          {rest.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.06, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/blog/${article.slug}`} className="blog-row">
                <span className="blog-row-date mono">{formatDate(article.datePublished)}</span>
                <div className="blog-row-main">
                  <div className="blog-row-thumb" aria-hidden="true" />
                  <div className="blog-row-body">
                    <h3>{article.title}</h3>
                    <p>{article.excerpt}</p>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
