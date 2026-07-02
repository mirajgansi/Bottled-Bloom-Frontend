"use server";

import { revalidatePath } from "next/cache";
import {
  assignDriverToOrder,
  cancelOrder,
  createOrder,
  driverUpdateOrderStatus,
  getAllOrders,
  getDrivers,
  getMyAssignedOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
} from "@/lib/api/order";

type ActionResponse<T = any> =
  | { success: true; message?: string; data?: T }
  | { success: false; message: string; issues?: any };

function getErrMsg(err: any, fallback = "Something went wrong") {
  return err?.response?.data?.message || err?.message || fallback;
}

/**
 * Checkout: create order from cart
 * Backend computes items/totals from cart, so payload only has shipping/payment info.
 */
export async function handleCreateOrder(payload: {
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
}): Promise<ActionResponse> {
  try {
    const res = await createOrder(payload);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to create order",
        issues: res?.issues,
      };
    }

    revalidatePath("/orders");
    revalidatePath("/user/orders");

    return {
      success: true,
      message: res?.message || "Order created",
      data: res?.data,
    };
  } catch (error: any) {
    const message =
      error?.response?.data?.message ||
      error?.message ||
      "Failed to create order";

    return {
      success: false,
      message,
    };
  }
}

export const handleGetAllOrders = async (params?: {
  page?: number;
  size?: number;
  search?: string;
  tab?: string;
}) => {
  try {
    const response = await getAllOrders({
      page: params?.page ?? 1,
      size: params?.size ?? 10,
      search: params?.search ?? "",
      tab: params?.tab ?? "all",
    });

    if (!response?.success) {
      return {
        success: false,
        message: response?.message || "Failed to fetch orders",
      };
    }

    return {
      success: true,
      message: "Orders fetched successfully",
      orders: response.data.orders,
      pagination: response.data.pagination,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
    };
  }
};

export async function handleGetMyOrders(): Promise<ActionResponse> {
  try {
    const res = await getMyOrders();

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch orders",
        issues: res?.issues,
      };
    }

    return { success: true, data: res?.data };
  } catch (err: any) {
    return {
      success: false,
      message: getErrMsg(err, "Failed to fetch orders"),
    };
  }
}

export async function handleGetOrderById(
  orderId: string,
): Promise<ActionResponse> {
  try {
    const res = await getOrderById(orderId);

    if (!res?.success) {
      return {
        success: false,
        message: res?.message || "Failed to fetch order",
        issues: res?.issues,
      };
    }

    return { success: true, data: res?.data };
  } catch (err: any) {
    return { success: false, message: getErrMsg(err, "Failed to fetch order") };
  }
}

export async function handleUpdateOrderStatus(
  orderId: string,
  payload: {
    status: "pending" | "paid" | "shipped" | "delivered" | "cancelled";
    paymentStatus?: "unpaid" | "paid";
  },
) {
  try {
    if (!orderId) {
      return { success: false, message: "Order ID is required" };
    }

    const result = await updateOrderStatus(orderId, payload);

    // Revalidate admin & user order pages (adjust paths)
    revalidatePath("/admin/orders");
    revalidatePath(`/admin/orders/${orderId}`);
    revalidatePath("/user/orders");

    return {
      success: true,
      message: "Order status updated successfully",
      data: result?.data ?? result,
    };
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update order status",
    };
  }
}
export async function handleCancelMyOrder(
  orderId: string,
): Promise<ActionResponse> {
  try {
    const res = await cancelOrder(orderId);

    if (!res?.success) {
      return { success: false, message: res?.message || "Cancel failed" };
    }

    return {
      success: true,
      message: res?.message || "Order cancelled",
      data: res?.data,
    };
  } catch (err: any) {
    return { success: false, message: err?.message || "Cancel failed" };
  }
}

export async function handleAssignDriver(orderId: string, driverId: string) {
  try {
    console.log("🟡 handleAssignDriver called");
    console.log("➡️ orderId:", orderId);
    console.log("➡️ driverId:", driverId);

    const res = await assignDriverToOrder(orderId, driverId);

    console.log("✅ assignDriverToOrder response:", res);

    if (res?.success) {
      console.log("🔁 Revalidating paths for order:", orderId);
      revalidatePath("/admin/orders");
      revalidatePath(`/admin/orders/${orderId}`);
    } else {
      console.log(" Assign driver failed response:", res);
    }

    return res;
  } catch (error: any) {
    console.error("🔥 handleAssignDriver error:", error);

    return {
      success: false,
      message: error.message || "Failed to assign driver",
    };
  }
}

/* ---------------- ADMIN: GET DRIVERS ---------------- */
export async function handleGetDrivers(params?: {
  page?: number;
  size?: number;
  search?: string;
}) {
  try {
    return await getDrivers(params);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch drivers",
    };
  }
}

export async function handleGetMyAssignedOrders(params?: {
  page?: number;
  size?: number;
}) {
  try {
    return await getMyAssignedOrders(params);
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch orders",
    };
  }
}

export async function handleDriverUpdateOrderStatus(
  orderId: string,
  status: "shipped" | "delivered",
) {
  try {
    const res = await driverUpdateOrderStatus(orderId, status);

    if (res?.success) {
      revalidatePath("/driver/orders");
      revalidatePath(`/driver/orders/${orderId}`);
    }

    return res;
  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to update status",
    };
  }
}
