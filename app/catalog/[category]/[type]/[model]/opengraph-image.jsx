import { catalog } from '@/app/data/catalog';
import { renderOgImage, ogSize, ogContentType } from '@/app/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

function getCategory(slug) {
  return catalog.find((c) => c.slug === slug);
}

function getType(category, slug) {
  return category?.types.find((t) => t.slug === slug);
}

function getModel(type, slug) {
  return type?.models.find((m) => m.slug === slug);
}

export default async function Image({ params }) {
  const { category: categorySlug, type: typeSlug, model: modelSlug } = await params;
  const category = getCategory(categorySlug);
  const type = getType(category, typeSlug);
  const model = getModel(type, modelSlug);

  return renderOgImage({
    eyebrow: type?.title || category?.title || 'Каталог',
    title: model?.title || 'Модель',
    subtitle: model ? `${model.price} · ${model.size}` : undefined,
  });
}
