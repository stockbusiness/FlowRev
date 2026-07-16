import { NextResponse, type NextRequest } from "next/server";
import { updateProfile } from "@/lib/supabase/profile";

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const data = await updateProfile(body.displayName ?? "");
    return NextResponse.json(data);
  } catch (e) {
    return NextResponse.json({ error: (e as Error).message }, { status: 500 });
  }
}
