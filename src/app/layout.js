import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata = {
  title: 'Timblenge | Chat with Strangers',
  description:
    'Timblenge lets you instantly chat with random strangers without any login or tracking. Perfect for Mobile chats, Stranger chats, Making new friends. Simple, private, anonymous conversations – just like Omegle, but better.',
  keywords: [
    'chat with strangers',
    'stranger chat',
    'omegle alternative',
    'random chat',
    'anonymous chat',
    'talk to strangers',
    'chat anonymously',
    'free chat rooms',
    'chat without registration',
    'one-on-one chat',
    'omegle replacement',
    'chat online',
    'stranger text chat',
    'timblenge',
  ],
  alternates: {
    canonical: 'https://timblenge.com/',
  },
  other: {
    'google-site-verification': 'Jan32HbrGFwV4y6NG4m_lPyn8F9rl6luy7f8srKkfrM',
  },
  authors: [{ name: 'Anonymous', url: 'https://timblenge.com' }],
  metadataBase: new URL('https://timblenge.com'),
  openGraph: {
    title: 'Timblenge | Chat with Strangers',
    description:
      'Find someone to talk to on Timblenge – no login, no pressure, just pure anonymous conversations.',
    url: 'https://timblenge.com',
    siteName: 'Timblenge',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo.png', // Replace with your real logo
        width: 1200,
        height: 630,
        alt: 'Timblenge logo',
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
    title: 'Timblenge | Chat with Strangers',
    description: 'Chat anonymously with random people around the world. No login required.',
    images: ['/logo.png'], // Replace if needed
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        {/* <!-- Google tag (gtag.js) --> */}
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

        <meta name="publisher" content="Timblenge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
