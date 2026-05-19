import { createClient } from "@/lib/supabase/server";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/dashboard";

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser();

      if (user) {
        // カテゴリが0件のユーザーにデフォルトカテゴリを挿入
        const { count } = await supabase
          .from("categories")
          .select("id", { count: "exact", head: true })
          .eq("user_id", user.id);

        if (count === 0) {
          await supabase.rpc("insert_default_categories", {
            p_user_id: user.id,
          });
        }
      }

      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/login?error=auth_callback_failed`);
}
