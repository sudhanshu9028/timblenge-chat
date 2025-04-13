import { Geist, Geist_Mono } from 'next/font/google';
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
        <meta name="publisher" content="Timblenge" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>{children}</body>
    </html>
  );
}
