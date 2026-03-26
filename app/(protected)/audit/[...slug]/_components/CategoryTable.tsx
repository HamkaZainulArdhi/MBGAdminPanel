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

interface CategoryTableProps {
  audit: VendorAuditReport;
}

export function CategoryTable({ audit }: CategoryTableProps) {
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <Card className="border-border/40 shadow-sm overflow-hidden">
      <CardHeader className="bg-muted/30 border-b border-border/10">
        <CardTitle className="text-sm font-black uppercase tracking-widest">Performa per Kategori</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader className="bg-muted/20">
            <TableRow>
              <TableHead className="text-[10px] font-black uppercase">Kategori</TableHead>
              <TableHead className="text-[10px] font-black uppercase">Porsi</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-center">Margin</TableHead>
              <TableHead className="text-[10px] font-black uppercase text-center">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {audit.categories.map((cat, idx) => {
              const marginPercent = cat.pendapatan > 0 ? (cat.margin / cat.pendapatan) * 100 : 0;
              
              return (
                <TableRow key={idx} className="hover:bg-muted/30 transition-colors">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-bold text-sm">{cat.name}</span>
                      <span className="text-[10px] text-muted-foreground uppercase">{formatIDR(cat.pendapatan)}</span>
                    </div>
                  </TableCell>
                  <TableCell className=" font-mono font-bold">{cat.porsi}</TableCell>
                  <TableCell className="text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span className="text-[10px] font-bold text-primary">{marginPercent.toFixed(1)}%</span>
                      <div className="h-1 w-20 bg-muted rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-primary transition-all`} 
                          style={{ width: `${Math.min(100, marginPercent)}%` }} 
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={cat.status.toUpperCase() === "OK" ? "success" : "warning"}
                      
                    >
                      {cat.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
