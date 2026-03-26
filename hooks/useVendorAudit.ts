"use client";

import { useState, useEffect } from "react";
import { VendorAuditReport } from "@/lib/types/audit";
import { subscribeToVendorAudits } from "@/lib/audit-service";

export function useVendorAudit() {
  const [audits, setAudits] = useState<VendorAuditReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToVendorAudits((data) => {
      setAudits(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { audits, loading };
}
