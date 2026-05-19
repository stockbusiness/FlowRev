"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryList } from "./category-list";
import { CategoryForm } from "./category-form";
import type { Category } from "@/types";
import type { CategoryFormValues } from "@/types/category";

interface CategoriesClientProps {
  initialCategories: Category[];
}

export function CategoriesClient({ initialCategories }: CategoriesClientProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [showForm, setShowForm]   = useState(false);
  const [editing, setEditing]     = useState<Category | null>(null);

  function openNew()   { setEditing(null); setShowForm(true); }
  function closeForm() { setShowForm(false); setEditing(null); }

  function handleEdit(c: Category) {
    setEditing(c);
    setShowForm(true);
  }

  async function handleSubmit(values: CategoryFormValues) {
    if (editing) {
      const res = await fetch(`/api/categories/${editing.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("更新に失敗しました");
    } else {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) throw new Error("登録に失敗しました");
    }
    closeForm();
    startTransition(() => router.refresh());
  }

  async function handleDelete(id: string) {
    if (!confirm("このカテゴリを削除しますか？\n取引に紐付いているデータはカテゴリなしになります。")) return;
    const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
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
          {initialCategories.length} 件のカテゴリ
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
              {editing ? "カテゴリを編集" : "カテゴリを登録"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <CategoryForm
              initialValues={editing ?? undefined}
              onSubmit={handleSubmit}
              onCancel={closeForm}
            />
          </CardContent>
        </Card>
      )}

      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-4 ${isPending ? "opacity-60" : ""}`}>
        <CategoryList
          categories={initialCategories}
          type="revenue"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        <CategoryList
          categories={initialCategories}
          type="expense"
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
