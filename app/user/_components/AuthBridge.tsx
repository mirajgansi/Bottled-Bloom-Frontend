"use client";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

export default function AuthBridge({ user }: { user: any }) {
  const { setUser } = useAuth();

  useEffect(() => {
    setUser(user ?? null);
  }, [user, setUser]);

  return null;
}
