"use server";

import {
  getDriverStatsById,
  getDriversWithStats,
  getOneDriver,
} from "@/lib/api/admin/driver";

export async function handleGetDrivers(params?: {
  page?: number;
  size?: number;
  search?: string;
}) {
  try {
    // call the single endpoint that already returns enriched drivers
    const res = await getDriversWithStats({ search: params?.search });

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch drivers",
      };
    }

    // res.data is expected to be an array of drivers (already enriched)
    const drivers = Array.isArray(res.data) ? res.data : [];

    // optional: frontend pagination (client-side) if backend doesn't paginate
    const page = params?.page ?? 1;
    const size = params?.size ?? 10;
    const total = drivers.length;
    const totalPages = Math.max(1, Math.ceil(total / size));

    const start = (page - 1) * size;
    const pagedDrivers = drivers.slice(start, start + size);

    return {
      success: true,
      drivers: pagedDrivers,
      pagination: { page, size, total, totalPages },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch drivers",
    };
  }
}
export async function handleGetDriverStatsById(driverId: string) {
  try {
    if (!driverId) {
      return { success: false, message: "Missing driver id" };
    }

    const res = await getDriverStatsById(driverId);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch driver stats",
      };
    }

    return {
      success: true,
      stats: res.data ?? { totalAssigned: 0, deliveredCount: 0 },
    };
  } catch (e: any) {
    return {
      success: false,
      message: e?.message || "Failed to fetch driver stats",
    };
  }
}

export const handleOneDriver = async (params: {
  driverId: string;
  page?: number;
  size?: number;
}) => {
  try {
    const { driverId, page = 1, size = 10 } = params;

    if (!driverId) {
      return { success: false, message: "Missing driver id" };
    }

    // if your API supports page/size query, pass it (optional)
    const response = await getOneDriver(driverId, { page, size });

    if (!response?.success) {
      return {
        success: false,
        message: response?.message || "Failed to fetch driver",
      };
    }

    // ✅ keep same shape as backend: { success, data: {...} }
    return {
      success: true,
      data: response.data,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch driver",
    };
  }
};
