import { createClient } from "./server";
import type {
  DashboardStats,
  MonthlyChartData,
  ExpenseChartData,
  RecentTransaction,
} from "@/types/dashboard";

/** 当月・前月の収益/費用合計を取得 */
export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = await createClient();

  const { data: current } = await supabase.rpc("get_monthly_totals", {
    p_offset: 0,
  });
  const { data: prev } = await supabase.rpc("get_monthly_totals", {
    p_offset: 1,
  });

  const parse = (rows: { type: string; total: number }[] | null) => {
    const revenue = rows?.find((r) => r.type === "revenue")?.total ?? 0;
    const expense = rows?.find((r) => r.type === "expense")?.total ?? 0;
    return { revenue, expense, profit: revenue - expense };
  };

  const c = parse(current);
  const p = parse(prev);

  const { count } = await supabase
    .from("transactions")
    .select("customer_id", { count: "exact", head: true })
    .not("customer_id", "is", null);

  const { count: prevCount } = await supabase
    .from("transactions")
    .select("customer_id", { count: "exact", head: true })
    .not("customer_id", "is", null)
    .lt("date", new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split("T")[0]);

  return {
    currentRevenue:  c.revenue,
    currentExpense:  c.expense,
    currentProfit:   c.profit,
    activeCustomers: count ?? 0,
    prevRevenue:     p.revenue,
    prevExpense:     p.expense,
    prevProfit:      p.profit,
    prevCustomers:   prevCount ?? 0,
  };
}

/** 直近6ヶ月の月次収益/費用 */
export async function getMonthlyChartData(): Promise<MonthlyChartData[]> {
  const supabase = await createClient();

  const { data, error } = await supabase.rpc("get_monthly_chart_data");
  if (error || !data) return [];

  return (data as { month: string; revenue: number; expense: number }[]).map(
    (row) => ({
      month:   row.month,
      revenue: row.revenue,
      expense: row.expense,
    })
  );
}

/** 当月の費用カテゴリ内訳 */
export async function getExpenseChartData(): Promise<ExpenseChartData[]> {
  const supabase = await createClient();

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1)
    .toISOString()
    .split("T")[0];

  const { data, error } = await supabase
    .from("transactions")
    .select("amount, category:categories(name, color)")
    .eq("type", "expense")
    .gte("date", monthStart);

  if (error || !data) return [];

  const map = new Map<string, { name: string; color: string; value: number }>();
  for (const row of data) {
    const cat = Array.isArray(row.category) ? row.category[0] : row.category;
    const key  = cat?.name ?? "未分類";
    const color = cat?.color ?? "#9ca3af";
    const prev = map.get(key);
    map.set(key, { name: key, color, value: (prev?.value ?? 0) + row.amount });
  }

  return Array.from(map.values()).sort((a, b) => b.value - a.value);
}

/** 直近の取引 */
export async function getRecentTransactions(): Promise<RecentTransaction[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .select("id, description, amount, type, date, created_at")
    .order("created_at", { ascending: false })
    .limit(5);

  if (error || !data) return [];
  return data as RecentTransaction[];
}
