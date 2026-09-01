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

/**
 * Posts surfaced in the chat/video panels — when a stranger leaves, while a
 * video queue is still searching. Hand-picked for the moment they appear in:
 * someone who has just lost a conversation, or is waiting for one.
 */
const PANEL_SLUGS = [
  '50-best-questions-to-ask-strangers-online-to-keep-conversations-going',
  'how-to-stay-safe-chatting-with-strangers-online',
  'fun-things-to-do-online-when-bored-random-chat',
  'text-chat-vs-video-chat-which-is-better',
  'cant-sleep-late-night-chat-with-strangers',
  'best-omegle-alternatives-safe-free-random-chat',
  'what-to-say-when-conversation-dies-stranger-chat',
  'would-you-rather-questions-to-get-to-know-someone',
  'why-random-chat-sites-are-full-of-bots',
];

/**
 * Pick posts for the in-chat panels. Shuffled so a user who sees the panel
 * several times in one session isn't shown the same three articles.
 *
 * @param {number} count
 * @returns {Array<{slug: string, title: string, readTime?: string}>}
 */
export function getPanelPosts(count = 3) {
  const pool = PANEL_SLUGS.map(getBlogBySlug).filter(Boolean);

  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [pool[i], pool[j]] = [pool[j], pool[i]];
  }

  return pool.slice(0, count);
}
