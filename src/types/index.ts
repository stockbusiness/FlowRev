import type { Database } from "./database";

export type { Database };

export type TransactionType = "revenue" | "expense";

export type Profile  = Database["public"]["Tables"]["profiles"]["Row"];
export type Category = Database["public"]["Tables"]["categories"]["Row"];
export type Customer = Database["public"]["Tables"]["customers"]["Row"];
export type Transaction = Database["public"]["Tables"]["transactions"]["Row"];

export type TransactionInsert = Database["public"]["Tables"]["transactions"]["Insert"];
export type TransactionUpdate = Database["public"]["Tables"]["transactions"]["Update"];

export type CategoryInsert = Database["public"]["Tables"]["categories"]["Insert"];
export type CategoryUpdate = Database["public"]["Tables"]["categories"]["Update"];
export type CustomerInsert = Database["public"]["Tables"]["customers"]["Insert"];

/** transactions に category / customer を JOIN した拡張型 */
export type TransactionWithRelations = Transaction & {
  category: Pick<Category, "id" | "name" | "color"> | null;
  customer: Pick<Customer, "id" | "name"> | null;
};
