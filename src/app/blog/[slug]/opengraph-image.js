import { ImageResponse } from 'next/og';
import { OG_SIZE, ogCard } from '@/lib/ogImage';
import { getAllSlugs, getBlogBySlug } from '@/lib/blogRegistry';

// One card per post, carrying its headline, so a shared link says what the
// article is about instead of showing the same logo for all of them.
export const alt = 'Anoniz blog article';
export const size = OG_SIZE;
export const contentType = 'image/png';

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export default async function Image({ params }) {
  const { slug } = await params;
  const post = getBlogBySlug(slug);

  return new ImageResponse(
    ogCard({
      eyebrow: post ? post.category : 'Blog',
      title: post ? post.title : 'Anoniz blog',
    }),
    size
  );
}
