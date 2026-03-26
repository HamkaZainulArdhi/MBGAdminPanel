"use client";

import { useState, useEffect } from "react";
import { collection, query, where, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { School, Driver } from "@/lib/types/registration";

export interface SchoolReportSummary {
  totalActive: number;
  totalPorsi: number;
  totalStudents: number;
  missingVendor: number;
  missingDriver: number;
}

export function useSchoolReports() {
  const [schools, setSchools] = useState<School[]>([]);
  const [driverNames, setDriverNames] = useState<Record<string, string>>({});
  const [vendorNames, setVendorNames] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [summaryData, setSummaryData] = useState<SchoolReportSummary>({
    totalActive: 0,
    totalPorsi: 0,
    totalStudents: 0,
    missingVendor: 0,
    missingDriver: 0,
  });

  useEffect(() => {
    // 1. Fetch Approved Schools
    const qSchools = query(
      collection(db, "schools"),
      where("isApproved", "==", true)
    );

    const unsubscribeSchools = onSnapshot(qSchools, (snapshot) => {
      const fetchedSchools: School[] = [];
      let totalPorsi = 0;
      let totalStudents = 0;
      let missingVendor = 0;
      let missingDriver = 0;

      snapshot.forEach((doc) => {
        const data = doc.data() as School;
        data.id = doc.id;
        fetchedSchools.push(data);

        const porsiTotal = typeof data.porsi === "object" && data.porsi !== null
          ? Object.values(data.porsi).reduce((sum, val) => sum + (Number(val) || 0), 0)
          : (Number(data.porsi) || 0);

        totalPorsi += porsiTotal;
        totalStudents += data.lastStudentCount || 0;

        if (!data.assignedVendorEmail) missingVendor++;
        if (!data.assignedDriverId) missingDriver++;
      });

      setSchools(fetchedSchools);
      setSummaryData({
        totalActive: fetchedSchools.length,
        totalPorsi,
        totalStudents,
        missingVendor,
        missingDriver,
      });
      setLoading(false);
    }, (error) => {
      console.error("Error fetching school reports: ", error);
      setLoading(false);
    });

    // 2. Fetch all drivers to map ID -> Name
    const unsubscribeDrivers = onSnapshot(collection(db, "drivers"), (snapshot) => {
      const namesMap: Record<string, string> = {};
      snapshot.forEach((doc) => {
        const data = doc.data() as Driver;
        namesMap[doc.id] = data.name;
        if (data.driverId) namesMap[data.driverId] = data.name;
      });
      setDriverNames(namesMap);
    }, (error) => {
      console.error("Error fetching drivers: ", error);
    });

    // 3. Fetch all vendors to map Email -> Name
    const unsubscribeVendors = onSnapshot(collection(db, "vendors"), (snapshot) => {
      const namesMap: Record<string, string> = {};
      snapshot.forEach((doc) => {
        const data = doc.data() as any; // Using any to avoid strict typing issues during fetch
        if (data.email) namesMap[data.email] = data.name;
      });
      setVendorNames(namesMap);
    }, (error) => {
      console.error("Error fetching vendors: ", error);
    });

    return () => {
      unsubscribeSchools();
      unsubscribeDrivers();
      unsubscribeVendors();
    };
  }, []);

  return { schools, loading, summaryData, driverNames, vendorNames };
}
