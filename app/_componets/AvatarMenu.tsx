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
          className="
            h-10 w-10 rounded-full overflow-hidden
            flex items-center justify-center
            transition hover:scale-105
            focus:outline-none focus:ring-2 focus:ring-black/20
          "
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
            <div className="h-full w-full bg-gray-900 text-white font-bold text-sm flex items-center justify-center">
              {initials(displayName)}
            </div>
          )}
        </button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg">
        <div className="px-3 py-2">
          <div className="text-sm font-semibold text-gray-900 truncate">
            {displayName}
          </div>
          {roleLabel && (
            <div className="text-xs text-gray-500">{roleLabel}</div>
          )}
        </div>

        <DropdownMenuSeparator />

        <DropdownMenuItem onClick={() => router.push(profileHref)}>
          Profile
        </DropdownMenuItem>

        <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
