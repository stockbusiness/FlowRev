import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { CustomerRankingRow } from "@/types/report";

interface CustomerRankingTableProps {
  customers: CustomerRankingRow[];
}

export function CustomerRankingTable({ customers }: CustomerRankingTableProps) {
  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">顧客別売上ランキング</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {customers.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-muted-foreground">
            データがありません
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="pl-6 w-10">#</TableHead>
                <TableHead>顧客名</TableHead>
                <TableHead className="text-right">売上</TableHead>
                <TableHead className="text-right">件数</TableHead>
                <TableHead className="text-right pr-6">構成比</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((c, i) => (
                <TableRow key={c.customerId}>
                  <TableCell className="pl-6 text-muted-foreground text-sm">{i + 1}</TableCell>
                  <TableCell className="font-medium">{c.customerName}</TableCell>
                  <TableCell className="text-right text-emerald-600 font-medium">
                    ¥{c.revenue.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground text-sm">
                    {c.transactionCount}件
                  </TableCell>
                  <TableCell className="text-right pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full bg-emerald-500 rounded-full"
                          style={{ width: `${c.percentage}%` }}
                        />
                      </div>
                      <span className="text-xs text-muted-foreground w-8 text-right">
                        {c.percentage}%
                      </span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
