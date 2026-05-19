import { NextResponse, type NextRequest } from "next/server";
import { getPurchasesByProduct, createPurchase } from "@/lib/supabase/products";

export async function GET(req: NextRequest) {
  const productId = new URL(req.url).searchParams.get("productId");
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  const data = await getPurchasesByProduct(productId);
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const { productId, ...values } = await req.json();
  if (!productId) return NextResponse.json({ error: "productId required" }, { status: 400 });
  await createPurchase(productId, values);
  return NextResponse.json({ ok: true }, { status: 201 });
}
