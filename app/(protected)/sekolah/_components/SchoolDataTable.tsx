import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { School } from "@/lib/types/registration";
import { CheckIcon, Clock, Eye } from "lucide-react";

// ── helpers ──
function safePorsi(porsi: School["porsi"]): number {
  if (typeof porsi === "object" && porsi !== null)
    return Object.values(porsi).reduce((s, v) => s + (Number(v) || 0), 0);
  return Number(porsi) || 0;
}

function safePicName(s: School): string {
  if (s.picName) return s.picName;
  if (typeof s.pic === "object" && s.pic !== null) return s.pic?.nama || "—";
  return typeof s.pic === "string" ? s.pic : "—";
}

function safePicPhone(s: School): string {
  if (s.picPhone) return s.picPhone;
  if (typeof s.pic === "object" && s.pic !== null) return s.pic?.hp || "—";
  return s.phone || "—";
}

interface SchoolDataTableProps {
  data: School[];
  loading: boolean;
  currentPage: number;
  perPage: number;
  driverNames: Record<string, string>;
  vendorNames: Record<string, string>;
  onDetailClick: (school: School) => void;
}

const COL_COUNT = 10;

export function SchoolDataTable({
  data,
  loading,
  currentPage,
  perPage,
  driverNames,
  vendorNames,
  onDetailClick,
}: SchoolDataTableProps) {
  return (
    <CardContent className="p-0 border-t">
      <ScrollArea className="w-full whitespace-nowrap">
        <Table>
          <TableHeader className="bg-primary">
            <TableRow className="text-white">
              <TableHead className="rounded-tl-lg">No</TableHead>
              <TableHead>Nama Sekolah</TableHead>
              <TableHead>NIP</TableHead>
              <TableHead>NPSN</TableHead>
              <TableHead>Jenjang</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-center">Siswa / Porsi</TableHead>
              <TableHead>Vendor</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-center">Status Distribusi</TableHead>
              <TableHead className="text-center rounded-tr-lg">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell
                  colSpan={COL_COUNT + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  Memuat data sekolah...
                </TableCell>
              </TableRow>
            ) : data.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={COL_COUNT + 1}
                  className="text-center py-8 text-muted-foreground"
                >
                  Tidak ada sekolah yang ditemukan.
                </TableCell>
              </TableRow>
            ) : (
              data.map((s, i) => {
                const idx = (currentPage - 1) * perPage + i + 1;
                const ready = s.assignedVendorEmail && s.assignedDriverId;
                return (
                  <TableRow key={s.id || i} className="hover:bg-muted/20">
                    {/* 1 No */}
                    <TableCell className="w-12 text-center whitespace-nowrap">
                      {idx}
                    </TableCell>

                    {/* 2 Nama + PIC */}
                    <TableCell className="min-w-56">
                      <div className="font-medium leading-tight truncate">
                        {s.name || s.schoolName || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5 truncate">
                        {safePicName(s)} · {safePicPhone(s)}
                      </div>
                    </TableCell>

                    {/* 3 NIP */}
                    <TableCell className="w-32 text-center whitespace-nowrap">
                      {s.nip || "—"}
                    </TableCell>

                    {/* 4 NPSN */}
                    <TableCell className="w-32 text-center whitespace-nowrap">
                      {s.npsn || "—"}
                    </TableCell>

                    {/* 5 Jenjang */}
                    <TableCell className="w-32 text-center whitespace-nowrap uppercase">
                      {s.level || "—"}
                    </TableCell>

                    {/* 6 Status */}
                    <TableCell className="w-32 text-center whitespace-nowrap">
                      {s.status ? (
                        <Badge
                          variant="outline"
                          className="text-xs px-2 py-0.5 uppercase"
                        >
                          {s.status}
                        </Badge>
                      ) : (
                        "—"
                      )}
                    </TableCell>

                    {/* 7 Siswa / Porsi */}
                    <TableCell className="w-32 text-center whitespace-nowrap">
                      <div className="flex flex-col items-center leading-tight">
                        <span className="text-sm">
                          {s.lastStudentCount || 0}
                        </span>
                        <span className="text-xs text-muted-foreground border-t border-border mt-0.5 pt-0.5 w-10 text-center">
                          {safePorsi(s.porsi)}
                        </span>
                      </div>
                    </TableCell>

                    {/* 8 Vendor */}
                    <TableCell
                      className="max-w-60 truncate whitespace-nowrap"
                      title={s.assignedVendorEmail}
                    >
                      {s.assignedVendorEmail ? (
                        <span className="text-sm">
                          {vendorNames[s.assignedVendorEmail] ||
                            s.assignedVendorEmail}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 italic text-sm">
                          —
                        </span>
                      )}
                    </TableCell>

                    {/* 9 Driver */}
                    <TableCell
                      className="max-w-40 truncate whitespace-nowrap"
                      title={s.assignedDriverId}
                    >
                      {s.assignedDriverId ? (
                        <span className="text-sm">
                          {driverNames[s.assignedDriverId] ||
                            s.assignedDriverId}
                        </span>
                      ) : (
                        <span className="text-muted-foreground/60 italic text-sm">
                          —
                        </span>
                      )}
                    </TableCell>

                    {/* 10 Status Distribusi */}
                    <TableCell className="w-32 text-center whitespace-nowrap">
                      <Badge variant={ready ? "success" : "warning"}>
                        {ready ? (
                          <>
                            <CheckIcon className="h-3 w-3" />
                            Siap
                          </>
                        ) : (
                          <>
                            <Clock className="h-3 w-3" />
                            Belum
                          </>
                        )}
                      </Badge>
                    </TableCell>

                    {/* 11 Aksi */}
                    <TableCell className=" text-center whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="icon"
                        className="h-8 gap-1.5 w-15"
                        onClick={() => onDetailClick(s)}
                      >
                        <Eye className="h-4 w-4" />
                        <span className="hidden sm:inline text-xs">Lihat</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </CardContent>
  );
}
