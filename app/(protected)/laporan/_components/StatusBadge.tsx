import { Badge } from "@/components/ui/badge";
import { AnomalyReportStatus } from "@/lib/types/laporan";

interface StatusBadgeProps {
  status: AnomalyReportStatus;
}

const statusConfig: Record<
  AnomalyReportStatus,
  {
    label: string;
    variant: "default" | "secondary" | "destructive" | "outline";
  }
> = {
  PENDING_INVESTIGATION: {
    label: "Menunggu Investigasi",
    variant: "outline",
  },
  ON_PROGRESS: {
    label: "Sedang Diproses",
    variant: "secondary",
  },
  RESOLVED: {
    label: "Selesai",
    variant: "default",
  },
  REJECTED: {
    label: "Ditolak",
    variant: "destructive",
  },
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status] || {
    label: String(status || "Unknown"),
    variant: "outline" as const,
  };
  return (
    <Badge variant={config.variant} className="w-fit">
      {config.label}
    </Badge>
  );
}
