/* ============================================================================
   useVendorRatings — Real-time hook for vendor reviews
   ============================================================================ */

"use client";

import { useState, useEffect } from "react";
import { VendorRating } from "@/lib/types/vendor";
import { subscribeToVendorRatings } from "@/lib/vendor-service";

export function useVendorRatings(targetId: string | undefined) {
  const [ratings, setRatings] = useState<VendorRating[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!targetId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    const unsubscribe = subscribeToVendorRatings(targetId, (data) => {
      setRatings(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [targetId]);

  return { ratings, loading, error };
}
