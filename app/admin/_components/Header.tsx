"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import AvatarMenu from "@/app/_componets/AvatarMenu";

function formatTime(d: Date) {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(d);
}

function formatDate(d: Date) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(d);
}

export default function Header({
  onMenuClick,
}: {
  onMenuClick?: () => void;
}) {
  const { user, loading } = useAuth();
  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const displayName = user?.userName || user?.name || user?.email || "Admin";

  if (loading || !user?._id) return null;

  return (
    <header
      className="sticky top-0 z-50 backdrop-blur"
      style={{
        borderBottom: "1px solid var(--border-subtle)",
        backgroundColor: "rgba(23, 17, 12, 0.85)",
      }}
    >
      <nav className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              type="button"
              onClick={onMenuClick}
              className="lg:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl transition-colors"
              style={{
                border: "1px solid var(--border-strong)",
                color: "var(--text-primary)",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "var(--bg-elevated)")}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "transparent")}
              aria-label="Open menu"
              title="Menu"
            >
              ☰
            </button>

            <Link href="/admin" className="flex items-center gap-3 sm:gap-4">
             

              <div className="leading-tight">
                <div
                  className="text-base sm:text-lg font-bold"
                  style={{ color: "var(--gold-primary)", fontFamily: "Georgia, serif" }}
                >
                  Bottled Bloom
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium" style={{ color: "var(--text-secondary)" }}>
                  {formatTime(now)} <span className="mx-1">•</span> {formatDate(now)}
                </div>
              </div>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="block text-right leading-tight">
              <div className="text-sm font-semibold" style={{ color: "var(--text-primary)" }}>
                {displayName}
              </div>
              <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                {user.role?.toUpperCase?.() ?? "ADMIN"}
              </div>
            </div>

            <AvatarMenu
              displayName={displayName}
              profileHref="/admin/profile"
              roleLabel="Admin"
            />
          </div>
        </div>
      </nav>
    </header>
  );
}