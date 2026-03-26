/* ============================================================================
   VendorRatingCard — Display reviews and ratings from schools
   ============================================================================ */

"use client";

import { VendorRating } from "@/lib/types/vendor";
import { useVendorRatings } from "@/hooks/useVendorRatings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Star, MessageSquare, Loader2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

interface VendorRatingCardProps {
  vendorId: string;
}

export function VendorRatingCard({ vendorId }: VendorRatingCardProps) {
  const { ratings, loading } = useVendorRatings(vendorId);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy", { locale: idLocale });
    } catch {
      return dateStr;
    }
  };

  const averageRating = ratings.length > 0
    ? (ratings.reduce((acc, r) => acc + r.rating, 0) / ratings.length).toFixed(1)
    : "0.0";

  return (
    <Card className="overflow-hidden border-border/40 shadow-sm mt-4 p-0">
      <CardHeader className=" p-4 bg-primary border-b border-border/20">
        <CardTitle className="flex items-center justify-between text-sm font-bold uppercase text-white">

          <div className="flex items-center gap-2">
            <Star className="h-4 w-4 shrink-0 text-amber-400 fill-amber-400" />
            Rating & Ulasan Sekolah
          </div>

          {ratings.length > 0 && (
            <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-white/10 text-white text-xs">
              <Star className="h-3 w-3 fill-current" />
              {averageRating} ({ratings.length})
            </div>
          )}

        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        {loading ? (
          <div className="flex items-center justify-center py-12 text-muted-foreground">
            <Loader2 className="h-5 w-5 animate-spin mr-2" />
            Memuat ulasan…
          </div>
        ) : ratings.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-muted-foreground text-center px-6">
            <MessageSquare className="h-8 w-8 mb-2 opacity-20" />
            <p className="text-sm font-medium">Belum ada ulasan dari sekolah</p>
            <p className="text-xs">Rating akan muncul setelah sekolah memberikan penilaian.</p>
          </div>
        ) : (
          <div className="divide-y divide-border/30">
            {ratings.map((item) => (
              <div key={item.id} className="p-5 space-y-2 hover:bg-muted/10 transition-colors">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-primary">{item.fromSchool}</span>
                  <div className="flex items-center gap-0.5">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        className={`h-3 w-3 ${s <= item.rating
                            ? "fill-amber-500 text-amber-500"
                            : "text-muted-foreground/30"
                          }`}
                      />
                    ))}
                  </div>
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed italic">
                  "{item.review}"
                </p>
                <div className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-medium uppercase tracking-wider">
                  <Calendar className="h-3 w-3" />
                  {formatDate(item.timestamp)}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
