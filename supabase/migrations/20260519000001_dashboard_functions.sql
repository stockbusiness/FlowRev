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
