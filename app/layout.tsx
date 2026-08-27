import './globals.css';
import Script from 'next/script';
import { Unbounded, Golos_Text, JetBrains_Mono } from 'next/font/google';
import { SITE_URL, SITE_NAME } from './lib/seo';
import SmoothScroll from './components/SmoothScroll/SmoothScroll';

const YANDEX_METRIKA_ID = 111937405;

const unbounded = Unbounded({
  subsets: ['latin','cyrillic'],
  weight: ['200','300','500','700'],
  variable: '--font-unbounded',
  display: 'swap',
});
const golos = Golos_Text({
  subsets: ['latin','cyrillic'],
  weight: ['400','500','600'],
  variable: '--font-golos',
  display: 'swap',
});
const mono = JetBrains_Mono({
  subsets: ['latin','cyrillic'],
  weight: ['400','500'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: 'ПАРА | МОДУЛЬ — бытовки и блок-контейнеры от завода',
    template: `%s — ${SITE_NAME}`,
  },
  description:
    'Завод бытовок и блок-контейнеров в Пестово. Без посредников, доставка по всей России, отгрузка со склада за 1–2 дня.',
  verification: {
    yandex: '2cf483ea37c9f071',
    other: {
      'google-site-verification': 'google43dfa2813ce5a422',
    },
  },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    siteName: SITE_NAME,
    url: SITE_URL,
  },
  twitter: {
    card: 'summary_large_image',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${unbounded.variable} ${golos.variable} ${mono.variable}`}>
      <body>
        <SmoothScroll />
        {children}
        <Script id="yandex-metrika" strategy="afterInteractive">
          {`
            (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};
            m[i].l=1*new Date();
            for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}
            k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})
            (window, document, "script", "https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}", "ym");

            ym(${YANDEX_METRIKA_ID}, "init", {
              clickmap: true,
              trackLinks: true,
              accurateTrackBounce: true,
              webvisor: true
            });
          `}
        </Script>
        <noscript>
          <div>
            <img
              src={`https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}`}
              style={{ position: 'absolute', left: '-9999px' }}
              alt=""
            />
          </div>
        </noscript>
      </body>
    </html>
  );
}