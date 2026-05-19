"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import type { Category, Customer, TransactionWithRelations } from "@/types";
import type { TransactionFormValues } from "@/types/transaction";

interface TransactionFormProps {
  categories: Category[];
  customers: Pick<Customer, "id" | "name">[];
  initialValues?: TransactionWithRelations;
  onSubmit: (values: TransactionFormValues) => Promise<void>;
  onCancel: () => void;
}

const today = new Date().toISOString().split("T")[0];

export function TransactionForm({
  categories, customers, initialValues, onSubmit, onCancel,
}: TransactionFormProps) {
  const [values, setValues] = useState<TransactionFormValues>({
    type:        initialValues?.type        ?? "revenue",
    amount:      initialValues?.amount.toString() ?? "",
    description: initialValues?.description ?? "",
    category_id: initialValues?.category_id ?? "",
    customer_id: initialValues?.customer_id ?? "",
    date:        initialValues?.date        ?? today,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  const filteredCategories = categories.filter((c) => c.type === values.type);

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

  function set<K extends keyof TransactionFormValues>(key: K, val: TransactionFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: val }));
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="type">種別</Label>
          <Select
            value={values.type}
            onValueChange={(v) => set("type", v as TransactionFormValues["type"])}
          >
            <SelectTrigger id="type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="revenue">収益</SelectItem>
              <SelectItem value="expense">費用</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="date">日付</Label>
          <Input
            id="date"
            type="date"
            value={values.date}
            onChange={(e) => set("date", e.target.value)}
            required
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">説明</Label>
        <Input
          id="description"
          value={values.description}
          onChange={(e) => set("description", e.target.value)}
          placeholder="取引の説明"
          required
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">金額（円）</Label>
        <Input
          id="amount"
          type="number"
          min={1}
          value={values.amount}
          onChange={(e) => set("amount", e.target.value)}
          placeholder="0"
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="category">カテゴリ</Label>
          <Select
            value={values.category_id}
            onValueChange={(v) => set("category_id", v)}
          >
            <SelectTrigger id="category">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {filteredCategories.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="customer">顧客</Label>
          <Select
            value={values.customer_id}
            onValueChange={(v) => set("customer_id", v)}
          >
            <SelectTrigger id="customer">
              <SelectValue placeholder="選択してください" />
            </SelectTrigger>
            <SelectContent>
              {customers.map((c) => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
