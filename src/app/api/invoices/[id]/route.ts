import { NextResponse, type NextRequest } from "next/server";
import { updateInvoice, deleteInvoice } from "@/lib/supabase/invoices";

type Ctx = { params: Promise<{ id: string }> };

export async function PUT(request: NextRequest, { params }: Ctx) {
  const { id } = await params;
  const values  = await request.json();
  await updateInvoice(id, values);
  return NextResponse.json({ ok: true });
}

export async function DELETE(_: NextRequest, { params }: Ctx) {
  const { id } = await params;
  await deleteInvoice(id);
  return NextResponse.json({ ok: true });
}
