-- ============================================================
-- profiles
-- ============================================================
CREATE TABLE IF NOT EXISTS profiles (
  id          UUID        REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name TEXT,
  avatar_url  TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "profiles: 本人のみ参照"
  ON profiles FOR SELECT USING (auth.uid() = id);

CREATE POLICY "profiles: 本人のみ更新"
  ON profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "profiles: 本人のみ挿入"
  ON profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- サインアップ時に自動でprofileを作成するトリガー
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ============================================================
-- categories
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name       TEXT        NOT NULL,
  type       TEXT        CHECK (type IN ('revenue', 'expense')) NOT NULL,
  color      TEXT        DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "categories: 本人のみ参照"
  ON categories FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "categories: 本人のみ挿入"
  ON categories FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "categories: 本人のみ更新"
  ON categories FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "categories: 本人のみ削除"
  ON categories FOR DELETE USING (auth.uid() = user_id);

-- デフォルトカテゴリ挿入用の関数
CREATE OR REPLACE FUNCTION insert_default_categories(p_user_id UUID)
RETURNS VOID AS $$
BEGIN
  INSERT INTO categories (user_id, name, type, color) VALUES
    (p_user_id, '売上',     'revenue', '#10b981'),
    (p_user_id, '受取手数料', 'revenue', '#3b82f6'),
    (p_user_id, 'その他収入', 'revenue', '#8b5cf6'),
    (p_user_id, '人件費',   'expense', '#ef4444'),
    (p_user_id, '家賃',     'expense', '#f97316'),
    (p_user_id, '広告費',   'expense', '#eab308'),
    (p_user_id, '消耗品費', 'expense', '#6b7280'),
    (p_user_id, 'その他費用', 'expense', '#9ca3af');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================
-- customers
-- ============================================================
CREATE TABLE IF NOT EXISTS customers (
  id         UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id    UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name       TEXT        NOT NULL,
  email      TEXT,
  phone      TEXT,
  notes      TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE customers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "customers: 本人のみ参照"
  ON customers FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "customers: 本人のみ挿入"
  ON customers FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "customers: 本人のみ更新"
  ON customers FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "customers: 本人のみ削除"
  ON customers FOR DELETE USING (auth.uid() = user_id);

-- ============================================================
-- transactions
-- ============================================================
CREATE TABLE IF NOT EXISTS transactions (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type        TEXT        CHECK (type IN ('revenue', 'expense')) NOT NULL,
  amount      INTEGER     NOT NULL CHECK (amount > 0),
  description TEXT        NOT NULL,
  category_id UUID        REFERENCES categories(id) ON DELETE SET NULL,
  customer_id UUID        REFERENCES customers(id) ON DELETE SET NULL,
  date        DATE        NOT NULL,
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

CREATE INDEX IF NOT EXISTS transactions_user_id_date_idx
  ON transactions (user_id, date DESC);

CREATE INDEX IF NOT EXISTS transactions_user_id_type_idx
  ON transactions (user_id, type);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "transactions: 本人のみ参照"
  ON transactions FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "transactions: 本人のみ挿入"
  ON transactions FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "transactions: 本人のみ更新"
  ON transactions FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "transactions: 本人のみ削除"
  ON transactions FOR DELETE USING (auth.uid() = user_id);

-- updated_at 自動更新トリガー
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_customers_updated_at
  BEFORE UPDATE ON customers
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER set_transactions_updated_at
  BEFORE UPDATE ON transactions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
-- 月次合計を返す関数（p_offset=0: 当月, 1: 前月）
CREATE OR REPLACE FUNCTION get_monthly_totals(p_offset INT DEFAULT 0)
RETURNS TABLE(type TEXT, total BIGINT) AS $$
DECLARE
  v_start DATE;
  v_end   DATE;
BEGIN
  v_start := date_trunc('month', CURRENT_DATE - (p_offset || ' months')::INTERVAL)::DATE;
  v_end   := (v_start + INTERVAL '1 month')::DATE;

  RETURN QUERY
  SELECT t.type, SUM(t.amount)::BIGINT AS total
  FROM transactions t
  WHERE t.user_id = auth.uid()
    AND t.date >= v_start
    AND t.date <  v_end
  GROUP BY t.type;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- 直近6ヶ月の月次チャートデータ
CREATE OR REPLACE FUNCTION get_monthly_chart_data()
RETURNS TABLE(month TEXT, revenue BIGINT, expense BIGINT) AS $$
BEGIN
  RETURN QUERY
  SELECT
    to_char(date_trunc('month', t.date), 'MM月') AS month,
    COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'revenue'), 0)::BIGINT AS revenue,
    COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0)::BIGINT AS expense
  FROM transactions t
  WHERE t.user_id = auth.uid()
    AND t.date >= (date_trunc('month', CURRENT_DATE) - INTERVAL '5 months')::DATE
  GROUP BY date_trunc('month', t.date)
  ORDER BY date_trunc('month', t.date);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;
-- プロフィール作成時にデフォルトカテゴリを自動挿入するトリガー
CREATE OR REPLACE FUNCTION handle_new_profile()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM insert_default_categories(NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE OR REPLACE TRIGGER on_profile_created
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION handle_new_profile();
