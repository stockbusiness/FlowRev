-- ============================================================
-- budgets テーブル
-- ============================================================
CREATE TABLE IF NOT EXISTS budgets (
  id          UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id     UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  category_id UUID        REFERENCES categories(id) ON DELETE CASCADE NOT NULL,
  month       TEXT        NOT NULL, -- YYYY-MM
  amount      INTEGER     NOT NULL CHECK (amount > 0),
  created_at  TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  UNIQUE (user_id, category_id, month)
);

ALTER TABLE budgets ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "budgets: 本人のみ参照" ON budgets;
CREATE POLICY "budgets: 本人のみ参照"
  ON budgets FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "budgets: 本人のみ挿入" ON budgets;
CREATE POLICY "budgets: 本人のみ挿入"
  ON budgets FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "budgets: 本人のみ更新" ON budgets;
CREATE POLICY "budgets: 本人のみ更新"
  ON budgets FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "budgets: 本人のみ削除" ON budgets;
CREATE POLICY "budgets: 本人のみ削除"
  ON budgets FOR DELETE USING (auth.uid() = user_id);
