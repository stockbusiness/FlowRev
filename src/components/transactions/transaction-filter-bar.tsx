"use client";

import { Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

export interface TransactionFilterState {
  keyword: string;
  type: "all" | "revenue" | "expense";
  dateFrom: string;
  dateTo: string;
}

interface TransactionFilterBarProps {
  filters: TransactionFilterState;
  onChange: (filters: TransactionFilterState) => void;
  resultCount: number;
  totalCount: number;
}

export const INITIAL_FILTERS: TransactionFilterState = {
  keyword: "",
  type: "all",
  dateFrom: "",
  dateTo: "",
};

export function TransactionFilterBar({
  filters, onChange, resultCount, totalCount,
}: TransactionFilterBarProps) {
  function set<K extends keyof TransactionFilterState>(key: K, val: TransactionFilterState[K]) {
    onChange({ ...filters, [key]: val });
  }

  function reset() {
    onChange(INITIAL_FILTERS);
  }

  const isFiltered =
    filters.keyword !== "" ||
    filters.type !== "all" ||
    filters.dateFrom !== "" ||
    filters.dateTo !== "";

  return (
    <div className="space-y-2 p-4 bg-card border rounded-xl">
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[180px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            className="pl-8 h-8 text-sm"
            placeholder="説明・顧客名で検索"
            value={filters.keyword}
            onChange={(e) => set("keyword", e.target.value)}
          />
        </div>

        <Select value={filters.type} onValueChange={(v) => set("type", v as TransactionFilterState["type"])}>
          <SelectTrigger className="h-8 text-sm w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">すべて</SelectItem>
            <SelectItem value="revenue">収益のみ</SelectItem>
            <SelectItem value="expense">費用のみ</SelectItem>
          </SelectContent>
        </Select>

        <div className="flex items-center gap-1.5">
          <Input
            type="date"
            value={filters.dateFrom}
            onChange={(e) => set("dateFrom", e.target.value)}
            className="h-8 text-sm w-36"
          />
          <span className="text-muted-foreground text-xs">〜</span>
          <Input
            type="date"
            value={filters.dateTo}
            onChange={(e) => set("dateTo", e.target.value)}
            className="h-8 text-sm w-36"
          />
        </div>

        {isFiltered && (
          <Button variant="ghost" size="sm" onClick={reset} className="h-8 px-2 text-muted-foreground">
            <X className="h-4 w-4" />
            リセット
          </Button>
        )}
      </div>

      {isFiltered && (
        <p className="text-xs text-muted-foreground">
          {totalCount} 件中 {resultCount} 件を表示
        </p>
      )}
    </div>
  );
}
