/**
 * Blog Registry - Central source of truth for all blog posts.
 *
 * To add a new blog post, add a single file to src/lib/blogContent/ — it is
 * picked up automatically. See that folder's index.js for the required exports.
 *
 * Only slugs declared in a post's frontmatter will resolve; everything else 404s.
 */

import BLOG_CONTENT from '@/lib/blogContent';

// Newest first. Many posts share a publishedDate, so the slug tiebreaker is
// what keeps the listing order stable — without it the order would silently
// follow the order posts happen to be discovered in.
export const BLOG_POSTS = Object.entries(BLOG_CONTENT)
  .map(([slug, data]) => ({
    slug,
    ...data.frontmatter,
  }))
  .sort(
    (a, b) => new Date(b.publishedDate) - new Date(a.publishedDate) || a.slug.localeCompare(b.slug)
  );

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
