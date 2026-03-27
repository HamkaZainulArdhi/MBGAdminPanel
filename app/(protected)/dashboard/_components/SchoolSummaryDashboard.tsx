"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  GraduationCap,
  UtensilsCrossed,
  Users,
  Store,
  Truck,
  PieChart,
  BarChart2,
  AlertTriangle,
} from "lucide-react";
import { SchoolReportSummary } from "../../sekolah/_components/useSchoolReports";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChartCard } from "./PieChartCard";
import { BarChartCard } from "./BarChartCard";

interface SchoolSummaryDashboardProps {
  summary: SchoolReportSummary;
  loading: boolean;
}

export function SchoolSummaryDashboard({
  summary,
  loading,
}: SchoolSummaryDashboardProps) {
  // Pie chart data for missing vendor/driver
  const missingData = [
    { label: "Tanpa Vendor", value: summary.missingVendor, color: "#ef4444" },
    { label: "Tanpa Driver", value: summary.missingDriver, color: "#f59e42" },
    {
      label: "Lengkap",
      value:
        summary.totalActive - summary.missingVendor - summary.missingDriver,
      color: "#22c55e",
    },
  ];

  // Bar chart data for students and porsi
  const barData = [
    { label: "Siswa", value: summary.totalStudents, color: "#22c55e" },
    { label: "Porsi Harian", value: summary.totalPorsi, color: "#f59e42" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Summary Cards */}
      <div className="flex flex-col gap-4 h-full">
        <Card className="shadow-sm rounded-xl flex-1">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Sekolah Aktif
            </CardTitle>
            <GraduationCap className="h-5 w-5 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                summary.totalActive
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Total sekolah yang telah disetujui
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-xl flex-1">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Siswa
            </CardTitle>
            <Users className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                summary.totalStudents.toLocaleString("id-ID")
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Data siswa terakhir
            </p>
          </CardContent>
        </Card>
        <Card className="shadow-sm rounded-xl flex-1">
          <CardHeader className="flex flex-row items-center justify-between ">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Total Porsi Harian
            </CardTitle>
            <UtensilsCrossed className="h-5 w-5 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                summary.totalPorsi.toLocaleString("id-ID")
              )}
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Keseluruhan target porsi
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Pie Chart for missing vendor/driver */}
      <div className="flex flex-col gap-4">
        <PieChartCard data={missingData} loading={loading} />
      </div>

      {/* Bar Chart for students and porsi */}
      <div className="flex flex-col gap-4">
        <BarChartCard data={barData} loading={loading} />
      </div>
    </div>
  );
}
