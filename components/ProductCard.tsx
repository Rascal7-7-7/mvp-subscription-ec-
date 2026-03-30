import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Product, SubscriptionPlan } from '@/lib/types';

type Props = {
  product: Product;
  plans: SubscriptionPlan[];
};

export function ProductCard({ product, plans }: Props) {
  const minPrice = plans.length > 0 ? Math.min(...plans.map(p => p.price)) : 0;
  const hasSubscription = plans.some(p => p.interval_label !== null);

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-md transition-shadow flex flex-col">
      <div className="relative h-56 bg-gray-100">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {hasSubscription && (
          <span className="absolute top-3 left-3 bg-indigo-600 text-white text-xs font-semibold px-2.5 py-1 rounded-full flex items-center gap-1">
            <RefreshCw className="w-3 h-3" />
            定期便あり
          </span>
        )}
      </div>
      <div className="p-5 flex flex-col flex-1">
        <h2 className="font-semibold text-gray-900 text-lg mb-1 leading-snug">
          {product.name}
        </h2>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        <div className="flex items-center justify-between mt-auto">
          <div>
            <p className="text-xs text-gray-400">定期便から</p>
            <p className="text-indigo-600 font-bold text-lg">
              ¥{minPrice.toLocaleString()}<span className="text-sm font-medium">〜</span>
            </p>
          </div>
          <Link
            href={`/products/${product.id}`}
            className="flex items-center gap-1 bg-indigo-600 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            詳細を見る
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
