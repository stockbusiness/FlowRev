import { AlertTriangle, TrendingDown, Info } from "lucide-react";

interface AlertItem {
  type: "error" | "warning" | "info";
  message: string;
}

interface DashboardAlertsProps {
  revenue: number;
  expense: number;
  transactionCount: number;
  overBudgetCategories?: string[];
  warningBudgetCategories?: string[];
}

function computeAlerts({
  revenue, expense, transactionCount,
  overBudgetCategories = [],
  warningBudgetCategories = [],
}: DashboardAlertsProps): AlertItem[] {
  const alerts: AlertItem[] = [];

  if (transactionCount === 0) {
    alerts.push({ type: "info", message: "この期間に取引データがありません。取引を登録してください。" });
    return alerts;
  }

  if (expense > revenue) {
    alerts.push({ type: "error", message: `費用（¥${expense.toLocaleString()}）が売上（¥${revenue.toLocaleString()}）を上回っています。赤字です。` });
  } else if (revenue > 0 && expense / revenue >= 0.8) {
    const ratio = Math.round((expense / revenue) * 100);
    alerts.push({ type: "warning", message: `費用が売上の ${ratio}% に達しています。支出を見直しましょう。` });
  }

  if (overBudgetCategories.length > 0) {
    alerts.push({ type: "error", message: `予算超過: ${overBudgetCategories.join("、")}` });
  }

  if (warningBudgetCategories.length > 0) {
    alerts.push({ type: "warning", message: `予算の80%超過: ${warningBudgetCategories.join("、")}` });
  }

  if (revenue === 0 && expense > 0) {
    alerts.push({ type: "warning", message: "売上がありません。収益の登録を確認してください。" });
  }

  return alerts;
}

const styles = {
  error:   { bg: "bg-rose-50 border-rose-200",   text: "text-rose-800",   Icon: TrendingDown },
  warning: { bg: "bg-amber-50 border-amber-200",  text: "text-amber-800",  Icon: AlertTriangle },
  info:    { bg: "bg-blue-50  border-blue-200",   text: "text-blue-800",   Icon: Info },
} as const;

export function DashboardAlerts(props: DashboardAlertsProps) {
  const alerts = computeAlerts(props);
  if (alerts.length === 0) return null;

  return (
    <div className="space-y-2">
      {alerts.map((alert, i) => {
        const { bg, text, Icon } = styles[alert.type];
        return (
          <div key={i} className={`flex items-start gap-2.5 px-4 py-3 rounded-lg border ${bg}`}>
            <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${text}`} />
            <p className={`text-sm ${text}`}>{alert.message}</p>
          </div>
        );
      })}
    </div>
  );
}
