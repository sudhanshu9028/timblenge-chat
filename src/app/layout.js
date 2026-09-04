import Script from 'next/script';
import Navigation from './components/Navigation';
import AnalyticsBootstrap from './components/AnalyticsBootstrap';
import Footer from './components/Footer';
import './globals.css';

export const viewport = {
  themeColor: '#A78BFA',
  width: 'device-width',
  initialScale: 1,
};

export const metadata = {
  title: 'Anoniz | Talk to Strangers Online – Free Anonymous Chat',
  description:
    'Talk to strangers and make friends online with Anoniz - the best random chat alternative. Experience anonymous chat, video chat with strangers, and text chat without registration. Meet new people from around the world and turn strangers into friends. Perfect Omegle alternative for safe, fun conversations.',
  alternates: {
    canonical: 'https://anoniz.com/',
  },
  other: {
    'google-site-verification': 'Jan32HbrGFwV4y6NG4m_lPyn8F9rl6luy7f8srKkfrM',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/logo.png', sizes: '32x32', type: 'image/png' },
      { url: '/logo.png', sizes: '16x16', type: 'image/png' },
      { url: '/logo.png', sizes: '192x192', type: 'image/png' },
      { url: '/logo.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [{ url: '/logo.png', sizes: '180x180', type: 'image/png' }],
  },
  manifest: '/manifest.json',
  authors: [{ name: 'Anonymous', url: 'https://anoniz.com' }],
  metadataBase: new URL('https://anoniz.com'),
  publisher: 'Anoniz',
  openGraph: {
    title: 'Anoniz | Talk to Strangers Online – Free Anonymous Chat',
    description:
      'Talk to strangers and make friends online. Experience anonymous chat, video chat, and text chat with random people from around the world. No registration required - start chatting instantly!',
    url: 'https://anoniz.com',
    siteName: 'Anoniz',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Anoniz - Chat with Strangers, Make Friends Online',
      },
    ],
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anoniz | Talk to Strangers Online – Free Anonymous Chat',
    description:
      'Talk to strangers and make friends online. Video chat and text chat with random people worldwide. No registration required - start chatting instantly!',
    images: ['/logo.png'],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* Preconnect only to domains we actually use */}
        <link rel="dns-prefetch" href="https://www.googletagmanager.com" />

        {/* Lighthouse CrUX Report */}
        <Script
          src="https://lighthouse-crux-report.vercel.app/beacon.js"
          data-site="2e17dc4a-39e4-471b-9565-786b3ce54b6c"
          strategy="afterInteractive"
          async
        />

        {/*
          Consent Mode v2 defaults. This runs before the tag loads, which is
          the only point at which defaults are allowed to be set.

          The `region` override lets Google resolve geography itself, so EEA
          and UK visitors get a fully-denied default (GA4 still receives
          cookieless modelled pings) without us needing an IP lookup or a
          consent banner. Everywhere else keeps analytics_storage granted.
        */}
        <Script id="ga-consent" strategy="beforeInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'granted'
    });
    gtag('consent', 'default', {
      ad_storage: 'denied',
      ad_user_data: 'denied',
      ad_personalization: 'denied',
      analytics_storage: 'denied',
      region: ['AT','BE','BG','HR','CY','CZ','DK','EE','FI','FR','DE','GR','HU','IS','IE','IT','LV','LI','LT','LU','MT','NL','NO','PL','PT','RO','SK','SI','ES','SE','GB','CH']
    });
  `}
        </Script>

        {/*
          afterInteractive, not lazyOnload. lazyOnload waits for window load
          plus browser idle, so visitors who bounce in the first few seconds
          never fired a pageview at all — which shrank the numbers and, worse,
          biased them toward whichever traffic sources bounce least.
        */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7LNMKJ3NBQ"
          strategy="afterInteractive"
        />

        <Script id="ga-setup" strategy="afterInteractive">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-7LNMKJ3NBQ');
  `}
        </Script>
      </head>
      <body className="antialiased">
        <AnalyticsBootstrap />
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
