"use client";

import { LaporanCard } from "./LaporanCard";
import { AnomalyReportWithRelation } from "@/lib/types/laporan";

interface LaporanListProps {
  reports: AnomalyReportWithRelation[];
}

export function LaporanList({ reports }: LaporanListProps) {
  if (reports.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-border p-12 text-center">
        <svg
          className="mx-auto h-12 w-12 text-muted-foreground/30 mb-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
          />
        </svg>
        <h3 className="text-sm font-semibold text-muted-foreground mb-1">
          Tidak Ada Laporan
        </h3>
        <p className="text-xs text-muted-foreground/60">
          Sistem laporan anomali siap untuk menerima laporan baru.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {reports.map((report) => (
        <LaporanCard key={report.id} report={report} />
      ))}
    </div>
  );
}
