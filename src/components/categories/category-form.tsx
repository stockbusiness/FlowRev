"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { PRESET_COLORS, type CategoryFormValues } from "@/types/category";
import type { Category } from "@/types";
import { cn } from "@/lib/utils";

interface CategoryFormProps {
  initialValues?: Category;
  onSubmit: (values: CategoryFormValues) => Promise<void>;
  onCancel: () => void;
}

export function CategoryForm({ initialValues, onSubmit, onCancel }: CategoryFormProps) {
  const [name, setName]     = useState(initialValues?.name ?? "");
  const [type, setType]     = useState<CategoryFormValues["type"]>(initialValues?.type ?? "revenue");
  const [color, setColor]   = useState(initialValues?.color ?? PRESET_COLORS[0]);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;
    setLoading(true);
    setError(null);
    try {
      await onSubmit({ name: name.trim(), type, color });
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
          <Label htmlFor="name">カテゴリ名</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="例：売上"
            required
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="type">種別</Label>
          <Select
            value={type}
            onValueChange={(v) => setType(v as CategoryFormValues["type"])}
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
      </div>

      <div className="space-y-1.5">
        <Label>カラー</Label>
        <div className="flex flex-wrap gap-2">
          {PRESET_COLORS.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform hover:scale-110",
                color === c ? "border-foreground scale-110" : "border-transparent"
              )}
              style={{ backgroundColor: c }}
              aria-label={c}
            />
          ))}
          <div className="flex items-center gap-2 ml-1">
            <input
              type="color"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              className="h-7 w-7 rounded cursor-pointer border"
              title="カスタムカラー"
            />
            <span className="text-xs text-muted-foreground">{color}</span>
          </div>
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
