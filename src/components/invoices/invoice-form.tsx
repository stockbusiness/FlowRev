"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { InvoiceItemsEditor } from "./invoice-items-editor";
import type { Customer } from "@/types";
import type { Invoice, InvoiceFormValues, InvoiceItem } from "@/types/invoice";

const today = new Date().toISOString().split("T")[0];

function defaultValues(inv?: Invoice): InvoiceFormValues {
  return {
    customer_id:    inv?.customer_id ?? "",
    invoice_number: inv?.invoice_number ?? `INV-${Date.now().toString().slice(-6)}`,
    status:         inv?.status ?? "draft",
    issue_date:     inv?.issue_date ?? today,
    due_date:       inv?.due_date ?? "",
    items:          inv?.items ?? [{ description: "", quantity: 1, unit_price: 0, amount: 0 }],
    tax_rate:       inv?.tax_rate ?? 10,
    notes:          inv?.notes ?? "",
  };
}

interface InvoiceFormProps {
  customers: Pick<Customer, "id" | "name">[];
  initialValues?: Invoice;
  onSubmit: (values: InvoiceFormValues) => Promise<void>;
  onCancel: () => void;
}

export function InvoiceForm({ customers, initialValues, onSubmit, onCancel }: InvoiceFormProps) {
  const [values, setValues] = useState<InvoiceFormValues>(defaultValues(initialValues));
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function set<K extends keyof InvoiceFormValues>(key: K, val: InvoiceFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  const subtotal   = values.items.reduce((s, i) => s + i.amount, 0);
  const taxAmount  = Math.floor(subtotal * values.tax_rate / 100);
  const total      = subtotal + taxAmount;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (values.items.every((i) => !i.description)) {
      setError("品目を1件以上入力してください");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      await onSubmit(values);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label>顧客</Label>
          <Select value={values.customer_id} onValueChange={(v) => set("customer_id", v)}>
            <SelectTrigger><SelectValue placeholder="選択してください" /></SelectTrigger>
            <SelectContent>
              {customers.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>請求書番号</Label>
          <Input value={values.invoice_number} onChange={(e) => set("invoice_number", e.target.value)} required />
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="space-y-1.5">
          <Label>ステータス</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as InvoiceFormValues["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="draft">下書き</SelectItem>
              <SelectItem value="sent">送付済み</SelectItem>
              <SelectItem value="paid">入金済み</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label>発行日</Label>
          <Input type="date" value={values.issue_date} onChange={(e) => set("issue_date", e.target.value)} required />
        </div>
        <div className="space-y-1.5">
          <Label>支払期限</Label>
          <Input type="date" value={values.due_date} onChange={(e) => set("due_date", e.target.value)} />
        </div>
      </div>

      <div className="space-y-2">
        <Label>品目</Label>
        <InvoiceItemsEditor items={values.items} onChange={(items: InvoiceItem[]) => set("items", items)} />
      </div>

      <div className="flex justify-end">
        <div className="space-y-1 text-sm w-56">
          <div className="flex justify-between"><span className="text-muted-foreground">小計</span><span>¥{subtotal.toLocaleString()}</span></div>
          <div className="flex justify-between items-center gap-2">
            <span className="text-muted-foreground">消費税</span>
            <div className="flex items-center gap-1">
              <Input type="number" min={0} max={100} value={values.tax_rate} onChange={(e) => set("tax_rate", Number(e.target.value))} className="h-6 w-14 text-xs text-right px-1" />
              <span className="text-xs">%</span>
              <span className="w-24 text-right">¥{taxAmount.toLocaleString()}</span>
            </div>
          </div>
          <div className="flex justify-between font-bold border-t pt-1"><span>合計</span><span>¥{total.toLocaleString()}</span></div>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>備考</Label>
        <Input value={values.notes} onChange={(e) => set("notes", e.target.value)} placeholder="備考・振込先など" />
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{error}</p>}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>キャンセル</Button>
        <Button type="submit" disabled={loading}>{loading ? "保存中..." : initialValues ? "更新" : "作成"}</Button>
      </div>
    </form>
  );
}
