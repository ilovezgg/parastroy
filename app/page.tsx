import Landing from "./Landing";
import { SITE_URL, pageOpenGraph } from "./lib/seo";
import { organizationJsonLd, faqJsonLd } from "./lib/jsonld";
import { FAQS } from "./data/faq";

export const metadata = {
  alternates: { canonical: SITE_URL },
  openGraph: pageOpenGraph('/'),
};

export default function Page() {
  const jsonLd = [organizationJsonLd(), faqJsonLd(FAQS)];

  return (
    <>
      {jsonLd.map((schema, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
      <Landing />
    </>
  );
}
