import { Header } from "@/components/layout/header";
import { TransactionsClient } from "@/components/transactions/transactions-client";
import { getTransactions, getCategories, getCustomers } from "@/lib/supabase/transactions";

export default async function TransactionsPage() {
  const [transactions, categories, customers] = await Promise.all([
    getTransactions(),
    getCategories(),
    getCustomers(),
  ]);

  return (
    <>
      <Header title="取引管理" />
      <main className="flex-1 overflow-auto p-6">
        <TransactionsClient
          initialTransactions={transactions}
          categories={categories}
          customers={customers}
        />
      </main>
    </>
  );
}
