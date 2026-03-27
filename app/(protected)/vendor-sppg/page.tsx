"use client";

import { useVendorData } from "@/hooks/useVendorData";
import { VendorList } from "./_components/VendorList";

export default function VendorSppgPage() {
  const { vendors, loading } = useVendorData();

  return (
    <div className="flex flex-col space-y-6">
      <div className="flex flex-col  gap-2">
        <h1 className="text-3xl font-bold tracking-tight">Vendor SPPG</h1>
        <p className="text-muted-foreground ">
          Daftar vendor yang terdaftar dalam sistem SPPG MBG
        </p>
      </div>
      <VendorList vendors={vendors} loading={loading} />
    </div>
  );
}
