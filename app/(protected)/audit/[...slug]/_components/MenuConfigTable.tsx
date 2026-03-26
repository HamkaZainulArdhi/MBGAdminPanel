"use client";

import { VendorAuditReport } from "@/lib/types/audit";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, CheckCircle2 } from "lucide-react";

interface MenuConfigTableProps {
  audit: VendorAuditReport;
}

export function MenuConfigTable({ audit }: MenuConfigTableProps) {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  const menuItems = Object.entries(audit.menuConfig);

  return (
    <Card className="border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/10">
        <CardTitle className="text-sm font-black uppercase tracking-widest">Konfigurasi Menu & Budget</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="text-[10px] font-black uppercase">Menu / Category</TableHead>
              <TableHead className="text-[10px] font-black uppercase ">Budget</TableHead>
              <TableHead className="text-[10px] font-black uppercase ">Porsi</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-center">Insight</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {menuItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8 text-muted-foreground italic">
                  Data konfigurasi menu tidak tersedia.
                </TableCell>
              </TableRow>
            ) : (
              menuItems.map(([key, item]) => {
                const isOverBudget = false; // Example logic: item.totalBudget > limit?
                
                return (
                  <TableRow key={key} className="hover:bg-muted/30 transition-colors">
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-bold text-sm">{item.menuName}</span>
                        <span className="text-[10px] text-muted-foreground uppercase">{key}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-semibold">
                      {formatIDR(item.totalBudget)}
                      <div className="text-[9px] text-muted-foreground">@ {formatIDR(item.unitPrice)}</div>
                    </TableCell>
                    <TableCell className="text-right font-bold">{item.totalPorsi}</TableCell>
                    <TableCell className="text-center">
                      {isOverBudget ? (
                        <div className="flex flex-col items-center">
                           <AlertCircle className="h-4 w-4 text-orange-500" />
                           <span className="text-[8px] uppercase font-bold text-orange-600">Over</span>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                           <CheckCircle2 className="h-4 w-4 text-green-500" />
                           <span className=" uppercase text-green-600">On-Track</span>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
