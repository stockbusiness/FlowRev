import { Pencil, Trash2, Printer, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import type { Invoice } from "@/types/invoice";

interface InvoiceListProps {
  invoices: Invoice[];
  onEdit:   (inv: Invoice) => void;
  onDelete: (id: string)   => void;
  onPrint:  (inv: Invoice) => void;
  onMarkPaid: (id: string) => void;
}

export function InvoiceList({ invoices, onEdit, onDelete, onPrint, onMarkPaid }: InvoiceListProps) {
  if (invoices.length === 0) {
    return (
      <div className="flex items-center justify-center h-40 text-sm text-muted-foreground">
        請求書がありません
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>請求書番号</TableHead>
          <TableHead>顧客</TableHead>
          <TableHead>発行日</TableHead>
          <TableHead>支払期限</TableHead>
          <TableHead>ステータス</TableHead>
          <TableHead className="text-right">金額</TableHead>
          <TableHead className="w-28" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {invoices.map((inv) => (
          <TableRow key={inv.id}>
            <TableCell className="font-medium text-sm">{inv.invoice_number}</TableCell>
            <TableCell className="text-sm">{inv.customer?.name ?? <span className="text-muted-foreground">—</span>}</TableCell>
            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{inv.issue_date}</TableCell>
            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">{inv.due_date ?? "—"}</TableCell>
            <TableCell><InvoiceStatusBadge status={inv.status} /></TableCell>
            <TableCell className="text-right font-medium">¥{inv.total.toLocaleString()}</TableCell>
            <TableCell>
              <div className="flex items-center gap-1 justify-end">
                {inv.status !== "paid" && (
                  <Button variant="ghost" size="icon" className="h-7 w-7 text-emerald-600 hover:text-emerald-600" onClick={() => onMarkPaid(inv.id)} title="入金済みにする">
                    <CheckCircle className="h-3.5 w-3.5" />
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onPrint(inv)} title="印刷">
                  <Printer className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(inv)}>
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(inv.id)}>
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
