/**
 * Offline Sync Queue Manager for Driver Mobile PWA
 * Allows drivers in remote blank spots (mines, plantations, highways)
 * to record fuel logs offline and auto-sync when network connectivity returns.
 */

export interface OfflineQueuedLog {
  id: string;
  queuedAt: number;
  vehicleId: string;
  plateNumber: string;
  brandModel?: string;
  organizationName?: string;
  liters: number;
  odometerKm?: number;
  fuelStation: string;
  driverName: string;
  receiptImageUrl?: string;
  odometerImageUrl?: string;
  latitude?: number;
  longitude?: number;
  notes?: string;
  retryCount: number;
  status: "pending" | "syncing" | "failed";
}

const STORAGE_KEY = "nawasanga_driver_offline_queue";

export function getOfflineQueue(): OfflineQueuedLog[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function saveOfflineQueue(items: OfflineQueuedLog[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error("Gagal menyimpan antrean offline ke localStorage:", err);
  }
}

export function enqueueOfflineFuelLog(
  data: Omit<OfflineQueuedLog, "id" | "queuedAt" | "retryCount" | "status">
): OfflineQueuedLog {
  const currentQueue = getOfflineQueue();
  const newLog: OfflineQueuedLog = {
    ...data,
    id: `offline_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    queuedAt: Date.now(),
    retryCount: 0,
    status: "pending",
  };

  const updatedQueue = [newLog, ...currentQueue];
  saveOfflineQueue(updatedQueue);
  return newLog;
}

export function removeOfflineLog(id: string): void {
  const currentQueue = getOfflineQueue();
  const updated = currentQueue.filter((item) => item.id !== id);
  saveOfflineQueue(updated);
}

export function getOfflineQueueCount(): number {
  return getOfflineQueue().filter((item) => item.status === "pending").length;
}

/**
 * Iterates through all pending offline logs and pushes them to the server
 */
export async function syncOfflineQueue(
  onProgress?: (synced: number, total: number) => void
): Promise<{ successCount: number; failedCount: number }> {
  const queue = getOfflineQueue();
  if (queue.length === 0) return { successCount: 0, failedCount: 0 };

  let successCount = 0;
  let failedCount = 0;
  const remainingQueue: OfflineQueuedLog[] = [];

  for (let i = 0; i < queue.length; i++) {
    const item = queue[i];
    try {
      const payload = {
        vehicleId: item.vehicleId,
        liters: item.liters,
        odometerKm: item.odometerKm,
        fuelStation: item.fuelStation,
        driverName: item.driverName,
        receiptImageUrl: item.receiptImageUrl,
        notes: item.notes ? `${item.notes} (Tersinkronisasi dari Antrean Offline)` : "Input via Offline Sync PWA",
        latitude: item.latitude,
        longitude: item.longitude,
      };

      const res = await fetch("/api/internal/fuel-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        successCount++;
      } else {
        item.retryCount += 1;
        remainingQueue.push(item);
        failedCount++;
      }
    } catch {
      item.retryCount += 1;
      remainingQueue.push(item);
      failedCount++;
    }

    if (onProgress) {
      onProgress(i + 1, queue.length);
    }
  }

  saveOfflineQueue(remainingQueue);
  return { successCount, failedCount };
}
