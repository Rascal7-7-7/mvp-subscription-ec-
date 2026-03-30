'use client';
import Link from 'next/link';
import { useState } from 'react';
import { SubscriptionDetail } from '@/lib/types';

type Status = 'active' | 'paused' | 'canceled';

const STATUS_CONFIG: Record<Status, { label: string; icon: string; bg: string; text: string }> = {
  active: {
    label: '有効',
    icon: 'check_circle',
    bg: 'bg-primary/10',
    text: 'text-primary',
  },
  paused: {
    label: '一時停止中',
    icon: 'pause_circle',
    bg: 'bg-tertiary/10',
    text: 'text-tertiary',
  },
  canceled: {
    label: '解約済み',
    icon: 'cancel',
    bg: 'bg-error/10',
    text: 'text-error',
  },
};

type Props = { subscription: SubscriptionDetail };

export function SubscriptionClient({ subscription: initial }: Props) {
  const [sub, setSub] = useState(initial);
  const [loading, setLoading] = useState(false);

  const statusCfg = STATUS_CONFIG[sub.status as Status] ?? STATUS_CONFIG.active;

  const nextDelivery = sub.next_delivery_date
    ? new Date(sub.next_delivery_date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : null;

  const nextDeliveryDay = sub.next_delivery_date
    ? new Date(sub.next_delivery_date).getDate()
    : null;

  const nextDeliveryMonth = sub.next_delivery_date
    ? new Date(sub.next_delivery_date).toLocaleDateString('ja-JP', { month: 'long' })
    : null;

  const contractStart = new Date(sub.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleStatusChange = async (newStatus: Status) => {
    if (loading) return;

    const confirmMsg =
      newStatus === 'canceled'
        ? '定期購入を解約します。よろしいですか？'
        : newStatus === 'paused'
        ? '定期便を一時停止します。よろしいですか？'
        : '定期便を再開します。よろしいですか？';

    if (!window.confirm(confirmMsg)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSub(prev => ({
        ...prev,
        status: newStatus,
        next_delivery_date: data.next_delivery_date ?? null,
      }));
    } catch {
      alert('操作に失敗しました。もう一度お試しください。');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 sm:px-6 py-8">
      {/* Back + title */}
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/products"
          className="text-on-surface-variant hover:text-on-surface transition-colors"
          aria-label="ショップへ"
        >
          <span className="material-symbols-outlined text-[22px]">arrow_back</span>
        </Link>
        <div>
          <p className="label-editorial text-on-surface-variant">SUBSCRIPTION</p>
          <h1 className="font-headline text-xl font-bold text-on-surface">定期便の管理</h1>
        </div>
      </div>

      {/* Status header card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 mb-3 shadow-elevation-1">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px] text-primary">autorenew</span>
            <p className="label-editorial text-on-surface-variant">契約状態</p>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${statusCfg.bg} ${statusCfg.text}`}
          >
            <span className="material-symbols-outlined text-[15px]">{statusCfg.icon}</span>
            {statusCfg.label}
          </span>
        </div>

        <div className="space-y-2.5">
          <InfoRow
            icon="inventory_2"
            label="商品"
            value={sub.product_name}
          />
          <InfoRow label="プラン" value={sub.plan_name} indent />
          <InfoRow label="数量" value={`${sub.quantity}点`} indent />
          <div className="flex justify-between items-center text-sm pt-2 border-t border-outline-variant/40">
            <span className="text-on-surface-variant">お支払い金額</span>
            <span className="font-headline font-bold text-lg text-primary">
              ¥{(sub.price * sub.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Next delivery */}
      {nextDelivery && sub.status === 'active' && (
        <div className="bg-primary text-on-primary rounded-2xl p-5 mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="material-symbols-outlined text-[18px] text-on-primary/70">
              local_shipping
            </span>
            <p className="label-editorial text-on-primary/70">次回お届け予定</p>
          </div>
          {nextDeliveryDay && nextDeliveryMonth ? (
            <div className="flex items-end gap-2">
              <p className="font-headline font-bold text-5xl leading-none">
                {nextDeliveryDay}
              </p>
              <div className="mb-1">
                <p className="text-on-primary/70 text-sm leading-none">{nextDeliveryMonth}</p>
                <p className="text-on-primary/70 text-sm">お届け</p>
              </div>
            </div>
          ) : (
            <p className="font-semibold text-lg">{nextDelivery}</p>
          )}
        </div>
      )}

      {sub.status === 'paused' && (
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-2xl p-4 mb-3 flex items-center gap-3">
          <span className="material-symbols-outlined text-[20px] text-tertiary">pause_circle</span>
          <div>
            <p className="text-sm font-medium text-on-surface">定期便を一時停止中です</p>
            <p className="text-xs text-on-surface-variant mt-0.5">
              再開するといつでも配送を再スタートできます
            </p>
          </div>
        </div>
      )}

      {/* Customer info */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 mb-6 shadow-elevation-1">
        <div className="flex items-center gap-2 mb-4">
          <span className="material-symbols-outlined text-[18px] text-primary">person</span>
          <p className="label-editorial text-on-surface-variant">契約情報</p>
        </div>
        <div className="space-y-2.5 text-sm">
          <InfoRow label="お名前" value={sub.customer_name} />
          <InfoRow label="メール" value={sub.email} />
          <InfoRow label="契約開始日" value={contractStart} />
        </div>
      </div>

      {/* Actions */}
      {sub.status !== 'canceled' ? (
        <div className="space-y-2.5">
          {sub.status === 'active' ? (
            <button
              onClick={() => handleStatusChange('paused')}
              disabled={loading}
              className="w-full border border-tertiary/40 text-tertiary bg-tertiary/5 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-tertiary/10 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">pause</span>
              定期便を一時停止する
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={loading}
              className="w-full border border-primary/40 text-primary bg-primary/5 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/10 disabled:opacity-50 transition-colors"
            >
              <span className="material-symbols-outlined text-[18px]">play_arrow</span>
              定期便を再開する
            </button>
          )}
          <button
            onClick={() => handleStatusChange('canceled')}
            disabled={loading}
            className="w-full border border-outline-variant text-on-surface-variant py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-surface-container disabled:opacity-50 transition-colors text-sm"
          >
            <span className="material-symbols-outlined text-[17px]">close</span>
            解約する
          </button>
        </div>
      ) : (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-5 text-center">
          <span className="material-symbols-outlined text-3xl text-error/50 block mb-2">cancel</span>
          <p className="text-error font-medium text-sm mb-3">この定期購入は解約済みです</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
          >
            新しい定期購入を始める
            <span className="material-symbols-outlined text-[16px]">arrow_forward</span>
          </Link>
        </div>
      )}
    </main>
  );
}

function InfoRow({
  icon,
  label,
  value,
  indent = false,
}: {
  icon?: string;
  label: string;
  value: string;
  indent?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={`flex items-center gap-1.5 text-on-surface-variant ${indent ? 'pl-6' : ''}`}>
        {icon && (
          <span className="material-symbols-outlined text-[15px] text-outline">{icon}</span>
        )}
        {label}
      </span>
      <span className="font-medium text-on-surface">{value}</span>
    </div>
  );
}
