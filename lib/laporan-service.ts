/* ============================================================================
   LAPORAN SERVICE — Firestore data layer for Anomaly Reports
   ============================================================================ */

import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
  DocumentData,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  AnomalyReport,
  AnomalyReportStatus,
  AnomalyReportWithRelation,
} from "@/lib/types/laporan";
import { School } from "@/lib/types/registration";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toISODate(value: any): string {
  if (!value) return "";
  if (typeof value?.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return String(value);
}

/**
 * Normalise raw Firestore document data into the AnomalyReport interface.
 */
function normaliseReport(raw: DocumentData & { id?: string }): AnomalyReport {
  return {
    id: raw.id || "",
    reporterEmail: raw.reporterEmail || raw.fromSchool || "—",
    category: raw.category || "—",
    notes: raw.notes || "—",
    photoBase64: raw.photoBase64 || "",
    status: (raw.status || "PENDING_INVESTIGATION") as AnomalyReportStatus,
    timestamp: toISODate(raw.timestamp),
    date: raw.date || "—",
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Real-time subscription to all anomaly reports.
 * Ordered by timestamp (newest first)
 */
export function subscribeToAnomalyReports(
  callback: (reports: AnomalyReport[]) => void,
): Unsubscribe {
  const colRef = collection(db, "anomali_reports");
  const q = query(colRef, orderBy("timestamp", "desc"));

  return onSnapshot(
    q,
    (snapshot) => {
      const reports = snapshot.docs.map((d) =>
        normaliseReport({ id: d.id, ...d.data() }),
      );
      callback(reports);
    },
    (error) => {
      console.error("Error subscribing to anomaly reports:", error);
      callback([]);
    },
  );
}

/**
 * Fetch a single anomaly report by ID.
 */
export async function getAnomalyReportById(
  id: string,
): Promise<AnomalyReport | null> {
  try {
    const docRef = doc(db, "anomali_reports", id);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return normaliseReport({ id: snap.id, ...snap.data() });
    }
    return null;
  } catch (error) {
    console.error("Error fetching anomaly report:", error);
    return null;
  }
}

/**
 * Update the status of an anomaly report.
 * Only status can be updated, no other fields.
 */
export async function updateAnomalyReportStatus(
  id: string,
  status: AnomalyReportStatus,
): Promise<boolean> {
  try {
    const docRef = doc(db, "anomali_reports", id);
    await updateDoc(docRef, {
      status,
      lastUpdate: new Date().toISOString(),
    });
    return true;
  } catch (error) {
    console.error("Error updating anomaly report status:", error);
    return false;
  }
}

/**
 * Fetch all schools to build a lookup map (email -> School)
 */
async function buildSchoolMap(): Promise<Record<string, School>> {
  try {
    const snapshot = await getDocs(collection(db, "schools"));
    const map: Record<string, School> = {};
    snapshot.forEach((doc) => {
      const data = doc.data() as School;
      if (data.email) {
        map[data.email] = { ...data, id: doc.id };
      }
    });
    return map;
  } catch (error) {
    console.error("Error building school map:", error);
    return {};
  }
}

/**
 * Fetch all vendors to build a lookup map (email -> Vendor)
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function buildVendorMap(): Promise<Record<string, any>> {
  try {
    const snapshot = await getDocs(collection(db, "vendors"));
    const map: Record<string, any> = {};
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (data.email) {
        map[data.email] = data;
      }
    });
    return map;
  } catch (error) {
    console.error("Error building vendor map:", error);
    return {};
  }
}

/**
 * Enrich a report with related school and vendor information.
 * Requires fetching schools and vendors collections.
 */
export async function enrichReportWithRelations(
  report: AnomalyReport,
): Promise<AnomalyReportWithRelation> {
  const schoolMap = await buildSchoolMap();
  const vendorMap = await buildVendorMap();

  // Find school by email
  const school = schoolMap[report.reporterEmail];
  const schoolName = school?.name || school?.schoolName || "—";
  const assignedVendorEmail = school?.assignedVendorEmail;

  // Find vendor by assigned email
  const vendor = assignedVendorEmail ? vendorMap[assignedVendorEmail] : null;
  const vendorName = vendor?.name || "—";
  const vendorOwnerName = vendor?.ownerName || "—";
  const vendorEmail = vendor?.email || "—";
  const vendorLocation = vendor?.location || "—";

  return {
    ...report,
    schoolName,
    vendorName,
    vendorOwnerName,
    vendorEmail,
    vendorLocation,
  };
}

/**
 * Enrich multiple reports with relations (efficient batch operation)
 */
export async function enrichReportsWithRelations(
  reports: AnomalyReport[],
): Promise<AnomalyReportWithRelation[]> {
  const schoolMap = await buildSchoolMap();
  const vendorMap = await buildVendorMap();

  return reports.map((report) => {
    const school = schoolMap[report.reporterEmail];
    const schoolName = school?.name || school?.schoolName || "—";
    const assignedVendorEmail = school?.assignedVendorEmail;

    const vendor = assignedVendorEmail ? vendorMap[assignedVendorEmail] : null;
    const vendorName = vendor?.name || "—";
    const vendorOwnerName = vendor?.ownerName || "—";
    const vendorEmail = vendor?.email || "—";
    const vendorLocation = vendor?.location || "—";

    return {
      ...report,
      schoolName,
      vendorName,
      vendorOwnerName,
      vendorEmail,
      vendorLocation,
    };
  });
}
