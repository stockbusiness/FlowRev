-- ============================================================
-- invoices テーブル（line items は JSONB で管理）
-- ============================================================
CREATE TABLE IF NOT EXISTS invoices (
  id             UUID        DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id        UUID        REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  customer_id    UUID        REFERENCES customers(id) ON DELETE SET NULL,
  invoice_number TEXT        NOT NULL,
  status         TEXT        CHECK (status IN ('draft', 'sent', 'paid')) DEFAULT 'draft' NOT NULL,
  issue_date     DATE        NOT NULL,
  due_date       DATE,
  items          JSONB       NOT NULL DEFAULT '[]',
  subtotal       INTEGER     NOT NULL DEFAULT 0,
  tax_rate       INTEGER     NOT NULL DEFAULT 10,
  tax_amount     INTEGER     NOT NULL DEFAULT 0,
  total          INTEGER     NOT NULL DEFAULT 0,
  notes          TEXT,
  created_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL,
  updated_at     TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "invoices: 本人のみ参照" ON invoices;
CREATE POLICY "invoices: 本人のみ参照"
  ON invoices FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "invoices: 本人のみ挿入" ON invoices;
CREATE POLICY "invoices: 本人のみ挿入"
  ON invoices FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "invoices: 本人のみ更新" ON invoices;
CREATE POLICY "invoices: 本人のみ更新"
  ON invoices FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "invoices: 本人のみ削除" ON invoices;
CREATE POLICY "invoices: 本人のみ削除"
  ON invoices FOR DELETE USING (auth.uid() = user_id);

DROP TRIGGER IF EXISTS set_invoices_updated_at ON invoices;
CREATE TRIGGER set_invoices_updated_at
  BEFORE UPDATE ON invoices
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();
