"use client";

import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { socket } from "@/lib/socket";

export default function UserSocketClient() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading || !user?._id) return;

    const onConnect = () => {
      console.log("✅ SOCKET CONNECTED:", socket.id, "USER:", user._id);
      socket.emit("join", user._id);
    };

    const onNotification = (data: any) => {
      console.log("🔔 notification:", data);
      window.dispatchEvent(new Event("NOTIFICATION_UPDATED"));
    };

    socket.on("connect", onConnect);
    socket.on("notification", onNotification);

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("connect", onConnect);
      socket.off("notification", onNotification);
      // Do NOT socket.disconnect() here unless you really want disconnect on route change
    };
  }, [loading, user?._id]);

  return null;
}