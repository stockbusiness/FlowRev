"use client";

import { useState } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { buildDateRange } from "@/lib/report-utils";
import type { ReportPreset } from "@/types/report";

const PRESETS: { value: ReportPreset; label: string }[] = [
  { value: "this_month",    label: "今月" },
  { value: "last_month",    label: "先月" },
  { value: "last_3_months", label: "過去3ヶ月" },
  { value: "last_6_months", label: "過去6ヶ月" },
  { value: "custom",        label: "カスタム" },
];

interface PeriodFilterProps {
  currentPreset: ReportPreset;
}

export function PeriodFilter({ currentPreset }: PeriodFilterProps) {
  const router       = useRouter();
  const pathname     = usePathname();
  const searchParams = useSearchParams();

  const [showCustom, setShowCustom] = useState(currentPreset === "custom");
  const [customFrom, setCustomFrom] = useState(searchParams.get("from") ?? "");
  const [customTo,   setCustomTo]   = useState(searchParams.get("to")   ?? "");

  function pushParams(preset: ReportPreset, from: string, to: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("preset", preset);
    params.set("from", from);
    params.set("to", to);
    router.push(`${pathname}?${params.toString()}`);
  }

  function selectPreset(preset: ReportPreset) {
    if (preset === "custom") {
      setShowCustom(true);
      return;
    }
    setShowCustom(false);
    const range = buildDateRange(preset);
    pushParams(preset, range.dateFrom, range.dateTo);
  }

  function applyCustom() {
    if (!customFrom || !customTo) return;
    pushParams("custom", customFrom, customTo);
  }

  return (
    <div className="flex flex-wrap items-end gap-3">
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

      {showCustom && (
        <div className="flex items-center gap-2">
          <Input
            type="date"
            value={customFrom}
            onChange={(e) => setCustomFrom(e.target.value)}
            className="h-8 text-sm w-36"
          />
          <span className="text-muted-foreground text-sm">〜</span>
          <Input
            type="date"
            value={customTo}
            onChange={(e) => setCustomTo(e.target.value)}
            className="h-8 text-sm w-36"
          />
          <Button
            size="sm"
            onClick={applyCustom}
            disabled={!customFrom || !customTo}
          >
            適用
          </Button>
        </div>
      )}
    </div>
  );
}
