'use client';
import { useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useDebouncedValue } from '../lib/useDebouncedValue';

function priceToNumber(price) {
  return parseInt(String(price).replace(/[^\d]/g, ''), 10) || 0;
}

function roundDown(n, step) {
  return Math.floor(n / step) * step;
}
function roundUp(n, step) {
  return Math.ceil(n / step) * step;
}

/**
 * Боковой фильтр каталога.
 * Блок «Тип бытовки» работает в одном из двух режимов:
 * - навигация между классификациями верхнего уровня (проп sidebarLinks, ссылки <Link>);
 * - клиентская фильтрация подтипов внутри текущей классификации (проп subtypes, кнопки без перехода).
 * Плюс диапазон цены (двойной ползунок) и чекбоксы особенностей — тоже клиентская фильтрация.
 */
export default function CatalogFilter({ categorySlug, types, sidebarLinks, subtypes, activeTypeSlug, models, children }) {
  const sidebarTypes = useMemo(() => {
    if (!sidebarLinks) return types;
    return sidebarLinks
      .map((slug) => types.find((t) => t.slug === slug))
      .filter(Boolean);
  }, [types, sidebarLinks]);

  const [activeSubtype, setActiveSubtype] = useState(null);

  const priceBounds = useMemo(() => {
    const values = models.map((m) => priceToNumber(m.price));
    const step = 5000;
    return {
      min: roundDown(Math.min(...values), step),
      max: roundUp(Math.max(...values), step),
      step,
    };
  }, [models]);

  const featurePool = useMemo(() => {
    const set = new Set();
    models.forEach((m) => (m.features || []).forEach((f) => set.add(f)));
    return Array.from(set);
  }, [models]);

  const [minPrice, setMinPrice] = useState(priceBounds.min);
  const [maxPrice, setMaxPrice] = useState(priceBounds.max);
  const [activeFeatures, setActiveFeatures] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Слайдер двигает minPrice/maxPrice на каждый пиксель драга — сам список и его
  // layout-анимации пересчитываем только по debounced-значению, а не на каждый onChange.
  const minPriceDebounced = useDebouncedValue(minPrice);
  const maxPriceDebounced = useDebouncedValue(maxPrice);

  const toggleFeature = (feature) => {
    setActiveFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const filtered = useMemo(() => {
    return models.filter((m) => {
      if (activeSubtype && m.subtype !== activeSubtype) return false;
      const priceNum = priceToNumber(m.price);
      if (priceNum < minPriceDebounced || priceNum > maxPriceDebounced) return false;
      return activeFeatures.every((f) => m.features?.includes(f));
    });
  }, [models, activeSubtype, minPriceDebounced, maxPriceDebounced, activeFeatures]);

  const minPct = ((minPrice - priceBounds.min) / (priceBounds.max - priceBounds.min || 1)) * 100;
  const maxPct = ((maxPrice - priceBounds.min) / (priceBounds.max - priceBounds.min || 1)) * 100;

  return (
    <div className="cat-filter-layout">
      <button
        type="button"
        className="cat-filter-toggle"
        onClick={() => setFiltersOpen((v) => !v)}
        aria-expanded={filtersOpen}
      >
        <b>Фильтры</b>
        <i aria-hidden="true">{filtersOpen ? '−' : '+'}</i>
      </button>

      <aside className={`cat-filter${filtersOpen ? ' open' : ''}`}>
        <div className="cat-filter-block">
          <span className="cat-filter-kicker">Тип бытовки</span>
          <div className="cat-filter-types">
            {subtypes ? (
              <>
                <button
                  type="button"
                  className={`cat-filter-type${activeSubtype === null ? ' on' : ''}`}
                  onClick={() => setActiveSubtype(null)}
                >
                  <b>Все</b>
                </button>
                {subtypes.map((subtype) =>
                  subtype.href ? (
                    <Link key={subtype.slug} href={subtype.href} className="cat-filter-type">
                      <b>{subtype.title}</b>
                    </Link>
                  ) : (
                    <button
                      key={subtype.slug}
                      type="button"
                      className={`cat-filter-type${activeSubtype === subtype.slug ? ' on' : ''}`}
                      onClick={() => setActiveSubtype(subtype.slug)}
                    >
                      <b>{subtype.title}</b>
                    </button>
                  )
                )}
              </>
            ) : (
              sidebarTypes.map((type) => (
                <Link
                  key={type.slug}
                  href={`/catalog/${categorySlug}/${type.slug}`}
                  className={`cat-filter-type${type.slug === activeTypeSlug ? ' on' : ''}`}
                >
                  <b>{type.title}</b>
                </Link>
              ))
            )}
          </div>
        </div>

        <div className="cat-filter-block">
          <span className="cat-filter-kicker">Цена</span>
          <div className="cat-price-slider">
            <div className="cat-price-track">
              <div
                className="cat-price-fill"
                style={{ left: `${minPct}%`, right: `${100 - maxPct}%` }}
              />
            </div>
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={priceBounds.step}
              value={minPrice}
              onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - priceBounds.step))}
              aria-label="Минимальная цена"
            />
            <input
              type="range"
              min={priceBounds.min}
              max={priceBounds.max}
              step={priceBounds.step}
              value={maxPrice}
              onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + priceBounds.step))}
              aria-label="Максимальная цена"
            />
          </div>
          <div className="cat-price-inputs">
            <label>
              <span>От</span>
              <input
                type="number"
                value={minPrice}
                min={priceBounds.min}
                max={maxPrice}
                onChange={(e) =>
                  setMinPrice(Math.min(Math.max(Number(e.target.value), priceBounds.min), maxPrice))
                }
              />
            </label>
            <label>
              <span>До</span>
              <input
                type="number"
                value={maxPrice}
                min={minPrice}
                max={priceBounds.max}
                onChange={(e) =>
                  setMaxPrice(Math.max(Math.min(Number(e.target.value), priceBounds.max), minPrice))
                }
              />
            </label>
          </div>
        </div>

        {featurePool.length > 0 && (
          <div className="cat-filter-block">
            <span className="cat-filter-kicker">Особенности</span>
            <div className="cat-filter-features">
              {featurePool.map((feature) => {
                const checked = activeFeatures.includes(feature);
                return (
                  <label key={feature} className="cat-filter-check">
                    <span className="cat-filter-check-box">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFeature(feature)}
                      />
                      <AnimatePresence>
                        {checked && (
                          <motion.span
                            className="cat-filter-check-icon"
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                          >
                            <Check size={13} strokeWidth={2.4} />
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </span>
                    <span>{feature}</span>
                  </label>
                );
              })}
            </div>
          </div>
        )}
      </aside>

      {children(filtered)}
    </div>
  );
}
