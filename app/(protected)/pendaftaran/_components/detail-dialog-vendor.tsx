"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Vendor } from "@/lib/types/registration";
import {
  MapPin, MapPinOff,
} from "lucide-react";
import { DocCard, Row, Section, BoolChip } from "@/components/part-dialog";


interface VendorDetailDialogProps {
  data: Vendor;
  rejectReason: string;
  isRejectMode: boolean;
  onRejectReasonChange: (reason: string) => void;
  formatDateTime: (dateString: string) => string;
}

export function VendorDetailDialog({
  data,
  rejectReason,
  isRejectMode,
  onRejectReasonChange,
  formatDateTime,
}: VendorDetailDialogProps) {
  const hasDocuments =
    data.photoDapur || data.photoIzinOps || data.photoHalal ||
    data.photoPIRT || data.photoHygiene || data.samplePhotoUrl;

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-h-[62vh] overflow-y-auto pr-2">
      {/* ════ LEFT COLUMN ════ */}
      <div className="space-y-6 min-w-0">
        {/* Identitas */}
        <Section title="Identitas Vendor">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Row label="Nama Vendor" value={data.name} fullWidth />
            <Row label="Pemilik / Owner" value={data.ownerName} />
            <Row label="Email" value={data.email} mono />
            <Row label="NIB" value={data.nib} mono />
            {data.npwp && <Row label="NPWP" value={data.npwp} mono />}
          </dl>
        </Section>

        {/* Kapasitas */}
        <Section title="Kapasitas &amp; Operasional">
          <dl className="grid grid-cols-3 gap-x-6 gap-y-4">
            <Row label="Target Porsi" value={data.targetPorsi != null ? `${data.targetPorsi} siswa` : undefined} />
            <Row label="Karyawan" value={data.employeeCount} />
            <Row label="Jam Operasional" value={data.operatingHours} />
          </dl>
        </Section>

        {/* Lokasi */}
        <Section title="Lokasi &amp; Alamat">
          <p className="text-sm font-medium leading-relaxed">{data.address || "—"}</p>
          <div className="flex items-center gap-2 mt-1">
            {data.latitude && data.longitude ? (
              <>
                <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                <span className="text-xs font-mono text-muted-foreground">{data.latitude}, {data.longitude}</span>
              </>
            ) : (
              <>
                <MapPinOff className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0" />
                <span className="text-xs text-muted-foreground/50">GPS tidak tersedia</span>
              </>
            )}
          </div>
        </Section>

        {/* Timestamps */}
        <dl className="grid grid-cols-2 gap-4">
          <div className="rounded-lg bg-muted/40 px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Terdaftar</dt>
            <dd className="text-xs font-mono">{formatDateTime(data.createdAt)}</dd>
          </div>
          <div className="rounded-lg bg-muted/40 px-4 py-3">
            <dt className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-1">Update Terakhir</dt>
            <dd className="text-xs font-mono">{data.lastUpdate ? formatDateTime(data.lastUpdate) : "—"}</dd>
          </div>
        </dl>
      </div>

      {/* ════ RIGHT COLUMN ════ */}
      <div className="space-y-6 min-w-0">
        {/* Kepatuhan */}
        <Section title="Kepatuhan &amp; Sertifikasi">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Halal</dt>
              <dd><BoolChip value={data.hasHalal} yes="Bersertifikat" no="Belum" /></dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Setuju SLA</dt>
              <dd><BoolChip value={data.setujuSLA} /></dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Setuju Laporan</dt>
              <dd><BoolChip value={data.setujuLaporan} /></dd>
            </div>
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Setuju Gizi</dt>
              <dd><BoolChip value={data.setujuGizi} /></dd>
            </div>
            {data.complianceScore != null && <Row label="Compliance Score" value={data.complianceScore} />}
            {data.averageRating != null && <Row label="Rating Rata-rata" value={data.averageRating} />}
          </dl>
        </Section>

        {/* Dokumen */}
        <Section title="Dokumen">
          {hasDocuments ? (
            <div className="grid grid-cols-3 gap-3">
              <DocCard url={data.photoDapur} label="Foto Dapur" />
              <DocCard url={data.photoIzinOps} label="Izin Ops" />
              <DocCard url={data.photoHalal} label="Halal" />
              <DocCard url={data.photoPIRT} label="PIRT" />
              <DocCard url={data.photoHygiene} label="Kebersihan" />
              <DocCard url={data.samplePhotoUrl} label="Sample" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">Tidak ada dokumen.</p>
          )}
        </Section>

        {/* Rejection notice */}
        {data.rejectReason && (
          <div className="rounded-xl border border-destructive bg-destructive/10 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-destructive mb-1.5">Alasan Penolakan</p>
            <p className="text-sm text-foreground">{data.rejectReason}</p>
          </div>
        )}

        {/* Reject form */}
        {isRejectMode && (
          <div className="rounded-xl border border-border bg-warning text-warning-foreground px-4 py-3">
            <Label htmlFor="reject-reason-vendor" className="text-[11px] font-bold uppercase tracking-wider text-warning-foreground">
              Alasan Penolakan *
            </Label>
            <Textarea
              id="reject-reason-vendor"
              placeholder="Jelaskan alasan penolakan registrasi ini…"
              value={rejectReason}
              onChange={(e) => onRejectReasonChange(e.target.value)}
              className="mt-2 min-h-[80px]"
            />
          </div>
        )}
      </div>
    </div>
  );
}
