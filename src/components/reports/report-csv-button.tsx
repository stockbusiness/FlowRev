"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TransactionWithRelations } from "@/types";

interface ReportCsvButtonProps {
  dateFrom: string;
  dateTo: string;
}

function toCsv(rows: TransactionWithRelations[]): string {
  const header = ["日付", "種別", "説明", "カテゴリ", "顧客", "金額（円）"];
  const lines = rows.map((t) => [
    t.date,
    t.type === "revenue" ? "収益" : "費用",
    `"${t.description.replace(/"/g, '""')}"`,
    t.category?.name ?? "",
    t.customer?.name ?? "",
    t.amount,
  ]);
  return [header, ...lines].map((r) => r.join(",")).join("\n");
}

function downloadCsv(csv: string, filename: string) {
  const bom  = "﻿"; // Excel で文字化けしないように BOM を付与
  const blob = new Blob([bom + csv], { type: "text/csv;charset=utf-8;" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export function ReportCsvButton({ dateFrom, dateTo }: ReportCsvButtonProps) {
  const [loading, setLoading] = useState(false);

  async function handleClick() {
    if (!dateFrom || !dateTo) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/transactions?dateFrom=${dateFrom}&dateTo=${dateTo}`);
      if (!res.ok) throw new Error("取得失敗");
      const data: TransactionWithRelations[] = await res.json();
      const csv = toCsv(data);
      downloadCsv(csv, `flowrev_${dateFrom}_${dateTo}.csv`);
    } catch {
      alert("CSVのダウンロードに失敗しました");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick} disabled={loading}>
      <Download className="h-4 w-4" />
      {loading ? "生成中..." : "CSVダウンロード"}
    </Button>
  );
}
