-- 顧客ごとの取引集計ビュー
CREATE OR REPLACE VIEW customer_stats AS
SELECT
  c.id                                                          AS customer_id,
  COUNT(t.id)                                                   AS transaction_count,
  COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'revenue'), 0) AS total_revenue,
  COALESCE(SUM(t.amount) FILTER (WHERE t.type = 'expense'), 0) AS total_expense
FROM customers c
LEFT JOIN transactions t ON t.customer_id = c.id AND t.user_id = c.user_id
GROUP BY c.id;
