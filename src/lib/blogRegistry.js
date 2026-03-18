/**
 * Blog Registry - Central source of truth for all blog posts.
 *
 * To add a new blog post:
 * 1. Add an entry to the BLOG_POSTS array below
 * 2. Add the corresponding content component in the blog [slug] page
 * 3. Run `next build` to generate the static page
 *
 * Only slugs registered here will resolve. Everything else returns 404.
 */

import BLOG_CONTENT from '@/lib/blogContent';

export const BLOG_POSTS = Object.entries(BLOG_CONTENT).map(([slug, data]) => ({
  slug,
  ...data.frontmatter,
}));

/**
 * Get a blog post by its slug.
 * @param {string} slug
 * @returns {object|null} The blog post data, or null if not found.
 */
export function getBlogBySlug(slug) {
  return BLOG_POSTS.find((post) => post.slug === slug) || null;
}

/**
 * Get all registered slugs — used by generateStaticParams.
 * @returns {string[]}
 */
export function getAllSlugs() {
  return BLOG_POSTS.map((post) => post.slug);
}
