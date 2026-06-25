import type { Metadata } from 'next';
import { Space_Grotesk, Manrope, IBM_Plex_Mono } from 'next/font/google';
import { MotionConfig } from 'framer-motion';
import { QueryProvider } from '@/context/QueryProvider';
import { LanguageProvider } from '@/context/LanguageContext';
import { SITE_URL } from '@/lib/site';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const manrope = Manrope({
  subsets: ['latin'],
  variable: '--font-manrope',
  display: 'swap',
});

const plexMono = IBM_Plex_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-plex-mono',
  display: 'swap',
});

const title = 'Tyre on Cloud — ยางรถยนต์คุณภาพสูง ราคาดี จัดส่งทั่วไทย';
const description =
  'ค้นหายางรถยนต์ตามขนาด รุ่นรถ หรือทะเบียน จาก 40+ แบรนด์ระดับโลก | Search by size, vehicle or plate. DUNLOP, MICHELIN, BRIDGESTONE, MAXXIS and more.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title,
  description,
  keywords: 'ยางรถยนต์, ยางรถ, tyre, tire, DUNLOP, MICHELIN, BRIDGESTONE, MAXXIS, ยางถูก, ยางดี',
  alternates: { canonical: '/' },
  robots: { index: true, follow: true },
  openGraph: {
    title,
    description,
    url: SITE_URL,
    siteName: 'Tyre on Cloud',
    locale: 'th_TH',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title,
    description,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="th" data-scroll-behavior="smooth">
      <body
        className={`${spaceGrotesk.variable} ${manrope.variable} ${plexMono.variable} font-body bg-ink-950 text-chalk-100`}
      >
        <MotionConfig reducedMotion="user">
          <QueryProvider>
            <LanguageProvider>
              {children}
            </LanguageProvider>
          </QueryProvider>
        </MotionConfig>
      </body>
    </html>
  );
}
