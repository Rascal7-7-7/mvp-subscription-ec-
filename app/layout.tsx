import type { Metadata } from 'next';
import { Plus_Jakarta_Sans, Noto_Sans_JP, Be_Vietnam_Pro } from 'next/font/google';
import './globals.css';
import { Header } from '@/components/Header';

const headline = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-headline',
  display: 'swap',
});

const bodyJP = Noto_Sans_JP({
  subsets: ['latin'],
  variable: '--font-body-jp',
  display: 'swap',
  weight: ['400', '500', '700'],
});

const label = Be_Vietnam_Pro({
  subsets: ['latin'],
  variable: '--font-label',
  display: 'swap',
  weight: ['400', '500', '600'],
});

export const metadata: Metadata = {
  title: 'Mori Digital Atelier — 森の定期便',
  description: '森が育てた素材を、あなたの暮らしへ。D2C定期購入ECのデモサイト。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja">
      <body
        className={`${headline.variable} ${bodyJP.variable} ${label.variable} font-body bg-background text-on-surface min-h-screen`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}
