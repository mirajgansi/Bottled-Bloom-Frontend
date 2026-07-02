"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

export default function AdminLayoutClient({
  children,
  user,
}: {
  children: React.ReactNode;
  user: any;
}) {
  const { setUser } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (user?._id) setUser(user);
  }, [user, setUser]);

  const displayName = user?.userName || user?.name || user?.email || "Admin";
  const roleLabel = (user?.role || "admin").toString().toUpperCase();

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 w-full">
        {/* Desktop */}
        <aside className="hidden lg:block w-64 shrink-0 border-r border-black/10 bg-background">
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
  <div className="lg:hidden fixed inset-0 z-50">
    {/* backdrop */}
    <button
      className="absolute inset-0 bg-black/30"
      onClick={() => setSidebarOpen(false)}
      aria-label="Close sidebar"
    />

    {/* small panel */}
    <div className="relative h-full w-20 bg-white border-r border-black/10 flex flex-col">
      {/* top row with X */}
      <div className="h-14 flex items-center justify-center border-b border-black/10">
        <button
          type="button"
          onClick={() => setSidebarOpen(false)}
          className="h-10 w-10 rounded-xl ring-1 ring-black/10 hover:bg-gray-50 grid place-items-center text-xl"
          aria-label="Close menu"
          title="Close"
        >
          ✕
        </button>
      </div>

      {/* icons */}
      <div className="flex-1 overflow-y-auto">
        <Sidebar />
      </div>
    </div>
  </div>
)}

        <main className="flex-1 px-4 sm:px-6 py-6 bg-background">
          {children}
        </main>
      </div>
    </div>
  );
}