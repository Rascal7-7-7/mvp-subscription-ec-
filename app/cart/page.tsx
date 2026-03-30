'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, loaded, removeItem, updateQuantity, totalAmount } = useCart();
  const router = useRouter();

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
          <ShoppingBag className="w-10 h-10 text-gray-300" />
        </div>
        <h1 className="text-xl font-semibold text-gray-700 mb-2">
          カートに商品がありません
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          商品一覧からプランを選んでカートに追加してください
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-indigo-700 transition-colors"
        >
          商品を見る
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  return (
    <main className="max-w-3xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">カート</h1>

      <div className="space-y-3 mb-8">
        {items.map(item => (
          <div
            key={`${item.productId}-${item.planId}`}
            className="bg-white rounded-2xl border border-gray-100 p-4 flex gap-4 shadow-sm"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-gray-100">
              <Image
                src={item.productImageUrl}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-gray-900 text-sm truncate">
                {item.productName}
              </h3>
              <span className="inline-block text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full mt-1 font-medium">
                {item.planName}
              </span>
              <div className="flex items-center justify-between mt-3">
                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.planId, item.quantity - 1)
                    }
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="数量を減らす"
                  >
                    <Minus className="w-3 h-3 text-gray-600" />
                  </button>
                  <span className="text-sm font-semibold w-6 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.planId, item.quantity + 1)
                    }
                    className="w-7 h-7 rounded-full border border-gray-200 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    aria-label="数量を増やす"
                  >
                    <Plus className="w-3 h-3 text-gray-600" />
                  </button>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-900">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId, item.planId)}
                    className="text-gray-300 hover:text-red-400 transition-colors"
                    aria-label="削除"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Total */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 font-medium">合計金額（税込）</span>
          <span className="font-bold text-2xl text-indigo-600">
            ¥{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      <button
        onClick={() => router.push('/checkout')}
        className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
      >
        申込内容を確認する
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="text-center mt-4">
        <Link
          href="/products"
          className="text-gray-400 text-sm hover:text-gray-600 transition-colors"
        >
          ← 商品一覧に戻る
        </Link>
      </div>
    </main>
  );
}
