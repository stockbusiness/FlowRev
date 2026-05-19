"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product, ProductFormValues } from "@/types/product";

interface ProductFormProps {
  initialValues?: Product;
  onSubmit: (values: ProductFormValues) => Promise<void>;
  onCancel: () => void;
}

function defaults(p?: Product): ProductFormValues {
  return {
    name:        p?.name        ?? "",
    type:        p?.type        ?? "course",
    price:       p?.price.toString() ?? "",
    description: p?.description ?? "",
    status:      p?.status      ?? "active",
  };
}

export function ProductForm({ initialValues, onSubmit, onCancel }: ProductFormProps) {
  const [values, setValues] = useState<ProductFormValues>(defaults(initialValues));
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState<string | null>(null);

  function set<K extends keyof ProductFormValues>(key: K, val: ProductFormValues[K]) {
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
        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="name">商品・講座名</Label>
          <Input id="name" value={values.name} onChange={(e) => set("name", e.target.value)} placeholder="例：3ヶ月コンサルプログラム" required />
        </div>

        <div className="space-y-1.5">
          <Label>種別</Label>
          <Select value={values.type} onValueChange={(v) => set("type", v as ProductFormValues["type"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="consultation">コンサル</SelectItem>
              <SelectItem value="course">講座</SelectItem>
              <SelectItem value="community">コミュニティ</SelectItem>
              <SelectItem value="subscription">サブスク・継続</SelectItem>
              <SelectItem value="other">その他</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price">価格（円）</Label>
          <Input id="price" type="number" min={0} value={values.price} onChange={(e) => set("price", e.target.value)} placeholder="0" />
        </div>

        <div className="space-y-1.5 col-span-2">
          <Label htmlFor="description">説明・メモ</Label>
          <Input id="description" value={values.description} onChange={(e) => set("description", e.target.value)} placeholder="内容・対象・期間など" />
        </div>

        <div className="space-y-1.5">
          <Label>ステータス</Label>
          <Select value={values.status} onValueChange={(v) => set("status", v as ProductFormValues["status"])}>
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="active">販売中</SelectItem>
              <SelectItem value="inactive">停止中</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {error && <p className="text-sm text-destructive bg-destructive/10 rounded px-3 py-2">{error}</p>}

      <div className="flex justify-end gap-2 pt-1">
        <Button type="button" variant="outline" onClick={onCancel} disabled={loading}>キャンセル</Button>
        <Button type="submit" disabled={loading}>{loading ? "保存中..." : initialValues ? "更新" : "登録"}</Button>
      </div>
    </form>
  );
}
