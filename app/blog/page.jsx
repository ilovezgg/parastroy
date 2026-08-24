import { articles } from '@/app/data/articles';
import './blog.css';
import BlogListView from './BlogListView';

export const metadata = {
  title: 'Блог — статьи о бытовках и блок-контейнерах',
  description: 'Полезные статьи о выборе, доставке и установке бытовок и блок-контейнеров.',
};

export default function BlogPage() {
  return <BlogListView articles={articles} />;
}
