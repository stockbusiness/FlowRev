import { NextResponse, type NextRequest } from "next/server";
import { updateProduct, deleteProduct } from "@/lib/supabase/products";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(req: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await updateProduct(id, await req.json());
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await deleteProduct(id);
  return NextResponse.json({ ok: true });
}
