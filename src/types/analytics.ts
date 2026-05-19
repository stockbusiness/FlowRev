export interface AnalyticsSummary {
  revenue: number;
  expense: number;
  profit: number;
  profitMargin: number;
}

export interface ProfitChartItem {
  month: string;
  profit: number;
}

export interface CustomerRevenueRow {
  customerId: string;
  customerName: string;
  revenue: number;
  transactionCount: number;
  percentage: number;
}

export interface AnalyticsData {
  summary: AnalyticsSummary;
  profitChart: ProfitChartItem[];
  topCustomers: CustomerRevenueRow[];
}
