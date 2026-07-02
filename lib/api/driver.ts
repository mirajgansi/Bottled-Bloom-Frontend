import axios, { AxiosError } from "axios";
import { API } from "./endpoint";
import axiosInstance from "@/lib/api/axios";

/** ---------- Types ---------- */

export type Driver = {
  _id: string;
  name?: string;
  email?: string;
  phone?: string;
  profilePicture?: string;
};

export type DriverStatsRow = {
  driverId: string;
  driverName?: string;
  totalAssigned?: number;
  delivered?: number;
  shipped?: number;
  cancelled?: number;
  totalEarnings?: number;
};

export type DriverStatsResponse = {
  data?: DriverStatsRow[];
};

export type DriverDetailResponse = {
  data?: Driver;
};

/** ---------- Helper ---------- */
function handleAxiosError(error: unknown): never {
  if (axios.isAxiosError(error)) {
    const e = error as AxiosError<any>;
    const message =
      e.response?.data?.message ||
      e.response?.data?.error ||
      e.message ||
      "Something went wrong";
    throw new Error(message);
  }
  throw new Error("Unexpected error occurred");
}

/** ---------- API Calls ---------- */

// GET: /api/driver/stats (list)
export async function getDrivers(): Promise<DriverStatsResponse> {
  try {
    const res = await axiosInstance.get(API.DRIVER.GET_ALL);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// GET: /api/driver/stats
export async function getDriverStats(): Promise<DriverStatsResponse> {
  try {
    const res = await axiosInstance.get(API.DRIVER.GET_STATS);
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// GET: /api/driver/stats/:id
export async function getDriverStatsById(
  id: string,
): Promise<{ data?: DriverStatsRow }> {
  try {
    if (!id || id.trim() === "") throw new Error("Driver id is required");

    const res = await axiosInstance.get(API.DRIVER.GET_ONE_STATS(id));
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}

// GET: /api/driver/:id/detail
export async function getDriverDetail(
  id: string,
): Promise<DriverDetailResponse> {
  try {
    if (!id || id.trim() === "") throw new Error("Driver id is required");

    const res = await axiosInstance.get(API.DRIVER.GET_ONE_DRIVER(id));
    return res.data;
  } catch (error) {
    handleAxiosError(error);
  }
}
