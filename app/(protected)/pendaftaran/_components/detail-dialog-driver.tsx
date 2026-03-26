"use client";

import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Driver } from "@/lib/types/registration";
import {
  MapPin, MapPinOff, FileText,
  User, Hash, Mail, Phone, Car, Gauge,
  Map, CheckCircle2, XCircle, Star, ShieldCheck,
} from "lucide-react";
import { DocCard, Row, Section, BoolChip } from "@/components/part-dialog";


interface DriverDetailDialogProps {
  data: Driver;
  rejectReason: string;
  isRejectMode: boolean;
  onRejectReasonChange: (reason: string) => void;
  formatDateTime: (dateString: string) => string;
}


export function DriverDetailDialog({
  data,
  rejectReason,
  isRejectMode,
  onRejectReasonChange,
  formatDateTime,
}: DriverDetailDialogProps) {
  const hasDocuments =
    data.photoSIM || data.photoSTNK || data.photoSKCK ||
    data.photoVehicle || data.profilephoto;

  return (
    <div className="grid grid-cols-2 gap-x-8 gap-y-6 max-h-[62vh] overflow-y-auto pr-2">
      {/* ════ LEFT COLUMN ════ */}
      <div className="space-y-6 min-w-0">
        {/* Identitas Driver */}
        <Section title="Identitas Driver">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Row label="Nama Driver" value={data.name} fullWidth />
            <Row label="NIK" value={data.nik} mono />
            <Row label="Email" value={data.email} mono />
            <Row label="Telepon" value={data.phone} />
          </dl>
        </Section>

        {/* Lokasi */}
        <Section title="Alamat">
          <p className="text-sm font-medium leading-relaxed">{data.address || "—"}</p>
        </Section>

        {/* Kendaraan */}
        <Section title="Informasi Kendaraan">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Row label="Jenis Kendaraan" value={data.vehicleType} fullWidth />
            <Row label="Nomor Plat" value={data.vehiclePlate} mono />
            <Row label="Kapasitas" value={data.carryingCapacity != null ? `${data.carryingCapacity} kg` : undefined} />
            {data.coverageArea && <Row label="Area Jangkauan" value={data.coverageArea} fullWidth />}
          </dl>
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
        {/* Status & Penilaian */}
        <Section title="Status &amp; Penilaian">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
            <Row label="Status Shift" value={data.statusShift} />
            <Row label="Status Pengiriman" value={data.statusDelivery} />
            {data.slaScore != null && <Row label="SLA Score" value={data.slaScore} />}
            {data.averageRating != null && <Row label="Rating Rata-rata" value={data.averageRating} />}
            {data.assignedVendorEmail && <Row label="Vendor Email" value={data.assignedVendorEmail} mono fullWidth />}
          </dl>
          <div className="mt-3 flex gap-4 items-center">
            <div className="flex flex-col gap-1">
              <dt className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">GPS Consent</dt>
              <dd><BoolChip value={data.isGpsConsent} /></dd>
            </div>
          </div>
        </Section>

        {/* Dokumen */}
        <Section title="Dokumen">
          {hasDocuments ? (
            <div className="grid grid-cols-2 gap-3">
              <DocCard url={data.profilephoto} label="Foto Profil" />
              <DocCard url={data.photoSIM} label="SIM" />
              <DocCard url={data.photoSTNK} label="STNK" />
              <DocCard url={data.photoSKCK} label="SKCK" />
              <DocCard url={data.photoVehicle} label="Foto Kendaraan" />
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
            <Label htmlFor="reject-reason-driver" className="text-[11px] font-bold uppercase tracking-wider text-warning-foreground">
              Alasan Penolakan *
            </Label>
            <Textarea
              id="reject-reason-driver"
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
