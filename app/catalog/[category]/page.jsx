import { notFound } from 'next/navigation';
import { catalog } from '@/app/data/catalog';
import { breadcrumbJsonLd } from '@/app/lib/jsonld';
import { pageOpenGraph } from '@/app/lib/seo';
import '../catalog.css';
import CategoryView from './CategoryView';

export function generateStaticParams() {
  return catalog.map((category) => ({ category: category.slug }));
}

function getCategory(slug) {
  return catalog.find((c) => c.slug === slug);
}

export async function generateMetadata({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    openGraph: pageOpenGraph(`/catalog/${category.slug}`),
  };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  const jsonLd = breadcrumbJsonLd([
    { name: 'Главная', path: '/' },
    { name: category.title, path: `/catalog/${category.slug}` },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CategoryView category={category} />
    </>
  );
}
