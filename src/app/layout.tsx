import './globals.css';
import Link from 'next/link';
import { CartProvider } from '@/context/CartContext';

export const metadata = {
  title: 'Atelier - Handsewn Women Clothing',
  description: 'Custom-tailored and pre-made garments made to order.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-slate-50 text-slate-900 flex flex-col min-h-screen">
        <CartProvider>
          {/* Main Navigation */}
          <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
              <Link href="/" className="text-xl font-bold tracking-widest uppercase">
                Atelier
              </Link>
              <nav className="flex items-center gap-6 text-sm font-medium">
                <Link href="/" className="hover:text-gray-600">Catalog</Link>
                <Link href="/cart" className="hover:text-gray-600">Cart & Track</Link>
                <Link href="/admin" className="text-xs border border-black px-2.5 py-1 rounded hover:bg-black hover:text-white transition">
                  Admin Panel
                </Link>
              </nav>
            </div>
          </header>

          <main className="flex-1">{children}</main>

          <footer className="bg-white border-t py-8 text-center text-xs text-gray-500">
            © {new Date().getFullYear()} Atelier Sewing Studio. All rights reserved.
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}