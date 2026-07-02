"use server";

import {
  getDrivers,
  getDriverStats,
  getDriverStatsById,
  getDriverDetail,
} from "@/lib/api/driver"; // adjust path if needed
import { revalidatePath } from "next/cache";

type ActionResponse<T = any> =
  | { success: true; message?: string; data?: T }
  | { success: false; message: string; issues?: any };

function toMessage(err: any, fallback: string) {
  return err?.message || err?.response?.data?.message || fallback;
}

/** ---------------- DRIVER ACTIONS ---------------- */

// GET ALL DRIVERS
export async function handleGetDrivers(): Promise<ActionResponse> {
  try {
    const data = await getDrivers();
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      message: toMessage(err, "Failed to fetch drivers"),
    };
  }
}

// GET DRIVER STATS (table)
export async function handleGetDriverStats(): Promise<ActionResponse> {
  try {
    const data = await getDriverStats();
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      message: toMessage(err, "Failed to fetch driver stats"),
    };
  }
}

// GET SINGLE DRIVER STATS
export async function handleGetDriverStatsById(
  id: string,
): Promise<ActionResponse> {
  try {
    if (!id || id.trim() === "") {
      return { success: false, message: "Driver id is required" };
    }

    const data = await getDriverStatsById(id);
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      message: toMessage(err, "Failed to fetch driver stats"),
    };
  }
}

// GET SINGLE DRIVER DETAIL
export async function handleGetDriverDetail(
  id: string,
): Promise<ActionResponse> {
  try {
    if (!id || id.trim() === "") {
      return { success: false, message: "Driver id is required" };
    }

    const data = await getDriverDetail(id);
    return { success: true, data };
  } catch (err: any) {
    return {
      success: false,
      message: toMessage(err, "Failed to fetch driver detail"),
    };
  }
}

/**
 * OPTIONAL: If you have a page that lists drivers/stats,
 * you can revalidate it after any mutation action.
 * (Right now your driver endpoints are GET only, so no mutation here.)
 */

// Example if you later add "assign driver" or "update driver":
// revalidatePath("/admin/drivers");
