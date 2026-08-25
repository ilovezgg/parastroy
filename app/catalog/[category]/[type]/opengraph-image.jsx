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

export default async function Image({ params }) {
  const { category: categorySlug, type: typeSlug } = await params;
  const category = getCategory(categorySlug);
  const type = getType(category, typeSlug);

  return renderOgImage({
    eyebrow: category?.title || 'Каталог',
    title: type?.title || 'Каталог',
    subtitle: type?.description,
  });
}
