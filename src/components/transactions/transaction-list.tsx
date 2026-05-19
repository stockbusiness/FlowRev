import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TransactionWithRelations } from "@/types";
import { Pencil, Trash2 } from "lucide-react";

interface TransactionListProps {
  transactions: TransactionWithRelations[];
  onEdit: (t: TransactionWithRelations) => void;
  onDelete: (id: string) => void;
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
  });
}

export function TransactionList({ transactions, onEdit, onDelete }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        取引データがありません
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>日付</TableHead>
          <TableHead>種別</TableHead>
          <TableHead>説明</TableHead>
          <TableHead>カテゴリ</TableHead>
          <TableHead>顧客</TableHead>
          <TableHead className="text-right">金額</TableHead>
          <TableHead className="w-20" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((t) => (
          <TableRow key={t.id}>
            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
              {formatDate(t.date)}
            </TableCell>
            <TableCell>
              <Badge variant={t.type === "revenue" ? "default" : "destructive"}>
                {t.type === "revenue" ? "収益" : "費用"}
              </Badge>
            </TableCell>
            <TableCell className="max-w-[200px] truncate">{t.description}</TableCell>
            <TableCell>
              {t.category ? (
                <span className="flex items-center gap-1.5 text-sm">
                  <span
                    className="h-2 w-2 rounded-full shrink-0"
                    style={{ backgroundColor: t.category.color }}
                  />
                  {t.category.name}
                </span>
              ) : (
                <span className="text-muted-foreground text-sm">—</span>
              )}
            </TableCell>
            <TableCell className="text-sm">
              {t.customer?.name ?? <span className="text-muted-foreground">—</span>}
            </TableCell>
            <TableCell className="text-right font-medium whitespace-nowrap">
              <span className={t.type === "revenue" ? "text-emerald-600" : "text-rose-600"}>
                {t.type === "revenue" ? "+" : "-"}¥{t.amount.toLocaleString()}
              </span>
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-1 justify-end">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={() => onEdit(t)}
                  aria-label="編集"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => onDelete(t.id)}
                  aria-label="削除"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
