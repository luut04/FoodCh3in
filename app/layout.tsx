import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'FoodCh3in Wallet',
  description: 'QR payments and NFT receipts powered by Crossmint.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-slate-950 text-white`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}