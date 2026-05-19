import { createClient } from "./server";
import type { Invoice, InvoiceFormValues } from "@/types/invoice";

export async function getInvoices(): Promise<Invoice[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("invoices")
    .select("*, customer:customers(id, name, email)")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data ?? []) as Invoice[];
}

export async function createInvoice(values: InvoiceFormValues): Promise<Invoice> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const subtotal   = values.items.reduce((s, i) => s + i.amount, 0);
  const tax_amount = Math.floor(subtotal * values.tax_rate / 100);

  const { data, error } = await supabase
    .from("invoices")
    .insert({
      user_id:        user.id,
      customer_id:    values.customer_id || null,
      invoice_number: values.invoice_number,
      status:         values.status,
      issue_date:     values.issue_date,
      due_date:       values.due_date || null,
      items:          values.items,
      subtotal,
      tax_rate:       values.tax_rate,
      tax_amount,
      total:          subtotal + tax_amount,
      notes:          values.notes || null,
    })
    .select("*, customer:customers(id, name, email)")
    .single();
  if (error) throw new Error(error.message);
  return data as Invoice;
}

export async function updateInvoice(id: string, values: Partial<InvoiceFormValues> & { status?: string }): Promise<void> {
  const supabase = await createClient();
  const subtotal   = values.items ? values.items.reduce((s, i) => s + i.amount, 0) : undefined;
  const tax_rate   = values.tax_rate;
  const tax_amount = subtotal != null && tax_rate != null ? Math.floor(subtotal * tax_rate / 100) : undefined;

  const { error } = await supabase
    .from("invoices")
    .update({
      ...(values.customer_id    !== undefined && { customer_id: values.customer_id || null }),
      ...(values.invoice_number !== undefined && { invoice_number: values.invoice_number }),
      ...(values.status         !== undefined && { status: values.status }),
      ...(values.issue_date     !== undefined && { issue_date: values.issue_date }),
      ...(values.due_date       !== undefined && { due_date: values.due_date || null }),
      ...(values.items          !== undefined && { items: values.items }),
      ...(subtotal              !== undefined && { subtotal }),
      ...(tax_rate              !== undefined && { tax_rate }),
      ...(tax_amount            !== undefined && { tax_amount }),
      ...(subtotal != null && tax_amount != null && { total: subtotal + tax_amount }),
      ...(values.notes          !== undefined && { notes: values.notes || null }),
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
}

export async function deleteInvoice(id: string): Promise<void> {
  const supabase = await createClient();
  const { error } = await supabase.from("invoices").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
