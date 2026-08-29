'use client';
import { useMemo } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import CatalogFilter from '../../CatalogFilter';
import NumericCatalogFilter from '../../NumericCatalogFilter';
import ModelCard from '../../../components/ModelCard/ModelCard';

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

export default function TypeView({ category, type }) {
  const models = useMemo(() => {
    if (!type.mergeSubtype) {
      return type.models.map((m) => ({ ...m, originTypeSlug: type.slug }));
    }
    const merged = [];
    category.types.forEach((t) => {
      (t.models || []).forEach((m) => {
        if (m.subtype === type.mergeSubtype) {
          merged.push({ ...m, subtype: t.slug, originTypeSlug: t.slug });
        }
      });
    });
    return merged;
  }, [category, type]);

  const renderGrid = (filtered) => (
    <div className="cat-grid">
      <AnimatePresence mode="popLayout">
        {filtered.map((model) => (
          <motion.div
            key={model.slug}
            layout
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          >
            <ModelCard
              href={`/catalog/${category.slug}/${model.originTypeSlug}/${model.slug}`}
              model={model}
            />
          </motion.div>
        ))}
      </AnimatePresence>
      {filtered.length === 0 && (
        <p className="cat-filter-empty">По этим параметрам ничего не найдено.</p>
      )}
    </div>
  );

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

        {type.filterMode === 'numeric' ? (
          <NumericCatalogFilter models={models}>{renderGrid}</NumericCatalogFilter>
        ) : (
          <CatalogFilter
            categorySlug={category.slug}
            types={category.types}
            sidebarLinks={type.sidebarLinks}
            subtypes={type.subtypes}
            activeTypeSlug={type.slug}
            models={models}
          >
            {renderGrid}
          </CatalogFilter>
        )}
      </div>
    </main>
  );
}
