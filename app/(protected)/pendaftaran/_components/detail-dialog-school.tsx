"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { School } from "@/lib/types/registration";
import { MapPin, FileText, MapPinOff } from "lucide-react";
import { DocCard, Row, Section } from "@/components/part-dialog";


interface SchoolDetailDialogProps {
  data: School;
  rejectReason: string;
  isRejectMode: boolean;
  onRejectReasonChange: (reason: string) => void;
  formatDateTime: (dateString: string) => string;
}


export function SchoolDetailDialog({
  data,
  rejectReason,
  isRejectMode,
  onRejectReasonChange,
  formatDateTime,
}: SchoolDetailDialogProps) {
  const displayName = data.name || data.schoolName || "—";
  const hasDocuments = data.photoSK || data.photoSuratAktif || data.photoStempel || data.photoFotoSekolah;

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-h-[62vh] overflow-y-auto pr-2">
      {/* ════ LEFT COLUMN ════ */}
      <div className="space-y-6 min-w-0">
        <Section title="Informasi Sekolah">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Row label="Nama Sekolah" value={displayName} fullWidth />
            <Row label="NPSN" value={data.npsn} mono />
            <Row label="Email" value={data.email} mono />
            <Row label="Telepon" value={data.phone} />
            <Row label="Level" value={data.level} />
            <Row label="Porsi" value={data.porsi != null ? `${data.porsi} siswa` : undefined} />
            {data.nip && <Row label="NIP" value={data.nip} mono />}
            {data.status && <Row label="Status" value={data.status} />}
          </dl>
        </Section>

        {(data.picName || data.picPosition || data.picPhone || typeof data.pic === 'object') && (
          <Section title="Kontak (PIC)">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <Row label="Nama PIC" value={data.picName || (typeof data.pic === 'object' ? data.pic?.nama : data.pic)} fullWidth />
              <Row label="Posisi" value={data.picPosition || (typeof data.pic === 'object' ? data.pic?.jabatan : undefined)} />
              <Row label="No. Telepon" value={data.picPhone || (typeof data.pic === 'object' ? data.pic?.hp : undefined)} />
            </dl>
          </Section>
        )}

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

        {(data.assignedVendorEmail || data.assignedDriverId) && (
          <Section title="Assignment">
            <dl className="grid grid-cols-1 gap-y-4">
              {data.assignedVendorEmail && <Row label="Vendor Email" value={data.assignedVendorEmail} mono />}
              {data.assignedDriverId && <Row label="Driver ID" value={data.assignedDriverId} mono />}
            </dl>
          </Section>
        )}

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
        <Section title="Dokumen">
          {hasDocuments ? (
            <div className="grid grid-cols-2 gap-3">
              <DocCard url={data.photoSK} label="SK (Surat Keputusan)" />
              <DocCard url={data.photoSuratAktif} label="Surat Aktif" />
              <DocCard url={data.photoStempel} label="Stempel Sekolah" />
              <DocCard url={data.photoFotoSekolah} label="Foto Sekolah" />
            </div>
          ) : (
            <p className="text-sm text-muted-foreground/60">Tidak ada dokumen.</p>
          )}
        </Section>

        {(data.activeDays || data.schoolStart || data.breakTime) && (
          <Section title="Operasional">
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              {data.activeDays && <Row label="Hari Aktif" value={Array.isArray(data.activeDays) ? data.activeDays.join(", ") : String(data.activeDays)} fullWidth />}
              <Row label="Jam Masuk" value={data.schoolStart} />
              <Row label="Istirahat" value={data.breakTime} />
            </dl>
          </Section>
        )}

        {data.rejectReason && (
          <div className="rounded-xl border border-destructive bg-destructive/10 px-4 py-3">
            <p className="text-[11px] font-bold uppercase tracking-wider text-destructive mb-1.5">Alasan Penolakan</p>
            <p className="text-sm text-foreground">{data.rejectReason}</p>
          </div>
        )}

        {isRejectMode && (
          <div className="rounded-xl border border-border bg-warning text-warning-foreground px-4 py-3">
            <Label htmlFor="reject-reason-school" className="text-[11px] font-bold uppercase tracking-wider text-warning-foreground">
              Alasan Penolakan *
            </Label>
            <Textarea
              id="reject-reason-school"
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
