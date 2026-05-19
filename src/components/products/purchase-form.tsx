"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PurchaseFormValues } from "@/types/product";

interface Customer { id: string; name: string; email: string | null }

interface PurchaseFormProps {
  defaultAmount?: number;
  onSubmit: (values: PurchaseFormValues) => Promise<void>;
  onCancel: () => void;
}

function today() {
  return new Date().toISOString().slice(0, 10);
}

export function PurchaseForm({ defaultAmount, onSubmit, onCancel }: PurchaseFormProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [values, setValues] = useState<PurchaseFormValues>({
    customer_id:  "",
    amount:       defaultAmount?.toString() ?? "",
    purchased_at: today(),
    status:       "active",
    notes:        "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/customers")
      .then((r) => r.json())
      .then((data: Customer[]) => setCustomers(data))
      .catch(() => {});
  }, []);

  function set<K extends keyof PurchaseFormValues>(key: K, val: PurchaseFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!values.customer_id) { setError("顧客を選択してください"); return; }
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
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5 col-span-2">
          <Label>顧客</Label>
          <Select value={values.customer_id} onValueChange={(v) => set("customer_id", v)}>
            <SelectTrigger>
              <SelectValue placeholder="顧客を選択..." />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}{c.email ? ` (${c.email})` : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="amount">金額（円）</Label>
          <Input
            id="amount"
            type="number"
            min={0}
            value={values.amount}
            onChange={(e) => set("amount", e.target.value)}
            placeholder="0"
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="purchased_at">購入日</Label>
          <Input
            id="purchased_at"
            type="date"
            value={values.purchased_at}
            onChange={(e) => set("purchased_at", e.target.value)}
            required
          />
        </div>

        <div className="space-y-1.5">
          <Label>ステータス</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as PurchaseFormValues["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">進行中</SelectItem>
              <SelectItem value="completed">完了</SelectItem>
              <SelectItem value="cancelled">キャンセル</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="notes">メモ</Label>
          <Textarea
            id="notes"
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="備考・特記事項など"
            rows={2}
          />
        </div>
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>キャンセル</Button>
        <Button type="submit" disabled={loading}>{loading ? "保存中..." : "登録"}</Button>
      </div>
    </form>
  );
}
