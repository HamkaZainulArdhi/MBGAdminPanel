"use client";

import { VendorAuditReport } from "@/lib/types/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";

import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from "recharts";

interface AuditChartsProps {
  audit: VendorAuditReport;
}

export function AuditCharts({ audit }: AuditChartsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-[600px] bg-muted/5 animate-pulse rounded-xl" />;
  }

  // 1. Porsi Data
  const porsiData = [
    { name: "Target", value: audit.porsi_target },
    { name: "Realisasi", value: audit.porsi_realisasi },
  ];

  // 2. Financial Data
  const financialData = [
    { name: "Modal", value: audit.total_modal },
    { name: "Pendapatan", value: audit.total_pendapatan },
  ];

  // 3. Wastage vs Good
  const wastageData = [
    { name: "Bagus", value: Math.max(0, audit.porsi_realisasi - audit.wastageCount) },
    { name: "Wastage", value: audit.wastageCount },
  ];

  // 4. Category Breakdown
  const categoryData = audit.categories.map(c => ({
    name: c.name,
    pendapatan: c.pendapatan
  }));

  const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Porsi Chart */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Perbandingan Porsi</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] min-h-[300px]">
          {porsiData[0].value === 0 && porsiData[1].value === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
              Data porsi tidak tersedia
            </div>
          ) : (
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={porsiData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{ fill: 'rgba(0,0,0,0.05)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {porsiData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#64748b" : "#3b82f6"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Financial Chart */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Modal vs Pendapatan</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] min-h-[300px]">
          {financialData[0].value === 0 && financialData[1].value === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
              Data finansial tidak tersedia
            </div>
          ) : (
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={financialData} layout="vertical" margin={{ top: 20, right: 30, left: 40, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} strokeOpacity={0.1} />
                <XAxis type="number" fontSize={12} tickLine={false} axisLine={false} hide />
                <YAxis dataKey="name" type="category" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(value))}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="value" radius={[0, 6, 6, 0]} barSize={40}>
                  {financialData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#ef4444" : "#10b981"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Wastage Pie Chart */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Rasio Produk Layak vs Wastage</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] min-h-[300px]">
          {wastageData[0].value === 0 && wastageData[1].value === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
              Data wastage tidak tersedia
            </div>
          ) : (
            <ResponsiveContainer width="99%" height="100%">
              <PieChart>
                <Pie
                  data={wastageData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {wastageData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index === 0 ? "#10b981" : "#ef4444"} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend verticalAlign="bottom" height={36} iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* Category Breakdown */}
      <Card className="border-border/40 shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground/80">Pendapatan per Kategori</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px] min-h-[300px]">
          {categoryData.length === 0 ? (
            <div className="flex items-center justify-center h-full text-muted-foreground text-xs italic">
              Data kategori tidak tersedia
            </div>
          ) : (
            <ResponsiveContainer width="99%" height="100%">
              <BarChart data={categoryData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} strokeOpacity={0.1} />
                <XAxis dataKey="name" fontSize={10} tickLine={false} axisLine={false} interval={0} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} hide />
                <Tooltip 
                  formatter={(value: any) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR" }).format(Number(value))}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Bar dataKey="pendapatan" radius={[6, 6, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
