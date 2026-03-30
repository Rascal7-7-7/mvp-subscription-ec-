import { NextResponse } from 'next/server';
import { query } from '@/lib/db';
import { SubscriptionDetail } from '@/lib/types';

const VALID_STATUSES = ['active', 'paused', 'canceled'] as const;
type SubscriptionStatus = (typeof VALID_STATUSES)[number];

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const [sub] = await query<SubscriptionDetail>(
      `SELECT
         s.id, s.order_id, s.status, s.next_delivery_date, s.created_at, s.updated_at,
         p.name  AS product_name,
         sp.name AS plan_name,
         sp.price,
         oi.quantity,
         o.customer_name,
         o.email
       FROM subscriptions s
       JOIN orders o          ON s.order_id    = o.id
       JOIN order_items oi    ON oi.order_id   = o.id
       JOIN products p        ON oi.product_id = p.id
       JOIN subscription_plans sp ON oi.plan_id = sp.id
       WHERE s.id = $1
       LIMIT 1`,
      [id]
    );

    if (!sub) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 });
    }
    return NextResponse.json(sub);
  } catch {
    return NextResponse.json(
      { error: 'Failed to fetch subscription' },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  let status: SubscriptionStatus;
  try {
    const body = await req.json();
    status = body.status;
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  if (!VALID_STATUSES.includes(status)) {
    return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
  }

  try {
    let nextDeliveryDate: Date | null = null;

    if (status === 'active') {
      // Re-calculate next delivery date based on the plan
      const [row] = await query<{ interval_label: string | null }>(
        `SELECT sp.interval_label
         FROM subscriptions s
         JOIN orders o          ON s.order_id    = o.id
         JOIN order_items oi    ON oi.order_id   = o.id
         JOIN subscription_plans sp ON oi.plan_id = sp.id
         WHERE s.id = $1
         LIMIT 1`,
        [id]
      );

      if (row?.interval_label) {
        nextDeliveryDate = new Date();
        if (row.interval_label === '2週間ごと') {
          nextDeliveryDate.setDate(nextDeliveryDate.getDate() + 14);
        } else {
          nextDeliveryDate.setDate(nextDeliveryDate.getDate() + 30);
        }
      }
    }

    await query(
      'UPDATE subscriptions SET status = $1, next_delivery_date = $2, updated_at = NOW() WHERE id = $3',
      [status, nextDeliveryDate, id]
    );

    return NextResponse.json({
      success: true,
      next_delivery_date: nextDeliveryDate,
    });
  } catch {
    return NextResponse.json(
      { error: 'Failed to update subscription' },
      { status: 500 }
    );
  }
}
