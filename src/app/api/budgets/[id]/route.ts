import { NextResponse } from "next/server";
import { deleteBudget } from "@/lib/supabase/budgets";

export async function DELETE(_: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await deleteBudget(id);
  return NextResponse.json({ ok: true });
}
