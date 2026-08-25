import { catalog } from './data/catalog';
import { articles } from './data/articles';
import { SITE_URL } from './lib/seo';

export default function sitemap() {
  const now = new Date();

  const staticRoutes = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.8 },
  ];

  const catalogRoutes = catalog.flatMap((category) => [
    { url: `${SITE_URL}/catalog/${category.slug}`, changeFrequency: 'weekly', priority: 0.7 },
    ...category.types.flatMap((type) => [
      { url: `${SITE_URL}/catalog/${category.slug}/${type.slug}`, changeFrequency: 'weekly', priority: 0.6 },
      ...type.models.map((model) => ({
        url: `${SITE_URL}/catalog/${category.slug}/${type.slug}/${model.slug}`,
        changeFrequency: 'weekly',
        priority: 0.5,
      })),
    ]),
  ]);

  const articleRoutes = articles.map((article) => ({
    url: `${SITE_URL}/blog/${article.slug}`,
    lastModified: article.datePublished ? new Date(article.datePublished) : now,
    changeFrequency: 'monthly',
    priority: 0.5,
  }));

  return [...staticRoutes, ...catalogRoutes, ...articleRoutes];
}
