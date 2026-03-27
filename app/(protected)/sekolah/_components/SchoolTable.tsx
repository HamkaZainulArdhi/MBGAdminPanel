"use client";

import { useState, useMemo } from "react";
import { Card, CardFooter } from "@/components/ui/card";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { School } from "@/lib/types/registration";
import { SchoolTableFilters } from "./SchoolTableFilters";
import { SchoolDataTable } from "./SchoolDataTable";

// ── component ──
interface SchoolTableProps {
  schools: School[];
  loading: boolean;
  driverNames: Record<string, string>;
  vendorNames: Record<string, string>;
  onDetailClick: (school: School) => void;
}

export function SchoolTable({
  schools,
  loading,
  driverNames,
  vendorNames,
  onDetailClick,
}: SchoolTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusDistribusiFilter, setStatusDistribusiFilter] = useState("all");
  const [jenjangFilter, setJenjangFilter] = useState("all");
  const [statusSekolahFilter, setStatusSekolahFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const PER_PAGE = 10;

  // Extract unique jenjang and status
  const uniqueJenjangs = useMemo(() => {
    const jenjangs = new Set<string>();
    schools.forEach((s) => {
      if (s.level) jenjangs.add(s.level);
    });
    return Array.from(jenjangs).sort();
  }, [schools]);

  const uniqueStatuses = useMemo(() => {
    const statuses = new Set<string>();
    schools.forEach((s) => {
      if (s.status) statuses.add(s.status);
    });
    return Array.from(statuses).sort();
  }, [schools]);

  // Create label mappings for display
  const jenjangLabels = useMemo(() => {
    const labels: Record<string, string> = {};
    uniqueJenjangs.forEach((jenjang) => {
      labels[jenjang] = jenjang.toUpperCase();
    });
    return labels;
  }, [uniqueJenjangs]);

  const statusLabels = useMemo(() => {
    return uniqueStatuses.reduce(
      (acc, status) => ({ ...acc, [status]: status }),
      {} as Record<string, string>,
    );
  }, [uniqueStatuses]);

  const statusDistribusiLabels = useMemo(
    () => ({
      all: "Semua Status",
      ready: "Siap Distribusi",
      not_ready: "Belum Siap",
    }),
    [],
  );

  const filteredData = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return schools.filter((s) => {
      const name = (s.name || s.schoolName || "").toLowerCase();
      const npsn = (s.npsn || "").toLowerCase();
      const nip = (s.nip || "").toLowerCase();
      const vendorName = (
        vendorNames[s.assignedVendorEmail || ""] || ""
      ).toLowerCase();
      const driverName = (
        driverNames[s.assignedDriverId || ""] || ""
      ).toLowerCase();

      // Search
      const matchSearch =
        !q ||
        name.includes(q) ||
        npsn.includes(q) ||
        nip.includes(q) ||
        vendorName.includes(q) ||
        driverName.includes(q);

      // Status Distribusi
      let matchStatusDistribusi = true;
      if (statusDistribusiFilter === "ready")
        matchStatusDistribusi = !!(s.assignedVendorEmail && s.assignedDriverId);
      else if (statusDistribusiFilter === "not_ready")
        matchStatusDistribusi = !(s.assignedVendorEmail && s.assignedDriverId);

      // Jenjang
      let matchJenjang = true;
      if (jenjangFilter !== "all") {
        matchJenjang = s.level === jenjangFilter;
      }

      // Status Sekolah
      let matchStatusSekolah = true;
      if (statusSekolahFilter !== "all") {
        matchStatusSekolah = s.status === statusSekolahFilter;
      }

      return (
        matchSearch &&
        matchStatusDistribusi &&
        matchJenjang &&
        matchStatusSekolah
      );
    });
  }, [
    schools,
    searchQuery,
    statusDistribusiFilter,
    jenjangFilter,
    statusSekolahFilter,
    driverNames,
    vendorNames,
  ]);

  const totalPages = Math.max(1, Math.ceil(filteredData.length / PER_PAGE));

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * PER_PAGE;
    return filteredData.slice(start, start + PER_PAGE);
  }, [filteredData, currentPage]);

  const onSearch = (v: string) => {
    setSearchQuery(v);
    setCurrentPage(1);
  };

  const onStatusDistribusi = (v: string | null) => {
    setStatusDistribusiFilter(v || "all");
    setCurrentPage(1);
  };

  const onJenjang = (v: string | null) => {
    setJenjangFilter(v || "all");
    setCurrentPage(1);
  };

  const onStatusSekolah = (v: string | null) => {
    setStatusSekolahFilter(v || "all");
    setCurrentPage(1);
  };

  return (
    <Card className="w-full overflow-hidden shadow-sm border-border flex flex-col">
      {/* ── Filter Bar Component ── */}
      <SchoolTableFilters
        searchQuery={searchQuery}
        statusDistribusiFilter={statusDistribusiFilter}
        jenjangFilter={jenjangFilter}
        statusSekolahFilter={statusSekolahFilter}
        uniqueJenjangs={uniqueJenjangs}
        uniqueStatuses={uniqueStatuses}
        jenjangLabels={jenjangLabels}
        statusLabels={statusLabels}
        statusDistribusiLabels={statusDistribusiLabels}
        onSearch={onSearch}
        onStatusDistribusi={onStatusDistribusi}
        onJenjang={onJenjang}
        onStatusSekolah={onStatusSekolah}
      />

      {/* ── Data Table Component ── */}
      <SchoolDataTable
        data={paginatedData}
        loading={loading}
        currentPage={currentPage}
        perPage={PER_PAGE}
        driverNames={driverNames}
        vendorNames={vendorNames}
        onDetailClick={onDetailClick}
      />

      {/* ── pagination ── */}
      {!loading && filteredData.length > 0 && (
        <CardFooter className="flex items-center justify-between border-t border-border py-3 px-4">
          <p className="text-sm text-muted-foreground font-medium">
            Halaman {currentPage} dari {totalPages}
          </p>
          <Pagination className="mx-0 w-auto justify-end">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  className={
                    currentPage <= 1
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) setCurrentPage(currentPage - 1);
                  }}
                />
              </PaginationItem>
              <PaginationItem>
                <PaginationLink
                  href="#"
                  isActive
                  onClick={(e) => e.preventDefault()}
                >
                  {currentPage}
                </PaginationLink>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  className={
                    currentPage >= totalPages
                      ? "pointer-events-none opacity-50"
                      : "cursor-pointer"
                  }
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages)
                      setCurrentPage(currentPage + 1);
                  }}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </CardFooter>
      )}
    </Card>
  );
}
