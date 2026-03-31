export const dynamic = 'force-dynamic';

import { RefreshCw, Truck, Leaf, ShieldCheck } from 'lucide-react';
import { query } from '@/lib/db';
import { Product, SubscriptionPlan } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';

export default async function ProductsPage() {
  const products = await query<Product>('SELECT * FROM products ORDER BY id');

  const planRows =
    products.length > 0
      ? await query<SubscriptionPlan>(
          'SELECT * FROM subscription_plans WHERE product_id = ANY($1) ORDER BY price DESC',
          [products.map(p => p.id)]
        )
      : [];

  const plansByProduct = planRows.reduce<Record<number, SubscriptionPlan[]>>(
    (acc, plan) => {
      if (!acc[plan.product_id]) acc[plan.product_id] = [];
      acc[plan.product_id].push(plan);
      return acc;
    },
    {}
  );

  return (
    <main>
      {/* Hero */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 pt-14 pb-10">
        <p className="text-xs font-semibold tracking-widest text-primary uppercase mb-3">
          Mori Digital Atelier
        </p>
        <h1 className="font-headline text-4xl sm:text-5xl font-bold text-on-surface leading-tight mb-4">
          森が育てた、
          <br />
          定期便。
        </h1>
        <p className="text-on-surface-variant text-sm sm:text-base leading-relaxed max-w-md">
          標高1,000m超の農園・老舗茶農家・国内有機ハーブ園。
          <br />
          本物の素材を、毎月あなたの元へお届けします。
        </p>

        {/* Benefits row */}
        <div className="flex flex-wrap gap-3 mt-8">
          {[
            { icon: <RefreshCw className="w-3.5 h-3.5 text-primary" />, label: 'いつでも停止・解約' },
            { icon: <Truck className="w-3.5 h-3.5 text-primary" />, label: '送料無料' },
            { icon: <Leaf className="w-3.5 h-3.5 text-primary" />, label: '有機・無農薬素材' },
          ].map(b => (
            <span
              key={b.label}
              className="inline-flex items-center gap-1.5 bg-surface-container px-3 py-1.5 rounded-full text-xs font-medium text-on-surface-variant"
            >
              {b.icon}
              {b.label}
            </span>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="h-px bg-outline-variant/50" />
      </div>

      {/* Product grid */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        {products.length === 0 ? (
          <div className="text-center py-20 text-on-surface-variant">
            <p className="text-sm">商品が見つかりません。DBの初期化を確認してください。</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                plans={plansByProduct[product.id] ?? []}
              />
            ))}
          </div>
        )}
      </section>

      {/* Footer CTA */}
      <section className="bg-primary/5 border-t border-outline-variant/30 mt-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold text-primary mb-1">
              定期便について
            </p>
            <p className="font-headline font-semibold text-on-surface text-lg">
              申込後、いつでも停止・解約できます
            </p>
            <p className="text-on-surface-variant text-sm mt-1">
              縛りなし。次回お届けの3日前まで変更可能。
            </p>
          </div>
          <div className="flex items-center gap-1.5 text-sm text-on-surface-variant">
            <ShieldCheck className="w-4 h-4 text-primary" />
            安心のデモ申込のみ・実決済なし
          </div>
        </div>
      </section>
    </main>
  );
}
