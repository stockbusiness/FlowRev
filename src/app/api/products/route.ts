import { NextResponse, type NextRequest } from "next/server";
import { getProducts, createProduct } from "@/lib/supabase/products";

export async function GET() {
  const data = await getProducts();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  const values = await req.json();
  const data = await createProduct(values);
  return NextResponse.json(data, { status: 201 });
}
