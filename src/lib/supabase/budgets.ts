import { createClient } from "./server";
import type { BudgetWithActual } from "@/types/budget";

export async function getBudgetsWithActual(month: string): Promise<BudgetWithActual[]> {
  const supabase = await createClient();

  const monthStart = `${month}-01`;
  const [year, m]  = month.split("-").map(Number);
  const monthEnd   = new Date(year, m, 0).toISOString().split("T")[0];

  const [{ data: categories }, { data: budgets }, { data: actuals }] = await Promise.all([
    supabase.from("categories").select("id, name, color").eq("type", "expense").order("name"),
    supabase.from("budgets").select("id, category_id, amount").eq("month", month),
    supabase
      .from("transactions")
      .select("category_id, amount")
      .eq("type", "expense")
      .gte("date", monthStart)
      .lte("date", monthEnd),
  ]);

  const budgetMap  = new Map((budgets ?? []).map((b) => [b.category_id, b]));
  const actualMap  = new Map<string, number>();
  for (const row of actuals ?? []) {
    if (!row.category_id) continue;
    actualMap.set(row.category_id, (actualMap.get(row.category_id) ?? 0) + row.amount);
  }

  return (categories ?? []).map((cat) => {
    const budget  = budgetMap.get(cat.id) ?? null;
    const actual  = actualMap.get(cat.id) ?? 0;
    const budgetAmt = budget?.amount ?? null;
    const pct = budgetAmt ? Math.round((actual / budgetAmt) * 100) : 0;

    return {
      category_id:    cat.id,
      category_name:  cat.name,
      category_color: cat.color,
      budget_id:      budget?.id ?? null,
      budget_amount:  budgetAmt,
      actual_amount:  actual,
      percentage:     pct,
      status: budgetAmt == null ? "ok" : pct >= 100 ? "over" : pct >= 80 ? "warning" : "ok",
    };
  });
}

export async function upsertBudget(categoryId: string, month: string, amount: number) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("budgets")
    .upsert(
      { user_id: user.id, category_id: categoryId, month, amount },
      { onConflict: "user_id,category_id,month" }
    );
  if (error) throw new Error(error.message);
}

export async function deleteBudget(id: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("budgets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
