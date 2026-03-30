'use client';
import Link from 'next/link';
import { ShoppingCart, RefreshCw } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export function Header() {
  const { totalItems, loaded } = useCart();

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/products" className="flex items-center gap-2">
          <RefreshCw className="w-5 h-5 text-indigo-600" />
          <span className="text-xl font-bold text-gray-900">
            Subscribe<span className="text-indigo-600">Store</span>
          </span>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/products"
            className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
          >
            商品一覧
          </Link>
          <Link href="/cart" className="relative flex items-center gap-1.5 text-gray-600 hover:text-gray-900 transition-colors">
            <ShoppingCart className="w-5 h-5" />
            <span className="text-sm font-medium">カート</span>
            {loaded && totalItems > 0 && (
              <span className="absolute -top-2 -right-3 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
