"use client";

import { VendorAuditReport } from "@/lib/types/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Lightbulb, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AIInsightSectionProps {
  audit: VendorAuditReport;
}

export function AIInsightSection({ audit }: AIInsightSectionProps) {
  const isOk = audit.hasil_ai.toUpperCase().includes("LULUS");
  
  return (
    <Card className="border-primary/20 p-0 bg-primary/5 shadow-md overflow-hidden">
      <CardHeader className="p-3 border-b border-primary/10 bg-primary/10">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-black flex items-center gap-2 text-primary">
            <Lightbulb className="h-5 w-5" />
            AI Operational Insight
          </CardTitle>
          <Badge 
            variant={isOk ? "success" : "destructive"} 
            className="px-3"
          >
            {isOk ? (
              <CheckCircle2 className="h-3.5 w-3.5 mr-1.5" />
            ) : (
              <AlertTriangle className="h-3.5 w-3.5 mr-1.5" />
            )}
            {audit.hasil_ai}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="p-5 space-y-4">
        <div className="flex gap-4">
          <div className="p-3 rounded-2xl bg-background border border-border/50 shadow-sm rounded-full h-fit">
            <AlertCircle className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h4 className="text-sm font-black uppercase tracking-widest text-primary/80">Temuan Utama & Analisis</h4>
            <p className="text-sm leading-relaxed font-medium">
              {audit.alasan_utama || "Tidak ada analisis mendalam untuk periode ini."}
            </p>
          </div>
        </div>

        {!isOk && (
          <div className="p-4 rounded-xl bg-destructive/10 border border-destructive/20 mt-4">
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="h-4 w-4 text-destructive" />
              <span className="text-xs font-black uppercase tracking-tighter text-destructive">Tindakan Diperlukan</span>
            </div>
            <p className="text-xs font-medium text-destructive/80">
              Sistem mendeteksi anomali pada data realisasi atau kualitas dokumentasi. Mohon periksa detail kategori atau foto yang dilampirkan.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
