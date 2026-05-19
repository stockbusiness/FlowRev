import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Category, TransactionType } from "@/types";

interface CategoryListProps {
  categories: Category[];
  type: TransactionType;
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
}

const TYPE_LABEL: Record<TransactionType, string> = {
  revenue: "収益カテゴリ",
  expense: "費用カテゴリ",
};

export function CategoryList({ categories, type, onEdit, onDelete }: CategoryListProps) {
  const filtered = categories.filter((c) => c.type === type);

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          {TYPE_LABEL[type]}
          <Badge variant="secondary">{filtered.length}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground py-4 text-center">
            カテゴリがありません
          </p>
        ) : (
          <ul className="space-y-2">
            {filtered.map((c) => (
              <li
                key={c.id}
                className="flex items-center justify-between rounded-lg border px-4 py-2.5"
              >
                <span className="flex items-center gap-2.5">
                  <span
                    className="h-3 w-3 rounded-full shrink-0"
                    style={{ backgroundColor: c.color }}
                  />
                  <span className="text-sm font-medium">{c.name}</span>
                </span>
                <div className="flex items-center gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7"
                    onClick={() => onEdit(c)}
                    aria-label="編集"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-destructive hover:text-destructive"
                    onClick={() => onDelete(c.id)}
                    aria-label="削除"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}
