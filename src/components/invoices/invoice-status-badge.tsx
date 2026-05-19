import { Badge } from "@/components/ui/badge";
import type { InvoiceStatus } from "@/types/invoice";

const config: Record<InvoiceStatus, { label: string; variant: "default" | "secondary" | "outline" }> = {
  draft: { label: "下書き",  variant: "outline" },
  sent:  { label: "送付済み", variant: "secondary" },
  paid:  { label: "入金済み", variant: "default" },
};

export function InvoiceStatusBadge({ status }: { status: InvoiceStatus }) {
  const { label, variant } = config[status];
  return <Badge variant={variant}>{label}</Badge>;
}
