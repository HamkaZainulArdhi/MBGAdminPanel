"use client";

import { useLaporanReports } from "@/hooks/useLaporanReports";
import { LaporanList } from "./_components/LaporanList";
import { Skeleton } from "@/components/ui/skeleton";

export default function LaporanPage() {
  const { reports, loading } = useLaporanReports();

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Daftar Laporan
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Kelola dan review laporan terkait sekolah dan vendor
        </p>
      </div>

      {/* Summary */}
      {/* Dihapus dari sini, sudah dipindah ke dashboard */}

      {/* List */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-64 rounded-lg" />
          ))}
        </div>
      ) : (
        <LaporanList reports={reports} />
      )}
    </div>
  );
}
