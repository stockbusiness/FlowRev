"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { PurchaseForm } from "./purchase-form";
import type { Purchase, Product, PurchaseFormValues } from "@/types/product";

const statusConfig: Record<Purchase["status"], { label: string; variant: "default" | "secondary" | "destructive" }> = {
  active:    { label: "進行中",     variant: "default" },
  completed: { label: "完了",       variant: "secondary" },
  cancelled: { label: "キャンセル", variant: "destructive" },
};

interface PurchaseListProps {
  product: Product;
  purchases: Purchase[];
  onAdded: () => void;
}

export function PurchaseList({ product, purchases, onAdded }: PurchaseListProps) {
  const [showForm, setShowForm] = useState(false);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  async function handleAdd(values: PurchaseFormValues) {
    const res = await fetch("/api/purchases", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId: product.id, ...values }),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "エラーが発生しました");
    setShowForm(false);
    onAdded();
  }

  async function handleStatusChange(id: string, status: Purchase["status"]) {
    setUpdatingId(id);
    try {
      await fetch(`/api/purchases/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      onAdded();
    } finally {
      setUpdatingId(null);
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("この購入記録を削除しますか？")) return;
    await fetch(`/api/purchases/${id}`, { method: "DELETE" });
    onAdded();
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">購入者 {purchases.length}件</p>
        <Button size="sm" onClick={() => setShowForm(true)}>+ 購入を記録</Button>
      </div>

      {purchases.length === 0 ? (
        <p className="text-sm text-muted-foreground py-4 text-center">まだ購入記録がありません</p>
      ) : (
        <div className="divide-y border rounded-md">
          {purchases.map((p) => {
            const cfg = statusConfig[p.status];
            return (
              <div key={p.id} className="flex items-center justify-between px-4 py-3 text-sm">
                <div className="space-y-0.5">
                  <p className="font-medium">{p.customer?.name ?? "—"}</p>
                  <p className="text-muted-foreground text-xs">
                    {p.purchased_at?.slice(0, 10)} · ¥{p.amount.toLocaleString()}
                  </p>
                  {p.notes && <p className="text-muted-foreground text-xs">{p.notes}</p>}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={cfg.variant}>{cfg.label}</Badge>
                  <select
                    className="text-xs border rounded px-1 py-0.5 bg-background"
                    value={p.status}
                    disabled={updatingId === p.id}
                    onChange={(e) => handleStatusChange(p.id, e.target.value as Purchase["status"])}
                  >
                    <option value="active">進行中</option>
                    <option value="completed">完了</option>
                    <option value="cancelled">キャンセル</option>
                  </select>
                  <Button
                    size="sm"
                    variant="ghost"
                    className="text-destructive hover:text-destructive h-6 px-2"
                    onClick={() => handleDelete(p.id)}
                  >
                    削除
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>購入を記録 — {product.name}</DialogTitle>
          </DialogHeader>
          <PurchaseForm
            defaultAmount={product.price}
            onSubmit={handleAdd}
            onCancel={() => setShowForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
