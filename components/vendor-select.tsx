"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Vendor } from "@/lib/types/registration";
import { AlertCircle } from "lucide-react";

interface VendorSelectProps {
  vendors: Vendor[];
  selectedVendorId: string | null | undefined;
  onSelect: (vendorId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  isLoading?: boolean;
  withDriversOnly?: boolean;
}

export function VendorSelect({
  vendors,
  selectedVendorId,
  onSelect,
  label = "Pilih Vendor",
  placeholder = "Pilih vendor...",
  disabled = false,
  isLoading = false,
  withDriversOnly = false,
}: VendorSelectProps) {
  // Filter vendors if needed
  const availableVendors = withDriversOnly
    ? vendors.filter((v) => v.driverIds && v.driverIds.length > 0)
    : vendors;

  const hasNoVendors = availableVendors.length === 0;

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
        {label}
      </Label>

      {hasNoVendors && withDriversOnly && (
        <div className="rounded-lg border border-warning/30 bg-warning/10 px-3 py-2 flex items-start gap-2">
          <AlertCircle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
          <p className="text-xs text-warning">
            Tidak ada vendor dengan driver yang tersedia.
          </p>
        </div>
      )}

      <Select
        value={selectedVendorId || ""}
        onValueChange={(value) => value && onSelect(value)}
        disabled={disabled || isLoading || hasNoVendors}
      >
        <SelectTrigger className="w-full">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {availableVendors.length === 0 ? (
            <SelectItem value="_empty" disabled>
              Tidak ada vendor tersedia
            </SelectItem>
          ) : (
            availableVendors.map((vendor) => {
              const driverCount = vendor.driverIds?.length || 0;
              const displayText = `${vendor.name} (${driverCount} driver)`;

              return (
                <SelectItem key={vendor.id} value={vendor.id!}>
                  {displayText}
                </SelectItem>
              );
            })
          )}
        </SelectContent>
      </Select>
    </div>
  );
}
