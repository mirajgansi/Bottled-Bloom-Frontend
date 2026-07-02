import axios from "./axios";
import { API } from "./endpoint";

// (optional) create an event like cart if you want UI refresh
// export const NOTIFICATION_UPDATED_EVENT = "notification:updated";
// export const emitNotificationUpdated = () => window.dispatchEvent(new Event(NOTIFICATION_UPDATED_EVENT));

export type NotificationItem = {
  _id: string;
  to: string;
  from?: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  data?: {
    orderId?: string;
    productId?: string;
    etaMinutes?: number;
    location?: { lat: number; lng: number };
    url?: string;
  };
  createdAt: string;
};

export const getMyNotifications = async (params?: {
  page?: number;
  limit?: number;
  read?: boolean;
}) => {
  try {
    const res = await axios.get(API.NOTIFICATION.GET_MY, { params });
    return res.data as {
      items: NotificationItem[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch notifications",
    );
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const res = await axios.get(API.NOTIFICATION.UNREAD_COUNT);
    return res.data as { count: number };
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to fetch unread count",
    );
  }
};

export const markNotificationRead = async (id: string) => {
  try {
    const res = await axios.patch(API.NOTIFICATION.MARK_READ(id));
    // emitNotificationUpdated();
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to mark notification read",
    );
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const res = await axios.patch(API.NOTIFICATION.READ_ALL);
    // emitNotificationUpdated();
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Failed to mark all as read",
    );
  }
};
