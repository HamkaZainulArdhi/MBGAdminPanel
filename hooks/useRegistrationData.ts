/* ============================================================================
   useRegistrationData — Custom hook for registration data + actions
   ============================================================================ */

"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import {
  fetchRegistrations,
  subscribeToRegistrations,
  approveRegistration,
  rejectRegistration,
  assignVendorToSchool,
  assignDriverToSchool,
} from "@/lib/registration-service";
import { RegistrationData, RegistrationType } from "@/lib/types/registration";

interface UseRegistrationDataOptions {
  includeApproved?: boolean;
  realTime?: boolean;
}

interface UseRegistrationDataReturn {
  data: RegistrationData[];
  loading: boolean;
  error: string | null;
  isActionLoading: boolean;
  approve: (id: string) => Promise<void>;
  reject: (id: string, reason: string) => Promise<void>;
  assignVendor: (schoolId: string, vendorEmail: string) => Promise<void>;
  assignDriver: (schoolId: string, driverId: string) => Promise<void>;
  clearError: () => void;
  refetch: () => Promise<void>;
}

export function useRegistrationData(
  type: RegistrationType,
  options: UseRegistrationDataOptions = {},
): UseRegistrationDataReturn {
  const { includeApproved = false, realTime = true } = options;

  const [data, setData] = useState<RegistrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isActionLoading, setIsActionLoading] = useState(false);

  // Keep a stable ref to unsubscribe fn to avoid stale closure issues
  const unsubRef = useRef<(() => void) | null>(null);

  const load = useCallback(async () => {
    // Tear down any existing subscription before re-fetching
    unsubRef.current?.();
    unsubRef.current = null;

    setLoading(true);
    setError(null);

    try {
      if (realTime) {
        unsubRef.current = subscribeToRegistrations(
          type,
          (newData) => {
            setData(newData);
            setLoading(false);
          },
          includeApproved,
        );
      } else {
        const result = await fetchRegistrations(type, includeApproved);
        setData(result);
        setLoading(false);
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error occurred";
      setError(message);
      setLoading(false);
    }
  }, [type, includeApproved, realTime]);

  useEffect(() => {
    load();
    return () => {
      unsubRef.current?.();
      unsubRef.current = null;
    };
  }, [load]);

  // ------- Actions -----------------------------------------------------------

  const withActionLoading = useCallback(
    async (fn: () => Promise<void>) => {
      try {
        setIsActionLoading(true);
        await fn();
      } catch (err) {
        const message = err instanceof Error ? err.message : "Action failed";
        setError(message);
        throw err;
      } finally {
        setIsActionLoading(false);
      }
    },
    [],
  );

  const approve = useCallback(
    (id: string) =>
      withActionLoading(() => approveRegistration(type, id)),
    [type, withActionLoading],
  );

  const reject = useCallback(
    (id: string, reason: string) =>
      withActionLoading(() => rejectRegistration(type, id, reason)),
    [type, withActionLoading],
  );

  const assignVendor = useCallback(
    (schoolId: string, vendorEmail: string) =>
      withActionLoading(() => assignVendorToSchool(schoolId, vendorEmail)),
    [withActionLoading],
  );

  const assignDriver = useCallback(
    (schoolId: string, driverId: string) =>
      withActionLoading(() => assignDriverToSchool(schoolId, driverId)),
    [withActionLoading],
  );

  const clearError = useCallback(() => setError(null), []);

  return {
    data,
    loading,
    error,
    isActionLoading,
    approve,
    reject,
    assignVendor,
    assignDriver,
    clearError,
    refetch: load,
  };
}
