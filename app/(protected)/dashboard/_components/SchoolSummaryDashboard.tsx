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
      <div className="flex flex-col gap-4">
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
        <Card className="shadow-sm rounded-xl">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
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
        <Card className="shadow-sm rounded-xl h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Distribusi Sekolah
            </CardTitle>
            <PieChart className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <PieChartVisualization data={missingData} loading={loading} />
            <div className="flex justify-between mt-4 text-xs">
              {missingData.map((d) => (
                <span key={d.label} className="flex items-center gap-1">
                  <span
                    style={{ background: d.color }}
                    className="inline-block w-2 h-2 rounded-full"
                  ></span>
                  {d.label}:{" "}
                  <b>
                    {loading ? (
                      <Skeleton className="inline-block w-6 h-3" />
                    ) : (
                      d.value
                    )}
                  </b>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bar Chart for students and porsi */}
      <div className="flex flex-col gap-4">
        <Card className="shadow-sm rounded-xl h-full flex flex-col">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Analisis Siswa & Porsi
            </CardTitle>
            <BarChart2 className="h-5 w-5 text-primary" />
          </CardHeader>
          <CardContent className="flex-1 flex flex-col justify-center">
            <BarChartVisualization data={barData} loading={loading} />
            <div className="flex justify-between mt-4 text-xs">
              {barData.map((d) => (
                <span key={d.label} className="flex items-center gap-1">
                  <span
                    style={{ background: d.color }}
                    className="inline-block w-2 h-2 rounded-full"
                  ></span>
                  {d.label}:{" "}
                  <b>
                    {loading ? (
                      <Skeleton className="inline-block w-6 h-3" />
                    ) : (
                      d.value.toLocaleString("id-ID")
                    )}
                  </b>
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

// Pie chart visualization (SVG, no external lib)
function PieChartVisualization({
  data,
  loading,
}: {
  data: { label: string; value: number; color: string }[];
  loading: boolean;
}) {
  const total = data.reduce((sum, d) => sum + d.value, 0) || 1;
  let startAngle = 0;
  const radius = 40;
  const cx = 50;
  const cy = 50;

  return (
    <svg width={100} height={100} viewBox="0 0 100 100" className="mx-auto">
      {data.map((d, i) => {
        const angle = (d.value / total) * 360;
        const x1 = cx + radius * Math.cos((Math.PI * startAngle) / 180);
        const y1 = cy + radius * Math.sin((Math.PI * startAngle) / 180);
        const x2 =
          cx + radius * Math.cos((Math.PI * (startAngle + angle)) / 180);
        const y2 =
          cy + radius * Math.sin((Math.PI * (startAngle + angle)) / 180);
        const largeArc = angle > 180 ? 1 : 0;
        const pathData = `M${cx},${cy} L${x1},${y1} A${radius},${radius} 0 ${largeArc} 1 ${x2},${y2} Z`;
        const prevAngle = startAngle;
        startAngle += angle;
        return (
          <path
            key={d.label}
            d={pathData}
            fill={d.color}
            opacity={loading ? 0.3 : 1}
          />
        );
      })}
      <circle
        cx={cx}
        cy={cy}
        r={radius}
        fill="#f3f4f6"
        opacity={loading ? 1 : 0}
      />
      <text
        x={cx}
        y={cy}
        textAnchor="middle"
        dominantBaseline="middle"
        fontSize="14"
        fill="#222"
      >
        {loading ? "..." : total}
      </text>
    </svg>
  );
}

// Bar chart visualization (SVG, no external lib)
function BarChartVisualization({
  data,
  loading,
}: {
  data: { label: string; value: number; color: string }[];
  loading: boolean;
}) {
  const max = Math.max(...data.map((d) => d.value), 1);
  return (
    <svg width={120} height={60} viewBox="0 0 120 60" className="mx-auto">
      {data.map((d, i) => {
        const barHeight = loading ? 10 : (d.value / max) * 40;
        return (
          <rect
            key={d.label}
            x={10 + i * 50}
            y={50 - barHeight}
            width={30}
            height={barHeight}
            fill={d.color}
            opacity={loading ? 0.3 : 1}
            rx={4}
          />
        );
      })}
      {/* Axis */}
      <line x1={0} y1={50} x2={120} y2={50} stroke="#ccc" strokeWidth={1} />
    </svg>
  );
}

