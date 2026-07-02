"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";

import AvatarMenu from "@/app/_componets/AvatarMenu";
import NotificationBell from "@/app/_componets/Notification";

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
  const { user } = useAuth();

  const [now, setNow] = React.useState(() => new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(id);
  }, []);

  const displayName = user?.userName || user?.name || user?.email || "Driver";

  return (
    <header className="sticky top-0 z-50 border-b border-black/10 bg-white/80 backdrop-blur supports-backdrop-filter:bg-white/70">
      <nav className="mx-auto max-w-full px-4 sm:px-6 lg:px-8">
        <div className="flex h-14 sm:h-16 items-center justify-between">
          {/* LEFT */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* ✅ Menu button (shows below xl) */}
            <button
              type="button"
              onClick={onMenuClick}
              className="xl:hidden inline-flex h-10 w-10 items-center justify-center rounded-xl ring-1 ring-black/10 bg-white hover:bg-gray-50"
              aria-label="Open menu"
              title="Menu"
            >
              ☰
            </button>

            <Link href="/driver" className="flex items-center gap-3 sm:gap-4">
              {/* Logo */}
              <div className="relative h-10 w-10 sm:h-12 sm:w-12 overflow-hidden rounded-full ring-1 ring-black/10">
                <Image src="/cookie.jpg" alt="Logo" fill className="object-cover" />
              </div>

              {/* Title + Time */}
              <div className="leading-tight">
                <div className="text-base sm:text-lg font-bold text-black">
                  Click Shop
                </div>
                <div className="text-[10px] sm:text-[11px] font-medium text-gray-500">
                  {formatTime(now)} <span className="mx-1">•</span> {formatDate(now)}
                </div>
              </div>
            </Link>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden md:block text-right leading-tight">
              <div className="text-sm font-semibold text-gray-900">{displayName}</div>
              <div className="text-xs text-gray-500">Driver</div>
            </div>

            <div className="flex justify-center xl:justify-end">
              {user?._id && <NotificationBell userId={user._id} role={user.role} />}
            </div>

            <AvatarMenu displayName={displayName} roleLabel="Driver" image={user?.image} />
          </div>
        </div>
      </nav>
    </header>
  );
}