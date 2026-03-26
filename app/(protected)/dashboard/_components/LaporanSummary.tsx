import { AnomalyReportSummary } from "@/lib/types/laporan";
import { Card, CardContent } from "@/components/ui/card";

interface LaporanSummaryProps {
  summary: AnomalyReportSummary;
}

export function LaporanSummary({ summary }: LaporanSummaryProps) {
  const stats = [
    {
      label: "Total Laporan",
      value: summary.total,
      className: "bg-blue-50 dark:bg-blue-950 text-blue-900 dark:text-blue-100",
    },
    {
      label: "Menunggu Investigasi",
      value: summary.pending,
      className:
        "bg-yellow-50 dark:bg-yellow-950 text-yellow-900 dark:text-yellow-100",
    },
    {
      label: "Sedang Diproses",
      value: summary.onProgress,
      className:
        "bg-purple-50 dark:bg-purple-950 text-purple-900 dark:text-purple-100",
    },
    {
      label: "Selesai",
      value: summary.resolved,
      className:
        "bg-green-50 dark:bg-green-950 text-green-900 dark:text-green-100",
    },
    {
      label: "Ditolak",
      value: summary.rejected,
      className: "bg-red-50 dark:bg-red-950 text-red-900 dark:text-red-100",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className={`${stat.className} border-0`}>
          <CardContent className="pt-6">
            <div className="flex flex-col items-start">
              <p className="text-xs font-semibold uppercase tracking-wide opacity-75">
                {stat.label}
              </p>
              <p className="text-3xl font-bold mt-2">{stat.value}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
