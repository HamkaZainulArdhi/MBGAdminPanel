/**
 * Firestore Helper Functions
 * ============================================================================
 * Shared utilities for Firestore data normalization and conversion.
 */

import { DocumentData } from "firebase/firestore";
import { RegistrationType, RegistrationData } from "@/lib/types/registration";

/**
 * Convert Firestore Timestamp, string, or falsy value to ISO date string.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toISODate(value: any): string {
  if (!value) return "";
  if (typeof value?.toDate === "function") return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return String(value);
}

/**
 * Normalize raw Firestore document into typed RegistrationData.
 *
 * Key mapping:
 *  - schools: Firestore "name" → stays "name" (also copies to "schoolName" for backward compat)
 *  - vendors/drivers: no remapping required
 *
 * Also converts Firestore Timestamps to ISO strings.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function normaliseRegistration(
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
    return { ...base, name, schoolName: name } as RegistrationData;
  }

  return base as RegistrationData;
}
