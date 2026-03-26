"use client";

import { useState, useCallback } from "react";
import { RegistrationTabs } from "@/app/(protected)/pendaftaran/_components/registration-tabs";
import { DetailDialog } from "@/app/(protected)/pendaftaran/_components/detail-dialog";
import { useRegistrationData } from "@/hooks/useRegistrationData";
import { RegistrationData, RegistrationType } from "@/lib/types/registration";

export default function PendaftaranPage() {
  const [activeTab, setActiveTab] = useState<RegistrationType>("school");
  const [selectedItem, setSelectedItem] = useState<RegistrationData | null>(
    null,
  );
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch data for all types
  const schoolState = useRegistrationData("school", {
    realTime: true,
    includeApproved: true,
  });
  const vendorState = useRegistrationData("vendor", {
    realTime: true,
    includeApproved: true,
  });
  const driverState = useRegistrationData("driver", {
    realTime: true,
    includeApproved: true,
  });

  // Determine which state to use based on active tab
  const getActiveState = () => {
    switch (activeTab) {
      case "school":
        return schoolState;
      case "vendor":
        return vendorState;
      case "driver":
        return driverState;
      default:
        return schoolState;
    }
  };

  const activeState = getActiveState();

  // Handle detail dialog open
  const handleDetailClick = useCallback((item: RegistrationData) => {
    setSelectedItem(item);
    setIsDialogOpen(true);
  }, []);

  // Handle dialog close
  const handleDialogClose = useCallback(() => {
    setIsDialogOpen(false);
    setSelectedItem(null);
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Pendaftaran Berkas
        </h1>
        <p className="text-muted-foreground mt-2">
          Verifikasi dan persetujuan data pendaftaran dari sistem mobile
        </p>
      </div>

      <RegistrationTabs
        schoolData={schoolState.data}
        vendorData={vendorState.data}
        driverData={driverState.data}
        isLoading={activeState.loading}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onDetailClick={handleDetailClick}
      />

      <DetailDialog
        isOpen={isDialogOpen}
        data={selectedItem}
        isActionLoading={activeState.isActionLoading}
        onClose={handleDialogClose}
        onApprove={activeState.approve}
        onReject={activeState.reject}
      />
    </div>
  );
}
