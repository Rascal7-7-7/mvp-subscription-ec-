import { NextResponse } from 'next/server';
import { getPool } from '@/lib/db';

type OrderItemInput = {
  productId: number;
  planId: number;
  quantity: number;
  price: number;
};

type CreateOrderBody = {
  customerName: string;
  email: string;
  items: OrderItemInput[];
  totalAmount: number;
};

function calcNextDeliveryDate(intervalLabel: string | null): Date | null {
  if (!intervalLabel) return null;
  const date = new Date();
  if (intervalLabel === '2週間ごと') {
    date.setDate(date.getDate() + 14);
  } else {
    // '月1回' and any other interval → 30 days
    date.setDate(date.getDate() + 30);
  }
  return date;
}

export async function POST(req: Request) {
  let body: CreateOrderBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { customerName, email, items, totalAmount } = body;

  if (!customerName?.trim() || !email?.trim() || !items?.length) {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const pool = getPool();
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    // 1. Create order
    const orderRes = await client.query<{ id: number }>(
      'INSERT INTO orders (customer_name, email, total_amount) VALUES ($1, $2, $3) RETURNING id',
      [customerName.trim(), email.trim(), totalAmount]
    );
    const orderId = orderRes.rows[0].id;

    // 2. Create order items
    for (const item of items) {
      await client.query(
        'INSERT INTO order_items (order_id, product_id, plan_id, quantity, price) VALUES ($1, $2, $3, $4, $5)',
        [orderId, item.productId, item.planId, item.quantity, item.price]
      );
    }

    // 3. Get interval_label from the first item's plan
    const planRes = await client.query<{ interval_label: string | null }>(
      'SELECT interval_label FROM subscription_plans WHERE id = $1',
      [items[0].planId]
    );
    const intervalLabel = planRes.rows[0]?.interval_label ?? null;
    const nextDeliveryDate = calcNextDeliveryDate(intervalLabel);

    // 4. Create subscription
    const subRes = await client.query<{ id: number }>(
      'INSERT INTO subscriptions (order_id, status, next_delivery_date) VALUES ($1, $2, $3) RETURNING id',
      [orderId, 'active', nextDeliveryDate]
    );
    const subscriptionId = subRes.rows[0].id;

    await client.query('COMMIT');

    return NextResponse.json({ orderId, subscriptionId }, { status: 201 });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Order creation failed:', err);
    return NextResponse.json(
      { error: 'Failed to create order' },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
