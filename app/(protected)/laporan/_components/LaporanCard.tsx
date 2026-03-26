import { AnomalyReportWithRelation } from "@/lib/types/laporan";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { StatusBadge } from "./StatusBadge";
import Link from "next/link";
import {
  AlertCircle,
  Building2,
  ShoppingCart,
  MapPin,
  ArrowRight,
} from "lucide-react";

interface LaporanCardProps {
  report: AnomalyReportWithRelation;
}

export function LaporanCard({ report }: LaporanCardProps) {
  return (
    <Link href={`/laporan/${report.id}`}>
      <Card className="p-0 hover:shadow-lg transition-shadow">
        <CardContent className="space-y-2 p-3">
          {/* Header & Status */}
          <div className="flex items-start justify-between">
            <div className="space-y-1 flex-1">
              <h3 className="font-bold text-base">{report.category}</h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
                <AlertCircle className="h-3 w-3" />
                <span>{report.date}</span>
              </div>
            </div>
            <StatusBadge status={report.status} />
          </div>

          {/* School Info */}
          <div className="flex items-center gap-2 py-1 text-xs font-semibold">
            <span className="text-muted-foreground">Pelapor :</span>
            <div className="flex items-center gap-1.5">
              <Building2 className="h-3 w-3" />
              <span className="truncate">{report.schoolName}</span>
            </div>
          </div>

          {/* Vendor Info */}
          {report.vendorName && report.vendorName !== "—" && (
            <div className="space-y-1.5">
              <p className="text-xs font-semibold text-muted-foreground">
                Vendor Dilaporkan :
              </p>
              <div className="bg-muted/40 p-3 rounded-lg border border-border/10 space-y-1.5">
                <div className="flex items-center gap-2 text-xs">
                  <ShoppingCart className="h-3.5 w-3.5 text-primary/70 shrink-0" />
                  <span className="font-medium">{report.vendorName}</span>
                </div>
                {report.vendorOwnerName && report.vendorOwnerName !== "—" && (
                  <div className="text-xs text-muted-foreground ml-5">
                    Pemilik: {report.vendorOwnerName}
                  </div>
                )}
                {report.vendorLocation && report.vendorLocation !== "—" && (
                  <div className="flex items-start gap-2 text-xs text-muted-foreground">
                    <MapPin className="h-3.5 w-3.5 mt-0.5 shrink-0" />
                    <span className="leading-relaxed">
                      {report.vendorLocation}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex items-center justify-end p-3">
          <div className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline uppercase tracking-widest transition-all">
            Lihat Detail <ArrowRight className="h-3 w-3" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
