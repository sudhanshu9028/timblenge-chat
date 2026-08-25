/**
 * Blog content index — auto-discovers every post module in this directory.
 *
 * To add a new blog post, drop a single file in this folder exporting:
 *   export const frontmatter = { slug, title, description, keywords, ... }
 *   export const faqItems = [{ question, answer }, ...]
 *   export default function PostBody({ styles }) { ... }
 *
 * There is no registration step. The `slug` in frontmatter — not the filename —
 * decides the public URL, so files can be renamed without breaking links.
 */

// Webpack resolves this at build time, so the post list is still fully static
// and `generateStaticParams` can pre-render every page.
const context = require.context('./', false, /^\.\/(?!index\.js$)[\w-]+\.js$/);

const BLOG_CONTENT = {};

for (const key of context.keys()) {
  const { frontmatter, faqItems, default: component } = context(key);

  if (!frontmatter?.slug) {
    throw new Error(`[blogContent] ${key} is missing "frontmatter.slug"`);
  }
  if (!component) {
    throw new Error(`[blogContent] ${key} is missing a default export`);
  }
  if (BLOG_CONTENT[frontmatter.slug]) {
    throw new Error(`[blogContent] duplicate slug "${frontmatter.slug}" in ${key}`);
  }

  BLOG_CONTENT[frontmatter.slug] = {
    component,
    frontmatter,
    faqItems: faqItems ?? [],
  };
}

export default BLOG_CONTENT;
