"use client";

import { useAuth } from "@/context/AuthContext";
import { socket } from "@/lib/socket";
import { Socket } from "net";
import { useEffect } from "react";


export default function Layout({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user?._id) return;

    socket.connect();

    socket.on("connect", () => {
      console.log("✅ connected:", socket.id);
      socket.emit("join", user._id);
    });

    socket.on("notification", (data) => {
      console.log("🔔 notification:", data);
    });

    return () => {
      socket.off("notification");
    };
  }, [user?._id]);

  return <>{children}</>;
}
