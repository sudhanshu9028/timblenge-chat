import { Geist, Geist_Mono } from 'next/font/google';
import Script from 'next/script';
import { SocketProvider } from '@/context/SocketProvider';
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
  title: 'Timblenge | Chat with Strangers, Make Friends Online',
  description:
    'Talk to strangers and make friends online with Timblenge - the best random chat alternative. Experience anonymous chat, video chat with strangers, and text chat without registration. Meet new people from around the world and turn strangers into friends. Perfect Omegle alternative for safe, fun conversations.',
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
    title: 'Timblenge | Chat with Strangers, Make Friends Online',
    description:
      'Talk to strangers and make friends online. Experience anonymous chat, video chat, and text chat with random people from around the world. No registration required - start chatting instantly!',
    url: 'https://timblenge.com',
    siteName: 'Timblenge',
    type: 'website',
    locale: 'en_US',
    images: [
      {
        url: '/logo.png',
        width: 1200,
        height: 630,
        alt: 'Timblenge - Chat with Strangers, Make Friends Online',
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
    title: 'Timblenge | Chat with Strangers, Make Friends Online',
    description:
      'Talk to strangers and make friends online. Video chat and text chat with random people worldwide. No registration required - start chatting instantly!',
    images: ['/logo.png'],
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
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <SocketProvider>{children}</SocketProvider>
        <footer
          style={{ textAlign: 'center', padding: '5px', fontSize: '0.875rem', color: '#94a3b8' }}
        >
          Found a bug or have a suggestion? Email us at{' '}
          <a
            href="mailto:timblenge@gmail.com"
            style={{ color: '#cbd5e1', textDecoration: 'underline' }}
          >
            timblenge@gmail.com
          </a>
        </footer>
      </body>
    </html>
  );
}
