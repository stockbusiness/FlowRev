export type ProductType =
  | "consultation"  // コンサル
  | "course"        // 講座
  | "community"     // コミュニティ
  | "subscription"  // サブスク・継続
  | "other";

export type ProductStatus = "active" | "inactive";
export type PurchaseStatus = "active" | "cancelled" | "completed";

export interface Product {
  id: string;
  user_id: string;
  name: string;
  type: ProductType;
  price: number;
  description: string | null;
  status: ProductStatus;
  created_at: string;
  updated_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  customer_id: string;
  product_id: string;
  amount: number;
  purchased_at: string;
  status: PurchaseStatus;
  notes: string | null;
  created_at: string;
  customer?: { id: string; name: string; email: string | null };
  product?:  { id: string; name: string; type: ProductType };
}

export interface ProductFormValues {
  name: string;
  type: ProductType;
  price: string;
  description: string;
  status: ProductStatus;
}

export interface PurchaseFormValues {
  customer_id: string;
  amount: string;
  purchased_at: string;
  status: PurchaseStatus;
  notes: string;
}
