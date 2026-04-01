"use client";

import { useEffect, useState } from "react";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { RegistrationData, RegistrationType } from "@/lib/types/registration";
import { normaliseRegistration } from "@/lib/firestore-helpers";

/**
 * Hook to subscribe to a single registration document (driver, school, or vendor).
 * Real-time updates as soon as Firestore data changes.
 *
 * Perfect for keeping UI in sync after create/update operations.
 *
 * Usage:
 * const { data, isLoading, error } = useRegistrationDetail("driver", driverId);
 *
 * @param type - "school" | "vendor" | "driver"
 * @param id - Document ID to subscribe to
 * @returns { data, isLoading, error }
 */

const COLLECTION_MAP: Record<RegistrationType, string> = {
  school: "schools",
  vendor: "vendors",
  driver: "drivers",
};

export function useRegistrationDetail(
  type: RegistrationType | null,
  id: string | null | undefined,
) {
  const [data, setData] = useState<RegistrationData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // If no type or id, clear data
    if (!type || !id) {
      setData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const collectionName = COLLECTION_MAP[type];
      const docRef = doc(db, collectionName, id);

      // Subscribe to real-time updates
      const unsubscribe = onSnapshot(
        docRef,
        (snap) => {
          if (snap.exists()) {
            try {
              const normalized = normaliseRegistration(
                { id: snap.id, ...snap.data() },
                type,
              );
              setData(normalized);
              setError(null);
            } catch (err) {
              console.error("Error normalizing registration data:", err);
              setError("Failed to normalize data");
            }
          } else {
            // Document doesn't exist
            setData(null);
            setError(null);
          }
          setIsLoading(false);
        },
        (err) => {
          console.error("Error listening to registration detail:", err);
          setError(err instanceof Error ? err.message : "Unknown error");
          setIsLoading(false);
        },
      );

      return () => unsubscribe();
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error setting up registration detail subscription:", err);
      setError(msg);
      setIsLoading(false);
    }
  }, [type, id]);

  return { data, isLoading, error };
}
