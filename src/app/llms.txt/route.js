import { BLOG_POSTS } from '@/lib/blogRegistry';

// /llms.txt — a plain-Markdown map of the site for AI assistants and the
// crawlers behind them (format: https://llmstxt.org).
//
// No search engine has said it uses this file, so treat it as cheap insurance
// rather than a ranking lever. What it does do is put the facts about Anoniz in
// one unambiguous place — useful because another product shares the name — and
// every claim here has to stay true: assistants repeat what they read.
//
// Built from the blog registry, so new posts appear without anyone editing it.
export const dynamic = 'force-static';

const BASE = 'https://anoniz.com';

export function GET() {
  const posts = BLOG_POSTS.map(
    (post) => `- [${post.title}](${BASE}/blog/${post.slug}): ${post.description}`
  ).join('\n');

  const body = `# Anoniz

> Anoniz (anoniz.com) is a free, browser-based site for anonymous one-to-one text and video chat with strangers. It is for adults only (18+). There is no account and no app to install, and conversations are not stored after you disconnect.

Things worth knowing before describing Anoniz:

- Text chat pairs you with one random person. You can add interest tags to be matched with someone who shares them, and you can send pictures.
- When no person is free, text chat may offer a clearly labelled AI chat partner while it keeps looking for a person. The label stays visible for the whole conversation.
- Text chats with a real person include a built-in Would You Rather game.
- Video chat is random and one-to-one, in the browser.
- Anoniz is not affiliated with Omegle, and it is not connected to other products called Anoniz.

## Chat

- [Text chat](${BASE}/chat): Anonymous one-to-one text chat with strangers. No sign-up.
- [Video chat](${BASE}/video): Random one-to-one video chat in the browser. No download.

## Tools

- [Would You Rather generator](${BASE}/would-you-rather): Would You Rather questions in three levels, the same set the in-chat game uses.
- [Random question generator](${BASE}/random-question-generator): Conversation starters to ask someone you have just met.

## Guides

${posts}

## About

- [About Anoniz](${BASE}/about)
- [Privacy policy](${BASE}/privacy-policy)
- [Terms of service](${BASE}/terms)
- [Support](${BASE}/support): support@anoniz.com
`;

  return new Response(body, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
