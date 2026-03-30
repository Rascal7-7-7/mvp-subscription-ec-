'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, CheckCircle, RefreshCw, ChevronLeft } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product, SubscriptionPlan } from '@/lib/types';

type Props = {
  product: Product;
  plans: SubscriptionPlan[];
};

export function ProductDetailClient({ product, plans }: Props) {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(
    plans[0]?.id ?? 0
  );
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const maxPrice = plans.length > 0 ? Math.max(...plans.map(p => p.price)) : 0;

  const handleAddToCart = () => {
    if (!selectedPlan) return;
    addItem({
      productId: product.id,
      productName: product.name,
      productImageUrl: product.image_url,
      planId: selectedPlan.id,
      planName: selectedPlan.name,
      price: selectedPlan.price,
      quantity: 1,
    });
    setAdded(true);
    setTimeout(() => router.push('/cart'), 800);
  };

  return (
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-gray-400 hover:text-gray-600 text-sm mb-8 transition-colors"
      >
        <ChevronLeft className="w-4 h-4" />
        商品一覧に戻る
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <div className="relative h-80 lg:h-[480px] bg-gray-100 rounded-2xl overflow-hidden">
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
        </div>

        {/* Info */}
        <div className="flex flex-col">
          <span className="inline-flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-xs font-semibold px-2.5 py-1 rounded-full w-fit mb-3">
            <RefreshCw className="w-3 h-3" />
            定期購入対応
          </span>

          <h1 className="text-2xl font-bold text-gray-900 mb-3">
            {product.name}
          </h1>
          <p className="text-gray-600 text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Plan selection */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-3">
              購入プランを選ぶ
            </h2>
            <div className="space-y-3">
              {plans.map(plan => {
                const isSelected = plan.id === selectedPlanId;
                const discount =
                  plan.price < maxPrice
                    ? Math.round((1 - plan.price / maxPrice) * 100)
                    : 0;
                const isSubscription = plan.interval_label !== null;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50'
                        : 'border-gray-200 bg-white hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Radio indicator */}
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 ${
                          isSelected
                            ? 'border-indigo-600'
                            : 'border-gray-300'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-indigo-600" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-medium text-gray-900 text-sm">
                            {plan.name}
                          </span>
                          {isSubscription && (
                            <span className="bg-orange-100 text-orange-700 text-xs px-2 py-0.5 rounded-full font-medium">
                              定期便
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full font-medium">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                        {plan.interval_label && (
                          <p className="text-gray-400 text-xs mt-0.5">
                            {plan.interval_label}にお届け
                          </p>
                        )}
                      </div>
                    </div>
                    <span
                      className={`font-bold text-lg ${
                        isSelected ? 'text-indigo-600' : 'text-gray-900'
                      }`}
                    >
                      ¥{plan.price.toLocaleString()}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Selected plan summary */}
          {selectedPlan && (
            <div className="bg-gray-50 rounded-xl p-4 mb-6 flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-400">選択中のプラン</p>
                <p className="font-semibold text-gray-900 text-sm">
                  {selectedPlan.name}
                </p>
              </div>
              <p className="font-bold text-indigo-600 text-2xl">
                ¥{selectedPlan.price.toLocaleString()}
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={added || !selectedPlan}
            className={`w-full py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 transition-all ${
              added
                ? 'bg-green-600 text-white'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60'
            }`}
          >
            {added ? (
              <>
                <CheckCircle className="w-5 h-5" />
                カートに追加しました
              </>
            ) : (
              <>
                <ShoppingCart className="w-5 h-5" />
                カートに追加する
              </>
            )}
          </button>
        </div>
      </div>
    </main>
  );
}
