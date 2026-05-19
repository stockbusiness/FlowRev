import { createClient } from "./server";
import type { TransactionInsert, TransactionUpdate, TransactionWithRelations } from "@/types";
import type { TransactionFilters } from "@/types/transaction";
export { getCategories } from "./categories";

export async function getTransactions(
  filters?: TransactionFilters
): Promise<TransactionWithRelations[]> {
  const supabase = await createClient();

  let query = supabase
    .from("transactions")
    .select(`
      *,
      category:categories(id, name, color),
      customer:customers(id, name)
    `)
    .order("date", { ascending: false })
    .order("created_at", { ascending: false });

  if (filters?.type)     query = query.eq("type", filters.type);
  if (filters?.dateFrom) query = query.gte("date", filters.dateFrom);
  if (filters?.dateTo)   query = query.lte("date", filters.dateTo);

  const { data, error } = await query;
  if (error) throw new Error(error.message);
  return (data ?? []) as TransactionWithRelations[];
}

export async function createTransaction(values: Omit<TransactionInsert, "user_id">) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("transactions")
    .insert({ ...values, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateTransaction(id: string, values: TransactionUpdate) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("transactions")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteTransaction(id: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("transactions")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}

export async function getCustomers() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("id, name")
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}
