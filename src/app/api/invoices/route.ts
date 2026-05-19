import { NextResponse, type NextRequest } from "next/server";
import { getInvoices, createInvoice } from "@/lib/supabase/invoices";

export async function GET() {
  const data = await getInvoices();
  return NextResponse.json(data);
}

export async function POST(request: NextRequest) {
  const values = await request.json();
  const data = await createInvoice(values);
  return NextResponse.json(data, { status: 201 });
}
