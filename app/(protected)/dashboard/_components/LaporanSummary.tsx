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
    },
    {
      label: "Menunggu Investigasi",
      value: summary.pending,
    },
    {
      label: "Sedang Diproses",
      value: summary.onProgress,
    },
    {
      label: "Selesai",
      value: summary.resolved,
    },
    {
      label: "Ditolak",
      value: summary.rejected,
    },
  ];

  return (
    <div className="grid grid-cols-2 :grid-cols-5 gap-4">
      {stats.map((stat) => (
        <Card
          key={stat.label}
          className="border-0 bg-primary text-primary-foreground "
        >
          <CardContent>
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
