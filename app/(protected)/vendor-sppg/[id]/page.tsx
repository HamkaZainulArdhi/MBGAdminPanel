/* ============================================================================
   VendorDetailPage — Dynamic route for a single vendor detail
   ============================================================================ */

"use client";

import { useParams } from "next/navigation";
import { useVendorDetail } from "@/hooks/useVendorDetail";
import { VendorDetail } from "../_components/VendorDetail";
import { VendorRatingCard } from "../_components/VendorRatingCard";
import { Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function VendorDetailPage() {
  const params = useParams();
  const rawId = params?.id as string;
  const id = rawId ? decodeURIComponent(rawId) : "";
  
  const { vendor, loading, error } = useVendorDetail(id);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-muted-foreground gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary/40" />
        <div className="flex flex-col items-center gap-1">
          <p className="font-bold text-lg animate-pulse">Memuat Profil Vendor…</p>
          <p className="text-xs uppercase tracking-widest font-semibold opacity-60">Mohon Tunggu Sebentar</p>
        </div>
      </div>
    );
  }

  if (error || !vendor) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-center px-6">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-6">
          <AlertCircle className="h-8 w-8 text-destructive" />
        </div>
        <h2 className="text-2xl font-bold tracking-tight">Vendor Tidak Ditemukan</h2>
        <p className="text-muted-foreground mt-2 max-w-sm">
          Maaf, data vendor yang Anda cari tidak tersedia atau terjadi kesalahan saat mengambil data.
        </p>
        <Link href="/vendor-sppg" className="mt-8">
          <Button variant="outline">Kembali ke Daftar Vendor</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      <VendorDetail vendor={vendor} />
      <VendorRatingCard vendorId={vendor.id || ""} />
    </div>
  );
}
