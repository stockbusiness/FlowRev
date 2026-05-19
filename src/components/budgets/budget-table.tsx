"use client";

import { useState } from "react";
import { Pencil, Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { BudgetWithActual } from "@/types/budget";

interface BudgetTableProps {
  items: BudgetWithActual[];
  onSave: (categoryId: string, amount: number) => Promise<void>;
  onDelete: (budgetId: string) => Promise<void>;
}

const statusStyle = {
  ok:      "bg-emerald-500",
  warning: "bg-amber-400",
  over:    "bg-rose-500",
} as const;

const statusLabel = {
  ok:      "",
  warning: "⚠️ 80%超",
  over:    "🔴 超過",
} as const;

export function BudgetTable({ items, onSave, onDelete }: BudgetTableProps) {
  const [editingId, setEditingId]   = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const [saving, setSaving]         = useState(false);

  function startEdit(item: BudgetWithActual) {
    setEditingId(item.category_id);
    setInputValue(item.budget_amount?.toString() ?? "");
  }

  async function handleSave(categoryId: string) {
    const amount = parseInt(inputValue, 10);
    if (!amount || amount <= 0) return;
    setSaving(true);
    await onSave(categoryId, amount);
    setSaving(false);
    setEditingId(null);
  }

  return (
    <div className="divide-y">
      {items.map((item) => (
        <div key={item.category_id} className="py-4 space-y-2">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 min-w-0">
              <span className="h-2.5 w-2.5 rounded-full shrink-0" style={{ backgroundColor: item.category_color }} />
              <span className="font-medium text-sm truncate">{item.category_name}</span>
              {item.status !== "ok" && (
                <span className="text-xs">{statusLabel[item.status]}</span>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              {editingId === item.category_id ? (
                <>
                  <Input
                    type="number"
                    min={1}
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    className="h-7 w-32 text-sm"
                    placeholder="予算額"
                    autoFocus
                    onKeyDown={(e) => e.key === "Enter" && handleSave(item.category_id)}
                  />
                  <Button size="sm" className="h-7 text-xs" disabled={saving} onClick={() => handleSave(item.category_id)}>
                    {saving ? "…" : "保存"}
                  </Button>
                  <Button size="sm" variant="ghost" className="h-7 text-xs" onClick={() => setEditingId(null)}>
                    取消
                  </Button>
                </>
              ) : (
                <>
                  <span className="text-sm text-muted-foreground">
                    ¥{item.actual_amount.toLocaleString()}
                    {item.budget_amount != null && (
                      <> / ¥{item.budget_amount.toLocaleString()}</>
                    )}
                  </span>
                  <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => startEdit(item)}>
                    {item.budget_amount != null ? <Pencil className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
                  </Button>
                  {item.budget_id && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-destructive hover:text-destructive"
                      onClick={() => onDelete(item.budget_id!)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>

          {item.budget_amount != null && (
            <div className="space-y-1">
              <div className="h-1.5 rounded-full bg-muted overflow-hidden">
                <div
                  className={cn("h-full rounded-full transition-all", statusStyle[item.status])}
                  style={{ width: `${Math.min(item.percentage, 100)}%` }}
                />
              </div>
              <p className="text-xs text-muted-foreground text-right">
                {item.percentage}% 使用（残 ¥{Math.max(0, (item.budget_amount ?? 0) - item.actual_amount).toLocaleString()}）
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
