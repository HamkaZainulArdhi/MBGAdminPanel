"use client";

import { useState } from "react";
import { useSchoolReports } from "./_components/useSchoolReports";
import { SchoolTable } from "./_components/SchoolTable";
import { SchoolDetailDialog } from "./_components/SchoolDetailDialog";
import { School } from "@/lib/types/registration";

export default function LaporanSekolahPage() {
  const { schools, loading, summaryData, driverNames, vendorNames } = useSchoolReports();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  return (
    <div className="flex-1 max-w-[140vh] overflow-hidden space-y-6">
      <div className="flex flex-col gap-1.5">
        <h1 className="text-3xl font-bold tracking-tight">Laporan Sekolah</h1>
        <p className="text-muted-foreground text-sm">
          Monitoring operasional &amp; distribusi makanan
        </p>
      </div>

      <div className="space-y-4">
        <SchoolTable
          schools={schools}
          loading={loading}
          driverNames={driverNames}
          vendorNames={vendorNames}
          onDetailClick={(school) => setSelectedSchool(school)}
        />
      </div>

      <SchoolDetailDialog
        school={selectedSchool}
        isOpen={!!selectedSchool}
        driverNames={driverNames}
        vendorNames={vendorNames}
        onClose={() => setSelectedSchool(null)}
      />
    </div>
  );
}
