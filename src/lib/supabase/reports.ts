import { createClient } from "./server";
import type { ReportData } from "@/types/report";

export async function getReportData(
  dateFrom: string,
  dateTo: string
): Promise<ReportData> {
  const supabase = await createClient();

  // 収益・費用合計と件数
  const { data: totals } = await supabase
    .from("transactions")
    .select("type, amount")
    .gte("date", dateFrom)
    .lte("date", dateTo);

  const revenue = totals?.filter((t) => t.type === "revenue").reduce((s, t) => s + t.amount, 0) ?? 0;
  const expense = totals?.filter((t) => t.type === "expense").reduce((s, t) => s + t.amount, 0) ?? 0;

  const summary = {
    revenue,
    expense,
    profit: revenue - expense,
    transactionCount: totals?.length ?? 0,
  };

  // カテゴリ別内訳
  const { data: catRows } = await supabase
    .from("transactions")
    .select("type, amount, category:categories(name, color)")
    .gte("date", dateFrom)
    .lte("date", dateTo);

  const catMap = new Map<string, { name: string; color: string; type: "revenue" | "expense"; amount: number }>();
  for (const row of catRows ?? []) {
    const cat = Array.isArray(row.category) ? row.category[0] : row.category;
    const key = `${row.type}::${cat?.name ?? "未分類"}`;
    const prev = catMap.get(key);
    catMap.set(key, {
      name:   cat?.name  ?? "未分類",
      color:  cat?.color ?? "#9ca3af",
      type:   row.type as "revenue" | "expense",
      amount: (prev?.amount ?? 0) + row.amount,
    });
  }

  const categories = Array.from(catMap.values()).map((c) => ({
    ...c,
    percentage: c.type === "revenue"
      ? revenue > 0 ? Math.round((c.amount / revenue) * 100) : 0
      : expense > 0 ? Math.round((c.amount / expense) * 100) : 0,
  })).sort((a, b) => b.amount - a.amount);

  // 月次チャートデータ
  const { data: monthlyRows } = await supabase
    .from("transactions")
    .select("type, amount, date")
    .gte("date", dateFrom)
    .lte("date", dateTo)
    .order("date");

  const monthlyMap = new Map<string, { revenue: number; expense: number }>();
  for (const row of monthlyRows ?? []) {
    const key = row.date.slice(0, 7); // YYYY-MM
    const prev = monthlyMap.get(key) ?? { revenue: 0, expense: 0 };
    if (row.type === "revenue") prev.revenue += row.amount;
    else prev.expense += row.amount;
    monthlyMap.set(key, prev);
  }

  const monthly = Array.from(monthlyMap.entries())
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([key, val]) => ({
      month: `${parseInt(key.slice(5, 7))}月`,
      ...val,
    }));

  // 顧客別売上ランキング Top10
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
    custMap.set(cust.id, { name: cust.name, revenue: prev.revenue + row.amount, count: prev.count + 1 });
  }

  const customerRanking = Array.from(custMap.entries())
    .sort(([, a], [, b]) => b.revenue - a.revenue)
    .slice(0, 10)
    .map(([id, c]) => ({
      customerId: id,
      customerName: c.name,
      revenue: c.revenue,
      transactionCount: c.count,
      percentage: revenue > 0 ? Math.round((c.revenue / revenue) * 100) : 0,
    }));

  return { summary, categories, monthly, customerRanking };
}
