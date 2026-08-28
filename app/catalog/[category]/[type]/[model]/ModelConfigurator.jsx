'use client';
import Image from 'next/image';

const MATERIAL_IMAGES = {
  'ПВХ': 'pvh',
  'ДВП': 'dvp',
  'ОСП': 'osp',
  'МДФ': 'mdf',
  'Вагонка': 'vagonka',
  'Профлист': 'proflist',
  'ЛДСП': 'ldsp',
  'ГВЛ': 'gvl',
  'СМЛ': 'sml',
  'ВЛДСП': 'vldsp',
  'ВЛДСП + ПВХ': 'vldsp-pvh',
  'СП': 'sp-sendvich',
};

export default function ModelConfigurator({ configurator, material, size, onSelectMaterial, onSelectSize, sku, children }) {
  const { materials, sizes } = configurator;

  return (
    <div className="cat-configurator">
      <div className="cat-configurator-head">
        <span className="cat-kicker">Конфигуратор</span>
        <h3>Материал отделки и размер</h3>
      </div>

      <div className="cat-configurator-materials">
        {materials.map((m) => (
          <button
            key={m}
            type="button"
            className={`cat-configurator-swatch${m === material ? ' on' : ''}`}
            onClick={() => onSelectMaterial(m)}
            title={m}
          >
            <span className="cat-configurator-swatch-img">
              <Image
                src={`/images/materials/${MATERIAL_IMAGES[m]}.webp`}
                alt={m}
                fill
                sizes="64px"
              />
            </span>
            <em>{m}</em>
          </button>
        ))}
      </div>

      <div className="cat-configurator-sizes">
        {sizes.map((s) => (
          <button
            key={s}
            type="button"
            className={`cat-configurator-size mono${s === size ? ' on' : ''}`}
            onClick={() => onSelectSize(s)}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="cat-configurator-summary">
        <span className="cat-configurator-summary-line">
          Выбрано: <b>{material}</b>, размер <b>{size}</b> м
        </span>
        {sku && <span className="cat-configurator-sku mono">Артикул: {sku}</span>}
      </div>

      {children}
    </div>
  );
}
