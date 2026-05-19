import { Header } from "@/components/layout/header";
import { BudgetsClient } from "@/components/budgets/budgets-client";
import { getBudgetsWithActual } from "@/lib/supabase/budgets";

function currentMonth() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}

export default async function BudgetsPage() {
  const month = currentMonth();
  const items = await getBudgetsWithActual(month);

  return (
    <>
      <Header title="予算管理" />
      <main className="flex-1 overflow-auto p-6 max-w-2xl">
        <BudgetsClient initialItems={items} initialMonth={month} />
      </main>
    </>
  );
}
