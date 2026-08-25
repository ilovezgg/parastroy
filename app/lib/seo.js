// Единая точка правды для домена и реквизитов, используемых в metadata, sitemap, robots и JSON-LD.
// Домен пока временный (parastroy.vercel.app) — при смене на постоянный меняется только здесь через NEXT_PUBLIC_SITE_URL.
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'https://parastroy.vercel.app').replace(/\/$/, '');

export const SITE_NAME = 'ПАРА | МОДУЛЬ';

export const ORG = {
  legalName: 'ООО «ПАРА МОДУЛЬ»',
  phone: '+7 921 199 23 03',
  phoneHref: '+79211992303',
  email: 'antonpara90@gmail.com',
  address: 'г. Пестово, Новгородская обл.', // TODO: реальный адрес производства
};

// openGraph is replaced (not merged) by Next.js whenever a page sets its own
// openGraph object, so siteName/locale/type must be repeated per page here.
export function pageOpenGraph(path) {
  return {
    url: path.startsWith('http') ? path : `${SITE_URL}${path}`,
    siteName: SITE_NAME,
    locale: 'ru_RU',
    type: 'website',
  };
}
