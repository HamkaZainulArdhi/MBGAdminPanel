/* ============================================================================
   useVendorDetail — Hook for single vendor detail
   ============================================================================ */

"use client";

import { useState, useEffect } from "react";
import { Vendor } from "@/lib/types/vendor";
import { getVendorById } from "@/lib/vendor-service";

export function useVendorDetail(id: string | undefined) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!id) {
      setLoading(false);
      return;
    }

    setLoading(true);
    getVendorById(id)
      .then(setVendor)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [id]);

  return { vendor, loading, error };
}
