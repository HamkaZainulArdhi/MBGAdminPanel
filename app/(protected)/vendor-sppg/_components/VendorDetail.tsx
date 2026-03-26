/* ============================================================================
   VendorDetail — Full detail view for a single vendor
   ============================================================================ */

"use client";

import { Vendor } from "@/lib/types/vendor";
import { VendorSection } from "./VendorSection";
import { Row, BoolChip, DocCard } from "@/components/part-dialog";
import { 
  User, 
  ShieldCheck, 
  ChefHat, 
  Coins, 
  MapPin, 
  FileText, 
  Image as ImageIcon,
  Calendar,
  Clock,
  ArrowLeft
} from "lucide-react";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface VendorDetailProps {
  vendor: Vendor;
}

export function VendorDetail({ vendor }: VendorDetailProps) {
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return "—";
    try {
      return format(new Date(dateStr), "dd MMM yyyy, HH:mm", { locale: idLocale });
    } catch {
      return dateStr;
    }
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return "—";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="space-y-8 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Navigation & Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
          <Calendar className="h-3.5 w-3.5" />
          Dibuat: {formatDate(vendor.createdAt)}
        </div>
      </div>

      <div className="space-y-1">
        <h1 className="text-3xl font-bold tracking-tight">{vendor.name}</h1>
        <p className="text-muted-foreground">{vendor.location}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-start">
        
        {/* Column 1: Profil & Keuangan */}
        <div className="flex flex-col gap-6">
          {/* 1. Informasi Umum */}
          <VendorSection title="Profil Vendor" icon={User}>
            <Row label="Nama Vendor" value={vendor.name} />
            <Row label="Nama Pemilik" value={vendor.ownerName} />
            <Row label="Email" value={vendor.email} />
            <Row label="Lokasi/Area" value={vendor.location} />
            <Row label="NPWP" value={vendor.npwp} mono />
            <Row label="NIB" value={vendor.nib} mono />
            <Row label="Karyawan" value={`${vendor.employeeCount} Orang`} />
          </VendorSection>

          {/* 4. Finansial */}
          <VendorSection title="Finansial" icon={Coins}>
            <Row label="Total Modal" value={formatCurrency(vendor.totalCapital)} fullWidth />
          </VendorSection>
        </div>

        {/* Column 2: Status & Lokasi */}
        <div className="flex flex-col gap-6">
          {/* 2. Status & Validasi */}
          <VendorSection title="Status & Validasi" icon={ShieldCheck}>
            <div className="flex flex-col gap-0.5">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Persetujuan</dt>
              <dd><BoolChip value={vendor.isApproved} yes="Disetujui" no="Belum" /></dd>
            </div>
            <div className="flex flex-col gap-0.5">
              <dt className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/70">Check AI</dt>
              <dd><BoolChip value={vendor.aiVerified} /></dd>
            </div>
            <div className="flex items-center justify-between py-1 border-b border-border/10">
              <span className="text-[11px] text-muted-foreground">Skor Kepatuhan</span>
              <span className="font-bold text-sm">{vendor.complianceScore}</span>
            </div>
            <Row label="Langkah" value={vendor.currentStep} />
            <Row label="Produksi" value={vendor.statusProduksi} />
            <Row label="Suhu Safety" value={`${vendor.safetyTemp}°C`} />
          </VendorSection>

          {/* 5. Lokasi */}
          <VendorSection title="Lokasi Geografis" icon={MapPin}>
            <Row label="Latitude" value={vendor.latitude} />
            <Row label="Longitude" value={vendor.longitude} />
          </VendorSection>
        </div>

        {/* Column 3: Operasional & Legal */}
        <div className="flex flex-col gap-6">
          {/* 3. Produksi */}
          <VendorSection title="Operasional Produksi" icon={ChefHat}>
            <Row label="Target Porsi" value={vendor.targetPorsi} />
            <Row label="Dimasak" value={vendor.cookedCount} />
            <Row label="Bahan Baku" value={`${vendor.rawMaterialWeight} Kg`} />
            <Row label="Mulai" value={vendor.cookingStartTime} />
            <Row label="Selesai" value={vendor.cookingEndTime} />
            <Row label="Suhu Chiller" value={`${vendor.chillerTemp}°C`} />
          </VendorSection>

          {/* 6. Legal & Persetujuan */}
          <VendorSection title="Legal & SLA" icon={FileText}>
            <div className="grid grid-cols-2 gap-4 pb-2 border-b border-border/10">
              <div className="flex flex-col gap-0.5">
                <dt className="text-[10px] font-bold text-muted-foreground/70 uppercase">Halal</dt>
                <dd><BoolChip value={vendor.hasHalal} /></dd>
              </div>
              <div className="flex flex-col gap-0.5">
                <dt className="text-[10px] font-bold text-muted-foreground/70 uppercase">SLA</dt>
                <dd><BoolChip value={vendor.setujuSLA} /></dd>
              </div>
            </div>
            <Row label="Jam Ops" value={vendor.operatingHours} fullWidth />
          </VendorSection>
        </div>

      </div>

      {/* 7. Foto */}
      <div className="space-y-6 pt-4">
        <div className="flex items-center gap-2 px-1">
          <ImageIcon className="h-4 w-4 text-primary/70" />
          <h2 className="text-[11px] font-black tracking-widest uppercase text-muted-foreground/80">Dokumentasi Foto</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          <DocCard label="Foto Menu" url={vendor.menuPhotoBase64} />
          <DocCard label="Foto Higienitas" url={vendor.photoHygiene} />
          <DocCard label="Foto Izin Ops" url={vendor.photoIzinOps} />
          <DocCard label="Sertifikat Halal" url={vendor.photoHalal} />
          <DocCard label="Dokumen PIRT" url={vendor.photoPIRT} />
          <DocCard label="Foto Dapur" url={vendor.photoDapur} />
          <DocCard label="Sample Photo" url={vendor.samplePhotoUrl} />
        </div>
      </div>
    </div>
  );
}
