import { readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { SITE_NAME } from './seo';

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = 'image/png';

const BG = '#0F1614';
const FG = '#E9EBE5';
const ACCENT = '#C7822B';

let logoPromise;
function getLogo() {
  if (!logoPromise) {
    logoPromise = readFile(join(process.cwd(), 'public/para_modul_logo.png')).then(
      (buf) => `data:image/png;base64,${buf.toString('base64')}`
    );
  }
  return logoPromise;
}

async function fetchFontOnce(family, text) {
  const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&text=${encodeURIComponent(text)}`;
  const css = await fetch(url, { cache: 'force-cache' }).then((res) => res.text());
  const match = css.match(/src: url\(([^)]+)\) format\('(?:opentype|truetype)'\)/);
  if (match) {
    const res = await fetch(match[1], { cache: 'force-cache' });
    if (res.ok) return res.arrayBuffer();
  }
  throw new Error(`failed to load font: ${family}`);
}

// Google Fonts is an external dependency mid-build/mid-request — retry a
// couple of times before giving up, so a single transient network blip
// doesn't fail the whole build or a visitor's first share preview.
async function loadGoogleFont(family, text, attempts = 3) {
  let lastError;
  for (let i = 0; i < attempts; i += 1) {
    try {
      return await fetchFontOnce(family, text);
    } catch (err) {
      lastError = err;
      if (i < attempts - 1) await new Promise((r) => setTimeout(r, 300 * (i + 1)));
    }
  }
  throw lastError;
}

function truncate(str, max) {
  if (!str || str.length <= max) return str;
  return `${str.slice(0, max - 1).trimEnd()}…`;
}

// Placeholder text-only card. Swap in real product/article photography here
// once it's available — background/logo layout is kept simple on purpose.
export async function renderOgImage({ eyebrow, title, subtitle }) {
  subtitle = truncate(subtitle, 110);
  const eyebrowUpper = eyebrow ? eyebrow.toUpperCase() : eyebrow;
  const { ImageResponse } = await import('next/og');
  const text = `${eyebrowUpper || ''}${title}${subtitle || ''}${SITE_NAME}`;
  const [logoSrc, unbounded, golos] = await Promise.all([
    getLogo(),
    loadGoogleFont('Unbounded:wght@600', text),
    loadGoogleFont('Golos Text:wght@400', text),
  ]);

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '64px 72px',
          background: BG,
          color: FG,
          fontFamily: 'Golos Text',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
          <img src={logoSrc} width={64} height={64} />
          <span style={{ fontFamily: 'Unbounded', fontSize: 28, letterSpacing: 1 }}>
            {SITE_NAME}
          </span>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
          {eyebrowUpper && (
            <span
              style={{
                fontFamily: 'Unbounded',
                fontSize: 26,
                color: ACCENT,
                letterSpacing: 2,
              }}
            >
              {eyebrowUpper}
            </span>
          )}
          <span style={{ fontFamily: 'Unbounded', fontSize: 58, lineHeight: 1.15, maxWidth: 980 }}>
            {title}
          </span>
          {subtitle && (
            <span style={{ fontSize: 32, color: FG, opacity: 0.85, maxWidth: 980 }}>
              {subtitle}
            </span>
          )}
        </div>
      </div>
    ),
    {
      ...ogSize,
      fonts: [
        { name: 'Unbounded', data: unbounded, style: 'normal', weight: 600 },
        { name: 'Golos Text', data: golos, style: 'normal', weight: 400 },
      ],
    }
  );
}
