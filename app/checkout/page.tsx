'use client';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight, AlertCircle, Check } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const STEPS = ['カートを確認', 'お客様情報', '申込完了'];

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
        <p className="text-on-surface-variant mb-4">カートに商品がありません</p>
        <Link href="/products" className="text-primary hover:underline text-sm">
          ショップへ
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
    <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8">
      {/* Step indicator */}
      <div className="flex items-center justify-center gap-0 mb-10">
        {STEPS.map((step, i) => (
          <div key={step} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  i === 1
                    ? 'bg-primary text-on-primary'
                    : i < 1
                    ? 'bg-secondary/30 text-on-surface-variant'
                    : 'bg-surface-container text-on-surface-variant'
                }`}
              >
                {i < 1 ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span
                className={`text-[10px] font-semibold tracking-wide mt-1.5 ${
                  i === 1 ? 'text-primary' : 'text-on-surface-variant'
                }`}
              >
                {step}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={`w-12 sm:w-20 h-px mx-2 mb-4 ${i < 1 ? 'bg-secondary/30' : 'bg-outline-variant'}`} />
            )}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Form */}
        <div className="lg:col-span-3">
          <form
            onSubmit={handleSubmit}
            className="bg-surface-container-lowest rounded-2xl border border-outline-variant/40 p-6 shadow-elevation-1"
          >
            <p className="text-xs font-semibold text-on-surface-variant mb-4">
              お客様情報
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">
                  お名前 <span className="text-error">*</span>
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="山田 太郎"
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm bg-surface text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-on-surface mb-1.5">
                  メールアドレス <span className="text-error">*</span>
                </label>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm(prev => ({ ...prev, email: e.target.value }))}
                  placeholder="example@email.com"
                  className="w-full border border-outline-variant rounded-xl px-4 py-3 text-sm bg-surface text-on-surface placeholder:text-on-surface-variant/40 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-colors"
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 mt-4 bg-error/8 text-error px-4 py-2.5 rounded-lg text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-6 bg-primary text-on-primary py-4 rounded-xl font-semibold text-base flex items-center justify-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
            >
              <Lock className="w-4 h-4" />
              {submitting ? '申込処理中...' : 'このプランで申し込む'}
              {!submitting && <ArrowRight className="w-4 h-4" />}
            </button>

            <p className="text-center text-on-surface-variant text-xs mt-3">
              ※ これはデモ申込です。実際の決済は発生しません
            </p>
          </form>
        </div>

        {/* Order summary */}
        <div className="lg:col-span-2">
          <div className="bg-surface-container rounded-2xl p-5 sticky top-20">
            <p className="text-xs font-semibold text-on-surface-variant mb-4">
              申込内容
            </p>

            <div className="space-y-3 mb-4">
              {items.map(item => (
                <div
                  key={`${item.productId}-${item.planId}`}
                  className="flex justify-between items-start gap-2"
                >
                  <div className="min-w-0">
                    <p className="font-medium text-on-surface text-sm truncate">
                      {item.productName}
                    </p>
                    <p className="text-[11px] text-on-surface-variant mt-0.5">
                      {item.planName} × {item.quantity}
                    </p>
                  </div>
                  <span className="font-medium text-on-surface text-sm flex-shrink-0">
                    ¥{(item.price * item.quantity).toLocaleString()}
                  </span>
                </div>
              ))}
            </div>

            <div className="border-t border-outline-variant pt-4 flex justify-between items-center">
              <span className="font-medium text-on-surface text-sm">合計（税込）</span>
              <span className="font-headline font-bold text-xl text-primary">
                ¥{totalAmount.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
