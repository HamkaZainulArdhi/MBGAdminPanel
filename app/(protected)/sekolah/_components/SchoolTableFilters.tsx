import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CardHeader } from "@/components/ui/card";
import { Search } from "lucide-react";

interface SchoolTableFiltersProps {
  searchQuery: string;
  statusDistribusiFilter: string;
  jenjangFilter: string;
  statusSekolahFilter: string;
  uniqueJenjangs: string[];
  uniqueStatuses: string[];
  jenjangLabels: Record<string, string>;
  statusLabels: Record<string, string>;
  statusDistribusiLabels: Record<string, string>;
  onSearch: (value: string) => void;
  onStatusDistribusi: (value: string | null) => void;
  onJenjang: (value: string | null) => void;
  onStatusSekolah: (value: string | null) => void;
}

function getDisplayLabel(
  value: string,
  labels: Record<string, string>,
  fallback: string
): string {
  if (value === "all") return fallback;
  return labels[value] || value;
}

export function SchoolTableFilters({
  searchQuery,
  statusDistribusiFilter,
  jenjangFilter,
  statusSekolahFilter,
  uniqueJenjangs,
  uniqueStatuses,
  jenjangLabels,
  statusLabels,
  statusDistribusiLabels,
  onSearch,
  onStatusDistribusi,
  onJenjang,
  onStatusSekolah,
}: SchoolTableFiltersProps) {
  return (
    <CardHeader className="p-4 bg-muted/30 border-b">
      <div className="flex flex-col gap-3 sm:gap-2 sm:flex-row sm:items-center sm:flex-wrap">
        {/* Search Input */}
        <div className="relative flex-1 max-w-72 sm:min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Cari NIP, Vendor, Driver..."
            className="pl-10 bg-background border-primary/20"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        {/* Filters Container */}
        <div className="flex flex-col gap-2 sm:flex-row sm:gap-2 w-full sm:w-auto">
          {/* Status Distribusi Filter */}
          <Select
            value={statusDistribusiFilter}
            onValueChange={onStatusDistribusi}
          >
            <SelectTrigger className="h-10 w-full sm:w-40 bg-background border-primary/20 font-medium">
              <span>
                {getDisplayLabel(
                  statusDistribusiFilter,
                  statusDistribusiLabels,
                  "Status Distribusi"
                )}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="ready">Siap Distribusi</SelectItem>
              <SelectItem value="not_ready">Belum Siap</SelectItem>
            </SelectContent>
          </Select>

          {/* Jenjang Filter */}
          <Select value={jenjangFilter} onValueChange={onJenjang}>
            <SelectTrigger className="h-10 w-full sm:w-40 bg-background border-primary/20 font-medium">
              <span>
                {getDisplayLabel(jenjangFilter, jenjangLabels, "Jenjang")}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Jenjang</SelectItem>
              {uniqueJenjangs.map((jenjang) => (
                <SelectItem key={jenjang} value={jenjang}>
                  {jenjang.toUpperCase()}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Status Sekolah Filter */}
          <Select value={statusSekolahFilter} onValueChange={onStatusSekolah}>
            <SelectTrigger className="h-10 w-full sm:w-40 bg-background border-primary/20 font-medium">
              <span>
                {getDisplayLabel(
                  statusSekolahFilter,
                  statusLabels,
                  "Status Sekolah"
                )}
              </span>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Semua Status</SelectItem>
              {uniqueStatuses.map((status) => (
                <SelectItem key={status} value={status}>
                  {status}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </CardHeader>
  );
}
