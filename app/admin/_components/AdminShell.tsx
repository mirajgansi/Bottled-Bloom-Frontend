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
    <div className="min-h-screen w-full flex flex-col" style={{ backgroundColor: "var(--bg-primary)" }}>
      <Header onMenuClick={() => setSidebarOpen(true)} />

      <div className="flex flex-1 w-full">
        {/* Desktop */}
        <aside
          className="hidden lg:block w-64 shrink-0"
          style={{
            borderRight: "1px solid var(--border-subtle)",
            backgroundColor: "var(--bg-secondary)",
          }}
        >
          <Sidebar />
        </aside>

        {/* Mobile drawer */}
        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-50">
            {/* backdrop */}
            <button
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
              aria-label="Close sidebar"
            />

            {/* small panel */}
            <div
              className="relative h-full w-20 flex flex-col"
              style={{
                backgroundColor: "var(--bg-secondary)",
                borderRight: "1px solid var(--border-subtle)",
              }}
            >
              {/* top row with X */}
              <div
                className="h-14 flex items-center justify-center"
                style={{ borderBottom: "1px solid var(--border-subtle)" }}
              >
                <button
                  type="button"
                  onClick={() => setSidebarOpen(false)}
                  className="h-10 w-10 rounded-xl grid place-items-center text-xl transition-colors"
                  style={{
                    border: "1px solid var(--border-strong)",
                    color: "var(--text-primary)",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
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

        <main className="flex-1 px-4 sm:px-6 py-6" style={{ backgroundColor: "var(--bg-primary)" }}>
          {children}
        </main>
      </div>
    </div>
  );
}