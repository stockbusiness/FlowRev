import { DollarSign, TrendingUp, Users, ArrowDown } from "lucide-react";
import { Header } from "@/components/layout/header";
import { StatsGrid } from "@/components/dashboard/stats-cards";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import { ExpenseChart } from "@/components/dashboard/expense-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const stats = [
  { label: "月次売上",    value: "¥4,820,000", change: "+12.5%", trend: "up"   as const, icon: DollarSign },
  { label: "純利益",      value: "¥1,240,000", change: "+8.2%",  trend: "up"   as const, icon: TrendingUp },
  { label: "アクティブ顧客", value: "248",      change: "+4.1%",  trend: "up"   as const, icon: Users },
  { label: "費用合計",    value: "¥3,580,000", change: "-2.3%",  trend: "down" as const, icon: ArrowDown },
];

const monthlyData = [
  { month: "12月", revenue: 3800000, expense: 2900000 },
  { month: "1月",  revenue: 4100000, expense: 3100000 },
  { month: "2月",  revenue: 3950000, expense: 3000000 },
  { month: "3月",  revenue: 4300000, expense: 3200000 },
  { month: "4月",  revenue: 4600000, expense: 3400000 },
  { month: "5月",  revenue: 4820000, expense: 3580000 },
];

const expenseData = [
  { name: "人件費",   value: 1800000, color: "#ef4444" },
  { name: "家賃",     value: 600000,  color: "#f97316" },
  { name: "広告費",   value: 480000,  color: "#eab308" },
  { name: "消耗品費", value: 420000,  color: "#6b7280" },
  { name: "その他",   value: 280000,  color: "#9ca3af" },
];

const recentActivity = [
  { text: "新規契約：株式会社サンプル A", time: "2時間前" },
  { text: "請求書発行 #INV-0042",       time: "5時間前" },
  { text: "入金確認 ¥320,000",          time: "昨日" },
  { text: "費用登録：オフィス賃料",      time: "昨日" },
];

export default function DashboardPage() {
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
            <div className="divide-y">
              {recentActivity.map((item, i) => (
                <div key={i} className="flex items-center justify-between py-3">
                  <span className="text-sm">{item.text}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-4">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </main>
    </>
  );
}
