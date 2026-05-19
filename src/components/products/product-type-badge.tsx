import type { ProductType } from "@/types/product";

const config: Record<ProductType, { label: string; className: string }> = {
  consultation: { label: "コンサル",       className: "bg-purple-100 text-purple-800 border-purple-200" },
  course:       { label: "講座",           className: "bg-blue-100   text-blue-800   border-blue-200" },
  community:    { label: "コミュニティ",   className: "bg-green-100  text-green-800  border-green-200" },
  subscription: { label: "サブスク",       className: "bg-orange-100 text-orange-800 border-orange-200" },
  other:        { label: "その他",         className: "bg-gray-100   text-gray-700   border-gray-200" },
};

export function ProductTypeBadge({ type }: { type: ProductType }) {
  const { label, className } = config[type];
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${className}`}>
      {label}
    </span>
  );
}
