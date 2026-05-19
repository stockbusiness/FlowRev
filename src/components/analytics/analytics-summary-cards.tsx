import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Percent } from "lucide-react";
import type { AnalyticsSummary } from "@/types/analytics";

interface AnalyticsSummaryCardsProps {
  summary: AnalyticsSummary;
}

function formatYen(n: number) {
  return `¥${n.toLocaleString("ja-JP")}`;
}

export function AnalyticsSummaryCards({ summary }: AnalyticsSummaryCardsProps) {
  const items = [
    {
      label: "売上合計",
      value: formatYen(summary.revenue),
      icon: DollarSign,
      color: "text-emerald-600",
      bg: "bg-emerald-50",
    },
    {
      label: "費用合計",
      value: formatYen(summary.expense),
      icon: TrendingDown,
      color: "text-rose-600",
      bg: "bg-rose-50",
    },
    {
      label: "純利益",
      value: formatYen(summary.profit),
      icon: TrendingUp,
      color: summary.profit >= 0 ? "text-emerald-600" : "text-rose-600",
      bg: summary.profit >= 0 ? "bg-emerald-50" : "bg-rose-50",
    },
    {
      label: "利益率",
      value: `${summary.profitMargin}%`,
      icon: Percent,
      color: summary.profitMargin >= 0 ? "text-blue-600" : "text-rose-600",
      bg: "bg-blue-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="pt-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-xs text-muted-foreground">{item.label}</p>
                <p className={`text-xl font-bold mt-1 ${item.color}`}>{item.value}</p>
              </div>
              <div className={`p-2 rounded-lg ${item.bg}`}>
                <item.icon className={`h-4 w-4 ${item.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
