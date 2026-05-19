"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { InvoiceItem } from "@/types/invoice";

interface InvoiceItemsEditorProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
}

function emptyItem(): InvoiceItem {
  return { description: "", quantity: 1, unit_price: 0, amount: 0 };
}

export function InvoiceItemsEditor({ items, onChange }: InvoiceItemsEditorProps) {
  function update(index: number, patch: Partial<InvoiceItem>) {
    const next = items.map((item, i) => {
      if (i !== index) return item;
      const merged = { ...item, ...patch };
      merged.amount = merged.quantity * merged.unit_price;
      return merged;
    });
    onChange(next);
  }

  function addRow() {
    onChange([...items, emptyItem()]);
  }

  function removeRow(index: number) {
    onChange(items.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2">
      <div className="grid grid-cols-[1fr_80px_120px_120px_36px] gap-2 text-xs text-muted-foreground px-1">
        <span>品目・説明</span>
        <span className="text-right">数量</span>
        <span className="text-right">単価（円）</span>
        <span className="text-right">金額（円）</span>
        <span />
      </div>

      {items.map((item, i) => (
        <div key={i} className="grid grid-cols-[1fr_80px_120px_120px_36px] gap-2 items-center">
          <Input
            value={item.description}
            onChange={(e) => update(i, { description: e.target.value })}
            placeholder="品目名"
            className="h-8 text-sm"
          />
          <Input
            type="number"
            min={1}
            value={item.quantity}
            onChange={(e) => update(i, { quantity: Number(e.target.value) || 1 })}
            className="h-8 text-sm text-right"
          />
          <Input
            type="number"
            min={0}
            value={item.unit_price}
            onChange={(e) => update(i, { unit_price: Number(e.target.value) || 0 })}
            className="h-8 text-sm text-right"
          />
          <div className="h-8 flex items-center justify-end px-2 text-sm font-medium bg-muted rounded-md">
            ¥{item.amount.toLocaleString()}
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground" onClick={() => removeRow(i)}>
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      ))}

      <Button variant="outline" size="sm" onClick={addRow} className="w-full mt-1">
        <Plus className="h-4 w-4" />
        行を追加
      </Button>
    </div>
  );
}
