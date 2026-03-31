'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ShoppingBag, ArrowRight, ArrowLeft, RefreshCw, Plus, Minus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, loaded, removeItem, updateQuantity, totalAmount } = useCart();
  const router = useRouter();

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-surface-container rounded-full mb-4">
          <ShoppingBag className="w-8 h-8 text-outline" />
        </div>
        <h1 className="font-headline text-xl font-semibold text-on-surface mb-2">
          カートに商品がありません
        </h1>
        <p className="text-on-surface-variant text-sm mb-8">
          商品一覧からプランを選んでカートに追加してください
        </p>
        <Link
          href="/products"
          className="inline-flex items-center gap-2 bg-primary text-on-primary px-6 py-3 rounded-xl font-medium hover:opacity-90 transition-opacity"
        >
          ショップを見る
          <ArrowRight className="w-4 h-4" />
        </Link>
      </main>
    );
  }

  const hasSubscription = items.some(item =>
    item.planName.includes('定期') || item.planName.includes('回')
  );

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      <h1 className="font-headline text-2xl font-bold text-on-surface mb-6">カート</h1>

      {/* Subscription context banner */}
      {hasSubscription && (
        <div className="flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 mb-5">
          <RefreshCw className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-sm text-on-surface">
            <span className="font-medium">定期便プランが含まれています。</span>
            <span className="text-on-surface-variant ml-1">
              申込後、マイページからいつでも停止・解約できます。
            </span>
          </p>
        </div>
      )}

      {/* Cart items */}
      <div className="space-y-3 mb-6">
        {items.map(item => (
          <div
            key={`${item.productId}-${item.planId}`}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-4 flex gap-4 shadow-elevation-1"
          >
            <div className="relative w-20 h-20 rounded-xl overflow-hidden flex-shrink-0 bg-surface-container">
              <Image
                src={item.productImageUrl}
                alt={item.productName}
                fill
                className="object-cover"
                sizes="80px"
              />
            </div>

            <div className="flex-1 min-w-0">
              <h3 className="font-medium text-on-surface text-sm truncate">
                {item.productName}
              </h3>
              <span className="inline-block text-[11px] font-medium bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full mt-1">
                {item.planName}
              </span>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(item.productId, item.planId, item.quantity - 1)}
                    className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
                    aria-label="数量を減らす"
                  >
                    <Minus className="w-3 h-3 text-on-surface-variant" />
                  </button>
                  <span className="text-sm font-semibold text-on-surface w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateQuantity(item.productId, item.planId, item.quantity + 1)}
                    className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
                    aria-label="数量を増やす"
                  >
                    <Plus className="w-3 h-3 text-on-surface-variant" />
                  </button>
                </div>

                <div className="flex items-center gap-3">
                  <span className="font-headline font-bold text-on-surface">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </span>
                  <button
                    onClick={() => removeItem(item.productId, item.planId)}
                    className="text-outline hover:text-error transition-colors"
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
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 px-5 py-4 mb-5 shadow-elevation-1 flex justify-between items-center">
        <span className="text-on-surface-variant font-medium text-sm">合計金額（税込）</span>
        <span className="font-headline font-bold text-2xl text-primary">
          ¥{totalAmount.toLocaleString()}
        </span>
      </div>

      <button
        onClick={() => router.push('/checkout')}
        className="w-full bg-primary text-on-primary py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
      >
        申込内容を確認する
        <ArrowRight className="w-5 h-5" />
      </button>

      <div className="text-center mt-4">
        <Link
          href="/products"
          className="text-on-surface-variant text-sm hover:text-on-surface transition-colors inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-4 h-4" />
          ショップに戻る
        </Link>
      </div>
    </main>
  );
}
