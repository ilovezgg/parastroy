import { SITE_URL, SITE_NAME, ORG } from './seo';

export function organizationJsonLd() {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    legalName: ORG.legalName,
    url: SITE_URL,
    logo: `${SITE_URL}/para_modul_logo.png`,
    telephone: ORG.phoneHref,
    email: ORG.email,
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Пестово',
      addressRegion: 'Новгородская область',
      addressCountry: 'RU',
    },
  };
}

// items: [{ name, path }] — path относительный ("/", "/catalog/bytovki", ...)
export function breadcrumbJsonLd(items) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export function productJsonLd({ model, type, category, path }) {
  const price = model.price.replace(/[^\d]/g, '');
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: model.title,
    description: `${model.title}: ${model.price}, ${model.size}`,
    sku: model.slug,
    category: type.title,
    brand: { '@type': 'Brand', name: SITE_NAME },
    offers: {
      '@type': 'Offer',
      url: `${SITE_URL}${path}`,
      priceCurrency: 'RUB',
      price,
      availability: 'https://schema.org/InStock',
      itemCondition: 'https://schema.org/NewCondition',
    },
  };
}

// faqs: [{ q, a }]
export function faqJsonLd(faqs) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };
}
