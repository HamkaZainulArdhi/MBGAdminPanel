/* ============================================================================
   VENDOR SERVICE — Firestore data layer for Vendor SPPG
   ============================================================================ */

import {
  collection,
  query,
  getDocs,
  getDoc,
  doc,
  onSnapshot,
  Unsubscribe,
  DocumentData,
  where,
  orderBy,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Vendor, VendorRating } from "@/lib/types/vendor";

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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function n(val: any): number {
  if (val === undefined || val === null || val === "") return 0;
  const num = Number(val);
  return isNaN(num) ? 0 : num;
}

/**
 * Normalise raw Firestore document data into the Vendor interface.
 */
function normaliseVendor(raw: DocumentData & { id?: string }): Vendor {
  return {
    ...raw,
    id: raw.id,
    vendorId: raw.vendorId || raw.id || "",
    name: raw.name || "—",
    ownerName: raw.ownerName || "—",
    email: raw.email || "—",
    location: raw.location || "—",
    nib: raw.nib || "—",
    employeeCount: n(raw.employeeCount),
    isApproved: Boolean(raw.isApproved),
    aiVerified: Boolean(raw.aiVerified),
    safetyVerified: Boolean(raw.safetyVerified),
    safetyConfirmed: Boolean(raw.safetyConfirmed),
    safetyTemp: n(raw.safetyTemp),
    complianceScore: n(raw.complianceScore),
    currentStep: n(raw.currentStep),
    statusProduksi: raw.statusProduksi || "—",
    averageRating: n(raw.averageRating),
    targetPorsi: n(raw.targetPorsi),
    cookedCount: n(raw.cookedCount),
    rawMaterialWeight: n(raw.rawMaterialWeight),
    cookingStartTime: toISODate(raw.cookingStartTime),
    cookingEndTime: toISODate(raw.cookingEndTime),
    chillerTemp: n(raw.chillerTemp),
    totalCapital: n(raw.totalCapital),
    latitude: n(raw.latitude),
    longitude: n(raw.longitude),
    hasHalal: Boolean(raw.hasHalal),
    setujuSLA: Boolean(raw.setujuSLA),
    setujuLaporan: Boolean(raw.setujuLaporan),
    setujuGizi: Boolean(raw.setujuGizi),
    operatingHours: raw.operatingHours || "—",
    createdAt: toISODate(raw.createdAt),
    lastUpdate: toISODate(raw.lastUpdate),
  } as Vendor;
}

/**
 * Normalise raw Firestore document data into the VendorRating interface.
 */
function normaliseRating(raw: DocumentData & { id?: string }): VendorRating {
  return {
    id: raw.id || "",
    fromSchool: raw.fromSchool || "Sekolah Umum",
    targetId: raw.targetId || "",
    review: raw.review || "Tidak ada komentar",
    historyId: raw.historyId || "",
    rating: n(raw.rating),
    timestamp: toISODate(raw.timestamp),
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Real-time subscription to vendors.
 */
export function subscribeToVendors(
  callback: (vendors: Vendor[]) => void,
): Unsubscribe {
  const colRef = collection(db, "vendors");

  return onSnapshot(colRef, (snapshot) => {
    const vendors = snapshot.docs.map((d) =>
      normaliseVendor({ id: d.id, ...d.data() }),
    );
    callback(vendors);
  });
}

/**
 * Real-time subscription to ratings for a specific vendor.
 */
export function subscribeToVendorRatings(
  targetId: string,
  callback: (ratings: VendorRating[]) => void,
): Unsubscribe {
  const colRef = collection(db, "vendor_ratings");
  const q = query(colRef, where("targetId", "==", targetId));

  return onSnapshot(q, (snapshot) => {
    const ratings = snapshot.docs
      .map((d) => normaliseRating({ id: d.id, ...d.data() }))
      .sort((a, b) => {
        return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
      });
    callback(ratings);
  });
}

/**
 * Fetch a single vendor by document ID or vendorId field.
 */
export async function getVendorById(id: string): Promise<Vendor | null> {
  // 1. Try by Document ID
  const docRef = doc(db, "vendors", id);
  const snap = await getDoc(docRef);
  if (snap.exists()) {
    return normaliseVendor({ id: snap.id, ...snap.data() });
  }

  // 2. Fallback: Try by vendorId field
  const qV = query(collection(db, "vendors"), where("vendorId", "==", id));
  const qVSnap = await getDocs(qV);
  if (!qVSnap.empty) {
    const d = qVSnap.docs[0];
    return normaliseVendor({ id: d.id, ...d.data() });
  }

  // 3. Second Fallback: Try by email field (common in this project)
  const qE = query(collection(db, "vendors"), where("email", "==", id));
  const qESnap = await getDocs(qE);
  if (!qESnap.empty) {
    const d = qESnap.docs[0];
    return normaliseVendor({ id: d.id, ...d.data() });
  }

  return null;
}
