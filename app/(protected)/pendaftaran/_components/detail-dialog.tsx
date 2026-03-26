"use client";

import { useState } from "react";
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

  if (!data) return null;

  const displayName = getRegistrationName(data);
  const statusLabel = getStatusLabel(data);
  const isAlreadyApproved = data.isApproved === true;

  const handleApprove = async () => {
    try {
      await onApprove(data.id!);
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
      await onReject(data.id!, rejectReason);
      toast.success("Pendaftaran ditolak");
      resetAndClose();
    } catch {
      toast.error("Gagal menolak pendaftaran");
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
            <DialogTitle className="text-xl font-bold break-words leading-tight">
              {displayName}
            </DialogTitle>
            <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-0.5">
              <span className="text-sm text-muted-foreground font-mono">{data.email}</span>
              <span className="text-xs text-muted-foreground/60">·</span>
              <span className="text-xs text-muted-foreground/70 font-mono">ID: {data.id}</span>
            </div>
          </div>
          <Badge variant={statusBadgeVariant(data)} className="shrink-0 text-sm px-3 py-1">
            {statusLabel}
          </Badge>
        </DialogHeader>

        {/* ── Type-specific content ── */}

        {isSchool(data) && (
          <SchoolDetailDialog
            data={data as School}
            rejectReason={rejectReason}
            isRejectMode={isRejectMode}
            onRejectReasonChange={setRejectReason}
            formatDateTime={formatDateTime}
          />
        )}
        {isVendor(data) && (
          <VendorDetailDialog
            data={data as Vendor}
            rejectReason={rejectReason}
            isRejectMode={isRejectMode}
            onRejectReasonChange={setRejectReason}
            formatDateTime={formatDateTime}
          />
        )}
        {isDriver(data) && (
          <DriverDetailDialog
            data={data as Driver}
            rejectReason={rejectReason}
            isRejectMode={isRejectMode}
            onRejectReasonChange={setRejectReason}
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
                  <><Loader2 className="h-4 w-4 animate-spin" />Memproses…</>
                ) : (
                  <><CheckCircle2 className="h-4 w-4" />Setujui</>
                )}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={cancelReject} disabled={isActionLoading}>
                Batal
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isActionLoading || !rejectReason.trim()}
                className="gap-2"
              >
                {isActionLoading ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Menolak…</>
                ) : (
                  <><XCircle className="h-4 w-4" />Konfirmasi Penolakan</>
                )}
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
