import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ReportCategoryRow } from "@/types/report";

interface ReportCategoryTableProps {
  categories: ReportCategoryRow[];
  type: "revenue" | "expense";
}

const TYPE_LABEL = { revenue: "収益カテゴリ別", expense: "費用カテゴリ別" };

export function ReportCategoryTable({ categories, type }: ReportCategoryTableProps) {
  const rows = categories.filter((c) => c.type === type);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">{TYPE_LABEL[type]}</CardTitle>
      </CardHeader>
      <CardContent>
        {rows.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">データなし</p>
        ) : (
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.name} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="flex items-center gap-2">
                    <span
                      className="h-2.5 w-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: row.color }}
                    />
                    {row.name}
                  </span>
                  <span className="flex items-center gap-2 text-right">
                    <span className="text-muted-foreground">{row.percentage}%</span>
                    <span className="font-medium min-w-[80px] text-right">
                      ¥{row.amount.toLocaleString()}
                    </span>
                  </span>
                </div>
                <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${row.percentage}%`,
                      backgroundColor: row.color,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
