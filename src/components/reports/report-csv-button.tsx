"use client";

import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ReportCsvButtonProps {
  dateFrom: string;
  dateTo: string;
}

export function ReportCsvButton({ dateFrom, dateTo }: ReportCsvButtonProps) {
  function handleClick() {
    // TODO: CSV出力処理を実装
    alert(`CSV出力: ${dateFrom} 〜 ${dateTo}\n（実装予定）`);
  }

  return (
    <Button variant="outline" size="sm" onClick={handleClick}>
      <Download className="h-4 w-4" />
      CSVダウンロード
    </Button>
  );
}
