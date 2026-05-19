import { createClient } from "./server";
import type { Product, Purchase, ProductFormValues, PurchaseFormValues } from "@/types/product";

// ── 商品 ────────────────────────────────────────────────────

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createProduct(values: ProductFormValues): Promise<Product> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("products")
    .insert({
      user_id:     user.id,
      name:        values.name,
      type:        values.type,
      price:       parseInt(values.price, 10) || 0,
      description: values.description || null,
      status:      values.status,
    })
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}

export async function updateProduct(id: string, values: Partial<ProductFormValues>): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase
    .from("products")
    .update({
      ...(values.name        !== undefined && { name: values.name }),
      ...(values.type        !== undefined && { type: values.type }),
      ...(values.price       !== undefined && { price: parseInt(values.price, 10) || 0 }),
      ...(values.description !== undefined && { description: values.description || null }),
      ...(values.status      !== undefined && { status: values.status }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("products").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

// ── 購入 ────────────────────────────────────────────────────

export async function getPurchasesByProduct(productId: string): Promise<Purchase[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("purchases")
    .select("*, customer:customers(id, name, email)")
    .eq("product_id", productId)
    .order("purchased_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Purchase[];
}

export async function createPurchase(productId: string, values: PurchaseFormValues): Promise<void> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("purchases").insert({
    user_id:      user.id,
    product_id:   productId,
    customer_id:  values.customer_id,
    amount:       parseInt(values.amount, 10) || 0,
    purchased_at: values.purchased_at,
    status:       values.status,
    notes:        values.notes || null,
  });
  if (error) throw new Error(error.message);
}

export async function updatePurchaseStatus(id: string, status: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("purchases").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deletePurchase(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("purchases").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
