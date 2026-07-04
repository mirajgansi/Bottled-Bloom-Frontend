"use client";

import * as React from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type AvatarMenuProps = {
  displayName: string;
  image?: string; // <-- user image path or full url
  profileHref?: string;
  roleLabel?: string;
  onLogout?: () => void;
};

function initials(name: string) {
  const n = (name || "").trim();
  if (!n) return "U";
  const parts = n.split(/\s+/);
  const first = parts[0]?.[0] ?? "";
  const second = parts.length > 1 ? parts[1]?.[0] ?? "" : parts[0]?.[1] ?? "";
  return (first + second).toUpperCase() || "U";
}

const API_BASE =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050";

function toImageUrl(path?: string) {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return `${API_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

export default function AvatarMenu({
  displayName,
  image,
  profileHref = "/driver/profile",
  roleLabel,
  onLogout,
}: AvatarMenuProps) {
  const router = useRouter();
  const { logout } = useAuth();

  const handleLogout = React.useCallback(() => {
    if (onLogout) return onLogout();
    logout();
  }, [onLogout, logout]);

  const imgSrc = image ? toImageUrl(image) : "";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="h-10 w-10 rounded-full overflow-hidden flex items-center justify-center transition-transform hover:scale-105 focus:outline-none"
          style={{
            border: "1px solid var(--border-strong)",
            boxShadow: "0 0 0 2px transparent",
          }}
          aria-label="Open user menu"
        >
          {image ? (
            <Image
              src={imgSrc}
              alt="Profile"
              width={40}
              height={40}
              className="h-full w-full object-cover"
            />
          ) : (
            <div
              className="h-full w-full font-bold text-sm flex items-center justify-center"
              style={{ backgroundColor: "var(--gold-primary)", color: "var(--text-on-gold)" }}
            >
              {initials(displayName)}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="w-44 rounded-xl border-none"
        style={{
          backgroundColor: "var(--bg-elevated)",
          boxShadow: "var(--shadow-deep)",
        }}
      >
        <div className="px-3 py-2">
          <div
            className="text-sm font-semibold truncate"
            style={{ color: "var(--text-primary)" }}
          >
            {displayName}
          </div>
          {roleLabel && (
            <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
              {roleLabel}
            </div>
          )}
        </div>

        <DropdownMenuSeparator style={{ backgroundColor: "var(--border-subtle)" }} />

        <DropdownMenuItem
          onClick={() => router.push(profileHref)}
          className="cursor-pointer focus:bg-[var(--bg-secondary)]"
          style={{ color: "var(--text-primary)" }}
        >
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem
          onClick={handleLogout}
          className="cursor-pointer focus:bg-[var(--bg-secondary)]"
          style={{ color: "#E57373" }}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}