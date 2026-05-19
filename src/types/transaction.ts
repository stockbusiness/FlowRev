import type { TransactionType, TransactionWithRelations } from "@/types";

export type { TransactionType, TransactionWithRelations };

export interface TransactionFormValues {
  type: TransactionType;
  amount: string;
  description: string;
  category_id: string;
  customer_id: string;
  date: string;
}

export interface TransactionFilters {
  type?: TransactionType;
  dateFrom?: string;
  dateTo?: string;
}
