"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { getVendorAuditDetail } from "@/lib/audit-service";
import { VendorAuditReport } from "@/lib/types/audit";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, LayoutDashboard, FileText, Image as ImageIcon } from "lucide-react";
import Link from "next/link";

// Sub-components (to be created)
import { SummaryCardGrid } from "./_components/SummaryCardGrid";
import { AuditCharts } from "./_components/AuditCharts";
import { AIInsightSection } from "./_components/AIInsightSection";
import { CategoryTable } from "./_components/CategoryTable";
import { MenuConfigTable } from "./_components/MenuConfigTable";
import { ImageGallery } from "./_components/ImageGallery";

export default function VendorAuditDetailPage() {
  const params = useParams();
  const slug = params.slug as string[]; // [email, date]

  const [audit, setAudit] = useState<VendorAuditReport | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAudit = async () => {
      if (!slug || slug.length < 2) {
        setError("Alamat audit tidak valid");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const email = slug[0];
        const date = slug[1];
        const data = await getVendorAuditDetail(email, date);
        if (!data) {
          setError("Data audit tidak ditemukan");
        } else {
          setAudit(data);
        }
      } catch (err) {
        console.error("Error fetching audit:", err);
        setError("Gagal memuat data audit.");
      } finally {
        setLoading(false);
      }
    };

    fetchAudit();
  }, [slug]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-9 w-24" />
          <Skeleton className="h-8 w-64" />
        </div>
        <Skeleton className="h-[400px] w-full rounded-xl" />
      </div>
    );
  }

  if (error || !audit) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-4">
        <h2 className="text-xl font-bold text-destructive">{error || "Kesalahan"}</h2>
        <div className="text-xs text-muted-foreground p-4 bg-muted rounded-lg font-mono">
          Path: audit/{slug?.join("/")} <br/>
          Vendor: {slug?.[0]} <br/>
          ID/Date: {slug?.[1]}
        </div>
        <Link href="/audit">
          <Button variant="outline">
            <ArrowLeft className="mr-2 h-4 w-4" /> Kembali ke Daftar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-12 ">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link href="/audit">
            <Button variant="ghost" size="sm" className="h-8 px-2">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div className="flex flex-col">
            <h1 className="text-xl font-extrabold tracking-tight">
              Audit Operasional: {audit.vendorEmail}
            </h1>
            <p className="text-xs text-muted-foreground flex items-center gap-1.5">
              <span className="font-bold text-primary">{audit.id}</span>
              <span className="opacity-20">|</span>
              <span>Menu: {audit.nama_menu}</span>
            </p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="summary" className="space-y-6">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur py-2 border-b">
          <TabsList className="grid grid-cols-3 w-full max-w-md">
            <TabsTrigger value="summary" className="flex items-center gap-2">
              <LayoutDashboard className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Ringkasan</span>
            </TabsTrigger>
            <TabsTrigger value="detail" className="flex items-center gap-2">
              <FileText className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Detail Breakdown</span>
            </TabsTrigger>
            <TabsTrigger value="foto" className="flex items-center gap-2">
              <ImageIcon className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Dokumentasi</span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="summary" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <SummaryCardGrid audit={audit} />
          <AuditCharts audit={audit} />
        </TabsContent>

        <TabsContent value="detail" className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <AIInsightSection audit={audit} />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 space-y-5">
            <MenuConfigTable audit={audit} />
            <CategoryTable audit={audit} />
          </div>
        </TabsContent>

        <TabsContent value="foto" className="animate-in fade-in slide-in-from-bottom-2 duration-500">
          <ImageGallery audit={audit} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
