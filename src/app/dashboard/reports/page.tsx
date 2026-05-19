import { Header } from "@/components/layout/header";
import { ReportsClient } from "@/components/reports/reports-client";
import { getReportData } from "@/lib/supabase/reports";
import { buildDateRange } from "@/lib/report-utils";

export default async function ReportsPage() {
  const defaultRange = buildDateRange("this_month");
  const initialData  = await getReportData(defaultRange.dateFrom, defaultRange.dateTo);

  const initialFilters = {
    preset:   "this_month" as const,
    dateFrom: defaultRange.dateFrom,
    dateTo:   defaultRange.dateTo,
  };

  return (
    <>
      <Header title="月次レポート" />
      <main className="flex-1 overflow-auto p-6">
        <ReportsClient initialData={initialData} initialFilters={initialFilters} />
      </main>
    </>
  );
}
