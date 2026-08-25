import { articles } from '@/app/data/articles';
import { renderOgImage, ogSize, ogContentType } from '@/app/lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const dynamic = 'force-static';

function getArticle(slug) {
  return articles.find((a) => a.slug === slug);
}

export default async function Image({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);

  return renderOgImage({
    eyebrow: 'Блог',
    title: article?.title || 'Статья',
    subtitle: article?.metaDescription,
  });
}
