"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { socket } from "@/lib/socket";

export default function UserSocketClient() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user?._id) return;

    const onConnect = () => {
      console.log("SOCKET CONNECTED:", socket.id);
      socket.emit("join", user._id); // join personal room
    };

    const onConnectError = (err: any) => {
      console.log("SOCKET CONNECT ERROR:", err?.message ?? err);
    };

    const onNotification = (data: any) => {
      console.log("NOTIFICATION:", data);

      // Option 1: tell your bell to refetch
      window.dispatchEvent(new Event("NOTIFICATION_UPDATED"));

      // Option 2: show toast (if you use sonner/toast)
      // toast.success(data?.title ?? "New notification");
    };

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("notification", onNotification);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("connect_error", onConnectError);
      socket.off("notification", onNotification);
      // optional: socket.disconnect(); (only if you want disconnect on leaving user pages)
    };
  }, [loading, user?._id]);

  return null;
}