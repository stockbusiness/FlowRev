import { Header } from "@/components/layout/header";
import { InvoicesClient } from "@/components/invoices/invoices-client";
import { getInvoices } from "@/lib/supabase/invoices";
import { getCustomers } from "@/lib/supabase/customers";

export default async function InvoicesPage() {
  const [invoices, customers] = await Promise.all([getInvoices(), getCustomers()]);

  return (
    <>
      <Header title="請求書管理" />
      <main className="flex-1 overflow-auto p-6">
        <InvoicesClient initialInvoices={invoices} customers={customers} />
      </main>
    </>
  );
}
