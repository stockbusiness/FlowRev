import type { TransactionType } from "@/types";

export interface CategoryFormValues {
  name: string;
  type: TransactionType;
  color: string;
}

export const PRESET_COLORS = [
  "#10b981", "#3b82f6", "#8b5cf6", "#f59e0b",
  "#ef4444", "#f97316", "#eab308", "#6b7280",
  "#ec4899", "#14b8a6", "#6366f1", "#9ca3af",
] as const;
