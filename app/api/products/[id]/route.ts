import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { Product, SubscriptionPlan } from '@/lib/types';

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [product] = await query<Product>(
      'SELECT * FROM products WHERE id = $1',
      [id]
    );
    if (!product) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }

    const plans = await query<SubscriptionPlan>(
      'SELECT * FROM subscription_plans WHERE product_id = $1 ORDER BY price DESC',
      [id]
    );

    return NextResponse.json({ product, plans });
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch product' },
      { status: 500 }
    );
  }
}
