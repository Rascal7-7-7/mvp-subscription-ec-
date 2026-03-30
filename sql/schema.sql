CREATE TABLE IF NOT EXISTS products (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(255)             NOT NULL,
  description TEXT,
  image_url   TEXT,
  created_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at  TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS subscription_plans (
  id             SERIAL PRIMARY KEY,
  product_id     INTEGER                  NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  name           VARCHAR(255)             NOT NULL,
  price          INTEGER                  NOT NULL,
  interval_label VARCHAR(100),
  created_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at     TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id            SERIAL PRIMARY KEY,
  customer_name VARCHAR(255)             NOT NULL,
  email         VARCHAR(255)             NOT NULL,
  total_amount  INTEGER                  NOT NULL,
  created_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at    TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  id         SERIAL PRIMARY KEY,
  order_id   INTEGER NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER NOT NULL REFERENCES products(id),
  plan_id    INTEGER NOT NULL REFERENCES subscription_plans(id),
  quantity   INTEGER NOT NULL DEFAULT 1,
  price      INTEGER NOT NULL
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id                 SERIAL PRIMARY KEY,
  order_id           INTEGER      NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status             VARCHAR(50)  NOT NULL DEFAULT 'active'
                       CHECK (status IN ('active', 'paused', 'canceled')),
  next_delivery_date DATE,
  created_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at         TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
