import { NextRequest, NextResponse } from "next/server";
import { getAnalyticsData } from "@/lib/supabase/analytics";

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const dateFrom = searchParams.get("dateFrom");
  const dateTo   = searchParams.get("dateTo");

  if (!dateFrom || !dateTo) {
    return NextResponse.json({ error: "dateFrom and dateTo are required" }, { status: 400 });
  }

  const data = await getAnalyticsData(dateFrom, dateTo);
  return NextResponse.json(data);
}
