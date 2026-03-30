export const dynamic = 'force-dynamic';

import { query } from '@/lib/db';
import { Product, SubscriptionPlan } from '@/lib/types';
import { ProductCard } from '@/components/ProductCard';
import { RefreshCw } from 'lucide-react';

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
    <main className="max-w-6xl mx-auto px-4 py-10">
      {/* Hero */}
      <div className="mb-10">
        <div className="inline-flex items-center gap-2 bg-indigo-50 text-indigo-700 text-sm font-medium px-3 py-1.5 rounded-full mb-4">
          <RefreshCw className="w-4 h-4" />
          定期購入ECデモ
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          定期購入できる商品
        </h1>
        <p className="text-gray-500 max-w-xl">
          好きな配送サイクルを選ぶだけ。毎回自動でお届けし、定期便はいつでも一時停止・解約できます。
        </p>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p>商品が見つかりません。DBの初期化を確認してください。</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              plans={plansByProduct[product.id] ?? []}
            />
          ))}
        </div>
      )}
    </main>
  );
}
