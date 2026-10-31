import { ImageResponse } from 'next/og';
import { OG_SIZE, ogCard } from '@/lib/ogImage';

// The site-wide share card. Routes inherit it unless they have their own (blog
// posts do — see app/blog/[slug]/opengraph-image.js) or set `openGraph` in a
// page's metadata, in which case they must list DEFAULT_OG_IMAGE themselves.
export const alt = 'Anoniz — talk to strangers online, free and anonymous';
export const size = OG_SIZE;
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    ogCard({
      eyebrow: 'Free text and video chat',
      title: 'Talk to strangers online. No account, nothing stored.',
    }),
    size
  );
}
