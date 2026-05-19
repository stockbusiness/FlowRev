"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionList } from "./transaction-list";
import { TransactionForm } from "./transaction-form";
import type { Category, Customer, TransactionWithRelations } from "@/types";
import type { TransactionFormValues } from "@/types/transaction";

interface TransactionsClientProps {
  initialTransactions: TransactionWithRelations[];
  categories: Category[];
  customers: Pick<Customer, "id" | "name">[];
}

export function TransactionsClient({
  initialTransactions, categories, customers,
}: TransactionsClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<TransactionWithRelations | null>(null);

  function openNew()  { setEditing(null); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  function handleEdit(t: TransactionWithRelations) {
    setEditing(t);
    setShowForm(true);
  }

  async function handleSubmit(values: TransactionFormValues) {
    const body = {
      ...values,
      amount:      parseInt(values.amount, 10),
      category_id: values.category_id || null,
      customer_id: values.customer_id || null,
    };

    if (editing) {
      await fetch(`/api/transactions/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => { if (!r.ok) throw new Error("更新に失敗しました"); });
    } else {
      await fetch("/api/transactions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      }).then((r) => { if (!r.ok) throw new Error("登録に失敗しました"); });
    }

    closeForm();
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    if (!confirm("この取引を削除しますか？")) return;

    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm text-muted-foreground">
          {initialTransactions.length} 件の取引
        </h2>
        <Button onClick={openNew} size="sm">
          <Plus className="h-4 w-4" />
          新規登録
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {editing ? "取引を編集" : "取引を登録"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm
              categories={categories}
              customers={customers}
              initialValues={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </CardContent>
        </Card>
      )}

      <Card className={isPending ? "opacity-60" : ""}>
        <CardContent className="p-0">
          <TransactionList
            transactions={initialTransactions}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
