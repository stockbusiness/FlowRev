import { Button } from "@/components/ui/button";
import { X, Printer } from "lucide-react";
import { InvoiceStatusBadge } from "./invoice-status-badge";
import type { Invoice } from "@/types/invoice";

interface InvoicePrintViewProps {
  invoice: Invoice;
  onClose: () => void;
}

export function InvoicePrintView({ invoice, onClose }: InvoicePrintViewProps) {
  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm flex items-start justify-center overflow-y-auto py-8">
      <div className="w-full max-w-2xl mx-4">
        <div className="flex justify-between mb-3" data-print-hide>
          <Button variant="default" size="sm" onClick={() => window.print()}>
            <Printer className="h-4 w-4" /> 印刷 / PDF保存
          </Button>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div id="invoice-print" className="bg-white border rounded-xl p-10 shadow-sm text-gray-900 space-y-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">請求書</h1>
              <p className="text-sm text-gray-500 mt-1">{invoice.invoice_number}</p>
            </div>
            <InvoiceStatusBadge status={invoice.status} />
          </div>

          <div className="grid grid-cols-2 gap-8 text-sm">
            <div>
              <p className="font-semibold mb-1">請求先</p>
              <p className="font-bold">{invoice.customer?.name ?? "—"}</p>
              {invoice.customer?.email && <p className="text-gray-500">{invoice.customer.email}</p>}
            </div>
            <div className="text-right space-y-1 text-gray-600">
              <p>発行日: <span className="text-gray-900">{invoice.issue_date}</span></p>
              {invoice.due_date && <p>支払期限: <span className="text-gray-900">{invoice.due_date}</span></p>}
            </div>
          </div>

          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="border-b-2 border-gray-200">
                <th className="text-left py-2 font-semibold">品目</th>
                <th className="text-right py-2 font-semibold w-16">数量</th>
                <th className="text-right py-2 font-semibold w-28">単価</th>
                <th className="text-right py-2 font-semibold w-28">金額</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map((item, i) => (
                <tr key={i} className="border-b border-gray-100">
                  <td className="py-2">{item.description}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">¥{item.unit_price.toLocaleString()}</td>
                  <td className="py-2 text-right">¥{item.amount.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-end">
            <div className="w-52 space-y-1.5 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>小計</span><span>¥{invoice.subtotal.toLocaleString()}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>消費税（{invoice.tax_rate}%）</span><span>¥{invoice.tax_amount.toLocaleString()}</span>
              </div>
              <div className="flex justify-between font-bold text-base border-t pt-1.5">
                <span>合計</span><span>¥{invoice.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {invoice.notes && (
            <div className="border-t pt-4 text-sm text-gray-600">
              <p className="font-semibold text-gray-800 mb-1">備考</p>
              <p className="whitespace-pre-wrap">{invoice.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
