"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { buildDateRange } from "@/lib/report-utils";
import type { ReportPreset } from "@/types/report";

const PRESETS: { value: ReportPreset; label: string }[] = [
  { value: "this_month",    label: "今月" },
  { value: "last_month",    label: "先月" },
  { value: "last_3_months", label: "過去3ヶ月" },
  { value: "last_6_months", label: "過去6ヶ月" },
];

interface PeriodFilterProps {
  currentPreset: ReportPreset;
}

export function PeriodFilter({ currentPreset }: PeriodFilterProps) {
  const router      = useRouter();
  const pathname    = usePathname();
  const searchParams = useSearchParams();

  function selectPreset(preset: ReportPreset) {
    const range = buildDateRange(preset as Exclude<ReportPreset, "custom">);
    const params = new URLSearchParams(searchParams.toString());
    params.set("preset", preset);
    params.set("from", range.dateFrom);
    params.set("to", range.dateTo);
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <div className="flex gap-1.5 flex-wrap">
      {PRESETS.map((p) => (
        <Button
          key={p.value}
          size="sm"
          variant={currentPreset === p.value ? "default" : "outline"}
          onClick={() => selectPreset(p.value)}
        >
          {p.label}
        </Button>
      ))}
    </div>
  );
}
