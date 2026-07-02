import axios from "../axios";
import { API } from "../endpoint";

type DateRange = {
  from?: string; // "YYYY-MM-DD"
  to?: string; // "YYYY-MM-DD"
};

export const getAdminKpis = async (params?: DateRange) => {
  try {
    const res = await axios.get(API.ADMIN.ANALYTICS.KPIS, { params });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch KPIs",
    );
  }
};

export const getAdminEarnings = async (
  params?: DateRange & {
    group?: "daily" | "weekly" | "monthly";
  },
) => {
  try {
    const res = await axios.get(API.ADMIN.ANALYTICS.EARNINGS, { params });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch earnings analytics",
    );
  }
};

export const getAdminCategoryShare = async (params?: DateRange) => {
  try {
    const res = await axios.get(API.ADMIN.ANALYTICS.CATEGORY_SHARE, { params });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch category share",
    );
  }
};

export const getAdminTopProducts = async (
  params?: DateRange & {
    limit?: number;
  },
) => {
  try {
    const res = await axios.get(API.ADMIN.ANALYTICS.TOP_PRODUCTS, { params });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch top products",
    );
  }
};

export const getAdminDriversAnalytics = async (
  params?: DateRange & {
    limit?: number;
    search?: string; // optional if you later support search by driver name
  },
) => {
  try {
    const res = await axios.get(API.ADMIN.ANALYTICS.DRIVERS, { params });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch drivers analytics",
    );
  }
};
export const getAdminTopViewedProducts = async (params?: {
  limit?: number;
}) => {
  try {
    const res = await axios.get(API.ADMIN.ANALYTICS.TOP_VIEWED_PRODUCTS, {
      params,
    });

    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch top viewed products",
    );
  }
};
