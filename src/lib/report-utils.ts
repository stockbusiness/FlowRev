import type { ReportPreset } from "@/types/report";

export function buildDateRange(preset: Exclude<ReportPreset, "custom">): {
  dateFrom: string;
  dateTo: string;
} {
  const now   = new Date();
  const year  = now.getFullYear();
  const month = now.getMonth();
  const fmt   = (d: Date) => d.toISOString().split("T")[0];

  if (preset === "this_month") {
    return {
      dateFrom: fmt(new Date(year, month, 1)),
      dateTo:   fmt(new Date(year, month + 1, 0)),
    };
  }
  if (preset === "last_month") {
    return {
      dateFrom: fmt(new Date(year, month - 1, 1)),
      dateTo:   fmt(new Date(year, month, 0)),
    };
  }
  if (preset === "last_3_months") {
    return {
      dateFrom: fmt(new Date(year, month - 2, 1)),
      dateTo:   fmt(new Date(year, month + 1, 0)),
    };
  }
  // last_6_months
  return {
    dateFrom: fmt(new Date(year, month - 5, 1)),
    dateTo:   fmt(new Date(year, month + 1, 0)),
  };
}
