"use client";

import { useRegistrationData } from "@/hooks/useRegistrationData";
import {
  GraduationCap,
  UtensilsCrossed,
  Truck,
  Clock,
  CheckCircle2,
  TrendingUp,
  FileText,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { SchoolSummaryDashboard } from "./_components/SchoolSummaryDashboard";
import { useSchoolReports } from "../sekolah/_components/useSchoolReports";
import { RegStatCard } from "./_components/PendaftaranSummaryData";
import { useLaporanReports } from "@/hooks/useLaporanReports";
import { LaporanSummary } from "./_components/LaporanSummary";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export default function DashboardPage() {
  const schoolState = useRegistrationData("school", {
    realTime: true,
    includeApproved: true,
  });
  const vendorState = useRegistrationData("vendor", {
    realTime: true,
    includeApproved: true,
  });
  const driverState = useRegistrationData("driver", {
    realTime: true,
    includeApproved: true,
  });
  const { summaryData, loading } = useSchoolReports();
  const { summary: laporanSummary, loading: loadingLaporan } = useLaporanReports();
  const totalPendingSekolah =
    summaryData.missingVendor + summaryData.missingDriver;

  const pendingOf = (data: typeof schoolState.data) =>
    data.filter((d) => !d.isApproved && !d.rejectReason).length;
  const approvedOf = (data: typeof schoolState.data) =>
    data.filter((d) => d.isApproved).length;

  const totalAll =
    schoolState.data.length + vendorState.data.length + driverState.data.length;
  const totalPending =
    pendingOf(schoolState.data) +
    pendingOf(vendorState.data) +
    pendingOf(driverState.data);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Ringkasan pendaftaran dan status verifikasi sistem
        </p>
      </div>
      {/* Alert banner */}
      {totalPending > 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-border bg-warning/20 text-warning-foreground px-4 py-3">
          <Clock className="h-4 w-4 shrink-0" />
          <p className="text-sm font-semibold">
            {totalPending} pendaftaran baru menunggu verifikasi
          </p>
        </div>
      )}
      {/* Grand total */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 ">
        <Card className="border-0 shadow-sm overflow-hidden bg-primary text-primary-foreground">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-3 ">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider">
                  Total Pendaftaran
                </p>
                <p className="text-4xl font-extrabold tracking-tight mt-1">
                  {totalAll}
                </p>
              </div>
              <div className="rounded-xl bg-background/20 p-2.5">
                <TrendingUp className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs ">Sekolah + Vendor + Driver</p>
          </CardContent>
        </Card>

        <RegStatCard
          label="Sekolah"
          icon={GraduationCap}
          total={schoolState.data.length}
          pending={pendingOf(schoolState.data)}
          approved={approvedOf(schoolState.data)}
        />

        <RegStatCard
          label="Vendor"
          icon={UtensilsCrossed}
          total={vendorState.data.length}
          pending={pendingOf(vendorState.data)}
          approved={approvedOf(vendorState.data)}
        />

        <RegStatCard
          label="Driver"
          icon={Truck}
          total={driverState.data.length}
          pending={pendingOf(driverState.data)}
          approved={approvedOf(driverState.data)}
        />
      </div>

      <div className="space-y-8">
        <span className="text-lg font-semibold block mb-3 ">
          <GraduationCap className="h-5 w-5 inline mr-2" />
          Data Sekolah Penerima Program MBG
        </span>
        <SchoolSummaryDashboard summary={summaryData} loading={loading} />
      </div>
      <div>
        <h2 className="text-lg font-semibold mb-3 ">
          {/* lucide icon */}
          <FileText className="h-5 w-5 inline mr-2" />
          Ringkasan Laporan Vendor Dan Distribusi Menu
        </h2>
        {loadingLaporan ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-24 rounded-lg bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <LaporanSummary summary={laporanSummary} />
        )}
      </div>
    </div>
  );
}
