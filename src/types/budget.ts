export interface Budget {
  id: string;
  user_id: string;
  category_id: string;
  month: string; // YYYY-MM
  amount: number;
  created_at: string;
}

export interface BudgetWithActual {
  category_id: string;
  category_name: string;
  category_color: string;
  budget_id: string | null;
  budget_amount: number | null;
  actual_amount: number;
  percentage: number;
  status: "ok" | "warning" | "over";
}
