import { NextResponse, type NextRequest } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const rows = await request.json();
  if (!Array.isArray(rows) || rows.length === 0) {
    return NextResponse.json({ error: "rows must be a non-empty array" }, { status: 400 });
  }

  const inserts = rows.map((r) => ({
    user_id:     user.id,
    type:        r.type,
    amount:      Number(r.amount),
    description: r.description,
    date:        r.date,
    category_id: r.category_id || null,
    customer_id: r.customer_id || null,
  }));

  const { error } = await supabase.from("transactions").insert(inserts);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });

  return NextResponse.json({ inserted: inserts.length });
}
