import { BLOG_POSTS } from '@/lib/blogRegistry';

const BASE_URL = 'https://anoniz.com';

/**
 * Real last-modified dates for the hand-written pages.
 *
 * These used to be `new Date()` evaluated at request time, which told Google
 * that every page — including the terms and privacy pages — had changed in the
 * last second, on every single fetch. Google discards `lastmod` from a sitemap
 * once it can prove the values are wrong, and it discards it for the whole
 * file, so the blog posts' honest dates were being thrown away too.
 *
 * IndexNow now diffs against these dates to decide what to submit
 * (src/server/indexNow.js), so an inaccurate date here means either a missed
 * submission or a pointless one.
 *
 * Bump the date when you meaningfully change a page. Blog posts don't appear
 * here — they carry their own `modifiedDate` in frontmatter.
 */
const STATIC_PAGE_DATES = {
  '/': '2026-09-02',
  '/chat': '2026-09-02',
  '/video': '2026-09-02',
  '/blog': '2026-08-26',
  '/about': '2026-02-08',
  '/support': '2026-02-08',
  '/terms': '2026-02-08',
  '/privacy-policy': '2026-02-08',
};

export default function sitemap() {
  // `changeFrequency` and `priority` are deliberately omitted: Google has
  // ignored both for years, and they were only ever noise in the file.
  const staticPages = Object.entries(STATIC_PAGE_DATES).map(([path, lastModified]) => ({
    url: path === '/' ? BASE_URL : `${BASE_URL}${path}`,
    lastModified,
  }));

  const blogPages = BLOG_POSTS.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.modifiedDate,
  }));

  return [...staticPages, ...blogPages];
}
