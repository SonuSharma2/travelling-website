import type { Metadata } from 'next';
import { Syne, Cormorant_Garamond, Plus_Jakarta_Sans, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import 'yet-another-react-lightbox/styles.css';
import 'yet-another-react-lightbox/plugins/thumbnails.css';
import 'yet-another-react-lightbox/plugins/captions.css';
import SmoothScrollProvider from '@/components/providers/SmoothScrollProvider';
import Header from '@/components/navigation/Header';
import Footer from '@/components/navigation/Footer';

// Cool avant-garde display font for titles
const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
  weight: ['400', '500', '600', '700', '800'],
});

// Poetic, high-end editorial serif
const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-cormorant',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

// Modern grotesque sans for UI and body copy
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

// Precise mono for technical GPS coordinates and altitudes
const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'My Travel Journal — Exploring Nepal: Places I’ve Been. Moments I’ve Kept.',
  description:
    'A personal digital travel world documenting journeys across Nepal through fine photography, mountain geography, and visual storytelling.',
  keywords: ['nepal travel journal', 'pokhara', 'mustang', 'kathmandu', 'chitwan', 'namche bazaar', 'nepal photography'],
  authors: [{ name: 'Sonu Sharma' }],
  openGraph: {
    title: 'My Travel Journal — Exploring Nepal',
    description:
      'A personal digital travel world documenting journeys across Nepal through fine photography and visual storytelling.',
    url: 'https://traveljournal.com',
    siteName: 'My Travel Journal — Nepal',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80',
        width: 1200,
        height: 630,
        alt: 'Annapurna sunrise over Phewa Lake, Nepal',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Travel Journal — Exploring Nepal',
    description:
      'A personal digital travel world documenting journeys across Nepal through photography and visual storytelling.',
    images: ['https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1200&q=80'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${syne.variable} ${cormorant.variable} ${jakarta.variable} ${mono.variable} antialiased selection:bg-[#A87428] selection:text-white`}
    >
      <body className="min-h-screen bg-white text-[#0D0E12] flex flex-col font-sans relative">
        <SmoothScrollProvider>
          <Header />
          <main className="flex-grow">{children}</main>
          <Footer />
        </SmoothScrollProvider>
      </body>
    </html>
  );
}
