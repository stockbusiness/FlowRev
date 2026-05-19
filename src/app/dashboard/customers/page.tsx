import { Header } from "@/components/layout/header";
import { CustomersClient } from "@/components/customers/customers-client";
import { getCustomersWithStats } from "@/lib/supabase/customers";

export default async function CustomersPage() {
  const customers = await getCustomersWithStats();

  return (
    <>
      <Header title="顧客管理" />
      <main className="flex-1 overflow-auto p-6">
        <CustomersClient initialCustomers={customers} />
      </main>
    </>
  );
}
