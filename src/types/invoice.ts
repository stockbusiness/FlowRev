export type InvoiceStatus = "draft" | "sent" | "paid";

export interface InvoiceItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  user_id: string;
  customer_id: string | null;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string | null;
  items: InvoiceItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  notes: string | null;
  created_at: string;
  updated_at: string;
  customer?: { id: string; name: string; email: string | null } | null;
}

export interface InvoiceFormValues {
  customer_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  issue_date: string;
  due_date: string;
  items: InvoiceItem[];
  tax_rate: number;
  notes: string;
}
