"use client";

import { useState, useEffect, useCallback } from "react";
import { ReportFilterBar } from "@/components/reports/report-filter-bar";
import { AnalyticsSummaryCards } from "./analytics-summary-cards";
import { ProfitChart } from "./profit-chart";
import { CustomerRevenueTable } from "./customer-revenue-table";
import type { AnalyticsData } from "@/types/analytics";
import type { ReportFilters } from "@/types/report";

interface AnalyticsClientProps {
  initialData: AnalyticsData;
  initialFilters: ReportFilters;
}

export function AnalyticsClient({ initialData, initialFilters }: AnalyticsClientProps) {
  const [filters, setFilters] = useState<ReportFilters>(initialFilters);
  const [data, setData]       = useState<AnalyticsData>(initialData);
  const [loading, setLoading] = useState(false);

  const fetchData = useCallback(async (f: ReportFilters) => {
    if (!f.dateFrom || !f.dateTo) return;
    setLoading(true);
    try {
      const res = await fetch(
        `/api/analytics?dateFrom=${f.dateFrom}&dateTo=${f.dateTo}`
      );
      if (res.ok) setData(await res.json());
    } finally {
      setLoading(false);
    }
  }, []);

  function handleFilterChange(next: ReportFilters) {
    setFilters(next);
    if (next.preset !== "custom" || (next.dateFrom && next.dateTo)) {
      fetchData(next);
    }
  }

  useEffect(() => {
    if (filters.preset === "custom" && filters.dateFrom && filters.dateTo) {
      fetchData(filters);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters.dateFrom, filters.dateTo, filters.preset]);

  return (
    <div className="space-y-4">
      <ReportFilterBar filters={filters} onChange={handleFilterChange} />

      <div className={loading ? "opacity-60 pointer-events-none" : ""}>
        <div className="space-y-4">
          <AnalyticsSummaryCards summary={data.summary} />
          <ProfitChart data={data.profitChart} />
          <CustomerRevenueTable customers={data.topCustomers} />
        </div>
      </div>
    </div>
  );
}
