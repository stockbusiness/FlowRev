import { createClient } from "./server";
import type { Customer, CustomerInsert } from "@/types";
import type { CustomerWithStats } from "@/types/customer";

type CustomerUpdate = {
  name?: string;
  email?: string | null;
  phone?: string | null;
  notes?: string | null;
};

export async function getCustomers(): Promise<Customer[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select("*")
    .order("name");

  if (error) throw new Error(error.message);
  return data ?? [];
}

export async function getCustomersWithStats(): Promise<CustomerWithStats[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .select(`
      *,
      stats:customer_stats!customer_stats_customer_id_fkey(
        transaction_count,
        total_revenue,
        total_expense
      )
    `)
    .order("name");

  if (error) throw new Error(error.message);

  return (data ?? []).map((row) => {
    const s = Array.isArray(row.stats) ? row.stats[0] : row.stats;
    return {
      ...row,
      transaction_count: s?.transaction_count ?? 0,
      total_revenue:     s?.total_revenue     ?? 0,
      total_expense:     s?.total_expense     ?? 0,
    } as CustomerWithStats;
  });
}

export async function createCustomer(
  values: Omit<CustomerInsert, "user_id">
): Promise<Customer> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("customers")
    .insert({ ...values, user_id: user.id })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function updateCustomer(
  id: string,
  values: CustomerUpdate
): Promise<Customer> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("customers")
    .update(values)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function deleteCustomer(id: string): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("customers")
    .delete()
    .eq("id", id);

  if (error) throw new Error(error.message);
}
