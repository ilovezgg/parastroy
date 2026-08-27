'use client';
import { useMemo, useState } from 'react';
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

function floorsLabel(n) {
  if (n === 1) return '1 этаж';
  if (n >= 2 && n <= 4) return `${n} этажа`;
  return `${n} этажей`;
}

/**
 * Числовой ряд-слайдер (мин/макс) — общий для цены, длины, ширины, площади.
 * Визуально идентичен .cat-price-slider из CatalogFilter.jsx.
 */
function RangeField({ label, unit, bounds, value, onChange }) {
  const { min, max, step } = bounds;
  const [lo, hi] = value;
  const span = max - min || 1;
  const loPct = ((lo - min) / span) * 100;
  const hiPct = ((hi - min) / span) * 100;

  return (
    <div className="cat-filter-block">
      <span className="cat-filter-kicker">{label}</span>
      <div className="cat-price-slider">
        <div className="cat-price-track">
          <div className="cat-price-fill" style={{ left: `${loPct}%`, right: `${100 - hiPct}%` }} />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={lo}
          onChange={(e) => onChange([Math.min(Number(e.target.value), hi - step), hi])}
          aria-label={`Минимум: ${label}`}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={hi}
          onChange={(e) => onChange([lo, Math.max(Number(e.target.value), lo + step)])}
          aria-label={`Максимум: ${label}`}
        />
      </div>
      <div className="cat-price-inputs">
        <label>
          <span>От</span>
          <input
            type="number"
            value={lo}
            min={min}
            max={hi}
            onChange={(e) => onChange([Math.min(Math.max(Number(e.target.value), min), hi), hi])}
          />
        </label>
        <label>
          <span>До{unit ? `, ${unit}` : ''}</span>
          <input
            type="number"
            value={hi}
            min={lo}
            max={max}
            onChange={(e) => onChange([lo, Math.max(Math.min(Number(e.target.value), max), lo)])}
          />
        </label>
      </div>
    </div>
  );
}

/**
 * Боковой фильтр для «Модульных зданий»: без переключателя типов —
 * пять групп числовых фильтров (Цена / Этажность / Длина / Ширина / Площадь).
 */
export default function NumericCatalogFilter({ models, children }) {
  const priceBounds = useMemo(() => {
    const values = models.map((m) => priceToNumber(m.price));
    const step = 5000;
    return { min: roundDown(Math.min(...values), step), max: roundUp(Math.max(...values), step), step };
  }, [models]);

  const lengthBounds = useMemo(() => {
    const values = models.map((m) => m.length);
    const step = 0.5;
    return { min: roundDown(Math.min(...values), step), max: roundUp(Math.max(...values), step), step };
  }, [models]);

  const widthBounds = useMemo(() => {
    const values = models.map((m) => m.width);
    const step = 0.5;
    return { min: roundDown(Math.min(...values), step), max: roundUp(Math.max(...values), step), step };
  }, [models]);

  const areaBounds = useMemo(() => {
    const values = models.map((m) => m.area);
    const step = 5;
    return { min: roundDown(Math.min(...values), step), max: roundUp(Math.max(...values), step), step };
  }, [models]);

  const floorsOptions = useMemo(() => {
    return Array.from(new Set(models.map((m) => m.floors))).sort((a, b) => a - b);
  }, [models]);

  const [priceRange, setPriceRange] = useState([priceBounds.min, priceBounds.max]);
  const [lengthRange, setLengthRange] = useState([lengthBounds.min, lengthBounds.max]);
  const [widthRange, setWidthRange] = useState([widthBounds.min, widthBounds.max]);
  const [areaRange, setAreaRange] = useState([areaBounds.min, areaBounds.max]);
  const [activeFloors, setActiveFloors] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // До пяти двойных слайдеров одновременно — каждый двигает своё состояние на каждый
  // пиксель драга. Список (и его layout-анимации) пересчитываем по debounced-значениям,
  // иначе перетаскивание одного ползунка на слабом устройстве дёргает всю сетку карточек.
  const priceRangeDebounced = useDebouncedValue(priceRange);
  const lengthRangeDebounced = useDebouncedValue(lengthRange);
  const widthRangeDebounced = useDebouncedValue(widthRange);
  const areaRangeDebounced = useDebouncedValue(areaRange);

  const toggleFloor = (floor) => {
    setActiveFloors((prev) =>
      prev.includes(floor) ? prev.filter((f) => f !== floor) : [...prev, floor]
    );
  };

  const filtered = useMemo(() => {
    return models.filter((m) => {
      const priceNum = priceToNumber(m.price);
      if (priceNum < priceRangeDebounced[0] || priceNum > priceRangeDebounced[1]) return false;
      if (activeFloors.length > 0 && !activeFloors.includes(m.floors)) return false;
      if (m.length < lengthRangeDebounced[0] || m.length > lengthRangeDebounced[1]) return false;
      if (m.width < widthRangeDebounced[0] || m.width > widthRangeDebounced[1]) return false;
      if (m.area < areaRangeDebounced[0] || m.area > areaRangeDebounced[1]) return false;
      return true;
    });
  }, [models, priceRangeDebounced, activeFloors, lengthRangeDebounced, widthRangeDebounced, areaRangeDebounced]);

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
        <RangeField label="Цена" bounds={priceBounds} value={priceRange} onChange={setPriceRange} />

        <div className="cat-filter-block">
          <span className="cat-filter-kicker">Этажность</span>
          <div className="cat-filter-features">
            {floorsOptions.map((floor) => (
              <label key={floor} className="cat-filter-check">
                <input
                  type="checkbox"
                  checked={activeFloors.includes(floor)}
                  onChange={() => toggleFloor(floor)}
                />
                <span>{floorsLabel(floor)}</span>
              </label>
            ))}
          </div>
        </div>

        <RangeField label="Длина" unit="м" bounds={lengthBounds} value={lengthRange} onChange={setLengthRange} />
        <RangeField label="Ширина" unit="м" bounds={widthBounds} value={widthRange} onChange={setWidthRange} />
        <RangeField label="Площадь" unit="м²" bounds={areaBounds} value={areaRange} onChange={setAreaRange} />
      </aside>

      {children(filtered)}
    </div>
  );
}
