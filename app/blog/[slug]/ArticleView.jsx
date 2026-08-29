'use client';
import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import PhoneInput from '../../components/PhoneInput/PhoneInput';

const fadeUp = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

/* тело статьи может быть намного выше экрана — amount в долях от
   высоты блока здесь не подходит, иначе триггер никогда не сработает */
const fadeUpBody = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

function formatDate(iso) {
  return new Date(iso).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });
}

function readingTime(blocks) {
  const words = blocks
    .map((b) => (b.type === 'ul' ? b.items.join(' ') : b.text))
    .join(' ')
    .trim()
    .split(/\s+/).length;
  return Math.max(1, Math.round(words / 200));
}

function ArticleBody({ blocks }) {
  return (
    <div className="article-body">
      {blocks.map((block, i) => {
        if (block.type === 'h2') return <h2 key={i}>{block.text}</h2>;
        if (block.type === 'h3') return <h3 key={i}>{block.text}</h3>;
        if (block.type === 'ul') {
          return (
            <ul key={i}>
              {block.items.map((item, j) => <li key={j}>{item}</li>)}
            </ul>
          );
        }
        return <p key={i}>{block.text}</p>;
      })}
    </div>
  );
}

function ArticleLeadForm({ articleTitle }) {
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [state, setState] = useState('idle');
  const [message, setMessage] = useState('');

  async function submit(e) {
    e.preventDefault();
    if (state === 'sending' || state === 'ok') return;
    setState('sending');
    try {
      const res = await fetch('/api/lead', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, name, source: `статья: ${articleTitle}`, comment: 'Заявка со страницы статьи блога' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Не отправилось');
      setState('ok');
      setMessage('Заявка у менеджера — перезвоним.');
    } catch (err) {
      setState('error');
      setMessage(`${err.message}. Можно позвонить: +7 921 199 23 03`);
    }
  }

  return (
    <div className="c-form">
      <span className="c-kicker mono">расчёт за 1 минуту</span>
      <h3>Остались вопросы? Оставьте номер</h3>
      <p>Ответим на вопрос из статьи и посчитаем стоимость с доставкой до вашего адреса.</p>
      <form onSubmit={submit}>
        <div className="c-fields">
          <label>
            <span className="mono">как к вам обращаться</span>
            <input type="text" placeholder="Имя" value={name} onChange={(e) => setName(e.target.value)} disabled={state === 'ok'} />
          </label>
          <label>
            <span className="mono">телефон</span>
            <PhoneInput value={phone} onChange={setPhone} required disabled={state === 'ok'} />
          </label>
        </div>
        <motion.button
          type="submit"
          className="c-submit"
          disabled={state === 'sending' || state === 'ok'}
          initial="rest"
          whileHover="hover"
          variants={{ rest: { y: 0 }, hover: { y: -2 } }}
          whileTap={{ scale: 0.98 }}
        >
          {state === 'sending' ? 'Отправляем…' : state === 'ok' ? 'Отправлено' : 'Получить расчёт'}
          <motion.i variants={{ rest: { x: 0 }, hover: { x: 3 } }} transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}>
            <ArrowRight size={16} strokeWidth={1.6} />
          </motion.i>
        </motion.button>
        <small className={state === 'error' ? 'c-note err' : 'c-note'} aria-live="polite">{message || 'Нажимая кнопку, вы соглашаетесь на обработку персональных данных.'}</small>
      </form>
    </div>
  );
}

export default function ArticleView({ article, relatedProducts, tag }) {
  const minutes = readingTime(article.body);

  return (
    <main className="article-page">
      <div className="article-col">
        <nav className="blog-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><Link href="/">Главная</Link></li>
            <li><Link href="/blog">Блог</Link></li>
            <li aria-current="page">{article.title}</li>
          </ol>
        </nav>

        <motion.div {...fadeUp}>
          <div className="article-meta">
            <span className="article-tag mono">{tag}</span>
            <span className="dot" />
            <span className="mono">{formatDate(article.datePublished)}</span>
            <span className="dot" />
            <span className="mono">{minutes} мин чтения</span>
          </div>
          <h1 className="article-title">{article.title}</h1>
        </motion.div>

        {article.coverImage && (
          <motion.figure className="article-figure" {...fadeUp}>
            <div className="article-image" aria-hidden="true">
              <Image src={article.coverImage} alt={article.title} fill sizes="(max-width: 720px) 100vw, 720px" priority className="article-image-img" />
            </div>
            {article.coverImageCaption && (
              <figcaption className="article-image-caption">{article.coverImageCaption}</figcaption>
            )}
          </motion.figure>
        )}

        <motion.div {...fadeUpBody}>
          <ArticleBody blocks={article.body} />
        </motion.div>

        {relatedProducts.length > 0 && (
          <motion.div {...fadeUp}>
            <hr className="article-break" />
            <span className="article-related-kicker">по теме статьи</span>
            <div className="article-related-grid">
              {relatedProducts.map((item) => (
                <Link key={item.href} href={item.href} className="article-related-card">
                  <div className="article-related-photo" aria-hidden="true" />
                  <div className="article-related-body">
                    <h3>{item.title}</h3>
                    <p>{item.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}

        <motion.div className="article-form-wrap" {...fadeUp}>
          <ArticleLeadForm articleTitle={article.title} />
        </motion.div>
      </div>
    </main>
  );
}
