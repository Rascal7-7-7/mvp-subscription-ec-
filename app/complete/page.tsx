export const dynamic = 'force-dynamic';

import Link from 'next/link';
import { CheckCircle, Package, Calendar, RefreshCw, ArrowRight } from 'lucide-react';
import { query } from '@/lib/db';
import { SubscriptionDetail } from '@/lib/types';

export default async function CompletePage({
  searchParams,
}: {
  searchParams: Promise<{ subscriptionId?: string }>;
}) {
  const { subscriptionId } = await searchParams;

  if (!subscriptionId) return <Fallback />;

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

  const nextDeliveryDate = sub.next_delivery_date
    ? new Date(sub.next_delivery_date)
    : null;

  const nextDeliveryLabel = nextDeliveryDate
    ? nextDeliveryDate.toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const nextDeliveryDay = nextDeliveryDate?.getDate() ?? null;
  const nextDeliveryMonth = nextDeliveryDate
    ? nextDeliveryDate.toLocaleDateString('ja-JP', { month: 'long' })
    : null;

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      {/* Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 rounded-full mb-4">
          <CheckCircle className="w-8 h-8 text-primary" />
        </div>
        <p className="text-xs font-semibold text-primary mb-2">
          ご申込完了
        </p>
        <h1 className="font-headline text-2xl sm:text-3xl font-bold text-on-surface mb-2">
          ありがとうございます
        </h1>
        <p className="text-on-surface-variant text-sm">
          {sub.customer_name} 様のご申込を受け付けました。
          <br />
          確認メールを{' '}
          <span className="font-medium text-on-surface">{sub.email}</span>{' '}
          宛にお送りします。
        </p>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {/* Contract plan — full width */}
        <div className="col-span-2 bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 shadow-elevation-1">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-4 h-4 text-primary" />
            <p className="text-xs font-semibold text-on-surface-variant">
              ご契約プラン
            </p>
          </div>
          <div className="space-y-2.5">
            <Row label="商品名" value={sub.product_name} />
            <Row label="プラン" value={sub.plan_name} />
            <Row label="数量" value={`${sub.quantity}点`} />
            <div className="flex justify-between items-center pt-2 border-t border-outline-variant/40">
              <span className="text-sm text-on-surface-variant">お支払い金額</span>
              <span className="font-headline font-bold text-xl text-primary">
                ¥{(sub.price * sub.quantity).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Next delivery */}
        {nextDeliveryLabel && (
          <div className="col-span-2 sm:col-span-1 bg-primary text-on-primary rounded-2xl p-5">
            <div className="flex items-center gap-1.5 mb-3">
              <Calendar className="w-4 h-4 text-on-primary/70" />
              <p className="text-[11px] font-semibold text-on-primary/70">
                次回お届け予定
              </p>
            </div>
            {nextDeliveryDay && nextDeliveryMonth ? (
              <div>
                <p className="text-on-primary/70 text-sm">{nextDeliveryMonth}</p>
                <p className="font-headline font-bold text-5xl leading-none">
                  {nextDeliveryDay}
                  <span className="text-xl font-medium ml-1 text-on-primary/70">日</span>
                </p>
              </div>
            ) : (
              <p className="font-semibold text-lg">{nextDeliveryLabel}</p>
            )}
          </div>
        )}

        {/* Status */}
        <div className={`${nextDeliveryLabel ? 'col-span-2 sm:col-span-1' : 'col-span-2'} bg-surface-container rounded-2xl p-5`}>
          <div className="flex items-center gap-1.5 mb-3">
            <RefreshCw className="w-4 h-4 text-primary" />
            <p className="text-[11px] font-semibold tracking-widest text-on-surface-variant uppercase">
              ステータス
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 bg-primary/10 text-primary font-semibold text-sm px-3 py-1.5 rounded-full">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            定期便 有効
          </span>
          <p className="text-on-surface-variant text-xs mt-2 leading-relaxed">
            マイページからいつでも停止・解約できます
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3">
        <Link
          href={`/subscriptions/${sub.id}`}
          className="w-full bg-primary text-on-primary py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
        >
          定期便の管理画面へ
          <ArrowRight className="w-4 h-4" />
        </Link>
        <Link
          href="/products"
          className="w-full border border-outline-variant text-on-surface-variant py-4 rounded-xl font-medium text-base text-center block hover:bg-surface-container transition-colors"
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
      <span className="text-on-surface-variant">{label}</span>
      <span className="font-medium text-on-surface">{value}</span>
    </div>
  );
}

function Fallback() {
  return (
    <main className="max-w-2xl mx-auto px-4 py-24 text-center">
      <p className="text-on-surface-variant mb-4">申込情報が見つかりません</p>
      <Link href="/products" className="text-primary hover:underline text-sm">
        ショップへ
      </Link>
    </main>
  );
}
