import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import Navigation from './components/Navigation';
import Footer from './components/Footer';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Disabled - font not used, we're using system fonts
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
  preload: false, // Only preload the primary font
});

export const metadata = {
  title: 'Anoniz | Chat with Strangers, Make Friends Online',
  description:
    'Talk to strangers and make friends online with Anoniz - the best random chat alternative. Experience anonymous chat, video chat with strangers, and text chat without registration. Meet new people from around the world and turn strangers into friends. Perfect Omegle alternative for safe, fun conversations.',
  keywords: [
    'chat with strangers',
    'talk to strangers',
    'random chat',
    'anonymous chat',
    'omegle alternative',
    'video chat with strangers',
    'text chat',
    'meet new people',
    'make friends online',
    'chat with strangers online',
    'stranger chat',
    'chat anonymously',
    'free chat rooms',
    'chat without registration',
    'one-on-one chat',
    'omegle replacement',
    'chat online',
    'stranger text chat',
    'random video chat',
    'anonymous video chat',
    'talk to strangers online',
    'meet strangers online',
    'chat with random people',
    'online chat platform',
    'anoniz',
  ],
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
  openGraph: {
    title: 'Anoniz | Chat with Strangers, Make Friends Online',
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
  alternates: {
    canonical: '/',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Anoniz | Chat with Strangers, Make Friends Online',
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

        {/* <!-- Google tag (gtag.js) - Deferred to improve LCP --> */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-7LNMKJ3NBQ"
          strategy="lazyOnload"
        />

        <Script id="ga-setup" strategy="lazyOnload">
          {`
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-7LNMKJ3NBQ');
  `}
        </Script>

        <meta name="publisher" content="Anoniz" />
        <meta name="theme-color" content="#A78BFA" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="32x32" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/logo.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/logo.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/logo.png" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Navigation />
        {children}
        <Footer />
      </body>
    </html>
  );
}
