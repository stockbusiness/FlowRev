import { ArrowDown, ArrowUp, DollarSign, Hash, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import type { ReportSummary } from "@/types/report";

interface ReportSummaryCardsProps {
  summary: ReportSummary;
}

function formatYen(n: number) {
  return `¥${Math.abs(n).toLocaleString("ja-JP")}`;
}

export function ReportSummaryCards({ summary }: ReportSummaryCardsProps) {
  const cards = [
    {
      label: "収益合計",
      value: formatYen(summary.revenue),
      icon:  DollarSign,
      color: "text-emerald-600",
      bg:    "bg-emerald-50",
    },
    {
      label: "費用合計",
      value: formatYen(summary.expense),
      icon:  ArrowDown,
      color: "text-rose-600",
      bg:    "bg-rose-50",
    },
    {
      label: "純利益",
      value: (summary.profit >= 0 ? "+" : "-") + formatYen(summary.profit),
      icon:  summary.profit >= 0 ? TrendingUp : ArrowUp,
      color: summary.profit >= 0 ? "text-primary" : "text-destructive",
      bg:    "bg-primary/10",
    },
    {
      label: "取引件数",
      value: `${summary.transactionCount} 件`,
      icon:  Hash,
      color: "text-muted-foreground",
      bg:    "bg-muted",
    },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((c) => (
        <Card key={c.label}>
          <CardContent className="p-5 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{c.label}</span>
              <div className={`h-9 w-9 rounded-lg flex items-center justify-center ${c.bg}`}>
                <c.icon className={`h-5 w-5 ${c.color}`} />
              </div>
            </div>
            <div className={`text-2xl font-bold ${c.color}`}>{c.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
