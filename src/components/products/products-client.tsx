"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProductForm } from "./product-form";
import { ProductTypeBadge } from "./product-type-badge";
import { PurchaseList } from "./purchase-list";
import type { Product, Purchase, ProductFormValues } from "@/types/product";

interface ProductsClientProps {
  initialProducts: Product[];
}

export function ProductsClient({ initialProducts }: ProductsClientProps) {
  const [products, setProducts]           = useState<Product[]>(initialProducts);
  const [showForm, setShowForm]           = useState(false);
  const [editing, setEditing]             = useState<Product | null>(null);
  const [expanded, setExpanded]           = useState<string | null>(null);
  const [purchases, setPurchases]         = useState<Record<string, Purchase[]>>({});
  const [loadingPurchases, setLoadingPurchases] = useState<string | null>(null);

  async function refreshProducts() {
    const res = await fetch("/api/products");
    if (res.ok) setProducts(await res.json());
  }

  const loadPurchases = useCallback(async (productId: string) => {
    setLoadingPurchases(productId);
    try {
      const res = await fetch(`/api/purchases?productId=${productId}`);
      if (res.ok) {
        const data: Purchase[] = await res.json();
        setPurchases((prev) => ({ ...prev, [productId]: data }));
      }
    } finally {
      setLoadingPurchases(null);
    }
  }, []);

  function toggleExpand(productId: string) {
    if (expanded === productId) {
      setExpanded(null);
    } else {
      setExpanded(productId);
      if (!purchases[productId]) loadPurchases(productId);
    }
  }

  async function handleCreate(values: ProductFormValues) {
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "エラーが発生しました");
    setShowForm(false);
    await refreshProducts();
  }

  async function handleUpdate(values: ProductFormValues) {
    if (!editing) return;
    const res = await fetch(`/api/products/${editing.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    if (!res.ok) throw new Error((await res.json()).error ?? "エラーが発生しました");
    setEditing(null);
    await refreshProducts();
  }

  async function handleDelete(id: string) {
    if (!confirm("この商品を削除しますか？購入記録も全て削除されます。")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    await refreshProducts();
    if (expanded === id) setExpanded(null);
  }

  const activeProducts   = products.filter((p) => p.status === "active");
  const inactiveProducts = products.filter((p) => p.status === "inactive");

  function ProductCard({ product }: { product: Product }) {
    const isOpen = expanded === product.id;
    const productPurchases = purchases[product.id] ?? [];

    return (
      <Card className="overflow-hidden">
        <div className="flex items-start justify-between p-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <ProductTypeBadge type={product.type} />
              {product.status === "inactive" && (
                <span className="text-xs text-muted-foreground border rounded px-1.5 py-0.5">停止中</span>
              )}
            </div>
            <p className="font-semibold truncate">{product.name}</p>
            <p className="text-sm text-muted-foreground">¥{product.price.toLocaleString()}</p>
            {product.description && (
              <p className="text-xs text-muted-foreground line-clamp-1">{product.description}</p>
            )}
          </div>
          <div className="flex items-center gap-1 shrink-0 ml-2">
            <Button size="sm" variant="ghost" onClick={() => setEditing(product)}>編集</Button>
            <Button
              size="sm"
              variant="ghost"
              className="text-destructive hover:text-destructive"
              onClick={() => handleDelete(product.id)}
            >
              削除
            </Button>
            <Button size="sm" variant="outline" onClick={() => toggleExpand(product.id)}>
              {isOpen ? "閉じる" : "購入者"}
            </Button>
          </div>
        </div>

        {isOpen && (
          <div className="border-t px-4 py-3 bg-muted/30">
            {loadingPurchases === product.id ? (
              <p className="text-sm text-muted-foreground">読み込み中...</p>
            ) : (
              <PurchaseList
                product={product}
                purchases={productPurchases}
                onAdded={() => loadPurchases(product.id)}
              />
            )}
          </div>
        )}
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">商品・講座管理</h1>
          <p className="text-muted-foreground text-sm mt-1">販売中の商品・講座と購入者を管理します</p>
        </div>
        <Button onClick={() => setShowForm(true)}>+ 商品を追加</Button>
      </div>

      {products.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            <p>まだ商品・講座が登録されていません</p>
            <Button className="mt-4" onClick={() => setShowForm(true)}>最初の商品を登録する</Button>
          </CardContent>
        </Card>
      ) : (
        <>
          {activeProducts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">販売中 ({activeProducts.length})</h2>
              {activeProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </section>
          )}

          {inactiveProducts.length > 0 && (
            <section className="space-y-3">
              <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">停止中 ({inactiveProducts.length})</h2>
              {inactiveProducts.map((p) => <ProductCard key={p.id} product={p} />)}
            </section>
          )}
        </>
      )}

      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent>
          <DialogHeader><DialogTitle>商品・講座を追加</DialogTitle></DialogHeader>
          <ProductForm onSubmit={handleCreate} onCancel={() => setShowForm(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editing} onOpenChange={(open) => { if (!open) setEditing(null); }}>
        <DialogContent>
          <DialogHeader><DialogTitle>商品・講座を編集</DialogTitle></DialogHeader>
          {editing && (
            <ProductForm
              initialValues={editing}
              onSubmit={handleUpdate}
              onCancel={() => setEditing(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
