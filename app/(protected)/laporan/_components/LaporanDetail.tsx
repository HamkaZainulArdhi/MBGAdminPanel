"use client";

import { useState } from "react";
import Image from "next/image";
import {
  AnomalyReportWithRelation,
  AnomalyReportStatus,
} from "@/lib/types/laporan";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { formatDate, formatDatetimeReadable } from "@/lib/utils";
import { updateAnomalyReportStatus } from "@/lib/laporan-service";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

interface LaporanDetailProps {
  report: AnomalyReportWithRelation;
  onStatusUpdate?: (newStatus: AnomalyReportStatus) => void;
}

const statusOptions: { value: AnomalyReportStatus; label: string }[] = [
  { value: "PENDING_INVESTIGATION", label: "Menunggu Investigasi" },
  { value: "ON_PROGRESS", label: "Sedang Diproses" },
  { value: "RESOLVED", label: "Selesai" },
  { value: "REJECTED", label: "Ditolak" },
];

export function LaporanDetail({ report, onStatusUpdate }: LaporanDetailProps) {
  const [selectedStatus, setSelectedStatus] = useState<AnomalyReportStatus>(
    report.status,
  );
  const [isUpdating, setIsUpdating] = useState(false);

  const getStatusLabel = (status: AnomalyReportStatus): string => {
    return statusOptions.find((opt) => opt.value === status)?.label || status;
  };

  const imageSrc = report.photoBase64
    ? report.photoBase64.startsWith("data:")
      ? report.photoBase64
      : `data:image/jpeg;base64,${report.photoBase64}`
    : undefined;

  const handleStatusUpdate = async () => {
    if (selectedStatus === report.status) {
      toast.info("Status belum berubah");
      return;
    }

    setIsUpdating(true);
    try {
      const success = await updateAnomalyReportStatus(
        report.id,
        selectedStatus,
      );
      if (success) {
        toast.success("Status laporan berhasil diperbarui");
        if (onStatusUpdate) {
          onStatusUpdate(selectedStatus);
        }
      } else {
        toast.error("Gagal memperbarui status laporan");
        setSelectedStatus(report.status);
      }
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error("Terjadi kesalahan saat memperbarui status");
      setSelectedStatus(report.status);
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header dengan back button */}
      <div className="flex items-center gap-4">
        <Link href="/laporan">
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Kembali
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Detail Laporan</h1>
          <p className="text-sm text-muted-foreground">ID: {report.id}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Main Content - Left */}
        <div className="space-y-6">
          {/* Foto Bukti */}
          {imageSrc && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Foto Bukti</CardTitle>
                <CardDescription>
                  Dokumentasi visual laporan anomali
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted">
                  <Image
                    src={imageSrc}
                    alt={report.category}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {/* Informasi Laporan */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Informasi Laporan</CardTitle>
              <CardDescription>Detail lengkap laporan anomali</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Kategori
                  </p>
                  <p className="text-sm font-medium">{report.category}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                    Tanggal Laporan
                  </p>
                  <p className="text-sm">{formatDate(report.date)}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Keterangan
                </p>
                <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">
                  {report.notes}
                </p>
              </div>

              <Separator />

              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                  Waktu Laporan
                </p>
                <p className="text-sm text-foreground">
                  {formatDatetimeReadable(report.timestamp)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Right */}
        <div className="space-y-6">
          {/* Informasi Sekolah & Vendor */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                Informasi Pelapor & Vendor
              </CardTitle>
              <CardDescription>
                Data sekolah pelapor dan vendor yang dilaporkan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Sekolah Pelapor */}
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground">
                  Sekolah Pelapor
                </h4>
                <div className="space-y-3 ml-2">
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Nama Sekolah
                    </p>
                    <p className="text-sm font-medium">{report.schoolName}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                      Email Sekolah
                    </p>
                    <p className="text-sm text-foreground">
                      {report.reporterEmail}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Vendor Dilaporkan */}
              {report.vendorName && report.vendorName !== "—" && (
                <div className="space-y-3">
                  <h4 className="text-sm font-semibold text-foreground">
                    Vendor Dilaporkan
                  </h4>
                  <div className="space-y-3 ml-2">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                          Nama Vendor
                        </p>
                        <p className="text-sm font-medium">
                          {report.vendorName}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                          Nama Pemilik
                        </p>
                        <p className="text-sm font-medium">
                          {report.vendorOwnerName}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                        Email Vendor
                      </p>
                      <p className="text-sm text-foreground">
                        {report.vendorEmail}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs font-semibold uppercase text-muted-foreground mb-1">
                        Lokasi Vendor
                      </p>
                      <p className="text-sm text-foreground">
                        {report.vendorLocation}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="sticky top-4">
            <CardHeader>
              <CardTitle className="text-lg">Perbarui Status</CardTitle>
              <CardDescription>
                Kelola status investigasi laporan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Current Status */}
              <div>
                <p className="text-xs font-semibold uppercase text-muted-foreground mb-2">
                  Status Saat Ini
                </p>
                <StatusBadge status={report.status} />
              </div>

              <Separator />

              {/* Status Dropdown */}
              <div>
                <label
                  htmlFor="status-select"
                  className="text-xs font-semibold uppercase text-muted-foreground block mb-2"
                >
                  Ubah Status
                </label>
                <Select
                  value={selectedStatus}
                  onValueChange={(value) =>
                    setSelectedStatus(value as AnomalyReportStatus)
                  }
                >
                  <SelectTrigger id="status-select">
                    <SelectValue>{getStatusLabel(selectedStatus)}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Save Button */}
              <Button
                onClick={handleStatusUpdate}
                disabled={isUpdating || selectedStatus === report.status}
                className="w-full"
              >
                {isUpdating && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                {isUpdating ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>

              {selectedStatus !== report.status && (
                <p className="text-xs text-muted-foreground text-center">
                  Akan diubah dari "
                  {statusOptions.find((s) => s.value === report.status)?.label}"
                  ke "
                  {statusOptions.find((s) => s.value === selectedStatus)?.label}
                  "
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
