import { createClient } from "./server";
import type { AnalyticsData } from "@/types/analytics";

export async function getAnalyticsData(
  dateFrom: string,
  dateTo: string
): Promise<AnalyticsData> {
  const supabase = await createClient();

  const { data: totals } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", dateFrom)
    .lte("date", dateTo);

  const revenue = totals?.filter((t) => t.type === "revenue").reduce((s, t) => s + t.amount, 0) ?? 0;
  const expense = totals?.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0) ?? 0;
  const profit = revenue - expense;

  const summary = {
    revenue,
    expense,
    profit,
    profitMargin: revenue > 0 ? Math.round((profit / revenue) * 100) : 0,
  };

  // 月次利益チャート
  const { data: monthlyRows } = await supabase
    .from("transactions")
    .select("type, amount, date")
    .gte("date", dateFrom)
    .lte("date", dateTo)
    .order("date");

  const monthlyMap = new Map<string, { revenue: number; expense: number }>();
  for (const row of monthlyRows ?? []) {
    const key = row.date.slice(0, 7);
    const prev = monthlyMap.get(key) ?? { revenue: 0, expense: 0 };
    if (row.type === "revenue") prev.revenue += row.amount;
    else prev.expense += row.amount;
    monthlyMap.set(key, prev);
  }

  const profitChart = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      month: `${parseInt(key.slice(5, 7))}月`,
      profit: val.revenue - val.expense,
    }));

  // 顧客別売上 Top 10
  const { data: custRows } = await supabase
    .from("transactions")
    .select("amount, customer:customers(id, name)")
    .eq("type", "revenue")
    .gte("date", dateFrom)
    .lte("date", dateTo)
    .not("customer_id", "is", null);

  const custMap = new Map<string, { name: string; revenue: number; count: number }>();
  for (const row of custRows ?? []) {
    const cust = Array.isArray(row.customer) ? row.customer[0] : row.customer;
    if (!cust) continue;
    const prev = custMap.get(cust.id) ?? { name: cust.name, revenue: 0, count: 0 };
    custMap.set(cust.id, {
      name: cust.name,
      revenue: prev.revenue + row.amount,
      count: prev.count + 1,
    });
  }

  const sorted = Array.from(custMap.entries())
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 10);

  const topCustomers = sorted.map(([id, c]) => ({
    customerId: id,
    customerName: c.name,
    revenue: c.revenue,
    transactionCount: c.count,
    percentage: revenue > 0 ? Math.round((c.revenue / revenue) * 100) : 0,
  }));

  return { summary, profitChart, topCustomers };
}
