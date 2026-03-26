/* ============================================================================
   AUDIT SERVICE — Firestore data layer for Advanced Vendor Audit
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
  collectionGroup,
} from "firebase/firestore";
import { db } from "@/lib/firebase";
import { VendorAuditReport, CategoryPerformance, MenuConfigItem } from "@/lib/types/audit";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toNum(val: any): number {
  if (val === undefined || val === null || val === "") return 0;
  const n = Number(val);
  return isNaN(n) ? 0 : n;
}

/**
 * Handle Firestore Timestamp or string dates safely.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function toISODate(val: any): string {
  if (!val) return "—";
  if (typeof val === "string") return val;
  
  // Firestore Timestamp
  if (val && typeof val === "object" && "seconds" in val) {
    try {
      return new Date(val.seconds * 1000).toISOString();
    } catch (e) {
      return "—";
    }
  }
  
  if (val instanceof Date) return val.toISOString();
  
  return String(val);
}

/**
 * Normalise raw Firestore document data into the VendorAuditReport interface.
 */
function normaliseAudit(raw: DocumentData & { id?: string, vendorEmail?: string }): VendorAuditReport {
  // Handle categories mapping if it's an object instead of array
  const categoriesRaw = raw.categories || [];
  const categories: CategoryPerformance[] = Array.isArray(categoriesRaw) 
    ? categoriesRaw.map((c: any) => ({
        name: c.name || "—",
        porsi: toNum(c.porsi),
        modal: toNum(c.modal),
        pendapatan: toNum(c.pendapatan),
        margin: toNum(c.margin),
        status: c.status || "—",
        harga: toNum(c.harga),
      }))
    : Object.values(categoriesRaw).map((c: any) => ({
        name: c.name || "—",
        porsi: toNum(c.porsi),
        modal: toNum(c.modal),
        pendapatan: toNum(c.pendapatan),
        margin: toNum(c.margin),
        status: c.status || "—",
        harga: toNum(c.harga),
      }));

  // Handle menuConfig
  const menuConfig: Record<string, MenuConfigItem> = {};
  if (raw.menuConfig) {
    Object.entries(raw.menuConfig).forEach(([key, val]: [string, any]) => {
      menuConfig[key] = {
        menuName: val.menuName || "—",
        totalBudget: toNum(val.totalBudget),
        totalPorsi: toNum(val.totalPorsi),
        unitPrice: toNum(val.unitPrice),
      };
    });
  }

  // Attempt to parse hasil_ai if it looks like JSON
  let hasilAi = String(raw.hasil_ai || "—");
  if (hasilAi.startsWith("{")) {
    try {
      const parsed = JSON.parse(hasilAi);
      const firstKey = Object.keys(parsed)[0];
      if (firstKey && parsed[firstKey].STATUS) {
        hasilAi = parsed[firstKey].STATUS;
      } else if (firstKey && parsed[firstKey].status) {
        hasilAi = parsed[firstKey].status;
      }
    } catch (e) {
      // stay as string
    }
  }

  // -- DATA AGGREGATION LOGIC --
  // If top-level fields are missing or zero, derive them from nested data
  let porsi_realisasi = toNum(raw.porsi_realisasi || raw.porsiRealisasi);
  let porsi_target = toNum(raw.porsi_target || raw.totalTargetPorsi);
  let total_modal = toNum(raw.total_modal || raw.totalCapital);
  let total_pendapatan = toNum(raw.total_pendapatan || raw.totalRevenue);
  let wastageCount = toNum(raw.wastageCount);

  // 1. Calculate from categories if categories exist
  if (categories.length > 0) {
    const sumPorsi = categories.reduce((acc, c) => acc + c.porsi, 0);
    const sumModal = categories.reduce((acc, c) => acc + c.modal, 0);
    const sumPendapatan = categories.reduce((acc, c) => acc + c.pendapatan, 0);
    
    // If top-level is 0 but sum is > 0, use sum
    if (porsi_realisasi === 0) porsi_realisasi = sumPorsi;
    if (total_modal === 0) total_modal = sumModal;
    if (total_pendapatan === 0) total_pendapatan = sumPendapatan;
  }

  // 2. Calculate porsi_target from menuConfig if needed
  const menuConfigValues = Object.values(menuConfig);
  if (porsi_target === 0 && menuConfigValues.length > 0) {
    porsi_target = menuConfigValues.reduce((acc, m) => acc + m.totalPorsi, 0);
  }

  // 3. Ensure total_porsi is consistent
  const total_porsi = toNum(raw.total_porsi) || porsi_target;

  return {
    id: String(raw.id || ""),
    vendorEmail: String(raw.vendorEmail || "—"),
    nama_menu: String(raw.nama_menu || "—"),
    waktu_submit: toISODate(raw.waktu_submit || raw.lastUpdate || raw.timestamp),
    suhu_chiller: toNum(raw.suhu_chiller),
    statusLaporan: String(raw.statusLaporan || "PENDING"),
    total_porsi,
    porsi_realisasi,
    porsi_target,
    total_modal,
    total_pendapatan,
    wastageCount,
    wastageReason: String(raw.wastageReason || "—"),
    hasil_ai: hasilAi,
    alasan_utama: String(raw.alasan_utama || "—"),
    categories,
    menuConfig,
    foto_bahan: raw.foto_bahan ? String(raw.foto_bahan) : undefined,
    foto_sanitasi: raw.foto_sanitasi ? String(raw.foto_sanitasi) : undefined,
    foto_menu: raw.foto_menu ? String(raw.foto_menu) : undefined,
    foto_nota: raw.foto_nota ? String(raw.foto_nota) : undefined,
    foto_ai: raw.foto_ai ? String(raw.foto_ai) : undefined,
    foto_ai_2: raw.foto_ai_2 ? String(raw.foto_ai_2) : undefined,
    foto_safety: raw.foto_safety ? String(raw.foto_safety) : undefined,
  };
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Real-time subscription to all vendor history items across all vendors.
 */
export function subscribeToVendorAudits(
  callback: (audits: VendorAuditReport[]) => void,
): Unsubscribe {
  const q = query(collectionGroup(db, "history"));

  return onSnapshot(
    q,
    (snapshot) => {
      const audits = snapshot.docs.map((d) => {
        const vendorEmail = d.ref.parent.parent?.id || "";
        return normaliseAudit({ id: d.id, vendorEmail, ...d.data() });
      });
      // Sort by date (descending)
      audits.sort((a, b) => b.id.localeCompare(a.id));
      callback(audits);
    },
    (error) => {
      console.error("Error subscribing to vendor audits:", error);
      callback([]);
    },
  );
}

/**
 * Fetch a single audit detail.
 */
export async function getVendorAuditDetail(
  vendorEmail: string,
  date: string,
): Promise<VendorAuditReport | null> {
  try {
    // Decode email just in case it was encoded in the URL
    const decodedEmail = decodeURIComponent(vendorEmail);
    const docRef = doc(db, "vendors", decodedEmail, "history", date);
    const snap = await getDoc(docRef);
    if (snap.exists()) {
      return normaliseAudit({ id: snap.id, vendorEmail: decodedEmail, ...snap.data() });
    }
    
    // fall back to raw email if decode failed or didn't change anything
    if (decodedEmail !== vendorEmail) {
       const docRefRaw = doc(db, "vendors", vendorEmail, "history", date);
       const snapRaw = await getDoc(docRefRaw);
       if (snapRaw.exists()) {
         return normaliseAudit({ id: snapRaw.id, vendorEmail, ...snapRaw.data() });
       }
    }

    // Ultimate fallback: search across all history documents for the one that matches this ID
    // and where the parent is the vendorEmail we're looking for.
    const q = query(collectionGroup(db, "history"));
    const querySnap = await getDocs(q);
    const matchedDoc = querySnap.docs.find(d => 
       d.id === date && 
       (d.ref.parent.parent?.id === decodedEmail || d.ref.parent.parent?.id === vendorEmail)
    );

    if (matchedDoc) {
      return normaliseAudit({ id: matchedDoc.id, vendorEmail: matchedDoc.ref.parent.parent?.id || vendorEmail, ...matchedDoc.data() });
    }

    return null;
  } catch (error) {
    console.error("Error fetching vendor audit detail:", error);
    return null;
  }
}
