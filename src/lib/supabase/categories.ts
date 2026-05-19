import { createClient } from "./server";
import type { Category, CategoryInsert, CategoryUpdate } from "@/types";

export async function getCategories(): Promise<Category[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .select("*")
    .order("type")
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function createCategory(
  values: Omit<CategoryInsert, "user_id">
): Promise<Category> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("categories")
    .insert({ ...values, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCategory(
  id: string,
  values: CategoryUpdate
): Promise<Category> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("categories")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("categories")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
