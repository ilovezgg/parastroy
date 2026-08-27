'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

const EASE = [0.16, 1, 0.3, 1];
const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: EASE },
};
const grid = { hidden: {}, show: { transition: { staggerChildren: 0.08 } } };
const rise = { hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } };

function priceToNumber(price) {
  return parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;
}

// Короткие описания категорий для карточек-точек-входа — авторский текст,
// количество моделей и минимальная цена под ними всегда считаются от данных каталога.
const CATEGORY_INTRO = {
  bytovki: 'Мобильные бытовки для стройплощадок, дач и вахтовых посёлков — металл или сэндвич-панели, с утеплением и электрикой.',
  'blok-konteinery': 'Блок-контейнеры для поста охраны, КПП, санитарных нужд и спецназначения — быстрый монтаж, есть автономные варианты.',
  'modulnye-zdaniya': 'Модульные здания под ключ: жилые дома, общежития, офисы и пункты питания — от одного до трёх этажей.',
};

function flattenModels(category) {
  const models = [];
  category.types.forEach((type) => {
    (type.models || []).forEach((model) => {
      models.push({ ...model, typeSlug: type.slug });
    });
  });
  return models;
}

export default function ProductsView({ categories }) {
  const groups = useMemo(() => {
    return categories.map((category) => {
      const models = flattenModels(category).sort(
        (a, b) => priceToNumber(a.price) - priceToNumber(b.price)
      );
      return {
        category,
        count: models.length,
        minPrice: models[0] ? priceToNumber(models[0].price) : 0,
        cheapest: models.slice(0, 3),
      };
    });
  }, [categories]);

  const totalModels = groups.reduce((sum, g) => sum + g.count, 0);
  const overallMinPrice = Math.min(...groups.map((g) => g.minPrice).filter(Boolean));

  return (
    <main className="cat-page">
      <div className="shell">
        <nav className="cat-crumbs" aria-label="Хлебные крошки">
          <ol>
            <li><Link href="/">Главная</Link></li>
            <li aria-current="page">Продукция</li>
          </ol>
        </nav>

        <motion.div className="cat-head prod-head" {...fadeUp}>
          <span className="cat-kicker">Каталог продукции</span>
          <h1>Выберите <em>направление</em> — или начните с доступных моделей</h1>
          <p className="cat-lede">
            Три линейки продукции завода ПАРА | МОДУЛЬ: бытовки, блок-контейнеры и модульные здания.
            Собственное производство в Пестово, доставка по всей России.
          </p>
        </motion.div>

        <motion.div
          className="stats prod-stats"
          variants={grid}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.3 }}
        >
          <motion.div className="stat" variants={rise}>
            <div className="n">{totalModels}<small>моделей</small></div>
            <p>в каталоге прямо сейчас, во всех трёх направлениях</p>
          </motion.div>
          <motion.div className="stat" variants={rise}>
            <div className="n">3<small>направления</small></div>
            <p>бытовки, блок-контейнеры, модульные здания</p>
          </motion.div>
          <motion.div className="stat" variants={rise}>
            <div className="n">от {overallMinPrice.toLocaleString('ru-RU')}<small>₽</small></div>
            <p>стоимость самой доступной модели в каталоге</p>
          </motion.div>
        </motion.div>

        <section className="prod-pick-sec">
          <div className="sec-head">
            <h2>Точка входа: <em>с чего начать</em></h2>
            <p>Каждое направление — отдельный каталог со своими фильтрами по параметрам.</p>
          </div>

          <div className="prod-pick-grid">
            {groups.map(({ category, count, minPrice }, i) => (
              <motion.div
                key={category.slug}
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ delay: i * 0.08, duration: 0.7, ease: EASE }}
              >
                <Link href={`/catalog/${category.slug}`} className="prod-pick-card">
                  <span className="prod-pick-index mono">{String(i + 1).padStart(2, '0')}</span>
                  <h3>{category.title}</h3>
                  <p>{CATEGORY_INTRO[category.slug] || category.description}</p>
                  <div className="prod-pick-foot">
                    <div className="prod-pick-meta">
                      <b>{count}</b>
                      <span>моделей</span>
                      <i aria-hidden="true">·</i>
                      <span>от {minPrice.toLocaleString('ru-RU')} ₽</span>
                    </div>
                    <span className="prod-pick-cta">
                      Смотреть каталог
                      <i aria-hidden="true">
                        <svg viewBox="0 0 24 24" fill="none">
                          <path d="M7 17L17 7M9 7h8v8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </i>
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>

        <section className="prod-popular-sec">
          <div className="sec-head">
            <h2>Популярные <em>модели</em></h2>
            <p>Три самые доступные модели из каждого направления — по фактической цене в каталоге.</p>
          </div>

          {groups.map(({ category, cheapest }) => (
            <div key={category.slug} className="prod-popular-group">
              <div className="prod-popular-groupHead">
                <span className="cat-kicker">{category.title}</span>
                <Link href={`/catalog/${category.slug}`}>Весь раздел →</Link>
              </div>
              <div className="cat-grid">
                {cheapest.map((model) => (
                  <Link
                    key={model.slug}
                    href={`/catalog/${category.slug}/${model.typeSlug}/${model.slug}`}
                    className="cat-card"
                  >
                    <div className="cat-card-photo" aria-hidden="true">
                      <span className="cat-card-wm mono">{model.slug}</span>
                    </div>
                    <div className="cat-card-body">
                      <h2>{model.title}</h2>
                      <p>{model.size}</p>
                      <span className="cat-card-price mono">от {model.price}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
