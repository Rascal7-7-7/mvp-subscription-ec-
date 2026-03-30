'use client';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, loaded, removeItem, updateQuantity, totalAmount } = useCart();
  const router = useRouter();

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <span className="material-symbols-outlined text-6xl text-outline block mb-4">
          shopping_bag
        </span>
        <p className="label-editorial text-on-surface-variant mb-2">YOUR CART</p>
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
          <span className="material-symbols-outlined text-[18px]">storefront</span>
          ショップを見る
        </Link>
      </main>
    );
  }

  const hasSubscription = items.some(item =>
    item.planName.includes('定期') || item.planName.includes('回')
  );

  return (
    <main className="max-w-3xl mx-auto px-4 sm:px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="label-editorial text-on-surface-variant mb-1">YOUR SELECTION</p>
        <h1 className="font-headline text-2xl font-bold text-on-surface">カート</h1>
      </div>

      {/* Subscription context banner */}
      {hasSubscription && (
        <div className="flex items-start gap-3 bg-primary/8 border border-primary/20 rounded-xl px-4 py-3 mb-5">
          <span className="material-symbols-outlined text-[20px] text-primary flex-shrink-0 mt-0.5">
            autorenew
          </span>
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
              <span className="inline-block label-editorial bg-surface-container text-on-surface-variant px-2 py-0.5 rounded-full mt-1">
                {item.planName}
              </span>

              <div className="flex items-center justify-between mt-3">
                {/* Quantity controls */}
                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.planId, item.quantity - 1)
                    }
                    className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
                    aria-label="数量を減らす"
                  >
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      remove
                    </span>
                  </button>
                  <span className="text-sm font-semibold text-on-surface w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() =>
                      updateQuantity(item.productId, item.planId, item.quantity + 1)
                    }
                    className="w-7 h-7 rounded-full border border-outline-variant flex items-center justify-center hover:bg-surface-container transition-colors"
                    aria-label="数量を増やす"
                  >
                    <span className="material-symbols-outlined text-[16px] text-on-surface-variant">
                      add
                    </span>
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
                    <span className="material-symbols-outlined text-[18px]">delete</span>
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
        <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
      </button>

      <div className="text-center mt-4">
        <Link
          href="/products"
          className="text-on-surface-variant text-sm hover:text-on-surface transition-colors inline-flex items-center gap-1"
        >
          <span className="material-symbols-outlined text-[16px]">arrow_back</span>
          ショップに戻る
        </Link>
      </div>
    </main>
  );
}
