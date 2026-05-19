import { Header } from "@/components/layout/header";
import { ArrowDown, ArrowUp, DollarSign, TrendingUp, Users } from "lucide-react";

const stats = [
  {
    label: "月次売上",
    value: "¥4,820,000",
    change: "+12.5%",
    trend: "up",
    icon: DollarSign,
  },
  {
    label: "純利益",
    value: "¥1,240,000",
    change: "+8.2%",
    trend: "up",
    icon: TrendingUp,
  },
  {
    label: "アクティブ顧客",
    value: "248",
    change: "+4.1%",
    trend: "up",
    icon: Users,
  },
  {
    label: "費用合計",
    value: "¥3,580,000",
    change: "-2.3%",
    trend: "down",
    icon: ArrowDown,
  },
];

export default function DashboardPage() {
  return (
    <>
      <Header title="ダッシュボード" />
      <main className="flex-1 overflow-auto p-6 space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-card rounded-xl border p-5 space-y-3"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">
                  {stat.label}
                </span>
                <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-5 w-5 text-primary" />
                </div>
              </div>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div
                className={`flex items-center gap-1 text-sm font-medium ${
                  stat.trend === "up"
                    ? "text-emerald-600"
                    : "text-rose-600"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUp className="h-4 w-4" />
                ) : (
                  <ArrowDown className="h-4 w-4" />
                )}
                <span>{stat.change} 先月比</span>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-base font-semibold mb-4">収益トレンド</h2>
            <div className="h-48 flex items-center justify-center text-muted-foreground text-sm">
              グラフはここに表示されます
            </div>
          </div>
          <div className="bg-card rounded-xl border p-6">
            <h2 className="text-base font-semibold mb-4">最近のアクティビティ</h2>
            <div className="space-y-3">
              {[
                { text: "新規契約：株式会社サンプル A", time: "2時間前" },
                { text: "請求書発行 #INV-0042", time: "5時間前" },
                { text: "入金確認 ¥320,000", time: "昨日" },
                { text: "費用登録：オフィス賃料", time: "昨日" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2 border-b last:border-0"
                >
                  <span className="text-sm">{item.text}</span>
                  <span className="text-xs text-muted-foreground shrink-0 ml-4">
                    {item.time}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
