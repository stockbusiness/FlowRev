"use client";

import { useState, useCallback } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BudgetTable } from "./budget-table";
import type { BudgetWithActual } from "@/types/budget";

interface BudgetsClientProps {
  initialItems: BudgetWithActual[];
  initialMonth: string;
}

function formatMonthLabel(month: string) {
  const [y, m] = month.split("-");
  return `${y}年${parseInt(m)}月`;
}

function offsetMonth(month: string, delta: number): string {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + delta, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export function BudgetsClient({ initialItems, initialMonth }: BudgetsClientProps) {
  const [month, setMonth]   = useState(initialMonth);
  const [items, setItems]   = useState<BudgetWithActual[]>(initialItems);
  const [loading, setLoading] = useState(false);

  const fetchMonth = useCallback(async (m: string) => {
    setLoading(true);
    const res = await fetch(`/api/budgets?month=${m}`);
    if (res.ok) setItems(await res.json());
    setLoading(false);
  }, []);

  async function changeMonth(delta: number) {
    const next = offsetMonth(month, delta);
    setMonth(next);
    await fetchMonth(next);
  }

  async function handleSave(categoryId: string, amount: number) {
    await fetch("/api/budgets", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ category_id: categoryId, month, amount }),
    });
    await fetchMonth(month);
  }

  async function handleDelete(budgetId: string) {
    if (!confirm("この予算を削除しますか？")) return;
    await fetch(`/api/budgets/${budgetId}`, { method: "DELETE" });
    await fetchMonth(month);
  }

  const totalBudget = items.reduce((s, i) => s + (i.budget_amount ?? 0), 0);
  const totalActual = items.reduce((s, i) => s + i.actual_amount, 0);

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeMonth(-1)}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="font-medium text-sm min-w-[80px] text-center">{formatMonthLabel(month)}</span>
        <Button variant="outline" size="icon" className="h-8 w-8" onClick={() => changeMonth(1)}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {totalBudget > 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "予算合計",  value: `¥${totalBudget.toLocaleString()}` },
            { label: "支出合計",  value: `¥${totalActual.toLocaleString()}`, color: totalActual > totalBudget ? "text-rose-600" : "text-foreground" },
            { label: "残予算",    value: `¥${Math.max(0, totalBudget - totalActual).toLocaleString()}`, color: totalActual > totalBudget ? "text-rose-600" : "text-emerald-600" },
          ].map(({ label, value, color }) => (
            <Card key={label}>
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-lg font-bold mt-1 ${color ?? ""}`}>{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      <Card className={loading ? "opacity-60" : ""}>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">費用カテゴリ別予算</CardTitle>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <p className="text-sm text-muted-foreground py-6 text-center">費用カテゴリがありません</p>
          ) : (
            <BudgetTable items={items} onSave={handleSave} onDelete={handleDelete} />
          )}
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        ＋ ボタンで各カテゴリに予算を設定できます。
      </p>
    </div>
  );
}
