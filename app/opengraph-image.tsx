import { renderOgImage, ogSize, ogContentType } from './lib/og';

export const size = ogSize;
export const contentType = ogContentType;
export const alt = 'ПАРА | МОДУЛЬ — бытовки и блок-контейнеры от завода';

export default async function Image() {
  return renderOgImage({
    eyebrow: 'Завод бытовок',
    title: 'Бытовки и блок-контейнеры от производителя',
    subtitle: 'Без посредников · доставка по всей России',
  });
}
