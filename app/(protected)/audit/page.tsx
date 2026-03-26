"use client";

import { useVendorAudit } from "@/hooks/useVendorAudit";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Files } from "lucide-react";
import { AuditCard } from "./_components/AuditCard";

export default function AuditPage() {
  const { audits, loading } = useVendorAudit();

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-muted-foreground">
        <Loader2 className="h-10 w-10 animate-spin mb-4 text-primary/30" />
        <p>Memuat data audit vendor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold tracking-tight">Audit Vendor</h1>
        <p className="text-sm text-muted-foreground">
          Monitor performa operasional dan validasi laporan harian vendor.
        </p>
      </div>

      {audits.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center justify-center py-20 text-center">
            <Files className="h-12 w-12 text-muted-foreground/20 mb-4" />
            <h3 className="text-lg font-semibold">Belum Ada Laporan</h3>
            <p className="text-sm text-muted-foreground max-w-xs mx-auto">
              Tidak ada riwayat laporan vendor yang ditemukan di sistem.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {audits.map((audit) => (
            <AuditCard key={`${audit.vendorEmail}-${audit.id}`} audit={audit} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilesIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.5 2H8.6c-.4 0-.8.2-1.1.5-.3.3-.5.7-.5 1.1v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8c.4 0 .8-.2 1.1-.5.3-.3.5-.7.5-1.1V6.5L15.5 2z" />
      <path d="M3 7.6v12.8c0 .4.2.8.5 1.1.3.3.7.5 1.1.5h9.8" />
      <path d="M15 2v5h5" />
    </svg>
  );
}
