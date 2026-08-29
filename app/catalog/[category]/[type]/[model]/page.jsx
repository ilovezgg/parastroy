import fs from 'fs';
import path from 'path';
import { notFound } from 'next/navigation';
import { catalog } from '@/app/data/catalog';
import { breadcrumbJsonLd, productJsonLd } from '@/app/lib/jsonld';
import { pageOpenGraph } from '@/app/lib/seo';
import '../../../catalog.css';
import ModelView from './ModelView';

const IMAGES_DIR = path.join(process.cwd(), 'public', 'images', 'catalog');
let imageFilesCache = null;

function getImageFiles() {
  if (!imageFilesCache) {
    try {
      imageFilesCache = new Set(fs.readdirSync(IMAGES_DIR));
    } catch {
      imageFilesCache = new Set();
    }
  }
  return imageFilesCache;
}

function getGallery(image) {
  if (!image) return [];
  const dir = image.slice(0, image.lastIndexOf('/') + 1);
  const base = image.slice(image.lastIndexOf('/') + 1);
  const dot = base.lastIndexOf('.');
  const stem = base.slice(0, dot);
  const ext = base.slice(dot);
  const files = getImageFiles();
  if (!files.has(base)) return [];

  const gallery = [image];
  let i = 2;
  while (files.has(`${stem}-${i}${ext}`)) {
    gallery.push(`${dir}${stem}-${i}${ext}`);
    i++;
  }
  return gallery;
}

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
    openGraph: pageOpenGraph(`/catalog/${category.slug}/${type.slug}/${model.slug}`),
  };
}

export default async function ModelPage({ params }) {
  const { category: categorySlug, type: typeSlug, model: modelSlug } = await params;
  const category = getCategory(categorySlug);
  const type = getType(category, typeSlug);
  const model = getModel(type, modelSlug);
  if (!category || !type || !model) notFound();

  const related = type.models.filter((m) => m.slug !== model.slug).slice(0, 3);
  const gallery = getGallery(model.image);

  const path = `/catalog/${category.slug}/${type.slug}/${model.slug}`;
  const jsonLd = [
    breadcrumbJsonLd([
      { name: 'Главная', path: '/' },
      { name: category.title, path: `/catalog/${category.slug}` },
      { name: type.title, path: `/catalog/${category.slug}/${type.slug}` },
      { name: model.title, path },
    ]),
    productJsonLd({ model, type, category, path }),
  ];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <ModelView category={category} type={type} model={model} related={related} gallery={gallery} />
    </>
  );
}
