import { notFound } from 'next/navigation';
import { articles } from '@/app/data/articles';
import { catalog } from '@/app/data/catalog';
import '../blog.css';
import '../../components/Contacts/Contacts.css';
import ArticleView from './ArticleView';

const SITE_URL = 'https://parastroy.example';

export function generateStaticParams() {
  return articles.map((article) => ({ slug: article.slug }));
}

function getArticle(slug) {
  return articles.find((a) => a.slug === slug);
}

function resolveRelatedProducts(links) {
  return links
    .map((href) => {
      const [, , categorySlug, typeSlug] = href.split('/');
      const category = catalog.find((c) => c.slug === categorySlug);
      const type = category?.types.find((t) => t.slug === typeSlug);
      if (!category || !type) return null;
      return { href, title: type.title, description: type.description };
    })
    .filter(Boolean);
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) return {};
  return {
    title: article.title,
    description: article.metaDescription,
    keywords: article.keywords,
    alternates: {
      canonical: `${SITE_URL}/blog/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }) {
  const { slug } = await params;
  const article = getArticle(slug);
  if (!article) notFound();

  const relatedProducts = resolveRelatedProducts(article.relatedProducts);
  const firstCategorySlug = article.relatedProducts[0]?.split('/')[2];
  const tag = catalog.find((c) => c.slug === firstCategorySlug)?.title || 'Статья';

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.datePublished,
    author: { '@type': 'Organization', name: 'ПАРА | МОДУЛЬ' },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ArticleView article={article} relatedProducts={relatedProducts} tag={tag} />
    </>
  );
}
