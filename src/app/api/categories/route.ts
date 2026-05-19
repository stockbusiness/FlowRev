import { NextResponse, type NextRequest } from "next/server";
import { getCategories, createCategory } from "@/lib/supabase/categories";

export async function GET() {
  try {
    const data = await getCategories();
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await createCategory(body);
    return NextResponse.json(data, { status: 201 });
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
