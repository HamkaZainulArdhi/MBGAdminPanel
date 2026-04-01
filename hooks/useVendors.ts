"use client";

import { useEffect, useState, useCallback } from "react";
import { Vendor } from "@/lib/types/registration";
import { getAllVendors, subscribeToVendors } from "@/lib/registration-service";

/**
 * Hook to fetch approved vendors, optionally filtered to only those with drivers.
 *
 * Usage:
 * const { vendors, isLoading, error } = useVendors({ withDriversOnly: true });
 */
export function useVendors(options: { withDriversOnly?: boolean } = {}) {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { withDriversOnly = false } = options;

  useEffect(() => {
    setIsLoading(true);
    setError(null);

    // Subscribe to real-time updates
    const unsubscribe = subscribeToVendors(
      (data) => {
        setVendors(data);
        setIsLoading(false);
      },
      true, // approvedOnly
      withDriversOnly,
    );

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, [withDriversOnly]);

  return { vendors, isLoading, error };
}

/**
 * Hook to fetch a single vendor by ID using real-time subscription.
 *
 * Usage:
 * const { vendor, isLoading } = useVendor(vendorId);
 */
export function useVendor(vendorId: string | null | undefined) {
  const [vendor, setVendor] = useState<Vendor | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!vendorId) {
      setVendor(null);
      return;
    }

    setIsLoading(true);

    const unsubscribe = subscribeToVendors((vendors) => {
      const found = vendors.find((v) => v.id === vendorId);
      setVendor(found || null);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [vendorId]);

  return { vendor, isLoading };
}
