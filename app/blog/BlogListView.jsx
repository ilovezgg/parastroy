'use client';
import Link from 'next/link';
import Image from 'next/image';
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

        <div className="blog-cards">
          {sorted.map((article, i) => (
            <motion.div
              key={article.slug}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ delay: i * 0.05, duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
            >
              <Link href={`/blog/${article.slug}`} className="blog-card">
                <div className="blog-card-photo" aria-hidden="true">
                  {article.coverImage ? (
                    <Image src={article.coverImage} alt={article.title} fill sizes="(max-width: 800px) 100vw, 800px" className="blog-card-photo-img" priority={i === 0} />
                  ) : (
                    <span className="blog-card-wm mono">{String(i + 1).padStart(2, '0')}</span>
                  )}
                </div>
                <div className="blog-card-body">
                  <div className="blog-card-meta">
                    <span className="mono">статья</span>
                    <span>{formatDate(article.datePublished)}</span>
                  </div>
                  <h2>{article.title}</h2>
                  <p>{article.excerpt}</p>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </main>
  );
}
