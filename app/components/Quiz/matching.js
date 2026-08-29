import { catalog } from "../../data/catalog";

/* ---------- каталог: плоский список моделей ---------- */

function flattenCatalog() {
  const all = [];
  for (const category of catalog) {
    for (const type of category.types) {
      for (const model of type.models || []) {
        all.push({ categorySlug: category.slug, typeSlug: type.slug, model });
      }
    }
  }
  return all;
}

const ALL_MODELS = flattenCatalog();

/* ---------- разбор specs ---------- */

function priceToNumber(price) {
  return parseInt(String(price || "").replace(/\D/g, ""), 10) || 0;
}

function insulationMm(specs) {
  const text = (specs || [])
    .filter((s) => /теплоизоляц|утеплител/i.test(s.label || ""))
    .map((s) => s.value || "")
    .join(" ");
  if (/100\s*мм/i.test(text)) return 100;
  if (/50\s*мм/i.test(text)) return 50;
  return null;
}

function claddingType(specs) {
  const wall = (specs || []).find((s) => /наружная обшивка|стеновые элементы/i.test(s.label || ""));
  const text = wall ? wall.value || "" : "";
  if (/профилир/i.test(text)) return "проflist";
  if (/сэндвич/i.test(text)) return "сэндвич";
  return null;
}

function hasSanuzel(specs) {
  const santeh = (specs || []).find((s) => /сантехник/i.test(s.section || "") || /сантехник/i.test(s.label || ""));
  const text = santeh ? santeh.value || "" : "";
  return /туалет|унитаз|душ|раковин/i.test(text);
}

/* ---------- назначение → пул ---------- */

function poolByPurpose(purpose) {
  switch (purpose) {
    case "Стройка и рабочие":
      return ALL_MODELS.filter(
        (m) => (m.categorySlug === "bytovki" || m.categorySlug === "blok-konteinery") && m.model.subtype === "stroitelnaya"
      );
    case "Охрана или КПП":
      return ALL_MODELS.filter((m) => m.categorySlug === "blok-konteinery" && m.model.subtype === "post_ohrany");
    case "Дача, хозблок":
      return ALL_MODELS.filter(
        (m) => m.categorySlug === "bytovki" && (m.model.subtype === "stroitelnaya" || m.model.subtype === "santehnicheskaya")
      );
    case "Офис, прорабская":
      return ALL_MODELS.filter((m) => m.categorySlug === "blok-konteinery" && m.model.subtype === "stroitelnaya");
    case "Проживание, общежитие":
      return ALL_MODELS.filter((m) => m.categorySlug === "modulnye-zdaniya");
    case "Передвижной пункт":
      return sledChassisPool();
    default:
      return ALL_MODELS.slice();
  }
}

/* труднодоступность: жёсткий фильтр до моделей на санях/шасси, игнорируя назначение.
   в данных нет отдельного subtype для этого — определяем по названию модели. */
function sledChassisPool() {
  return ALL_MODELS.filter((m) => /на сан[яи]х|на шасси/i.test(m.model.title || ""));
}

function sledOnlyPool() {
  return ALL_MODELS.filter((m) => /на сан[яи]х/i.test(m.model.title || ""));
}

function chassisOnlyPool() {
  return ALL_MODELS.filter((m) => /на шасси/i.test(m.model.title || ""));
}

/* ---------- бюджет: мягкий штраф ---------- */

const BUDGET_RANGES = {
  "До 200 000 ₽": [0, 200000],
  "200 000 – 500 000 ₽": [200000, 500000],
  "500 000 – 1 500 000 ₽": [500000, 1500000],
  "От 1 500 000 ₽": [1500000, Infinity],
};

function budgetPenalty(price, budgetAnswer) {
  const range = BUDGET_RANGES[budgetAnswer];
  if (!range) return 0; // "Пока не знаю..." — не фильтрует
  const [lo, hi] = range;
  if (price >= lo && price <= hi) return 0;
  const edge = price < lo ? lo : hi;
  const diff = Math.abs(price - edge);
  const base = edge === Infinity ? lo : edge || 1;
  const ratio = diff / base;
  if (ratio <= 0.2) return -1; // до 20% сверх/ниже диапазона — лёгкий штраф
  if (ratio <= 0.6) return -3;
  return -6; // в разы вне диапазона
}

/* ---------- скоринг ---------- */

function scoreModel(entry, answers) {
  const { model } = entry;
  const specs = model.specs;
  let score = 0;
  const price = priceToNumber(model.price);

  score += budgetPenalty(price, answers.budget);

  if (answers.priority === "Тепло зимой") {
    const mm = insulationMm(specs);
    if (mm === 100) score += 2;
    else if (mm === 50) score += 0;
  }

  if (answers.priority === "Чтобы не вскрыли") {
    if (claddingType(specs) === "проflist") score += 2;
  }
  // "Приличный внешний вид" — исключено из скоринга по решению заказчика, баллов не даёт.

  if (Array.isArray(answers.interior) && answers.interior.includes("Туалет, душ, кухня")) {
    if (hasSanuzel(specs)) score += 2;
  }

  return score;
}

/* ---------- какие именно ответы совпали — для карточки результата ---------- */

function matchedTags(entry, answers, sizeWasRefined) {
  const { model } = entry;
  const specs = model.specs;
  const price = priceToNumber(model.price);
  const tags = [];

  if (answers.purpose) tags.push(`Под задачу «${answers.purpose.toLowerCase()}»`);
  if (sizeWasRefined) tags.push("Размер под вашу вместимость");
  if (budgetPenalty(price, answers.budget) === 0 && BUDGET_RANGES[answers.budget]) tags.push("Точно в вашем бюджете");

  if (answers.priority === "Тепло зимой" && insulationMm(specs) === 100) {
    tags.push("Утепление 100 мм — держит тепло");
  }
  if (answers.priority === "Чтобы не вскрыли" && claddingType(specs) === "проflist") {
    tags.push("Антивандальная обшивка");
  }
  if (Array.isArray(answers.interior) && answers.interior.includes("Туалет, душ, кухня") && hasSanuzel(specs)) {
    tags.push("Есть санузел и кухня");
  }

  return tags.slice(0, 3);
}

/* ---------- post-selection: подбор размера по configurator.variants ---------- */

const CAPACITY_PERCENTILE = {
  "1–2 человека, на сезон": 0,
  "3–4 человека, на год": 0.33,
  "5–10 человек, надолго": 0.66,
  "10+ человек, здание": 1,
  "Под склад и оборудование": 1,
};

function parseSize(size) {
  const m = /^(\d+(?:\.\d+)?)x(\d+(?:\.\d+)?)$/.exec(String(size || "").trim());
  if (!m) return null;
  return { w: parseFloat(m[1]), d: parseFloat(m[2]), area: parseFloat(m[1]) * parseFloat(m[2]) };
}

function refineSizeVariant(model, capacityAnswer) {
  const variants = model.configurator && Array.isArray(model.configurator.variants) ? model.configurator.variants : [];
  const sizes = [...new Set(variants.map((v) => v.size))].filter(Boolean);
  if (sizes.length < 2) return null; // нет реального разброса — оставляем базовую карточку

  const parsed = sizes.map((s) => ({ size: s, ...parseSize(s) })).filter((s) => s.area != null);
  parsed.sort((a, b) => a.area - b.area);

  const percentile = CAPACITY_PERCENTILE[capacityAnswer] ?? 0.33;
  const idx = Math.round(percentile * (parsed.length - 1));
  const targetSize = parsed[idx].size;

  const atSize = variants.filter((v) => v.size === targetSize);
  atSize.sort((a, b) => priceToNumber(a.price) - priceToNumber(b.price));
  const cheapest = atSize[0];
  if (!cheapest) return null;

  return {
    size: targetSize.replace("x", " × ") + " м",
    price: cheapest.price,
  };
}

/* ---------- докупите Х ---------- */

function upsellCaption(model, answers) {
  if (Array.isArray(answers.interior) && answers.interior.includes("Туалет, душ, кухня") && !hasSanuzel(model.specs)) {
    return "В этой модели нет сантехники «под ключ» — можно докупить: водопровод, бойлер, умывальник, унитаз, душевая.";
  }
  return null;
}

/* ---------- основная функция ---------- */

export function getRecommendations(answers) {
  let pool;
  let relaxedAccessibility = false;

  if (answers.accessibility === "Да, нужна доставка на санях") {
    pool = sledOnlyPool();
  } else if (answers.accessibility === "Да, нужна доставка на шасси/колёсах") {
    pool = chassisOnlyPool();
  } else {
    pool = poolByPurpose(answers.purpose);
  }

  if (pool.length === 0) {
    // fallback: ослабляем наименее жёсткий фильтр — труднодоступность
    pool = poolByPurpose(answers.purpose);
    relaxedAccessibility = true;
  }

  const poolSize = pool.length;

  const scored = pool.map((entry) => ({ entry, score: scoreModel(entry, answers), price: priceToNumber(entry.model.price) }));

  scored.sort((a, b) => {
    if (b.score !== a.score) return b.score - a.score;
    return a.price - b.price; // тай-брейк: дешевле — выше
  });

  const top = scored.slice(0, 3).map(({ entry }) => {
    const { categorySlug, typeSlug, model } = entry;
    const refined = refineSizeVariant(model, answers.capacity);
    return {
      href: `/catalog/${categorySlug}/${typeSlug}/${model.slug}`,
      model,
      size: refined ? refined.size : model.size,
      price: refined ? refined.price : model.price,
      caption: upsellCaption(model, answers),
      tags: matchedTags(entry, answers, Boolean(refined)),
    };
  });

  return {
    results: top,
    poolSize,
    relaxedAccessibility,
  };
}
