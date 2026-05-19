export type ReportPreset =
  | "this_month"
  | "last_month"
  | "last_3_months"
  | "last_6_months"
  | "custom";

export interface ReportFilters {
  dateFrom: string;
  dateTo: string;
  preset: ReportPreset;
}

export interface ReportSummary {
  revenue: number;
  expense: number;
  profit: number;
  transactionCount: number;
}

export interface ReportCategoryRow {
  name: string;
  color: string;
  type: "revenue" | "expense";
  amount: number;
  percentage: number;
}

export interface ReportData {
  summary: ReportSummary;
  categories: ReportCategoryRow[];
  monthly: { month: string; revenue: number; expense: number }[];
}
