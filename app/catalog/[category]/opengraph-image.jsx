import { catalog } from '@/app/data/catalog';
import { renderOgImage, ogSize, ogContentType } from '@/app/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

function getCategory(slug) {
  return catalog.find((c) => c.slug === slug);
}

export default async function Image({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);

  return renderOgImage({
    eyebrow: 'Каталог',
    title: category?.title || 'Каталог',
    subtitle: category?.description,
  });
}
