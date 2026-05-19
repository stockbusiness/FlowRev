-- ============================================================
-- products（商品・講座）
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name        TEXT        NOT NULL,
  type        TEXT        CHECK (type IN ('consultation','course','community','subscription','other')) NOT NULL,
  price       INTEGER     NOT NULL DEFAULT 0,
  description TEXT,
  status      TEXT        CHECK (status IN ('active','inactive')) DEFAULT 'active' NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "products: 本人のみ参照" ON products;
CREATE POLICY "products: 本人のみ参照" ON products FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "products: 本人のみ挿入" ON products;
CREATE POLICY "products: 本人のみ挿入" ON products FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "products: 本人のみ更新" ON products;
CREATE POLICY "products: 本人のみ更新" ON products FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "products: 本人のみ削除" ON products;
CREATE POLICY "products: 本人のみ削除" ON products FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_products_updated_at ON products;
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ============================================================
-- purchases（購入記録：顧客 × 商品）
-- ============================================================
CREATE TABLE IF NOT EXISTS purchases (
  id           UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id      UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id  UUID        REFERENCES customers(id) ON DELETE CASCADE NOT NULL,
  product_id   UUID        REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  amount       INTEGER     NOT NULL DEFAULT 0,
  purchased_at DATE        NOT NULL,
  status       TEXT        CHECK (status IN ('active','cancelled','completed')) DEFAULT 'active' NOT NULL,
  notes        TEXT,
  created_at   TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE purchases ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "purchases: 本人のみ参照" ON purchases;
CREATE POLICY "purchases: 本人のみ参照" ON purchases FOR SELECT USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "purchases: 本人のみ挿入" ON purchases;
CREATE POLICY "purchases: 本人のみ挿入" ON purchases FOR INSERT WITH CHECK (auth.uid() = user_id);
DROP POLICY IF EXISTS "purchases: 本人のみ更新" ON purchases;
CREATE POLICY "purchases: 本人のみ更新" ON purchases FOR UPDATE USING (auth.uid() = user_id);
DROP POLICY IF EXISTS "purchases: 本人のみ削除" ON purchases;
CREATE POLICY "purchases: 本人のみ削除" ON purchases FOR DELETE USING (auth.uid() = user_id);
