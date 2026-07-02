"use client";

import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/categories";

export default function Nav({
  onNavigate,
  isMobile = false,
}: {
  onNavigate?: () => void;
  isMobile?: boolean;
}) {
  return (
    <div className={isMobile ? "flex flex-col gap-2" : "hidden md:flex items-center gap-8"}>
      <Link
        href="/user/dashboard"
        onClick={onNavigate}
        className={`${isMobile ? "px-3 py-2 rounded-lg hover:bg-gray-100" : "text-sm font-medium text-gray-700 hover:text-green-600"} transition`}
      >
        Home
      </Link>

      <Link
        href="/user/orders"
        onClick={onNavigate}
        className={`${isMobile ? "px-3 py-2 rounded-lg hover:bg-gray-100" : "text-sm font-medium text-gray-700 hover:text-green-600"} transition`}
      >
        My orders
      </Link>

      {/* Desktop dropdown only */}
      {!isMobile && (
        <div className="relative group">
          <button className="flex items-center gap-1 text-sm font-medium text-gray-700 hover:text-green-600 transition">
            Categories <ChevronDown size={16} />
          </button>

          <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg opacity-0 group-hover:opacity-100 invisible group-hover:visible transition">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/user/category/${c.slug}`}
                className="block px-4 py-2 hover:bg-gray-100 rounded-lg"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Mobile categories list */}
      {isMobile && (
        <div className="mt-3">
          <p className="px-3 text-xs font-semibold text-gray-500">CATEGORIES</p>
          <div className="mt-2 flex flex-col gap-1">
            {CATEGORIES.map((c) => (
              <Link
                key={c.slug}
                href={`/user/category/${c.slug}`}
                onClick={onNavigate}
                className="px-3 py-2 rounded-lg text-sm hover:bg-gray-100"
              >
                {c.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}