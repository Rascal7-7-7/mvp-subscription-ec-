'use client';
import Link from 'next/link';
import { ShoppingBag, Store } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function Header() {
  const { totalItems, loaded } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-background/85 backdrop-blur-md border-b border-outline-variant/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link href="/products" className="flex flex-col leading-none group">
          <span className="font-label text-[10px] font-semibold tracking-[0.18em] text-on-surface-variant uppercase">
            Mori Digital Atelier
          </span>
          <span className="font-headline text-base font-semibold text-on-surface tracking-wide group-hover:text-primary transition-colors">
            森の定期便
          </span>
        </Link>

        {/* Nav */}
        <nav className="flex items-center gap-1">
          <Link
            href="/products"
            className="hidden sm:flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          >
            <Store className="w-4 h-4" />
            ショップ
          </Link>
          <Link
            href="/cart"
            className="relative flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-on-surface-variant hover:text-on-surface hover:bg-surface-container rounded-lg transition-colors"
          >
            <ShoppingBag className="w-4 h-4" />
            <span className="hidden sm:inline">カート</span>
            {loaded && totalItems > 0 && (
              <span className="absolute top-1 right-1 bg-primary text-on-primary text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
