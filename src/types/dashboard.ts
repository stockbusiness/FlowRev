export interface DashboardStats {
  currentRevenue: number;
  currentExpense: number;
  currentProfit: number;
  activeCustomers: number;
  prevRevenue: number;
  prevExpense: number;
  prevProfit: number;
  prevCustomers: number;
}

export interface MonthlyChartData {
  month: string;
  revenue: number;
  expense: number;
}

export interface ExpenseChartData {
  name: string;
  value: number;
  color: string;
}

export interface RecentTransaction {
  id: string;
  description: string;
  amount: number;
  type: "revenue" | "expense";
  date: string;
  created_at: string;
}
