/* ============================================================================
   VendorList — Grid layout for vendor cards
   ============================================================================ */

"use client";

import { Vendor } from "@/lib/types/vendor";
import { VendorCard } from "./VendorCard";
import { Loader2, Inbox } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

interface VendorListProps {
  vendors: Vendor[];
  loading: boolean;
}

export function VendorList({ vendors, loading }: VendorListProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[200px] rounded-xl border border-border/50 bg-card/50 p-5 space-y-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2 flex-1">
                <Skeleton className="h-5 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <Skeleton className="h-5 w-16" />
            </div>
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-12 w-full" />
          </div>
        ))}
      </div>
    );
  }

  if (vendors.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-muted/20 rounded-3xl border border-dashed border-border/50">
        <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center mb-4">
          <Inbox className="h-8 w-8 text-muted-foreground/50" />
        </div>
        <h3 className="text-lg font-semibold tracking-tight">Tidak Ada Vendor</h3>
        <p className="text-sm text-muted-foreground mt-1 max-w-xs">
          Belum ada data vendor yang tersedia di sistem saat ini.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
      {vendors.map((vendor) => (
        <VendorCard key={vendor.id} vendor={vendor} />
      ))}
    </div>
  );
}
