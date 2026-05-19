import type { Customer } from "@/types";

export interface CustomerFormValues {
  name: string;
  email: string;
  phone: string;
  notes: string;
}

export interface CustomerStats {
  transaction_count: number;
  total_revenue: number;
  total_expense: number;
}

export type CustomerWithStats = Customer & CustomerStats;
