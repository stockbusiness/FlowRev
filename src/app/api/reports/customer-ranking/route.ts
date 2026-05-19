import { NextResponse, type NextRequest } from "next/server";
import { getReportData } from "@/lib/supabase/reports";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const dateFrom = searchParams.get("dateFrom") ?? "";
  const dateTo   = searchParams.get("dateTo")   ?? "";

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 });
  }

  const { customerRanking } = await getReportData(dateFrom, dateTo);
  return NextResponse.json(customerRanking);
}
