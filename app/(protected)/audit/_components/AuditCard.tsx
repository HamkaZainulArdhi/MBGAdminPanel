"use client";

import { VendorAuditReport } from "@/lib/types/audit";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  User,
  ChefHat,
  ArrowRight,
  Building2,
  Activity,
  AlertCircle
} from "lucide-react";
import Link from "next/link";
import { formatDatetimeReadable } from "@/lib/utils";

interface AuditCardProps {
  audit: VendorAuditReport;
}

export function AuditCard({ audit }: AuditCardProps) {
  // Extract simple status from JSON if needed
  let aiStatus = audit.hasil_ai;
  if (aiStatus.startsWith("{")) {
    try {
      const parsed = JSON.parse(aiStatus);
      const firstKey = Object.keys(parsed)[0];
      if (firstKey && parsed[firstKey].STATUS) {
        aiStatus = parsed[firstKey].STATUS;
      } else if (firstKey && parsed[firstKey].status) {
        aiStatus = parsed[firstKey].status;
      }
    } catch (e) {
      // stay as is
    }
  }

  const isOk = aiStatus.toUpperCase().includes("OK") || aiStatus.toUpperCase().includes("LULUS");

  return (
    <Link href={`/audit/${audit.vendorEmail}/${audit.id}`}>
      <Card className="p-0 hover:shadow-lg transition-all border-border/40 shadow-sm overflow-hidden group">
        <CardContent className="space-y-4 p-4">
          {/* Header: Vendor & Date */}
          <div className="flex items-center justify-between">
            <span className="text-base  font-semibold">
              {audit.vendorEmail}
            </span>

            <Badge
              variant="outline"
              className="text-[10px] font-mono bg-muted/30"
            >
              {audit.id}
            </Badge>
          </div>

          {/* Menu Name */}
          <div className="space-y-1.5">
            <p className="text-xs text-muted-foreground  font-semibold">
              Menu Hari Ini
            </p>
            <h3 className="text-sm font-bold leading-snug line-clamp-2 min-h-10">
              {audit.nama_menu}
            </h3>
          </div>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 gap-4 py-2 border-y border-border/5">
            <div className="space-y-2">
              <p className=" text-xs text-muted-foreground  font-semibold flex items-center gap-1">
                <ChefHat className="h-3 w-3" /> Porsi Realisasi
              </p>
              <div className="flex items-end gap-1.5">
                <span className="text-lg font-black leading-none">
                  {audit.porsi_realisasi}
                </span>
                <span className="text-[10px] text-muted-foreground font-medium">
                  / {audit.porsi_target}
                </span>
              </div>
            </div>
            <div className="space-y-2">
              <p className="text-xs text-muted-foreground  font-semibold flex items-center gap-1">
                <Activity className="h-3 w-3" /> AI Status
              </p>
              <Badge variant={isOk ? "success" : "destructive"}>
                {aiStatus}
              </Badge>
            </div>
          </div>

          {/* Footer Info */}
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Calendar className="h-3 w-3" />
            <span>Submit: {formatDatetimeReadable(audit.waktu_submit)}</span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end p-3 bg-muted/10 border-t border-border/5">
          <div className="flex items-center gap-1 text-xs text-primary font-semibold opacity-0 hover:underline transition-all uppercase ">
            Lihat Dashboard <ArrowRight className="h-3 w-3" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
