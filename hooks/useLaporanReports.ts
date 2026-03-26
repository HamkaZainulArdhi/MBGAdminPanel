"use client";

import { useState, useEffect } from "react";
import {
  subscribeToAnomalyReports,
  enrichReportsWithRelations,
} from "@/lib/laporan-service";
import {
  AnomalyReport,
  AnomalyReportWithRelation,
  AnomalyReportSummary,
} from "@/lib/types/laporan";

export function useLaporanReports() {
  const [reports, setReports] = useState<AnomalyReportWithRelation[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<AnomalyReportSummary>({
    total: 0,
    pending: 0,
    onProgress: 0,
    resolved: 0,
    rejected: 0,
  });

  useEffect(() => {
    setLoading(true);

    const unsubscribe = subscribeToAnomalyReports(
      async (rawReports: AnomalyReport[]) => {
        try {
          // Enrich semua reports dengan informasi relasi
          const enrichedReports = await enrichReportsWithRelations(rawReports);
          setReports(enrichedReports);

          // Hitung summary
          const summary: AnomalyReportSummary = {
            total: enrichedReports.length,
            pending: enrichedReports.filter(
              (r) => r.status === "PENDING_INVESTIGATION",
            ).length,
            onProgress: enrichedReports.filter(
              (r) => r.status === "ON_PROGRESS",
            ).length,
            resolved: enrichedReports.filter((r) => r.status === "RESOLVED")
              .length,
            rejected: enrichedReports.filter((r) => r.status === "REJECTED")
              .length,
          };
          setSummary(summary);
          setLoading(false);
        } catch (error) {
          console.error("Error enriching reports:", error);
          setLoading(false);
        }
      },
    );

    return () => unsubscribe();
  }, []);

  return { reports, loading, summary };
}
