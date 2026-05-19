"use client";

import { useState, useEffect, useCallback } from "react";
import { ReportFilterBar } from "./report-filter-bar";
import { ReportSummaryCards } from "./report-summary-cards";
import { ReportCategoryTable } from "./report-category-table";
import { RevenueChart } from "@/components/dashboard/revenue-chart";
import type { ReportData, ReportFilters } from "@/types/report";

interface ReportsClientProps {
  initialData: ReportData;
  initialFilters: ReportFilters;
}

export function ReportsClient({ initialData, initialFilters }: ReportsClientProps) {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [data, setData]       = useState<ReportData>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchReport = useCallback(async (f: ReportFilters) => {
    if (!f.dateFrom || !f.dateTo) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/reports?dateFrom=${f.dateFrom}&dateTo=${f.dateTo}`
      );
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  function handleFilterChange(next: ReportFilters) {
    setFilters(next);
    if (next.preset !== "custom" || (next.dateFrom && next.dateTo)) {
      fetchReport(next);
    }
  }

  // カスタム選択で両日付が揃ったら自動フェッチ
  useEffect(() => {
    if (filters.preset === "custom" && filters.dateFrom && filters.dateTo) {
      fetchReport(filters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dateFrom, filters.dateTo, filters.preset]);

  return (
    <div className="space-y-4">
      <ReportFilterBar filters={filters} onChange={handleFilterChange} />

      <div className={loading ? "opacity-60 pointer-events-none" : ""}>
        <div className="space-y-4">
          <ReportSummaryCards summary={data.summary} />

          {data.monthly.length > 0 && (
            <RevenueChart data={data.monthly} />
          )}

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <ReportCategoryTable categories={data.categories} type="revenue" />
            <ReportCategoryTable categories={data.categories} type="expense" />
          </div>
        </div>
      </div>
    </div>
  );
}
