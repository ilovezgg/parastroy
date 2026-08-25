import { articles } from '@/app/data/articles';
import { SITE_URL, pageOpenGraph } from '@/app/lib/seo';
import { breadcrumbJsonLd } from '@/app/lib/jsonld';
import './blog.css';
import BlogListView from './BlogListView';

export const metadata = {
  title: 'Блог — статьи о бытовках и блок-контейнерах',
  description: 'Полезные статьи о выборе, доставке и установке бытовок и блок-контейнеров.',
  alternates: { canonical: `${SITE_URL}/blog` },
  openGraph: pageOpenGraph('/blog'),
};

export default function BlogPage() {
  const jsonLd = breadcrumbJsonLd([
    { name: 'Главная', path: '/' },
    { name: 'Блог', path: '/blog' },
  ]);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <BlogListView articles={articles} />
    </>
  );
}
