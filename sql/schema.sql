CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS stores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  currency VARCHAR(3) DEFAULT 'USD',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'support', -- owner | manager | support
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  description TEXT DEFAULT '',
  category VARCHAR(100) DEFAULT 'general',
  status VARCHAR(20) DEFAULT 'draft', -- active | draft | archived
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS variants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  sku VARCHAR(100) NOT NULL,
  option_name VARCHAR(255) NOT NULL, -- e.g. "Black / M"
  price DECIMAL(12,2) NOT NULL,
  stock INT DEFAULT 0,
  UNIQUE(product_id, sku)
);

CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  orders_count INT DEFAULT 0,
  total_spent DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  number SERIAL,
  customer_id UUID REFERENCES customers(id),
  status VARCHAR(20) DEFAULT 'new', -- new | paid | fulfilled | delivered | refunded | cancelled
  payment_status VARCHAR(20) DEFAULT 'unpaid',
  total DECIMAL(14,2) DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS order_items (
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  variant_id UUID NOT NULL REFERENCES variants(id),
  qty INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  PRIMARY KEY (order_id, variant_id)
);

CREATE TABLE IF NOT EXISTS discounts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id UUID NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  code VARCHAR(50) NOT NULL,
  kind VARCHAR(10) NOT NULL CHECK (kind IN ('percent','fixed')),
  value DECIMAL(10,2) NOT NULL,
  max_uses INT DEFAULT 100,
  used_count INT DEFAULT 0,
  active BOOLEAN DEFAULT TRUE,
  UNIQUE(store_id, code)
);

-- Indexes
CREATE INDEX idx_orders_store_time ON orders(store_id, created_at DESC);
CREATE INDEX idx_orders_status ON orders(store_id, status);
CREATE INDEX idx_products_store ON products(store_id);
CREATE INDEX idx_variants_product ON variants(product_id);
CREATE INDEX idx_customers_store ON customers(store_id);

-- RLS
ALTER TABLE stores ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE discounts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "store read products" ON products FOR SELECT
  USING (store_id IN (SELECT store_id FROM users WHERE id = auth.uid()));
CREATE POLICY "store write products" ON products FOR ALL
  USING (store_id IN (SELECT store_id FROM users WHERE id = auth.uid() AND role IN ('owner','manager')));
CREATE POLICY "store read orders" ON orders FOR SELECT
  USING (store_id IN (SELECT store_id FROM users WHERE id = auth.uid()));
CREATE POLICY "store write orders" ON orders FOR ALL
  USING (store_id IN (SELECT store_id FROM users WHERE id = auth.uid()));
CREATE POLICY "store read customers" ON customers FOR SELECT
  USING (store_id IN (SELECT store_id FROM users WHERE id = auth.uid()));
CREATE POLICY "store read discounts" ON discounts FOR SELECT
  USING (store_id IN (SELECT store_id FROM users WHERE id = auth.uid()));
CREATE POLICY "store write discounts" ON discounts FOR ALL
  USING (store_id IN (SELECT store_id FROM users WHERE id = auth.uid() AND role IN ('owner','manager')));
