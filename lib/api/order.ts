import axios from "./axios";

import { API } from "./endpoint";

/* ---------------- CREATE ORDER ---------------- */
export const createOrder = async (payload: {
  userId: string;
  items: {
    productId: string;
    name: string;
    price: number;
    image?: string;
    quantity: number;
    lineTotal: number;
  }[];
  subtotal: number;
  shippingFee?: number;
  total: number;
  shippingAddress?: {
    userName?: string;
    phone?: string;
    address1?: string;
    address2?: string;
    city?: string;
    state?: string;
    zip?: string;
  };
  notes?: string;
}) => {
  try {
    const res = await axios.post(API.ORDER.CREATE, payload);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to create order",
    );
  }
};

/* ---------------- GET MY ORDERS ---------------- */
export const getMyOrders = async () => {
  try {
    const res = await axios.get(API.ORDER.GET_MY);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch orders",
    );
  }
};

/* ---------------- GET ORDER BY ID ---------------- */
export const getOrderById = async (orderId: string) => {
  try {
    const res = await axios.get(API.ORDER.GET_ONE(orderId));
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch order",
    );
  }
};

/* ---------------- ADMIN: GET ALL ORDERS ---------------- */
export const getAllOrders = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  tab?: string;
}) => {
  try {
    const response = await axios.get(API.ORDER.GET_ALL, {
      params,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch orders",
    );
  }
};

/* ---------------- ADMIN: UPDATE ORDER STATUS ---------------- */
export const updateOrderStatus = async (
  orderId: string,
  payload: {
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid";
  },
) => {
  try {
    const res = await axios.patch(API.ORDER.UPDATE_STATUS(orderId), payload);
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to update order status",
    );
  }
};
export const cancelOrder = async (id: string) => {
  try {
    const res = await axios.put(API.ORDER.CANCEL(id), {
      withCredentials: true,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(error?.response?.data?.message || "Cancel failed (400)");
  }
};

export const assignDriverToOrder = async (
  orderId: string,
  driverId: string,
) => {
  try {
    const res = await axios.patch(API.ORDER.ASSIGN_DRIVER(orderId), {
      driverId,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to assign driver",
    );
  }
};

/* ---------------- ADMIN: GET DRIVERS ONLY ---------------- */
export const getDrivers = async (params?: {
  search?: string;
  page?: number;
  size?: number;
}) => {
  try {
    const res = await axios.get(API.ORDER.GET_DRIVERS, {
      params: { ...params, role: "driver" },
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch drivers",
    );
  }
};

export const getMyAssignedOrders = async (params?: {
  page?: number;
  size?: number;
}) => {
  try {
    const res = await axios.get(API.ORDER.GET_MY_ASSIGNED, { params });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to fetch driver orders",
    );
  }
};

export const driverUpdateOrderStatus = async (
  orderId: string,
  status: "shipped" | "delivered",
) => {
  try {
    const res = await axios.patch(API.ORDER.DRIVER_UPDATE_STATUS(orderId), {
      status,
    });
    return res.data;
  } catch (error: any) {
    throw new Error(
      error?.response?.data?.message ||
        error?.message ||
        "Failed to update order status",
    );
  }
};
