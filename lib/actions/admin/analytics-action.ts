"use server";

import {
  getAdminKpis,
  getAdminEarnings,
  getAdminCategoryShare,
  getAdminTopProducts,
  getAdminDriversAnalytics,
  getAdminTopViewedProducts,
} from "@/lib/api/admin/analytics";

type DateRange = {
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
};

export async function handleGetAdminKpis(params?: DateRange) {
  try {
    const res = await getAdminKpis(params);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch KPIs",
      };
    }

    return {
      success: true,
      kpis: res.data ?? {
        revenue: 0,
        orders: 0,
        avgOrderValue: 0,
        customers: 0,
      },
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch KPIs",
    };
  }
}

export async function handleGetAdminEarnings(
  params?: DateRange & {
    group?: "daily" | "weekly" | "monthly";
  },
) {
  try {
    const res = await getAdminEarnings(params);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch earnings",
      };
    }

    // backend returns: [{ _id: {year,month,day? or week?}, value }]
    const rows = Array.isArray(res.data) ? res.data : [];

    return {
      success: true,
      rows,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch earnings",
    };
  }
}

export async function handleGetAdminCategoryShare(params?: DateRange) {
  try {
    const res = await getAdminCategoryShare(params);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch category share",
      };
    }

    const categories = Array.isArray(res.data) ? res.data : [];

    return {
      success: true,
      categories,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch category share",
    };
  }
}

export async function handleGetAdminTopProducts(
  params?: DateRange & { limit?: number },
) {
  try {
    const res = await getAdminTopProducts(params);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch top products",
      };
    }

    const products = Array.isArray(res.data) ? res.data : [];

    // Optional: add "share%" like your UI needs
    const totalRevenue =
      products.reduce(
        (sum: number, p: any) => sum + (Number(p?.revenue) || 0),
        0,
      ) || 1;

    const enriched = products.map((p: any) => ({
      ...p,
      share: Number(
        (((Number(p?.revenue) || 0) / totalRevenue) * 100).toFixed(1),
      ),
    }));

    return {
      success: true,
      products: enriched,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch top products",
    };
  }
}

export async function handleGetAdminDriversAnalytics(
  params?: DateRange & {
    limit?: number;
    search?: string;
    page?: number;
    size?: number;
  },
) {
  try {
    const res = await getAdminDriversAnalytics({
      from: params?.from,
      to: params?.to,
      limit: params?.limit,
      search: params?.search,
    });

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch driver analytics",
      };
    }

    const drivers = Array.isArray(res.data) ? res.data : [];

    // Optional: client-side pagination (same as your driver action)
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
      message: error?.message || "Failed to fetch driver analytics",
    };
  }
}

/**
 * OPTIONAL: one call to fetch everything dashboard needs at once
 * (helps you load dashboard in a single server action)
 */
export async function handleGetAdminDashboard(
  params?: DateRange & {
    group?: "daily" | "weekly" | "monthly";
    topLimit?: number;
    driverLimit?: number;
  },
) {
  try {
    const [kpisRes, earnRes, catRes, topRes, drvRes, viewRes] =
      await Promise.all([
        getAdminKpis({ from: params?.from, to: params?.to }),
        getAdminEarnings({
          from: params?.from,
          to: params?.to,
          group: params?.group || "daily",
        }),
        getAdminCategoryShare({ from: params?.from, to: params?.to }),
        getAdminTopProducts({
          from: params?.from,
          to: params?.to,
          limit: params?.topLimit ?? 10,
        }),
        getAdminDriversAnalytics({
          from: params?.from,
          to: params?.to,
          limit: params?.driverLimit ?? 10,
        }),
        getAdminTopViewedProducts({
          limit: params?.topLimit ?? 10,
        }),
      ]);

    if (!kpisRes?.success)
      return {
        success: false,
        message: kpisRes?.message || "Failed to fetch KPIs",
      };
    if (!earnRes?.success)
      return {
        success: false,
        message: earnRes?.message || "Failed to fetch earnings",
      };
    if (!catRes?.success)
      return {
        success: false,
        message: catRes?.message || "Failed to fetch category share",
      };
    if (!topRes?.success)
      return {
        success: false,
        message: topRes?.message || "Failed to fetch top products",
      };
    if (!drvRes?.success)
      return {
        success: false,
        message: drvRes?.message || "Failed to fetch driver analytics",
      };
    if (!viewRes?.success)
      return {
        success: false,
        message: viewRes?.message || "Failed to fetch top viewed products",
      };

    const products = Array.isArray(topRes.data) ? topRes.data : [];
    const totalRevenue =
      products.reduce(
        (s: number, p: any) => s + (Number(p?.revenue) || 0),
        0,
      ) || 1;
    const topProducts = products.map((p: any) => ({
      ...p,
      share: Number(
        (((Number(p?.revenue) || 0) / totalRevenue) * 100).toFixed(1),
      ),
    }));

    return {
      success: true,
      kpis: kpisRes.data,
      earnings: Array.isArray(earnRes.data) ? earnRes.data : [],
      categories: Array.isArray(catRes.data) ? catRes.data : [],
      topProducts,
      drivers: Array.isArray(drvRes.data) ? drvRes.data : [],
      topViewed: Array.isArray(viewRes.data) ? viewRes.data : [],
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch admin dashboard",
    };
  }
}
export async function handleGetAdminTopViewedProducts(params?: {
  limit?: number;
}) {
  try {
    const res = await getAdminTopViewedProducts(params);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch top viewed products",
      };
    }

    const rows = Array.isArray(res.data) ? res.data : [];

    return {
      success: true,
      topViewed: rows,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch top viewed products",
    };
  }
}
