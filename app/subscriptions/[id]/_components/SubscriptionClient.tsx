'use client';
import Link from 'next/link';
import { useState } from 'react';
import {
  RefreshCw,
  Calendar,
  Package,
  User,
  Pause,
  X,
  ChevronLeft,
  Play,
} from 'lucide-react';
import { SubscriptionDetail } from '@/lib/types';

type StatusConfig = {
  label: string;
  textColor: string;
  bgColor: string;
};

const STATUS_CONFIG: Record<string, StatusConfig> = {
  active: {
    label: '有効',
    textColor: 'text-green-700',
    bgColor: 'bg-green-100',
  },
  paused: {
    label: '停止中',
    textColor: 'text-yellow-700',
    bgColor: 'bg-yellow-100',
  },
  canceled: {
    label: '解約',
    textColor: 'text-red-700',
    bgColor: 'bg-red-100',
  },
};

type Props = {
  subscription: SubscriptionDetail;
};

export function SubscriptionClient({ subscription: initial }: Props) {
  const [sub, setSub] = useState(initial);
  const [loading, setLoading] = useState(false);

  const statusCfg = STATUS_CONFIG[sub.status] ?? STATUS_CONFIG.active;

  const nextDelivery = sub.next_delivery_date
    ? new Date(sub.next_delivery_date).toLocaleDateString('ja-JP', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '—';

  const contractStart = new Date(sub.created_at).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const handleStatusChange = async (
    newStatus: 'active' | 'paused' | 'canceled'
  ) => {
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
    <main className="max-w-2xl mx-auto px-4 py-10">
      {/* Back + Title */}
      <div className="flex items-center gap-2 mb-8">
        <Link
          href="/products"
          className="text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="商品一覧へ"
        >
          <ChevronLeft className="w-5 h-5" />
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">定期購入の管理</h1>
      </div>

      {/* Contract status */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4 text-indigo-600" />
            <span className="font-semibold text-gray-900">契約状態</span>
          </div>
          <span
            className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-bold ${statusCfg.bgColor} ${statusCfg.textColor}`}
          >
            {statusCfg.label}
          </span>
        </div>

        <div className="space-y-3">
          <InfoRow
            icon={<Package className="w-4 h-4 text-gray-400" />}
            label="商品"
            value={sub.product_name}
          />
          <InfoRow label="プラン" value={sub.plan_name} indent />
          <InfoRow label="数量" value={`${sub.quantity}点`} indent />
          <div className="flex justify-between items-center text-sm pt-1 border-t border-gray-100">
            <span className="text-gray-500">金額</span>
            <span className="font-bold text-indigo-600 text-base">
              ¥{(sub.price * sub.quantity).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Next delivery */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-4 shadow-sm flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-gray-900 text-sm">
            次回お届け予定
          </span>
        </div>
        <span className="font-bold text-indigo-600">{nextDelivery}</span>
      </div>

      {/* Customer info */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-8 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <User className="w-4 h-4 text-indigo-600" />
          <span className="font-semibold text-gray-900">契約情報</span>
        </div>
        <div className="space-y-2.5 text-sm">
          <InfoRow label="お名前" value={sub.customer_name} />
          <InfoRow label="メールアドレス" value={sub.email} />
          <InfoRow label="契約開始日" value={contractStart} />
        </div>
      </div>

      {/* Actions */}
      {sub.status !== 'canceled' ? (
        <div className="space-y-3">
          {sub.status === 'active' ? (
            <button
              onClick={() => handleStatusChange('paused')}
              disabled={loading}
              className="w-full border border-yellow-300 text-yellow-700 bg-yellow-50 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-yellow-100 disabled:opacity-60 transition-colors"
            >
              <Pause className="w-4 h-4" />
              定期便を一時停止する
            </button>
          ) : (
            <button
              onClick={() => handleStatusChange('active')}
              disabled={loading}
              className="w-full border border-green-300 text-green-700 bg-green-50 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-green-100 disabled:opacity-60 transition-colors"
            >
              <Play className="w-4 h-4" />
              定期便を再開する
            </button>
          )}
          <button
            onClick={() => handleStatusChange('canceled')}
            disabled={loading}
            className="w-full border border-gray-200 text-gray-400 py-3 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-50 disabled:opacity-60 transition-colors text-sm"
          >
            <X className="w-4 h-4" />
            解約する
          </button>
        </div>
      ) : (
        <div className="bg-red-50 rounded-xl p-5 text-center">
          <p className="text-red-600 font-medium text-sm mb-2">
            この定期購入は解約済みです
          </p>
          <Link
            href="/products"
            className="text-indigo-600 text-sm hover:underline"
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
      <span className={`flex items-center gap-1.5 text-gray-500 ${indent ? 'pl-6' : ''}`}>
        {icon}
        {label}
      </span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );
}
