/* ============================================================================
   VendorSection — Reusable section for detail categories
   ============================================================================ */

"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Section } from "@/components/part-dialog";
import { LucideIcon } from "lucide-react";

interface VendorSectionProps {
  title: string;
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}

export function VendorSection({ title, icon: Icon, children, className }: VendorSectionProps) {
  return (
    <Card className={`overflow-hidden border-border/60 shadow-none backdrop-blur-sm p-0 ${className}`}>
      <CardHeader className="py-3 px-4 bg-primary border-b border-border/40">
        <CardTitle className="text-xs font-semibold text-white flex items-center gap-2 tracking-widest uppercase">
          {Icon && <Icon className="h-3.5 w-3.5 text-primary/70" />}
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
