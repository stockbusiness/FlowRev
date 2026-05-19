"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InvoiceList } from "./invoice-list";
import { InvoiceForm } from "./invoice-form";
import { InvoicePrintView } from "./invoice-print-view";
import type { Customer } from "@/types";
import type { Invoice, InvoiceFormValues } from "@/types/invoice";

interface InvoicesClientProps {
  initialInvoices: Invoice[];
  customers: Pick<Customer, "id" | "name">[];
}

export function InvoicesClient({ initialInvoices, customers }: InvoicesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Invoice | null>(null);
  const [printing, setPrinting]   = useState<Invoice | null>(null);

  function openNew()   { setEditing(null); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }
  function refresh()   { startTransition(() => router.refresh()); }

  async function handleSubmit(values: InvoiceFormValues) {
    if (editing) {
      await fetch(`/api/invoices/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((r) => { if (!r.ok) throw new Error("更新に失敗しました"); });
    } else {
      await fetch("/api/invoices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      }).then((r) => { if (!r.ok) throw new Error("作成に失敗しました"); });
    }
    closeForm();
    refresh();
  }

  async function handleDelete(id: string) {
    if (!confirm("この請求書を削除しますか？")) return;
    await fetch(`/api/invoices/${id}`, { method: "DELETE" });
    refresh();
  }

  async function handleMarkPaid(id: string) {
    await fetch(`/api/invoices/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "paid" }),
    });
    refresh();
  }

  const totalUnpaid = initialInvoices
    .filter((inv) => inv.status !== "paid")
    .reduce((s, inv) => s + inv.total, 0);

  return (
    <>
      {printing && (
        <InvoicePrintView invoice={printing} onClose={() => setPrinting(null)} />
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{initialInvoices.length} 件の請求書</p>
            {totalUnpaid > 0 && (
              <p className="text-xs text-amber-600 mt-0.5">未回収: ¥{totalUnpaid.toLocaleString()}</p>
            )}
          </div>
          <Button onClick={openNew} size="sm">
            <Plus className="h-4 w-4" />
            新規作成
          </Button>
        </div>

        {showForm && (
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                {editing ? "請求書を編集" : "請求書を作成"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <InvoiceForm
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
            <InvoiceList
              invoices={initialInvoices}
              onEdit={(inv) => { setEditing(inv); setShowForm(true); }}
              onDelete={handleDelete}
              onPrint={setPrinting}
              onMarkPaid={handleMarkPaid}
            />
          </CardContent>
        </Card>
      </div>
    </>
  );
}
