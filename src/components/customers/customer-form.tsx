"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { Customer } from "@/types";
import type { CustomerFormValues } from "@/types/customer";

interface CustomerFormProps {
  initialValues?: Customer;
  onSubmit: (values: CustomerFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CustomerForm({ initialValues, onSubmit, onCancel }: CustomerFormProps) {
  const [values, setValues] = useState<CustomerFormValues>({
    name:  initialValues?.name  ?? "",
    email: initialValues?.email ?? "",
    phone: initialValues?.phone ?? "",
    notes: initialValues?.notes ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function set<K extends keyof CustomerFormValues>(key: K, val: string) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        <div className="space-y-1.5">
          <Label htmlFor="name">顧客名 *</Label>
          <Input
            id="name"
            value={values.name}
            onChange={(e) => set("name", e.target.value)}
            placeholder="株式会社〇〇"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="email">メールアドレス</Label>
          <Input
            id="email"
            type="email"
            value={values.email}
            onChange={(e) => set("email", e.target.value)}
            placeholder="contact@example.com"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="phone">電話番号</Label>
          <Input
            id="phone"
            type="tel"
            value={values.phone}
            onChange={(e) => set("phone", e.target.value)}
            placeholder="03-0000-0000"
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="notes">備考</Label>
          <Input
            id="notes"
            value={values.notes}
            onChange={(e) => set("notes", e.target.value)}
            placeholder="メモ"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>
          キャンセル
        </Button>
        <Button type="submit" disabled={loading}>
          {loading ? "保存中..." : initialValues ? "更新" : "登録"}
        </Button>
      </div>
    </form>
  );
}
