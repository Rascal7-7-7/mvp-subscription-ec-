export const dynamic = 'force-dynamic';

import { notFound } from 'next/navigation';
import { query } from '@/lib/db';
import { SubscriptionDetail } from '@/lib/types';
import { SubscriptionClient } from './_components/SubscriptionClient';

export default async function SubscriptionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

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

  if (!sub) notFound();

  return <SubscriptionClient subscription={sub} />;
}
