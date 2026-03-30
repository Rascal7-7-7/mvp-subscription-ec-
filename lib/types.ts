export type Product = {
  id: number;
  name: string;
  description: string;
  image_url: string;
  created_at: string;
  updated_at: string;
};

export type SubscriptionPlan = {
  id: number;
  product_id: number;
  name: string;
  price: number;
  interval_label: string | null;
  created_at: string;
  updated_at: string;
};

export type CartItem = {
  productId: number;
  productName: string;
  productImageUrl: string;
  planId: number;
  planName: string;
  price: number;
  quantity: number;
};

export type Order = {
  id: number;
  customer_name: string;
  email: string;
  total_amount: number;
  created_at: string;
  updated_at: string;
};

export type OrderItem = {
  id: number;
  order_id: number;
  product_id: number;
  plan_id: number;
  quantity: number;
  price: number;
};

export type Subscription = {
  id: number;
  order_id: number;
  status: 'active' | 'paused' | 'canceled';
  next_delivery_date: string | null;
  created_at: string;
  updated_at: string;
};

export type SubscriptionDetail = Subscription & {
  product_name: string;
  plan_name: string;
  price: number;
  quantity: number;
  customer_name: string;
  email: string;
};
