// Share-card artwork for `opengraph-image` routes (next/og).
//
// Until this existed every page shared /logo.png — a 1600×1600 square — while
// the metadata claimed it was 1200×630. Platforms that trust the declared size
// cropped it badly, and the ones that don't showed a small square logo. A real
// 1200×630 card also matters for Google Discover, which only shows large
// previews for images at least 1200px wide.
//
// Satori (the renderer behind next/og) supports a subset of CSS: every element
// with more than one child needs `display: flex`, and there is no `gap` on
// wrapping text, so spacing is done with margins.

export const OG_SIZE = { width: 1200, height: 630 };

/**
 * The site-wide card from app/opengraph-image.js, for pages that set their own
 * `openGraph`. Next only inherits the file-based image into segments that don't
 * override `openGraph` in page-level metadata, so those pages have to name it.
 * The path serves without the cache-busting query Next appends.
 */
export const DEFAULT_OG_IMAGE = {
  url: '/opengraph-image',
  width: 1200,
  height: 630,
  alt: 'Anoniz — talk to strangers online, free and anonymous',
};

const SLATE_900 = '#0f172a';
const SLATE_800 = '#1e293b';
const PINK = '#ec4899';
const VIOLET = '#a855f7';

/**
 * @param {{ title: string, eyebrow?: string }} props
 */
export function ogCard({ title, eyebrow }) {
  const fontSize = title.length > 70 ? 54 : title.length > 45 ? 62 : 72;

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        padding: '64px 72px',
        background: `linear-gradient(135deg, ${SLATE_900} 0%, ${SLATE_800} 100%)`,
        color: '#f1f5f9',
        fontFamily: 'sans-serif',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        {/* The camera-with-eyes mark from components/AnonizLogo.jsx, redrawn
            with plain shapes because Satori can't render the masking strokes. */}
        <svg width="78" height="52" viewBox="52 52 150 96">
          <rect
            x="60"
            y="60"
            width="100"
            height="80"
            rx="25"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="8"
          />
          <path
            d="M170 80 L195 70 V130 L170 120 V80 Z"
            fill="none"
            stroke="#A78BFA"
            strokeWidth="8"
            strokeLinejoin="round"
          />
          <circle cx="90" cy="99" r="8" fill="#A78BFA" />
          <circle cx="130" cy="99" r="8" fill="#A78BFA" />
        </svg>
        <div style={{ marginLeft: 18, fontSize: 38, fontWeight: 700 }}>Anoniz</div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        {eyebrow ? (
          <div
            style={{
              fontSize: 26,
              fontWeight: 600,
              color: '#f472b6',
              textTransform: 'uppercase',
              letterSpacing: 3,
              marginBottom: 20,
            }}
          >
            {eyebrow}
          </div>
        ) : null}
        <div style={{ fontSize, fontWeight: 700, lineHeight: 1.15, maxWidth: 1040 }}>{title}</div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 26, color: '#94a3b8' }}>anoniz.com</div>
        <div
          style={{
            width: 220,
            height: 8,
            borderRadius: 4,
            background: `linear-gradient(90deg, ${PINK}, ${VIOLET})`,
          }}
        />
      </div>
    </div>
  );
}
