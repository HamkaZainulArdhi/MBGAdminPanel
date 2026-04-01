"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  RegistrationData,
  isSchool,
  isVendor,
  isDriver,
  School,
  Vendor,
  Driver,
  getRegistrationName,
  getStatusLabel,
} from "@/lib/types/registration";
import { format } from "date-fns";
import { id as idLocale } from "date-fns/locale";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Loader2 } from "lucide-react";
import { SchoolDetailDialog } from "@/app/(protected)/pendaftaran/_components/detail-dialog-school";
import { VendorDetailDialog } from "@/app/(protected)/pendaftaran/_components/detail-dialog-vendor";
import { DriverDetailDialog } from "@/app/(protected)/pendaftaran/_components/detail-dialog-driver";
import { useVendors } from "@/hooks/useVendors";
import { useRegistrationDetail } from "@/hooks/useRegistrationDetail";
import {
  assignDriverToVendor,
  assignVendorToSchoolByVendorId,
} from "@/lib/registration-service";

function formatDateTime(dateString: string): string {
  try {
    return format(new Date(dateString), "dd MMMM yyyy HH:mm:ss", {
      locale: idLocale,
    });
  } catch {
    return dateString;
  }
}

function statusBadgeVariant(data: RegistrationData) {
  const label = getStatusLabel(data);
  if (label === "Disetujui") return "success" as const;
  if (label === "Ditolak") return "destructive" as const;
  return "warning" as const;
}

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface DetailDialogProps {
  isOpen: boolean;
  data: RegistrationData | null;
  isActionLoading: boolean;
  onClose: () => void;
  onApprove: (id: string) => Promise<void>;
  onReject: (id: string, reason: string) => Promise<void>;
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function DetailDialog({
  isOpen,
  data,
  isActionLoading,
  onClose,
  onApprove,
  onReject,
}: DetailDialogProps) {
  const [rejectReason, setRejectReason] = useState("");
  const [isRejectMode, setIsRejectMode] = useState(false);
  const [isAssigningVendor, setIsAssigningVendor] = useState(false);

  // Fetch all vendors for assignment
  const { vendors } = useVendors();

  // Subscribe to detail of specific registration item
  // This ensures we get real-time updates when data changes in Firestore
  const registrationType = data
    ? isSchool(data)
      ? "school"
      : isDriver(data)
        ? "driver"
        : "vendor"
    : null;

  const { data: detailData } = useRegistrationDetail(
    data ? registrationType : null,
    data?.id,
  );

  // Use the real-time detail data if available, otherwise fall back to prop
  const displayData = detailData || data;

  if (!displayData) return null;

  const displayName = getRegistrationName(displayData);
  const statusLabel = getStatusLabel(displayData);
  const isAlreadyApproved = displayData.isApproved === true;

  const handleApprove = async () => {
    try {
      await onApprove(displayData.id!);
      toast.success("Pendaftaran berhasil disetujui");
      resetAndClose();
    } catch {
      toast.error("Gagal menyetujui pendaftaran");
    }
  };

  const handleReject = async () => {
    if (!rejectReason.trim()) {
      toast.error("Masukkan alasan penolakan");
      return;
    }
    try {
      await onReject(displayData.id!, rejectReason);
      toast.success("Pendaftaran ditolak");
      resetAndClose();
    } catch {
      toast.error("Gagal menolak pendaftaran");
    }
  };

  const handleDriverVendorAssignment = async (vendorId: string) => {
    if (!isDriver(displayData) || !displayData.id) return;

    try {
      setIsAssigningVendor(true);
      await assignDriverToVendor(displayData.id, vendorId);
      toast.success("Driver berhasil ditugaskan ke Vendor");
      // Don't close dialog - let real-time data update from Firestore
      // useRegistrationDetail hook will automatically fetch updated data
    } catch (error) {
      console.error("Error assigning driver:", error);
      toast.error("Gagal menugaskan driver ke vendor");
    } finally {
      setIsAssigningVendor(false);
    }
  };

  const handleSchoolVendorAssignment = async (vendorId: string) => {
    if (!isSchool(displayData) || !displayData.id) return;

    try {
      setIsAssigningVendor(true);
      await assignVendorToSchoolByVendorId(displayData.id, vendorId);
      toast.success("Vendor berhasil ditugaskan ke Sekolah");
      // Don't close dialog - let real-time data update from Firestore
      // useRegistrationDetail hook will automatically fetch updated data
    } catch (error) {
      console.error("Error assigning school vendor:", error);
      toast.error("Gagal menugaskan vendor ke sekolah");
    } finally {
      setIsAssigningVendor(false);
    }
  };

  const resetAndClose = () => {
    setRejectReason("");
    setIsRejectMode(false);
    onClose();
  };

  const cancelReject = () => {
    setIsRejectMode(false);
    setRejectReason("");
  };

  return (
    <Dialog open={isOpen} onOpenChange={resetAndClose}>
      <DialogContent className="min-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* ── Header ── */}
        <DialogHeader className="p-5 border-b border-border">
          <div className="flex-1 min-w-0">
            <DialogTitle className="text-xl font-bold wrap-break-word leading-tight">
              {displayName}
            </DialogTitle>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="text-sm text-muted-foreground font-mono">
                {displayData.email}
              </span>
              <span className="text-xs text-muted-foreground/60">·</span>
              <span className="text-xs text-muted-foreground/70 font-mono">
                ID: {displayData.id}
              </span>
            </div>
          </div>
          <Badge
            variant={statusBadgeVariant(displayData)}
            className="shrink-0 text-sm px-3 py-1"
          >
            {statusLabel}
          </Badge>
        </DialogHeader>

        {/* ── Type-specific content ── */}

        {isSchool(displayData) && (
          <SchoolDetailDialog
            data={displayData as School}
            vendors={vendors as Vendor[]}
            rejectReason={rejectReason}
            isRejectMode={isRejectMode}
            isAssigningVendor={isAssigningVendor}
            onRejectReasonChange={setRejectReason}
            onVendorSelected={handleSchoolVendorAssignment}
            formatDateTime={formatDateTime}
          />
        )}
        {isVendor(displayData) && (
          <VendorDetailDialog
            data={displayData as Vendor}
            rejectReason={rejectReason}
            isRejectMode={isRejectMode}
            onRejectReasonChange={setRejectReason}
            formatDateTime={formatDateTime}
          />
        )}
        {isDriver(displayData) && (
          <DriverDetailDialog
            data={displayData as Driver}
            vendors={vendors as Vendor[]}
            rejectReason={rejectReason}
            isRejectMode={isRejectMode}
            isAssigningVendor={isAssigningVendor}
            onRejectReasonChange={setRejectReason}
            onVendorSelected={handleDriverVendorAssignment}
            formatDateTime={formatDateTime}
          />
        )}

        {/* ── Footer actions ── */}
        <DialogFooter className="px-6 py-4 border-t border-border">
          {!isRejectMode ? (
            <>
              <Button
                variant="outline"
                onClick={() => setIsRejectMode(true)}
                disabled={isActionLoading || isAlreadyApproved}
                className="gap-2"
              >
                <XCircle className="h-4 w-4" />
                Tolak
              </Button>
              <Button
                onClick={handleApprove}
                disabled={isActionLoading || isAlreadyApproved}
                className="gap-2"
              >
                {isActionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Memproses…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="h-4 w-4" />
                    Setujui
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button
                variant="outline"
                onClick={cancelReject}
                disabled={isActionLoading}
              >
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isActionLoading || !rejectReason.trim()}
                className="gap-2"
              >
                {isActionLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Menolak…
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    Konfirmasi Penolakan
                  </>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
