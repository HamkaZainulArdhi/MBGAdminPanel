"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  getAnomalyReportById,
  enrichReportWithRelations,
} from "@/lib/laporan-service";
import {
  AnomalyReportWithRelation,
  AnomalyReportStatus,
} from "@/lib/types/laporan";
import { LaporanDetail } from "../_components/LaporanDetail";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LaporanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const reportId = params.id as string;

  const [report, setReport] = useState<AnomalyReportWithRelation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReport = async () => {
      try {
        setLoading(true);
        const rawReport = await getAnomalyReportById(reportId);
        if (!rawReport) {
          setError("Laporan tidak ditemukan");
          return;
        }
        const enrichedReport = await enrichReportWithRelations(rawReport);
        setReport(enrichedReport);
      } catch (err) {
        console.error("Error fetching report:", err);
        setError("Gagal memuat laporan. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };

    if (reportId) {
      fetchReport();
    }
  }, [reportId]);

  const handleStatusUpdate = (newStatus: AnomalyReportStatus) => {
    if (report) {
      setReport({ ...report, status: newStatus });
    }
  };

  if (error) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            {error}
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Laporan yang Anda cari tidak tersedia atau telah dihapus.
          </p>
        </div>
        <Link href="/laporan">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Laporan
          </Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-40" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 rounded-lg" />
            <Skeleton className="h-48 rounded-lg" />
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="flex flex-col gap-4 items-center justify-center min-h-96">
        <div className="text-center">
          <h2 className="text-lg font-semibold mb-2">
            Laporan Tidak Ditemukan
          </h2>
          <p className="text-sm text-muted-foreground mb-4">
            Laporan yang Anda cari tidak tersedia.
          </p>
        </div>
        <Link href="/laporan">
          <Button>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali ke Daftar Laporan
          </Button>
        </Link>
      </div>
    );
  }

  return <LaporanDetail report={report} onStatusUpdate={handleStatusUpdate} />;
}
