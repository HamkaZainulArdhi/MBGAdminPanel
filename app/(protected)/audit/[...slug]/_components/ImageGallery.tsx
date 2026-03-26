"use client";

import { VendorAuditReport } from "@/lib/types/audit";
import { DocCard, Section } from "@/components/part-dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Camera, ShieldCheck, ShoppingCart, Utensils, ClipboardCheck, Zap } from "lucide-react";

interface ImageGalleryProps {
  audit: VendorAuditReport;
}

export function ImageGallery({ audit }: ImageGalleryProps) {
  const imageGroups = [
    { label: "Bahan Baku", key: "foto_bahan", icon: ShoppingCart, color: "blue" },
    { label: "Sanitasi & Kebersihan", key: "foto_sanitasi", icon: ShieldCheck, color: "green" },
    { label: "Menu Ready", key: "foto_menu", icon: Utensils, color: "orange" },
    { label: "Nota / Invoice", key: "foto_nota", icon: ClipboardCheck, color: "slate" },
    { label: "AI Analysis (Front)", key: "foto_ai", icon: Zap, color: "purple" },
    { label: "AI Analysis (Side)", key: "foto_ai_2", icon: Zap, color: "purple" },
    { label: "Food Safety", key: "foto_safety", icon: ShieldCheck, color: "emerald" },
  ];

  const availableImages = imageGroups.filter(g => (audit as any)[g.key]);

  if (availableImages.length === 0) {
    return (
      <Card className="border-dashed py-20">
        <CardContent className="flex flex-col items-center justify-center text-center">
          <Camera className="h-12 w-12 text-muted-foreground/20 mb-4" />
          <h3 className="text-lg font-bold">Dokumentasi Kosong</h3>
          <p className="text-sm text-muted-foreground max-w-xs">
            Vendor belum mengunggah foto dokumentasi untuk laporan audit ini.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {availableImages.map((group) => (
        <Card key={group.key} className="border-border/40 shadow-sm overflow-hidden group">
          <div className={`p-3 bg-${group.color}-500/10 border-b border-${group.color}-500/20 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <group.icon className={`h-4 w-4 text-${group.color}-600`} />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                {group.label}
              </span>
            </div>
            <Badge variant="outline" className="text-[8px] bg-background">Tersedia</Badge>
          </div>
          <CardContent className="p-4">
            <DocCard 
               label="" 
               url={(audit as any)[group.key]} 
            />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
