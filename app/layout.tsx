import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Бытовка Б 01 6×2.4м — металлическая с отделкой от производителя | СЕВЕРМОДУЛЬ",
    template: "%s | СЕВЕРМОДУЛЬ",
  },
  description: "Металлическая бытовка Б 01 6×2.4м, высота 2.5м, утепление минвата 50мм, профлист С8 0.45мм RAL 7024. Собственное производство в г. Пестово. Цена от 141 000 ₽, доставка по России от 105 ₽/км за 1-2 дня. Гарантия 24 мес.",
  keywords: ["бытовка Б 01", "бытовка строительная металлическая", "блок контейнер 6х2.4", "бытовка с отделкой", "купить бытовку Пестово", "бытовка RAL 7024"],
  authors: [{ name: "СЕВЕРМОДУЛЬ" }],
  creator: "СЕВЕРМОДУЛЬ",
  publisher: "СЕВЕРМОДУЛЬ",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://severmodul.example.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "ru_RU",
    url: "https://severmodul.example.com",
    title: "Бытовка Б 01 6×2.4м — металлическая с отделкой",
    description: "Собственное производство в Пестово. Утеплитель 50мм, ДСП 16мм, доставка по России от 105 ₽/км.",
    siteName: "СЕВЕРМОДУЛЬ",
    images: [{ url: "/images/construction_cabin_sideview.webp", width: 1200, height: 630, alt: "Бытовка Б 01" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Бытовка Б 01 6×2.4м — от 141 000 ₽",
    description: "Металлическая бытовка с отделкой, доставка по России",
    images: ["/images/construction_cabin_sideview.webp"],
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large" } },
  verification: { yandex: "yandex-verification-code" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: "Бытовка строительная металлическая Б 01 6×2.4м",
    description: "Металлическая утепленная бытовка 6×2.4м с отделкой, металлокаркас швеллер 120×50×3, утепление 50мм, профлист С8 0.45мм RAL 7024",
    brand: { "@type": "Brand", name: "СЕВЕРМОДУЛЬ" },
    manufacturer: { "@type": "Organization", name: "СЕВЕРМОДУЛЬ", address: "г. Пестово, Новгородская обл." },
    offers: {
      "@type": "Offer",
      price: "141000",
      priceCurrency: "RUB",
      availability: "https://schema.org/InStock",
      url: "https://severmodul.example.com",
      priceValidUntil: "2026-12-31",
    },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.9", reviewCount: "124" },
  };

  const orgLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "СЕВЕРМОДУЛЬ",
    url: "https://severmodul.example.com",
    telephone: "+78003502418",
    address: { "@type": "PostalAddress", addressLocality: "Пестово", addressRegion: "Новгородская обл." },
  };

  return (
    <html lang="ru">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(orgLd) }} />
        {children}
      </body>
    </html>
  );
}
