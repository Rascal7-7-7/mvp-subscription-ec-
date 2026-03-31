'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, ShoppingBag, CheckCircle, Star } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { Product, SubscriptionPlan } from '@/lib/types';

type Props = {
  product: Product;
  plans: SubscriptionPlan[];
};

export function ProductDetailClient({ product, plans }: Props) {
  const [selectedPlanId, setSelectedPlanId] = useState<number>(plans[0]?.id ?? 0);
  const [added, setAdded] = useState(false);
  const { addItem } = useCart();
  const router = useRouter();

  const selectedPlan = plans.find(p => p.id === selectedPlanId);
  const maxPrice = plans.length > 0 ? Math.max(...plans.map(p => p.price)) : 0;

  const recommendedPlanId = plans
    .filter(p => p.interval_label !== null)
    .sort((a, b) => a.price - b.price)[0]?.id;

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
    <main className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      {/* Breadcrumb */}
      <Link
        href="/products"
        className="inline-flex items-center gap-1 text-on-surface-variant hover:text-on-surface text-sm mb-8 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        ショップに戻る
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
        {/* Image */}
        <div className="relative aspect-[4/5] bg-surface-container rounded-2xl overflow-hidden">
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
          <p className="text-xs font-semibold text-primary mb-2">
            定期購入対応
          </p>
          <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface leading-snug mb-4">
            {product.name}
          </h1>
          <p className="text-on-surface-variant text-sm leading-relaxed mb-8">
            {product.description}
          </p>

          {/* Plan selection */}
          <div className="mb-6">
            <p className="text-xs font-semibold text-on-surface-variant mb-3">
              プランを選ぶ
            </p>
            <div className="space-y-2.5">
              {plans.map(plan => {
                const isSelected = plan.id === selectedPlanId;
                const isRecommended = plan.id === recommendedPlanId;
                const isSubscription = plan.interval_label !== null;
                const discount =
                  plan.price < maxPrice
                    ? Math.round((1 - plan.price / maxPrice) * 100)
                    : 0;

                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlanId(plan.id)}
                    className={`w-full flex items-center justify-between p-4 rounded-xl border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-outline-variant bg-surface-container-lowest hover:border-outline'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors ${
                          isSelected ? 'border-primary' : 'border-outline-variant'
                        }`}
                      >
                        {isSelected && (
                          <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                        )}
                      </div>

                      <div>
                        <div className="flex items-center flex-wrap gap-1.5 mb-0.5">
                          <span className="font-medium text-on-surface text-sm">
                            {plan.name}
                          </span>
                          {isRecommended && (
                            <span className="inline-flex items-center gap-0.5 bg-primary text-on-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              <Star className="w-2.5 h-2.5" />
                              おすすめ
                            </span>
                          )}
                          {isSubscription && !isRecommended && (
                            <span className="bg-secondary/10 text-secondary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              定期便
                            </span>
                          )}
                          {discount > 0 && (
                            <span className="bg-error/10 text-error text-[10px] font-semibold px-2 py-0.5 rounded-full">
                              {discount}% OFF
                            </span>
                          )}
                        </div>
                        {plan.interval_label && (
                          <p className="text-on-surface-variant text-xs">
                            {plan.interval_label}にお届け
                          </p>
                        )}
                      </div>
                    </div>

                    <span
                      className={`font-headline font-bold text-lg flex-shrink-0 ${
                        isSelected ? 'text-primary' : 'text-on-surface'
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
            <div className="bg-surface-container rounded-xl px-4 py-3 mb-6 flex justify-between items-center">
              <div>
                <p className="text-[11px] text-on-surface-variant mb-0.5">選択中</p>
                <p className="text-sm font-medium text-on-surface">{selectedPlan.name}</p>
              </div>
              <p className="font-headline font-bold text-2xl text-primary">
                ¥{selectedPlan.price.toLocaleString()}
              </p>
            </div>
          )}

          {/* CTA */}
          <button
            onClick={handleAddToCart}
            disabled={added || !selectedPlan}
            className={`w-full py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 transition-all ${
              added
                ? 'bg-secondary text-on-secondary'
                : 'bg-primary text-on-primary hover:opacity-90 disabled:opacity-50'
            }`}
          >
            {added ? (
              <>
                <CheckCircle className="w-5 h-5" />
                カートに追加しました
              </>
            ) : (
              <>
                <ShoppingBag className="w-5 h-5" />
                カートに追加する
              </>
            )}
          </button>

          <p className="text-center text-on-surface-variant text-xs mt-3">
            ※ デモ申込のみ・実際の決済は発生しません
          </p>
        </div>
      </div>
    </main>
  );
}
