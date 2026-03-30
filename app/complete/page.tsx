export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { CheckCircle, Calendar, Package, ArrowRight } from 'lucide-react';
import { query } from '@/lib/db';
import { SubscriptionDetail } from '@/lib/types';

export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{ subscriptionId?: string }>;
}) {
  const { subscriptionId } = await searchParams;

  if (!subscriptionId) {
    return <Fallback />;
  }

  const [sub] = await query<SubscriptionDetail>(
    `SELECT
       s.id, s.order_id, s.status, s.next_delivery_date, s.created_at, s.updated_at,
       p.name  AS product_name,
       sp.name AS plan_name,
       sp.price,
       oi.quantity,
       o.customer_name,
       o.email
     FROM subscriptions s
     JOIN orders o          ON s.order_id   = o.id
     JOIN order_items oi    ON oi.order_id  = o.id
     JOIN products p        ON oi.product_id = p.id
     JOIN subscription_plans sp ON oi.plan_id = sp.id
     WHERE s.id = $1
     LIMIT 1`,
    [subscriptionId]
  );

  if (!sub) return <Fallback />;

  const nextDelivery = sub.next_delivery_date
    ? new Date(sub.next_delivery_date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  return (
    <main className="max-w-2xl mx-auto px-4 py-16">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-5">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          定期購入の申込が完了しました
        </h1>
        <p className="text-gray-500 text-sm">
          {sub.customer_name} 様、ご申込ありがとうございます。
          <br />
          確認メールを {sub.email} 宛にお送りします。
        </p>
      </div>

      {/* Contract plan */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Package className="w-4 h-4 text-indigo-600" />
          ご契約プラン
        </h2>
        <div className="space-y-3">
          <Row label="商品名" value={sub.product_name} />
          <Row label="プラン" value={sub.plan_name} />
          <Row label="数量" value={`${sub.quantity}点`} />
          <div className="flex justify-between items-center pt-1 border-t border-gray-100 mt-1">
            <span className="text-sm text-gray-500">お支払い金額</span>
            <span className="font-bold text-indigo-600 text-lg">
              ¥{(sub.price * sub.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Next delivery */}
      {nextDelivery && (
        <div className="bg-indigo-50 rounded-xl p-4 mb-8 flex items-center gap-3">
          <Calendar className="w-5 h-5 text-indigo-600 flex-shrink-0" />
          <div>
            <p className="text-xs text-indigo-600 font-semibold">次回のお届け予定日</p>
            <p className="text-indigo-900 font-bold text-lg">{nextDelivery}</p>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href={`/subscriptions/${sub.id}`}
          className="w-full bg-indigo-600 text-white py-4 rounded-xl font-semibold text-center flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
        >
          定期購入の管理画面へ
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/products"
          className="w-full border border-gray-200 text-gray-600 py-4 rounded-xl font-medium text-center block hover:bg-gray-50 transition-colors"
        >
          引き続き商品を見る
        </Link>
      </div>
    </main>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className="text-gray-500">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}

function Fallback() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-gray-500 mb-4">申込情報が見つかりません</p>
      <Link href="/products" className="text-indigo-600 hover:underline text-sm">
        商品一覧へ
      </Link>
    </main>
  );
}
