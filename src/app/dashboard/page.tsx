import { Suspense } from "react";
import { DollarSign, TrendingUp, Users, ArrowDown, type LucideIcon } from "lucide-react";
import { Header } from "@/components/layout/header";
import { StatsGrid } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { PeriodFilter } from "@/components/dashboard/period-filter";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  getDashboardStats,
  getMonthlyChartData,
  getExpenseChartData,
  getRecentTransactions,
} from "@/lib/supabase/dashboard";
import { getReportData } from "@/lib/supabase/reports";
import { buildDateRange } from "@/lib/report-utils";
import type { ReportPreset } from "@/types/report";

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
  return new Date(dateStr).toLocaleDateString("ja-JP", { month: "2-digit", day: "2-digit" });
}

type SearchParams = Promise<{ preset?: string; from?: string; to?: string }>;

export default async function DashboardPage({ searchParams }: { searchParams: SearchParams }) {
  const params = await searchParams;
  const preset = (params.preset ?? "this_month") as ReportPreset;
  const isFiltered = params.from && params.to;

  if (isFiltered) {
    return <FilteredDashboard preset={preset} dateFrom={params.from!} dateTo={params.to!} />;
  }

  return <DefaultDashboard />;
}

async function DefaultDashboard() {
  const [dbStats, monthlyData, expenseData, recentTransactions] = await Promise.all([
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
    { label: "月次売上", value: formatYen(dbStats.currentRevenue), change: revenueChange.label, trend: revenueChange.trend, icon: DollarSign },
    { label: "純利益",   value: formatYen(dbStats.currentProfit),  change: profitChange.label,  trend: profitChange.trend,  icon: TrendingUp },
    { label: "アクティブ顧客", value: String(dbStats.activeCustomers), change: customerChange.label, trend: customerChange.trend, icon: Users },
    { label: "費用合計", value: formatYen(dbStats.currentExpense), change: expenseChange.label, trend: expenseChange.trend === "up" ? "down" : "up", icon: ArrowDown },
  ];

  return (
    <>
      <Header title="ダッシュボード" />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">今月のサマリー</p>
          <Suspense fallback={null}>
            <PeriodFilter currentPreset="this_month" />
          </Suspense>
        </div>
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueChart data={monthlyData} />
          <ExpenseChart data={expenseData} />
        </div>
        <RecentActivity transactions={recentTransactions} />
      </main>
    </>
  );
}

async function FilteredDashboard({
  preset,
  dateFrom,
  dateTo,
}: {
  preset: ReportPreset;
  dateFrom: string;
  dateTo: string;
}) {
  const [reportData, recentTransactions] = await Promise.all([
    getReportData(dateFrom, dateTo),
    getRecentTransactions(),
  ]);

  const { summary, monthly, categories } = reportData;

  const presetLabel: Record<ReportPreset, string> = {
    this_month:    "今月",
    last_month:    "先月",
    last_3_months: "過去3ヶ月",
    last_6_months: "過去6ヶ月",
    custom:        "カスタム期間",
  };

  const stats: { label: string; value: string; icon: LucideIcon }[] = [
    { label: "売上合計",     value: formatYen(summary.revenue),          icon: DollarSign },
    { label: "費用合計",     value: formatYen(summary.expense),           icon: ArrowDown  },
    { label: "純利益",       value: formatYen(summary.profit),            icon: TrendingUp },
    { label: "取引件数",     value: `${summary.transactionCount}件`,      icon: Users      },
  ];

  const expenseChartData = categories
    .filter((c) => c.type === "expense")
    .map((c) => ({ name: c.name, color: c.color, value: c.amount }));

  return (
    <>
      <Header title="ダッシュボード" />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-3">
          <p className="text-sm text-muted-foreground">{presetLabel[preset]}のサマリー</p>
          <Suspense fallback={null}>
            <PeriodFilter currentPreset={preset} />
          </Suspense>
        </div>
        <StatsGrid stats={stats} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <RevenueChart data={monthly} />
          <ExpenseChart data={expenseChartData} />
        </div>
        <RecentActivity transactions={recentTransactions} />
      </main>
    </>
  );
}

function RecentActivity({ transactions }: { transactions: Awaited<ReturnType<typeof getRecentTransactions>> }) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">最近のアクティビティ</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <p className="text-sm text-muted-foreground py-6 text-center">取引データがありません</p>
        ) : (
          <div className="divide-y">
            {transactions.map((t) => (
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
                  <span className="text-xs text-muted-foreground">{formatDate(t.date)}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
