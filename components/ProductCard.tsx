import Link from 'next/link';
import Image from 'next/image';
import { Product, SubscriptionPlan } from '@/lib/types';

type Props = {
  product: Product;
  plans: SubscriptionPlan[];
};

export function ProductCard({ product, plans }: Props) {
  const minPrice = plans.length > 0 ? Math.min(...plans.map(p => p.price)) : 0;
  const hasSubscription = plans.some(p => p.interval_label !== null);

  return (
    <Link
      href={`/products/${product.id}`}
      className="group flex flex-col bg-surface-container-lowest rounded-2xl overflow-hidden shadow-elevation-1 hover:shadow-elevation-3 transition-shadow"
    >
      {/* Image — 4/5 aspect ratio */}
      <div className="relative aspect-[4/5] bg-surface-container overflow-hidden">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {hasSubscription && (
          <span className="absolute top-3 left-3 inline-flex items-center gap-1 bg-primary/90 backdrop-blur-sm text-on-primary label-editorial px-2.5 py-1 rounded-full">
            <span className="material-symbols-outlined text-[13px]">autorenew</span>
            定期便
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-4 flex flex-col flex-1">
        <p className="label-editorial text-on-surface-variant mb-1">
          {hasSubscription ? 'SUBSCRIPTION' : 'ONE-TIME'}
        </p>
        <h2 className="font-headline font-semibold text-on-surface text-base leading-snug mb-2 line-clamp-2">
          {product.name}
        </h2>
        <p className="text-on-surface-variant text-xs leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description}
        </p>
        <div className="flex items-end justify-between mt-auto">
          <div>
            <p className="label-editorial text-on-surface-variant mb-0.5">定期便から</p>
            <p className="font-headline font-bold text-primary text-xl">
              ¥{minPrice.toLocaleString()}
              <span className="text-sm font-normal text-on-surface-variant">〜</span>
            </p>
          </div>
          <span className="flex items-center gap-0.5 text-sm font-medium text-primary group-hover:gap-1.5 transition-all">
            詳細
            <span className="material-symbols-outlined text-[18px]">arrow_forward</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
