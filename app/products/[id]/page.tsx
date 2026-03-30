export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { Product, SubscriptionPlan } from '@/lib/types';
import { ProductDetailClient } from './_components/ProductDetailClient';

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product] = await query<Product>(
    'SELECT * FROM products WHERE id = $1',
    [id]
  );
  if (!product) notFound();

  const plans = await query<SubscriptionPlan>(
    'SELECT * FROM subscription_plans WHERE product_id = $1 ORDER BY price DESC',
    [id]
  );

  return <ProductDetailClient product={product} plans={plans} />;
}
