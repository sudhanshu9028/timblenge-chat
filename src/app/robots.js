export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/chat/', '/video/'], // Don't index dynamic chat/video pages
      },
    ],
    sitemap: 'https://timblenge.com/sitemap.xml',
  };
}
