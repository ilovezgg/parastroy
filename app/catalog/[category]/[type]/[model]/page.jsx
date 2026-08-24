import { notFound } from 'next/navigation';
import { catalog } from '@/app/data/catalog';
import '../../../catalog.css';
import ModelView from './ModelView';

export function generateStaticParams() {
  return catalog.flatMap((category) =>
    category.types.flatMap((type) =>
      type.models.map((model) => ({
        category: category.slug,
        type: type.slug,
        model: model.slug,
      }))
    )
  );
}

function getCategory(slug) {
  return catalog.find((c) => c.slug === slug);
}

function getType(category, slug) {
  return category?.types.find((t) => t.slug === slug);
}

function getModel(type, slug) {
  return type?.models.find((m) => m.slug === slug);
}

export async function generateMetadata({ params }) {
  const { category: categorySlug, type: typeSlug, model: modelSlug } = await params;
  const category = getCategory(categorySlug);
  const type = getType(category, typeSlug);
  const model = getModel(type, modelSlug);
  if (!category || !type || !model) return {};
  return {
    title: model.title,
    description: `${model.title}: ${model.price}, ${model.size}`,
  };
}

export default async function ModelPage({ params }) {
  const { category: categorySlug, type: typeSlug, model: modelSlug } = await params;
  const category = getCategory(categorySlug);
  const type = getType(category, typeSlug);
  const model = getModel(type, modelSlug);
  if (!category || !type || !model) notFound();

  const related = type.models.filter((m) => m.slug !== model.slug).slice(0, 3);

  return (
    <ModelView category={category} type={type} model={model} related={related} />
  );
}
