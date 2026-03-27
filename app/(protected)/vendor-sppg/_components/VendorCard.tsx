/* ============================================================================
   VendorCard — Grid item for vendor list
   ============================================================================ */

"use client";

import Link from "next/link";
import { Vendor } from "@/lib/types/vendor";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Star, MapPin, User, ArrowRight, StarIcon } from "lucide-react";

interface VendorCardProps {
  vendor: Vendor;
}

export function VendorCard({ vendor }: VendorCardProps) {
  const isApproved = vendor.isApproved;
  const rating = Number(vendor.averageRating || 0);
  const displayId = vendor.vendorId || vendor.id;

  return (
    <Link href={`/vendor-sppg/${displayId}`}>
      <Card className="p-0">
        <CardContent className="space-y-2 p-3">
          {/* Header & Status */} 
          <div className="flex items-start justify-between ">
            <div className="space-y-2">
              <h3 className="font-bold text-base">
                {vendor.name}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-semibold ">
                Pemilik :
                <User className="h-3 w-3 text-foreground " />
                <span className="text-foreground">{vendor.ownerName} </span>
              </div>
            </div>
            <Badge
              variant={isApproved ? "success-light" : "warning-light"}
            >
              {isApproved ? "Disetujui" : "Belum Disetujui"}
            </Badge>
          </div>

          {/* Rating & Stats */}
          <div className="flex items-center gap-2 py-1 text-xs font-semibold">
            <span className="text-muted-foreground">Rating Dapur :</span>
            <Badge variant="warning" className="gap-1 px-2 h-6 font-bold tabular-nums">
              <Star className="h-3 w-3 fill-current" />
              {rating > 0 ? rating.toFixed(1) : "—"}
            </Badge>
          </div>

          {/* Location */}
          <div className="flex items-start gap-2 text-xs text-muted-foreground bg-muted/40 p-3 rounded-lg border border-border/10">
            <MapPin className="h-3.5 w-3.5 mt-0.5 text-primary/70 shrink-0" />
            <span className="leading-relaxed">
              {vendor.location || "Lokasi belum ditentukan"}
            </span>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-end p-3 ">
          <div className="flex items-center gap-1 text-[10px] text-primary font-bold hover:underline uppercase tracking-widest transition-all">
            Lihat Detail <ArrowRight className="h-3 w-3" />
          </div>
        </CardFooter>
      </Card>
      
    </Link>
  );
}
