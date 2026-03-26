/* ============================================================================
   useVendorData — Real-time hook for vendor list
   ============================================================================ */

"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/lib/types/vendor";
import { subscribeToVendors } from "@/lib/vendor-service";

export function useVendorData() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToVendors((data) => {
      setVendors(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { vendors, loading, error };
}
