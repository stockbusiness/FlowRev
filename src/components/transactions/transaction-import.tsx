"use client";

import { useState, useRef } from "react";
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { Category } from "@/types";

interface ImportRow {
  date: string;
  type: "revenue" | "expense";
  description: string;
  amount: number;
  category_id: string | null;
  valid: boolean;
  error?: string;
}

interface TransactionImportProps {
  categories: Category[];
  onClose: () => void;
  onComplete: () => void;
}

function parseCSV(text: string, categories: Category[]): ImportRow[] {
  const lines = text.trim().split("\n").map((l) => l.trim()).filter(Boolean);
  const catMap = new Map(categories.map((c) => [c.name, c]));

  return lines.slice(1).map((line) => {
    const cols = line.split(",").map((c) => c.trim().replace(/^"|"$/g, ""));
    const [date, typeLabel, description, , categoryName, , amountStr] = cols;

    const amount = parseInt(amountStr?.replace(/[^\d]/g, "") ?? "0", 10);
    const type   = typeLabel === "収益" ? "revenue" : typeLabel === "費用" ? "expense" : null;
    const cat    = catMap.get(categoryName ?? "") ?? null;

    if (!date || !type || !description || !amount) {
      return { date: date ?? "", type: "expense", description: description ?? "", amount: 0, category_id: null, valid: false, error: "必須項目が不足しています" };
    }
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return { date, type: "expense", description, amount, category_id: null, valid: false, error: "日付形式が不正です (YYYY-MM-DD)" };
    }

    return { date, type, description, amount, category_id: cat?.id ?? null, valid: true };
  });
}

export function TransactionImport({ categories, onClose, onComplete }: TransactionImportProps) {
  const fileRef  = useRef<HTMLInputElement>(null);
  const [rows, setRows]       = useState<ImportRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [done, setDone]       = useState<number | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const text = ev.target?.result as string;
      setRows(parseCSV(text, categories));
      setDone(null);
    };
    reader.readAsText(file, "UTF-8");
  }

  async function handleImport() {
    const valid = rows.filter((r) => r.valid);
    if (valid.length === 0) return;
    setLoading(true);
    const res = await fetch("/api/transactions/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(valid),
    });
    setLoading(false);
    if (res.ok) {
      const { inserted } = await res.json();
      setDone(inserted);
      onComplete();
    }
  }

  const validCount   = rows.filter((r) => r.valid).length;
  const invalidCount = rows.length - validCount;

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">CSVインポート</CardTitle>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-xs text-muted-foreground">
          CSVのフォーマット: <code className="bg-muted px-1 rounded">日付,種別,説明,顧客名,カテゴリ名,メモ,金額（円）</code>
          <br />種別は「収益」または「費用」で記載してください。
        </p>

        <div
          className="border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-primary transition-colors"
          onClick={() => fileRef.current?.click()}
        >
          <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">クリックしてCSVファイルを選択</p>
          <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={handleFile} />
        </div>

        {rows.length > 0 && (
          <>
            <div className="flex items-center gap-3 text-sm">
              <span className="flex items-center gap-1 text-emerald-600">
                <CheckCircle className="h-4 w-4" />{validCount}件 有効
              </span>
              {invalidCount > 0 && (
                <span className="flex items-center gap-1 text-rose-600">
                  <AlertCircle className="h-4 w-4" />{invalidCount}件 エラー
                </span>
              )}
            </div>

            <div className="max-h-60 overflow-y-auto border rounded-lg divide-y text-xs">
              {rows.map((r, i) => (
                <div key={i} className={`px-3 py-2 flex items-center gap-2 ${r.valid ? "" : "bg-rose-50"}`}>
                  <Badge variant={r.type === "revenue" ? "default" : "destructive"} className="shrink-0 text-xs">
                    {r.type === "revenue" ? "収益" : "費用"}
                  </Badge>
                  <span className="text-muted-foreground">{r.date}</span>
                  <span className="truncate flex-1">{r.description}</span>
                  <span className="font-medium">¥{r.amount.toLocaleString()}</span>
                  {!r.valid && <span className="text-rose-600 shrink-0">{r.error}</span>}
                </div>
              ))}
            </div>

            {done != null ? (
              <p className="text-sm text-emerald-600 flex items-center gap-1">
                <CheckCircle className="h-4 w-4" />{done}件をインポートしました
              </p>
            ) : (
              <Button onClick={handleImport} disabled={loading || validCount === 0} className="w-full">
                {loading ? "インポート中..." : `${validCount}件をインポート`}
              </Button>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
}
