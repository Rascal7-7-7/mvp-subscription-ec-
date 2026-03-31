'use client';
import Link from 'next/link';
import { useState } from 'react';
import { ArrowLeft, RefreshCw, Package, Calendar, User, Pause, Play, X, Truck } from 'lucide-react';
import { SubscriptionDetail } from '@/lib/types';

type Status = 'active' | 'paused' | 'canceled';

const STATUS_CONFIG: Record<Status, { label: string; bg: string; text: string }> = {
  active:   { label: '有効',      bg: 'bg-primary/10',  text: 'text-primary' },
  paused:   { label: '一時停止中', bg: 'bg-tertiary/10', text: 'text-tertiary' },
  canceled: { label: '解約済み',  bg: 'bg-error/10',    text: 'text-error' },
};

type Props = { subscription: SubscriptionDetail };

export function SubscriptionClient({ subscription: initial }: Props) {
  const [sub, setSub] = useState(initial);
  const [loading, setLoading] = useState(false);

  const statusCfg = STATUS_CONFIG[sub.status as Status] ?? STATUS_CONFIG.active;

  const nextDeliveryDate = sub.next_delivery_date ? new Date(sub.next_delivery_date) : null;
  const nextDeliveryLabel = nextDeliveryDate
    ? nextDeliveryDate.toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' })
    : null;
  const nextDeliveryDay = nextDeliveryDate?.getDate() ?? null;
  const nextDeliveryMonth = nextDeliveryDate
    ? nextDeliveryDate.toLocaleDateString('ja-JP', { month: 'long' })
    : null;

  const contractStart = new Date(sub.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const handleStatusChange = async (newStatus: Status) => {
    if (loading) return;
    const msg =
      newStatus === 'canceled' ? '定期購入を解約します。よろしいですか？' :
      newStatus === 'paused'   ? '定期便を一時停止します。よろしいですか？' :
                                 '定期便を再開します。よろしいですか？';
    if (!window.confirm(msg)) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/subscriptions/${sub.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setSub(prev => ({ ...prev, status: newStatus, next_delivery_date: data.next_delivery_date ?? null }));
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
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <p className="text-[10px] font-semibold text-on-surface-variant">
            定期便
          </p>
          <h1 className="font-headline text-xl font-bold text-on-surface">お申込内容の管理</h1>
        </div>
      </div>

      {/* Status card */}
      <div className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-5 mb-3 shadow-elevation-1">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-primary" />
            <p className="text-[10px] font-semibold text-on-surface-variant">
              契約状態
            </p>
          </div>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-semibold ${statusCfg.bg} ${statusCfg.text}`}>
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {statusCfg.label}
          </span>
        </div>

        <div className="space-y-2.5">
          <InfoRow icon={<Package className="w-3.5 h-3.5 text-outline" />} label="商品" value={sub.product_name} />
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
      {nextDeliveryLabel && sub.status === 'active' && (
        <div className="bg-primary text-on-primary rounded-2xl p-5 mb-3">
          <div className="flex items-center gap-1.5 mb-2">
            <Truck className="w-4 h-4 text-on-primary/70" />
            <p className="text-[10px] font-semibold text-on-primary/70">
              次回お届け予定
            </p>
          </div>
          {nextDeliveryDay && nextDeliveryMonth ? (
            <div className="flex items-end gap-2">
              <p className="font-headline font-bold text-5xl leading-none">{nextDeliveryDay}</p>
              <div className="mb-1">
                <p className="text-on-primary/70 text-sm leading-none">{nextDeliveryMonth}</p>
                <p className="text-on-primary/70 text-sm">お届け</p>
              </div>
            </div>
          ) : (
            <p className="font-semibold text-lg">{nextDeliveryLabel}</p>
          )}
        </div>
      )}

      {sub.status === 'paused' && (
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-2xl p-4 mb-3 flex items-center gap-3">
          <Pause className="w-4 h-4 text-tertiary flex-shrink-0" />
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
          <User className="w-4 h-4 text-primary" />
          <p className="text-[10px] font-semibold text-on-surface-variant">
            契約情報
          </p>
        </div>
        <div className="space-y-2.5 text-sm">
          <InfoRow label="お名前" value={sub.customer_name} />
          <InfoRow label="メール" value={sub.email} />
          <InfoRow icon={<Calendar className="w-3.5 h-3.5 text-outline" />} label="契約開始日" value={contractStart} />
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
              <Pause className="w-4 h-4" />
              定期便を一時停止する
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={loading}
              className="w-full border border-primary/40 text-primary bg-primary/5 py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-primary/10 disabled:opacity-50 transition-colors"
            >
              <Play className="w-4 h-4" />
              定期便を再開する
            </button>
          )}
          <button
            onClick={() => handleStatusChange('canceled')}
            disabled={loading}
            className="w-full border border-outline-variant text-on-surface-variant py-3.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-surface-container disabled:opacity-50 transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            解約する
          </button>
        </div>
      ) : (
        <div className="bg-error/5 border border-error/20 rounded-2xl p-5 text-center">
          <p className="text-error font-medium text-sm mb-3">この定期購入は解約済みです</p>
          <Link
            href="/products"
            className="inline-flex items-center gap-1 text-primary text-sm hover:underline"
          >
            新しい定期購入を始める →
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
  icon?: React.ReactNode;
  label: string;
  value: string;
  indent?: boolean;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <span className={`flex items-center gap-1.5 text-on-surface-variant ${indent ? 'pl-6' : ''}`}>
        {icon}
        {label}
      </span>
      <span className="font-medium text-on-surface">{value}</span>
    </div>
  );
}
