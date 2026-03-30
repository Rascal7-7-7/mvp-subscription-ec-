'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CheckoutPage() {
  const { items, loaded, totalAmount, clearCart } = useCart();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  if (!loaded) return null;

  if (items.length === 0) {
    return (
      <main className="max-w-2xl mx-auto px-4 py-24 text-center">
        <p className="text-gray-500 mb-4">カートに商品がありません</p>
        <Link href="/products" className="text-indigo-600 hover:underline text-sm">
          商品一覧へ
        </Link>
      </main>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) {
      setError('名前とメールアドレスを入力してください');
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerName: form.name.trim(),
          email: form.email.trim(),
          items: items.map(item => ({
            productId: item.productId,
            planId: item.planId,
            quantity: item.quantity,
            price: item.price,
          })),
          totalAmount,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error ?? '申込に失敗しました');
      }

      const data = await res.json();
      clearCart();
      router.push(`/complete?subscriptionId=${data.subscriptionId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : '申込に失敗しました。もう一度お試しください。');
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">申込内容の確認</h1>

      {/* Order summary */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-4">申込商品</h2>
        <div className="space-y-3">
          {items.map(item => (
            <div
              key={`${item.productId}-${item.planId}`}
              className="flex justify-between items-start"
            >
              <div>
                <p className="font-medium text-gray-900 text-sm">{item.productName}</p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {item.planName} × {item.quantity}点
                </p>
              </div>
              <span className="font-semibold text-gray-900 text-sm">
                ¥{(item.price * item.quantity).toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between items-center">
          <span className="font-bold text-gray-900">合計（税込）</span>
          <span className="font-bold text-indigo-600 text-xl">
            ¥{totalAmount.toLocaleString()}
          </span>
        </div>
      </div>

      {/* Customer info form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
        <h2 className="font-semibold text-gray-900 mb-5">お客様情報</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              お名前 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
              placeholder="山田 太郎"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              メールアドレス <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
              placeholder="example@email.com"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
          </div>
        </div>

        {error && (
          <p className="text-red-500 text-sm mt-4 bg-red-50 px-4 py-2 rounded-lg">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full mt-6 bg-indigo-600 text-white py-4 rounded-xl font-semibold text-lg flex items-center justify-center gap-2 hover:bg-indigo-700 disabled:opacity-60 transition-colors"
        >
          <Lock className="w-4 h-4" />
          {submitting ? '申込処理中...' : 'このプランで申し込む'}
          {!submitting && <ArrowRight className="w-4 h-4" />}
        </button>

        <p className="text-center text-gray-400 text-xs mt-3">
          ※ これはデモ申込です。実際の決済は発生しません
        </p>
      </form>
    </main>
  );
}
