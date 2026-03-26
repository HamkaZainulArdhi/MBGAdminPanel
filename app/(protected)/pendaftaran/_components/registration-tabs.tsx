"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { RegistrationTable } from "./registration-table";
import { RegistrationData, RegistrationType, getRegistrationName } from "@/lib/types/registration";
import { GraduationCap, UtensilsCrossed, Truck, Search } from "lucide-react";
import { Button } from "../../../../components/ui/button";


interface RegistrationTabsProps {
  schoolData: RegistrationData[];
  vendorData: RegistrationData[];
  driverData: RegistrationData[];
  isLoading: boolean;
  activeTab: RegistrationType;
  onTabChange: (tab: RegistrationType) => void;
  onDetailClick: (item: RegistrationData) => void;
}


function pendingOf(data: RegistrationData[]) {
  return data.filter((d) => !d.isApproved && !d.rejectReason).length;
}


function TabTrigger({
  value,
  icon: Icon,
  label,
  pending,
  activeTab,
  onClick,
}: {
  value: RegistrationType;
  icon: React.ElementType;
  label: string;
  pending: number;
  activeTab: RegistrationType;
  onClick: (value: RegistrationType) => void;
}) {
  const isActive = activeTab === value;

  return (
    <Button
      variant={isActive ? "default" : "outline"}
      onClick={() => onClick(value)}
      className={`flex items-center gap-2 px-4 text-sm font-medium transition-all ${isActive
          ? "bg-primary text-primary-foreground shadow-sm hover:bg-primary/90"
          : "text-muted-foreground bg-background hover:bg-muted"
        }`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
      {pending > 0 && (
        <span
          className={`ml-0.5 inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold ${isActive
              ? "bg-warning text-warning-foreground"
              : "bg-warning text-warning-foreground"
            }`}
        >
          {pending}
        </span>
      )}
    </Button>
  );
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function RegistrationTabs({
  schoolData,
  vendorData,
  driverData,
  isLoading,
  activeTab,
  onTabChange,
  onDetailClick,
}: RegistrationTabsProps) {
  const schoolPending = pendingOf(schoolData);
  const vendorPending = pendingOf(vendorData);
  const driverPending = pendingOf(driverData);

  const [searchQueries, setSearchQueries] = useState<Record<RegistrationType, string>>({
    school: "", vendor: "", driver: ""
  });

  const [statusFilters, setStatusFilters] = useState<Record<RegistrationType, string>>({
    school: "all", vendor: "all", driver: "all"
  });

  const [pages, setPages] = useState<Record<RegistrationType, number>>({
    school: 1, vendor: 1, driver: 1
  });

  const ITEMS_PER_PAGE = 10;

  const handleSearchChange = (tab: RegistrationType, value: string) => {
    setSearchQueries(prev => ({ ...prev, [tab]: value }));
    setPages(prev => ({ ...prev, [tab]: 1 }));
  };

  const handleStatusChange = (tab: RegistrationType, value: string) => {
    setStatusFilters(prev => ({ ...prev, [tab]: value }));
    setPages(prev => ({ ...prev, [tab]: 1 }));
  };

  const handlePageChange = (tab: RegistrationType, newPage: number) => {
    setPages(prev => ({ ...prev, [tab]: newPage }));
  };

  return (
    <div className="space-y-5">
      {/* ── Tabs ── */}
      <Tabs
        value={activeTab}
        onValueChange={(v) => onTabChange(v as RegistrationType)}
        className="w-full"
      >
        {(["school", "vendor", "driver"] as RegistrationType[]).map((tab) => {
          const tabData =
            tab === "school" ? schoolData : tab === "vendor" ? vendorData : driverData;

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const filteredData = useMemo(() => {
            const query = searchQueries[tab].toLowerCase();
            const statusFilter = statusFilters[tab];

            return tabData.filter(item => {
              const name = getRegistrationName(item).toLowerCase();
              const email = (item.email || "").toLowerCase();
              const matchesSearch = !query || name.includes(query) || email.includes(query);

              let matchesStatus = true;
              if (statusFilter !== "all") {
                const isPending = !item.isApproved && !item.rejectReason;
                const isApproved = item.isApproved;
                const isRejected = !item.isApproved && !!item.rejectReason;

                if (statusFilter === "pending") matchesStatus = isPending;
                else if (statusFilter === "approved") matchesStatus = isApproved;
                else if (statusFilter === "rejected") matchesStatus = isRejected;
              }

              return matchesSearch && matchesStatus;
            });
          }, [tabData, searchQueries, statusFilters, tab]);

          const totalPages = Math.max(1, Math.ceil(filteredData.length / ITEMS_PER_PAGE));
          const currentPage = pages[tab];

          // eslint-disable-next-line react-hooks/rules-of-hooks
          const paginatedData = useMemo(() => {
            const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
            return filteredData.slice(startIndex, startIndex + ITEMS_PER_PAGE);
          }, [filteredData, currentPage]);

          return (
            <TabsContent key={tab} value={tab} className="mt-0 outline-none">
              <Card className="shadow-sm border-border">
                <CardHeader className="p-0 p-3">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    {/* LEFT: SEARCH + FILTER */}
                    <div className="flex items-center gap-2 w-full md:w-auto">
                      {/* Search */}
                      <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder="Cari nama atau email..."
                          className="pl-9 bg-background border-primary/20"
                          value={searchQueries[tab]}
                          onChange={(e) => handleSearchChange(tab, e.target.value)}
                        />
                      </div>

                      {/* Filter */}
                      <Select
                        value={statusFilters[tab] as any}
                        onValueChange={(val: any) => handleStatusChange(tab, val || "all")}
                      >
                        <SelectTrigger className="h-10 w-full md:w-[160px] bg-background border-primary/20">
                          <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Semua Status</SelectItem>
                          <SelectItem value="pending">Tertunda</SelectItem>
                          <SelectItem value="approved">Disetujui</SelectItem>
                          <SelectItem value="rejected">Ditolak</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* RIGHT: TABS */}
                    <div className="flex items-center gap-2 shrink-0">
                      <TabTrigger value="school" icon={GraduationCap} label="Sekolah" pending={schoolPending} activeTab={activeTab} onClick={onTabChange} />
                      <TabTrigger value="vendor" icon={UtensilsCrossed} label="Vendor" pending={vendorPending} activeTab={activeTab} onClick={onTabChange} />
                      <TabTrigger value="driver" icon={Truck} label="Driver" pending={driverPending} activeTab={activeTab} onClick={onTabChange} />
                    </div>

                  </div>
                </CardHeader>
                <CardContent className="p-0">
                  <RegistrationTable
                    data={paginatedData}
                    isLoading={isLoading}
                    page={currentPage}
                    onDetailClick={onDetailClick}
                  />
                </CardContent>
                <CardFooter className="flex items-center justify-between  border-t  border-border/40">
                  <p className="text-sm text-muted-foreground font-medium w-[150px]">
                    Halaman {currentPage} dari {totalPages}
                  </p>
                  <Pagination className="mx-0 w-auto justify-end">
                    <PaginationContent>
                      <PaginationItem>
                        <PaginationPrevious
                          href="#"
                          className={currentPage <= 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage > 1) handlePageChange(tab, currentPage - 1);
                          }}
                        />
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationLink href="#" isActive onClick={(e) => e.preventDefault()}>
                          {currentPage}
                        </PaginationLink>
                      </PaginationItem>
                      <PaginationItem>
                        <PaginationNext
                          href="#"
                          className={currentPage >= totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                          onClick={(e) => {
                            e.preventDefault();
                            if (currentPage < totalPages) handlePageChange(tab, currentPage + 1);
                          }}
                        />
                      </PaginationItem>
                    </PaginationContent>
                  </Pagination>
                </CardFooter>
              </Card>
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}