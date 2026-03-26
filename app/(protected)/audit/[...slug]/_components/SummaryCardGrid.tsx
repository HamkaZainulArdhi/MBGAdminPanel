"use client";

import { VendorAuditReport } from "@/lib/types/audit";
import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Target, Package, Wallet, Banknote } from "lucide-react";

interface SummaryCardGridProps {
  audit: VendorAuditReport;
}

export function SummaryCardGrid({ audit }: SummaryCardGridProps) {
  const efficiency = audit.porsi_target > 0 
    ? (audit.porsi_realisasi / audit.porsi_target) * 100 
    : 0;

  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const cards = [
    {
      label: "Porsi (Target vs Real)",
      value: `${audit.porsi_realisasi} / ${audit.porsi_target}`,
      icon: Target,
      desc: "Efisiensi Porsi",
      percent: efficiency,
      color: "blue",
    },
    {
      label: "Financial (Modal vs Pendapatan)",
      value: formatIDR(audit.total_pendapatan),
      icon: Banknote,
      subValue: `Modal: ${formatIDR(audit.total_modal)}`,
      desc: "Revenue vs Capital",
      percent: audit.total_pendapatan > 0 ? (audit.total_modal / audit.total_pendapatan) * 100 : 0,
      color: "green",
    },
    {
      label: "Wastage Count",
      value: audit.wastageCount,
      icon: Package,
      desc: audit.wastageReason || "Tidak ada wastage",
      percent: 100 - (audit.wastageCount / (audit.porsi_realisasi || 1)) * 100,
      color: "orange",
    },
    {
      label: "Efficiency Rate",
      value: `${efficiency.toFixed(1)}%`,
      icon: Wallet,
      desc: "Rating Performa",
      percent: efficiency,
      color: efficiency > 90 ? "green" : efficiency > 70 ? "orange" : "red",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => (
        <Card key={card.label} className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-5">
            <div className="flex items-start justify-between mb-4">
              <div className="space-y-1">
                <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                  {card.label}
                </p>
                <p className="text-2xl font-black tracking-tight">{card.value}</p>
                {card.subValue && <p className="text-[10px] text-muted-foreground font-medium">{card.subValue}</p>}
              </div>
              <div className={`p-2 rounded-xl bg-${card.color}-500/10`}>
                <card.icon className={`h-5 w-5 text-${card.color}-600`} />
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-[10px] font-bold">
                <span className="text-muted-foreground uppercase">{card.desc}</span>
                <span className={`text-${card.color}-600`}>{card.percent.toFixed(0)}%</span>
              </div>
              <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full bg-${card.color}-500 transition-all duration-1000`} 
                  style={{ width: `${Math.min(100, card.percent)}%` }} 
                />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
