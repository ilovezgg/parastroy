import { notFound } from 'next/navigation';
import { catalog } from '@/app/data/catalog';
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
  };
}

export default async function CategoryPage({ params }) {
  const { category: categorySlug } = await params;
  const category = getCategory(categorySlug);
  if (!category) notFound();

  return <CategoryView category={category} />;
}
