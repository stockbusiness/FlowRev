"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CustomerList } from "./customer-list";
import { CustomerForm } from "./customer-form";
import type { Customer } from "@/types";
import type { CustomerFormValues, CustomerWithStats } from "@/types/customer";

interface CustomersClientProps {
  initialCustomers: CustomerWithStats[];
}

export function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing]   = useState<Customer | null>(null);

  function openNew()   { setEditing(null); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  function handleEdit(c: Customer) {
    setEditing(c);
    setShowForm(true);
  }

  async function handleSubmit(values: CustomerFormValues) {
    const body = {
      name:  values.name,
      email: values.email  || null,
      phone: values.phone  || null,
      notes: values.notes  || null,
    };

    if (editing) {
      const res = await fetch(`/api/customers/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("更新に失敗しました");
    } else {
      const res = await fetch("/api/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      if (!res.ok) throw new Error("登録に失敗しました");
    }

    closeForm();
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    if (!confirm("この顧客を削除しますか？\n取引に紐付いているデータは顧客なしになります。")) return;
    const res = await fetch(`/api/customers/${id}`, { method: "DELETE" });
    if (!res.ok) {
      alert("削除に失敗しました");
      return;
    }
    startTransition(() => router.refresh());
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {initialCustomers.length} 件の顧客
        </p>
        <Button onClick={openNew} size="sm">
          <Plus className="h-4 w-4" />
          新規登録
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base">
              {editing ? "顧客を編集" : "顧客を登録"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CustomerForm
              initialValues={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </CardContent>
        </Card>
      )}

      <Card className={isPending ? "opacity-60" : ""}>
        <CardContent className="p-0">
          <CustomerList
            customers={initialCustomers}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </CardContent>
      </Card>
    </div>
  );
}
