import { DollarSign, TrendingUp, Users, ArrowDown, type LucideIcon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { StatsGrid } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardStats,
  getMonthlyChartData,
  getExpenseChartData,
  getRecentTransactions,
} from "@/lib/supabase/dashboard";

function calcChange(current: number, prev: number): { label: string; trend: "up" | "down" } {
  if (prev === 0) return { label: current > 0 ? "+100%" : "0%", trend: "up" };
  const pct = ((current - prev) / prev) * 100;
  const sign = pct >= 0 ? "+" : "";
  return { label: `${sign}${pct.toFixed(1)}%`, trend: pct >= 0 ? "up" : "down" };
}

function formatYen(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    month: "2-digit", day: "2-digit",
  });
}

export default async function DashboardPage() {
  const [dbStats, monthlyData, expenseData, recentTransactions] =
    await Promise.all([
      getDashboardStats(),
      getMonthlyChartData(),
      getExpenseChartData(),
      getRecentTransactions(),
    ]);

  const revenueChange  = calcChange(dbStats.currentRevenue,  dbStats.prevRevenue);
  const profitChange   = calcChange(dbStats.currentProfit,   dbStats.prevProfit);
  const expenseChange  = calcChange(dbStats.currentExpense,  dbStats.prevExpense);
  const customerChange = calcChange(dbStats.activeCustomers, dbStats.prevCustomers);

  const stats: { label: string; value: string; change: string; trend: "up" | "down"; icon: LucideIcon }[] = [
    {
      label: "月次売上",
      value: formatYen(dbStats.currentRevenue),
      change: revenueChange.label,
      trend:  revenueChange.trend,
      icon:   DollarSign,
    },
    {
      label: "純利益",
      value: formatYen(dbStats.currentProfit),
      change: profitChange.label,
      trend:  profitChange.trend,
      icon:   TrendingUp,
    },
    {
      label: "アクティブ顧客",
      value: String(dbStats.activeCustomers),
      change: customerChange.label,
      trend:  customerChange.trend,
      icon:   Users,
    },
    {
      label: "費用合計",
      value: formatYen(dbStats.currentExpense),
      change: expenseChange.label,
      trend:  expenseChange.trend === "up" ? "down" : "up",
      icon:   ArrowDown,
    },
  ];

  return (
    <>
      <Header title="ダッシュボード" />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueChart data={monthlyData} />
          <ExpenseChart data={expenseData} />
        </div>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">最近のアクティビティ</CardTitle>
          </CardHeader>
          <CardContent>
            {recentTransactions.length === 0 ? (
              <p className="text-sm text-muted-foreground py-6 text-center">
                取引データがありません
              </p>
            ) : (
              <div className="divide-y">
                {recentTransactions.map((t) => (
                  <div key={t.id} className="flex items-center justify-between py-3 gap-4">
                    <div className="flex items-center gap-2 min-w-0">
                      <Badge variant={t.type === "revenue" ? "default" : "destructive"} className="shrink-0">
                        {t.type === "revenue" ? "収益" : "費用"}
                      </Badge>
                      <span className="text-sm truncate">{t.description}</span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className={`text-sm font-medium ${t.type === "revenue" ? "text-emerald-600" : "text-rose-600"}`}>
                        {t.type === "revenue" ? "+" : "-"}{formatYen(t.amount)}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {formatDate(t.date)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </>
  );
}
