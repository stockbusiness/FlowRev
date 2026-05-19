"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildDateRange } from "@/lib/report-utils";
import type { ReportFilters, ReportPreset } from "@/types/report";

interface ReportFilterBarProps {
  filters: ReportFilters;
  onChange: (filters: ReportFilters) => void;
}

const PRESETS: { value: ReportPreset; label: string }[] = [
  { value: "this_month",    label: "今月" },
  { value: "last_month",    label: "先月" },
  { value: "last_3_months", label: "過去3ヶ月" },
  { value: "last_6_months", label: "過去6ヶ月" },
  { value: "custom",        label: "カスタム" },
];

export function ReportFilterBar({ filters, onChange }: ReportFilterBarProps) {
  function selectPreset(preset: ReportPreset) {
    if (preset === "custom") {
      onChange({ ...filters, preset });
      return;
    }
    const range = buildDateRange(preset);
    onChange({ ...range, preset });
  }

  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-card border rounded-xl">
      <div className="flex gap-1.5 flex-wrap">
        {PRESETS.map((p) => (
          <Button
            key={p.value}
            size="sm"
            variant={filters.preset === p.value ? "default" : "outline"}
            onClick={() => selectPreset(p.value)}
          >
            {p.label}
          </Button>
        ))}
      </div>

      {filters.preset === "custom" && (
        <div className="flex items-end gap-2">
          <div className="space-y-1">
            <Label className="text-xs">開始日</Label>
            <Input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => onChange({ ...filters, dateFrom: e.target.value })}
              className="h-8 text-sm w-36"
            />
          </div>
          <span className="pb-1 text-muted-foreground">〜</span>
          <div className="space-y-1">
            <Label className="text-xs">終了日</Label>
            <Input
              type="date"
              value={filters.dateTo}
              onChange={(e) => onChange({ ...filters, dateTo: e.target.value })}
              className="h-8 text-sm w-36"
            />
          </div>
        </div>
      )}
    </div>
  );
}
