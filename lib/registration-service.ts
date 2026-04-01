/* ============================================================================
   REGISTRATION SERVICE — Firebase Firestore data layer
   Handles: real-time listeners, one-time fetches, approve/reject/assign
   ============================================================================ */

import {
  collection,
  query,
  where,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  onSnapshot,
  Unsubscribe,
  QueryConstraint,
  DocumentData,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  School,
  Vendor,
  Driver,
  RegistrationType,
  RegistrationData,
  RegistrationStats,
} from "@/lib/types/registration";

// ---------------------------------------------------------------------------
// Internals
// ---------------------------------------------------------------------------

type CollectionName = "schools" | "vendors" | "drivers";

const COLLECTION_MAP: Record<RegistrationType, CollectionName> = {
  school: "schools",
  vendor: "vendors",
  driver: "drivers",
};

// Converts a Firestore Timestamp, string, or falsy to an ISO date string.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toISODate(value: any): string {
  if (!value) return "";
  if (typeof value?.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return String(value);
}

/**
 * Normalise raw Firestore document data into the typed interfaces.
 *
 * Key mapping:
 *  - schools: Firestore uses "name" — we keep it as "name" (School.name).
 *    We also copy it to "schoolName" so legacy code still works.
 *  - vendors/drivers: no remapping required.
 *
 * Also converts Firestore Timestamp fields to ISO strings so components
 * never receive raw {seconds, nanoseconds} objects.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalise(
  raw: DocumentData & { id?: string },
  type: RegistrationType,
): RegistrationData {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const base: DocumentData = {
    ...raw,
    createdAt: toISODate(raw.createdAt),
    lastUpdate: toISODate(raw.lastUpdate),
  };
  if (type === "school") {
    const name = (base["name"] ?? base["schoolName"] ?? "") as string;
    return { ...base, name, schoolName: name } as School;
  }
  return base as Vendor | Driver;
}

function buildQuery(collectionName: CollectionName, includeApproved: boolean) {
  const constraints: QueryConstraint[] = [];
  if (!includeApproved) {
    constraints.push(where("isApproved", "==", false));
  }
  return constraints.length > 0
    ? query(collection(db, collectionName), ...constraints)
    : collection(db, collectionName);
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * One-time fetch of registrations by type.
 */
export async function fetchRegistrations(
  type: RegistrationType,
  includeApproved = false,
): Promise<RegistrationData[]> {
  const collectionName = COLLECTION_MAP[type];
  const q = buildQuery(collectionName, includeApproved);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => normalise({ id: d.id, ...d.data() }, type));
}

/**
 * Real-time subscription to registrations by type.
 * Returns unsubscribe function — call it on component unmount.
 */
export function subscribeToRegistrations(
  type: RegistrationType,
  callback: (data: RegistrationData[]) => void,
  includeApproved = false,
): Unsubscribe {
  const collectionName = COLLECTION_MAP[type];
  const q = buildQuery(collectionName, includeApproved);

  return onSnapshot(q, (snapshot) => {
    const data = snapshot.docs.map((d) =>
      normalise({ id: d.id, ...d.data() }, type),
    );
    callback(data);
  });
}

/**
 * Fetch a single registration by document ID.
 */
export async function getRegistrationById(
  type: RegistrationType,
  id: string,
): Promise<RegistrationData | null> {
  const collectionName = COLLECTION_MAP[type];
  const docRef = doc(db, collectionName, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) return null;
  return normalise({ id: snap.id, ...snap.data() }, type);
}

/**
 * Approve a registration (sets isApproved = true).
 */
export async function approveRegistration(
  type: RegistrationType,
  id: string,
): Promise<void> {
  const docRef = doc(db, COLLECTION_MAP[type], id);
  await updateDoc(docRef, {
    isApproved: true,
    rejectReason: null,
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Reject a registration with a mandatory reason.
 */
export async function rejectRegistration(
  type: RegistrationType,
  id: string,
  reason: string,
): Promise<void> {
  const docRef = doc(db, COLLECTION_MAP[type], id);
  await updateDoc(docRef, {
    isApproved: false,
    rejectReason: reason,
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Assign a vendor (by email) to a school.
 */
export async function assignVendorToSchool(
  schoolId: string,
  vendorEmail: string,
): Promise<void> {
  const schoolRef = doc(db, "schools", schoolId);
  await updateDoc(schoolRef, {
    assignedVendorEmail: vendorEmail,
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Assign a driver (by ID) to a school.
 */
export async function assignDriverToSchool(
  schoolId: string,
  driverId: string,
): Promise<void> {
  const schoolRef = doc(db, "schools", schoolId);
  await updateDoc(schoolRef, {
    assignedDriverId: driverId,
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Assign a driver to a vendor.
 * Updates:
 * - drivers.assignedVendorId
 * - vendors.driverIds (add driver ID)
 *
 * If driver was previously assigned to another vendor, removes it from that vendor's driverIds.
 */
export async function assignDriverToVendor(
  driverId: string,
  vendorId: string,
): Promise<void> {
  // First, get the driver's current state to check if reassigning
  const driverRef = doc(db, "drivers", driverId);
  const driverSnap = await getDoc(driverRef);
  const currentVendorId = driverSnap.data()?.assignedVendorId;

  // If driver was previously assigned to a different vendor, remove from old vendor's driverIds
  if (currentVendorId && currentVendorId !== vendorId) {
    const oldVendorRef = doc(db, "vendors", currentVendorId);
    await updateDoc(oldVendorRef, {
      driverIds: arrayRemove(driverId),
      lastUpdate: new Date().toISOString(),
    });
  }

  // Assign driver to new vendor
  await updateDoc(driverRef, {
    assignedVendorId: vendorId,
    lastUpdate: new Date().toISOString(),
  });

  // Add driver ID to vendor's driverIds array
  const vendorRef = doc(db, "vendors", vendorId);
  await updateDoc(vendorRef, {
    driverIds: arrayUnion(driverId),
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Remove a driver from a vendor.
 * Updates:
 * - drivers.assignedVendorId (set to null)
 * - vendors.driverIds (remove driver ID)
 */
export async function removeDriverFromVendor(
  driverId: string,
  vendorId: string,
): Promise<void> {
  const driverRef = doc(db, "drivers", driverId);
  await updateDoc(driverRef, {
    assignedVendorId: null,
    lastUpdate: new Date().toISOString(),
  });

  const vendorRef = doc(db, "vendors", vendorId);
  await updateDoc(vendorRef, {
    driverIds: arrayRemove(driverId),
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Assign a vendor to a school using vendorId.
 */
export async function assignVendorToSchoolByVendorId(
  schoolId: string,
  vendorId: string,
): Promise<void> {
  const schoolRef = doc(db, "schools", schoolId);
  await updateDoc(schoolRef, {
    vendorId: vendorId,
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Remove vendor assignment from a school.
 */
export async function removeVendorFromSchool(schoolId: string): Promise<void> {
  const schoolRef = doc(db, "schools", schoolId);
  await updateDoc(schoolRef, {
    vendorId: null,
    lastUpdate: new Date().toISOString(),
  });
}

/**
 * Fetch all approved vendors with their drivers populated.
 * Optionally include only vendors that have drivers (driverIds non-empty).
 */
export async function getAllVendors(
  approvedOnly = true,
  withDriversOnly = false,
): Promise<Vendor[]> {
  const constraints: QueryConstraint[] = [];

  if (approvedOnly) {
    constraints.push(where("isApproved", "==", true));
  }

  const q =
    constraints.length > 0
      ? query(collection(db, "vendors"), ...constraints)
      : collection(db, "vendors");

  const snapshot = await getDocs(q);
  const vendors = snapshot.docs.map((d) =>
    normalise({ id: d.id, ...d.data() }, "vendor"),
  ) as Vendor[];

  // Filter to only vendors with drivers if requested
  if (withDriversOnly) {
    return vendors.filter((v) => v.driverIds && v.driverIds.length > 0);
  }

  return vendors;
}

/**
 * Fetch all approved drivers, optionally with vendor info enriched.
 */
export async function getAllDrivers(approvedOnly = true): Promise<Driver[]> {
  const constraints: QueryConstraint[] = [];

  if (approvedOnly) {
    constraints.push(where("isApproved", "==", true));
  }

  const q =
    constraints.length > 0
      ? query(collection(db, "drivers"), ...constraints)
      : collection(db, "drivers");

  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) =>
    normalise({ id: d.id, ...d.data() }, "driver"),
  ) as Driver[];
}

/**
 * Real-time subscription to all approved vendors.
 */
export function subscribeToVendors(
  callback: (vendors: Vendor[]) => void,
  approvedOnly = true,
  withDriversOnly = false,
): Unsubscribe {
  const constraints: QueryConstraint[] = [];

  if (approvedOnly) {
    constraints.push(where("isApproved", "==", true));
  }

  const q =
    constraints.length > 0
      ? query(collection(db, "vendors"), ...constraints)
      : collection(db, "vendors");

  return onSnapshot(q, (snapshot) => {
    const vendors = snapshot.docs.map((d) =>
      normalise({ id: d.id, ...d.data() }, "vendor"),
    ) as Vendor[];

    const filtered = withDriversOnly
      ? vendors.filter((v) => v.driverIds && v.driverIds.length > 0)
      : vendors;

    callback(filtered);
  });
}

/**
 * Compute counts for total / approved / pending / rejected in a collection.
 */
export async function getRegistrationStats(
  type: RegistrationType,
): Promise<RegistrationStats> {
  const collectionName = COLLECTION_MAP[type];
  const [allSnap, approvedSnap, notApprovedSnap] = await Promise.all([
    getDocs(collection(db, collectionName)),
    getDocs(
      query(collection(db, collectionName), where("isApproved", "==", true)),
    ),
    getDocs(
      query(collection(db, collectionName), where("isApproved", "==", false)),
    ),
  ]);

  const rejectedCount = notApprovedSnap.docs.filter(
    (d) => !!d.get("rejectReason"),
  ).length;

  return {
    total: allSnap.size,
    approved: approvedSnap.size,
    rejected: rejectedCount,
    pending: notApprovedSnap.size - rejectedCount,
  };
}
