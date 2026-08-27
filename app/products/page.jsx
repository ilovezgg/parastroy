import { catalog } from '@/app/data/catalog';
import { breadcrumbJsonLd } from '@/app/lib/jsonld';
import { SITE_URL, pageOpenGraph } from '@/app/lib/seo';
import '../catalog/catalog.css';
import './products.css';
import ProductsView from './ProductsView';

export const metadata = {
  title: 'Продукция — бытовки, блок-контейнеры, модульные здания',
  description:
    'Каталог продукции завода ПАРА | МОДУЛЬ: бытовки, блок-контейнеры и модульные здания. Выберите категорию или посмотрите самые доступные модели.',
  alternates: { canonical: `${SITE_URL}/products` },
  openGraph: pageOpenGraph('/products'),
};

export default function ProductsPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: 'Главная', path: '/' },
    { name: 'Продукция', path: '/products' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ProductsView categories={catalog} />
    </>
  );
}
