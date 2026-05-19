import { NextResponse, type NextRequest } from "next/server";
import { getBudgetsWithActual, upsertBudget } from "@/lib/supabase/budgets";

export async function GET(request: NextRequest) {
  const month = new URL(request.url).searchParams.get("month");
  if (!month) return NextResponse.json({ error: "month is required" }, { status: 400 });
  const data = await getBudgetsWithActual(month);
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const { category_id, month, amount } = await request.json();
  if (!category_id || !month || !amount) {
    return NextResponse.json({ error: "category_id, month, amount are required" }, { status: 400 });
  }
  await upsertBudget(category_id, month, Number(amount));
  return NextResponse.json({ ok: true });
}
