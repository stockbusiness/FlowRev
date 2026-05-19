import { Header } from "@/components/layout/header";
import { AnalyticsClient } from "@/components/analytics/analytics-client";
import { getAnalyticsData } from "@/lib/supabase/analytics";
import { buildDateRange } from "@/lib/report-utils";

export default async function AnalyticsPage() {
  const range = buildDateRange("last_6_months");
  const data  = await getAnalyticsData(range.dateFrom, range.dateTo);

  const initialFilters = {
    ...range,
    preset: "last_6_months" as const,
  };

  return (
    <>
      <Header title="収益分析" />
      <main className="flex-1 overflow-auto p-6">
        <AnalyticsClient initialData={data} initialFilters={initialFilters} />
      </main>
    </>
  );
}
