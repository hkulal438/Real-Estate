import './globals.css';
import type { Metadata } from 'next';
import { Cormorant_Garamond, Jost } from 'next/font/google';
import { LenisProvider } from '@/components/providers/lenis-provider';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-cormorant',
  display: 'swap',
});

const jost = Jost({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-jost',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Aurelian Tower — Residences Above the City',
  description:
    'Aurelian Tower — a limited collection of architect-designed residences rising above the city. Explore the story, amenities, floor plans, and availability.',
  openGraph: {
    title: 'Aurelian Tower — Residences Above the City',
    description:
      'A limited collection of architect-designed residences rising above the city.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="font-body bg-background text-foreground antialiased">
        <LenisProvider>{children}</LenisProvider>
      </body>
    </html>
  );
}
