'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import ModelConfigurator from './ModelConfigurator';
import ModelLeadForm from './ModelLeadForm';
import useScrollLock from '../../../../lib/useScrollLock';
import '../../../../components/Models/Models.css';
import '../../../../components/Gallery/Gallery.css';

const MATERIAL_IMAGE_SLUGS = new Set([
  'ПВХ', 'ДВП', 'ОСП', 'МДФ', 'Вагонка', 'Профлист', 'ЛДСП', 'ГВЛ', 'СМЛ', 'ВЛДСП', 'ВЛДСП + ПВХ', 'СП',
]);

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.2 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
};

function pluralizeRu(n, [one, few, many]) {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return one;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return few;
  return many;
}

function groupSpecsBySection(specs) {
  const groups = [];
  const bySection = new Map();
  for (const spec of specs) {
    const key = spec.section || null;
    let group = bySection.get(key);
    if (!group) {
      group = { section: key, items: [] };
      bySection.set(key, group);
      groups.push(group);
    }
    group.items.push(spec);
  }
  return groups;
}

export default function ModelView({ category, type, model, related, gallery = [] }) {
  const specGroups = groupSpecsBySection(model.specs);
  const hasSections = specGroups.some((g) => g.section);
  const shots = gallery.length > 0 ? gallery : model.image ? [model.image] : [];
  const [shotIndex, setShotIndex] = useState(0);
  const activeShot = shots[shotIndex] ?? null;
  const showShotNav = shots.length > 1;
  const goToShot = (i) => setShotIndex((i + shots.length) % shots.length);

  const [leadOpen, setLeadOpen] = useState(false);

  const [lightboxOpen, setLightboxOpen] = useState(false);
  const openLightbox = () => setLightboxOpen(true);
  const closeLightbox = useCallback(() => setLightboxOpen(false), []);
  const stepLightbox = useCallback((d) => setShotIndex((i) => (i + d + shots.length) % shots.length), [shots.length]);

  useScrollLock(lightboxOpen);

  useEffect(() => {
    if (!lightboxOpen) return;
    const onKey = (e) => {
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') stepLightbox(1);
      if (e.key === 'ArrowLeft') stepLightbox(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [lightboxOpen, closeLightbox, stepLightbox]);

  const onSliderKeyDown = (e) => {
    if (!showShotNav || lightboxOpen) return;
    if (e.key === 'ArrowLeft') { e.preventDefault(); goToShot(shotIndex - 1); }
    if (e.key === 'ArrowRight') { e.preventDefault(); goToShot(shotIndex + 1); }
  };
  const showConfigurator =
    !!model.configurator &&
    model.configurator.materials.every((m) => MATERIAL_IMAGE_SLUGS.has(m));
  const configurator = showConfigurator ? model.configurator : null;

  const [material, setMaterial] = useState(configurator ? configurator.materials[0] : null);
  const [size, setSize] = useState(configurator ? configurator.sizes[0] : null);
  const [openSpec, setOpenSpec] = useState(0);

  const activeVariant = useMemo(() => {
    if (!configurator) return null;
    return (
      configurator.variants.find((v) => v.material === material && v.size === size) ||
      configurator.variants.find((v) => v.material === material) ||
      configurator.variants.find((v) => v.size === size) ||
      configurator.variants[0]
    );
  }, [configurator, material, size]);

  const selectMaterial = (m) => {
    setMaterial(m);
    if (!configurator.variants.find((v) => v.material === m && v.size === size)) {
      const fallback = configurator.variants.find((v) => v.material === m);
      if (fallback) setSize(fallback.size);
    }
  };

  const selectSize = (s) => {
    setSize(s);
    if (!configurator.variants.find((v) => v.material === material && v.size === s)) {
      const fallback = configurator.variants.find((v) => v.size === s);
      if (fallback) setMaterial(fallback.material);
    }
  };

  const displayPrice = activeVariant ? activeVariant.price : model.price;

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
          <div className="cat-shots">
            <div
              className="cat-photo"
              tabIndex={showShotNav ? 0 : -1}
              onKeyDown={onSliderKeyDown}
              role={showShotNav ? 'group' : undefined}
              aria-label={showShotNav ? 'Слайдер фото модели' : undefined}
            >
              {activeShot ? (
                <>
                  <AnimatePresence mode="wait" initial={false}>
                    <motion.button
                      key={activeShot}
                      type="button"
                      className="cat-photo-frame"
                      onClick={openLightbox}
                      aria-label="Открыть фото в полном размере"
                      initial={{ opacity: 0, scale: 1.02 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.99 }}
                      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                    >
                      <Image
                        src={activeShot}
                        alt={model.title}
                        fill
                        sizes="(max-width: 900px) 100vw, 50vw"
                        className="cat-photo-img"
                        priority
                      />
                    </motion.button>
                  </AnimatePresence>

                  {showShotNav && (
                    <>
                      <button
                        type="button"
                        className="cat-photo-nav prev"
                        onClick={() => goToShot(shotIndex - 1)}
                        aria-label="Предыдущее фото"
                      >
                        <ChevronLeft size={20} strokeWidth={1.7} />
                      </button>
                      <button
                        type="button"
                        className="cat-photo-nav next"
                        onClick={() => goToShot(shotIndex + 1)}
                        aria-label="Следующее фото"
                      >
                        <ChevronRight size={20} strokeWidth={1.7} />
                      </button>
                    </>
                  )}
                </>
              ) : (
                <span className="cat-photo-wm mono">{model.slug}</span>
              )}
              <span className="cat-photo-tag">{type.title}</span>
            </div>

            {showShotNav && (
              <div className="cat-thumbs">
                {shots.map((src, i) => (
                  <button
                    key={src}
                    type="button"
                    className={`cat-thumb${i === shotIndex ? ' on' : ''}`}
                    onClick={() => setShotIndex(i)}
                    aria-label={`Фото ${i + 1}`}
                    aria-current={i === shotIndex}
                  >
                    <Image src={src} alt="" fill sizes="72px" />
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="cat-info">
            <span className="cat-kicker">{category.title}</span>
            <h1>{model.title}</h1>
            <p className="cat-lede">{type.description}</p>

            <div className="cat-price-row">
              <span className="cat-price">{displayPrice}</span>
            </div>

            {configurator ? (
              <ModelConfigurator
                configurator={configurator}
                material={material}
                size={size}
                onSelectMaterial={selectMaterial}
                onSelectSize={selectSize}
                sku={activeVariant?.sku}
              >
                <button type="button" className="cat-cta" aria-expanded={leadOpen} onClick={() => setLeadOpen((v) => !v)}>
                  <span>{leadOpen ? 'Свернуть' : 'Оставить заявку'}</span>
                  <i>↗</i>
                </button>
              </ModelConfigurator>
            ) : (
              <div className="cat-cta-wrap">
                <button type="button" className="cat-cta" aria-expanded={leadOpen} onClick={() => setLeadOpen((v) => !v)}>
                  <span>{leadOpen ? 'Свернуть' : 'Оставить заявку'}</span>
                  <i>↗</i>
                </button>
              </div>
            )}

            {leadOpen && (
              <ModelLeadForm
                modelTitle={model.title}
                modelSlug={model.slug}
                sku={activeVariant?.sku}
                price={displayPrice}
              />
            )}
          </div>
        </motion.div>

        <motion.section className="cat-specs" {...fadeUp}>
          <div className="cat-specs-head">
            <span className="cat-kicker">Характеристики</span>
            <h2>Что входит в комплектацию</h2>
          </div>
          {hasSections ? (
            <div className="cat-specs-accordion">
              {specGroups.map((group, gi) => {
                const isOpen = openSpec === gi;
                return (
                  <div key={group.section || gi} className={`cat-specs-item${isOpen ? ' open' : ''}`}>
                    <button
                      type="button"
                      className="cat-specs-item-head"
                      onClick={() => setOpenSpec(isOpen ? -1 : gi)}
                      aria-expanded={isOpen}
                    >
                      <span className="cat-specs-item-num">{String(gi + 1).padStart(2, '0')}</span>
                      <span className="cat-specs-item-title">{group.section || 'Характеристики'}</span>
                      <span className="cat-specs-item-count">
                        {group.items.length} {pluralizeRu(group.items.length, ['параметр', 'параметра', 'параметров'])}
                      </span>
                      <i className="cat-specs-item-chevron">+</i>
                    </button>
                    <AnimatePresence initial={false}>
                      {isOpen && (
                        <motion.div
                          className="cat-specs-item-body"
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        >
                          <dl>
                            {group.items.map((spec, i) => (
                              <div key={i}>
                                <dt>{spec.label}</dt>
                                <dd>{spec.value}</dd>
                              </div>
                            ))}
                          </dl>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          ) : (
            <dl className="cat-specs-flat">
              {model.specs.map((spec, i) => (
                <div key={i}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}
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
                  <div className="card-media" aria-hidden="true">
                    {m.image ? (
                      <Image
                        src={m.image}
                        alt={m.title}
                        fill
                        sizes="(max-width: 700px) 100vw, (max-width: 1180px) 50vw, 33vw"
                        className="card-media-img"
                      />
                    ) : (
                      <span className="card-media-wm mono">{m.slug}</span>
                    )}
                  </div>

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

      <AnimatePresence>
        {lightboxOpen && activeShot && (
          <motion.div
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={model.title}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={closeLightbox}
          >
            <motion.button
              type="button"
              className="lb-close"
              onClick={closeLightbox}
              aria-label="Закрыть"
              initial="rest"
              whileHover="hover"
              whileTap={{ scale: 0.9 }}
            >
              <motion.span
                variants={{ rest: { rotate: 0, scale: 1 }, hover: { rotate: 90, scale: 1.12 } }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                style={{ display: 'inline-flex' }}
              >
                <X size={20} strokeWidth={1.7} />
              </motion.span>
            </motion.button>

            {showShotNav && (
              <button type="button" className="lb-nav prev" aria-label="Предыдущее"
                onClick={(e) => { e.stopPropagation(); stepLightbox(-1); }}>
                <ChevronLeft size={20} strokeWidth={1.7} />
              </button>
            )}

            <motion.figure
              className="lb-frame"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.96, y: 16, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.97, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <Image key={activeShot} src={activeShot} alt={model.title} fill sizes="90vw" priority />
              {showShotNav && (
                <figcaption>
                  <span>
                    <b className="mono">{model.title}</b>
                  </span>
                  <span className="lb-count mono">
                    {String(shotIndex + 1).padStart(2, '0')} / {String(shots.length).padStart(2, '0')}
                  </span>
                </figcaption>
              )}
            </motion.figure>

            {showShotNav && (
              <button type="button" className="lb-nav next" aria-label="Следующее"
                onClick={(e) => { e.stopPropagation(); stepLightbox(1); }}>
                <ChevronRight size={20} strokeWidth={1.7} />
              </button>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
