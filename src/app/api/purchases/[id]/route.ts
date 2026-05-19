import { NextResponse, type NextRequest } from "next/server";
import { updatePurchaseStatus, deletePurchase } from "@/lib/supabase/products";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const { status } = await req.json();
  await updatePurchaseStatus(id, status);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await deletePurchase(id);
  return NextResponse.json({ ok: true });
}
