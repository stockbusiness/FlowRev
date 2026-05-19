import { NextResponse, type NextRequest } from "next/server";
import { createTransaction, getTransactions } from "@/lib/supabase/transactions";
import type { TransactionFilters } from "@/types/transaction";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const filters: TransactionFilters = {
      type:     (searchParams.get("type") as TransactionFilters["type"]) ?? undefined,
      dateFrom: searchParams.get("dateFrom") ?? undefined,
      dateTo:   searchParams.get("dateTo")   ?? undefined,
    };
    const data = await getTransactions(filters);
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await createTransaction(body);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
