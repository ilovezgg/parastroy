import { notFound } from 'next/navigation';
import { catalog } from '@/app/data/catalog';
import '../../catalog.css';
import TypeView from './TypeView';

export function generateStaticParams() {
  return catalog.flatMap((category) =>
    category.types.map((type) => ({
      category: category.slug,
      type: type.slug,
    }))
  );
}

function getCategory(slug) {
  return catalog.find((c) => c.slug === slug);
}

function getType(category, slug) {
  return category?.types.find((t) => t.slug === slug);
}

export async function generateMetadata({ params }) {
  const { category: categorySlug, type: typeSlug } = await params;
  const category = getCategory(categorySlug);
  const type = getType(category, typeSlug);
  if (!category || !type) return {};
  return {
    title: type.title,
    description: type.description,
  };
}

export default async function TypePage({ params }) {
  const { category: categorySlug, type: typeSlug } = await params;
  const category = getCategory(categorySlug);
  const type = getType(category, typeSlug);
  if (!category || !type) notFound();

  return <TypeView category={category} type={type} />;
}
