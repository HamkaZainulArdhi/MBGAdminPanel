/* ============================================================================
   REGISTRATION TABLE — Displays registrations in a clean data table
   ============================================================================ */

"use client";

import {
  RegistrationData,
  isSchool,
  isVendor,
  isDriver,
  getRegistrationName,
  getStatusLabel,
} from "@/lib/types/registration";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Eye, AlertCircle, CheckIcon, Clock, XCircle } from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function StatusBadge({ data }: { data: RegistrationData }) {
  const label = getStatusLabel(data);

  if (label === "Disetujui") {
    return (
      <Badge variant="success" className="gap-1">
        <CheckIcon className="h-3 w-3" />
        Disetujui
      </Badge>
    );
  }
  if (label === "Ditolak") {
    return (
      <Badge variant="destructive" className="gap-1">
        <XCircle className="h-3 w-3" />
        Ditolak
      </Badge>
    );
  }
  return (
    <Badge variant="warning" className="gap-1">
      <Clock className="h-3 w-3" />
      Tertunda
    </Badge>
  );
}

function getTypeLabel(data: RegistrationData): string {
  if (isSchool(data)) return "Sekolah";
  if (isVendor(data)) return "Vendor";
  if (isDriver(data)) return "Driver";
  return "-";
}

function formatDate(dateString?: string): string {
  if (!dateString) return "-";
  try {
    return format(new Date(dateString), "dd MMM yyyy", { locale: idLocale });
  } catch {
    return dateString;
  }
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface RegistrationTableProps {
  data: RegistrationData[];
  isLoading: boolean;
  page: number;
  onDetailClick: (item: RegistrationData) => void;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function RegistrationTable({
  data,
  isLoading,
  page,
  onDetailClick,
}: RegistrationTableProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-4">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-primary border-t-transparent" />
        <p className="text-sm text-muted-foreground">Memuat data…</p>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <AlertCircle className="h-12 w-12 text-muted-foreground/40" />
        <p className="text-base font-semibold text-muted-foreground">Tidak ada data</p>
        <p className="text-sm text-muted-foreground/70">
          Semua pendaftaran telah diverifikasi atau tidak ada item tertunda.
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader className="bg-primary">
        <TableRow>
          <TableHead className="rounded-tl-lg text-white w-12 text-center">No</TableHead>
          <TableHead className="text-white">Nama</TableHead>
          <TableHead className="text-white">Email</TableHead>
          <TableHead className="text-white">Status</TableHead>
          <TableHead className="text-white">Terdaftar</TableHead>
          <TableHead className="text-center rounded-tr-lg text-white">Aksi</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((item, index) => (
          <TableRow
            key={item.id}
          >
            <TableCell className="text-center text-sm text-muted-foreground font-medium">
              {index + 1 + (page - 1) * 10}
            </TableCell>
            <TableCell>
              <div className="flex flex-col gap-0.5">
                <span className="text-sm font-semibold truncate max-w-[220px]">
                  {getRegistrationName(item)}
                </span>
                <span className="text-xs text-muted-foreground">
                  {getTypeLabel(item)}
                </span>
              </div>
            </TableCell>
            <TableCell>
              <span className="text-sm text-muted-foreground truncate max-w-[200px] block">
                {item.email || "-"}
              </span>
            </TableCell>
            <TableCell>
              <StatusBadge data={item} />
            </TableCell>
            <TableCell>
              {formatDate(item.createdAt)}
            </TableCell>
            <TableCell className="text-center whitespace-nowrap">
              <Button
                variant="outline"
                size="icon"
                onClick={() => onDetailClick(item)}
                className="h-8 gap-1.5 w-15"
              >
                <Eye className="h-4 w-4" />
                <span className="hidden sm:inline text-xs">Lihat</span>
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
